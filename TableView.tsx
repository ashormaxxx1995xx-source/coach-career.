import React from 'react';
import { Club, LeagueEntry } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArrowLeft, Trophy, ArrowUp, ArrowDown, Shield } from 'lucide-react';

interface TableViewProps {
  isArabic: boolean;
  myClub: Club;
  leagueTable: LeagueEntry[];
  currentMatchDay: number;
  totalMatchDays: number;
  currentSeason: number;
  onBack: () => void;
}

export const TableView: React.FC<TableViewProps> = ({
  isArabic,
  myClub,
  leagueTable,
  currentMatchDay,
  totalMatchDays,
  currentSeason,
  onBack,
}) => {
  // Sort table by Points, then GD, then GF
  const sortedTable = [...leagueTable].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

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
          <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">
              {isArabic ? myClub.divisionNameAr : myClub.divisionNameEn}
            </h2>
            <span className="text-xs text-slate-400">
              {isArabic ? `الموسم ${currentSeason} · الجولة ${currentMatchDay} من ${totalMatchDays}` : `Season ${currentSeason} · Matchday ${currentMatchDay} of ${totalMatchDays}`}
            </span>
          </div>
        </div>
      </div>

      {/* Zone Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mb-4 px-2">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>{isArabic ? 'صعود مباشر إلى الدرجة الأعلى' : 'Automatic Promotion'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sky-400">
          <div className="w-3 h-3 rounded-full bg-sky-500" />
          <span>{isArabic ? 'ملحق الصعود (Play-offs)' : 'Play-offs'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-400">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>{isArabic ? 'منطقة الهبوط' : 'Relegation Zone'}</span>
        </div>
      </div>

      {/* Standings Table Container */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3 sm:px-4">#</th>
                <th className="py-3 px-3 sm:px-4">{isArabic ? 'النادي' : 'Club'}</th>
                <th className="py-3 px-2 sm:px-3 text-center">{isArabic ? 'لعب' : 'PL'}</th>
                <th className="py-3 px-2 sm:px-3 text-center">{isArabic ? 'فاز' : 'W'}</th>
                <th className="py-3 px-2 sm:px-3 text-center">{isArabic ? 'تعادل' : 'D'}</th>
                <th className="py-3 px-2 sm:px-3 text-center">{isArabic ? 'خسر' : 'L'}</th>
                <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">{isArabic ? 'له' : 'GF'}</th>
                <th className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell">{isArabic ? 'عليه' : 'GA'}</th>
                <th className="py-3 px-2 sm:px-3 text-center">{isArabic ? 'الفارق' : 'GD'}</th>
                <th className="py-3 px-3 sm:px-4 text-center font-bold text-white">{isArabic ? 'النقاط' : 'PTS'}</th>
                <th className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">{isArabic ? 'الشكل الأخير' : 'Form'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sortedTable.map((entry, idx) => {
                const rank = idx + 1;
                const isMyClub = entry.clubId === myClub.id;
                const isPromo = rank <= 2;
                const isPlayoff = rank >= 3 && rank <= 4;
                const isRelegation = rank >= sortedTable.length - 1;

                return (
                  <tr
                    key={entry.clubId}
                    className={`transition ${
                      isMyClub
                        ? 'bg-emerald-950/40 text-emerald-300 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-emerald-400'
                        : 'hover:bg-slate-800/40 text-slate-200'
                    }`}
                  >
                    <td className="py-3 px-3 sm:px-4 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            isPromo
                              ? 'bg-emerald-500/20 text-emerald-400 font-black'
                              : isPlayoff
                              ? 'bg-sky-500/20 text-sky-400'
                              : isRelegation
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {rank}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 sm:px-4 font-sans font-bold">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[140px] sm:max-w-[200px]">
                          {isArabic ? entry.clubArName : entry.clubName}
                        </span>
                        {isMyClub && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                            {isArabic ? 'فريقك' : 'YOU'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-2 sm:px-3 text-center">{entry.played}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-emerald-400">{entry.won}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-slate-400">{entry.drawn}</td>
                    <td className="py-3 px-2 sm:px-3 text-center text-rose-400">{entry.lost}</td>
                    <td className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell text-slate-400">{entry.gf}</td>
                    <td className="py-3 px-2 sm:px-3 text-center hidden sm:table-cell text-slate-400">{entry.ga}</td>
                    <td className={`py-3 px-2 sm:px-3 text-center font-bold ${entry.gd > 0 ? 'text-emerald-400' : entry.gd < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {entry.gd > 0 ? `+${entry.gd}` : entry.gd}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-center font-black text-amber-400 text-sm sm:text-base">
                      {entry.points}
                    </td>

                    {/* Recent Form Badge Ticker */}
                    <td className="py-3 px-3 sm:px-4 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {entry.form.map((res, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black ${
                              res === 'W'
                                ? 'bg-emerald-500 text-slate-950'
                                : res === 'D'
                                ? 'bg-slate-600 text-white'
                                : 'bg-rose-600 text-white'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
