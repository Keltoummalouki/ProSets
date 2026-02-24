const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchAssets(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const res = await fetch(`${API_URL}/assets?${query.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch assets');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchAssetById(id: string) {
  const res = await fetch(`${API_URL}/assets/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch asset');
  return res.json();
}
