'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-900/20 border border-green-700 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-5xl font-bebas tracking-wider mb-2">
            PAYMENT CONFIRMED
          </h1>
          <p className="text-gray-400">Your purchase was successful</p>
        </div>

        {/* Session ID */}
        {sessionId && (
          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <p className="text-sm text-gray-500 mb-1">Session ID</p>
            <p className="font-dm-mono text-sm break-all">{sessionId}</p>
          </div>
        )}

        {/* Message */}
        <div className="bg-blue-900/20 border border-blue-700 rounded p-6 space-y-2">
          <p className="text-blue-300">
            Your asset is now available for download in your dashboard.
          </p>
          <p className="text-sm text-blue-400">
            Check your email for a confirmation and download link.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-white text-black font-bebas tracking-wider rounded hover:bg-gray-200 transition"
          >
            GO TO DASHBOARD
          </Link>
          <Link
            href="/catalogue"
            className="px-8 py-3 bg-gray-900 border border-gray-700 text-white font-bebas tracking-wider rounded hover:border-white transition"
          >
            CONTINUE SHOPPING
          </Link>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-400 space-y-1">
          <p>✓ Your files are securely stored</p>
          <p>✓ Download links expire after 5 minutes for security</p>
          <p>✓ You can re-download anytime from your dashboard</p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bebas tracking-wider">
            PROSETS
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
        <CheckoutSuccessContent />
      </Suspense>
    </div>
  );
}
