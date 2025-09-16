import { CapacitorHttp } from '@capacitor/core';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://auction-app-backend-production.up.railway.app';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: any[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  wallet_balance: number;
  avatar_url?: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  market_price: number;
  category?: string;
  brand?: string;
  specifications?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAuctionRequest {
  product_id: string;
  title: string;
  description?: string;
  entry_fee: number;
  min_wallet: number;
  starting_bid: number;
  start_time: string;
  end_time: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await CapacitorHttp.request({
        url,
        method: (options.method as any) || 'GET',
        headers,
        data: options.body ? JSON.parse(options.body as string) : undefined,
      });

      if (response.status >= 400) {
        throw new Error(response.data?.error || `HTTP error! status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.request<{ user: User; tokens: AuthTokens }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.tokens) {
      this.setToken(response.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; tokens: AuthTokens }>> {
    const response = await this.request<{ user: User; tokens: AuthTokens }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.tokens) {
      this.setToken(response.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/api/auth/me');
  }

  async refreshToken(): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ tokens: AuthTokens }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.success && response.data?.tokens) {
      this.setToken(response.data.tokens.access_token);
      localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });

    this.setToken(null);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userSession');
    localStorage.removeItem('userCoins');
    localStorage.removeItem('joinedAuctions');
    localStorage.removeItem('userBids');

    return response;
  }

  // Auction endpoints
  async getAuctions(params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/auctions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<any[]>(endpoint);
  }

  async getAuction(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/auctions/${id}`);
  }

  async joinAuction(id: string): Promise<ApiResponse> {
    return this.request(`/api/auctions/${id}/join`, {
      method: 'POST',
    });
  }

  async placeBid(id: string, amount: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/auctions/${id}/bid`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getAuctionBids(id: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/api/auctions/${id}/bids`);
  }


  // Product endpoints
  async getProducts(params?: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Product[]>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async getProductCategories(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/api/products/categories/list');
  }

  // Payment endpoints
  async createPaymentIntent(amount: number, currency = 'usd'): Promise<ApiResponse<any>> {
    return this.request<any>('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    });
  }

  async confirmPayment(paymentIntentId: string): Promise<ApiResponse<any>> {
    return this.request<any>('/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });
  }

  async getCoinPackages(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/payments/packages');
  }

  async getPaymentHistory(page = 1, limit = 20): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/api/payments/history?page=${page}&limit=${limit}`);
  }

  // Promotional Banners endpoints
  async getPromotionalBanners(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/api/banners');
  }

  async createPromotionalBanner(bannerData: {
    title: string;
    subtitle?: string;
    description: string;
    image_url: string;
    gradient?: string;
    accent?: string;
    button_text?: string;
    button_link?: string;
    is_active?: boolean;
    order_index?: number;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/api/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData),
    });
  }

  async updatePromotionalBanner(id: string, bannerData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/api/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData),
    });
  }

  async deletePromotionalBanner(id: string): Promise<ApiResponse> {
    return this.request(`/api/banners/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
