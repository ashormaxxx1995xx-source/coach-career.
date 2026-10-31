import React from 'react';
import { Club } from '../../types/game';
import { EUROPEAN_GIANTS } from '../../data/clubs';
import { sound } from '../../utils/audio';
import { ArrowLeft, Trophy, Star, Shield, Award, ChevronRight } from 'lucide-react';

interface TournamentsViewProps {
  isArabic: boolean;
  myClub: Club;
  onBack: () => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  isArabic,
  myClub,
  onBack,
}) => {
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
          <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'البطولات الإنجليزية والمجد الأوروبي' : 'English Pyramid & European Glory'}
            </h2>
            <span className="text-xs text-slate-400">
              {isArabic ? 'طريق الصعود من الدرجة 5 حتى نهائي دوري أبطال أوروبا' : 'From Tier 5 Underdogs to Champions League Final'}
            </span>
          </div>
        </div>
      </div>

      {/* English Pyramid Ladder Progression Map */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 mb-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>{isArabic ? 'هرم الدوريات الإنجليزية (طريق الصعود والمجد)' : 'English Football Pyramid Ladder'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {isArabic
            ? 'تصدر الدوري في كل موسم يضمن لك الصعود المباشر إلى الدرجة الأعلى، حتى بلوغ البريميرليغ والتأهل لكؤوس أوروبا'
            : 'Finishing top 2 guarantees direct promotion upwards towards the Premier League and European qualification'}
        </p>

        <div className="space-y-2.5">
          {[
            { tier: 1, nameEn: 'Premier League', nameAr: 'الدوري الإنجليزي الممتاز (بريميرليغ)', perkAr: 'المشاركة في دوري أبطال أوروبا والجوائز الكبرى', perkEn: 'UCL Qualification & $100M+ TV Rights', icon: '👑' },
            { tier: 2, nameEn: 'Championship', nameAr: 'دوري الدرجة الثانية (التشامبيونشيب)', perkAr: 'صراع الصعود للأضواء وجوائز مالية ضخمة', perkEn: 'High-stakes battle for Premier League spots', icon: '⚔️' },
            { tier: 3, nameEn: 'League One', nameAr: 'دوري الدرجة الثالثة (ليغ ون)', perkAr: 'منافسة قوية وملاعب متوسطة السعة', perkEn: 'Competitive tier with expanding stadiums', icon: '🛡️' },
            { tier: 4, nameEn: 'League Two', nameAr: 'دوري الدرجة الرابعة (ليغ تو)', perkAr: 'بوابة الاحتراف الكامل وصيد المواهب', perkEn: 'Fully professional status & scouting hubs', icon: '⚽' },
            { tier: 5, nameEn: 'National League', nameAr: 'الدرجة الخامسة (الناشيونال ليغ - نقطة البداية)', perkAr: 'البداية الحقيقية والشغف الخالص للجماهير', perkEn: 'The true grassroots starting tier', icon: '🌱' },
          ].map(lvl => {
            const isCurrentTier = myClub.tier === lvl.tier;
            return (
              <div
                key={lvl.tier}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  isCurrentTier
                    ? 'bg-emerald-950/60 border-emerald-400 text-white font-bold ring-1 ring-emerald-400'
                    : 'bg-slate-850/50 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lvl.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">
                      {isArabic ? lvl.nameAr : lvl.nameEn}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {isArabic ? lvl.perkAr : lvl.perkEn}
                    </span>
                  </div>
                </div>

                <div className="font-mono text-xs">
                  {isCurrentTier ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
                      {isArabic ? 'درجتك الحالية' : 'CURRENT TIER'}
                    </span>
                  ) : (
                    <span className="text-slate-500">Tier {lvl.tier}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* European Giants Showcase */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span>{isArabic ? 'عمالقة القارة الأوروبية (خصومك في دوري أبطال أوروبا)' : 'European Giants & Champions League Elite'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {isArabic
            ? 'عند صعودك إلى قمة البريميرليغ، ستواجه أعتى أندية العالم على عرش أوروبا'
            : 'Upon conquering the English summit, battle these legendary powerhouses for European glory'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {EUROPEAN_GIANTS.map(giant => (
            <div
              key={giant.id}
              className="p-4 rounded-2xl bg-slate-850/70 border border-slate-750 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{giant.crestIcon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isArabic ? giant.arName : giant.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">
                    {isArabic ? giant.divisionNameAr : giant.divisionNameEn}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {giant.stadiumName} ({giant.stadiumCapacity.toLocaleString()})
                  </span>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-xs text-amber-400 font-black block">REP {giant.reputation}</span>
                <span className="text-[10px] text-slate-400">90+ OVR</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
