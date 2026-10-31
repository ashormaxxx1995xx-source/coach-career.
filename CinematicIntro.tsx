import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/audio';
import { Play, Sparkles, Trophy, Shield, Volume2, VolumeX } from 'lucide-react';

interface CinematicIntroProps {
  onStartGame: () => void;
  isArabic: boolean;
  onToggleLanguage: () => void;
  hasSavedGame: boolean;
  onContinueGame: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onStartGame,
  isArabic,
  onToggleLanguage,
  hasSavedGame,
  onContinueGame,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [isPressing, setIsPressing] = useState(false);

  // Dynamic particle canvas rendering stadium floodlight atmosphere, night mist, and football energy
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles for floodlight dust and crowd sparklers
    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: -Math.random() * 0.9 - 0.2,
        opacity: Math.random() * 0.7 + 0.2,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep stadium night sky with emerald & royal navy radial gradients
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.5, '#061727');
      skyGrad.addColorStop(0.85, '#042217');
      skyGrad.addColorStop(1, '#02120a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Floodlight cones left and right
      const leftLight = ctx.createRadialGradient(0, 0, 10, 0, 0, width * 0.7);
      leftLight.addColorStop(0, 'rgba(16, 185, 129, 0.28)');
      leftLight.addColorStop(0.5, 'rgba(14, 165, 233, 0.12)');
      leftLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = leftLight;
      ctx.fillRect(0, 0, width, height);

      const rightLight = ctx.createRadialGradient(width, 0, 10, width, 0, width * 0.7);
      rightLight.addColorStop(0, 'rgba(234, 179, 8, 0.25)');
      rightLight.addColorStop(0.5, 'rgba(239, 68, 68, 0.1)');
      rightLight.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rightLight;
      ctx.fillRect(0, 0, width, height);

      // Stadium floodlight beam sweep
      const beamX = (Math.sin(t) * 0.3 + 0.5) * width;
      const beamGrad = ctx.createLinearGradient(beamX - 150, 0, beamX + 150, height);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(width * 0.5, 0);
      ctx.lineTo(beamX - 250, height);
      ctx.lineTo(beamX + 250, height);
      ctx.closePath();
      ctx.fill();

      // Atmospheric floating particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(52, 211, 153, ${p.opacity * (Math.sin(t + p.x) * 0.3 + 0.7)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStart = () => {
    setIsPressing(true);
    sound.playWhistle();
    setTimeout(() => {
      sound.playGoalCheer();
      onStartGame();
    }, 450);
  };

  const handleContinue = () => {
    sound.playClick();
    onContinueGame();
  };

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundEnabled(sound.enabled);
    if (sound.enabled) sound.playClick();
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden text-white select-none">
      {/* Background Atmosphere Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Floating Controls */}
      <header className="relative z-10 w-full max-w-5xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-emerald-400">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>PRO MANAGEMENT SIMULATOR</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          
          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 backdrop-blur-md border border-white/10 text-xs font-bold text-slate-200 transition cursor-pointer min-h-[44px]"
          >
            {isArabic ? 'English' : 'العربية'}
          </button>
        </div>
      </header>

      {/* Center Cinematic Hero Area */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl my-auto">
        {/* Dynamic Football Icons Showcase: Ronaldo & Messi Visual Tribute */}
        <div className="relative mb-6 flex items-center justify-center gap-4">
          {/* Messi Card Tribute */}
          <div className="relative w-28 sm:w-36 h-36 sm:h-44 rounded-2xl bg-gradient-to-b from-sky-900/60 via-slate-900/80 to-black border-2 border-sky-400/40 p-2 flex flex-col items-center justify-between shadow-2xl shadow-sky-500/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="w-full flex justify-between items-center text-[10px] text-sky-300 font-bold">
              <span>ARG #10</span>
              <span className="text-amber-400 font-mono">94 OVR</span>
            </div>
            {/* Stylized Silhouette */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/40 border border-sky-300/40">
                👑
              </div>
            </div>
            <div className="text-center">
              <span className="block text-xs font-black tracking-wide text-white">L. MESSI</span>
              <span className="text-[9px] text-sky-400">THE MAESTRO</span>
            </div>
          </div>

          {/* VS Center Ring */}
          <div className="w-12 h-12 rounded-full bg-slate-900/90 border-2 border-amber-400/80 flex items-center justify-center text-xs font-black text-amber-300 shadow-xl shadow-amber-500/30 z-20">
            VS
          </div>

          {/* Ronaldo Card Tribute */}
          <div className="relative w-28 sm:w-36 h-36 sm:h-44 rounded-2xl bg-gradient-to-b from-red-950/60 via-slate-900/80 to-black border-2 border-rose-500/40 p-2 flex flex-col items-center justify-between shadow-2xl shadow-rose-500/20 transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <div className="w-full flex justify-between items-center text-[10px] text-rose-300 font-bold">
              <span>POR #7</span>
              <span className="text-amber-400 font-mono">94 OVR</span>
            </div>
            {/* Stylized Silhouette */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-3xl shadow-lg shadow-rose-500/40 border border-rose-300/40">
                ⚡
              </div>
            </div>
            <div className="text-center">
              <span className="block text-xs font-black tracking-wide text-white">C. RONALDO</span>
              <span className="text-[9px] text-rose-400">THE PHENOMENON</span>
            </div>
          </div>
        </div>

        {/* Game Title Headers */}
        <div className="space-y-1 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'اللعبة الإدارية الكروية الاحترافية' : 'The Ultimate Football Manager Sim'}</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-400 drop-shadow-md">
            COACH CAREER
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-wide mt-1">
            {isArabic ? 'مسيرة المدرب' : 'The Road to European Glory'}
          </h2>
          <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed mt-3">
            {isArabic
              ? 'ابدأ من أزقة وأندية إنجلترا المتواضعة، وطور لاعبيك وناشئيك وحقق البطولات حتى تبلغ قمة عرش كرة القدم العالمية!'
              : 'Start from English lower league underdogs, develop young prodigies, master tactics, and conquer world football!'}
          </p>
        </div>

        {/* 3D FLOATING START BUTTON - Real 3D Extruded Physical Look */}
        <div className="relative my-4 flex flex-col items-center gap-3">
          <button
            onClick={handleStart}
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
            onTouchStart={() => setIsPressing(true)}
            onTouchEnd={() => setIsPressing(false)}
            className={`btn-3d-floating relative group px-10 py-5 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-600 to-emerald-800 text-white font-black text-xl sm:text-2xl tracking-wider cursor-pointer border-t-2 border-emerald-200/80 border-b-4 border-emerald-950 transition-all duration-150 min-h-[64px] min-w-[260px] flex items-center justify-center gap-3 ${
              isPressing ? 'scale-95 translate-y-2' : ''
            }`}
          >
            {/* Inner rim glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none" />
            
            <Play className="w-6 h-6 fill-current text-amber-300 drop-shadow" />
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {isArabic ? 'بداية اللعبة' : 'START GAME'}
            </span>
          </button>

          {/* Saved game quick continue button */}
          {hasSavedGame && (
            <button
              onClick={handleContinue}
              className="mt-2 text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer transition min-h-[44px] flex items-center"
            >
              {isArabic ? '⟵ متابعة المسيرة المحفوظة' : 'Continue Saved Career ⟶'}
            </button>
          )}
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="relative z-10 w-full max-w-5xl px-6 py-6 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>{isArabic ? 'محاكاة دوري إنجلترا والكؤوس الأوروبية' : 'English Football Pyramid & European Cups'}</span>
        </div>
        <div className="font-mono text-slate-500">
          <span>v1.0.0 · PWA Ready</span>
        </div>
      </footer>
    </div>
  );
};
