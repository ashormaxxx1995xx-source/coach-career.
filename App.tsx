import React, { useEffect, useState } from 'react';
import {
  Club,
  FacilityType,
  GameState,
  LeagueEntry,
  MatchResult,
  Player,
  Quest,
  SkillType,
  Tactics,
  TransferDeal,
  YouthProspect,
} from './types/game';
import { ENGLISH_CLUBS } from './data/clubs';
import { generateSquadForClub, INITIAL_TRANSFER_MARKET, INITIAL_YOUTH_PROSPECTS } from './data/players';
import { generateCoachQuests } from './data/quests';
import { loadGameState, saveGameState, clearGameState } from './utils/storage';
import { sound } from './utils/audio';

// Core UI Components
import { CinematicIntro } from './components/CinematicIntro';
import { ManagerCreationModal } from './components/ManagerCreationModal';
import { TopHeader } from './components/TopHeader';
import { DashboardGrid, DashboardSection } from './components/DashboardGrid';
import { MatchSimulationModal } from './components/MatchSimulationModal';
import { PESCelebrationModal } from './components/PESCelebrationModal';
import { PlayerDetailModal } from './components/PlayerDetailModal';
import { YouthAcademyModal } from './components/YouthAcademyModal';
import { FacilitiesModal } from './components/FacilitiesModal';
import { LevelsRoadmapModal } from './components/LevelsRoadmapModal';

// Views
import { SquadView } from './components/views/SquadView';
import { TacticsView } from './components/views/TacticsView';
import { TransfersView } from './components/views/TransfersView';
import { TableView } from './components/views/TableView';
import { FinancesView } from './components/views/FinancesView';
import { CareerView } from './components/views/CareerView';
import { TournamentsView } from './components/views/TournamentsView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeSection, setActiveSection] = useState<DashboardSection | null>(null);

  // Modals state
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [isYouthModalOpen, setIsYouthModalOpen] = useState(false);
  const [isFacilitiesModalOpen, setIsFacilitiesModalOpen] = useState(false);
  const [isLevelsModalOpen, setIsLevelsModalOpen] = useState(false);
  const [selectedPlayerForDetail, setSelectedPlayerForDetail] = useState<Player | null>(null);
  const [activePESDeal, setActivePESDeal] = useState<TransferDeal | null>(null);

  // Initialize or restore game from storage on mount
  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setGameState(saved);
      sound.enabled = saved.settings.soundEnabled;
      if (typeof document !== 'undefined') {
        document.documentElement.dir = saved.settings.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = saved.settings.language;
      }
    }
  }, []);

  // Auto-save on every state change
  useEffect(() => {
    if (gameState && gameState.hasStarted) {
      saveGameState(gameState);
    }
  }, [gameState]);

  // Create New Game Handler
  const handleStartNewCareer = (managerName: string, nationality: string, startingClub: Club) => {
    const initialSquad = generateSquadForClub(startingClub.id, startingClub.tier);
    const quests = generateCoachQuests();

    // Default Tactics (4-3-3)
    const initialTactics: Tactics = {
      formation: '4-3-3',
      playStyle: 'balanced',
      startingXI: initialSquad.slice(0, 11).map(p => p.id),
      bench: initialSquad.slice(11, 18).map(p => p.id),
      captainId: initialSquad[2]?.id || initialSquad[0].id,
      penaltyTakerId: initialSquad[10]?.id || initialSquad[0].id,
    };

    // Generate League Table entries for current tier
    const tierClubs = ENGLISH_CLUBS.filter(c => c.tier === startingClub.tier);
    const leagueEntries: LeagueEntry[] = tierClubs.map(c => ({
      clubId: c.id,
      clubName: c.name,
      clubArName: c.arName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      points: 0,
      form: [],
    }));

    const newState: GameState = {
      hasStarted: true,
      manager: {
        name: managerName,
        nationality,
        reputation: 25,
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        matchesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0,
        trophies: [],
        careerHistory: [{ season: 1, clubName: startingClub.name, finish: 'In Progress' }],
        boardConfidence: 85,
      },
      myClub: startingClub,
      squad: initialSquad,
      tactics: initialTactics,
      leagueTable: leagueEntries,
      currentMatchDay: 1,
      totalMatchDays: Math.max(10, tierClubs.length * 2 - 2),
      currentSeason: 1,
      transferMarket: [...INITIAL_TRANSFER_MARKET],
      youthProspects: [...INITIAL_YOUTH_PROSPECTS],
      quests,
      recentMatches: [],
      latestTransferDeal: null,
      settings: {
        language: 'ar',
        soundEnabled: true,
        simSpeed: 10,
      },
    };

    setGameState(newState);
    setIsSetupModalOpen(false);
  };

  // Toggle Language
  const toggleLanguage = () => {
    if (!gameState) return;
    const nextLang = gameState.settings.language === 'ar' ? 'en' : 'ar';
    const updated: GameState = {
      ...gameState,
      settings: { ...gameState.settings, language: nextLang },
    };
    setGameState(updated);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = nextLang;
    }
  };

  // Toggle Sound
  const toggleSound = () => {
    if (!gameState) return;
    const nextSound = !gameState.settings.soundEnabled;
    sound.enabled = nextSound;
    setGameState({
      ...gameState,
      settings: { ...gameState.settings, soundEnabled: nextSound },
    });
  };

  // Match Finished Handler
  const handleFinishMatch = (result: MatchResult) => {
    if (!gameState) return;

    const isWin = result.homeStats.score > result.awayStats.score;
    const isDraw = result.homeStats.score === result.awayStats.score;

    // 1. Update league table
    const updatedTable = gameState.leagueTable.map(entry => {
      if (entry.clubId === gameState.myClub.id) {
        return {
          ...entry,
          played: entry.played + 1,
          won: isWin ? entry.won + 1 : entry.won,
          drawn: isDraw ? entry.drawn + 1 : entry.drawn,
          lost: !isWin && !isDraw ? entry.lost + 1 : entry.lost,
          gf: entry.gf + result.homeStats.score,
          ga: entry.ga + result.awayStats.score,
          gd: entry.gd + (result.homeStats.score - result.awayStats.score),
          points: entry.points + (isWin ? 3 : isDraw ? 1 : 0),
          form: [...entry.form, isWin ? 'W' : isDraw ? 'D' : 'L'].slice(-5) as ('W' | 'D' | 'L')[],
        };
      }
      // Simulate opponent outcome in table
      if (entry.clubId === result.awayClub.id) {
        return {
          ...entry,
          played: entry.played + 1,
          won: !isWin && !isDraw ? entry.won + 1 : entry.won,
          drawn: isDraw ? entry.drawn + 1 : entry.drawn,
          lost: isWin ? entry.lost + 1 : entry.lost,
          gf: entry.gf + result.awayStats.score,
          ga: entry.ga + result.homeStats.score,
          gd: entry.gd + (result.awayStats.score - result.homeStats.score),
          points: entry.points + (!isWin && !isDraw ? 3 : isDraw ? 1 : 0),
          form: [...entry.form, !isWin && !isDraw ? 'W' : isDraw ? 'D' : 'L'].slice(-5) as ('W' | 'D' | 'L')[],
        };
      }
      return entry;
    });

    // 2. Gate income + win bonus added to club budget
    const matchBonus = isWin ? 15000 : isDraw ? 5000 : 0;
    const updatedBudget = gameState.myClub.budgetDollars + result.gateIncome + matchBonus;

    // 3. Squad fatigue and player rating update
    const updatedSquad = gameState.squad.map(player => {
      const isStarter = gameState.tactics.startingXI.includes(player.id);
      if (isStarter) {
        const rating = result.playerRatings[player.id] || 6.5;
        const currentStats = player.stats;
        return {
          ...player,
          fitness: Math.max(50, player.fitness - (100 - player.stamina) * 0.15 - 5),
          morale: isWin ? Math.min(100, player.morale + 6) : isDraw ? player.morale : Math.max(40, player.morale - 6),
          stats: {
            ...currentStats,
            appearances: currentStats.appearances + 1,
            avgRating: Math.round(((currentStats.avgRating * currentStats.appearances + rating) / (currentStats.appearances + 1)) * 10) / 10,
          },
        };
      } else {
        // Bench recovers fitness
        return {
          ...player,
          fitness: Math.min(100, player.fitness + 12),
        };
      }
    });

    // 4. Update Manager XP and Quest checks
    const xpGained = isWin ? 50 : isDraw ? 25 : 10;
    let newXp = gameState.manager.xp + xpGained;
    let newLevel = gameState.manager.level;
    let newXpToNext = gameState.manager.xpToNextLevel;

    if (newXp >= newXpToNext && newLevel < 100) {
      newLevel++;
      newXp = newXp - newXpToNext;
      newXpToNext = Math.round(newXpToNext * 1.2);
    }

    // Update quest completion
    const updatedQuests = gameState.quests.map(q => {
      if (q.level <= newLevel) {
        return { ...q, isCompleted: true };
      }
      return q;
    });

    // Board confidence
    const newConfidence = Math.min(100, Math.max(10, gameState.manager.boardConfidence + (isWin ? 5 : isDraw ? 0 : -6)));

    // Next matchday or End of season
    let nextMatchDay = gameState.currentMatchDay + 1;
    let nextSeason = gameState.currentSeason;

    if (nextMatchDay > gameState.totalMatchDays) {
      // Season completed rollover
      nextMatchDay = 1;
      nextSeason++;
      sound.playTransferSuccess();
    }

    setGameState({
      ...gameState,
      myClub: {
        ...gameState.myClub,
        budgetDollars: updatedBudget,
      },
      squad: updatedSquad,
      leagueTable: updatedTable,
      currentMatchDay: nextMatchDay,
      currentSeason: nextSeason,
      manager: {
        ...gameState.manager,
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpToNext,
        matchesPlayed: gameState.manager.matchesPlayed + 1,
        wins: isWin ? gameState.manager.wins + 1 : gameState.manager.wins,
        draws: isDraw ? gameState.manager.draws + 1 : gameState.manager.draws,
        losses: !isWin && !isDraw ? gameState.manager.losses + 1 : gameState.manager.losses,
        goalsScored: gameState.manager.goalsScored + result.homeStats.score,
        goalsConceded: gameState.manager.goalsConceded + result.awayStats.score,
        reputation: Math.min(100, gameState.manager.reputation + (isWin ? 2 : isDraw ? 0 : -1)),
        boardConfidence: newConfidence,
      },
      quests: updatedQuests,
      recentMatches: [result, ...gameState.recentMatches.slice(0, 9)],
    });

    setIsMatchModalOpen(false);
  };

  // Buy Player Transfer Handler (triggers PES 2012 celebration)
  const handleBuyPlayer = (player: Player, fee: number, wage: number, years: number) => {
    if (!gameState) return;

    const newSquad = [...gameState.squad, { ...player, wage, contractYears: years }];
    const newMarket = gameState.transferMarket.filter(p => p.id !== player.id);
    const newBudget = gameState.myClub.budgetDollars - fee;

    const deal: TransferDeal = {
      id: `deal_${Date.now()}`,
      player,
      fromClub: 'Former Club',
      fromClubAr: 'النادي السابق',
      toClub: gameState.myClub.name,
      toClubAr: gameState.myClub.arName,
      fee,
      wage,
      years,
      timestamp: Date.now(),
    };

    setGameState({
      ...gameState,
      myClub: { ...gameState.myClub, budgetDollars: newBudget },
      squad: newSquad,
      transferMarket: newMarket,
      latestTransferDeal: deal,
    });

    setActivePESDeal(deal);
  };

  // Sell Player Handler
  const handleSellPlayer = (player: Player, offerPrice: number) => {
    if (!gameState) return;
    if (gameState.squad.length <= 16) {
      alert(gameState.settings.language === 'ar' ? 'لا يمكن بيع اللاعب! يجب الاحتفاظ بـ 16 لاعباً على الأقل في القائمة.' : 'Cannot sell player! Squad must have at least 16 players.');
      return;
    }

    const newSquad = gameState.squad.filter(p => p.id !== player.id);
    const newBudget = gameState.myClub.budgetDollars + offerPrice;

    setGameState({
      ...gameState,
      myClub: { ...gameState.myClub, budgetDollars: newBudget },
      squad: newSquad,
    });
  };

  // Scout & Promote Wonderkid with KORO
  const handleScoutAndPromote = (prospect: YouthProspect) => {
    if (!gameState) return;

    const newPlayer: Player = {
      id: `youth_${Date.now()}`,
      name: prospect.name,
      arName: prospect.arName,
      age: prospect.age,
      nationality: 'England',
      nationalityCode: 'GB-ENG',
      position: prospect.position,
      ovr: prospect.ovr,
      potential: prospect.potential,
      pace: prospect.pace,
      shooting: prospect.shooting,
      passing: prospect.passing,
      dribbling: prospect.dribbling,
      defending: prospect.defending,
      physical: prospect.physical,
      stamina: prospect.stamina,
      fitness: 100,
      morale: 95,
      marketValue: Math.round(Math.pow(prospect.ovr, 2.7) * 28),
      wage: 650,
      contractYears: 4,
      injuryWeeks: 0,
      stats: { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, avgRating: 0 },
      avatarSeed: `wonderkid_${Date.now()}`,
    };

    const newKoro = gameState.myClub.balanceKoro - prospect.scoutCostKoro;
    const newDollars = gameState.myClub.budgetDollars - prospect.signCostDollars;
    const updatedProspects = gameState.youthProspects.filter(p => p.id !== prospect.id);

    setGameState({
      ...gameState,
      myClub: {
        ...gameState.myClub,
        balanceKoro: newKoro,
        budgetDollars: newDollars,
      },
      squad: [...gameState.squad, newPlayer],
      youthProspects: updatedProspects,
    });

    setIsYouthModalOpen(false);
  };

  // Facility Upgrade Handler
  const handleUpgradeFacility = (facType: FacilityType) => {
    if (!gameState) return;
    const fac = gameState.myClub.facilities[facType];
    const cost = Math.round(fac.costDollars * Math.pow(1.6, fac.level - 1));

    if (gameState.myClub.budgetDollars < cost) return;

    const updatedFacilities = {
      ...gameState.myClub.facilities,
      [facType]: {
        ...fac,
        level: fac.level + 1,
      },
    };

    setGameState({
      ...gameState,
      myClub: {
        ...gameState.myClub,
        budgetDollars: gameState.myClub.budgetDollars - cost,
        facilities: updatedFacilities,
      },
    });
  };

  // Individual Training Handler
  const handleSetTraining = (playerId: string, skill: SkillType) => {
    if (!gameState) return;
    const updatedSquad = gameState.squad.map(p => {
      if (p.id === playerId) {
        const boost = Math.min(99, (p[skill] as number) + 1);
        const newOvr = Math.min(p.potential, Math.max(p.ovr, Math.round((p.ovr + boost) / 2)));
        return {
          ...p,
          trainingFocus: skill,
          [skill]: boost,
          ovr: newOvr,
        };
      }
      return p;
    });

    setGameState({
      ...gameState,
      squad: updatedSquad,
    });

    setSelectedPlayerForDetail(null);
  };

  // Renew Contract Handler
  const handleRenewContract = (playerId: string) => {
    if (!gameState) return;
    const player = gameState.squad.find(p => p.id === playerId);
    if (!player) return;

    const cost = Math.round(player.wage * 25);
    if (gameState.myClub.budgetDollars < cost) return;

    const updatedSquad = gameState.squad.map(p => {
      if (p.id === playerId) {
        return { ...p, contractYears: p.contractYears + 1, morale: Math.min(100, p.morale + 10) };
      }
      return p;
    });

    setGameState({
      ...gameState,
      myClub: { ...gameState.myClub, budgetDollars: gameState.myClub.budgetDollars - cost },
      squad: updatedSquad,
    });

    setSelectedPlayerForDetail(null);
  };

  // Claim Coach Level Reward (One-Time Protection)
  const handleClaimReward = (questId: string) => {
    if (!gameState) return;
    const quest = gameState.quests.find(q => q.id === questId);
    if (!quest || quest.isClaimed || !quest.isCompleted) return;

    let newDollars = gameState.myClub.budgetDollars;
    let newKoro = gameState.myClub.balanceKoro;

    if (quest.rewardType === 'dollars') {
      newDollars += quest.rewardValue;
    } else if (quest.rewardType === 'koro') {
      newKoro += quest.rewardValue;
    }

    const updatedQuests = gameState.quests.map(q => {
      if (q.id === questId) {
        return { ...q, isClaimed: true };
      }
      return q;
    });

    setGameState({
      ...gameState,
      myClub: {
        ...gameState.myClub,
        budgetDollars: newDollars,
        balanceKoro: newKoro,
      },
      quests: updatedQuests,
    });
  };

  // Reset Career
  const handleResetCareer = () => {
    clearGameState();
    setGameState(null);
    setActiveSection(null);
  };

  // If game has not started yet, show Cinematic Intro screen
  if (!gameState || !gameState.hasStarted) {
    const saved = loadGameState();
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between">
        <CinematicIntro
          onStartGame={() => setIsSetupModalOpen(true)}
          isArabic={true}
          onToggleLanguage={() => {}}
          hasSavedGame={!!saved}
          onContinueGame={() => {
            if (saved) setGameState(saved);
          }}
        />

        <ManagerCreationModal
          isOpen={isSetupModalOpen}
          isArabic={true}
          onConfirm={handleStartNewCareer}
          onCancel={() => setIsSetupModalOpen(false)}
        />
      </div>
    );
  }

  const isArabic = gameState.settings.language === 'ar';
  const tierClubs = ENGLISH_CLUBS.filter(c => c.tier === gameState.myClub.tier);
  const nextOpponent = tierClubs.find(c => c.id !== gameState.myClub.id) || tierClubs[0];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-between">
      {/* Sticky Top Header */}
      <TopHeader
        myClub={gameState.myClub}
        manager={gameState.manager}
        currentSeason={gameState.currentSeason}
        currentMatchDay={gameState.currentMatchDay}
        isArabic={isArabic}
        onToggleLanguage={toggleLanguage}
        onOpenLevels={() => setIsLevelsModalOpen(true)}
        soundEnabled={gameState.settings.soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content Area: Dashboard or Deep Section Views */}
      <main className="flex-1 w-full">
        {activeSection === null && (
          <DashboardGrid
            isArabic={isArabic}
            myClub={gameState.myClub}
            manager={gameState.manager}
            squad={gameState.squad}
            nextOpponent={nextOpponent}
            onOpenSection={(sec) => {
              if (sec === 'match') setIsMatchModalOpen(true);
              else if (sec === 'youth') setIsYouthModalOpen(true);
              else if (sec === 'facilities') setIsFacilitiesModalOpen(true);
              else if (sec === 'quests') setIsLevelsModalOpen(true);
              else setActiveSection(sec);
            }}
          />
        )}

        {activeSection === 'squad' && (
          <SquadView
            isArabic={isArabic}
            squad={gameState.squad}
            onSelectPlayer={(p) => setSelectedPlayerForDetail(p)}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'tactics' && (
          <TacticsView
            isArabic={isArabic}
            squad={gameState.squad}
            tactics={gameState.tactics}
            onUpdateTactics={(newT) => setGameState({ ...gameState, tactics: newT })}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'transfers' && (
          <TransfersView
            isArabic={isArabic}
            myClub={gameState.myClub}
            transferMarket={gameState.transferMarket}
            mySquad={gameState.squad}
            onBuyPlayer={handleBuyPlayer}
            onSellPlayer={handleSellPlayer}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'table' && (
          <TableView
            isArabic={isArabic}
            myClub={gameState.myClub}
            leagueTable={gameState.leagueTable}
            currentMatchDay={gameState.currentMatchDay}
            totalMatchDays={gameState.totalMatchDays}
            currentSeason={gameState.currentSeason}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'finances' && (
          <FinancesView
            isArabic={isArabic}
            myClub={gameState.myClub}
            squad={gameState.squad}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'career' && (
          <CareerView
            isArabic={isArabic}
            myClub={gameState.myClub}
            manager={gameState.manager}
            currentSeason={gameState.currentSeason}
            onAcceptJobOffer={(newClubId) => {
              const targetClub = ENGLISH_CLUBS.find(c => c.id === newClubId);
              if (targetClub) {
                const newSquad = generateSquadForClub(targetClub.id, targetClub.tier);
                setGameState({
                  ...gameState,
                  myClub: targetClub,
                  squad: newSquad,
                  tactics: {
                    ...gameState.tactics,
                    startingXI: newSquad.slice(0, 11).map(p => p.id),
                    bench: newSquad.slice(11, 18).map(p => p.id),
                  },
                });
                setActiveSection(null);
              }
            }}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'tournaments' && (
          <TournamentsView
            isArabic={isArabic}
            myClub={gameState.myClub}
            onBack={() => setActiveSection(null)}
          />
        )}

        {activeSection === 'settings' && (
          <SettingsView
            isArabic={isArabic}
            settings={gameState.settings}
            gameState={gameState}
            onUpdateSettings={(newSettings) => setGameState({ ...gameState, settings: newSettings })}
            onResetCareer={handleResetCareer}
            onBack={() => setActiveSection(null)}
          />
        )}
      </main>

      {/* Global Interactive Modals */}
      <MatchSimulationModal
        isOpen={isMatchModalOpen}
        isArabic={isArabic}
        myClub={gameState.myClub}
        opponentClub={nextOpponent}
        mySquad={gameState.squad}
        opponentSquad={generateSquadForClub(nextOpponent.id, nextOpponent.tier)}
        tactics={gameState.tactics}
        simDurationSec={gameState.settings.simSpeed}
        onChangeSimDuration={(sec) => setGameState({ ...gameState, settings: { ...gameState.settings, simSpeed: sec } })}
        onFinishMatch={handleFinishMatch}
        onClose={() => setIsMatchModalOpen(false)}
      />

      <PESCelebrationModal
        deal={activePESDeal}
        isArabic={isArabic}
        onClose={() => setActivePESDeal(null)}
      />

      <PlayerDetailModal
        player={selectedPlayerForDetail}
        isArabic={isArabic}
        trainingFacilityLevel={gameState.myClub.facilities.trainingGround.level}
        clubBudget={gameState.myClub.budgetDollars}
        onClose={() => setSelectedPlayerForDetail(null)}
        onSetTraining={handleSetTraining}
        onRenewContract={handleRenewContract}
        onToggleTransferList={() => {}}
      />

      <YouthAcademyModal
        isOpen={isYouthModalOpen}
        isArabic={isArabic}
        koroBalance={gameState.myClub.balanceKoro}
        dollarBalance={gameState.myClub.budgetDollars}
        prospects={gameState.youthProspects}
        onScoutAndPromote={handleScoutAndPromote}
        onRefreshScoutPool={() => {
          setGameState({
            ...gameState,
            myClub: { ...gameState.myClub, balanceKoro: gameState.myClub.balanceKoro - 30 },
            youthProspects: [...INITIAL_YOUTH_PROSPECTS],
          });
        }}
        onClose={() => setIsYouthModalOpen(false)}
      />

      <FacilitiesModal
        isOpen={isFacilitiesModalOpen}
        isArabic={isArabic}
        myClub={gameState.myClub}
        onUpgradeFacility={handleUpgradeFacility}
        onClose={() => setIsFacilitiesModalOpen(false)}
      />

      <LevelsRoadmapModal
        isOpen={isLevelsModalOpen}
        isArabic={isArabic}
        manager={gameState.manager}
        quests={gameState.quests}
        onClaimReward={handleClaimReward}
        onClose={() => setIsLevelsModalOpen(false)}
      />
    </div>
  );
}
