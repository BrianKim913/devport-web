import apiClient from '../../lib/http/apiClient';

// ─── My Page Types ───────────────────────────────────────────────

export interface SavedArticleResponse {
  articleId: string;
  summaryKoTitle: string;
  source: string;
  category: string;
  url: string;
  savedAt: string;
}

export interface ReadHistoryResponse {
  articleId: string;
  summaryKoTitle: string;
  source: string;
  category: string;
  url: string;
  readAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

// ─── My Page APIs ────────────────────────────────────────────────

export const getSavedArticles = async (
  page: number = 0,
  size: number = 20
): Promise<PageResponse<SavedArticleResponse>> => {
  const response = await apiClient.get<PageResponse<SavedArticleResponse>>('/api/me/saved-articles', {
    params: { page, size },
  });
  return response.data;
};

export const saveArticle = async (articleId: string): Promise<void> => {
  await apiClient.post(`/api/me/saved-articles/${articleId}`);
};

export const unsaveArticle = async (articleId: string): Promise<void> => {
  await apiClient.delete(`/api/me/saved-articles/${articleId}`);
};

export const isArticleSaved = async (articleId: string): Promise<boolean> => {
  const response = await apiClient.get<{ saved: boolean }>(
    `/api/me/saved-articles/${articleId}/status`
  );
  return response.data.saved;
};

export const getReadHistory = async (
  page: number = 0,
  size: number = 20
): Promise<PageResponse<ReadHistoryResponse>> => {
  const response = await apiClient.get<PageResponse<ReadHistoryResponse>>('/api/me/read-history', {
    params: { page, size },
  });
  return response.data;
};
