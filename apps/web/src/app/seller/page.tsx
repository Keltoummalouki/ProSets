'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

interface SellerAsset {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'Active' | 'Inactive';
  sales: number;
  revenue: number;
  createdDate: string;
}

/* ─── helpers ─── */
const syne = 'font-[family-name:var(--font-syne)]';
const jb = 'font-[family-name:var(--font-jetbrains)]';
const label = `text-[10px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.25)] block mb-2`;
const input = `w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[3px] px-4 py-3 text-[#f0f0f0] text-[12px] ${jb} focus:border-[rgba(0,255,255,0.4)] focus:shadow-[0_0_20px_rgba(0,255,255,0.1)] focus:outline-none transition-all placeholder:text-[rgba(240,240,240,0.15)]`;

const tabBtn = (active: boolean) =>
  `w-full text-left px-4 py-3 rounded-[3px] text-[12px] ${jb} tracking-wide transition-all ${active
    ? 'bg-[rgba(245,158,11,0.08)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]'
    : 'text-[rgba(240,240,240,0.35)] hover:text-[#f0f0f0] hover:bg-[rgba(255,255,255,0.03)]'
  }`;

/* ─── Sparkline Component ─── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="sparkline">
      {data.map((val, i) => (
        <div
          key={i}
          className="sparkline-bar"
          style={{
            height: `${(val / max) * 100}%`,
            background: i === data.length - 1 ? color : `${color}40`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function SellerDashboardPage() {
  const [assets, setAssets] = useState<SellerAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'upload'>('overview');
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '3D Models',
    price: '',
    license: 'Personal Use',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<'asset' | 'preview' | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets?limit=100`);
        if (!response.ok) throw new Error('Failed to load assets');
        const data = await response.json();
        const assetsArray = Array.isArray(data) ? data : data?.assets || [];
        const mappedAssets: SellerAsset[] = assetsArray.map((asset: any) => ({
          id: asset.id,
          name: asset.name,
          category: asset.category?.name || 'Unknown',
          price: asset.price,
          status: asset.status === 'ACTIVE' ? 'Active' : 'Inactive',
          sales: 0,
          revenue: 0,
          createdDate: asset.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        }));
        setAssets(mappedAssets);
      } catch {
        setAssets([
          { id: 'asset_1', name: 'Modern 3D Character Model', category: '3D Models', price: 49.99, status: 'Active', sales: 12, revenue: 599.88, createdDate: '2025-01-15' },
          { id: 'asset_2', name: 'React Component Library', category: 'Code Snippets', price: 29.99, status: 'Active', sales: 8, revenue: 239.92, createdDate: '2025-01-20' },
          { id: 'asset_3', name: 'Productivity Notion Template', category: 'Notion Templates', price: 19.99, status: 'Inactive', sales: 5, revenue: 99.95, createdDate: '2025-02-01' },
          { id: 'asset_4', name: 'Cyberpunk Icon Set', category: 'UI Kits', price: 15.00, status: 'Active', sales: 22, revenue: 330.00, createdDate: '2025-02-10' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, []);

  const totalRevenue = assets.reduce((sum, a) => sum + a.revenue, 0);
  const totalSales = assets.reduce((sum, a) => sum + a.sales, 0);
  const activeAssets = assets.filter((a) => a.status === 'Active').length;

  /* ─── Sparkline mock data ─── */
  const revenueSparkline = [120, 180, 90, 210, 300, 250, 380, 420, 350, 480, 520, 600];
  const salesSparkline = [3, 5, 2, 7, 4, 8, 6, 9, 7, 11, 10, 12];
  const viewsSparkline = [40, 65, 80, 55, 90, 120, 100, 140, 130, 160, 180, 200];

  /* ─── File handlers ─── */
  const handleAssetFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files.length > 0) setAssetFile(e.dataTransfer.files[0]);
  };
  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setAssetFile(e.target.files[0]); };

  const handlePreviewImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(null);
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]; setPreviewImage(file);
      const reader = new FileReader(); reader.onload = (ev) => setPreviewImageUrl(ev.target?.result as string); reader.readAsDataURL(file);
    }
  };
  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]; setPreviewImage(file);
      const reader = new FileReader(); reader.onload = (ev) => setPreviewImageUrl(ev.target?.result as string); reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error on change
    setFormErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  /* ─── File-to-base64 helper ─── */
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => { const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(file); });

  /* ─── Validation ─── */
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Enter a valid price';
    if (!assetFile && !editingAssetId) errors.assetFile = 'Please upload an asset file';
    if (!previewImage && !editingAssetId) errors.previewImage = 'Please upload a preview image';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ─── Publish / Save Draft ─── */
  const handlePublishAsset = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const assetFileBase64 = assetFile && !editingAssetId ? await toBase64(assetFile) : '';
      const previewImageBase64 = previewImage && !editingAssetId ? await toBase64(previewImage) : '';

      const url = editingAssetId ? `${process.env.NEXT_PUBLIC_API_URL}/assets/${editingAssetId}` : `${process.env.NEXT_PUBLIC_API_URL}/assets`;
      const method = editingAssetId ? 'PATCH' : 'POST';
      const payload: any = { name: formData.title, description: formData.description, price: parseFloat(formData.price), categoryId: formData.category, status: 'ACTIVE' };
      if (!editingAssetId) { payload.sellerId = 'seller_123'; payload.fileKey = assetFile?.name || ''; payload.previewUrls = previewImage ? [previewImage.name] : []; payload.assetFileBase64 = assetFileBase64; payload.previewImageBase64 = previewImageBase64; }

      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || 'Failed to publish asset'); }
      const result = await response.json();

      if (editingAssetId) {
        setAssets(assets.map((a) => a.id === editingAssetId ? { ...a, name: formData.title, category: formData.category, price: parseFloat(formData.price) } : a));
      } else {
        setAssets([...assets, { id: result.id, name: formData.title, category: formData.category, price: parseFloat(formData.price), status: 'Active', sales: 0, revenue: 0, createdDate: new Date().toISOString().split('T')[0] }]);
      }

      await Swal.fire({ icon: 'success', title: editingAssetId ? 'Updated!' : 'Published!', text: editingAssetId ? 'Asset updated successfully!' : 'Asset published successfully!', confirmButtonColor: '#0FF' });
      resetForm(); setActiveTab('assets');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error instanceof Error ? error.message : 'Failed to publish asset', confirmButtonColor: '#0FF' });
    } finally { setSubmitting(false); }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) { setFormErrors({ title: 'Title is required' }); return; }
    setSubmitting(true);
    try {
      const assetFileBase64 = assetFile ? await toBase64(assetFile) : '';
      const previewImageBase64 = previewImage ? await toBase64(previewImage) : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.title, description: formData.description, price: formData.price ? parseFloat(formData.price) : 0, categoryId: formData.category, sellerId: 'seller_123', status: 'PENDING_REVIEW', fileKey: assetFile?.name || '', previewUrls: previewImage ? [previewImage.name] : [], assetFileBase64, previewImageBase64 }),
      });
      if (!response.ok) { const error = await response.json(); throw new Error(error.message || 'Failed to save draft'); }
      await Swal.fire({ icon: 'success', title: 'Saved!', text: 'Draft saved successfully!', confirmButtonColor: '#0FF' });
      resetForm(); setActiveTab('assets');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error instanceof Error ? error.message : 'Failed to save draft', confirmButtonColor: '#0FF' });
    } finally { setSubmitting(false); }
  };

  const resetForm = () => { setAssetFile(null); setPreviewImage(null); setPreviewImageUrl(''); setFormData({ title: '', description: '', category: '3D Models', price: '', license: 'Personal Use' }); setEditingAssetId(null); setFormErrors({}); };

  const handleEditAsset = (asset: SellerAsset) => {
    setFormData({ title: asset.name, description: '', category: asset.category, price: asset.price.toString(), license: 'Personal Use' });
    setEditingAssetId(asset.id); setActiveTab('upload');
  };

  const handleDeleteAsset = async (assetId: string, assetName: string) => {
    const result = await Swal.fire({ icon: 'warning', title: 'Delete Asset?', text: `Are you sure you want to delete "${assetName}"? This action cannot be undone.`, showCancelButton: true, confirmButtonColor: '#FF6B6B', cancelButtonColor: '#6B7280', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' });
    if (!result.isConfirmed) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assets/${assetId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete asset');
      setAssets(assets.filter((a) => a.id !== assetId));
      await Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Asset deleted successfully!', confirmButtonColor: '#0FF' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error instanceof Error ? error.message : 'Failed to delete asset', confirmButtonColor: '#0FF' });
    }
  };

  const catBadge = (cat: string) => {
    if (cat === '3D Models') return 'cyan' as const;
    if (cat === 'Code Snippets') return 'amber' as const;
    return 'purple' as const;
  };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-16 w-full pt-[calc(65px+4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">

          {/* ── Sidebar ── */}
          <aside>
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6 space-y-6 sticky top-[90px]">
              {/* Profile */}
              <div className="space-y-3 pb-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="w-14 h-14 rounded-[3px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)] flex items-center justify-center">
                  <i className="fa-solid fa-palette text-xl text-[#F59E0B]" />
                </div>
                <div>
                  <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.2)]`}>Seller Account</span>
                  <p className={`${syne} text-base font-bold text-[#f0f0f0] mt-0.5`}>Creator Studio</p>
                  <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.2)]`}>seller@prosets.io</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 pb-5 border-b border-[rgba(255,255,255,0.06)]">
                <div>
                  <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.15)]`}>Total Revenue</span>
                  <p className={`${syne} text-xl font-extrabold text-[#00ffff]`}>${totalRevenue.toFixed(2)}</p>
                </div>
                <div>
                  <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.15)]`}>Assets</span>
                  <p className={`${syne} text-xl font-extrabold text-[#f0f0f0]`}>{assets.length}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="space-y-1">
                <button onClick={() => setActiveTab('overview')} className={tabBtn(activeTab === 'overview')}>
                  <i className="fa-solid fa-chart-line mr-2.5 text-xs" />Overview
                </button>
                <button onClick={() => setActiveTab('assets')} className={tabBtn(activeTab === 'assets')}>
                  <i className="fa-solid fa-box mr-2.5 text-xs" />My Assets
                </button>
                <button onClick={() => { resetForm(); setActiveTab('upload'); }} className={tabBtn(activeTab === 'upload')}>
                  <i className="fa-solid fa-cloud-arrow-up mr-2.5 text-xs" />Upload Asset
                </button>
              </div>

              <NeonButton variant="ghost" size="sm" className="w-full">
                <i className="fa-solid fa-right-from-bracket mr-2" />Logout
              </NeonButton>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div>
            {/* ─── OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-[fadeIn_.3s_ease]">
                <div className="border-b border-[rgba(255,255,255,0.06)] pb-6">
                  <h2 className={`${syne} text-[clamp(28px,4vw,40px)] font-extrabold leading-[1]`}>Revenue <span className="text-[#F59E0B]">Overview</span></h2>
                  <p className={`text-[12px] ${jb} text-[rgba(240,240,240,0.3)] mt-2`}>Track your sales and earnings</p>
                </div>

                {/* Stats with Sparklines */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
                  {[
                    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, trend: '+18.2%', trendUp: true, color: '#00ffff', icon: 'fa-solid fa-dollar-sign', sparkData: revenueSparkline },
                    { label: 'Active Assets', value: activeAssets.toString(), trend: `${assets.length} total`, trendUp: true, color: '#F59E0B', icon: 'fa-solid fa-box', sparkData: viewsSparkline },
                    { label: 'Total Sales', value: totalSales.toString(), trend: '+12% this month', trendUp: true, color: '#22c55e', icon: 'fa-solid fa-chart-bar', sparkData: salesSparkline },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[rgba(10,10,10,0.8)] backdrop-blur-md p-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 border rounded-[3px] flex items-center justify-center text-xs" style={{ borderColor: `${stat.color}30`, color: stat.color }}>
                            <i className={stat.icon} />
                          </div>
                          <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.25)]`}>{stat.label}</span>
                        </div>
                        <Sparkline data={stat.sparkData} color={stat.color} />
                      </div>
                      <p className={`${syne} text-4xl font-extrabold`} style={{ color: stat.color }}>{stat.value}</p>
                      <div className="flex items-center gap-2">
                        {stat.trendUp && <i className="fa-solid fa-arrow-trend-up text-[10px] text-[#22c55e]" />}
                        <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.3)]`}>{stat.trend}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Revenue Chart placeholder */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`${syne} font-bold text-lg`}>Earnings Trend</h3>
                    <div className="flex gap-2">
                      {['7D', '1M', '3M', '1Y'].map((period) => (
                        <button key={period} className={`px-2.5 py-1 rounded-[3px] text-[10px] ${jb} transition-all ${period === '1M' ? 'bg-[rgba(0,255,255,0.1)] text-[#00ffff] border border-[rgba(0,255,255,0.3)]' : 'text-[rgba(240,240,240,0.25)] hover:text-[#f0f0f0]'}`}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* CSS-only bar chart */}
                  <div className="flex items-end gap-2 h-40">
                    {revenueSparkline.map((val, i) => {
                      const max = Math.max(...revenueSparkline);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full rounded-[2px] transition-all duration-700 hover:opacity-80 relative group"
                            style={{
                              height: `${(val / max) * 100}%`,
                              background: `linear-gradient(to top, rgba(0,255,255,0.4), rgba(0,255,255,0.15))`,
                              animationDelay: `${i * 80}ms`,
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className={`${jb} text-[9px] text-[#00ffff] bg-[rgba(0,0,0,0.8)] px-1.5 py-0.5 rounded-[2px] whitespace-nowrap`}>${val}</span>
                            </div>
                          </div>
                          <span className={`text-[8px] ${jb} text-[rgba(240,240,240,0.15)]`}>{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-6">
                  <h3 className={`${syne} font-bold text-lg mb-5`}>Recent Sales</h3>
                  <div className="space-y-0 divide-y divide-[rgba(255,255,255,0.04)]">
                    {[
                      { name: 'Modern 3D Character Model', time: '2 hours ago', amount: '+$49.99', cat: '3D Models' },
                      { name: 'React Component Library', time: '5 hours ago', amount: '+$29.99', cat: 'Code Snippets' },
                      { name: 'Cyberpunk Icon Set', time: '12 hours ago', amount: '+$15.00', cat: 'UI Kits' },
                      { name: 'Productivity Notion Template', time: '1 day ago', amount: '+$19.99', cat: 'Notion Templates' },
                    ].map((sale) => (
                      <div key={sale.name} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[rgba(0,255,255,0.06)] border border-[rgba(0,255,255,0.15)] rounded-[3px] flex items-center justify-center">
                            <i className="fa-solid fa-arrow-down text-[10px] text-[#00ffff]" />
                          </div>
                          <div>
                            <p className={`${syne} font-bold text-sm text-[#f0f0f0]`}>{sale.name}</p>
                            <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.2)]`}>{sale.cat} · {sale.time}</p>
                          </div>
                        </div>
                        <p className={`${syne} font-bold text-[#00ffff]`}>{sale.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <NeonButton variant="primary" size="lg" onClick={() => setActiveTab('upload')} className="w-full">
                  <i className="fa-solid fa-plus mr-2" />Upload New Asset
                </NeonButton>
              </div>
            )}

            {/* ─── ASSETS ─── */}
            {activeTab === 'assets' && (
              <div className="space-y-8 animate-[fadeIn_.3s_ease]">
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-6">
                  <div>
                    <h2 className={`${syne} text-[clamp(28px,4vw,40px)] font-extrabold leading-[1]`}>My <span className="text-[#F59E0B]">Assets</span></h2>
                    <p className={`text-[12px] ${jb} text-[rgba(240,240,240,0.3)] mt-2`}>{assets.length} asset{assets.length !== 1 ? 's' : ''} published</p>
                  </div>
                  <NeonButton variant="primary" size="sm" onClick={() => { resetForm(); setActiveTab('upload'); }}>
                    <i className="fa-solid fa-plus mr-1.5" />Upload
                  </NeonButton>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : assets.length === 0 ? (
                  <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-16 text-center">
                    <i className="fa-solid fa-box-open text-3xl text-[rgba(240,240,240,0.1)] mb-4 block" />
                    <p className={`text-[rgba(240,240,240,0.3)] ${jb} text-sm mb-5`}>No assets uploaded yet</p>
                    <NeonButton variant="primary" size="md" onClick={() => setActiveTab('upload')}>Upload Your First Asset</NeonButton>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assets.map((asset) => (
                      <div key={asset.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.03)]">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={catBadge(asset.category)}>{asset.category}</Badge>
                            <Badge variant={asset.status === 'Active' ? 'green' : 'gray'}>{asset.status}</Badge>
                          </div>
                          <h3 className={`${syne} font-bold text-[#f0f0f0] text-sm truncate`}>{asset.name}</h3>
                          <div className="flex items-center gap-4 mt-1.5">
                            <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.2)]`}>{asset.sales} sales</p>
                            <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.2)]`}>${asset.revenue.toFixed(2)} revenue</p>
                            {/* Mini performance bar */}
                            <div className="progress-bar w-16">
                              <div
                                className="progress-bar-fill bg-[#00ffff]"
                                style={{ width: `${Math.min((asset.sales / Math.max(...assets.map(a => a.sales), 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className={`${syne} text-xl font-extrabold text-[#00ffff]`}>${asset.price.toFixed(2)}</span>
                          <div className="flex gap-2">
                            <NeonButton variant="secondary" size="xs" onClick={() => handleEditAsset(asset)}>Edit</NeonButton>
                            <NeonButton variant="danger" size="xs" onClick={() => handleDeleteAsset(asset.id, asset.name)}>Delete</NeonButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── UPLOAD ─── */}
            {activeTab === 'upload' && (
              <div className="space-y-8 animate-[fadeIn_.3s_ease]">
                <div className="border-b border-[rgba(255,255,255,0.06)] pb-6">
                  <h2 className={`${syne} text-[clamp(28px,4vw,40px)] font-extrabold leading-[1]`}>
                    {editingAssetId ? 'Edit' : 'Upload New'} <span className="text-[#F59E0B]">Asset</span>
                  </h2>
                  <p className={`text-[12px] ${jb} text-[rgba(240,240,240,0.3)] mt-2`}>Share your creation with the Prosets community</p>
                </div>

                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-8 space-y-7">
                  {/* Asset File */}
                  <div>
                    <label className={label}>Asset File</label>
                    <div
                      onDrop={handleAssetFileDrop}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive('asset'); }}
                      onDragLeave={() => setDragActive(null)}
                      className={`border-2 border-dashed rounded-[3px] p-10 text-center transition-all cursor-pointer group ${dragActive === 'asset'
                          ? 'border-[#00ffff] bg-[rgba(0,255,255,0.04)] shadow-[0_0_30px_rgba(0,255,255,0.1)]'
                          : formErrors.assetFile
                            ? 'border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.02)]'
                            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,255,255,0.3)]'
                        }`}
                    >
                      <input type="file" id="asset-file" onChange={handleAssetFileChange} className="hidden" />
                      <label htmlFor="asset-file" className="cursor-pointer block">
                        {assetFile ? (
                          <div>
                            <i className="fa-solid fa-check-circle text-[#00ffff] text-xl mb-2 block" />
                            <p className={`text-[#00ffff] ${jb} text-[12px]`}>{assetFile.name}</p>
                            <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.2)] mt-1`}>{(assetFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div>
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-[3px] border-2 border-dashed flex items-center justify-center transition-all ${dragActive === 'asset' ? 'border-[#00ffff] text-[#00ffff]' : 'border-[rgba(255,255,255,0.08)] text-[rgba(240,240,240,0.15)] group-hover:text-[rgba(0,255,255,0.4)] group-hover:border-[rgba(0,255,255,0.2)]'}`} style={dragActive === 'asset' ? { animation: 'glow-pulse 1.5s ease-in-out infinite' } : {}}>
                              <i className="fa-solid fa-cloud-arrow-up text-2xl" />
                            </div>
                            <p className={`text-[rgba(240,240,240,0.3)] ${jb} text-[12px] mb-1`}>Drag and drop your file here</p>
                            <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.15)]`}>or click to browse · Any file type</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {formErrors.assetFile && <p className={`text-[10px] ${jb} text-[#ef4444] mt-1.5`}><i className="fa-solid fa-exclamation-circle mr-1" />{formErrors.assetFile}</p>}
                  </div>

                  {/* Preview Image */}
                  <div>
                    <label className={label}>Preview Image</label>
                    <div
                      onDrop={handlePreviewImageDrop}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive('preview'); }}
                      onDragLeave={() => setDragActive(null)}
                      className={`border-2 border-dashed rounded-[3px] p-10 text-center transition-all cursor-pointer group ${dragActive === 'preview'
                          ? 'border-[#00ffff] bg-[rgba(0,255,255,0.04)] shadow-[0_0_30px_rgba(0,255,255,0.1)]'
                          : formErrors.previewImage
                            ? 'border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.02)]'
                            : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,255,255,0.3)]'
                        }`}
                    >
                      <input type="file" id="preview-image" onChange={handlePreviewImageChange} accept="image/*" className="hidden" />
                      <label htmlFor="preview-image" className="cursor-pointer block">
                        {previewImageUrl ? (
                          <div className="space-y-2">
                            <img src={previewImageUrl} alt="Preview" className="w-28 h-28 object-cover mx-auto rounded-[3px] border border-[rgba(0,255,255,0.3)]" />
                            <p className={`text-[#00ffff] ${jb} text-[12px]`}>{previewImage?.name}</p>
                          </div>
                        ) : (
                          <div>
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-[3px] border-2 border-dashed flex items-center justify-center transition-all ${dragActive === 'preview' ? 'border-[#00ffff] text-[#00ffff]' : 'border-[rgba(255,255,255,0.08)] text-[rgba(240,240,240,0.15)] group-hover:text-[rgba(0,255,255,0.4)] group-hover:border-[rgba(0,255,255,0.2)]'}`} style={dragActive === 'preview' ? { animation: 'glow-pulse 1.5s ease-in-out infinite' } : {}}>
                              <i className="fa-solid fa-image text-2xl" />
                            </div>
                            <p className={`text-[rgba(240,240,240,0.3)] ${jb} text-[12px] mb-1`}>Upload preview image</p>
                            <p className={`text-[10px] ${jb} text-[rgba(240,240,240,0.15)]`}>JPG, PNG (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                    {formErrors.previewImage && <p className={`text-[10px] ${jb} text-[#ef4444] mt-1.5`}><i className="fa-solid fa-exclamation-circle mr-1" />{formErrors.previewImage}</p>}
                  </div>

                  {/* Title */}
                  <div>
                    <label className={label}>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="Asset title" className={`${input} ${formErrors.title ? 'border-[rgba(239,68,68,0.4)]! focus:border-[rgba(239,68,68,0.6)]!' : ''}`} />
                    {formErrors.title && <p className={`text-[10px] ${jb} text-[#ef4444] mt-1.5`}><i className="fa-solid fa-exclamation-circle mr-1" />{formErrors.title}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className={label}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Describe your asset — what's included, use cases, tech specs..." rows={4} className={`${input} resize-none`} />
                  </div>

                  {/* Row: Category + Price + License */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className={label}>Category</label>
                      <select name="category" value={formData.category} onChange={handleFormChange} className={`${input} appearance-none cursor-pointer`}>
                        <option>3D Models</option>
                        <option>Code Snippets</option>
                        <option>Notion Templates</option>
                        <option>UI Kits</option>
                      </select>
                    </div>
                    <div>
                      <label className={label}>Price (USD)</label>
                      <input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="0.00" step="0.01" min="0" className={`${input} ${formErrors.price ? 'border-[rgba(239,68,68,0.4)]!' : ''}`} />
                      {formErrors.price && <p className={`text-[10px] ${jb} text-[#ef4444] mt-1.5`}><i className="fa-solid fa-exclamation-circle mr-1" />{formErrors.price}</p>}
                    </div>
                    <div>
                      <label className={label}>License Type</label>
                      <select name="license" value={formData.license} onChange={handleFormChange} className={`${input} appearance-none cursor-pointer`}>
                        <option>Personal Use</option>
                        <option>Commercial Use</option>
                        <option>Resale Rights</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-[rgba(255,255,255,0.06)]">
                    <NeonButton variant="primary" size="lg" className="flex-1" onClick={handlePublishAsset} disabled={submitting}>
                      {submitting ? 'Processing...' : editingAssetId ? 'Update Asset' : 'Publish Asset'}
                    </NeonButton>
                    {!editingAssetId && (
                      <NeonButton variant="ghost" size="lg" className="flex-1" onClick={handleSaveDraft} disabled={submitting}>
                        {submitting ? 'Saving...' : 'Save as Draft'}
                      </NeonButton>
                    )}
                    {editingAssetId && (
                      <NeonButton variant="ghost" size="lg" className="flex-1" onClick={() => { resetForm(); setActiveTab('assets'); }}>
                        Cancel
                      </NeonButton>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
