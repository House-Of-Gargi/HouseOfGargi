/**
 * Unified Type-Safe Fastify Backend API Client
 * Facilitates seamless decoupled communication between Next.js frontend and Fastify API gateway
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')
  : (process.env.BACKEND_INTERNAL_URL || 'http://localhost:5000');

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API request error: ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.error(`[ApiClient Error] ${endpoint}:`, err.message);
    throw err;
  }
}

export const apiClient = {
  // Authentication & OTP
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
  },

  // Catalog
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
  },

  // Orders & Checkout
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

  // Seller Telemetry
  seller: {
    getAnalytics: async () => {
      return request('/api/v1/seller/analytics');
    },
  },

  // Health
  health: async () => {
    return request('/health');
  },
};
