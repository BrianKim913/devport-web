import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TrendingTicker from '../components/TrendingTicker';
import type { BenchmarkCategoryGroup } from '../types';
import { benchmarkCategoryConfig } from '../types';
import { getAllLLMBenchmarks, getTrendingTicker, type LLMBenchmarkResponse } from '../services/api';

export default function BenchmarksExplanationPage() {
  const [selectedGroup, setSelectedGroup] = useState<BenchmarkCategoryGroup>('Composite');
  const [benchmarks, setBenchmarks] = useState<LLMBenchmarkResponse[]>([]);
  const [tickerArticles, setTickerArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [benchmarkData, tickerData] = await Promise.all([
          getAllLLMBenchmarks(),
          getTrendingTicker(),
        ]);
        setBenchmarks(benchmarkData);
        setTickerArticles(tickerData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedBenchmarks = benchmarks.reduce((acc, benchmark) => {
    const group = benchmark.categoryGroup as BenchmarkCategoryGroup;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(benchmark);
    return acc;
  }, {} as Record<BenchmarkCategoryGroup, LLMBenchmarkResponse[]>);

  const displayBenchmarks = groupedBenchmarks[selectedGroup] || [];

  return (
    <div className="min-h-screen bg-glow">
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Fixed */}
        <div className="fixed left-0 top-16 w-52 h-[calc(100vh-4rem)] z-40 hidden lg:block">
          <Sidebar />
        </div>

        {/* Trending Ticker - with left margin to avoid left sidebar */}
        <div className="lg:ml-52 border-b border-surface-border/50">
          <TrendingTicker articles={tickerArticles} />
        </div>

        {/* Main Content */}
        <main className="lg:ml-52 pt-8 pb-8 px-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-6 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                홈으로
              </Link>

              <h1 className="text-3xl font-semibold text-text-primary mb-3">LLM 벤치마크</h1>
              <p className="text-text-secondary">
                각 벤치마크가 무엇을 측정하는지 알아보세요
              </p>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-surface-border border-t-accent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(benchmarkCategoryConfig) as BenchmarkCategoryGroup[]).map((group) => {
                    const config = benchmarkCategoryConfig[group];
                    const benchmarkCount = groupedBenchmarks[group]?.length || 0;

                    return (
                      <button
                        key={group}
                        onClick={() => setSelectedGroup(group)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedGroup === group
                            ? 'bg-accent text-white'
                            : 'bg-surface-card text-text-muted hover:text-text-secondary border border-surface-border'
                        }`}
                      >
                        {config.labelKo}
                        <span className="ml-1.5 opacity-60">({benchmarkCount})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Benchmark List */}
                <div className="space-y-4">
                  {displayBenchmarks.length === 0 ? (
                    <div className="bg-surface-card rounded-2xl border border-surface-border p-12 text-center">
                      <p className="text-text-muted">이 카테고리에는 벤치마크가 없습니다</p>
                    </div>
                  ) : (
                    displayBenchmarks.map((benchmark) => (
                      <div
                        key={benchmark.benchmarkType}
                        className="bg-surface-card rounded-2xl border border-surface-border p-6 hover:border-surface-border/80 transition-colors"
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <span className="text-2xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                            {benchmark.benchmarkType}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-lg font-medium text-text-primary mb-2">
                          {benchmark.displayName}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-text-secondary leading-relaxed mb-4">
                          {benchmark.description}
                        </p>

                        {/* Explanation */}
                        {benchmark.explanation && (
                          <div className="bg-surface-elevated/50 rounded-xl p-4 border border-surface-border">
                            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                              {benchmark.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Attribution */}
            <div className="mt-16 pt-8 border-t border-surface-border text-center">
              <p className="text-xs text-text-muted">
                Data provided by{' '}
                <a
                  href="https://artificialanalysis.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Artificial Analysis
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="lg:ml-52 border-t border-surface-border mt-20">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-0.5 mb-2">
                <span className="text-lg font-semibold text-text-primary">devport</span>
                <span className="text-accent text-lg font-semibold">.</span>
              </div>
              <p className="text-sm text-text-muted">개발자를 위한 글로벌 트렌드 포털</p>
            </div>

            {/* Links */}
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-text-muted hover:text-text-secondary transition-colors">About</a>
              <a href="#" className="text-text-muted hover:text-text-secondary transition-colors">Privacy</a>
              <a href="#" className="text-text-muted hover:text-text-secondary transition-colors">Terms</a>
              <a href="#" className="text-text-muted hover:text-text-secondary transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-surface-border">
            <p className="text-xs text-text-muted text-center">
              © 2025 devport.kr
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
