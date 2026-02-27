'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NeonButton } from '@/components/ui/neon-button';

interface AdminAsset {
  id: string;
  name: string;
  seller: string;
  category: string;
  price: number;
  status: 'Active' | 'Inactive' | 'Flagged';
  sales: number;
  createdDate: string;
}

interface AdminUser {
  id: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  joinDate: string;
  purchases: number;
  status: 'Active' | 'Suspended';
}

export default function AdminPanelPage() {
  const [assets, setAssets] = useState<AdminAsset[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'users' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch admin data from API
    // For now, mock data
    setAssets([
      {
        id: '1',
        name: 'Modern 3D Character Model',
        seller: 'Creator Studio',
        category: '3D Models',
        price: 49.99,
        status: 'Active',
        sales: 12,
        createdDate: '2025-01-15',
      },
      {
        id: '2',
        name: 'React Component Library',
        seller: 'Dev Tools Inc',
        category: 'Code Snippets',
        price: 29.99,
        status: 'Active',
        sales: 8,
        createdDate: '2025-01-20',
      },
      {
        id: '3',
        name: 'Suspicious Asset',
        seller: 'Unknown Seller',
        category: 'UI Kits',
        price: 99.99,
        status: 'Flagged',
        sales: 0,
        createdDate: '2025-02-20',
      },
    ]);

    setUsers([
      {
        id: '1',
        email: 'buyer@example.com',
        role: 'buyer',
        joinDate: '2025-01-10',
        purchases: 5,
        status: 'Active',
      },
      {
        id: '2',
        email: 'seller@example.com',
        role: 'seller',
        joinDate: '2025-01-05',
        purchases: 0,
        status: 'Active',
      },
      {
        id: '3',
        email: 'spammer@example.com',
        role: 'seller',
        joinDate: '2025-02-15',
        purchases: 0,
        status: 'Suspended',
      },
    ]);

    setLoading(false);
  }, []);

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAssets = assets.length;
  const totalUsers = users.length;
  const flaggedAssets = assets.filter((a) => a.status === 'Flagged').length;
  const suspendedUsers = users.filter((u) => u.status === 'Suspended').length;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-syne font-bold tracking-wider">
            NEXVAULT ADMIN
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
              {/* Admin Info */}
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                    Admin Panel
                  </p>
                  <p className="text-lg font-syne font-bold">Administrator</p>
                  <p className="text-xs text-gray-500">admin@nexvault.com</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2 border-t border-gray-800 pt-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'overview'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'assets'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Assets
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'users'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'reports'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Reports
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-syne font-bold mb-2">Admin Overview</h2>
                  <p className="text-gray-400">Platform statistics and moderation dashboard</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                      Total Assets
                    </p>
                    <p className="text-4xl font-syne font-bold text-cyan-400">{totalAssets}</p>
                    <p className="text-xs text-gray-500">{flaggedAssets} flagged for review</p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                      Total Users
                    </p>
                    <p className="text-4xl font-syne font-bold text-cyan-400">{totalUsers}</p>
                    <p className="text-xs text-gray-500">{suspendedUsers} suspended</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-4">
                  <h3 className="font-syne font-bold text-lg">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <NeonButton variant="secondary" size="md" className="w-full">
                      Review Flagged Assets
                    </NeonButton>
                    <NeonButton variant="secondary" size="md" className="w-full">
                      Manage Suspended Users
                    </NeonButton>
                    <NeonButton variant="secondary" size="md" className="w-full">
                      View Reports
                    </NeonButton>
                    <NeonButton variant="secondary" size="md" className="w-full">
                      System Settings
                    </NeonButton>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-4">
                  <h3 className="font-syne font-bold text-lg">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div>
                        <p className="font-syne font-bold text-white">Asset Flagged</p>
                        <p className="text-xs text-gray-500">Suspicious Asset by Unknown Seller</p>
                      </div>
                      <p className="text-xs text-red-400">2 hours ago</p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div>
                        <p className="font-syne font-bold text-white">User Suspended</p>
                        <p className="text-xs text-gray-500">spammer@example.com</p>
                      </div>
                      <p className="text-xs text-red-400">1 day ago</p>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-syne font-bold text-white">New Asset Published</p>
                        <p className="text-xs text-gray-500">React Component Library</p>
                      </div>
                      <p className="text-xs text-green-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-syne font-bold mb-2">Asset Moderation</h2>
                    <p className="text-gray-400">Review and manage all platform assets</p>
                  </div>
                </div>

                {/* Search */}
                <div>
                  <input
                    type="text"
                    placeholder="Search assets or sellers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                {/* Assets Table */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 flex items-center justify-between hover:border-gray-700 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
                                asset.status === 'Active'
                                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                  : asset.status === 'Flagged'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/50'
                                    : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                              }`}
                            >
                              {asset.status}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-1 border border-gray-600 rounded-sm text-gray-300">
                              {asset.category}
                            </span>
                          </div>
                          <h3 className="font-syne font-bold text-white mb-1">{asset.name}</h3>
                          <p className="text-xs text-gray-500">
                            by {asset.seller} • {asset.sales} sales
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-syne font-bold text-cyan-400">
                              ${asset.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            {asset.status === 'Flagged' && (
                              <>
                                <NeonButton variant="primary" size="sm">
                                  Approve
                                </NeonButton>
                                <NeonButton variant="secondary" size="sm">
                                  Delete
                                </NeonButton>
                              </>
                            )}
                            {asset.status === 'Active' && (
                              <NeonButton variant="ghost" size="sm">
                                Flag
                              </NeonButton>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-syne font-bold mb-2">User Management</h2>
                    <p className="text-gray-400">Monitor and manage platform users</p>
                  </div>
                </div>

                {/* Search */}
                <div>
                  <input
                    type="text"
                    placeholder="Search users by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                {/* Users Table */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 flex items-center justify-between hover:border-gray-700 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
                                user.status === 'Active'
                                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                  : 'bg-red-500/20 text-red-300 border-red-500/50'
                              }`}
                            >
                              {user.status}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-1 border border-gray-600 rounded-sm text-gray-300">
                              {user.role}
                            </span>
                          </div>
                          <h3 className="font-syne font-bold text-white mb-1">{user.email}</h3>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(user.joinDate).toLocaleDateString()} • {user.purchases} purchases
                          </p>
                        </div>

                        <div className="space-y-2">
                          {user.status === 'Active' && (
                            <NeonButton variant="secondary" size="sm">
                              Suspend
                            </NeonButton>
                          )}
                          {user.status === 'Suspended' && (
                            <NeonButton variant="primary" size="sm">
                              Restore
                            </NeonButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-syne font-bold mb-2">Reports & Analytics</h2>
                  <p className="text-gray-400">Platform performance and user reports</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-4">
                    <h3 className="font-syne font-bold text-lg">Platform Health</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Active Users</p>
                        <div className="w-full bg-gray-950 rounded-full h-2">
                          <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Asset Quality</p>
                        <div className="w-full bg-gray-950 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">System Performance</p>
                        <div className="w-full bg-gray-950 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-4">
                    <h3 className="font-syne font-bold text-lg">Reported Issues</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 border-b border-gray-800">
                        <span className="text-sm text-gray-300">Copyright Violations</span>
                        <span className="text-red-400 font-bold">3</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-800">
                        <span className="text-sm text-gray-300">Spam/Malware</span>
                        <span className="text-red-400 font-bold">1</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-300">Inappropriate Content</span>
                        <span className="text-red-400 font-bold">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
