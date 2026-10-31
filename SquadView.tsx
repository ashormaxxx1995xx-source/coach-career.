import React, { useState } from 'react';
import { Player, Position } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, Users, Filter, ArrowUpDown, Shield, Star, DollarSign, Calendar } from 'lucide-react';

interface SquadViewProps {
  isArabic: boolean;
  squad: Player[];
  onSelectPlayer: (player: Player) => void;
  onBack: () => void;
}

export const SquadView: React.FC<SquadViewProps> = ({
  isArabic,
  squad,
  onSelectPlayer,
  onBack,
}) => {
  const [filterPos, setFilterPos] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'ovr' | 'age' | 'value' | 'fitness'>('ovr');

  const filtered = squad
    .filter(p => (filterPos === 'ALL' ? true : p.position === filterPos))
    .sort((a, b) => {
      if (sortBy === 'ovr') return b.ovr - a.ovr;
      if (sortBy === 'age') return a.age - b.age;
      if (sortBy === 'value') return b.marketValue - a.marketValue;
      if (sortBy === 'fitness') return b.fitness - a.fitness;
      return 0;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-in fade-in duration-200">
      {/* Top Section Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isArabic ? 'العودة للقائمة الرئيسية' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'قائمة الفريق واللاعبين' : 'Squad & Rosters'}
            </h2>
            <span className="text-xs text-slate-400">
              {squad.length} {isArabic ? 'لاعباً مسجلاً في القائمة' : 'Registered Players'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
        {/* Position Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1">
          {['ALL', 'GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'].map(pos => (
            <button
              key={pos}
              onClick={() => setFilterPos(pos)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] ${
                filterPos === pos
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{isArabic ? 'ترتيب حسب:' : 'Sort by:'}</span>
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium cursor-pointer min-h-[36px]"
          >
            <option value="ovr">{isArabic ? 'التقييم العام (OVR)' : 'Overall Rating'}</option>
            <option value="value">{isArabic ? 'القيمة السوقية' : 'Market Value'}</option>
            <option value="age">{isArabic ? 'العمر' : 'Age'}</option>
            <option value="fitness">{isArabic ? 'الجاهزية البدنية' : 'Fitness'}</option>
          </select>
        </div>
      </div>

      {/* Players List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(player => (
          <div
            key={player.id}
            onClick={() => {
              sound.playClick();
              onSelectPlayer(player);
            }}
            className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-emerald-400 group-hover:scale-105 transition">
                    {player.position}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                      {isArabic ? player.arName : player.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {player.age} {isArabic ? 'سنة' : 'yrs'} · {player.nationality}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-black font-mono text-amber-400">{player.ovr}</span>
                  <span className="text-[9px] font-mono text-emerald-400">POT {player.potential}</span>
                </div>
              </div>

              {/* Attributes Mini Bar */}
              <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] py-2 border-t border-b border-white/5 mb-3">
                <div><span className="text-slate-400 block">PAC</span><span className="font-bold text-slate-200">{player.pace}</span></div>
                <div><span className="text-slate-400 block">SHO</span><span className="font-bold text-slate-200">{player.shooting}</span></div>
                <div><span className="text-slate-400 block">PAS</span><span className="font-bold text-slate-200">{player.passing}</span></div>
                <div><span className="text-slate-400 block">DRI</span><span className="font-bold text-slate-200">{player.dribbling}</span></div>
                <div><span className="text-slate-400 block">DEF</span><span className="font-bold text-slate-200">{player.defending}</span></div>
                <div><span className="text-slate-400 block">PHY</span><span className="font-bold text-slate-200">{player.physical}</span></div>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
              <span className="text-emerald-400 font-bold">${player.marketValue.toLocaleString()}</span>
              <span>${player.wage}/wk</span>
              <span className="text-slate-400">{player.contractYears} {isArabic ? 'سنوات' : 'yrs'}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${player.fitness > 85 ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'}`}>
                {player.fitness}% {isArabic ? 'جاهز' : 'fit'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
