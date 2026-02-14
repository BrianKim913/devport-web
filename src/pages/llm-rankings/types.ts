import type { LLMLeaderboardEntryResponse, LLMMediaModelResponse, LLMMediaType } from '../../services/llm/llmService';

export type BenchmarkLeaderboardState = {
  entries: LLMLeaderboardEntryResponse[];
  loading: boolean;
  error: string | null;
};

export type MediaLeaderboardState = {
  items: LLMMediaModelResponse[];
  page: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

export type ProviderTickProps = {
  x?: number;
  y?: number;
  payload?: { value?: number | string };
  dataMap: Map<number, { logo: string; label: string }>;
};

export const createMediaState = (): MediaLeaderboardState => ({
  items: [],
  page: 0,
  totalElements: 0,
  totalPages: 0,
  last: false,
  loading: false,
  error: null,
  initialized: false,
});

export const createEmptyMediaLeaderboards = (): Record<LLMMediaType, MediaLeaderboardState> => ({
  'text-to-image': createMediaState(),
  'image-editing': createMediaState(),
  'text-to-speech': createMediaState(),
  'text-to-video': createMediaState(),
  'image-to-video': createMediaState(),
});

export const mediaTypeConfig: Record<LLMMediaType, { label: string; description: string; hasCategories: boolean }> = {
  'text-to-image': {
    label: '텍스트 → 이미지',
    description: '프롬프트 기반 이미지 생성 모델 성능을 비교합니다.',
    hasCategories: true,
  },
  'image-editing': {
    label: '이미지 편집',
    description: '이미지 편집 및 변환 모델 성능을 비교합니다.',
    hasCategories: false,
  },
  'text-to-speech': {
    label: '텍스트 → 음성',
    description: '텍스트 음성 변환(TTS) 모델 성능을 비교합니다.',
    hasCategories: false,
  },
  'text-to-video': {
    label: '텍스트 → 비디오',
    description: '프롬프트 기반 비디오 생성 모델 성능을 비교합니다.',
    hasCategories: true,
  },
  'image-to-video': {
    label: '이미지 → 비디오',
    description: '이미지 기반 비디오 생성 모델 성능을 비교합니다.',
    hasCategories: true,
  },
};

export const mediaFlowConfig: Record<
  LLMMediaType,
  {
    from: string;
    to: string;
    helper: string;
    accentClass: string;
    dotClass: string;
  }
> = {
  'text-to-image': {
    from: 'Text',
    to: 'Image',
    helper: '프롬프트 → 이미지',
    accentClass: 'from-sky-500/20 via-sky-500/10 to-transparent',
    dotClass: 'bg-sky-400',
  },
  'image-editing': {
    from: 'Image',
    to: 'Edit',
    helper: '이미지 → 편집',
    accentClass: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    dotClass: 'bg-emerald-400',
  },
  'text-to-speech': {
    from: 'Text',
    to: 'Voice',
    helper: '텍스트 → 음성',
    accentClass: 'from-purple-500/20 via-purple-500/10 to-transparent',
    dotClass: 'bg-purple-400',
  },
  'text-to-video': {
    from: 'Text',
    to: 'Video',
    helper: '텍스트 → 비디오',
    accentClass: 'from-amber-500/20 via-amber-500/10 to-transparent',
    dotClass: 'bg-amber-400',
  },
  'image-to-video': {
    from: 'Image',
    to: 'Video',
    helper: '이미지 → 비디오',
    accentClass: 'from-rose-500/20 via-rose-500/10 to-transparent',
    dotClass: 'bg-rose-400',
  },
};
