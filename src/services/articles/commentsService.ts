import apiClient from '../../lib/http/apiClient';

// ─── Comment Types ───────────────────────────────────────────────

export interface CommentAuthorResponse {
  id: number;
  name: string;
  profileImageUrl?: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  deleted: boolean;
  parentId: string | null;
  author: CommentAuthorResponse;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}

export interface CommentCreateRequest {
  content: string;
  parentCommentId?: string;
}

export interface CommentUpdateRequest {
  content: string;
}

// ─── Comment APIs ────────────────────────────────────────────────

export const getCommentsByArticle = async (articleId: string): Promise<CommentResponse[]> => {
  const response = await apiClient.get<CommentResponse[]>(`/api/articles/${articleId}/comments`);
  return response.data;
};

export const createComment = async (
  articleId: string,
  data: CommentCreateRequest
): Promise<CommentResponse> => {
  const response = await apiClient.post<CommentResponse>(`/api/articles/${articleId}/comments`, data);
  return response.data;
};

export const updateComment = async (
  articleId: string,
  commentId: string,
  data: CommentUpdateRequest
): Promise<CommentResponse> => {
  const response = await apiClient.put<CommentResponse>(
    `/api/articles/${articleId}/comments/${commentId}`,
    data
  );
  return response.data;
};

export const deleteComment = async (articleId: string, commentId: string): Promise<void> => {
  await apiClient.delete(`/api/articles/${articleId}/comments/${commentId}`);
};
