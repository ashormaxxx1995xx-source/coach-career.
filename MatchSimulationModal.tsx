import React, { useEffect, useState } from 'react';
import { Club, MatchResult, Player, Tactics } from '../types/game';
import { simulateMatch } from '../utils/matchEngine';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Play, FastForward, Trophy, Star, Shield, Activity, Flame, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface MatchSimulationModalProps {
  isOpen: boolean;
  isArabic: boolean;
  myClub: Club;
  opponentClub: Club;
  mySquad: Player[];
  opponentSquad: Player[];
  tactics: Tactics;
  simDurationSec: 5 | 10 | 15;
  onChangeSimDuration: (sec: 5 | 10 | 15) => void;
  onFinishMatch: (result: MatchResult) => void;
  onClose: () => void;
}

const LIVE_COMMENTARY_MESSAGES_AR = [
  '⏱️ صافرة البداية تنطلق والحماس يشتعل في المدرجات!',
  '⚡ فريقك يشن هجمة منسقة عبر الأطراف وضغط هجومي كاسح.',
  '⚠️ فرصة خطيرة وتسديدة قوية تمر بجوار القائم بسنتيمترات!',
  '🚀 هجمة مرتدة سريعة وسرعة انقضاض من خط الوسط.',
  '🧤 تصدٍ رائع من الحارس يحول الكرة إلى ركلة ركنية!',
  '🔥 ضغط هجومي متواصل وارتباك في دفاع الخصم.',
  '🛡️ تدخل دفاعي فدائي يقطع انفراداً محققاً للخصم.',
  '⚡ تبادل كرات سريع ولمسات ساحرة في منطقة الجزاء.',
];

const LIVE_COMMENTARY_MESSAGES_EN = [
  '⏱️ Referee blows the whistle! Electric atmosphere in the stadium!',
  '⚡ Your team builds a fluid attack down the wings with high tempo.',
  '⚠️ Dangerous opportunity, strike whistles inches past the post!',
  '🚀 Fast counter-attack breaking through the midfield.',
  '🧤 Brilliant diving fingertip save pushing the ball out for a corner!',
  '🔥 Relentless attacking pressure rattling the opposition defense.',
  '🛡️ Heroic last-ditch slide tackle prevents an open goal chance.',
  '⚡ Rapid one-touch passing unlocking space in the penalty area.',
];

export const MatchSimulationModal: React.FC<MatchSimulationModalProps> = ({
  isOpen,
  isArabic,
  myClub,
  opponentClub,
  mySquad,
  opponentSquad,
  tactics,
  simDurationSec,
  onChangeSimDuration,
  onFinishMatch,
  onClose,
}) => {
  const [phase, setPhase] = useState<'ready' | 'simulating' | 'finished'>('ready');
  const [activeCommentary, setActiveCommentary] = useState<string>('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [simProgress, setSimProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPhase('ready');
      setMatchResult(null);
      setSimProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartSim = () => {
    sound.playWhistle();
    setPhase('simulating');

    // Simulate match data deterministically
    const result = simulateMatch(myClub, opponentClub, mySquad, opponentSquad, tactics, true);
    setMatchResult(result);

    const msTotal = simDurationSec * 1000;
    const intervalMs = 100;
    let elapsed = 0;

    const messages = isArabic ? LIVE_COMMENTARY_MESSAGES_AR : LIVE_COMMENTARY_MESSAGES_EN;
    setActiveCommentary(messages[0]);

    const timer = setInterval(() => {
      elapsed += intervalMs;
      const progress = Math.min(100, Math.round((elapsed / msTotal) * 100));
      setSimProgress(progress);

      // Change commentary phrases
      const msgIndex = Math.floor((progress / 100) * messages.length);
      setActiveCommentary(messages[Math.min(messages.length - 1, msgIndex)]);

      if (elapsed >= msTotal) {
        clearInterval(timer);
        finalizeResult(result);
      }
    }, intervalMs);
  };

  const handleInstantSkip = () => {
    if (phase === 'simulating' && matchResult) {
      finalizeResult(matchResult);
    }
  };

  const finalizeResult = (result: MatchResult) => {
    setPhase('finished');
    sound.playWhistle();

    // Trigger celebration if won
    if (result.homeStats.score > result.awayStats.score) {
      sound.playGoalCheer();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        console.error(e);
      }
    } else {
      sound.playRewardChime();
    }
  };

  const handleAcceptAndExit = () => {
    if (matchResult) {
      onFinishMatch(matchResult);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-100 my-auto relative">
        {/* Top Bar with Speed Toggles */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white">
              {isArabic ? 'محاكاة المباراة التكتيكية' : 'Matchday Simulation'}
            </h2>
          </div>

          {phase === 'ready' && (
            <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 px-2 font-semibold">
                {isArabic ? 'سرعة المحاكاة:' : 'Speed:'}
              </span>
              {([5, 10, 15] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => onChangeSimDuration(sec)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg transition cursor-pointer min-h-[36px] ${
                    simDurationSec === sec
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}

          {phase !== 'simulating' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Clash Matchup Card */}
        <div className="grid grid-cols-3 items-center py-5 px-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6 text-center">
          {/* Home Club */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-emerald-500/50 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/40">
              {myClub.crestIcon}
            </div>
            <span className="text-sm font-bold text-white mt-2 truncate max-w-[110px]">
              {isArabic ? myClub.arName : myClub.name}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              {isArabic ? 'فريقك (صاحب الأرض)' : 'Home'}
            </span>
          </div>

          {/* Center Score / State */}
          <div className="flex flex-col items-center">
            {phase === 'finished' && matchResult ? (
              <div className="flex items-center gap-3 font-mono">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                  {matchResult.homeStats.score}
                </span>
                <span className="text-2xl text-slate-600">:</span>
                <span className="text-4xl sm:text-5xl font-black text-rose-400">
                  {matchResult.awayStats.score}
                </span>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-sm font-black text-amber-400">
                VS
              </div>
            )}
            <span className="text-[10px] text-slate-400 mt-2 font-mono">
              {myClub.stadiumName}
            </span>
          </div>

          {/* Away Club */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-rose-500/30 flex items-center justify-center text-3xl shadow-lg">
              {opponentClub.crestIcon}
            </div>
            <span className="text-sm font-bold text-white mt-2 truncate max-w-[110px]">
              {isArabic ? opponentClub.arName : opponentClub.name}
            </span>
            <span className="text-[10px] text-rose-400 font-semibold">
              {isArabic ? 'الخصم' : 'Away'}
            </span>
          </div>
        </div>

        {/* Phase 1: Ready to Kickoff */}
        {phase === 'ready' && (
          <div className="text-center py-4">
            <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-md mx-auto leading-relaxed">
              {isArabic
                ? 'جاهزية التشكيلة مكتملة، خطة اللعب والخطة التكتيكية تم تزويد اللاعبين بها. اضغط لبدء المباراة ومتابعة المجريات!'
                : 'Starting XI ready, tactical directives briefed to the squad. Hit kick-off to simulate!'}
            </p>
            <button
              onClick={handleStartSim}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white text-base font-black shadow-xl shadow-emerald-950/50 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer min-h-[54px]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isArabic ? 'ابدأ المباراة الآن ⚽' : 'Kick Off Match Now ⚽'}</span>
            </button>
          </div>
        )}

        {/* Phase 2: Simulating Live Event Ticker */}
        {phase === 'simulating' && (
          <div className="text-center py-4">
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-100"
                style={{ width: `${simProgress}%` }}
              />
            </div>

            {/* Live Changing Commentary Text */}
            <div className="min-h-[72px] flex items-center justify-center px-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-6">
              <span className="text-sm sm:text-base font-bold text-emerald-300 animate-pulse">
                {activeCommentary}
              </span>
            </div>

            {/* Fast Forward Skip Button */}
            <button
              onClick={handleInstantSkip}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer min-h-[44px]"
            >
              <FastForward className="w-4 h-4 text-amber-400" />
              <span>{isArabic ? 'تسريع وإنهاء مباشر' : 'Fast Forward to Result'}</span>
            </button>
          </div>
        )}

        {/* Phase 3: Post Match Report & Stats */}
        {phase === 'finished' && matchResult && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Goals Scored List */}
            {matchResult.events.filter(e => e.type === 'goal').length > 0 && (
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block mb-1">
                  {isArabic ? 'أهداف المواجهة:' : 'Goals:'}
                </span>
                {matchResult.events
                  .filter(e => e.type === 'goal')
                  .map((e, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center justify-between">
                      <span className="font-semibold">{e.textAr || e.textEn}</span>
                      <span className="text-emerald-400 font-mono font-bold">{e.minute}'</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Match Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
              <div className="text-emerald-400 font-bold">{matchResult.homeStats.possession}%</div>
              <div className="text-slate-400 font-sans">{isArabic ? 'الاستحواذ' : 'Possession'}</div>
              <div className="text-rose-400 font-bold">{matchResult.awayStats.possession}%</div>

              <div className="text-emerald-400 font-bold">{matchResult.homeStats.shots}</div>
              <div className="text-slate-400 font-sans">{isArabic ? 'التسديدات' : 'Shots'}</div>
              <div className="text-rose-400 font-bold">{matchResult.awayStats.shots}</div>

              <div className="text-emerald-400 font-bold">{matchResult.homeStats.shotsOnTarget}</div>
              <div className="text-slate-400 font-sans">{isArabic ? 'على المرمى' : 'On Target'}</div>
              <div className="text-rose-400 font-bold">{matchResult.awayStats.shotsOnTarget}</div>

              <div className="text-emerald-400 font-bold">{matchResult.homeStats.fouls}</div>
              <div className="text-slate-400 font-sans">{isArabic ? 'الأخطاء' : 'Fouls'}</div>
              <div className="text-rose-400 font-bold">{matchResult.awayStats.fouls}</div>
            </div>

            {/* Man of the Match (MOTM) & Gate Receipts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/30 flex items-center gap-3">
                <Star className="w-5 h-5 text-amber-400 shrink-0 fill-current" />
                <div>
                  <span className="text-[10px] text-amber-400 font-semibold block">
                    {isArabic ? 'رجل المباراة (الأفضل)' : 'Man of the Match'}
                  </span>
                  <span className="font-bold text-white">{matchResult.motmPlayerName}</span>
                  <span className="text-amber-300 font-mono ml-2 font-bold">({matchResult.motmRating} ★)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-600/30 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    {isArabic ? 'عوائد تذاكر الجماهير' : 'Matchday Gate Income'}
                  </span>
                  <span className="font-bold text-white font-mono">+${matchResult.gateIncome.toLocaleString()}</span>
                  <span className="text-slate-400 text-[10px] ml-1">({matchResult.attendance.toLocaleString()} مشجع)</span>
                </div>
              </div>
            </div>

            {/* Return / Accept Button */}
            <button
              onClick={handleAcceptAndExit}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-black shadow-lg shadow-emerald-950/40 active:scale-98 transition cursor-pointer min-h-[48px]"
            >
              {isArabic ? 'العودة للمقر واعتماد النتيجة' : 'Accept Result & Return to HQ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
