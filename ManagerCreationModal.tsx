import React, { useState } from 'react';
import { Club } from '../types/game';
import { ENGLISH_CLUBS } from '../data/clubs';
import { sound } from '../utils/audio';
import { Shield, User, Globe, DollarSign, Coins, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface ManagerCreationModalProps {
  isOpen: boolean;
  isArabic: boolean;
  onConfirm: (managerName: string, nationality: string, selectedClub: Club) => void;
  onCancel: () => void;
}

const NATIONALITIES = [
  { code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', flag: '🇪🇬' },
  { code: 'GB-ENG', nameEn: 'England', nameAr: 'إنجلترا', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'MA', nameEn: 'Morocco', nameAr: 'المغرب', flag: '🇲🇦' },
  { code: 'DZ', nameEn: 'Algeria', nameAr: 'الجزائر', flag: '🇩🇿' },
  { code: 'ES', nameEn: 'Spain', nameAr: 'إسبانيا', flag: '🇪🇸' },
  { code: 'FR', nameEn: 'France', nameAr: 'فرنسا', flag: '🇫🇷' },
  { code: 'DE', nameEn: 'Germany', nameAr: 'ألمانيا', flag: '🇩🇪' },
  { code: 'IT', nameEn: 'Italy', nameAr: 'إيطاليا', flag: '🇮🇹' },
  { code: 'AR', nameEn: 'Argentina', nameAr: 'الأرجنتين', flag: '🇦🇷' },
  { code: 'BR', nameEn: 'Brazil', nameAr: 'البرازيل', flag: '🇧🇷' },
];

export const ManagerCreationModal: React.FC<ManagerCreationModalProps> = ({
  isOpen,
  isArabic,
  onConfirm,
  onCancel,
}) => {
  const [managerName, setManagerName] = useState(isArabic ? 'طارق العلي' : 'James Sterling');
  const [nationality, setNationality] = useState(NATIONALITIES[2]); // England default
  const [selectedClubId, setSelectedClubId] = useState(ENGLISH_CLUBS[0].id); // York City default (Tier 5)
  const [selectedTierFilter, setSelectedTierFilter] = useState<number>(5);

  if (!isOpen) return null;

  const filteredClubs = ENGLISH_CLUBS.filter(c => c.tier === selectedTierFilter);
  const currentClub = ENGLISH_CLUBS.find(c => c.id === selectedClubId) || ENGLISH_CLUBS[0];

  const handleStartCareer = () => {
    sound.playTransferSuccess();
    onConfirm(managerName.trim() || (isArabic ? 'المدرب الجديد' : 'Head Coach'), nationality.nameAr, currentClub);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isArabic ? 'إنشاء مسيرة المدرب الجديدة' : 'Create New Manager Career'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isArabic
              ? 'اختر هويتك التدريبية، وابدأ رحلتك من الدرجات الإنجليزية المنخفضة لبناء المجد'
              : 'Choose your managerial persona and pick your starting English lower league club'}
          </p>
        </div>

        {/* Step 1: Manager Name & Nationality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? 'اسم المدرب' : 'Manager Name'}</span>
            </label>
            <input
              type="text"
              value={managerName}
              onChange={e => setManagerName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white min-h-[44px]"
              placeholder={isArabic ? 'أدخل اسمك التدريبي' : 'Enter coach name'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? 'الجنسية' : 'Nationality'}</span>
            </label>
            <select
              value={nationality.code}
              onChange={e => {
                const found = NATIONALITIES.find(n => n.code === e.target.value);
                if (found) setNationality(found);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-semibold focus:outline-none focus:border-emerald-500 text-white min-h-[44px] cursor-pointer"
            >
              {NATIONALITIES.map(n => (
                <option key={n.code} value={n.code} className="bg-slate-900">
                  {n.flag} {isArabic ? n.nameAr : n.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Tier Selection Tabs */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            {isArabic ? 'الدرجة الانطلاقية للمسيرة' : 'Starting Pyramid Tier'}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <button
              onClick={() => {
                setSelectedTierFilter(5);
                setSelectedClubId(ENGLISH_CLUBS.filter(c => c.tier === 5)[0].id);
                sound.playClick();
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                selectedTierFilter === 5
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isArabic ? 'الدرجة الخامسة (الناشيونال ليغ)' : 'Tier 5 (National League)'}</span>
            </button>
            <button
              onClick={() => {
                setSelectedTierFilter(4);
                setSelectedClubId(ENGLISH_CLUBS.filter(c => c.tier === 4)[0].id);
                sound.playClick();
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                selectedTierFilter === 4
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isArabic ? 'الدرجة الرابعة (ليغ تو)' : 'Tier 4 (League Two)'}</span>
            </button>
          </div>
        </div>

        {/* Step 3: Club Grid Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            {isArabic ? 'اختر النادي الذي ستقوده إلى المجد' : 'Select Club to Manage'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
            {filteredClubs.map(c => {
              const isSelected = c.id === selectedClubId;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedClubId(c.id);
                    sound.playClick();
                  }}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[72px] ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-400'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-2xl">{c.crestIcon}</span>
                  <span className="text-xs font-bold truncate max-w-full">
                    {isArabic ? c.arName : c.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {c.stadiumCapacity.toLocaleString()} {isArabic ? 'مقعد' : 'seats'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Club Summary Overview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-slate-850 border border-slate-700 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center text-3xl">
              {currentClub.crestIcon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {isArabic ? currentClub.arName : currentClub.name}
              </h4>
              <p className="text-xs text-slate-400">
                {isArabic ? currentClub.divisionNameAr : currentClub.divisionNameEn} · {currentClub.stadiumName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-800/40">
              <DollarSign className="w-3.5 h-3.5" />
              <span>${currentClub.budgetDollars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-400 bg-purple-950/40 px-2.5 py-1.5 rounded-lg border border-purple-800/40">
              <Coins className="w-3.5 h-3.5" />
              <span>{currentClub.balanceKoro} KORO</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer min-h-[44px]"
          >
            {isArabic ? 'رجوع' : 'Cancel'}
          </button>
          
          <button
            onClick={handleStartCareer}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black shadow-lg shadow-emerald-900/40 active:scale-95 transition flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isArabic ? 'تأكيد العقد وبدء المسيرة' : 'Sign Contract & Launch Career'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
