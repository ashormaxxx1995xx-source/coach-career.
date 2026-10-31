export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'RW' | 'LW' | 'ST';

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  avgRating: number;
}

export type SkillType = 'pace' | 'shooting' | 'passing' | 'dribbling' | 'defending' | 'physical' | 'stamina';

export interface Player {
  id: string;
  name: string;
  arName: string;
  age: number;
  nationality: string;
  nationalityCode: string;
  position: Position;
  ovr: number;
  potential: number;
  
  // Specific attributes (1 - 99)
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  stamina: number;
  
  // Dynamic status
  fitness: number; // 0 - 100%
  morale: number; // 0 - 100%
  marketValue: number; // in $
  wage: number; // weekly in $
  contractYears: number;
  injuryWeeks: number; // 0 = healthy
  
  trainingFocus?: SkillType;
  trainingProgress?: number; // 0 - 100%
  
  stats: PlayerStats;
  avatarSeed: string;
  isCaptain?: boolean;
}

export type Formation = '4-3-3' | '4-4-2' | '4-2-3-1' | '3-5-2' | '4-1-4-1';
export type PlayStyle = 'attacking' | 'balanced' | 'defensive' | 'counter' | 'high_press';

export interface Tactics {
  formation: Formation;
  playStyle: PlayStyle;
  startingXI: string[]; // 11 Player IDs
  bench: string[]; // up to 7 Player IDs
  captainId: string;
  penaltyTakerId: string;
}

export type FacilityType = 
  | 'stadium' 
  | 'stands' 
  | 'lighting' 
  | 'dressingRooms' 
  | 'trainingGround' 
  | 'gym' 
  | 'medicalClinic' 
  | 'scoutingHub' 
  | 'youthAcademy' 
  | 'clubStore';

export interface Facility {
  id: FacilityType;
  nameEn: string;
  nameAr: string;
  level: number; // 1 to 5
  maxLevel: number;
  costDollars: number;
  perkEn: string;
  perkAr: string;
  iconName: string;
}

export interface Club {
  id: string;
  name: string;
  arName: string;
  tier: number; // 1: Premier League, 2: Championship, 3: League One, 4: League Two, 5: National League
  divisionNameEn: string;
  divisionNameAr: string;
  stadiumName: string;
  stadiumCapacity: number;
  crestIcon: string;
  primaryColor: string;
  secondaryColor: string;
  budgetDollars: number;
  balanceKoro: number;
  reputation: number; // 1 to 100
  facilities: Record<FacilityType, Facility>;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'chance' | 'counter' | 'save' | 'yellow' | 'red' | 'sub' | 'penalty';
  textAr: string;
  textEn: string;
  isHome: boolean;
  playerName?: string;
  assistName?: string;
}

export interface MatchStats {
  score: number;
  possession: number; // %
  shots: number;
  shotsOnTarget: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  corners: number;
}

export interface MatchResult {
  id: string;
  homeClub: Club;
  awayClub: Club;
  homeStats: MatchStats;
  awayStats: MatchStats;
  events: MatchEvent[];
  motmPlayerName: string;
  motmRating: number;
  playerRatings: Record<string, number>;
  attendance: number;
  gateIncome: number;
  date: string;
}

export interface LeagueEntry {
  clubId: string;
  clubName: string;
  clubArName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TransferDeal {
  id: string;
  player: Player;
  fromClub: string;
  fromClubAr: string;
  toClub: string;
  toClubAr: string;
  fee: number;
  wage: number;
  years: number;
  timestamp: number;
}

export interface YouthProspect {
  id: string;
  name: string;
  arName: string;
  age: number;
  position: Position;
  ovr: number;
  potential: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  stamina: number;
  scoutCostKoro: number;
  signCostDollars: number;
  specialTraitAr: string;
  specialTraitEn: string;
}

export interface Quest {
  id: string;
  level: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  rewardType: 'dollars' | 'koro' | 'wonderkid' | 'contract';
  rewardValue: number;
  rewardLabelAr: string;
  rewardLabelEn: string;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface ManagerProfile {
  name: string;
  nationality: string;
  reputation: number; // 1-100
  level: number; // 1-100
  xp: number;
  xpToNextLevel: number;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  trophies: string[];
  careerHistory: { season: number; clubName: string; finish: string; trophy?: string }[];
  boardConfidence: number; // 0-100%
}

export interface GameSettings {
  language: 'ar' | 'en';
  soundEnabled: boolean;
  simSpeed: 5 | 10 | 15; // in seconds
}

export interface GameState {
  hasStarted: boolean;
  manager: ManagerProfile;
  myClub: Club;
  squad: Player[];
  tactics: Tactics;
  leagueTable: LeagueEntry[];
  currentMatchDay: number;
  totalMatchDays: number;
  currentSeason: number;
  transferMarket: Player[];
  youthProspects: YouthProspect[];
  quests: Quest[];
  recentMatches: MatchResult[];
  latestTransferDeal: TransferDeal | null;
  settings: GameSettings;
}
