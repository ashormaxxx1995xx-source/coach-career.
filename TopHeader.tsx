import React from 'react';
import { Club, ManagerProfile } from '../types/game';
import { PWAInstallButton } from './PWAInstallButton';
import { sound } from '../utils/audio';
import { DollarSign, Coins, Award, Volume2, VolumeX, Globe } from 'lucide-react';

interface TopHeaderProps {
  myClub: Club;
  manager: ManagerProfile;
  currentSeason: number;
  currentMatchDay: number;
  isArabic: boolean;
  onToggleLanguage: () => void;
  onOpenLevels: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  myClub,
  manager,
  currentSeason,
  currentMatchDay,
  isArabic,
  onToggleLanguage,
  onOpenLevels,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Club Identity & Season */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl sm:text-2xl shadow-inner">
            {myClub.crestIcon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black text-white tracking-wide truncate max-w-[130px] sm:max-w-[200px]">
              {isArabic ? myClub.arName : myClub.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isArabic ? `موسم ${currentSeason} · جولة ${currentMatchDay}` : `S${currentSeason} · MD ${currentMatchDay}`}
            </span>
          </div>
        </div>

        {/* Zone 2: Currencies & Coach Level */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dollar Balance */}
          <div 
            title={isArabic ? 'رصيد الدولار للنادي' : 'Club Dollar Budget'}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold font-mono tabular-nums shadow-sm"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>${myClub.budgetDollars.toLocaleString()}</span>
          </div>

          {/* KORO Balance */}
          <div 
            title={isArabic ? 'رصيد الكورو الخاص بالمواهب والناشئين' : 'KORO Talent Tokens'}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-bold font-mono tabular-nums shadow-sm"
          >
            <Coins className="w-3.5 h-3.5 text-purple-400" />
            <span>{myClub.balanceKoro.toLocaleString()} <span className="text-[10px] font-sans font-semibold">KORO</span></span>
          </div>

          {/* Coach Level Badge Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLevels();
            }}
            title={isArabic ? 'المستويات والمهام (1-100)' : 'Coach Levels (1-100)'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-extrabold cursor-pointer transition min-h-[44px]"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isArabic ? `المستوى ${manager.level}` : `LVL ${manager.level}`}</span>
          </button>
        </div>

        {/* Zone 3: Actions (PWA install, sound, lang) */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton isArabic={isArabic} />

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer min-h-[44px] flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{isArabic ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
