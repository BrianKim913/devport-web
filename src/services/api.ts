import axios from 'axios';
import type { Article, BenchmarkType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Response Types
export interface ArticlePageResponse {
  content: Article[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface TrendingTickerResponse {
  id: string;
  summaryKoTitle: string;
  url: string;
  createdAtSource: string;
}

export interface LLMModelResponse {
  id: number;
  name: string;
  provider: string;
  score: number;
  rank: number;
  contextWindow?: string;
  pricing?: string;
}

export interface BenchmarkResponse {
  type: BenchmarkType;
  labelEn: string;
  labelKo: string;
  descriptionEn: string;
  descriptionKo: string;
  icon: string;
}

export interface LLMRankingResponse {
  benchmark: BenchmarkResponse;
  models: LLMModelResponse[];
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  authProvider: 'github' | 'google';
  role: 'USER' | 'ADMIN';
  createdAt: string;
  lastLoginAt: string;
}

// Article APIs
export const getArticles = async (
  category?: string,
  page: number = 0,
  size: number = 9
): Promise<ArticlePageResponse> => {
  const params: Record<string, string | number> = { page, size };
  if (category && category !== 'ALL') {
    params.category = category;
  }

  const response = await apiClient.get<ArticlePageResponse>('/api/articles', { params });
  return response.data;
};

export const getGitHubTrending = async (limit: number = 10): Promise<Article[]> => {
  const response = await apiClient.get<Article[]>('/api/articles/github-trending', {
    params: { limit },
  });
  return response.data;
};

export const getTrendingTicker = async (limit: number = 20): Promise<TrendingTickerResponse[]> => {
  const response = await apiClient.get<TrendingTickerResponse[]>('/api/articles/trending-ticker', {
    params: { limit },
  });
  return response.data;
};

// LLM Ranking APIs
export const getLLMRankings = async (
  benchmark: BenchmarkType = 'AGENTIC_CODING',
  limit: number = 8
): Promise<LLMRankingResponse> => {
  const response = await apiClient.get<LLMRankingResponse>('/api/llm-rankings', {
    params: { benchmark, limit },
  });
  return response.data;
};

export const getAllBenchmarks = async (): Promise<BenchmarkResponse[]> => {
  const response = await apiClient.get<BenchmarkResponse[]>('/api/benchmarks');
  return response.data;
};

// Auth APIs
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/api/auth/me');
  return response.data;
};

export const initiateOAuthLogin = (provider: 'github' | 'google'): void => {
  window.location.href = `${API_BASE_URL}/oauth2/authorize/${provider}`;
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  window.location.href = '/';
};

export default apiClient;
