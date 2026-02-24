'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
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

      <main className="max-w-2xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Cancel Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-900/20 border border-red-700 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-5xl font-bebas tracking-wider mb-2">
              PAYMENT CANCELLED
            </h1>
            <p className="text-gray-400">Your purchase was not completed</p>
          </div>

          {/* Message */}
          <div className="bg-yellow-900/20 border border-yellow-700 rounded p-6 space-y-2">
            <p className="text-yellow-300">
              No charges have been made to your account.
            </p>
            <p className="text-sm text-yellow-400">
              You can try again or browse other assets.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogue"
              className="px-8 py-3 bg-white text-black font-bebas tracking-wider rounded hover:bg-gray-200 transition"
            >
              BACK TO CATALOGUE
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-gray-900 border border-gray-700 text-white font-bebas tracking-wider rounded hover:border-white transition"
            >
              HOME
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
