'use client';

import Link from 'next/link';
import { NeonButton } from '@/components/ui/neon-button';

export default function CheckoutCancelPage() {
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
          {/* Cancel Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
              <div className="text-5xl text-amber-400">✕</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-syne font-bold tracking-wide">
              Payment Cancelled
            </h1>
            <p className="text-gray-400">
              Your payment was cancelled. No charges have been made to your account.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-4">
            <p className="text-sm text-gray-300">
              If you encountered any issues during checkout, please try again or contact our support team.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Your cart items are still saved</p>
              <p>• No payment was processed</p>
              <p>• You can retry checkout anytime</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/catalogue">
              <NeonButton variant="primary" size="lg" className="w-full">
                Back to Catalogue
              </NeonButton>
            </Link>
            <Link href="/">
              <NeonButton variant="secondary" size="lg" className="w-full">
                Back to Home
              </NeonButton>
            </Link>
          </div>

          {/* Support */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Contact us at support@nexvault.com</p>
          </div>
        </div>
      </main>
    </div>
  );
}
