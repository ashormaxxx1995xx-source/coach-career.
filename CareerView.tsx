import React from 'react';
import { Club, ManagerProfile } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, Shield, Award, Trophy, UserCheck, AlertTriangle, Briefcase, CheckCircle } from 'lucide-react';

interface CareerViewProps {
  isArabic: boolean;
  myClub: Club;
  manager: ManagerProfile;
  currentSeason: number;
  onAcceptJobOffer: (newClubId: string) => void;
  onBack: () => void;
}

export const CareerView: React.FC<CareerViewProps> = ({
  isArabic,
  myClub,
  manager,
  currentSeason,
  onAcceptJobOffer,
  onBack,
}) => {
  const winRate = manager.matchesPlayed > 0 ? Math.round((manager.wins / manager.matchesPlayed) * 100) : 0;

  // Potential club offers generated based on manager reputation
  const availableOffers = [
    {
      clubId: 'club_bradford',
      nameEn: 'Bradford City',
      nameAr: 'برادفورد سيتي',
      tier: 4,
      repReq: 35,
      budget: '$980,000',
      stadium: 'Valley Parade',
    },
    {
      clubId: 'club_bolton',
      nameEn: 'Bolton Wanderers',
      nameAr: 'بولتون واندررز',
      tier: 3,
      repReq: 55,
      budget: '$2,400,000',
      stadium: 'Toughsheet Stadium',
    },
    {
      clubId: 'club_leeds',
      nameEn: 'Leeds United',
      nameAr: 'ليدز يونايتد',
      tier: 2,
      repReq: 72,
      budget: '$15,000,000',
      stadium: 'Elland Road',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isArabic ? 'العودة للمقر' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-950 text-teal-400 border border-teal-500/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'ملف وسجل مسيرة المدرب' : 'Manager Profile & Career Record'}
            </h2>
            <span className="text-xs text-slate-400">
              {manager.name} · {manager.nationality}
            </span>
          </div>
        </div>
      </div>

      {/* Manager Status Card & Board Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-800 to-slate-900 border border-teal-500/40 flex items-center justify-center text-3xl shadow-lg">
            👔
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{manager.name}</h3>
            <span className="text-xs text-slate-400 block">{manager.nationality}</span>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xs">
              <span className="text-teal-400 font-bold">REP: {manager.reputation} / 100</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 font-bold">LVL {manager.level}</span>
            </div>
          </div>
        </div>

        {/* Board Confidence Meter */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'ثقة مجلس الإدارة' : 'Board Confidence'}</span>
            </span>
            <span className={`text-sm font-bold font-mono ${manager.boardConfidence >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {manager.boardConfidence}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 my-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                manager.boardConfidence >= 60 ? 'bg-emerald-500' : manager.boardConfidence >= 35 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${manager.boardConfidence}%` }}
            />
          </div>

          <span className="text-[10px] text-slate-400">
            {manager.boardConfidence < 30
              ? (isArabic ? '⚠️ تحذير: نتائجك مهددة وقد تتعرض للإقالة قريباً!' : '⚠️ Danger: Sacking risk imminent if results do not improve!')
              : (isArabic ? 'مجلس الإدارة راضٍ تماماً عن أدائك مع الفريق.' : 'The board firmly backs your tactical decisions.')}
          </span>
        </div>

        {/* Trophies & Honors */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white">
              {isArabic ? 'سجل الألقاب والبطولات' : 'Trophies Won'}
            </h4>
          </div>
          <div className="flex items-center gap-2 my-2">
            {manager.trophies.length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                {isArabic ? 'لم يتم التتويج ببطولة بعد. واصل القتال!' : 'No trophies yet. Keep competing!'}
              </span>
            ) : (
              manager.trophies.map((tr, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1">
                  <span>🏆</span>
                  <span>{tr}</span>
                </div>
              ))
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isArabic ? `الموسم الحالي: ${currentSeason}` : `Current Season: ${currentSeason}`}
          </span>
        </div>
      </div>

      {/* Match Records Statistics Grid */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 mb-6">
        <h3 className="text-xs font-bold text-slate-300 mb-4">
          {isArabic ? 'إحصائيات المباريات التاريخية للمدرب' : 'Career Match Record'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center font-mono">
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-400 text-[10px] block font-sans">{isArabic ? 'المباريات' : 'Matches'}</span>
            <span className="text-lg font-bold text-white">{manager.matchesPlayed}</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-900/50">
            <span className="text-emerald-400 text-[10px] block font-sans">{isArabic ? 'الانتصارات' : 'Wins'}</span>
            <span className="text-lg font-bold text-emerald-400">{manager.wins}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-400 text-[10px] block font-sans">{isArabic ? 'التعادلات' : 'Draws'}</span>
            <span className="text-lg font-bold text-slate-300">{manager.draws}</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/50">
            <span className="text-rose-400 text-[10px] block font-sans">{isArabic ? 'الهزائم' : 'Losses'}</span>
            <span className="text-lg font-bold text-rose-400">{manager.losses}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-400 text-[10px] block font-sans">{isArabic ? 'نسبة الفوز' : 'Win %'}</span>
            <span className="text-lg font-bold text-amber-400">{winRate}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-850 border border-slate-750">
            <span className="text-slate-400 text-[10px] block font-sans">{isArabic ? 'الأهداف' : 'Goals Scored'}</span>
            <span className="text-lg font-bold text-teal-400">{manager.goalsScored}</span>
          </div>
        </div>
      </div>

      {/* Job Offers from other clubs */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              {isArabic ? 'عروض التدريب المقدمة من الأندية الأخرى' : 'Managerial Job Offers'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isArabic
                ? 'كلما ارتفعت سمعتك التدريبية، تنهال عليك عروض أندية الدرجات العليا'
                : 'Higher reputation unlocks lucrative contract proposals from prestigious clubs'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {availableOffers.map(offer => {
            const isEligible = manager.reputation >= offer.repReq;
            return (
              <div
                key={offer.clubId}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isEligible
                    ? 'bg-slate-850 border-emerald-500/40 hover:border-emerald-400 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-white">
                      {isArabic ? offer.nameAr : offer.nameEn}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-800">
                      Tier {offer.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isArabic ? `الملعب: ${offer.stadium}` : `Stadium: ${offer.stadium}`}
                  </p>
                  <p className="text-xs font-mono text-emerald-400 mt-1">
                    {isArabic ? `الميزانية: ${offer.budget}` : `Budget: ${offer.budget}`}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {isArabic ? `يتطلب سمعة ${offer.repReq}+` : `Req ${offer.repReq}+ REP`}
                  </span>
                  {isEligible ? (
                    <button
                      onClick={() => {
                        sound.playTransferSuccess();
                        onAcceptJobOffer(offer.clubId);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
                    >
                      {isArabic ? 'قبول العقد' : 'Sign Contract'}
                    </button>
                  ) : (
                    <span className="text-slate-500 text-xs font-semibold">{isArabic ? 'غير مؤهل' : 'Locked'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
