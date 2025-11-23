'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Star, Heart, Sparkles, Zap, Gem, Crown, 
  PartyPopper, Rocket, Medal, Volume2, VolumeX, Play, Pause
} from 'lucide-react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  shape: 'rect' | 'circle' | 'star' | 'heart';
  rotation: number;
  spin: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function UltimateCelebrationPage() {
  const [showCurtains, setShowCurtains] = useState(true);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [floatingHearts] = useState(() => Array.from({ length: 15 }, (_, i) => i));
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Curtain reveal
  useEffect(() => {
    const timer = setTimeout(() => setShowCurtains(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Countdown + Redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.href = 'https://ajanthaconsultancy.in/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Confetti Cannon Bursts
  useEffect(() => {
    const colors = ['#FFD700', '#FF1493', '#00FF7F', '#FF4500', '#8A2BE2', '#00CED1', '#FF69B4'];
    const shapes: ('rect' | 'circle' | 'star' | 'heart')[] = ['rect', 'circle', 'star', 'heart'];

    const fireCannon = () => {
      const pieces: ConfettiPiece[] = [];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight;

      for (let i = 0; i < 250; i++) {
        const angle = (Math.PI * 2 * i) / 250;
        const speed = 10 + Math.random() * 15;

        pieces.push({
          id: Date.now() + i,
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: -speed + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 10 + Math.random() * 18,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          rotation: Math.random() * 360,
          spin: (Math.random() - 0.5) * 25,
        });
      }

      setConfetti(prev => [...prev, ...pieces]);
    };

    const bursts = [1500, 4000, 7000, 10000, 14000];
    bursts.forEach(delay => setTimeout(fireCannon, delay));
  }, []);

  // Fireworks Show
  useEffect(() => {
    const launchFirework = (xPercent: number, yPercent: number) => {
      const x = (xPercent / 100) * window.innerWidth;
      const y = (yPercent / 100) * window.innerHeight;
      const color = ['#FF006E', '#8338EC', '#3A86FF', '#FFBE0B', '#FB5607'][Math.floor(Math.random() * 5)];
      const particles: Particle[] = [];

      for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80;
        const speed = 4 + Math.random() * 6;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 100,
          color,
        });
      }

      setFireworks(prev => [...prev, { id: Date.now(), x, y, color, particles }]);
    };

    const schedule = [
      { x: 25, y: 20, delay: 2500 },
      { x: 75, y: 25, delay: 4000 },
      { x: 50, y: 15, delay: 6000 },
      { x: 35, y: 30, delay: 8500 },
      { x: 65, y: 20, delay: 11000 },
    ];

    schedule.forEach(item => {
      setTimeout(() => launchFirework(item.x, item.y), item.delay);
    });
  }, []);

  // Canvas Animation (Physics + Rendering) - FULLY FIXED
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPaused) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;

    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outer: number, inner: number) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outer);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outer;
        y = cy + Math.sin(rot) * outer;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * inner;
        y = cy + Math.sin(rot) * inner;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outer);
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & Draw Confetti
      setConfetti(prev => {
        const active: ConfettiPiece[] = [];

        prev.forEach(piece => {
          piece.vy += 0.35;
          piece.vx *= 0.98;
          piece.vy *= 0.99;
          piece.x += piece.vx;
          piece.y += piece.vy;
          piece.rotation += piece.spin;

          if (piece.y < canvas.height + 100) {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);

            if (piece.shape === 'heart') {
              ctx.fillStyle = piece.color;
              ctx.font = `${piece.size * 1.8}px serif`;
              ctx.fillText('❤️', -piece.size / 2, piece.size / 2);
            } else if (piece.shape === 'star') {
              ctx.fillStyle = piece.color;
              ctx.shadowBlur = 20;
              ctx.shadowColor = piece.color;
              drawStar(ctx, 0, 0, 5, piece.size, piece.size / 2);
            } else if (piece.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
              ctx.fillStyle = piece.color;
              ctx.shadowBlur = 15;
              ctx.shadowColor = piece.color;
              ctx.fill();
            } else {
              ctx.fillStyle = piece.color;
              ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.6);
            }

            ctx.restore();
            active.push(piece);
          }
        });

        return active;
      });

      // Update & Draw Fireworks
      setFireworks(prev => {
        const active: Firework[] = [];

        prev.forEach(fw => {
          let hasAlive = false;

          fw.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            p.life -= 1.8;

            if (p.life > 0) {
              hasAlive = true;
              ctx.globalAlpha = p.life / 100;
              ctx.fillStyle = p.color;
              ctx.shadowBlur = 30;
              ctx.shadowColor = p.color;
              ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
            }
          });

          ctx.globalAlpha = 1;
          if (hasAlive) active.push(fw);
        });

        return active;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [isPaused]);

  return (
    <>
      <div className="fixed inset-0 bg-black overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)] animate-pulse" />
        </div>

        {/* Curtains */}
        {showCurtains && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-gradient-to-r from-red-950 to-red-800 animate-slide-left" />
            <div className="flex-1 bg-gradient-to-l from-red-950 to-red-800 animate-slide-right" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-9xl font-black text-yellow-400 animate-pulse">SHOWTIME!</h1>
            </div>
          </div>
        )}

        {/* Floating Hearts */}
        {floatingHearts.map(i => (
          <Heart
            key={i}
            className="absolute text-red-500 opacity-70 animate-rise"
            style={{
              left: `${8 + i * 6}%`,
              fontSize: `${50 + i * 8}px`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${12 + i * 2}s`,
            }}
            fill="currentColor"
          />
        ))}

        {/* Main Content */}
        <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-8 text-center">
          <div className="relative mb-16">
            <Crown className="absolute -top-32 left-1/2 -translate-x-1/2 w-56 h-56 text-yellow-400 animate-spin" fill="#FCD34D" />
            <Medal className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 text-yellow-300 animate-bounce" fill="#FBBF24" />
            <Trophy className="w-96 h-96 text-yellow-300 drop-shadow-2xl" fill="#FCD34D" stroke="#B45309" strokeWidth={6} />
          </div>

          <h1 className="text-9xl md:text-[12rem] font-black text-white mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 animate-shimmer bg-[length:300%]">
              YOU WON!
            </span>
          </h1>

          <p className="text-5xl md:text-7xl font-bold text-white mb-16">
            <PartyPopper className="inline mx-4 animate-bounce" />
            LEGENDARY ACHIEVEMENT UNLOCKED
            <PartyPopper className="inline mx-4 animate-bounce" />
          </p>

          {/* Badges */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-10 mb-20">
            {['GOAT', 'KING', 'QUEEN', 'CHAMP', 'HERO', 'LEGEND'].map((title, i) => (
              <div key={title} className="animate-fade-up" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-8 rounded-full shadow-2xl hover:scale-125 transition-all">
                  <Gem className="w-20 h-20 text-white" />
                </div>
                <p className="text-3xl font-bold text-yellow-300 mt-4">{title}</p>
              </div>
            ))}
          </div>

          {/* Control Panel */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl rounded-full px-10 py-6 flex items-center gap-8 border border-white/30 shadow-2xl">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-4 rounded-full bg-white/20 hover:bg-white/40 transition">
              {soundEnabled ? <Volume2 className="w-10 h-10 text-white" /> : <VolumeX className="w-10 h-10 text-white" />}
            </button>
            <button onClick={() => setIsPaused(!isPaused)} className="p-4 rounded-full bg-white/20 hover:bg-white/40 transition">
              {isPaused ? <Play className="w-10 h-10 text-white" /> : <Pause className="w-10 h-10 text-white" />}
            </button>
            <span className="text-3xl font-bold text-white">
              Launching in <span className="text-yellow-400">{timeLeft}s</span>
            </span>
            <button 
              onClick={() => window.location.href = 'https://ajanthaconsultancy.in/'}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white text-xl hover:scale-110 transition shadow-2xl flex items-center gap-3"
            >
              <Rocket className="w-8 h-8" /> GO NOW
            </button>
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 300% 50%; }
          }
          .animate-shimmer { animation: shimmer 6s linear infinite; }

          @keyframes rise {
            from { transform: translateY(100vh); opacity: 0; }
            to { transform: translateY(-200px); opacity: 1; }
          }
          .animate-rise { animation: rise linear forwards; }

          @keyframes slide-left {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          .animate-slide-left { animation: slide-left 2s ease-out forwards; }

          @keyframes slide-right {
            from { transform: translateX(0); }
            to { transform: translateX(100%); }
          }
          .animate-slide-right { animation: slide-right 2s ease-out forwards; }

          @keyframes fade-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up { animation: fade-up 1s ease-out forwards; }
        `}</style>
      </div>
    </>
  );
}