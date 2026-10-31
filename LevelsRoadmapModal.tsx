import React, { useRef, useEffect } from 'react';
import { ManagerProfile, Quest } from '../types/game';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Award, Trophy, Gift, Check, Lock, ChevronRight, X, DollarSign, Coins, Sparkles, Star } from 'lucide-react';

interface LevelsRoadmapModalProps {
  isOpen: boolean;
  isArabic: boolean;
  manager: ManagerProfile;
  quests: Quest[];
  onClaimReward: (questId: string) => void;
  onClose: () => void;
}

export const LevelsRoadmapModal: React.FC<LevelsRoadmapModalProps> = ({
  isOpen,
  isArabic,
  manager,
  quests,
  onClaimReward,
  onClose,
}) => {
  const currentLevelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && currentLevelRef.current) {
      currentLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = (q: Quest) => {
    sound.playRewardChime();
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
    }
    onClaimReward(q.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/40">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{isArabic ? 'مسار مستويات المدرب (1 - 100)' : 'Coach Career Roadmap (1 - 100)'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                  LVL {manager.level}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic
                  ? 'أكمل المهام التكتيكية لتصعد في سلم التدريب واستلم مكافآت الدولار والكورو والنجوم'
                  : 'Complete managerial quests to ascend the ranks and unlock cash, KORO tokens, and wonderkids'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-xs">
            <span className="text-slate-400">{isArabic ? 'الخبرة الحالية:' : 'XP:'}</span>
            <span className="text-amber-400 font-bold">{manager.xp} / {manager.xpToNextLevel}</span>
          </div>
        </div>

        {/* Milestone Path Tracker: 1 to 100 Visual Continuous Ribbon */}
        <div className="my-5 max-h-[65vh] overflow-y-auto pr-2 relative">
          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-4">
            {quests.map(q => {
              const isCurrent = q.level === manager.level;
              const isPast = q.level < manager.level;
              const isFuture = q.level > manager.level;
              const canClaim = (isPast || isCurrent) && q.isCompleted && !q.isClaimed;

              return (
                <div
                  key={q.id}
                  ref={isCurrent ? currentLevelRef : null}
                  className={`relative p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-950/40 via-slate-850 to-slate-900 border-amber-500/60 shadow-lg ring-1 ring-amber-500/30'
                      : isPast
                      ? 'bg-slate-850/40 border-slate-800'
                      : 'bg-slate-900/40 border-slate-850 opacity-60'
                  }`}
                >
                  {/* Timeline Node Bullet */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border-2 ${
                      isPast || q.isClaimed
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : isCurrent
                        ? 'bg-amber-500 border-amber-300 text-slate-950 animate-pulse'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {isPast || q.isClaimed ? '✓' : q.level}
                  </div>

                  {/* Level Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-slate-300">
                        {isArabic ? `المستوى ${q.level}` : `Level ${q.level}`}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {isArabic ? q.titleAr : q.titleEn}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                          {isArabic ? 'المستوى الحالي' : 'Active'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {isArabic ? q.descAr : q.descEn}
                    </p>
                  </div>

                  {/* Reward Preview and Claim Action */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 font-mono text-xs font-bold">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-300">
                        {isArabic ? q.rewardLabelAr : q.rewardLabelEn}
                      </span>
                    </div>

                    {/* Claim Button Status */}
                    {q.isClaimed ? (
                      <span className="px-3 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold flex items-center gap-1 min-h-[44px]">
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span>{isArabic ? 'تم الاستلام' : 'Claimed'}</span>
                      </span>
                    ) : canClaim ? (
                      <button
                        onClick={() => handleClaim(q)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-md shadow-amber-950/40 active:scale-95 transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isArabic ? 'استلام الهدية!' : 'Claim Reward!'}</span>
                      </button>
                    ) : (
                      <span className="px-3 py-2 rounded-xl bg-slate-850 text-slate-600 text-xs font-semibold flex items-center gap-1 min-h-[44px]">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'مغلق' : 'Locked'}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
