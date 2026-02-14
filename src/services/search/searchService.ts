import apiClient from '../../lib/http/apiClient';
import type { ArticlePageResponse } from '../articles/articlesService';

// ─── Search Types ────────────────────────────────────────────────

export interface ArticleAutocompleteResponse {
  externalId: string;
  summaryKoTitle: string;
  source: string;
  category: string;
  matchType: 'TITLE' | 'BODY';
  score: number;
}

export interface ArticleAutocompleteListResponse {
  suggestions: ArticleAutocompleteResponse[];
  totalMatches: number;
}

// ─── Search APIs ─────────────────────────────────────────────────

export const searchAutocomplete = async (query: string): Promise<ArticleAutocompleteListResponse> => {
  if (!query || query.trim().length < 2) {
    return { suggestions: [], totalMatches: 0 };
  }
  const response = await apiClient.get<ArticleAutocompleteListResponse>('/api/articles/autocomplete', {
    params: { q: query.trim() },
  });
  return response.data;
};

export const searchFulltext = async (
  query: string,
  page: number = 0,
  size: number = 20
): Promise<ArticlePageResponse> => {
  const response = await apiClient.get<ArticlePageResponse>('/api/articles/search/fulltext', {
    params: { q: query.trim(), page, size },
  });
  return response.data;
};
