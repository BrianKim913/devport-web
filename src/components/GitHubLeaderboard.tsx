import { useRef, useEffect } from 'react';
import type { GitRepo } from '../types';
import GitHubIcon from './icons/GitHubIcon';
import StarIcon from './icons/StarIcon';

interface GitHubLeaderboardProps {
  repos: GitRepo[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

// GitHub language colors mapping
const languageColors: Record<string, { bg: string; text: string; border: string }> = {
  JavaScript: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  TypeScript: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Python: { bg: 'bg-blue-400/20', text: 'text-blue-300', border: 'border-blue-400/30' },
  Java: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600/30' },
  Go: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  Rust: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Ruby: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  PHP: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'C++': { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  C: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  'C#': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Swift: { bg: 'bg-orange-400/20', text: 'text-orange-300', border: 'border-orange-400/30' },
  Kotlin: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-600/30' },
  Dart: { bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-600/30' },
  Shell: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  HTML: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600/30' },
  CSS: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Vue: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Svelte: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Scala: { bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600/30' },
  Elixir: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Clojure: { bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-600/30' },
  Haskell: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-600/30' },
  Lua: { bg: 'bg-blue-700/20', text: 'text-blue-400', border: 'border-blue-700/30' },
  Perl: { bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-600/30' },
  R: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Matlab: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600/30' },
  Julia: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-600/30' },
  Nim: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  Zig: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  // Default fallback
  default: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

const getLanguageColor = (language: string) => {
  return languageColors[language] || languageColors.default;
};

export default function GitHubLeaderboard({ repos, onLoadMore, hasMore, isLoading }: GitHubLeaderboardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, root: scrollContainerRef.current }
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
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <section className="mb-8">
      <div className="bg-[#1a1d29] rounded-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1f2233] to-[#1a1d29] border-b border-gray-700">
          <div className="flex items-center gap-3">
            <GitHubIcon className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-extrabold text-white">트렌딩 리포지토리</h2>
          </div>
        </div>

        {/* Leaderboard List - Scrollable with infinite scroll */}
        <div
          ref={scrollContainerRef}
          className="divide-y divide-gray-700 max-h-[400px] overflow-y-auto dark-scrollbar"
        >
          {repos.map((repo, index) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-6 py-4 hover:bg-[#20233a] transition-colors group"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 flex items-center justify-center font-bold text-lg text-gray-400">
                {index + 1}
              </div>

              {/* Repo Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                  {repo.summaryKoTitle}
                </h3>
                <p className="text-sm text-gray-400 truncate mt-0.5">
                  {repo.fullName}
                </p>
              </div>

              {/* Language Badge (Programming Language) */}
              {repo.language && (
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                  <span className={`px-3 py-1 ${getLanguageColor(repo.language).bg} ${getLanguageColor(repo.language).text} text-xs font-semibold rounded border ${getLanguageColor(repo.language).border}`}>
                    {repo.language}
                  </span>
                </div>
              )}

              {/* Stars This Week */}
              {repo.starsThisWeek > 0 && (
                <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded border border-yellow-500/30 flex items-center gap-1.5">
                    <span>+{repo.starsThisWeek.toLocaleString()}</span>
                    <span className="text-yellow-300/80">이번 주</span>
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">{repo.stars.toLocaleString()}</span>
                </span>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}

          {/* Infinite Scroll Trigger */}
          <div ref={observerTarget} className="h-4"></div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="flex items-center gap-2 text-purple-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                <span className="text-sm font-medium">로딩 중...</span>
              </div>
            </div>
          )}


        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-[#1a1d29] border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            GitHub에서 가장 인기있는 저장소를 실시간으로 추적합니다
          </p>
        </div>
      </div>
    </section>
  );
}
