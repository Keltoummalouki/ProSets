'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Badge } from '@/components/ui/badge';
import { NeonButton } from '@/components/ui/neon-button';

/* ── style helpers ─────────────────────────────────────── */
const syne = 'font-[family-name:var(--font-syne)]';
const jb = 'font-[family-name:var(--font-jetbrains)]';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setAssets([
      { id: '1', name: 'Modern 3D Character Model', seller: 'Creator Studio', category: '3D Models', price: 49.99, status: 'Active', sales: 12, createdDate: '2025-01-15' },
      { id: '2', name: 'React Component Library', seller: 'Dev Tools Inc', category: 'Code Snippets', price: 29.99, status: 'Active', sales: 8, createdDate: '2025-01-20' },
      { id: '3', name: 'Suspicious Asset', seller: 'Unknown Seller', category: 'UI Kits', price: 99.99, status: 'Flagged', sales: 0, createdDate: '2025-02-20' },
      { id: '4', name: 'Productivity Notion Pack', seller: 'Template Pro', category: 'Notion Templates', price: 19.99, status: 'Inactive', sales: 3, createdDate: '2025-02-05' },
    ]);
    setUsers([
      { id: '1', email: 'buyer@example.com', role: 'buyer', joinDate: '2025-01-10', purchases: 5, status: 'Active' },
      { id: '2', email: 'seller@example.com', role: 'seller', joinDate: '2025-01-05', purchases: 0, status: 'Active' },
      { id: '3', email: 'spammer@example.com', role: 'seller', joinDate: '2025-02-15', purchases: 0, status: 'Suspended' },
    ]);
    setLoading(false);
  }, []);

  const toggleAssetStatus = (id: string) => {
    setAssets(assets.map((a) => {
      if (a.id !== id) return a;
      return { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' };
    }));
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.seller.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalAssets = assets.length;
  const totalUsers = users.length;
  const flaggedAssets = assets.filter((a) => a.status === 'Flagged').length;
  const suspendedUsers = users.filter((u) => u.status === 'Suspended').length;

  /* helper: nav button */
  const tabBtn = (active: boolean) =>
    `w-full text-left px-4 py-2.5 rounded-[3px] text-[12px] transition ${jb} ${active
      ? 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]'
      : 'text-[rgba(240,240,240,0.15)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
    }`;

  /* helper: input */
  const inputCls =
    `w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(255,255,255,0.06)] rounded-[3px] px-4 py-2.5 text-sm text-white placeholder:text-[rgba(240,240,240,0.15)] ${jb} focus:border-[rgba(245,158,11,0.4)] focus:outline-none transition`;

  /* helper: stat card */
  const StatCard = ({ label, value, sub, accent = false, icon }: { label: string; value: string | number; sub?: string; accent?: boolean; icon?: string }) => (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-2">
      <div className="flex items-center gap-2">
        {icon && <i className={`fa-solid ${icon} text-xs ${accent ? 'text-[#F59E0B]' : 'text-[rgba(240,240,240,0.2)]'}`} />}
        <p className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)]`}>{label}</p>
      </div>
      <p className={`${syne} text-3xl font-bold ${accent ? 'text-[#F59E0B]' : 'text-white'}`}>{value}</p>
      {sub && <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>{sub}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* ═══════ SIDEBAR ═══════ */}
          <aside>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-6 lg:sticky lg:top-24">
              {/* admin avatar */}
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-[3px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)] flex items-center justify-center">
                  <i className="fa-solid fa-shield-halved text-sm text-[#F59E0B]" />
                </div>
                <div>
                  <p className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)]`}>Admin Panel</p>
                  <p className={`${syne} text-lg font-bold`}>Administrator</p>
                  <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>admin@prosets.io</p>
                </div>
              </div>

              {/* nav */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-1.5">
                {(['overview', 'assets', 'users', 'reports'] as const).map((t) => {
                  const icons: Record<string, string> = {
                    overview: 'fa-chart-pie',
                    assets: 'fa-cube',
                    users: 'fa-users',
                    reports: 'fa-flag',
                  };
                  return (
                    <button key={t} onClick={() => { setActiveTab(t); setSearchQuery(''); setStatusFilter('all'); }} className={tabBtn(activeTab === t)}>
                      <i className={`fa-solid ${icons[t]} mr-2 text-xs`} />{t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  );
                })}
              </div>

              <NeonButton variant="ghost" size="sm" className="w-full">
                <i className="fa-solid fa-right-from-bracket mr-2 text-xs" />Logout
              </NeonButton>
            </div>
          </aside>

          {/* ═══════ MAIN ═══════ */}
          <section className="min-w-0">

            {/* ── OVERVIEW ─────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-[fadeIn_.3s_ease]">
                <div>
                  <h2 className={`${syne} text-3xl font-bold`}>Admin Overview</h2>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)] mt-1`}>Platform statistics &amp; moderation</p>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Assets" value={totalAssets} accent icon="fa-cube" />
                  <StatCard label="Flagged" value={flaggedAssets} sub="needs review" icon="fa-flag" />
                  <StatCard label="Total Users" value={totalUsers} accent icon="fa-users" />
                  <StatCard label="Suspended" value={suspendedUsers} sub="accounts" icon="fa-user-slash" />
                </div>

                {/* quick actions */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-4">
                  <h3 className={`${syne} font-bold text-lg`}>Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: 'fa-flag', label: 'Review Flagged Assets', tab: 'assets' as const },
                      { icon: 'fa-user-slash', label: 'Manage Suspended Users', tab: 'users' as const },
                      { icon: 'fa-chart-line', label: 'View Reports', tab: 'reports' as const },
                      { icon: 'fa-gear', label: 'System Settings', tab: 'overview' as const },
                    ].map((a) => (
                      <button
                        key={a.label}
                        onClick={() => setActiveTab(a.tab)}
                        className={`${jb} text-xs flex items-center gap-2 px-4 py-3 rounded-[3px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] transition text-[rgba(240,240,240,0.4)]`}
                      >
                        <i className={`fa-solid ${a.icon} text-[#F59E0B]`} />{a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* recent activity */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-4">
                  <h3 className={`${syne} font-bold text-lg`}>Recent Activity</h3>
                  {[
                    { title: 'Asset Flagged', sub: 'Suspicious Asset by Unknown Seller', time: '2 hours ago', color: 'text-[#ef4444]', icon: 'fa-flag' },
                    { title: 'User Suspended', sub: 'spammer@example.com', time: '1 day ago', color: 'text-[#ef4444]', icon: 'fa-user-slash' },
                    { title: 'New Asset Published', sub: 'React Component Library', time: '3 days ago', color: 'text-[#22c55e]', icon: 'fa-check' },
                  ].map((a, i) => (
                    <div key={i} className={`flex items-center justify-between py-3 ${i < 2 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-[3px] border flex items-center justify-center text-[10px] ${a.color} border-current/20 bg-current/5`}>
                          <i className={`fa-solid ${a.icon}`} />
                        </div>
                        <div>
                          <p className={`${syne} font-bold text-sm`}>{a.title}</p>
                          <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>{a.sub}</p>
                        </div>
                      </div>
                      <p className={`${jb} text-[10px] ${a.color}`}>{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ASSETS ───────────────────── */}
            {activeTab === 'assets' && (
              <div className="space-y-6 animate-[fadeIn_.3s_ease]">
                <div>
                  <h2 className={`${syne} text-3xl font-bold`}>Asset Moderation</h2>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)] mt-1`}>Review and manage platform assets</p>
                </div>

                {/* Search + Status Filter */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[rgba(240,240,240,0.15)]" />
                    <input
                      type="text"
                      placeholder="Search assets or sellers…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`${inputCls} w-auto appearance-none cursor-pointer px-4`}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-10 h-10 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAssets.map((a) => (
                      <div key={a.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.03)]">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={a.status === 'Active' ? 'green' : a.status === 'Flagged' ? 'red' : 'gray'}>{a.status}</Badge>
                            <Badge variant="gray">{a.category}</Badge>
                          </div>
                          <h3 className={`${syne} font-bold`}>{a.name}</h3>
                          <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>by {a.seller} · {a.sales} sales</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={`${syne} text-lg font-bold text-[#F59E0B]`}>${a.price.toFixed(2)}</p>
                          <div className="flex items-center gap-3">
                            {/* Toggle switch */}
                            {a.status !== 'Flagged' && (
                              <button
                                onClick={() => toggleAssetStatus(a.id)}
                                className={`toggle-switch ${a.status === 'Active' ? 'active' : ''}`}
                                title={a.status === 'Active' ? 'Deactivate' : 'Activate'}
                              />
                            )}
                            {a.status === 'Flagged' && (
                              <div className="flex gap-2">
                                <NeonButton variant="primary" size="xs" onClick={() => setAssets(assets.map(x => x.id === a.id ? { ...x, status: 'Active' } : x))}>Approve</NeonButton>
                                <NeonButton variant="danger" size="xs" onClick={() => setAssets(assets.filter(x => x.id !== a.id))}>Delete</NeonButton>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredAssets.length === 0 && (
                      <div className="text-center py-12">
                        <p className={`${jb} text-sm text-[rgba(240,240,240,0.2)]`}>No assets match your filters</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── USERS ────────────────────── */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-[fadeIn_.3s_ease]">
                <div>
                  <h2 className={`${syne} text-3xl font-bold`}>User Management</h2>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)] mt-1`}>Monitor and manage platform users</p>
                </div>

                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[rgba(240,240,240,0.15)]" />
                  <input
                    type="text"
                    placeholder="Search users by email…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${inputCls} pl-9`}
                  />
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-10 h-10 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers.map((u) => (
                      <div key={u.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[rgba(255,255,255,0.12)]">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={u.status === 'Active' ? 'green' : 'red'}>{u.status}</Badge>
                            <Badge variant="gray">{u.role}</Badge>
                          </div>
                          <h3 className={`${syne} font-bold`}>{u.email}</h3>
                          <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>
                            Joined {new Date(u.joinDate).toLocaleDateString()} · {u.purchases} purchases
                          </p>
                        </div>
                        <div>
                          {u.status === 'Active' && <NeonButton variant="danger" size="xs">Suspend</NeonButton>}
                          {u.status === 'Suspended' && <NeonButton variant="primary" size="xs">Restore</NeonButton>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── REPORTS ──────────────────── */}
            {activeTab === 'reports' && (
              <div className="space-y-6 animate-[fadeIn_.3s_ease]">
                <div>
                  <h2 className={`${syne} text-3xl font-bold`}>Reports &amp; Analytics</h2>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)] mt-1`}>Platform performance overview</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* health */}
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-5">
                    <h3 className={`${syne} font-bold`}>Platform Health</h3>
                    {[
                      { label: 'Active Users', pct: 85, color: '#00ffff' },
                      { label: 'Asset Quality', pct: 92, color: '#22c55e' },
                      { label: 'System Performance', pct: 78, color: '#F59E0B' },
                    ].map((m) => (
                      <div key={m.label} className="space-y-1.5">
                        <div className="flex justify-between">
                          <p className={`${jb} text-xs text-[rgba(240,240,240,0.4)]`}>{m.label}</p>
                          <p className={`${jb} text-xs text-[rgba(240,240,240,0.15)]`}>{m.pct}%</p>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* issues */}
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-4">
                    <h3 className={`${syne} font-bold`}>Reported Issues</h3>
                    {[
                      { label: 'Copyright Violations', count: 3 },
                      { label: 'Spam / Malware', count: 1 },
                      { label: 'Inappropriate Content', count: 2 },
                    ].map((r, i, arr) => (
                      <div key={r.label} className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? 'border-b border-[rgba(255,255,255,0.04)]' : ''}`}>
                        <span className={`${jb} text-xs text-[rgba(240,240,240,0.4)]`}>{r.label}</span>
                        <span className={`${jb} text-xs font-bold text-[#ef4444]`}>{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
