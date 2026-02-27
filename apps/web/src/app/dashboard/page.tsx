'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { NeonButton } from '@/components/ui/neon-button';

interface Purchase {
  id: string;
  assetName: string;
  assetId: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  purchaseDate: string;
  category: string;
}

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'profile'>('purchases');

  useEffect(() => {
    // TODO: Fetch user purchases from API
    // For now, mock data
    setPurchases([
      {
        id: '1',
        assetName: 'Modern 3D Character Model',
        assetId: 'asset-1',
        amount: 49.99,
        status: 'PAID',
        purchaseDate: '2025-02-24',
        category: '3D Models',
      },
      {
        id: '2',
        assetName: 'React Component Library',
        assetId: 'asset-2',
        amount: 29.99,
        status: 'PAID',
        purchaseDate: '2025-02-23',
        category: 'Code Snippets',
      },
      {
        id: '3',
        assetName: 'Productivity Notion Template',
        assetId: 'asset-3',
        amount: 19.99,
        status: 'PENDING',
        purchaseDate: '2025-02-22',
        category: 'Notion Templates',
      },
    ]);
    setLoading(false);
  }, []);

  const handleDownload = (assetId: string) => {
    Swal.fire({
      icon: 'info',
      title: 'Download',
      text: `Download initiated for asset ${assetId}`,
      confirmButtonColor: '#0FF',
    });
  };

  const totalSpent = purchases
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-syne font-bold tracking-wider">
            NEXVAULT
          </Link>
          <Link
            href="/catalogue"
            className="text-sm text-gray-400 hover:text-cyan-400 transition"
          >
            ← Back to Catalogue
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-6 sticky top-24">
              {/* Profile Section */}
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                    Account
                  </p>
                  <p className="text-lg font-syne font-bold">User Account</p>
                  <p className="text-xs text-gray-500">buyer_123@nexvault.com</p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 border-t border-gray-800 pt-4">
                <div>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                    Total Spent
                  </p>
                  <p className="text-2xl font-syne font-bold text-cyan-400">
                    ${totalSpent.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                    Purchases
                  </p>
                  <p className="text-2xl font-syne font-bold">
                    {purchases.filter((p) => p.status === 'PAID').length}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2 border-t border-gray-800 pt-4">
                <button
                  onClick={() => setActiveTab('purchases')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'purchases'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Purchase History
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'profile'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Profile Settings
                </button>
              </div>

              {/* Logout */}
              <NeonButton variant="ghost" size="sm" className="w-full">
                Logout
              </NeonButton>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'purchases' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-syne font-bold mb-2">Purchase History</h2>
                  <p className="text-gray-400">
                    {purchases.length} asset{purchases.length !== 1 ? 's' : ''} purchased
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-12 text-center">
                    <p className="text-gray-400 mb-4">No purchases yet</p>
                    <Link href="/catalogue">
                      <NeonButton variant="primary" size="md">
                        Browse Assets
                      </NeonButton>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 flex items-center justify-between hover:border-gray-700 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
                                purchase.category === '3D Models'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                                  : purchase.category === 'Code Snippets'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                              }`}
                            >
                              {purchase.category}
                            </span>
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
                                purchase.status === 'PAID'
                                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                  : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                              }`}
                            >
                              {purchase.status}
                            </span>
                          </div>
                          <h3 className="font-syne font-bold text-white mb-1">
                            {purchase.assetName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-syne font-bold text-cyan-400">
                              ${purchase.amount.toFixed(2)}
                            </p>
                          </div>
                          {purchase.status === 'PAID' && (
                            <NeonButton
                              variant="primary"
                              size="sm"
                              onClick={() => handleDownload(purchase.assetId)}
                            >
                              ⬇ Download
                            </NeonButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-syne font-bold mb-2">Profile Settings</h2>
                  <p className="text-gray-400">Manage your account information</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-6">
                  {/* Email */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value="buyer_123@nexvault.com"
                      disabled
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Save Button */}
                  <NeonButton variant="primary" size="md">
                    Save Changes
                  </NeonButton>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-950/20 border border-red-900/50 rounded-sm p-6 space-y-4">
                  <h3 className="font-syne font-bold text-red-400">Danger Zone</h3>
                  <p className="text-sm text-gray-400">
                    Permanently delete your account and all associated data.
                  </p>
                  <NeonButton variant="secondary" size="md">
                    Delete Account
                  </NeonButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
