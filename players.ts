import { Player, Position, YouthProspect } from '../types/game';

// Realistic name pools
const FIRST_NAMES_EN = [
  'Jack', 'Harry', 'Oliver', 'Liam', 'Noah', 'Callum', 'George', 'Charlie', 'James', 'Alfie',
  'Mason', 'Ethan', 'Lucas', 'Leo', 'Arthur', 'Oscar', 'Theo', 'Freddie', 'Archie', 'Finlay',
  'Tariq', 'Mateo', 'Marcus', 'Declan', 'Kieran', 'Harvey', 'Rhys', 'Dan', 'Lewis', 'Elliot'
];

const LAST_NAMES_EN = [
  'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright',
  'Thompson', 'Evans', 'Walker', 'White', 'Roberts', 'Green', 'Hall', 'Thomas', 'Clarke', 'Jackson',
  'Wood', 'Harris', 'Martin', 'Cooper', 'King', 'Ward', 'Turner', 'Baker', 'Hughes', 'Phillips'
];

const FIRST_NAMES_AR = [
  'جاك', 'هاري', 'أوليفر', 'ليام', 'نوح', 'كالوم', 'جورج', 'تشارلي', 'جيمس', 'ألفي',
  'ميسون', 'إيثان', 'لوكاس', 'ليو', 'آرثر', 'أوسكار', 'ثيو', 'فريدي', 'آرتشي', 'فينلي',
  'طارق', 'ماتيو', 'ماركوس', 'ديكلان', 'كيران', 'هارفي', 'ريس', 'دان', 'لويس', 'إليوت'
];

const LAST_NAMES_AR = [
  'سميث', 'جونز', 'تايلور', 'براون', 'ويليامز', 'ويلسون', 'جونسون', 'ديفيز', 'روبنسون', 'رايت',
  'طومسون', 'إيفانز', 'ووكر', 'وايت', 'روبرتس', 'جرين', 'هول', 'توماس', 'كلارك', 'جاكسون',
  'وود', 'هاريس', 'مارتن', 'كوبر', 'كينغ', 'وارد', 'تيرنر', 'بيكر', 'هيوز', 'فيليبس'
];

const POSITIONS_DISTRIBUTION: Position[] = [
  'GK', 'GK',
  'CB', 'CB', 'CB', 'CB',
  'LB', 'LB',
  'RB', 'RB',
  'CDM', 'CDM',
  'CM', 'CM', 'CM',
  'CAM',
  'LW', 'RW',
  'ST', 'ST', 'ST', 'ST'
];

export function generateSquadForClub(clubId: string, baseTier: number = 5): Player[] {
  // Base overall depends on tier: Tier 5 is ~58-64, Tier 1 is ~80-88
  const baseOvrMin = baseTier === 5 ? 58 : baseTier === 4 ? 64 : baseTier === 3 ? 69 : baseTier === 2 ? 75 : 82;
  const baseOvrMax = baseOvrMin + 6;

  return POSITIONS_DISTRIBUTION.map((pos, idx) => {
    const fnIdx = (idx * 7 + clubId.charCodeAt(clubId.length - 1)) % FIRST_NAMES_EN.length;
    const lnIdx = (idx * 13 + clubId.charCodeAt(0)) % LAST_NAMES_EN.length;
    const name = `${FIRST_NAMES_EN[fnIdx]} ${LAST_NAMES_EN[lnIdx]}`;
    const arName = `${FIRST_NAMES_AR[fnIdx]} ${LAST_NAMES_AR[lnIdx]}`;
    
    // Ages 19 to 32
    const age = 19 + ((idx * 3 + clubId.length) % 14);
    
    // OVR calculation
    const ovrOffset = Math.floor((Math.sin(idx + clubId.length) + 1) * 3);
    const ovr = Math.min(99, Math.max(50, baseOvrMin + ovrOffset));
    
    // Younger players have higher potential
    const upside = age <= 23 ? 7 + ((idx * 2) % 8) : age <= 27 ? 3 : 0;
    const potential = Math.min(99, ovr + upside);

    // Attribute distribution based on position
    let pace = 60;
    let shooting = 50;
    let passing = 55;
    let dribbling = 55;
    let defending = 50;
    let physical = 60;
    const stamina = 70 + ((idx * 4) % 25);

    if (pos === 'GK') {
      defending = ovr + 2;
      physical = ovr - 2;
      pace = 50;
      shooting = 30;
      passing = 55;
      dribbling = 40;
    } else if (pos === 'CB') {
      defending = ovr + 4;
      physical = ovr + 3;
      pace = ovr - 6;
      shooting = 40;
      passing = 52;
      dribbling = 48;
    } else if (pos === 'LB' || pos === 'RB') {
      pace = ovr + 5;
      defending = ovr;
      passing = ovr - 2;
      dribbling = ovr;
      shooting = 45;
      physical = ovr - 1;
    } else if (pos === 'CDM') {
      defending = ovr + 2;
      passing = ovr + 1;
      physical = ovr + 3;
      pace = ovr - 3;
      shooting = 52;
      dribbling = ovr - 1;
    } else if (pos === 'CM' || pos === 'CAM') {
      passing = ovr + 4;
      dribbling = ovr + 3;
      shooting = ovr;
      pace = ovr - 1;
      defending = pos === 'CAM' ? 45 : ovr - 2;
      physical = ovr - 1;
    } else if (pos === 'RW' || pos === 'LW') {
      pace = ovr + 8;
      dribbling = ovr + 4;
      shooting = ovr + 1;
      passing = ovr;
      defending = 38;
      physical = ovr - 4;
    } else if (pos === 'ST') {
      shooting = ovr + 6;
      pace = ovr + 2;
      physical = ovr + 2;
      dribbling = ovr;
      passing = ovr - 4;
      defending = 35;
    }

    const wage = Math.round((ovr * ovr * 0.45 * (6 - baseTier)) / 10) * 10;
    const marketValue = Math.round((Math.pow(ovr, 2.7) * (upside > 5 ? 1.4 : 1) * 20) / 1000) * 1000;

    return {
      id: `${clubId}_p_${idx}`,
      name,
      arName,
      age,
      nationality: 'England',
      nationalityCode: 'GB-ENG',
      position: pos,
      ovr,
      potential,
      pace: Math.min(99, Math.max(35, pace)),
      shooting: Math.min(99, Math.max(30, shooting)),
      passing: Math.min(99, Math.max(35, passing)),
      dribbling: Math.min(99, Math.max(35, dribbling)),
      defending: Math.min(99, Math.max(25, defending)),
      physical: Math.min(99, Math.max(35, physical)),
      stamina: Math.min(99, Math.max(50, stamina)),
      fitness: 95 + (idx % 6),
      morale: 85,
      marketValue,
      wage: Math.max(350, wage),
      contractYears: 2 + (idx % 3),
      injuryWeeks: 0,
      trainingFocus: undefined,
      trainingProgress: 0,
      stats: {
        appearances: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0,
        avgRating: 0,
      },
      avatarSeed: `${clubId}_${idx}`,
      isCaptain: idx === 2, // 3rd player default captain
    };
  });
}

// Initial scouting pool for Youth Academy using KORO
export const INITIAL_YOUTH_PROSPECTS: YouthProspect[] = [
  {
    id: 'youth_1',
    name: 'Kobe Bellingham',
    arName: 'كوبي بيلينجهام',
    age: 16,
    position: 'CAM',
    ovr: 63,
    potential: 89,
    pace: 75,
    shooting: 66,
    passing: 72,
    dribbling: 74,
    defending: 48,
    physical: 65,
    stamina: 80,
    scoutCostKoro: 85,
    signCostDollars: 45000,
    specialTraitAr: 'صانع ألعاب استثنائي ورؤية ساحرة للملعب',
    specialTraitEn: 'Visionary playmaker with sublime first touch',
  },
  {
    id: 'youth_2',
    name: 'Leo Alvarez',
    arName: 'ليو ألفاريز',
    age: 17,
    position: 'ST',
    ovr: 64,
    potential: 87,
    pace: 82,
    shooting: 70,
    passing: 58,
    dribbling: 71,
    defending: 32,
    physical: 68,
    stamina: 82,
    scoutCostKoro: 90,
    signCostDollars: 52000,
    specialTraitAr: 'حاسة تهديفية قاتلة وإنهاء هجمات بدم بارد',
    specialTraitEn: 'Lethal clinical finisher inside penalty box',
  },
  {
    id: 'youth_3',
    name: 'Archie Ferguson',
    arName: 'آرتشي فيرجسون',
    age: 16,
    position: 'CB',
    ovr: 61,
    potential: 85,
    pace: 67,
    shooting: 35,
    passing: 62,
    dribbling: 54,
    defending: 71,
    physical: 76,
    stamina: 78,
    scoutCostKoro: 70,
    signCostDollars: 38000,
    specialTraitAr: 'جدار دفاعي وقوة ارتقاء هوائي خارقة',
    specialTraitEn: 'Towering aerial presence & tough tackler',
  },
  {
    id: 'youth_4',
    name: 'Noah Sterling',
    arName: 'نوح ستيرلينغ',
    age: 17,
    position: 'RW',
    ovr: 62,
    potential: 84,
    pace: 86,
    shooting: 62,
    passing: 64,
    dribbling: 75,
    defending: 36,
    physical: 58,
    stamina: 76,
    scoutCostKoro: 75,
    signCostDollars: 42000,
    specialTraitAr: 'سرعة البرق ومراوغات فردية تربك الخصوم',
    specialTraitEn: 'Lightning acceleration and 1v1 trickery',
  },
  {
    id: 'youth_5',
    name: 'Tariq Al-Mansour',
    arName: 'طارق المنصور',
    age: 16,
    position: 'CDM',
    ovr: 60,
    potential: 86,
    pace: 69,
    shooting: 54,
    passing: 68,
    dribbling: 66,
    defending: 68,
    physical: 74,
    stamina: 84,
    scoutCostKoro: 80,
    signCostDollars: 40000,
    specialTraitAr: 'قاطع كرات حديدي وقدرة قراءة مسار التمريرات',
    specialTraitEn: 'Relentless ball-winner with tactical maturity',
  },
  {
    id: 'youth_6',
    name: 'Hugo Lloris Jr',
    arName: 'هوغو لوريس جونيور',
    age: 17,
    position: 'GK',
    ovr: 62,
    potential: 85,
    pace: 52,
    shooting: 30,
    passing: 60,
    dribbling: 45,
    defending: 73,
    physical: 70,
    stamina: 80,
    scoutCostKoro: 75,
    signCostDollars: 35000,
    specialTraitAr: 'ردود فعل بهلوانية وسرعة تصدي للكرات الصعبة',
    specialTraitEn: 'Cat-like reflex saves in tight angles',
  },
];

// Initial Transfer Market targets across different price points
export const INITIAL_TRANSFER_MARKET: Player[] = [
  {
    id: 'tm_1',
    name: 'Callum Hudson',
    arName: 'كالوم هدسون',
    age: 23,
    nationality: 'England',
    nationalityCode: 'GB-ENG',
    position: 'LW',
    ovr: 68,
    potential: 76,
    pace: 84,
    shooting: 67,
    passing: 66,
    dribbling: 75,
    defending: 40,
    physical: 62,
    stamina: 78,
    fitness: 98,
    morale: 90,
    marketValue: 240000,
    wage: 2100,
    contractYears: 2,
    injuryWeeks: 0,
    stats: { appearances: 14, goals: 5, assists: 3, cleanSheets: 0, yellowCards: 1, redCards: 0, avgRating: 7.2 },
    avatarSeed: 'tm_1',
  },
  {
    id: 'tm_2',
    name: 'Mateo Kovac',
    arName: 'ماتيو كوفاتش',
    age: 24,
    nationality: 'Croatia',
    nationalityCode: 'HR',
    position: 'CM',
    ovr: 69,
    potential: 77,
    pace: 68,
    shooting: 64,
    passing: 76,
    dribbling: 72,
    defending: 64,
    physical: 69,
    stamina: 82,
    fitness: 96,
    morale: 88,
    marketValue: 280000,
    wage: 2500,
    contractYears: 1,
    injuryWeeks: 0,
    stats: { appearances: 18, goals: 2, assists: 6, cleanSheets: 0, yellowCards: 2, redCards: 0, avgRating: 7.3 },
    avatarSeed: 'tm_2',
  },
  {
    id: 'tm_3',
    name: 'Nathaniel Aké',
    arName: 'ناثانيال آكي',
    age: 26,
    nationality: 'Netherlands',
    nationalityCode: 'NL',
    position: 'CB',
    ovr: 71,
    potential: 75,
    pace: 71,
    shooting: 44,
    passing: 65,
    dribbling: 60,
    defending: 76,
    physical: 78,
    stamina: 80,
    fitness: 94,
    morale: 85,
    marketValue: 390000,
    wage: 3200,
    contractYears: 3,
    injuryWeeks: 0,
    stats: { appearances: 16, goals: 1, assists: 0, cleanSheets: 5, yellowCards: 3, redCards: 0, avgRating: 7.1 },
    avatarSeed: 'tm_3',
  },
  {
    id: 'tm_4',
    name: 'Gabriel Barbosa Jr',
    arName: 'جابرييل باربوسا جونيور',
    age: 22,
    nationality: 'Brazil',
    nationalityCode: 'BR',
    position: 'ST',
    ovr: 70,
    potential: 80,
    pace: 81,
    shooting: 75,
    passing: 62,
    dribbling: 73,
    defending: 36,
    physical: 72,
    stamina: 79,
    fitness: 100,
    morale: 92,
    marketValue: 360000,
    wage: 2900,
    contractYears: 2,
    injuryWeeks: 0,
    stats: { appearances: 12, goals: 7, assists: 2, cleanSheets: 0, yellowCards: 1, redCards: 0, avgRating: 7.5 },
    avatarSeed: 'tm_4',
  },
  {
    id: 'tm_5',
    name: 'Liam Henderson',
    arName: 'ليام هندرسون',
    age: 21,
    nationality: 'Scotland',
    nationalityCode: 'GB-SCT',
    position: 'RB',
    ovr: 66,
    potential: 75,
    pace: 79,
    shooting: 51,
    passing: 66,
    dribbling: 67,
    defending: 67,
    physical: 68,
    stamina: 84,
    fitness: 97,
    morale: 87,
    marketValue: 180000,
    wage: 1600,
    contractYears: 1,
    injuryWeeks: 0,
    stats: { appearances: 15, goals: 0, assists: 3, cleanSheets: 4, yellowCards: 2, redCards: 0, avgRating: 6.9 },
    avatarSeed: 'tm_5',
  },
  {
    id: 'tm_6',
    name: 'Oliver Kahn-Smith',
    arName: 'أوليفر كان سميث',
    age: 27,
    nationality: 'England',
    nationalityCode: 'GB-ENG',
    position: 'GK',
    ovr: 72,
    potential: 74,
    pace: 52,
    shooting: 30,
    passing: 62,
    dribbling: 48,
    defending: 78,
    physical: 74,
    stamina: 80,
    fitness: 99,
    morale: 90,
    marketValue: 420000,
    wage: 3500,
    contractYears: 2,
    injuryWeeks: 0,
    stats: { appearances: 20, goals: 0, assists: 0, cleanSheets: 8, yellowCards: 0, redCards: 0, avgRating: 7.4 },
    avatarSeed: 'tm_6',
  },
];
