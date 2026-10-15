/**
 * Unified Type-Safe Fastify Backend API Client
 * Facilitates seamless decoupled communication between Next.js frontend and Fastify API gateway
 */

const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_INTERNAL_URL ||
  'https://houseofgargi-backend.onrender.com';

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      signal: options.signal || controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API request error: ${res.status}`);
    }
    return data;
  } catch (err: any) {
    if (typeof window !== 'undefined' || process.env.DEBUG_API) {
      console.warn(`[ApiClient Info] ${endpoint}: ${err.message}`);
    }
    throw err;
  }
}

export const apiClient = {
  // Authentication & Session
  auth: {
    sendOtp: async (email: string) => {
      return request('/api/v1/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    verifyOtp: async (email: string, otp: string, token: string, expiresAt: number) => {
      return request('/api/v1/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ email, otp, token, expiresAt }),
      });
    },
    me: async () => {
      return request('/api/v1/auth/me');
    },
    logout: async () => {
      return request('/api/v1/auth/logout', {
        method: 'POST',
      });
    },
  },

  // Public Catalog & Curations
  products: {
    list: async (params: { category?: string; featured?: boolean; search?: string } = {}) => {
      const sp = new URLSearchParams();
      if (params.category) sp.set('category', params.category);
      if (params.featured !== undefined) sp.set('featured', String(params.featured));
      if (params.search) sp.set('search', params.search);
      const query = sp.toString() ? `?${sp.toString()}` : '';
      return request(`/api/v1/products${query}`);
    },
    getById: async (id: string) => {
      return request(`/api/v1/products/${id}`);
    },
    categories: async () => {
      return request('/api/v1/products/categories');
    },
    featured: async (limit = 6) => {
      return request(`/api/v1/products/featured?limit=${limit}`);
    },
    newArrivals: async (limit = 12) => {
      return request(`/api/v1/products/new-arrivals?limit=${limit}`);
    },
  },

  // Bespoke Commissions
  bespoke: {
    submit: async (payload: { name: string; email: string; phone: string; category: string; material?: string; details: string }) => {
      return request('/api/v1/bespoke', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Artisan Portal
  artisan: {
    submitApplication: async (payload: { name: string; email: string; phone: string; typeOfArt: string; state: string; answers?: any; signature?: string }) => {
      return request('/api/v1/artisan/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    getProfile: async () => {
      return request('/api/v1/artisan/me');
    },
    updateProfile: async (updates: Record<string, any>) => {
      return request('/api/v1/artisan/me', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    getProducts: async () => {
      return request('/api/v1/artisan/products');
    },
    createProduct: async (productPayload: Record<string, any>) => {
      return request('/api/v1/artisan/products', {
        method: 'POST',
        body: JSON.stringify(productPayload),
      });
    },
    toggleVisibility: async (id: string, isHidden: boolean) => {
      return request(`/api/v1/artisan/products/${id}/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ isHidden }),
      });
    },
    deleteProduct: async (id: string) => {
      return request(`/api/v1/artisan/products/${id}`, {
        method: 'DELETE',
      });
    },
    getAnalytics: async () => {
      return request('/api/v1/artisan/analytics');
    },
  },

  // Admin Portal
  admin: {
    getDashboard: async () => {
      return request('/api/v1/admin/dashboard');
    },
    getProducts: async (params: { category?: string; search?: string; page?: number; limit?: number; includeHidden?: boolean } = {}) => {
      const sp = new URLSearchParams();
      if (params.category) sp.set('category', params.category);
      if (params.search) sp.set('search', params.search);
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.includeHidden !== undefined) sp.set('includeHidden', String(params.includeHidden));
      const query = sp.toString() ? `?${sp.toString()}` : '';
      return request(`/api/v1/admin/products${query}`);
    },
    updateProduct: async (id: string, updates: Record<string, any>) => {
      return request(`/api/v1/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    toggleVisibility: async (id: string, isHidden: boolean) => {
      return request(`/api/v1/admin/products/${id}/visibility`, {
        method: 'PATCH',
        body: JSON.stringify({ isHidden }),
      });
    },
    deleteProduct: async (id: string) => {
      return request(`/api/v1/admin/products/${id}`, {
        method: 'DELETE',
      });
    },
    getApplications: async () => {
      return request('/api/v1/admin/applications');
    },
    updateApplicationStatus: async (id: string, status: string, reviewNotes?: string) => {
      return request(`/api/v1/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reviewNotes }),
      });
    },
    getArtisans: async () => {
      return request('/api/v1/admin/artisans');
    },
    getArtisanDetail: async (email: string) => {
      return request(`/api/v1/admin/artisans/${encodeURIComponent(email)}`);
    },
    getBespokeRequests: async () => {
      return request('/api/v1/admin/bespoke');
    },
    updateBespokeRequest: async (id: string, updates: Record<string, any>) => {
      return request(`/api/v1/admin/bespoke/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
  },

  // Super Admin Governance
  superAdmin: {
    getDashboard: async () => {
      return request('/api/v1/super-admin/dashboard');
    },
    getRevenue: async () => {
      return request('/api/v1/super-admin/revenue');
    },
    getAdmins: async () => {
      return request('/api/v1/super-admin/admins');
    },
    addAdmin: async (email: string, role = 'admin') => {
      return request('/api/v1/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      });
    },
    removeAdmin: async (email: string) => {
      return request(`/api/v1/super-admin/admins/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
    },
    getCatalog: async (params: { category?: string; search?: string; page?: number; limit?: number } = {}) => {
      const sp = new URLSearchParams();
      if (params.category) sp.set('category', params.category);
      if (params.search) sp.set('search', params.search);
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));
      const query = sp.toString() ? `?${sp.toString()}` : '';
      return request(`/api/v1/super-admin/catalog${query}`);
    },
    getBestsellers: async () => {
      return request('/api/v1/super-admin/bestsellers');
    },
    toggleBestseller: async (id: string, isFeatured: boolean) => {
      return request(`/api/v1/super-admin/bestsellers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFeatured }),
      });
    },
    createCategory: async (categoryPayload: { id: string; name: string; slug?: string; description?: string }) => {
      return request('/api/v1/super-admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryPayload),
      });
    },
    updateCategory: async (id: string, updates: Record<string, any>) => {
      return request(`/api/v1/super-admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
    getAuditLogs: async (params: { page?: number; limit?: number } = {}) => {
      const sp = new URLSearchParams();
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));
      const query = sp.toString() ? `?${sp.toString()}` : '';
      return request(`/api/v1/super-admin/audit-logs${query}`);
    },
  },

  // Orders (Read & Legacy)
  orders: {
    createCheckoutSession: async (items: any[], currency = 'INR', notes = {}) => {
      return request('/api/v1/orders/checkout/session', {
        method: 'POST',
        body: JSON.stringify({ items, currency, notes }),
      });
    },
    createOrder: async (orderPayload: { customer_name: string; customer_phone?: string; customer_email?: string; items: any[] }) => {
      return request('/api/v1/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });
    },
  },

  // Health
  health: async () => {
    return request('/health');
  },
};
