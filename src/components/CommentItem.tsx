import { useState } from 'react';
import type { CommentTreeNode } from '../types';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: CommentTreeNode;
  articleId: string;
  onReply: (parentId: string, content: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  depth?: number;
  maxDepth?: number;
}

export default function CommentItem({
  comment,
  articleId,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  maxDepth = 5,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}일 전`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}주 전`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}개월 전`;
    const years = Math.floor(days / 365);
    return `${years}년 전`;
  };

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleEditSubmit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      await onDelete(comment.id);
    }
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const canNestMore = depth < maxDepth;

  return (
    <div>
      <div className="flex gap-3 group">
        {/* YouTube-style thread line for nested replies */}
        {depth > 0 && (
          <div className="w-10 flex-shrink-0 flex justify-center">
            <div className="w-0.5 h-full bg-surface-border/40"></div>
          </div>
        )}

        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.profileImageUrl ? (
            <img
              src={comment.author.profileImageUrl}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-text-muted">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface-elevated rounded-lg p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-medium text-text-primary">{comment.author.name}</span>
              <span className="text-text-muted text-sm">·</span>
              <span className="text-text-muted text-sm">{formatTimeAgo(comment.createdAt)}</span>
              {comment.updatedAt !== comment.createdAt && (
                <>
                  <span className="text-text-muted text-sm">·</span>
                  <span className="text-text-muted text-sm">수정됨</span>
                </>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <CommentForm
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditing(false)}
                initialValue={comment.content}
                placeholder="댓글을 수정하세요..."
                submitLabel="수정"
                autoFocus
              />
            ) : (
              <p className={`text-text-primary whitespace-pre-wrap ${comment.deleted ? 'italic text-text-muted' : ''}`}>
                {comment.content}
              </p>
            )}
          </div>

          {/* Actions */}
          {!comment.deleted && (
            <div className="flex items-center gap-4 mt-2 text-sm">
              {canNestMore && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-text-muted hover:text-accent transition-colors"
                >
                  답글
                </button>
              )}
              {comment.isOwner && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-text-muted hover:text-red-500 transition-colors"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-4">
              <CommentForm
                onSubmit={handleReplySubmit}
                onCancel={() => setIsReplying(false)}
                placeholder="답글을 입력하세요..."
                submitLabel="답글 작성"
                autoFocus
              />
            </div>
          )}

          {/* Replies */}
          {hasReplies && (
            <div className="mt-4 space-y-4">
              {/* Toggle replies button */}
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showReplies ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showReplies ? '답글 숨기기' : `답글 ${comment.replies.length}개 보기`}
              </button>

              {/* Nested replies */}
              {showReplies && (
                <div className="space-y-4">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      articleId={articleId}
                      onReply={onReply}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      depth={depth + 1}
                      maxDepth={maxDepth}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
