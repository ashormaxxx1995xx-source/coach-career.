import React from 'react';
import { YouthProspect } from '../types/game';
import { sound } from '../utils/audio';
import { Coins, Sparkles, GraduationCap, Star, ArrowRight, Check, X, Shield, DollarSign } from 'lucide-react';

interface YouthAcademyModalProps {
  isOpen: boolean;
  isArabic: boolean;
  koroBalance: number;
  dollarBalance: number;
  prospects: YouthProspect[];
  onScoutAndPromote: (prospect: YouthProspect) => void;
  onRefreshScoutPool: () => void;
  onClose: () => void;
}

export const YouthAcademyModal: React.FC<YouthAcademyModalProps> = ({
  isOpen,
  isArabic,
  koroBalance,
  dollarBalance,
  prospects,
  onScoutAndPromote,
  onRefreshScoutPool,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-900/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{isArabic ? 'أكاديمية الناشئين وصيد المواهب' : 'Youth Academy & Wonderkids'}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                  KORO
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic
                  ? 'استخدم عملات الكورو الحصرية للكشف عن جواهر المستقبل وضمهم للفريق الأول'
                  : 'Deploy exclusive KORO tokens to uncover future world-class prodigies'}
              </p>
            </div>
          </div>

          {/* Current Currency Balances */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-sm font-bold shadow-inner">
              <Coins className="w-4 h-4 text-purple-400" />
              <span>{koroBalance.toLocaleString()} KORO</span>
            </div>

            <button
              onClick={() => {
                if (koroBalance >= 30) {
                  sound.playRewardChime();
                  onRefreshScoutPool();
                }
              }}
              disabled={koroBalance < 30}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 transition cursor-pointer min-h-[44px] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? 'إرسال كشاف جديد (30 KORO)' : 'Refresh Scouts (30 KORO)'}</span>
            </button>
          </div>
        </div>

        {/* Currency Rules Clarification Banner */}
        <div className="my-4 px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            {isArabic
              ? '💡 عملة الكورو (KORO) مستقلة تماماً ومخصصة لاكتشاف وتطوير المواهب الناشئة. لا يمكن استبدالها بالدولار.'
              : '💡 KORO tokens are solely reserved for youth scouting and development. Zero currency conversion.'}
          </span>
        </div>

        {/* Prospects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4 max-h-[60vh] overflow-y-auto pr-1">
          {prospects.map(p => {
            const canAfford = koroBalance >= p.scoutCostKoro && dollarBalance >= p.signCostDollars;
            const isHighPotential = p.potential >= 86;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isHighPotential
                    ? 'bg-gradient-to-b from-purple-950/30 to-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-purple-300">
                        {p.position}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {isArabic ? p.arName : p.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {p.age} {isArabic ? 'سنة' : 'years'} · {p.position}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <div className="px-2 py-1 rounded bg-slate-800 text-slate-300">
                        OVR: <span className="font-bold text-white">{p.ovr}</span>
                      </div>
                      <div className="px-2 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">
                        POT: <span className="font-bold text-amber-300">{p.potential} ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Scout Trait */}
                  <p className="text-xs text-purple-200/90 italic mb-3">
                    "{isArabic ? p.specialTraitAr : p.specialTraitEn}"
                  </p>

                  {/* Attributes Strip */}
                  <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] py-2 border-t border-b border-white/5 mb-3">
                    <div><span className="text-slate-400 block">PAC</span><span className="font-bold text-emerald-400">{p.pace}</span></div>
                    <div><span className="text-slate-400 block">SHO</span><span className="font-bold text-emerald-400">{p.shooting}</span></div>
                    <div><span className="text-slate-400 block">PAS</span><span className="font-bold text-emerald-400">{p.passing}</span></div>
                    <div><span className="text-slate-400 block">DRI</span><span className="font-bold text-emerald-400">{p.dribbling}</span></div>
                    <div><span className="text-slate-400 block">DEF</span><span className="font-bold text-emerald-400">{p.defending}</span></div>
                    <div><span className="text-slate-400 block">PHY</span><span className="font-bold text-emerald-400">{p.physical}</span></div>
                  </div>
                </div>

                {/* Bottom Signing Cost & Promote Trigger */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-purple-400 font-bold">{p.scoutCostKoro} KORO</span>
                    <span className="text-slate-500">+</span>
                    <span className="text-emerald-400 font-bold">${p.signCostDollars.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (canAfford) {
                        sound.playTransferSuccess();
                        onScoutAndPromote(p);
                      }
                    }}
                    disabled={!canAfford}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'ضم وتصعيد للفريق الأول' : 'Sign & Promote'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer min-h-[44px]"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
