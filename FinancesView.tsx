import React from 'react';
import { Club, Player } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, DollarSign, Coins, TrendingUp, TrendingDown, Building, Users, ShieldAlert, Award } from 'lucide-react';

interface FinancesViewProps {
  isArabic: boolean;
  myClub: Club;
  squad: Player[];
  onBack: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  isArabic,
  myClub,
  squad,
  onBack,
}) => {
  const weeklyWages = squad.reduce((acc, p) => acc + p.wage, 0);
  const matchdayGateRevenueEstimate = Math.round(myClub.stadiumCapacity * 0.8 * (18 + myClub.facilities.stands.level * 4));
  const passiveStoreRevenue = myClub.facilities.clubStore.level * 4500;
  const weeklyStaffCosts = 4500 + myClub.facilities.medicalClinic.level * 1200;

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
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'التقرير المالي والاقتصادي' : 'Club Financial Statement'}
            </h2>
            <span className="text-xs text-slate-400">
              {isArabic ? 'إدارة الميزانية بالدولار وعملة الكورو' : 'Operational Dollar & KORO Ledgers'}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Currency Distinction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Dollar Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              {isArabic ? 'العملة الأساسية: الدولار ($)' : 'Primary Currency: US Dollar ($)'}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
              ${myClub.budgetDollars.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              {isArabic
                ? 'تستخدم لصفقات الشراء ورواتب اللاعبين وتطوير مرافق النادي والملعب.'
                : 'Allocated for senior transfers, weekly payroll, and facility construction.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl shrink-0">
            💵
          </div>
        </div>

        {/* Koro Balance */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
              {isArabic ? 'العملة الخاصة: الكورو (KORO)' : 'Specialty Currency: KORO'}
            </span>
            <h3 className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
              {myClub.balanceKoro.toLocaleString()} <span className="text-lg font-sans text-purple-300">KORO</span>
            </h3>
            <p className="text-xs text-slate-300 mt-2">
              {isArabic
                ? 'مخصصة حصرياً لاكتشاف المواهب الناشئة وبرامج أكاديمية الشباب.'
                : 'Exclusively utilized for scouting prodigies and youth academy programs.'}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-3xl shrink-0">
            🪙
          </div>
        </div>
      </div>

      {/* Revenue vs Expenditure Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Sources */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              {isArabic ? 'مصادر الإيرادات والتدفق المالي' : 'Revenue Streams (Per Matchday)'}
            </h4>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'متوسط عوائد التذاكر (المباراة البيتية)' : 'Estimated Matchday Gate Receipts'}</span>
              <span className="text-emerald-400 font-bold">+${matchdayGateRevenueEstimate.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'أرباح متجر النادي والرعايات الأسبوعية' : 'Merchandise Store Passive Income'}</span>
              <span className="text-emerald-400 font-bold">+${passiveStoreRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'مكافأة الفوز في المباراة الرسمية' : 'Match Victory Performance Bonus'}</span>
              <span className="text-emerald-400 font-bold">+$15,000</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'جوائز نهاية الموسم وصعود الدرجة' : 'End of Season League Prize Pot'}</span>
              <span className="text-amber-400 font-bold">+$250,000+</span>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <TrendingDown className="w-5 h-5 text-rose-400" />
            <h4 className="text-sm font-bold text-white">
              {isArabic ? 'المصروفات والالتزامات الأسبوعية' : 'Recurring Expenses (Weekly)'}
            </h4>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'فاتورة رواتب الـ 22 لاعباً أسبوعياً' : 'Weekly Squad Player Payroll'}</span>
              <span className="text-rose-400 font-bold">-${weeklyWages.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'رواتب الطاقم الفني والطبي والكشافين' : 'Staff, Medical & Coaching Wages'}</span>
              <span className="text-rose-400 font-bold">-${weeklyStaffCosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'صيانة مرافق الملعب والأرضية العشبية' : 'Facility Maintenance & Pitch Upkeep'}</span>
              <span className="text-rose-400 font-bold">-$2,500</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-800/40">
              <span className="text-slate-300 font-sans">{isArabic ? 'تكلفة ترقية المنشآت والمرافق' : 'Capital Infrastructure Upgrades'}</span>
              <span className="text-slate-400 font-bold">{isArabic ? 'حسب الطلب' : 'On-Demand'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
