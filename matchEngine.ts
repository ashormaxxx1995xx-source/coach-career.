import { Club, MatchEvent, MatchResult, MatchStats, Player, Tactics } from '../types/game';

export interface SimulationStep {
  minute: number;
  homeScore: number;
  awayScore: number;
  event: MatchEvent;
}

export function simulateMatch(
  homeClub: Club,
  awayClub: Club,
  homeSquad: Player[],
  awaySquad: Player[],
  homeTactics: Tactics,
  isUserHome: boolean
): MatchResult {
  // 1. Calculate squad ratings based on starting XI
  const homeStartingXI = homeSquad.filter(p => homeTactics.startingXI.includes(p.id));
  const effectiveHomeXI = homeStartingXI.length === 11 ? homeStartingXI : homeSquad.slice(0, 11);
  const homeAvgOvr = effectiveHomeXI.reduce((acc, p) => acc + p.ovr, 0) / 11;
  const homeAvgFitness = effectiveHomeXI.reduce((acc, p) => acc + p.fitness, 0) / 11;
  const homeAvgMorale = effectiveHomeXI.reduce((acc, p) => acc + p.morale, 0) / 11;

  const awayXI = awaySquad.slice(0, 11);
  const awayAvgOvr = awayXI.reduce((acc, p) => acc + p.ovr, 0) / 11;

  // Tactical modifiers
  let homeAttMod = 1.0;
  let homeDefMod = 1.0;
  let homePossMod = 1.0;

  if (homeTactics.playStyle === 'attacking') {
    homeAttMod = 1.25;
    homeDefMod = 0.85;
  } else if (homeTactics.playStyle === 'defensive') {
    homeAttMod = 0.8;
    homeDefMod = 1.3;
  } else if (homeTactics.playStyle === 'high_press') {
    homeAttMod = 1.15;
    homePossMod = 1.2;
    homeDefMod = 1.05;
  } else if (homeTactics.playStyle === 'counter') {
    homeAttMod = 1.1;
    homePossMod = 0.9;
    homeDefMod = 1.15;
  }

  // Home facility boost
  const stadiumFacilityLevel = homeClub.facilities.stadium.level;
  const homeAdvantage = 1.05 + (stadiumFacilityLevel * 0.02);

  // Power comparison
  const homePower = homeAvgOvr * homeAdvantage * (homeAvgFitness / 100) * (homeAvgMorale / 100) * homeAttMod;
  const awayPower = awayAvgOvr;

  const powerRatio = homePower / (homePower + awayPower);

  // Possession
  const basePoss = Math.round(powerRatio * 100 * homePossMod);
  const homePossession = Math.min(76, Math.max(28, basePoss));
  const awayPossession = 100 - homePossession;

  // Expected shots
  const homeShots = Math.max(3, Math.round((homePower / 12) + (Math.random() * 8) - 2));
  const awayShots = Math.max(2, Math.round((awayPower / 14) + (Math.random() * 7) - 2));

  const homeShotsOnTarget = Math.max(1, Math.min(homeShots, Math.round(homeShots * 0.45 + Math.random() * 2)));
  const awayShotsOnTarget = Math.max(1, Math.min(awayShots, Math.round(awayShots * 0.4 + Math.random() * 2)));

  // Events generation across 90 minutes
  const events: MatchEvent[] = [];
  let homeScore = 0;
  let awayScore = 0;

  // Goals calculation
  const homeGoalChances = Math.round(homeShotsOnTarget * 0.45);
  const awayGoalChances = Math.round(awayShotsOnTarget * 0.38 / homeDefMod);

  // Time stamps
  const eventMinutes = [12, 24, 38, 45, 56, 68, 77, 84, 90].sort(() => Math.random() - 0.5).slice(0, 7).sort((a, b) => a - b);

  // Pick potential scorers from forwards / midfielders
  const homeAttackers = effectiveHomeXI.filter(p => ['ST', 'RW', 'LW', 'CAM', 'CM'].includes(p.position));
  const homePool = homeAttackers.length > 0 ? homeAttackers : effectiveHomeXI;

  eventMinutes.forEach((min, idx) => {
    const isHomeEvent = Math.random() < powerRatio;
    const isGoal = (isHomeEvent && homeScore < homeGoalChances && Math.random() < 0.6) || 
                   (!isHomeEvent && awayScore < awayGoalChances && Math.random() < 0.5);

    if (isGoal) {
      if (isHomeEvent) {
        homeScore++;
        const scorer = homePool[Math.floor(Math.random() * homePool.length)];
        const assister = homePool.filter(p => p.id !== scorer.id)[0];
        events.push({
          minute: min,
          type: 'goal',
          textAr: `⚽ جووووول! تسديدة لا تصد ولا ترد من النجم ${scorer.arName} تسكن الشباك!`,
          textEn: `⚽ GOAL! Stunning strike by ${scorer.name} finding the top corner!`,
          isHome: true,
          playerName: isUserHome ? scorer.arName : scorer.name,
          assistName: assister ? (isUserHome ? assister.arName : assister.name) : undefined,
        });
      } else {
        awayScore++;
        const scorer = awaySquad[Math.floor(Math.random() * 5)] || { name: 'Away Striker', arName: 'مهاجم الخصم' };
        events.push({
          minute: min,
          type: 'goal',
          textAr: `⚽ هدف للخصم! هجمة منظمة تنتهي بكرة في الشباك عبر ${scorer.arName}.`,
          textEn: `⚽ Goal for the opponent! Clinical finish by ${scorer.name}.`,
          isHome: false,
          playerName: scorer.name,
        });
      }
    } else {
      // Chance, Save, Counter, or Card
      const roll = Math.random();
      if (roll < 0.35) {
        events.push({
          minute: min,
          type: 'chance',
          textAr: isHomeEvent ? `⚡ فرصة خطيرة وضغط هجومي كاسح لفريقك يمر بجوار القائم!` : `⚠️ هجمة خطيرة ومباغتة من الخصم كادت تباغت الدفاع!`,
          textEn: isHomeEvent ? `⚡ Dangerous attacking pressure, inches wide of the post!` : `⚠️ Opposition threat on goal deflected away!`,
          isHome: isHomeEvent,
        });
      } else if (roll < 0.65) {
        events.push({
          minute: min,
          type: 'save',
          textAr: isHomeEvent ? `🧤 تصدٍ أسطوري من حارس الخصم يحرم فريقك من هدف محقق!` : `🧤 حارس مرماك يتألق برد فعل بهلواني ينقذ الشباك!`,
          textEn: isHomeEvent ? `🧤 Heroic fingertip save denies your team a certain goal!` : `🧤 Your goalkeeper makes a crucial diving reflex save!`,
          isHome: isHomeEvent,
        });
      } else if (roll < 0.85) {
        events.push({
          minute: min,
          type: 'counter',
          textAr: isHomeEvent ? `🚀 هجمة مرتدة نموذجية وانطلاقة سريعة تربك دفاع الخصم!` : `🚨 مرتدة سريعة من الخصم ولكن التغطية الدفاعية في الموعد.`,
          textEn: isHomeEvent ? `🚀 Lightning counter-attack breaking through midfield lines!` : `🚨 Opponent counter-attack intercepted by solid defending!`,
          isHome: isHomeEvent,
        });
      } else {
        events.push({
          minute: min,
          type: 'yellow',
          textAr: `🟨 الحكم يشهر بطاقة صفراء بعد تدخل قوي في منتصف الميدان.`,
          textEn: `🟨 Yellow card shown following a tactical sliding tackle.`,
          isHome: isHomeEvent,
        });
      }
    }
  });

  // Calculate player ratings
  const playerRatings: Record<string, number> = {};
  effectiveHomeXI.forEach(p => {
    let r = 6.2 + Math.random() * 1.6;
    if (homeScore > awayScore) r += 0.8;
    if (homeScore < awayScore) r -= 0.6;
    if (events.some(e => e.type === 'goal' && e.playerName?.includes(p.name))) r += 1.8;
    playerRatings[p.id] = Math.min(10.0, Math.max(5.0, Math.round(r * 10) / 10));
  });

  // Determine MOTM
  let bestRating = 0;
  let motmName = effectiveHomeXI[0]?.name || 'Player';
  effectiveHomeXI.forEach(p => {
    if ((playerRatings[p.id] || 0) > bestRating) {
      bestRating = playerRatings[p.id];
      motmName = isUserHome ? p.arName : p.name;
    }
  });

  // Gate revenue calculation
  const attendanceRate = 0.72 + (stadiumFacilityLevel * 0.05);
  const attendance = Math.round(homeClub.stadiumCapacity * Math.min(1, attendanceRate));
  const ticketPrice = 18 + (homeClub.facilities.stands.level * 4);
  const gateIncome = attendance * ticketPrice;

  const homeStats: MatchStats = {
    score: homeScore,
    possession: homePossession,
    shots: homeShots,
    shotsOnTarget: homeShotsOnTarget,
    fouls: Math.floor(7 + Math.random() * 8),
    yellowCards: events.filter(e => e.type === 'yellow' && e.isHome).length,
    redCards: 0,
    corners: Math.floor(2 + Math.random() * 6),
  };

  const awayStats: MatchStats = {
    score: awayScore,
    possession: awayPossession,
    shots: awayShots,
    shotsOnTarget: awayShotsOnTarget,
    fouls: Math.floor(7 + Math.random() * 8),
    yellowCards: events.filter(e => e.type === 'yellow' && !e.isHome).length,
    redCards: 0,
    corners: Math.floor(2 + Math.random() * 5),
  };

  return {
    id: `match_${Date.now()}`,
    homeClub,
    awayClub,
    homeStats,
    awayStats,
    events,
    motmPlayerName: motmName,
    motmRating: bestRating || 8.2,
    playerRatings,
    attendance,
    gateIncome,
    date: new Date().toLocaleDateString(),
  };
}
