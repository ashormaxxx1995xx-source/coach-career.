import React, { useEffect } from 'react';
import { TransferDeal } from '../types/game';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { Check, ArrowRight, Shield, Award, DollarSign, Calendar, X } from 'lucide-react';

interface PESCelebrationModalProps {
  deal: TransferDeal | null;
  isArabic: boolean;
  onClose: () => void;
}

export const PESCelebrationModal: React.FC<PESCelebrationModalProps> = ({
  deal,
  isArabic,
  onClose,
}) => {
  useEffect(() => {
    if (deal) {
      sound.playTransferSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ffffff'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [deal]);

  if (!deal) return null;

  const { player } = deal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-[#0a1120] to-[#040810] border-2 border-amber-400/60 p-6 sm:p-8 text-white shadow-[0_0_80px_rgba(245,158,11,0.25)] flex flex-col items-center text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PES 2012 Official Header Ribbon */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-sm tracking-widest uppercase shadow-lg shadow-amber-500/30 mb-6 animate-bounce">
          <Award className="w-4 h-4" />
          <span>{isArabic ? 'تم إتمام التعاقد بنجاح' : 'DEAL COMPLETED · OFFICIAL'}</span>
        </div>

        {/* Transfer Movement: Old Crest ───► New Crest */}
        <div className="w-full flex items-center justify-around py-3 px-4 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
          {/* Previous Club */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-3xl shadow-inner">
              ⚽
            </div>
            <span className="text-xs font-bold text-slate-300 mt-1 max-w-[100px] truncate">
              {isArabic ? deal.fromClubAr : deal.fromClub}
            </span>
            <span className="text-[10px] text-slate-400">
              {isArabic ? 'النادي السابق' : 'Former Club'}
            </span>
          </div>

          {/* Animated Glowing Arrow */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-16 h-10">
              <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full animate-pulse" />
              <ArrowRight className="w-8 h-8 text-emerald-400 animate-pulse stroke-[3]" />
            </div>
            <span className="text-[10px] font-mono text-emerald-300 font-bold tracking-wider">
              TRANSFER
            </span>
          </div>

          {/* New Club */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
              🛡️
            </div>
            <span className="text-xs font-bold text-emerald-300 mt-1 max-w-[100px] truncate">
              {isArabic ? deal.toClubAr : deal.toClub}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {isArabic ? 'النادي الجديد' : 'New Club'}
            </span>
          </div>
        </div>

        {/* PES Player Showcase Card */}
        <div className="relative w-48 sm:w-56 h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-amber-500/20 via-slate-900 to-black border-2 border-amber-400/80 p-4 flex flex-col justify-between shadow-2xl mb-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">{player.ovr}</span>
              <span className="text-xs font-bold text-slate-200">{player.position}</span>
            </div>
            <div className="px-2 py-0.5 rounded bg-black/60 text-[10px] text-amber-300 font-bold border border-amber-500/40">
              POT {player.potential}
            </div>
          </div>

          {/* Player Silhouette / Avatar */}
          <div className="my-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-800 to-emerald-900 border-2 border-white/20 flex items-center justify-center text-4xl shadow-lg">
              🏃
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-2">
              {isArabic ? player.arName : player.name}
            </h3>
            <span className="text-[10px] text-slate-300 font-medium">
              {player.age} {isArabic ? 'سنة' : 'yrs'} · {player.nationality}
            </span>
          </div>

          {/* Key Attributes Mini Grid */}
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/10 text-center font-mono text-[10px]">
            <div><span className="text-slate-400">PAC</span> <span className="font-bold text-emerald-400">{player.pace}</span></div>
            <div><span className="text-slate-400">SHO</span> <span className="font-bold text-emerald-400">{player.shooting}</span></div>
            <div><span className="text-slate-400">PAS</span> <span className="font-bold text-emerald-400">{player.passing}</span></div>
            <div><span className="text-slate-400">DRI</span> <span className="font-bold text-emerald-400">{player.dribbling}</span></div>
            <div><span className="text-slate-400">DEF</span> <span className="font-bold text-emerald-400">{player.defending}</span></div>
            <div><span className="text-slate-400">PHY</span> <span className="font-bold text-emerald-400">{player.physical}</span></div>
          </div>
        </div>

        {/* Contract & Fee Breakdown */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 font-mono">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
            <span className="block text-[10px] text-slate-400 font-sans">
              {isArabic ? 'رسوم الصفقة' : 'Transfer Fee'}
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              ${deal.fee.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
            <span className="block text-[10px] text-slate-400 font-sans">
              {isArabic ? 'مدة العقد' : 'Contract Length'}
            </span>
            <span className="text-sm sm:text-base font-bold text-amber-300">
              {deal.years} {isArabic ? 'سنوات' : 'Years'}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black shadow-lg shadow-emerald-950/40 active:scale-98 transition cursor-pointer min-h-[44px]"
        >
          {isArabic ? 'متابعة ⟵' : 'Continue ⟶'}
        </button>
      </div>
    </div>
  );
};
