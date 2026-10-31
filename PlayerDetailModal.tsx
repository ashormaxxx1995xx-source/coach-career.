import React, { useState } from 'react';
import { Player, SkillType } from '../types/game';
import { sound } from '../utils/audio';
import { User, Shield, Target, Award, Dumbbell, Zap, DollarSign, Calendar, Heart, X, Check, ArrowUp } from 'lucide-react';

interface PlayerDetailModalProps {
  player: Player | null;
  isArabic: boolean;
  trainingFacilityLevel: number;
  clubBudget: number;
  onClose: () => void;
  onSetTraining: (playerId: string, skill: SkillType) => void;
  onRenewContract: (playerId: string) => void;
  onToggleTransferList: (playerId: string) => void;
  isTransferListed?: boolean;
}

const SKILLS: { id: SkillType; nameEn: string; nameAr: string; icon: string }[] = [
  { id: 'pace', nameEn: 'Pace & Sprints', nameAr: 'السرعة والانطلاق', icon: '⚡' },
  { id: 'shooting', nameEn: 'Shooting & Finishing', nameAr: 'التسديد وإنهاء الهجمات', icon: '🎯' },
  { id: 'passing', nameEn: 'Passing & Vision', nameAr: 'التمرير والرؤية', icon: '👟' },
  { id: 'dribbling', nameEn: 'Dribbling & Agility', nameAr: 'المراوغة والرشاقة', icon: '🪄' },
  { id: 'defending', nameEn: 'Defending & Tackling', nameAr: 'الدفاع وافتكاك الكرة', icon: '🛡️' },
  { id: 'physical', nameEn: 'Physical Strength', nameAr: 'القوة البدنية والصراعات', icon: '💪' },
  { id: 'stamina', nameEn: 'Stamina & Endurance', nameAr: 'التحمل واللياقة البدنية', icon: '🫀' },
];

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  isArabic,
  trainingFacilityLevel,
  clubBudget,
  onClose,
  onSetTraining,
  onRenewContract,
  onToggleTransferList,
  isTransferListed = false,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillType>(player?.trainingFocus || 'shooting');

  if (!player) return null;

  const handleApplyTraining = () => {
    sound.playClick();
    onSetTraining(player.id, selectedSkill);
  };

  const handleRenew = () => {
    sound.playRewardChime();
    onRenewContract(player.id);
  };

  const renewalCost = Math.round(player.wage * 25);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player Header Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-slate-800">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-800 to-emerald-950 border-2 border-emerald-400/40 flex items-center justify-center text-4xl shadow-lg">
              🏃
            </div>
            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-xs">
              {player.position}
            </div>
          </div>

          <div className="text-center sm:text-right flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isArabic ? player.arName : player.name}
              </h2>
              {player.isCaptain && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  {isArabic ? 'قائد الفريق' : 'Captain'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {player.age} {isArabic ? 'سنة' : 'years'} · {player.nationality} · {isArabic ? 'التقييم' : 'OVR'}: <span className="font-mono font-bold text-amber-400">{player.ovr}</span> (POT: <span className="font-mono text-emerald-400">{player.potential}</span>)
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs font-mono">
              <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-slate-400">{isArabic ? 'القيمة: ' : 'Value: '}</span>
                <span className="text-emerald-400 font-bold">${player.marketValue.toLocaleString()}</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-slate-400">{isArabic ? 'الراتب: ' : 'Wage: '}</span>
                <span className="text-amber-300 font-bold">${player.wage.toLocaleString()}/wk</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-slate-400">{isArabic ? 'العقد: ' : 'Contract: '}</span>
                <span className="text-white font-bold">{player.contractYears} {isArabic ? 'سنوات' : 'yrs'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Skill Attribute Bars */}
        <div className="my-5">
          <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>{isArabic ? 'القدرات والمهارات الفردية' : 'Individual Attributes & Skills'}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            {[
              { label: isArabic ? 'السرعة (PAC)' : 'Pace (PAC)', val: player.pace },
              { label: isArabic ? 'التسديد (SHO)' : 'Shooting (SHO)', val: player.shooting },
              { label: isArabic ? 'التمرير (PAS)' : 'Passing (PAS)', val: player.passing },
              { label: isArabic ? 'المراوغة (DRI)' : 'Dribbling (DRI)', val: player.dribbling },
              { label: isArabic ? 'الدفاع (DEF)' : 'Defending (DEF)', val: player.defending },
              { label: isArabic ? 'البدنية (PHY)' : 'Physical (PHY)', val: player.physical },
              { label: isArabic ? 'التحمل (STA)' : 'Stamina (STA)', val: player.stamina },
              { label: isArabic ? 'الجاهزية' : 'Fitness', val: player.fitness },
            ].map((attr, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-400 font-sans truncate">{attr.label}</span>
                  <span className={`font-bold ${attr.val >= 75 ? 'text-emerald-400' : attr.val >= 60 ? 'text-amber-300' : 'text-slate-300'}`}>
                    {attr.val}
                  </span>
                </div>
                <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${attr.val >= 75 ? 'bg-emerald-500' : attr.val >= 60 ? 'bg-amber-400' : 'bg-slate-400'}`}
                    style={{ width: `${Math.min(100, attr.val)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Training Section */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">
                {isArabic ? 'برنامج التدريب الفردي المتخصص' : 'Targeted Individual Training'}
              </h4>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold font-mono">
              {isArabic ? `مرفق التدريب: مستوى ${trainingFacilityLevel}` : `Facility Level: ${trainingFacilityLevel}`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {SKILLS.map(sk => {
              const isSelected = selectedSkill === sk.id;
              return (
                <button
                  key={sk.id}
                  onClick={() => setSelectedSkill(sk.id)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{sk.icon}</span>
                  <span className="truncate">{isArabic ? sk.nameAr : sk.nameEn}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 text-[11px]">
              {isArabic
                ? 'تتأثر سرعة التطور بعمر اللاعب وإمكاناته ومستوى مرافق التدريب ومشاركته في المباريات.'
                : 'Development pace scales with player potential, training facility level, and match minutes.'}
            </span>
            <button
              onClick={handleApplyTraining}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px]"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تثبيت البرنامج' : 'Assign Program'}</span>
            </button>
          </div>
        </div>

        {/* Management Actions: Contract & Transfer Listing */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRenew}
              disabled={clubBudget < renewalCost}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? `تجديد العقد (+سنة) -$${renewalCost.toLocaleString()}` : `Extend (+1 Yr) -$${renewalCost.toLocaleString()}`}</span>
            </button>

            <button
              onClick={() => onToggleTransferList(player.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] ${
                isTransferListed
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isTransferListed
                ? (isArabic ? 'إلغاء العرض في الميركاتو' : 'Delist from Market')
                : (isArabic ? 'عرض اللاعب للبيع' : 'List on Transfer Market')}
            </button>
          </div>

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
