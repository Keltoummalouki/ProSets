'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { NeonButton } from '@/components/ui/neon-button';

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

export default function SellerDashboardPage() {
  const [assets, setAssets] = useState<SellerAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'upload'>('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
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
  const [categories, setCategories] = useState<string[]>([
    '3D Models',
    'Code Snippets',
    'Notion Templates',
    'UI Kits',
  ]);

  useEffect(() => {
    // TODO: Fetch seller assets from API
    // For now, mock data
    setAssets([
      {
        id: '1',
        name: 'Modern 3D Character Model',
        category: '3D Models',
        price: 49.99,
        status: 'Active',
        sales: 12,
        revenue: 599.88,
        createdDate: '2025-01-15',
      },
      {
        id: '2',
        name: 'React Component Library',
        category: 'Code Snippets',
        price: 29.99,
        status: 'Active',
        sales: 8,
        revenue: 239.92,
        createdDate: '2025-01-20',
      },
      {
        id: '3',
        name: 'Productivity Notion Template',
        category: 'Notion Templates',
        price: 19.99,
        status: 'Inactive',
        sales: 5,
        revenue: 99.95,
        createdDate: '2025-02-01',
      },
    ]);
    setLoading(false);
  }, []);

  const totalRevenue = assets.reduce((sum, a) => sum + a.revenue, 0);
  const totalSales = assets.reduce((sum, a) => sum + a.sales, 0);
  const activeAssets = assets.filter((a) => a.status === 'Active').length;

  const handleAssetFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setAssetFile(files[0]);
    }
  };

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAssetFile(e.target.files[0]);
    }
  };

  const handlePreviewImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setPreviewImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreviewImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePublishAsset = async () => {
    if (!assetFile) {
      Swal.fire({
        icon: 'error',
        title: 'Missing File',
        text: 'Please upload an asset file',
        confirmButtonColor: '#0FF',
      });
      return;
    }
    if (!previewImage) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Preview',
        text: 'Please upload a preview image',
        confirmButtonColor: '#0FF',
      });
      return;
    }
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Title',
        text: 'Please enter an asset title',
        confirmButtonColor: '#0FF',
      });
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Price',
        text: 'Please enter a valid price',
        confirmButtonColor: '#0FF',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Convert files to base64
      const assetFileBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(assetFile);
      });

      const previewImageBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(previewImage);
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            categoryId: formData.category,
            sellerId: 'seller_123',
            status: 'ACTIVE',
            fileKey: assetFile.name,
            previewUrls: [previewImage.name],
            assetFileBase64,
            previewImageBase64,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish asset');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Published!',
        text: 'Asset published successfully!',
        confirmButtonColor: '#0FF',
      });
      resetForm();
      setActiveTab('assets');
    } catch (error) {
      console.error('Failed to publish asset:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to publish asset',
        confirmButtonColor: '#0FF',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Title',
        text: 'Please enter an asset title',
        confirmButtonColor: '#0FF',
      });
      return;
    }

    setSubmitting(true);
    try {
      let assetFileBase64 = '';
      let previewImageBase64 = '';

      if (assetFile) {
        assetFileBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(assetFile);
        });
      }

      if (previewImage) {
        previewImageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(previewImage);
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.title,
            description: formData.description,
            price: formData.price ? parseFloat(formData.price) : 0,
            categoryId: formData.category,
            sellerId: 'seller_123',
            status: 'PENDING_REVIEW',
            fileKey: assetFile?.name || '',
            previewUrls: previewImage ? [previewImage.name] : [],
            assetFileBase64,
            previewImageBase64,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save draft');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Draft saved successfully!',
        confirmButtonColor: '#0FF',
      });
      resetForm();
      setActiveTab('assets');
    } catch (error) {
      console.error('Failed to save draft:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to save draft',
        confirmButtonColor: '#0FF',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setAssetFile(null);
    setPreviewImage(null);
    setPreviewImageUrl('');
    setFormData({
      title: '',
      description: '',
      category: '3D Models',
      price: '',
      license: 'Personal Use',
    });
  };

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
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                    Seller Account
                  </p>
                  <p className="text-lg font-syne font-bold">Creator Studio</p>
                  <p className="text-xs text-gray-500">seller@nexvault.com</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-2 border-t border-gray-800 pt-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'overview'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('assets')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'assets'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  My Assets
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition ${
                    activeTab === 'upload'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Upload Asset
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
                  <h2 className="text-3xl font-syne font-bold mb-2">Revenue Overview</h2>
                  <p className="text-gray-400">Track your sales and earnings</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                      Total Revenue
                    </p>
                    <p className="text-4xl font-syne font-bold text-cyan-400">
                      ${totalRevenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">From {totalSales} sales</p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                      Active Assets
                    </p>
                    <p className="text-4xl font-syne font-bold text-amber-400">
                      {activeAssets}
                    </p>
                    <p className="text-xs text-gray-500">Of {assets.length} total</p>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-2">
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                      Total Sales
                    </p>
                    <p className="text-4xl font-syne font-bold text-green-400">
                      {totalSales}
                    </p>
                    <p className="text-xs text-gray-500">All time</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-6 space-y-4">
                  <h3 className="font-syne font-bold text-lg">Recent Sales</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div>
                        <p className="font-syne font-bold text-white">Modern 3D Character Model</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <p className="text-cyan-400 font-syne font-bold">+$49.99</p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-800">
                      <div>
                        <p className="font-syne font-bold text-white">React Component Library</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                      <p className="text-cyan-400 font-syne font-bold">+$29.99</p>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-syne font-bold text-white">Productivity Notion Template</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <p className="text-cyan-400 font-syne font-bold">+$19.99</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <NeonButton
                    variant="primary"
                    size="lg"
                    onClick={() => setActiveTab('upload')}
                    className="w-full"
                  >
                    + Upload New Asset
                  </NeonButton>
                </div>
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-syne font-bold mb-2">My Assets</h2>
                    <p className="text-gray-400">
                      {assets.length} asset{assets.length !== 1 ? 's' : ''} published
                    </p>
                  </div>
                  <NeonButton
                    variant="primary"
                    size="md"
                    onClick={() => setActiveTab('upload')}
                  >
                    + Upload
                  </NeonButton>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : assets.length === 0 ? (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-12 text-center">
                    <p className="text-gray-400 mb-4">No assets uploaded yet</p>
                    <NeonButton
                      variant="primary"
                      size="md"
                      onClick={() => setActiveTab('upload')}
                    >
                      Upload Your First Asset
                    </NeonButton>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 flex items-center justify-between hover:border-gray-700 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
                                asset.category === '3D Models'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                                  : asset.category === 'Code Snippets'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                                    : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                              }`}
                            >
                              {asset.category}
                            </span>
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
                                asset.status === 'Active'
                                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                                  : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                              }`}
                            >
                              {asset.status}
                            </span>
                          </div>
                          <h3 className="font-syne font-bold text-white mb-1">{asset.name}</h3>
                          <p className="text-xs text-gray-500">
                            {asset.sales} sales • ${asset.revenue.toFixed(2)} revenue
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-syne font-bold text-cyan-400">
                              ${asset.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <NeonButton variant="secondary" size="sm">
                              Edit
                            </NeonButton>
                            <NeonButton variant="ghost" size="sm">
                              Delete
                            </NeonButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-syne font-bold mb-2">Upload New Asset</h2>
                  <p className="text-gray-400">Share your creation with the NexVault community</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-8 space-y-6">
                  {/* Asset File Upload */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-3">
                      Asset File
                    </label>
                    <div
                      onDrop={handleAssetFileDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="border-2 border-dashed border-gray-700 rounded-sm p-8 text-center hover:border-cyan-500 transition cursor-pointer"
                    >
                      <input
                        type="file"
                        id="asset-file"
                        onChange={handleAssetFileChange}
                        className="hidden"
                      />
                      <label htmlFor="asset-file" className="cursor-pointer block">
                        {assetFile ? (
                          <div>
                            <p className="text-cyan-400 font-mono text-sm">✓ {assetFile.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(assetFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-400 mb-2">Drag and drop your file here</p>
                            <p className="text-xs text-gray-500">or click to browse</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Preview Image Upload */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-3">
                      Preview Image
                    </label>
                    <div
                      onDrop={handlePreviewImageDrop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="border-2 border-dashed border-gray-700 rounded-sm p-8 text-center hover:border-cyan-500 transition cursor-pointer"
                    >
                      <input
                        type="file"
                        id="preview-image"
                        onChange={handlePreviewImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <label htmlFor="preview-image" className="cursor-pointer block">
                        {previewImageUrl ? (
                          <div className="space-y-2">
                            <img
                              src={previewImageUrl}
                              alt="Preview"
                              className="w-32 h-32 object-cover mx-auto rounded-sm border border-cyan-500/50"
                            />
                            <p className="text-cyan-400 font-mono text-sm">✓ {previewImage?.name}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-400 mb-2">Upload preview image</p>
                            <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      placeholder="Asset title"
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Describe your asset..."
                      rows={4}
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    >
                      <option>3D Models</option>
                      <option>Code Snippets</option>
                      <option>Notion Templates</option>
                      <option>UI Kits</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>

                  {/* License */}
                  <div>
                    <label className="text-sm text-gray-500 font-mono uppercase tracking-wider block mb-2">
                      License Type
                    </label>
                    <select
                      name="license"
                      value={formData.license}
                      onChange={handleFormChange}
                      className="w-full bg-gray-950 border border-gray-800 rounded-sm px-4 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none transition"
                    >
                      <option>Personal Use</option>
                      <option>Commercial Use</option>
                      <option>Resale Rights</option>
                    </select>
                  </div>

                  {/* Submit */}
                  <div className="space-y-3 pt-4 border-t border-gray-800">
                    <NeonButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handlePublishAsset}
                      disabled={submitting}
                    >
                      {submitting ? 'Publishing...' : 'Publish Asset'}
                    </NeonButton>
                    <NeonButton
                      variant="ghost"
                      size="lg"
                      className="w-full"
                      onClick={handleSaveDraft}
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save as Draft'}
                    </NeonButton>
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
