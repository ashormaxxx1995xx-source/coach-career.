import React, { useState } from 'react';
import { Formation, PlayStyle, Player, Tactics } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, Layers, Shield, Award, Activity, Check, RefreshCw } from 'lucide-react';

interface TacticsViewProps {
  isArabic: boolean;
  squad: Player[];
  tactics: Tactics;
  onUpdateTactics: (newTactics: Tactics) => void;
  onBack: () => void;
}

const FORMATIONS: { id: Formation; label: string }[] = [
  { id: '4-3-3', label: '4-3-3 Attacking' },
  { id: '4-4-2', label: '4-4-2 Classic' },
  { id: '4-2-3-1', label: '4-2-3-1 Modern' },
  { id: '3-5-2', label: '3-5-2 Wingbacks' },
  { id: '4-1-4-1', label: '4-1-4-1 Controlled' },
];

const PLAY_STYLES: { id: PlayStyle; nameEn: string; nameAr: string; descEn: string; descAr: string }[] = [
  { id: 'balanced', nameEn: 'Balanced', nameAr: 'تكتيك متوازن', descEn: 'Steady game tempo and structured coverage', descAr: 'توازن محكم بين الارتداد والمساندة الهجومية' },
  { id: 'attacking', nameEn: 'Attacking', nameAr: 'هجوم شامل', descEn: 'Heavy numbers pushed forward into opposition box', descAr: 'كثافة هجومية عالية في منطقة جزاء الخصم' },
  { id: 'high_press', nameEn: 'High Press', nameAr: 'ضغط عالي شرس', descEn: 'Suffocate opponent in their own half (higher fatigue)', descAr: 'خنق الخصم في مناطقه مع استهلاك بدني أعلى' },
  { id: 'counter', nameEn: 'Counter-Attack', nameAr: 'هجمات مرتدة سريعة', descEn: 'Absorb pressure and break rapidly through wingers', descAr: 'امتصاص الضغط والانطلاق الخاطف عبر الأجنحة' },
  { id: 'defensive', nameEn: 'Park the Bus (Defensive)', nameAr: 'دفاع المنطقة والتحصين', descEn: 'Double-decker defense to protect the clean sheet', descAr: 'تكتل دفاعي صارم وإغلاق تام لكافة المساحات' },
];

export const TacticsView: React.FC<TacticsViewProps> = ({
  isArabic,
  squad,
  tactics,
  onUpdateTactics,
  onBack,
}) => {
  const [currentFormation, setCurrentFormation] = useState<Formation>(tactics.formation);
  const [currentStyle, setCurrentStyle] = useState<PlayStyle>(tactics.playStyle);
  const [startingXI, setStartingXI] = useState<string[]>(tactics.startingXI);
  const [bench, setBench] = useState<string[]>(tactics.bench);
  const [selectedPlayerToSwap, setSelectedPlayerToSwap] = useState<string | null>(null);
  const [captainId, setCaptainId] = useState<string>(tactics.captainId || squad[0]?.id);

  // Group squad into starting XI and bench
  const starters = startingXI.map(id => squad.find(p => p.id === id)).filter(Boolean) as Player[];
  const benchPlayers = squad.filter(p => !startingXI.includes(p.id));

  const handleSwap = (clickedId: string) => {
    sound.playClick();
    if (!selectedPlayerToSwap) {
      setSelectedPlayerToSwap(clickedId);
    } else {
      if (selectedPlayerToSwap === clickedId) {
        setSelectedPlayerToSwap(null);
        return;
      }

      // Swap between startingXI or bench
      const newXI = [...startingXI];
      const isAInXI = newXI.includes(selectedPlayerToSwap);
      const isBInXI = newXI.includes(clickedId);

      if (isAInXI && isBInXI) {
        // Swap positions in starting XI
        const idxA = newXI.indexOf(selectedPlayerToSwap);
        const idxB = newXI.indexOf(clickedId);
        newXI[idxA] = clickedId;
        newXI[idxB] = selectedPlayerToSwap;
      } else if (isAInXI && !isBInXI) {
        // Substitute starter with bench
        const idxA = newXI.indexOf(selectedPlayerToSwap);
        newXI[idxA] = clickedId;
      } else if (!isAInXI && isBInXI) {
        const idxB = newXI.indexOf(clickedId);
        newXI[idxB] = selectedPlayerToSwap;
      }

      setStartingXI(newXI);
      setSelectedPlayerToSwap(null);

      // Save tactics
      onUpdateTactics({
        ...tactics,
        formation: currentFormation,
        playStyle: currentStyle,
        startingXI: newXI,
        bench: squad.filter(p => !newXI.includes(p.id)).map(p => p.id).slice(0, 7),
        captainId,
      });
    }
  };

  const handleFormationChange = (form: Formation) => {
    sound.playClick();
    setCurrentFormation(form);
    onUpdateTactics({
      ...tactics,
      formation: form,
      playStyle: currentStyle,
      startingXI,
      bench,
      captainId,
    });
  };

  const handleStyleChange = (style: PlayStyle) => {
    sound.playClick();
    setCurrentStyle(style);
    onUpdateTactics({
      ...tactics,
      formation: currentFormation,
      playStyle: style,
      startingXI,
      bench,
      captainId,
    });
  };

  const handleCaptainChange = (id: string) => {
    sound.playRewardChime();
    setCaptainId(id);
    onUpdateTactics({
      ...tactics,
      formation: currentFormation,
      playStyle: currentStyle,
      startingXI,
      bench,
      captainId: id,
    });
  };

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
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'إدارة التشكيلة والخطط التكتيكية' : 'Tactics & Formation Board'}
            </h2>
            <span className="text-xs text-slate-400">
              {isArabic ? 'انقر على لاعبين لتبديل أحدهما بالآخر' : 'Tap any two players to swap'}
            </span>
          </div>
        </div>
      </div>

      {/* Formation & PlayStyle Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Formations */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {isArabic ? 'الخطة التكتيكية' : 'Formation Setup'}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {FORMATIONS.map(f => (
              <button
                key={f.id}
                onClick={() => handleFormationChange(f.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer min-h-[44px] ${
                  currentFormation === f.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {f.id}
              </button>
            ))}
          </div>
        </div>

        {/* Playstyles */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            {isArabic ? 'أسلوب وتكتيك اللعب' : 'Style of Play'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PLAY_STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => handleStyleChange(s.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] ${
                  currentStyle === s.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {isArabic ? s.nameAr : s.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Pitch & Bench Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Football Pitch (Starting XI) */}
        <div className="lg:col-span-2 relative min-h-[520px] rounded-3xl pitch-pattern border-4 border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Pitch Markings */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-white/15 pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white/15 pointer-events-none" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-48 h-20 border-b-2 border-x-2 border-white/15 pointer-events-none" />
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-48 h-20 border-t-2 border-x-2 border-white/15 pointer-events-none" />

          {/* Swap Notice Banner */}
          {selectedPlayerToSwap && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-lg animate-pulse z-30">
              {isArabic ? 'انقر على لاعب آخر لإتمام التبديل' : 'Tap another player to complete swap'}
            </div>
          )}

          {/* Starters Grid mapped across pitch */}
          <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-3 my-auto">
            {starters.map(player => {
              const isSelected = selectedPlayerToSwap === player.id;
              const isCaptain = captainId === player.id;

              return (
                <div
                  key={player.id}
                  onClick={() => handleSwap(player.id)}
                  className={`p-2.5 rounded-2xl backdrop-blur-md border transition cursor-pointer flex flex-col items-center text-center shadow-lg group ${
                    isSelected
                      ? 'bg-amber-500/80 border-amber-300 text-slate-950 scale-105 ring-2 ring-amber-300'
                      : 'bg-slate-950/75 border-white/15 text-white hover:border-emerald-400'
                  }`}
                >
                  <div className="relative mb-1">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/30 flex items-center justify-center font-bold text-xs text-emerald-400">
                      {player.position}
                    </div>
                    {isCaptain && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center border border-black shadow">
                        C
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-bold truncate max-w-[100px]">
                    {isArabic ? player.arName : player.name}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-mono mt-0.5">
                    <span className="text-amber-400 font-bold">{player.ovr}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-emerald-400">{player.fitness}%</span>
                  </div>

                  {/* Quick Captain Assign */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCaptainChange(player.id);
                    }}
                    title={isArabic ? 'تعيين كقائد للفريق' : 'Make Captain'}
                    className="mt-1 text-[9px] text-slate-400 hover:text-amber-300 font-semibold"
                  >
                    {isCaptain ? (isArabic ? 'القائد الحالي' : 'Captain') : (isArabic ? 'اجعله القائد' : 'Make (C)')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bench & Substitutes Panel */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>{isArabic ? 'دكة البدلاء والاحتياط' : 'Substitutes & Reserves'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              {isArabic ? 'انقر على أي بديل لتبديله مع لاعب في الملعب' : 'Tap any substitute to swap into starting XI'}
            </p>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {benchPlayers.map(player => {
                const isSelected = selectedPlayerToSwap === player.id;
                return (
                  <div
                    key={player.id}
                    onClick={() => handleSwap(player.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                        : 'bg-slate-850/60 border-slate-700/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-xs font-bold text-emerald-400 flex items-center justify-center">
                        {player.position}
                      </div>
                      <div>
                        <span className="text-xs font-bold block truncate max-w-[120px]">
                          {isArabic ? player.arName : player.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {player.age} {isArabic ? 'سنة' : 'yrs'} · {player.fitness}% {isArabic ? 'لياقة' : 'fit'}
                        </span>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-bold text-amber-400">
                      {player.ovr} OVR
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
