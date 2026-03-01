'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { NeonButton } from '@/components/ui/neon-button';

/* ── style helpers ─────────────────────────────────────── */
const syne = 'font-[family-name:var(--font-syne)]';
const jb = 'font-[family-name:var(--font-jetbrains)]';

/* ── Confetti Particle ── */
function ConfettiParticle({ delay, color, left, duration, rotation }: { delay: number; color: string; left: string; duration: number; rotation: number }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-[1px]"
      style={{
        left,
        top: '-10px',
        background: color,
        animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiData, setConfettiData] = useState<Array<{ delay: number; color: string; left: string; duration: number; rotation: number }>>([]);
  const [assetId, setAssetId] = useState<string | null>(null);

  /* ── Generate confetti data on client only ──────────── */
  useEffect(() => {
    const confettiColors = ['#00ffff', '#F59E0B', '#22c55e', '#a855f7', '#f0f0f0'];
    const data = Array.from({ length: 30 }).map((_, i) => ({
      delay: Math.random() * 1.5,
      color: confettiColors[i % confettiColors.length],
      left: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      rotation: Math.random() * 360,
    }));
    setConfettiData(data);
  }, []);

  /* ── Fetch session details to get assetId ──────────── */
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchSessionDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/session/${sessionId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setAssetId(data.metadata?.assetId || null);
        }
      } catch (error) {
        console.error('Failed to fetch session details:', error);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  /* ── countdown ──────────────────────────────────────── */
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /* ── download handler ───────────────────────────────── */
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (!assetId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Asset information not found',
          confirmButtonColor: '#00ffff',
          background: '#0a0a0a',
          color: '#fff',
        });
        return;
      }

      // Get download URL from API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/downloads/${assetId}?userId=buyer_123`,
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate download URL');
      }

      const { url } = await response.json();

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'asset.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: 'Your asset is downloading',
        confirmButtonColor: '#00ffff',
        background: '#0a0a0a',
        color: '#fff',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Download Error',
        text: error instanceof Error ? error.message : 'Download failed',
        confirmButtonColor: '#00ffff',
        background: '#0a0a0a',
        color: '#fff',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  /* ── progress ring (SVG) ────────────────────────────── */
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / 300;

  const confettiColors = ['#00ffff', '#F59E0B', '#22c55e', '#a855f7', '#f0f0f0'];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white relative overflow-hidden">
      <Navbar />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confettiData.map((particle, i) => (
            <ConfettiParticle
              key={i}
              delay={particle.delay}
              color={particle.color}
              left={particle.left}
              duration={particle.duration}
              rotation={particle.rotation}
            />
          ))}
        </div>
      )}

      {/* Ambient glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative z-10">
        <div className="w-full max-w-lg space-y-10 animate-[fadeInUp_.5s_ease_both]">

          {/* ── success ring ─────────────────── */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32" style={{ animation: 'glow-pulse-green 2s ease-in-out infinite' }}>
              {/* background ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(34,197,94,.1)" strokeWidth="4" />
                <circle
                  cx="60" cy="60" r={radius} fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
              </svg>
              {/* inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-check text-3xl text-[#22c55e]" style={{ textShadow: '0 0 20px rgba(34,197,94,0.6)' }} />
              </div>
            </div>
          </div>

          {/* ── heading ──────────────────────── */}
          <div className="text-center space-y-2">
            <h1 className={`${syne} text-4xl sm:text-5xl font-bold tracking-tight`}>
              Payment&nbsp;<span style={{ color: '#22c55e', textShadow: '0 0 30px rgba(34,197,94,0.5)' }}>Successful</span>
            </h1>
            <p className={`${jb} text-sm text-[rgba(240,240,240,0.2)]`}>
              Thank you for your purchase. Your asset is ready.
            </p>
          </div>

          {/* ── download card ────────────────── */}
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-8 space-y-6 backdrop-blur-sm">
            {/* timer */}
            <div className="text-center space-y-1">
              <p className={`${jb} text-[10px] uppercase tracking-[.2em] text-[rgba(240,240,240,0.15)]`}>
                Download expires in
              </p>
              <p className={`${syne} text-5xl font-bold tabular-nums ${timeLeft < 60 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`} style={timeLeft < 30 ? { animation: 'countdown-pulse 1s ease infinite' } : {}}>
                {formatTime(timeLeft)}
              </p>
              {/* Progress bar */}
              <div className="progress-bar mt-3">
                <div
                  className="progress-bar-fill transition-all duration-1000"
                  style={{
                    width: `${progress * 100}%`,
                    background: timeLeft < 60 ? '#ef4444' : '#22c55e',
                  }}
                />
              </div>
              <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)] mt-2`}>
                {timeLeft > 0
                  ? 'Download before the link expires'
                  : 'Link expired — contact support'}
              </p>
            </div>

            {/* CTA */}
            <NeonButton
              variant="primary"
              size="lg"
              glow
              onClick={handleDownload}
              disabled={isDownloading || timeLeft <= 0}
              className="w-full"
            >
              <i className="fa-solid fa-arrow-down mr-2" />
              {isDownloading ? 'Downloading…' : 'Download Asset'}
            </NeonButton>

            {/* session */}
            {sessionId && (
              <p className={`${jb} text-[10px] text-center text-[rgba(240,240,240,0.1)] break-all`}>
                Session: {sessionId}
              </p>
            )}
          </div>

          {/* ── trust badges ─────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'fa-lock', label: 'Secure Download' },
              { icon: 'fa-bolt', label: 'Instant Access' },
              { icon: 'fa-infinity', label: 'Lifetime License' },
            ].map((b) => (
              <div
                key={b.icon}
                className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-4 text-center space-y-2 transition-all hover:border-[rgba(0,255,255,0.15)]"
              >
                <i className={`fa-solid ${b.icon} text-lg text-[#22c55e]`} style={{ textShadow: '0 0 12px rgba(34,197,94,0.4)' }} />
                <p className={`${jb} text-[10px] uppercase tracking-wider text-[rgba(240,240,240,0.15)]`}>
                  {b.label}
                </p>
              </div>
            ))}
          </div>

          {/* ── next steps ───────────────────── */}
          <div className="space-y-3">
            <p className={`${jb} text-xs text-center uppercase tracking-wider text-[rgba(240,240,240,0.15)]`}>
              What&rsquo;s next?
            </p>
            <Link href="/catalogue">
              <NeonButton variant="secondary" size="md" className="w-full">
                Continue Shopping
              </NeonButton>
            </Link>
            <Link href="/dashboard">
              <NeonButton variant="ghost" size="md" className="w-full mt-2">
                View Purchase History
              </NeonButton>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
