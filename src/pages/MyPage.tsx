import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getSavedArticles, getReadHistory, unsaveArticle } from '../services/api';
import type { SavedArticle, ReadHistory } from '../types';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'saved' | 'history';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [readHistory, setReadHistory] = useState<ReadHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    setIsInitialLoading(true);
    setCurrentPage(0);
    setSavedArticles([]);
    setReadHistory([]);
    setHasMore(true);

    try {
      if (activeTab === 'saved') {
        const data = await getSavedArticles(0, 20);
        setSavedArticles(data.content);
        setHasMore(data.hasMore);
      } else {
        const data = await getReadHistory(0, 20);
        setReadHistory(data.content);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      if (activeTab === 'saved') {
        const data = await getSavedArticles(nextPage, 20);
        setSavedArticles((prev) => [...prev, ...data.content]);
        setHasMore(data.hasMore);
      } else {
        const data = await getReadHistory(nextPage, 20);
        setReadHistory((prev) => [...prev, ...data.content]);
        setHasMore(data.hasMore);
      }
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, currentPage, activeTab]);

  useEffect(() => {
    if (isInitialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMore, isInitialLoading]);

  const handleUnsave = async (articleId: string) => {
    try {
      await unsaveArticle(articleId);
      setSavedArticles((prev) => prev.filter((article) => article.articleId !== articleId));
    } catch (error) {
      console.error('Failed to unsave article:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (hours < 1) return '방금 전';
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

  if (!isAuthenticated) {
    return null;
  }

  const currentData = activeTab === 'saved' ? savedArticles : readHistory;
  const emptyMessage = activeTab === 'saved'
    ? '저장한 아티클이 없습니다.'
    : '읽은 아티클이 없습니다.';

  return (
    <div className="min-h-screen bg-glow">
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Fixed */}
        <div className="fixed left-0 top-16 w-52 h-[calc(100vh-4rem)] z-40 hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="lg:ml-52 pt-8 pb-8 px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">마이페이지</h1>
              <p className="text-text-muted">
                {user?.name}님의 저장한 아티클과 읽은 기록을 확인하세요
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 border-b border-surface-border">
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === 'saved'
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                저장한 아티클
                {activeTab === 'saved' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === 'history'
                    ? 'text-accent'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                읽은 기록
                {activeTab === 'history' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            </div>

            {/* Content */}
            {isInitialLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-surface-border border-t-accent rounded-full animate-spin" />
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activeTab === 'saved' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <p className="text-text-muted">{emptyMessage}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentData.map((item) => (
                  <div
                    key={item.articleId}
                    className="bg-surface-card border border-surface-border rounded-xl p-6 hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Source badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-accent capitalize">
                            {item.source}
                          </span>
                          <span className="text-text-muted">·</span>
                          <span className="text-xs text-text-muted">
                            {formatTimeAgo('savedAt' in item ? item.savedAt : item.readAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <a
                          href={`/article/${item.articleId}`}
                          className="block mb-2"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/article/${item.articleId}`);
                          }}
                        >
                          <h3 className="text-lg font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-2">
                            {item.summaryKoTitle}
                          </h3>
                        </a>
                      </div>

                      {/* Actions */}
                      {activeTab === 'saved' && (
                        <button
                          onClick={() => handleUnsave(item.articleId)}
                          className="flex-shrink-0 p-2 text-text-muted hover:text-red-500 transition-colors"
                          title="저장 취소"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Infinite Scroll Trigger */}
                <div ref={observerTarget} className="h-10" />

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-6 h-6 border-2 border-surface-border border-t-accent rounded-full animate-spin" />
                  </div>
                )}

                {/* End Message */}
                {!hasMore && currentData.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-text-muted">모든 항목을 확인했습니다</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
