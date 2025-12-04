import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TrendingTicker from '../components/TrendingTicker';
import GitHubLeaderboard from '../components/GitHubLeaderboard';
import LLMLeaderboard from '../components/LLMLeaderboard';
import ArticleCard from '../components/ArticleCard';
import ArticleIcon from '../components/icons/ArticleIcon';
import { getArticles, getTrendingGitReposPaginated, getTrendingTicker } from '../services/api';
import type { Article, GitRepo, Category } from '../types';
import { icons } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [articles, setArticles] = useState<Article[]>([]);
  const [githubRepos, setGithubRepos] = useState<GitRepo[]>([]);
  const [tickerArticles, setTickerArticles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // GitHub repos pagination state
  const [reposPage, setReposPage] = useState(0);
  const [reposHasMore, setReposHasMore] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);

  // Article viewing limits for anonymous users
  const [loadCount, setLoadCount] = useState(0); // Tracks how many times user loaded more articles
  const MAX_ANONYMOUS_LOADS = 3; // Initial load (9) + 3 more loads (3 each) = 18 articles max

  // Fetch initial data
      useEffect(() => {
        const fetchInitialData = async () => {
          setIsLoading(true);
          setReposLoading(true);
          try {
            // For anonymous users on non-ALL categories, show empty and require login
            if (!isAuthenticated && selectedCategory !== 'ALL') {
              setArticles([]);
              setHasMore(true); // Set to true so login prompt shows
              setCurrentPage(0);
              setLoadCount(MAX_ANONYMOUS_LOADS); // Set to max to trigger login prompt
              setIsInitialLoading(false);
              setIsLoading(false);
              setReposLoading(false);

              // Still fetch github and ticker for other sections
              const [githubData, tickerData] = await Promise.all([
                getTrendingGitReposPaginated(0, 10),
                getTrendingTicker(),
              ]);
              setGithubRepos(githubData.content);
              setReposHasMore(githubData.hasMore);
              setReposPage(0);
              setTickerArticles(tickerData);
              return;
            }

            const [articlesData, githubData, tickerData] = await Promise.all([
              getArticles(selectedCategory === 'ALL' ? undefined : selectedCategory, 0, 9),
              getTrendingGitReposPaginated(0, 10),
              getTrendingTicker(),
            ]);

            setArticles(articlesData.content);
            setHasMore(articlesData.hasMore);
            setCurrentPage(0);
            setLoadCount(0); // Reset load count when category changes
            setGithubRepos(githubData.content);
            setReposHasMore(githubData.hasMore);
            setReposPage(0);
            setTickerArticles(tickerData);
            setIsInitialLoading(false);
          } catch (error) {
            console.error('Failed to fetch initial data:', error);
          } finally {
            setIsLoading(false);
            setReposLoading(false);
          }
        };

        fetchInitialData();
      }, [selectedCategory, isAuthenticated]);

  // Fetch more articles for infinite scroll
  const fetchMoreArticles = useCallback(async () => {
    console.log('🎯 fetchMoreArticles called - isLoading:', isLoading, 'hasMore:', hasMore, 'loadCount:', loadCount);

    if (isLoading || !hasMore) {
      console.log('⏸️ Skipping fetch - isLoading:', isLoading, 'hasMore:', hasMore);
      return;
    }

    // Check if anonymous user has reached the limit
    if (!isAuthenticated && loadCount >= MAX_ANONYMOUS_LOADS) {
      console.log('🔒 Anonymous user reached limit');
      return; // Stop loading more articles
    }

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;

      // For anonymous users after initial load, only fetch 3 articles per scroll
      const pageSize = !isAuthenticated && loadCount > 0 ? 3 : 9;

      console.log('📥 Fetching page', nextPage, 'with size', pageSize);

      const data = await getArticles(
        selectedCategory === 'ALL' ? undefined : selectedCategory,
        nextPage,
        pageSize
      );

      console.log('✅ Loaded', data.content?.length, 'more articles');

      setArticles((prev) => [...prev, ...data.content]);
      setHasMore(data.hasMore);
      setCurrentPage(nextPage);
      setLoadCount((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to fetch more articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, isAuthenticated, loadCount, currentPage, selectedCategory]);

  // Fetch more GitHub repos for infinite scroll
  const fetchMoreGitRepos = async () => {
    if (reposLoading || !reposHasMore) return;

    try {
      setReposLoading(true);
      const nextPage = reposPage + 1;
      const data = await getTrendingGitReposPaginated(nextPage, 10);

      console.log('🐙 Loading more trending repos - page', nextPage, ':', data.content?.length || 0, 'items');

      setGithubRepos((prev) => [...prev, ...data.content]);
      setReposHasMore(data.hasMore);
      setReposPage(nextPage);
    } catch (error) {
      console.error('Failed to fetch more GitHub repos:', error);
    } finally {
      setReposLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    // Wait for initial loading to complete before setting up observer
    if (isInitialLoading) {
      console.log('⏳ Waiting for initial load to complete...');
      return;
    }

    console.log('👁️ Setting up observer - hasMore:', hasMore, 'isLoading:', isLoading);

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('🔍 Observer triggered - isIntersecting:', entries[0].isIntersecting, 'hasMore:', hasMore, 'isLoading:', isLoading);
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          console.log('✨ Calling fetchMoreArticles from observer');
          fetchMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      console.log('📍 Observer target found, observing...');
      observer.observe(currentTarget);
    } else {
      console.log('⚠️ Observer target NOT found');
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, fetchMoreArticles, isInitialLoading]);

  const categories = [
    { id: 'ALL' as const, label: '전체' },
    { id: 'AI_LLM' as const, label: 'AI/LLM' },
    { id: 'DEVOPS_SRE' as const, label: 'DevOps/SRE' },
    { id: 'INFRA_CLOUD' as const, label: 'Infra/Cloud' },
    { id: 'DATABASE' as const, label: 'Database' },
    { id: 'BLOCKCHAIN' as const, label: 'Blockchain' },
    { id: 'SECURITY' as const, label: 'Security' },
    { id: 'DATA_SCIENCE' as const, label: 'Data Science' },
    { id: 'ARCHITECTURE' as const, label: 'Architecture' },
    { id: 'MOBILE' as const, label: 'Mobile' },
    { id: 'FRONTEND' as const, label: 'Frontend' },
    { id: 'BACKEND' as const, label: 'Backend' },
    { id: 'OTHER' as const, label: '기타' },
  ];

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <span className="text-xl font-medium">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Trending News Ticker */}
        <TrendingTicker articles={tickerArticles} />

        {/* GitHub Trending Leaderboard */}
        <GitHubLeaderboard
          repos={githubRepos}
          onLoadMore={fetchMoreGitRepos}
          hasMore={reposHasMore}
          isLoading={reposLoading}
        />

        {/* LLM Leaderboard */}
        <LLMLeaderboard />

        {/* Articles with Category Tabs */}
        <section>
          <div className="bg-[#1a1d29] rounded-2xl p-6 mb-6 border border-gray-700">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 mb-4">
              <ArticleIcon className="w-7 h-7 text-blue-400" />
              트렌딩 블로그
            </h2>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedCategory(category.id);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="h-10"></div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center gap-3 text-blue-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="text-lg font-medium">더 많은 트렌드 로딩 중...</span>
              </div>
            </div>
          )}

          {/* Login Prompt for Anonymous Users - Design Option */}
          {!isAuthenticated && loadCount >= MAX_ANONYMOUS_LOADS && hasMore && (
            <div className="relative py-8 mt-12">
              {/* Blurred Preview Cards in Background */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 relative">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[#1a1d29] rounded-xl p-7 border border-gray-700 opacity-40 blur-sm pointer-events-none h-64"
                  >
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>

              {/* Centered Login Card Overlay */}
              <div className="absolute inset-0 flex items-center justify-center px-4 pt-8">
                <div className="bg-[#0f1117]/95 backdrop-blur-xl rounded-2xl p-8 md:p-12 border-2 border-blue-500/30 shadow-2xl max-w-lg w-full">
                  <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      더 많은 트렌드를 확인하세요
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 text-base">
                      로그인하시면 <span className="text-blue-400 font-semibold">무제한</span>으로<br />
                      모든 개발 트렌드와 기술 블로그를 한 눈에 확인 수 있습니다
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 mb-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>10,000+ 개발자</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        <span>매일 업데이트</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      무료로 시작하기 →
                    </button>

                    {/* Progress Indicator */}
                    <p className="text-xs text-gray-500 mt-4">
                      {articles.length}개의 글을 확인하셨습니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* End Message */}
          {!hasMore && articles.length > 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">모든 트렌드를 확인했습니다 ({articles.length}개)</p>
            </div>
          )}

          {/* Empty State */}
          {articles.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg"></p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold">devport.kr</p>
              <p className="text-sm text-gray-300 mt-1">개발자를 위한 글로벌 트렌드 포털</p>
            </div>

            <div className="flex gap-6 text-sm">
              <a href="#" className="text-primary-light hover:text-white transition-colors">
                About DevPort
              </a>
              <a href="#" className="text-primary-light hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-primary-light hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-primary-light hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            © 2025 devport.kr - All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
