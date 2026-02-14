import apiClient from '../../lib/http/apiClient';
import type { BenchmarkType } from '../../types';

// ─── LLM Types ───────────────────────────────────────────────────

export interface LLMModelSummaryResponse {
  id: number;
  modelId: string;
  slug: string;
  modelName: string;
  provider: string;
  modelCreatorName?: string;
  license?: string;
  priceBlended?: number;
  contextWindow?: number;
  scoreAaIntelligenceIndex?: number;
}

export interface LLMModelDetailResponse {
  id: number;
  externalId?: string;
  slug: string;
  modelId: string;
  modelName: string;
  releaseDate?: string;
  provider: string;
  modelCreatorId?: number;
  modelCreatorName?: string;
  description?: string;
  priceInput?: number;
  priceOutput?: number;
  priceBlended?: number;
  contextWindow?: number;
  outputSpeedMedian?: number;
  latencyTtft?: number;
  medianTimeToFirstAnswerToken?: number;
  license?: string;
  scoreTerminalBenchHard?: number;
  scoreTauBenchTelecom?: number;
  scoreAaLcr?: number;
  scoreHumanitysLastExam?: number;
  scoreMmluPro?: number;
  scoreGpqaDiamond?: number;
  scoreLivecodeBench?: number;
  scoreScicode?: number;
  scoreIfbench?: number;
  scoreMath500?: number;
  scoreAime?: number;
  scoreAime2025?: number;
  scoreAaIntelligenceIndex?: number;
  scoreAaCodingIndex?: number;
  scoreAaMathIndex?: number;
}

export interface LLMLeaderboardEntryResponse {
  rank: number;
  modelId: string;
  modelName: string;
  provider: string;
  modelCreatorName?: string;
  score: number;
  license?: string;
  priceBlended?: number;
  contextWindow?: number;
}

export interface LLMBenchmarkResponse {
  benchmarkType: string;
  displayName: string;
  categoryGroup: string;
  description: string;
  explanation?: string;
  sortOrder?: number;
}

export interface MediaModelCreatorResponse {
  id: number;
  externalId?: string;
  slug?: string;
  name: string;
}

export interface MediaModelCategoryResponse {
  styleCategory?: string;
  subjectMatterCategory?: string;
  formatCategory?: string;
  elo: number;
  ci95?: number;
  appearances?: number;
}

export interface LLMMediaModelResponse {
  id: number;
  externalId: string;
  slug: string;
  name: string;
  modelCreator: MediaModelCreatorResponse;
  elo: number;
  rank: number;
  ci95?: number;
  appearances?: number;
  releaseDate?: string;
  categories?: MediaModelCategoryResponse[];
}

export type LLMMediaType =
  | 'text-to-image'
  | 'image-editing'
  | 'text-to-speech'
  | 'text-to-video'
  | 'image-to-video';

export interface SpringPageResponse<T> {
  content: T[];
  pageable: unknown;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  empty: boolean;
}

// ─── LLM APIs ────────────────────────────────────────────────────

export const getLLMLeaderboard = async (
  benchmarkType: BenchmarkType,
  filters?: {
    provider?: string;
    creatorSlug?: string;
    license?: string;
    maxPrice?: number;
    minContextWindow?: number;
  }
): Promise<LLMLeaderboardEntryResponse[]> => {
  const response = await apiClient.get<LLMLeaderboardEntryResponse[]>(
    `/api/llm/leaderboard/${benchmarkType}`,
    { params: filters }
  );
  return response.data;
};

export const getAllLLMBenchmarks = async (): Promise<LLMBenchmarkResponse[]> => {
  const response = await apiClient.get<LLMBenchmarkResponse[]>('/api/llm/benchmarks');
  return response.data;
};

export const getLLMBenchmarksByGroup = async (categoryGroup: string): Promise<LLMBenchmarkResponse[]> => {
  const response = await apiClient.get<LLMBenchmarkResponse[]>(`/api/llm/benchmarks/${categoryGroup}`);
  return response.data;
};

export const getLLMModelById = async (modelId: string): Promise<LLMModelDetailResponse> => {
  const response = await apiClient.get<LLMModelDetailResponse>(`/api/llm/models/${modelId}`);
  return response.data;
};

export const getLLMMediaLeaderboard = async (
  mediaType: LLMMediaType,
  page: number = 0,
  size: number = 20,
  sort: string = 'rank,asc'
): Promise<SpringPageResponse<LLMMediaModelResponse>> => {
  const response = await apiClient.get<SpringPageResponse<LLMMediaModelResponse>>(
    `/api/llm/media/${mediaType}`,
    { params: { page, size, sort } }
  );
  return response.data;
};
