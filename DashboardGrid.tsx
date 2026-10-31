import React from 'react';
import { Club, ManagerProfile, Player } from '../types/game';
import { sound } from '../utils/audio';
import {
  Users,
  Compass,
  Play,
  Shuffle,
  Dumbbell,
  GraduationCap,
  Building,
  DollarSign,
  Trophy,
  Award,
  Settings,
  Shield,
  Flame,
  Star,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export type DashboardSection =
  | 'squad'
  | 'tactics'
  | 'match'
  | 'transfers'
  | 'training'
  | 'youth'
  | 'facilities'
  | 'finances'
  | 'table'
  | 'tournaments'
  | 'career'
  | 'quests'
  | 'settings';

interface DashboardGridProps {
  isArabic: boolean;
  myClub: Club;
  manager: ManagerProfile;
  squad: Player[];
  nextOpponent: Club;
  onOpenSection: (section: DashboardSection) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  isArabic,
  myClub,
  manager,
  squad,
  nextOpponent,
  onOpenSection,
}) => {
  const handleClick = (sec: DashboardSection) => {
    sound.playClick();
    onOpenSection(sec);
  };

  const topScorer = [...squad].sort((a, b) => b.stats.goals - a.stats.goals)[0];
  const avgOvr = Math.round(squad.reduce((a, b) => a + b.ovr, 0) / squad.length);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Hero Matchday Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 sm:p-7 shadow-2xl mb-6">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>{isArabic ? 'المباراة القادمة في الدوري' : 'Upcoming Fixture'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isArabic ? `${myClub.arName} ضد ${nextOpponent.arName}` : `${myClub.name} vs ${nextOpponent.name}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              {isArabic
                ? `الملعب: ${myClub.stadiumName} · متوسط تقييم تشكيلتك: ${avgOvr} OVR · معنويات الفريق مرتفعة`
                : `Venue: ${myClub.stadiumName} · Squad Rating: ${avgOvr} OVR · High Team Morale`}
            </p>
          </div>

          <button
            onClick={() => handleClick('match')}
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base shadow-xl shadow-emerald-950/50 active:scale-95 transition flex items-center justify-center gap-2.5 cursor-pointer min-h-[52px]"
          >
            <Play className="w-5 h-5 fill-current text-white" />
            <span>{isArabic ? 'خوض المباراة التكتيكية' : 'Simulate Matchday'}</span>
          </button>
        </div>
      </div>

      {/* Modern Illustrated Bento Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Squad Card */}
        <button
          onClick={() => handleClick('squad')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {squad.length} {isArabic ? 'لاعباً' : 'Players'}
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition">
              {isArabic ? 'الفريق واللاعبين' : 'Squad & Roster'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'ملفات اللاعبين · الرواتب · الإحصائيات' : 'Player files, wages, stats & values'}
            </p>
          </div>
        </button>

        {/* 2. Tactics Card */}
        <button
          onClick={() => handleClick('tactics')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-teal-950/60 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-teal-400">4-3-3</span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-teal-400 transition">
              {isArabic ? 'التشكيلة والخطط' : 'Tactics & Formations'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'الـ 11 الأساسي · أسلوب اللعب · القائد' : 'Starting XI, style of play & captains'}
            </p>
          </div>
        </button>

        {/* 3. Transfer Market Card */}
        <button
          onClick={() => handleClick('transfers')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-amber-950/60 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition">
              <Shuffle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
              PES 2012
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-amber-400 transition">
              {isArabic ? 'سوق الانتقالات' : 'Transfer Market'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'شراء وبيع · تفاوض · احتفالية التوقيع' : 'Buy, sell, negotiate & cinematic deals'}
            </p>
          </div>
        </button>

        {/* 4. Youth Academy (KORO) Card */}
        <button
          onClick={() => handleClick('youth')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-purple-950/60 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-purple-300">
              {myClub.balanceKoro} KORO
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-purple-400 transition">
              {isArabic ? 'أكاديمية الناشئين' : 'Youth Academy'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'اكتشاف المواهب بالكورو وتصعيدهم' : 'Scout prodigies & promote to first team'}
            </p>
          </div>
        </button>

        {/* 5. Individual Training Card */}
        <button
          onClick={() => handleClick('training')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
              <Dumbbell className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Lv {myClub.facilities.trainingGround.level}
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition">
              {isArabic ? 'التدريب والتطوير' : 'Individual Training'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'تطوير السرعة والتسديد والتمرير' : 'Train pace, shooting, passing & fitness'}
            </p>
          </div>
        </button>

        {/* 6. Club Facilities Upgrades Card */}
        <button
          onClick={() => handleClick('facilities')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-blue-950/60 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition">
              <Building className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-blue-300">10 {isArabic ? 'مرافق' : 'Perks'}</span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-blue-400 transition">
              {isArabic ? 'تطوير النادي' : 'Club Facilities'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'الملعب · الصالة · المركز الطبي' : 'Stadium, gym, medical center & pitch'}
            </p>
          </div>
        </button>

        {/* 7. League Table Card */}
        <button
          onClick={() => handleClick('table')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 group-hover:scale-105 transition">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              Tier {myClub.tier}
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-amber-400 transition">
              {isArabic ? 'جدول الدوري والترتيب' : 'League Table'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'النقاط · الصعود والهبوط · النتائج' : 'Points, goal difference & promotion race'}
            </p>
          </div>
        </button>

        {/* 8. Coach Levels & Quests Card (1 to 100) */}
        <button
          onClick={() => handleClick('quests')}
          className="group text-left p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 hover:bg-slate-850 border border-amber-500/40 hover:border-amber-400 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 group-hover:scale-105 transition">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-amber-300">
              {isArabic ? `المستوى ${manager.level} / 100` : `LVL ${manager.level} / 100`}
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-amber-300 transition">
              {isArabic ? 'المستويات والمهام' : 'Levels & Quests'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'مسار الـ 100 مستوى · مكافآت وجوائز' : '100 Level Roadmap · Rewards & Gifts'}
            </p>
          </div>
        </button>

        {/* 9. Finances Card */}
        <button
          onClick={() => handleClick('finances')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ${myClub.budgetDollars.toLocaleString()}
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition">
              {isArabic ? 'النظام المالي' : 'Club Finances'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'الإيرادات · الرواتب · أرباح التذاكر' : 'Income, payroll, merchandise & prizes'}
            </p>
          </div>
        </button>

        {/* 10. Tournaments & European Expansion Card */}
        <button
          onClick={() => handleClick('tournaments')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-indigo-300">
              FA Cup / UCL
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-indigo-400 transition">
              {isArabic ? 'البطولات والكؤوس' : 'Tournaments & Cups'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'كأس الاتحاد · دوري الأبطال · اليوروباليغ' : 'FA Cup, League Cup & European glory'}
            </p>
          </div>
        </button>

        {/* 11. Manager Career & Profile Card */}
        <button
          onClick={() => handleClick('career')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-teal-950/60 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold text-teal-300">
              REP {manager.reputation}
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-teal-400 transition">
              {isArabic ? 'مسيرة المدرب وسمعته' : 'Coach Profile & Career'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'سجل المباريات · العروض · خطر الإقالة' : 'Win record, trophies & club offers'}
            </p>
          </div>
        </button>

        {/* 12. Settings & PWA Backup Card */}
        <button
          onClick={() => handleClick('settings')}
          className="group text-left p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-600 transition-all shadow-lg flex flex-col justify-between cursor-pointer min-h-[175px]"
        >
          <div className="flex items-center justify-between w-full">
            <div className="p-3 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 group-hover:scale-105 transition">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-emerald-400">PWA</span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-slate-200 transition">
              {isArabic ? 'الإعدادات والحفظ' : 'Settings & Save'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isArabic ? 'اللغة · الصوت · تصدير الحفظ · التثبيت' : 'Language, audio, JSON backup & install'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
