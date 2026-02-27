'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { NeonButton } from '@/components/ui/neon-button';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: Call download endpoint with sessionId
      // const response = await fetch(`/api/downloads/${sessionId}`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'asset.zip';
      // a.click();
      Swal.fire({
        icon: 'info',
        title: 'Coming Soon',
        text: 'Download functionality coming soon',
        confirmButtonColor: '#0FF',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Download failed',
        confirmButtonColor: '#0FF',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-syne font-bold tracking-wider">
            NEXVAULT
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-20 w-full overflow-hidden flex items-center justify-center">
        <div className="space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <div className="text-5xl text-cyan-400">✓</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-syne font-bold tracking-wide">
              Payment Successful
            </h1>
            <p className="text-gray-400">
              Thank you for your purchase. Your asset is ready to download.
            </p>
          </div>

          {/* Download Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-8 space-y-6">
            {/* Countdown Timer */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                Download Link Expires In
              </p>
              <div className="text-6xl font-syne font-bold text-cyan-400">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-gray-500">
                {timeLeft > 0
                  ? 'Download your asset before the link expires'
                  : 'Link has expired. Contact support for assistance.'}
              </p>
            </div>

            {/* Download Button */}
            <NeonButton
              variant="primary"
              size="lg"
              onClick={handleDownload}
              disabled={isDownloading || timeLeft <= 0}
              className="w-full"
            >
              {isDownloading ? 'Downloading...' : '⬇ Download Asset'}
            </NeonButton>

            {/* Session ID */}
            {sessionId && (
              <div className="text-center">
                <p className="text-xs text-gray-600 font-mono break-all">
                  Session: {sessionId}
                </p>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/30 border border-gray-800 rounded-sm p-4 text-center">
              <p className="text-2xl mb-2">🔒</p>
              <p className="text-sm text-gray-300">Secure Download</p>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-sm p-4 text-center">
              <p className="text-2xl mb-2">⚡</p>
              <p className="text-sm text-gray-300">Instant Access</p>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 rounded-sm p-4 text-center">
              <p className="text-2xl mb-2">♾️</p>
              <p className="text-sm text-gray-300">Lifetime License</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-400">What's next?</p>
            <div className="space-y-2">
              <Link href="/catalogue">
                <NeonButton variant="secondary" size="md" className="w-full">
                  Continue Shopping
                </NeonButton>
              </Link>
              <Link href="/dashboard">
                <NeonButton variant="ghost" size="md" className="w-full">
                  View Purchase History
                </NeonButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
