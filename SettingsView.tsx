import React, { useState } from 'react';
import { GameSettings, GameState } from '../../types/game';
import { exportSaveFile } from '../../utils/storage';
import { PWAInstallButton } from '../PWAInstallButton';
import { sound } from '../../utils/audio';
import { ArrowLeft, Settings, Volume2, VolumeX, Globe, Download, RefreshCw, Smartphone, CheckCircle, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  isArabic: boolean;
  settings: GameSettings;
  gameState: GameState;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetCareer: () => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isArabic,
  settings,
  gameState,
  onUpdateSettings,
  onResetCareer,
  onBack,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    sound.enabled = nextVal;
    if (nextVal) sound.playClick();
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
  };

  const toggleLanguage = () => {
    sound.playClick();
    const nextLang = settings.language === 'ar' ? 'en' : 'ar';
    onUpdateSettings({ ...settings, language: nextLang });
    if (typeof document !== 'undefined') {
      document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = nextLang;
    }
  };

  const handleExport = () => {
    sound.playRewardChime();
    exportSaveFile(gameState);
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
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
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'الإعدادات ونظام الحفظ' : 'Settings & Storage'}
            </h2>
            <span className="text-xs text-slate-400">
              {isArabic ? 'حفظ تلقائي مستمر في الذاكرة المحلية' : 'Automatic LocalStorage Persistence'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language & Sound Options */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">
            {isArabic ? 'خيارات العرض والصوت' : 'Display & Audio Preferences'}
          </h3>

          {/* Language Switcher */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'لغة اللعبة' : 'Game Language'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isArabic ? 'دعم كامل للكتابة العربية RTL والإنجليزية' : 'Full Arabic (RTL) & English support'}
                </span>
              </div>
            </div>

            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer min-h-[40px]"
            >
              {isArabic ? 'Switch to English' : 'التحويل للعربية'}
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'المؤثرات الصوتية وصافرة الحكم' : 'Audio SFX & Stadium Ambience'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {settings.soundEnabled ? (isArabic ? 'مفعلة' : 'Enabled') : (isArabic ? 'مكتومة' : 'Muted')}
                </span>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[40px] ${
                settings.soundEnabled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {settings.soundEnabled ? (isArabic ? 'كتم' : 'Mute') : (isArabic ? 'تشغيل' : 'Enable')}
            </button>
          </div>

          {/* Sim Speed Selector */}
          <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">
                {isArabic ? 'مدة محاكاة المباريات الافتراضية' : 'Default Match Sim Duration'}
              </span>
              <span className="font-mono text-emerald-400 text-xs font-bold">
                {settings.simSpeed}s
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([5, 10, 15] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => onUpdateSettings({ ...settings, simSpeed: sec })}
                  className={`py-2 text-xs font-mono font-bold rounded-xl transition cursor-pointer min-h-[40px] ${
                    settings.simSpeed === sec
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec} {isArabic ? 'ثوانٍ' : 'sec'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PWA & Backup / Reset Options */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">
            {isArabic ? 'التثبيت والنسخ الاحتياطي' : 'PWA & Data Backup'}
          </h3>

          {/* Install PWA trigger */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'تثبيت اللعبة كتطبيق للهاتف' : 'Install PWA to Home Screen'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isArabic ? 'جاهزة للتثبيت على Android و iOS دون متجر' : 'Instant fullscreen offline play'}
                </span>
              </div>
            </div>

            <PWAInstallButton isArabic={isArabic} />
          </div>

          {/* Export Save Game JSON */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-850 border border-slate-750">
            <div className="flex items-center gap-2.5">
              <Download className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  {isArabic ? 'تصدير ملف الحفظ JSON' : 'Export JSON Save File'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isArabic ? 'نسخة احتياطية آمنة يمكن استعادتها بأي وقت' : 'Download safe backup to your device'}
                </span>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer min-h-[40px]"
            >
              {exportedSuccess ? (isArabic ? 'تم التصدير!' : 'Exported!') : (isArabic ? 'تصدير الآن' : 'Export')}
            </button>
          </div>

          {/* Reset Career Danger Zone */}
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-300 block">
                  {isArabic ? 'إعادة ضبط وبدء مسيرة جديدة' : 'Reset Career & Start New'}
                </span>
                <span className="text-[10px] text-rose-400/80">
                  {isArabic ? 'مسح البيانات الحالية وبدء تجربة جديدة' : 'Erase current save and create new manager'}
                </span>
              </div>

              <button
                onClick={() => setShowConfirmReset(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition cursor-pointer min-h-[40px]"
              >
                {isArabic ? 'إعادة التعيين' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-600/60 p-6 text-white text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold">
              {isArabic ? 'تأكيد مسح مسيرة المدرب؟' : 'Confirm Career Reset?'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {isArabic
                ? 'سيتم حذف النادي الحالي وجميع اللاعبين والمستويات والميزانية نهائياً.'
                : 'All current progress, squad development, and levels will be erased.'}
            </p>
            <div className="flex items-center gap-2 mt-6">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold transition min-h-[44px]"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onResetCareer();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition min-h-[44px]"
              >
                {isArabic ? 'نعم، ابدأ من جديد' : 'Yes, Reset Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
