import React from 'react';
import { Club, Facility, FacilityType } from '../types/game';
import { sound } from '../utils/audio';
import { Building, Users, Sun, Smile, Target, Dumbbell, HeartPulse, Compass, GraduationCap, ShoppingBag, ArrowUp, DollarSign, X } from 'lucide-react';

interface FacilitiesModalProps {
  isOpen: boolean;
  isArabic: boolean;
  myClub: Club;
  onUpgradeFacility: (facilityType: FacilityType) => void;
  onClose: () => void;
}

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  Building: <Building className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
};

export const FacilitiesModal: React.FC<FacilitiesModalProps> = ({
  isOpen,
  isArabic,
  myClub,
  onUpgradeFacility,
  onClose,
}) => {
  if (!isOpen) return null;

  const facilitiesList = Object.values(myClub.facilities);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto relative">
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/30">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isArabic ? 'تطوير النادي والمرافق العشرة' : 'Club Infrastructure & 10 Facilities'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic
                  ? 'قم بترقية البنية التحتية لزيادة أرباح التذاكر وتسريع التدريب وخفض الإصابات'
                  : 'Upgrade infrastructure to boost revenues, fast-track training, and reduce injuries'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 font-mono text-emerald-300 text-sm font-bold">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>${myClub.budgetDollars.toLocaleString()}</span>
          </div>
        </div>

        {/* 10 Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-5 max-h-[62vh] overflow-y-auto pr-1">
          {facilitiesList.map(fac => {
            const isMax = fac.level >= fac.maxLevel;
            const upgradeCost = Math.round(fac.costDollars * Math.pow(1.6, fac.level - 1));
            const canAfford = myClub.budgetDollars >= upgradeCost;

            return (
              <div
                key={fac.id}
                className="p-4 rounded-2xl bg-slate-850/60 border border-slate-700/70 hover:border-slate-600 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
                        {FACILITY_ICONS[fac.iconName] || <Building className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {isArabic ? fac.nameAr : fac.nameEn}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {isArabic ? `المستوى ${fac.level} من ${fac.maxLevel}` : `Level ${fac.level} / ${fac.maxLevel}`}
                        </span>
                      </div>
                    </div>

                    {/* Level Dots */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: fac.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            i < fac.level ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Perk Benefit */}
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-emerald-300/90 font-medium mb-3">
                    {isArabic ? fac.perkAr : fac.perkEn}
                  </div>
                </div>

                {/* Upgrade Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="font-mono text-xs text-slate-300">
                    {isMax ? (
                      <span className="text-amber-400 font-bold">{isArabic ? 'الحد الأقصى' : 'MAX LEVEL'}</span>
                    ) : (
                      <>
                        <span className="text-slate-400">{isArabic ? 'تكلفة الترقية: ' : 'Cost: '}</span>
                        <span className="text-emerald-400 font-bold">${upgradeCost.toLocaleString()}</span>
                      </>
                    )}
                  </span>

                  {!isMax && (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          sound.playRewardChime();
                          onUpgradeFacility(fac.id);
                        }
                      }}
                      disabled={!canAfford}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'ترقية' : 'Upgrade'}</span>
                    </button>
                  )}
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
