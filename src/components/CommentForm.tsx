import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = '댓글을 입력하세요...',
  submitLabel = '댓글 작성',
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-surface-elevated rounded-lg p-6 text-center">
        <p className="text-text-muted mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
        >
          로그인
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start gap-3">
        {user.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[100px] px-4 py-3 bg-surface-elevated border border-surface-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
          autoFocus={autoFocus}
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '작성 중...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
