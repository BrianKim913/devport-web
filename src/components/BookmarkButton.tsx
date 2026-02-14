import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveArticle, unsaveArticle, isArticleSaved } from '../services/me/meService';
import { useNavigate } from 'react-router-dom';

interface BookmarkButtonProps {
  articleId: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function BookmarkButton({
  articleId,
  size = 'md',
  showLabel = false,
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkSavedStatus();
    }
  }, [articleId, isAuthenticated]);

  const checkSavedStatus = async () => {
    try {
      const saved = await isArticleSaved(articleId);
      setIsSaved(saved);
    } catch (error) {
      console.error('Failed to check saved status:', error);
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveArticle(articleId);
        setIsSaved(false);
      } else {
        await saveArticle(articleId);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${buttonSizeClasses[size]} ${
        isSaved ? 'text-accent' : 'text-text-muted hover:text-accent'
      } transition-colors disabled:opacity-50 flex items-center gap-2`}
      title={isSaved ? '저장 취소' : '저장'}
    >
      <svg
        className={sizeClasses[size]}
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isSaved ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? '저장됨' : '저장'}
        </span>
      )}
    </button>
  );
}
