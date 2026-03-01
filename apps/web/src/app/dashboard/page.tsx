'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Badge } from '@/components/ui/badge';
import { NeonButton } from '@/components/ui/neon-button';

/* ── style helpers ─────────────────────────────────────── */
const syne = 'font-[family-name:var(--font-syne)]';
const jb = 'font-[family-name:var(--font-jetbrains)]';

interface Purchase {
  id: string;
  assetName: string;
  assetId: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  purchaseDate: string;
  category: string;
}

const catVariant = (c: string) =>
  c === '3D Models' ? 'cyan' : c === 'Code Snippets' ? 'amber' : 'purple';

/* ── Download Timer Component ── */
function DownloadTimer({ assetId, assetName }: { assetId: string; assetName: string }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const startDownload = useCallback(() => {
    setTimeLeft(300); // 5 minutes
    setDownloading(true);
    // Simulate download initiation
    Swal.fire({
      icon: 'info',
      title: 'Download Ready',
      html: `<p style="font-size:13px">Your presigned URL for <strong>${assetName}</strong> has been generated.</p><p style="font-size:11px;opacity:0.5;margin-top:8px">Link expires in 5 minutes</p>`,
      confirmButtonColor: '#00ffff',
      background: '#0a0a0a',
      color: '#fff',
    }).then(() => setDownloading(false));
  }, [assetName]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((p) => (p !== null ? p - 1 : null)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft !== null && timeLeft <= 0;
  const isActive = timeLeft !== null && timeLeft > 0;

  return (
    <div className="flex items-center gap-3">
      {isActive && (
        <div className="flex items-center gap-2">
          <div className="progress-bar w-20">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(timeLeft / 300) * 100}%`,
                background: timeLeft < 60 ? '#ef4444' : '#00ffff',
              }}
            />
          </div>
          <span className={`${jb} text-[10px] tabular-nums ${timeLeft < 60 ? 'text-[#ef4444]' : 'text-[#00ffff]'}`} style={timeLeft < 30 ? { animation: 'countdown-pulse 1s ease infinite' } : {}}>
            {formatTime(timeLeft)}
          </span>
        </div>
      )}
      {isExpired && (
        <span className={`${jb} text-[10px] text-[rgba(240,240,240,0.2)]`}>Expired</span>
      )}
      <NeonButton
        variant={isExpired ? 'secondary' : 'primary'}
        size="sm"
        onClick={startDownload}
        disabled={downloading}
      >
        <i className={`fa-solid ${isExpired ? 'fa-rotate-right' : 'fa-arrow-down'} mr-1.5`} />
        {isExpired ? 'Regenerate' : isActive ? 'Re-download' : 'Download'}
      </NeonButton>
    </div>
  );
}

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'purchases' | 'profile'>('purchases');

  useEffect(() => {
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
      {
        id: '4',
        assetName: 'Cyberpunk Icon Set',
        assetId: 'asset-4',
        amount: 15.00,
        status: 'PAID',
        purchaseDate: '2025-02-20',
        category: 'UI Kits',
      },
    ]);
    setLoading(false);
  }, []);

  const totalSpent = purchases
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const paidCount = purchases.filter((p) => p.status === 'PAID').length;

  const tabBtn = (active: boolean) =>
    `w-full text-left px-4 py-2.5 rounded-[3px] text-[12px] transition ${jb} ${active
      ? 'bg-[rgba(0,255,255,0.08)] text-[#00ffff] border border-[rgba(0,255,255,0.3)]'
      : 'text-[rgba(240,240,240,0.25)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
    }`;

  const inputCls =
    `w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(255,255,255,0.06)] rounded-[3px] px-4 py-2.5 text-sm text-white placeholder:text-[rgba(240,240,240,0.15)] ${jb} focus:border-[rgba(0,255,255,0.4)] focus:outline-none transition`;

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* ═══════ SIDEBAR ═══════ */}
          <aside>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-6 lg:sticky lg:top-24">
              {/* avatar */}
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-[3px] bg-[rgba(0,255,255,0.06)] border border-[rgba(0,255,255,0.2)] flex items-center justify-center">
                  <i className="fa-solid fa-user text-sm text-[#00ffff]" />
                </div>
                <div>
                  <p className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)]`}>Account</p>
                  <p className={`${syne} text-lg font-bold`}>User Account</p>
                  <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>buyer@prosets.io</p>
                </div>
              </div>

              {/* stats */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-4">
                <div>
                  <p className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)]`}>Total Spent</p>
                  <p className={`${syne} text-2xl font-bold text-[#00ffff]`}>${totalSpent.toFixed(2)}</p>
                </div>
                <div>
                  <p className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)]`}>Purchases</p>
                  <p className={`${syne} text-2xl font-bold`}>{paidCount}</p>
                </div>
              </div>

              {/* nav */}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-1.5">
                <button onClick={() => setActiveTab('purchases')} className={tabBtn(activeTab === 'purchases')}>
                  <i className="fa-solid fa-bag-shopping mr-2 text-xs" />Purchase History
                </button>
                <button onClick={() => setActiveTab('profile')} className={tabBtn(activeTab === 'profile')}>
                  <i className="fa-solid fa-gear mr-2 text-xs" />Profile Settings
                </button>
              </div>

              <NeonButton variant="ghost" size="sm" className="w-full">
                <i className="fa-solid fa-right-from-bracket mr-2 text-xs" />Logout
              </NeonButton>
            </div>
          </aside>

          {/* ═══════ MAIN ═══════ */}
          <section>
            {/* ── purchases tab ──────────── */}
            {activeTab === 'purchases' && (
              <div className="space-y-6 animate-[fadeIn_.3s_ease]">
                <div>
                  <h2 className={`${syne} text-3xl font-bold`}>Purchase History</h2>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)] mt-1`}>
                    {purchases.length} asset{purchases.length !== 1 ? 's' : ''} purchased
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-10 h-10 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-12 text-center space-y-4">
                    <i className="fa-solid fa-box-open text-3xl text-[rgba(240,240,240,0.1)]" />
                    <p className={`${jb} text-sm text-[rgba(240,240,240,0.2)]`}>No purchases yet</p>
                    <Link href="/catalogue">
                      <NeonButton variant="primary" size="md">Browse Assets</NeonButton>
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Table header */}
                    <div className="hidden sm:grid grid-cols-[1fr_100px_120px_180px] gap-4 px-4 pb-2">
                      <span className={`${jb} text-[9px] tracking-[3px] uppercase text-[rgba(240,240,240,0.15)]`}>Asset</span>
                      <span className={`${jb} text-[9px] tracking-[3px] uppercase text-[rgba(240,240,240,0.15)]`}>Status</span>
                      <span className={`${jb} text-[9px] tracking-[3px] uppercase text-[rgba(240,240,240,0.15)]`}>Amount</span>
                      <span className={`${jb} text-[9px] tracking-[3px] uppercase text-[rgba(240,240,240,0.15)] text-right`}>Actions</span>
                    </div>
                    <div className="space-y-2">
                      {purchases.map((p) => (
                        <div
                          key={p.id}
                          className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-4 flex flex-col sm:grid sm:grid-cols-[1fr_100px_120px_180px] sm:items-center gap-4 transition-all hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.03)]"
                        >
                          {/* Asset info */}
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant={catVariant(p.category)}>{p.category}</Badge>
                            </div>
                            <h3 className={`${syne} font-bold text-[#f0f0f0]`}>{p.assetName}</h3>
                            <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>
                              Purchased {new Date(p.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>

                          {/* Status */}
                          <div>
                            <Badge variant={p.status === 'PAID' ? 'green' : 'amber'}>{p.status}</Badge>
                          </div>

                          {/* Amount */}
                          <p className={`${syne} text-lg font-bold text-[#00ffff]`}>
                            ${p.amount.toFixed(2)}
                          </p>

                          {/* Download with countdown */}
                          <div className="flex justify-end">
                            {p.status === 'PAID' ? (
                              <DownloadTimer assetId={p.assetId} assetName={p.assetName} />
                            ) : (
                              <span className={`${jb} text-[10px] text-[rgba(240,240,240,0.2)]`}>Payment pending</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── profile tab ────────────── */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-[fadeIn_.3s_ease]">
                <div>
                  <h2 className={`${syne} text-3xl font-bold`}>Profile Settings</h2>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)] mt-1`}>Manage your account</p>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-5">
                  <div>
                    <label className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)] block mb-2`}>
                      Email Address
                    </label>
                    <input type="email" value="buyer@prosets.io" disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
                  </div>

                  <div>
                    <label className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)] block mb-2`}>
                      Display Name
                    </label>
                    <input type="text" placeholder="Your name" className={inputCls} />
                  </div>

                  <div>
                    <label className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.15)] block mb-2`}>
                      Bio
                    </label>
                    <textarea placeholder="Tell us about yourself" rows={4} className={inputCls} />
                  </div>

                  <NeonButton variant="primary" size="md">Save Changes</NeonButton>
                </div>

                {/* danger zone */}
                <div className="border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.03)] rounded-[3px] p-6 space-y-3">
                  <h3 className={`${syne} font-bold text-[#ef4444]`}>
                    <i className="fa-solid fa-triangle-exclamation mr-2 text-sm" />Danger Zone
                  </h3>
                  <p className={`${jb} text-xs text-[rgba(240,240,240,0.2)]`}>
                    Permanently delete your account and all associated data.
                  </p>
                  <NeonButton variant="danger" size="sm">Delete Account</NeonButton>
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
