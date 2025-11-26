import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import TrendingTicker from '../components/TrendingTicker';
import GitHubLeaderboard from '../components/GitHubLeaderboard';
import LLMLeaderboard from '../components/LLMLeaderboard';
import ArticleCard from '../components/ArticleCard';
import ArticleIcon from '../components/icons/ArticleIcon';
import { getArticles, getGitHubTrending, getTrendingTicker } from '../services/api';
import type { Article, Category } from '../types';
import { icons } from '../types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [articles, setArticles] = useState<Article[]>([]);
  const [githubRepos, setGithubRepos] = useState<Article[]>([]);
  const [tickerArticles, setTickerArticles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [articlesData, githubData, tickerData] = await Promise.all([
          getArticles(selectedCategory === 'ALL' ? undefined : selectedCategory, 0, 9),
          getGitHubTrending(10),
          getTrendingTicker(20),
        ]);

        setArticles(articlesData.content);
        setHasMore(articlesData.hasMore);
        setCurrentPage(0);
        setGithubRepos(githubData);
        setTickerArticles(tickerData);
        setIsInitialLoading(false);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedCategory]);

  // Fetch more articles for infinite scroll
  const fetchMoreArticles = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const data = await getArticles(
        selectedCategory === 'ALL' ? undefined : selectedCategory,
        nextPage,
        9
      );

      setArticles((prev) => [...prev, ...data.content]);
      setHasMore(data.hasMore);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to fetch more articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMoreArticles();
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
  }, [hasMore, isLoading, currentPage, selectedCategory]);

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
        <GitHubLeaderboard repos={githubRepos} />

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

          {/* End Message */}
          {!hasMore && articles.length > 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">모든 트렌드를 확인했습니다 ({articles.length}개)</p>
            </div>
          )}

          {/* Empty State */}
          {articles.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">해당 카테고리의 트렌드가 없습니다.</p>
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
