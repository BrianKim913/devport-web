import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import type { Article } from '../types';
import {
  adminCreateArticle,
  adminUpdateArticle,
  adminDeleteArticle,
  adminProcessArticleWithLLM,
  adminPreviewArticleLLM,
  adminListArticles,
  adminCreateGitRepo,
  adminCreateLLMModel,
  adminCreateModelCreator,
  adminCreateBenchmark,
  type CreateArticleRequest,
  type ArticleLLMCreateRequest,
  type ArticleLLMPreviewResponse,
  type CreateGitRepoRequest,
  type CreateLLMModelRequest,
  type CreateModelCreatorRequest,
  type CreateLLMBenchmarkRequest,
} from '../services/admin/adminService';
import type { ArticlePageResponse } from '../services/articles/articlesService';

type TabType = 'article' | 'gitrepo' | 'llmmodel' | 'modelcreator' | 'benchmark';
type ArticleSubView = 'list' | 'llm-process' | 'manual-create';

const CATEGORIES = ['AI_LLM', 'DEVOPS_SRE', 'INFRA_CLOUD', 'DATABASE', 'BLOCKCHAIN', 'SECURITY', 'DATA_SCIENCE', 'ARCHITECTURE', 'MOBILE', 'FRONTEND', 'BACKEND', 'OTHER'];
const SOURCES = ['hackernews', 'reddit', 'medium', 'devto', 'hashnode', 'github'];

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('article');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Article sub-view state
  const [articleSubView, setArticleSubView] = useState<ArticleSubView>('list');

  // Article list state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlePage, setArticlePage] = useState(0);
  const [articleTotalPages, setArticleTotalPages] = useState(0);
  const [articleTotalElements, setArticleTotalElements] = useState(0);
  const [articleSearch, setArticleSearch] = useState('');
  const [articleSearchInput, setArticleSearchInput] = useState('');
  const [articlesLoading, setArticlesLoading] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  // Edit modal state
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateArticleRequest>>({});
  const [editTagsInput, setEditTagsInput] = useState('');

  // LLM process state
  const [llmForm, setLlmForm] = useState<ArticleLLMCreateRequest>({
    titleEn: '',
    url: '',
    content: '',
    source: 'hackernews',
    itemType: 'BLOG',
    tags: [],
  });
  const [llmScoreOverride, setLlmScoreOverride] = useState<number | undefined>(undefined);
  const [llmCommentsOverride, setLlmCommentsOverride] = useState<number | undefined>(undefined);
  const [llmUpvotesOverride, setLlmUpvotesOverride] = useState<number | undefined>(undefined);
  const [llmTagsInput, setLlmTagsInput] = useState('');
  const [llmPreview, setLlmPreview] = useState<ArticleLLMPreviewResponse | null>(null);
  const [llmLoading, setLlmLoading] = useState(false);

  // Manual create state
  const [tagsInput, setTagsInput] = useState('');
  const [articleForm, setArticleForm] = useState<CreateArticleRequest>({
    itemType: 'BLOG',
    source: '',
    category: 'AI_LLM',
    summaryKoTitle: '',
    summaryKoBody: '',
    titleEn: '',
    url: '',
    score: 0,
    tags: [],
    createdAtSource: new Date().toISOString().slice(0, 16),
    metadata: { stars: undefined, comments: undefined, upvotes: undefined, readTime: undefined, language: undefined },
  });

  // Other tab forms
  const [gitRepoForm, setGitRepoForm] = useState<CreateGitRepoRequest>({
    fullName: '', url: '', description: '', language: '', stars: 0, forks: 0,
    starsThisWeek: 0, summaryKoTitle: '', summaryKoBody: '', category: 'AI_LLM', score: 0,
  });
  const [llmModelForm, setLLMModelForm] = useState<CreateLLMModelRequest>({
    modelId: '', modelName: '', slug: '', provider: '', description: '',
    priceInput: undefined, priceOutput: undefined, priceBlended: undefined, contextWindow: undefined,
  });
  const [modelCreatorForm, setModelCreatorForm] = useState<CreateModelCreatorRequest>({ slug: '', name: '' });
  const [benchmarkForm, setBenchmarkForm] = useState<CreateLLMBenchmarkRequest>({
    benchmarkType: '', displayName: '', categoryGroup: 'Composite', description: '', explanation: '', sortOrder: 0,
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Fetch articles list
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const response: ArticlePageResponse = await adminListArticles(articlePage, 15, articleSearch || undefined);
      setArticles(response.content);
      setArticleTotalPages(response.totalPages);
      setArticleTotalElements(response.totalElements);
    } catch (error: any) {
      showMessage('error', `Failed to load articles: ${error.response?.data?.message || error.message}`);
    } finally {
      setArticlesLoading(false);
    }
  }, [articlePage, articleSearch]);

  useEffect(() => {
    if (activeTab === 'article' && articleSubView === 'list') {
      fetchArticles();
    }
  }, [activeTab, articleSubView, fetchArticles]);

  // Article search
  const handleArticleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setArticlePage(0);
    setArticleSearch(articleSearchInput);
  };

  // Delete article
  const handleDeleteArticle = async () => {
    if (!deleteConfirm) return;
    try {
      await adminDeleteArticle(deleteConfirm.id);
      showMessage('success', 'Article deleted');
      setDeleteConfirm(null);
      fetchArticles();
    } catch (error: any) {
      showMessage('error', `Delete failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Edit article
  const openEditModal = (article: Article) => {
    setEditArticle(article);
    setEditForm({
      itemType: article.itemType as any,
      source: article.source,
      category: article.category,
      summaryKoTitle: article.summaryKoTitle,
      summaryKoBody: article.summaryKoBody || '',
      titleEn: article.titleEn,
      url: article.url,
      score: article.score,
      createdAtSource: article.createdAtSource,
      metadata: {
        stars: article.metadata?.stars,
        comments: article.metadata?.comments,
        upvotes: article.metadata?.upvotes,
        readTime: article.metadata?.readTime,
        language: article.metadata?.language,
      },
    });
    setEditTagsInput(article.tags?.join(', ') || '');
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editArticle) return;
    try {
      const tags = editTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await adminUpdateArticle(String(editArticle.id), { ...editForm, tags });
      showMessage('success', 'Article updated');
      setEditArticle(null);
      fetchArticles();
    } catch (error: any) {
      showMessage('error', `Update failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // LLM Process
  const handleLLMPreview = async () => {
    setLlmLoading(true);
    setLlmPreview(null);
    try {
      const tags = llmTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const result = await adminPreviewArticleLLM({ ...llmForm, tags: tags.length > 0 ? tags : undefined });
      setLlmPreview(result);
    } catch (error: any) {
      showMessage('error', `Preview failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLlmLoading(false);
    }
  };

  const handleLLMProcess = async () => {
    setLlmLoading(true);
    try {
      const tags = llmTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const createdArticle = await adminProcessArticleWithLLM({ ...llmForm, tags: tags.length > 0 ? tags : undefined });

      const updatePayload: Partial<CreateArticleRequest> = {};
      if (llmScoreOverride !== undefined) {
        updatePayload.score = llmScoreOverride;
      }
      const metadataUpdate: NonNullable<CreateArticleRequest['metadata']> = {};
      if (llmCommentsOverride !== undefined) {
        metadataUpdate.comments = llmCommentsOverride;
      }
      if (llmUpvotesOverride !== undefined) {
        metadataUpdate.upvotes = llmUpvotesOverride;
      }
      if (Object.keys(metadataUpdate).length > 0) {
        updatePayload.metadata = metadataUpdate;
      }
      if (Object.keys(updatePayload).length > 0) {
        await adminUpdateArticle(String(createdArticle.id), updatePayload);
      }

      showMessage('success', 'Article processed and saved via LLM');
      setLlmForm({ titleEn: '', url: '', content: '', source: 'hackernews', itemType: 'BLOG', tags: [] });
      setLlmScoreOverride(undefined);
      setLlmCommentsOverride(undefined);
      setLlmUpvotesOverride(undefined);
      setLlmTagsInput('');
      setLlmPreview(null);
      setArticleSubView('list');
    } catch (error: any) {
      showMessage('error', `LLM processing failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLlmLoading(false);
    }
  };

  // Manual create
  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      await adminCreateArticle({ ...articleForm, tags: tags.length > 0 ? tags : undefined });
      showMessage('success', 'Article created successfully');
      setTagsInput('');
      setArticleForm({
        itemType: 'BLOG', source: '', category: 'AI_LLM', summaryKoTitle: '', summaryKoBody: '',
        titleEn: '', url: '', score: 0, tags: [], createdAtSource: new Date().toISOString().slice(0, 16),
        metadata: { stars: undefined, comments: undefined, upvotes: undefined, readTime: undefined, language: undefined },
      });
      setArticleSubView('list');
    } catch (error: any) {
      showMessage('error', `Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Other tab handlers
  const handleSubmitGitRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateGitRepo(gitRepoForm);
      showMessage('success', 'Git Repository created successfully');
      setGitRepoForm({ fullName: '', url: '', description: '', language: '', stars: 0, forks: 0, starsThisWeek: 0, summaryKoTitle: '', summaryKoBody: '', category: 'AI_LLM', score: 0 });
    } catch (error: any) {
      showMessage('error', `Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmitLLMModel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateLLMModel(llmModelForm);
      showMessage('success', 'LLM Model created successfully');
      setLLMModelForm({ modelId: '', modelName: '', slug: '', provider: '', description: '', priceInput: undefined, priceOutput: undefined, priceBlended: undefined, contextWindow: undefined });
    } catch (error: any) {
      showMessage('error', `Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmitModelCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateModelCreator(modelCreatorForm);
      showMessage('success', 'Model Creator created successfully');
      setModelCreatorForm({ slug: '', name: '' });
    } catch (error: any) {
      showMessage('error', `Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSubmitBenchmark = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateBenchmark(benchmarkForm);
      showMessage('success', 'Benchmark created successfully');
      setBenchmarkForm({ benchmarkType: '', displayName: '', categoryGroup: 'Composite', description: '', explanation: '', sortOrder: 0 });
    } catch (error: any) {
      showMessage('error', `Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const tabs = [
    { id: 'article' as TabType, label: 'Articles' },
    { id: 'gitrepo' as TabType, label: 'Repos' },
    { id: 'llmmodel' as TabType, label: 'Models' },
    { id: 'modelcreator' as TabType, label: 'Creators' },
    { id: 'benchmark' as TabType, label: 'Benchmarks' },
  ];

  const inputClass = "w-full px-3 py-2.5 bg-surface-elevated border border-surface-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent transition-colors";
  const labelClass = "block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wide";
  const btnPrimary = "py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-xl transition-colors";
  const btnSecondary = "py-2.5 px-4 border border-surface-border text-text-secondary hover:text-text-primary hover:border-accent/50 rounded-lg text-sm transition-colors";

  // Truncate text
  const truncate = (text: string, max: number) => text.length > max ? text.substring(0, max) + '...' : text;
  const parseOptionalInt = (value: string): number | undefined => {
    if (!value) return undefined;
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">관리자</h1>
          <p className="text-sm text-text-muted">
            Welcome, <span className="text-accent">{user?.name}</span>
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-surface-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'article') setArticleSubView('list'); }}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent -mb-px'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-surface-card rounded-2xl p-6 border border-surface-border">

          {/* ═══ ARTICLES TAB ═══ */}
          {activeTab === 'article' && (
            <>
              {/* Sub-navigation */}
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setArticleSubView('list')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${articleSubView === 'list' ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary'}`}>
                  Article List
                </button>
                <button onClick={() => setArticleSubView('llm-process')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${articleSubView === 'llm-process' ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary'}`}>
                  LLM Process
                </button>
                <button onClick={() => setArticleSubView('manual-create')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${articleSubView === 'manual-create' ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-secondary'}`}>
                  Manual Create
                </button>
              </div>

              {/* ── Article List ── */}
              {articleSubView === 'list' && (
                <div>
                  {/* Search bar */}
                  <form onSubmit={handleArticleSearch} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={articleSearchInput}
                      onChange={(e) => setArticleSearchInput(e.target.value)}
                      placeholder="Search articles..."
                      className={`${inputClass} flex-1`}
                    />
                    <button type="submit" className={`${btnSecondary} px-6`}>Search</button>
                    {articleSearch && (
                      <button type="button" onClick={() => { setArticleSearchInput(''); setArticleSearch(''); setArticlePage(0); }} className={`${btnSecondary} px-4`}>Clear</button>
                    )}
                  </form>

                  <p className="text-xs text-text-muted mb-3">{articleTotalElements} articles total</p>

                  {/* Table */}
                  {articlesLoading ? (
                    <div className="text-center py-10 text-text-muted text-sm">Loading...</div>
                  ) : articles.length === 0 ? (
                    <div className="text-center py-10 text-text-muted text-sm">No articles found</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-surface-border text-text-muted text-xs uppercase tracking-wide">
                            <th className="text-left py-2 pr-3">Title</th>
                            <th className="text-left py-2 px-2 w-20">Source</th>
                            <th className="text-left py-2 px-2 w-24">Category</th>
                            <th className="text-right py-2 px-2 w-16">Score</th>
                            <th className="text-right py-2 pl-2 w-28">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {articles.map((article) => (
                            <tr key={article.id} className="border-b border-surface-border/50 hover:bg-surface-elevated/30 transition-colors">
                              <td className="py-2.5 pr-3">
                                <div className="text-text-primary text-sm leading-snug">{truncate(article.summaryKoTitle || article.titleEn, 50)}</div>
                              </td>
                              <td className="py-2.5 px-2">
                                <span className="text-xs text-text-muted">{article.source}</span>
                              </td>
                              <td className="py-2.5 px-2">
                                <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">{article.category}</span>
                              </td>
                              <td className="py-2.5 px-2 text-right text-text-secondary">{article.score}</td>
                              <td className="py-2.5 pl-2 text-right">
                                <div className="flex justify-end gap-1">
                                  <button onClick={() => openEditModal(article)} className="text-xs px-2 py-1 text-blue-400 hover:bg-blue-400/10 rounded transition-colors">Edit</button>
                                  <button onClick={() => setDeleteConfirm({ id: String(article.id), title: article.summaryKoTitle || article.titleEn })} className="text-xs px-2 py-1 text-red-400 hover:bg-red-400/10 rounded transition-colors">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {articleTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => setArticlePage(p => Math.max(0, p - 1))}
                        disabled={articlePage === 0}
                        className={`${btnSecondary} ${articlePage === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Prev
                      </button>
                      <span className="text-xs text-text-muted">
                        Page {articlePage + 1} of {articleTotalPages}
                      </span>
                      <button
                        onClick={() => setArticlePage(p => Math.min(articleTotalPages - 1, p + 1))}
                        disabled={articlePage >= articleTotalPages - 1}
                        className={`${btnSecondary} ${articlePage >= articleTotalPages - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── LLM Process Form ── */}
              {articleSubView === 'llm-process' && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-text-primary mb-4">LLM Process Article</h2>
                  <p className="text-xs text-text-muted -mt-3 mb-4">Paste article content and let the LLM translate, categorize, and tag it automatically.</p>

                  <div>
                    <label className={labelClass}>English Title</label>
                    <input type="text" value={llmForm.titleEn} onChange={(e) => setLlmForm({ ...llmForm, titleEn: e.target.value })} className={inputClass} required placeholder="Original article title" />
                  </div>

                  <div>
                    <label className={labelClass}>URL</label>
                    <input type="url" value={llmForm.url} onChange={(e) => setLlmForm({ ...llmForm, url: e.target.value })} className={inputClass} required placeholder="https://..." />
                  </div>

                  <div>
                    <label className={labelClass}>Source</label>
                    <select value={llmForm.source} onChange={(e) => setLlmForm({ ...llmForm, source: e.target.value })} className={inputClass}>
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Content (paste full article)</label>
                    <textarea
                      value={llmForm.content}
                      onChange={(e) => setLlmForm({ ...llmForm, content: e.target.value })}
                      className={`${inputClass} min-h-[200px]`}
                      rows={10}
                      required
                      placeholder="Paste the full article content here..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Tags (optional, comma-separated)</label>
                    <input type="text" value={llmTagsInput} onChange={(e) => setLlmTagsInput(e.target.value)} className={inputClass} placeholder="react, performance" />
                  </div>

                  <div className="border-t border-surface-border pt-4">
                    <h3 className="text-sm font-medium text-text-secondary mb-3">Manual Overrides (Optional)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className={labelClass}>Score</label>
                        <input
                          type="number"
                          value={llmScoreOverride ?? ''}
                          onChange={(e) => setLlmScoreOverride(parseOptionalInt(e.target.value))}
                          className={inputClass}
                          placeholder="Set final score"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Metadata Comments</label>
                        <input
                          type="number"
                          value={llmCommentsOverride ?? ''}
                          onChange={(e) => setLlmCommentsOverride(parseOptionalInt(e.target.value))}
                          className={inputClass}
                          placeholder="Set comment count"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Metadata Upvotes</label>
                        <input
                          type="number"
                          value={llmUpvotesOverride ?? ''}
                          onChange={(e) => setLlmUpvotesOverride(parseOptionalInt(e.target.value))}
                          className={inputClass}
                          placeholder="Set upvote count"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      If provided, these values override the generated article after LLM processing.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleLLMPreview}
                      disabled={llmLoading || !llmForm.titleEn || !llmForm.url || !llmForm.content}
                      className={`flex-1 ${btnSecondary} ${llmLoading || !llmForm.titleEn || !llmForm.url || !llmForm.content ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {llmLoading ? 'Processing...' : 'Preview'}
                    </button>
                    <button
                      type="button"
                      onClick={handleLLMProcess}
                      disabled={llmLoading || !llmForm.titleEn || !llmForm.url || !llmForm.content}
                      className={`flex-1 ${btnPrimary} ${llmLoading || !llmForm.titleEn || !llmForm.url || !llmForm.content ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {llmLoading ? 'Processing...' : 'Process & Save'}
                    </button>
                  </div>

                  {/* Loading indicator */}
                  {llmLoading && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
                      <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      <span className="text-sm text-accent">LLM is processing the article... (5-30s)</span>
                    </div>
                  )}

                  {/* Preview result */}
                  {llmPreview && (
                    <div className="border border-surface-border rounded-xl p-5 space-y-3 mt-4">
                      <h3 className="text-sm font-medium text-text-primary">Preview Result</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-text-muted text-xs">Technical:</span>
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${llmPreview.isTechnical ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {llmPreview.isTechnical ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-muted text-xs">Category:</span>
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">{llmPreview.category}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs block mb-1">Korean Title:</span>
                        <p className="text-text-primary text-sm">{llmPreview.titleKo}</p>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs block mb-1">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                          {llmPreview.tags?.map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-muted text-xs block mb-1">Korean Body (first 500 chars):</span>
                        <p className="text-text-secondary text-xs leading-relaxed whitespace-pre-wrap">{truncate(llmPreview.summaryKo, 500)}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Manual Create Form ── */}
              {articleSubView === 'manual-create' && (
                <form onSubmit={handleSubmitArticle} className="space-y-5">
                  <h2 className="text-lg font-medium text-text-primary mb-4">Create Article (Manual)</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Item Type</label>
                      <select value={articleForm.itemType} onChange={(e) => setArticleForm({ ...articleForm, itemType: e.target.value as any })} className={inputClass} required>
                        <option value="BLOG">BLOG</option>
                        <option value="DISCUSSION">DISCUSSION</option>
                        <option value="REPO">REPO</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Source</label>
                      <input type="text" value={articleForm.source} onChange={(e) => setArticleForm({ ...articleForm, source: e.target.value })} className={inputClass} required placeholder="hackernews, reddit..." />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Category</label>
                    <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} className={inputClass} required>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Korean Title</label>
                    <input type="text" value={articleForm.summaryKoTitle} onChange={(e) => setArticleForm({ ...articleForm, summaryKoTitle: e.target.value })} className={inputClass} required maxLength={500} />
                  </div>

                  <div>
                    <label className={labelClass}>Korean Body (Optional)</label>
                    <textarea value={articleForm.summaryKoBody} onChange={(e) => setArticleForm({ ...articleForm, summaryKoBody: e.target.value })} className={inputClass} rows={3} />
                  </div>

                  <div>
                    <label className={labelClass}>English Title</label>
                    <input type="text" value={articleForm.titleEn} onChange={(e) => setArticleForm({ ...articleForm, titleEn: e.target.value })} className={inputClass} required maxLength={500} />
                  </div>

                  <div>
                    <label className={labelClass}>URL</label>
                    <input type="url" value={articleForm.url} onChange={(e) => setArticleForm({ ...articleForm, url: e.target.value })} className={inputClass} required maxLength={1000} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Score</label>
                      <input type="number" value={articleForm.score} onChange={(e) => setArticleForm({ ...articleForm, score: parseInt(e.target.value) })} className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Created At</label>
                      <input type="datetime-local" value={articleForm.createdAtSource} onChange={(e) => setArticleForm({ ...articleForm, createdAtSource: e.target.value })} className={inputClass} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Tags (comma-separated)</label>
                    <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inputClass} placeholder="rust, performance, api" />
                  </div>

                  <div className="border-t border-surface-border pt-5 mt-5">
                    <h3 className="text-sm font-medium text-text-secondary mb-4">Metadata (Optional)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Stars</label>
                        <input type="number" value={articleForm.metadata?.stars ?? ''} onChange={(e) => setArticleForm({ ...articleForm, metadata: { ...articleForm.metadata, stars: parseOptionalInt(e.target.value) } })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Comments</label>
                        <input type="number" value={articleForm.metadata?.comments ?? ''} onChange={(e) => setArticleForm({ ...articleForm, metadata: { ...articleForm.metadata, comments: parseOptionalInt(e.target.value) } })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Upvotes</label>
                        <input type="number" value={articleForm.metadata?.upvotes ?? ''} onChange={(e) => setArticleForm({ ...articleForm, metadata: { ...articleForm.metadata, upvotes: parseOptionalInt(e.target.value) } })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Read Time</label>
                        <input type="text" value={articleForm.metadata?.readTime || ''} onChange={(e) => setArticleForm({ ...articleForm, metadata: { ...articleForm.metadata, readTime: e.target.value || undefined } })} className={inputClass} placeholder="5분" />
                      </div>
                      <div>
                        <label className={labelClass}>Language</label>
                        <input type="text" value={articleForm.metadata?.language || ''} onChange={(e) => setArticleForm({ ...articleForm, metadata: { ...articleForm.metadata, language: e.target.value || undefined } })} className={inputClass} placeholder="English" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={`w-full ${btnPrimary}`}>Create Article</button>
                </form>
              )}
            </>
          )}

          {/* ═══ GIT REPOS TAB ═══ */}
          {activeTab === 'gitrepo' && (
            <form onSubmit={handleSubmitGitRepo} className="space-y-5">
              <h2 className="text-lg font-medium text-text-primary mb-4">Create Repository</h2>
              <div>
                <label className={labelClass}>Full Name (owner/repo)</label>
                <input type="text" value={gitRepoForm.fullName} onChange={(e) => setGitRepoForm({ ...gitRepoForm, fullName: e.target.value })} className={inputClass} required placeholder="facebook/react" />
              </div>
              <div>
                <label className={labelClass}>URL</label>
                <input type="url" value={gitRepoForm.url} onChange={(e) => setGitRepoForm({ ...gitRepoForm, url: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={gitRepoForm.description} onChange={(e) => setGitRepoForm({ ...gitRepoForm, description: e.target.value })} className={inputClass} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Language</label>
                  <input type="text" value={gitRepoForm.language} onChange={(e) => setGitRepoForm({ ...gitRepoForm, language: e.target.value })} className={inputClass} placeholder="JavaScript" />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={gitRepoForm.category} onChange={(e) => setGitRepoForm({ ...gitRepoForm, category: e.target.value })} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Stars</label>
                  <input type="number" value={gitRepoForm.stars} onChange={(e) => setGitRepoForm({ ...gitRepoForm, stars: parseInt(e.target.value) || 0 })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Forks</label>
                  <input type="number" value={gitRepoForm.forks} onChange={(e) => setGitRepoForm({ ...gitRepoForm, forks: parseInt(e.target.value) || 0 })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stars This Week</label>
                  <input type="number" value={gitRepoForm.starsThisWeek} onChange={(e) => setGitRepoForm({ ...gitRepoForm, starsThisWeek: parseInt(e.target.value) || 0 })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Korean Title</label>
                <input type="text" value={gitRepoForm.summaryKoTitle} onChange={(e) => setGitRepoForm({ ...gitRepoForm, summaryKoTitle: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Score</label>
                <input type="number" value={gitRepoForm.score} onChange={(e) => setGitRepoForm({ ...gitRepoForm, score: parseInt(e.target.value) })} className={inputClass} required />
              </div>
              <button type="submit" className={`w-full ${btnPrimary}`}>Create Repository</button>
            </form>
          )}

          {/* ═══ LLM MODELS TAB ═══ */}
          {activeTab === 'llmmodel' && (
            <form onSubmit={handleSubmitLLMModel} className="space-y-5">
              <h2 className="text-lg font-medium text-text-primary mb-4">Create LLM Model</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Model ID</label>
                  <input type="text" value={llmModelForm.modelId} onChange={(e) => setLLMModelForm({ ...llmModelForm, modelId: e.target.value })} className={inputClass} required placeholder="gpt-4-turbo" />
                </div>
                <div>
                  <label className={labelClass}>Model Name</label>
                  <input type="text" value={llmModelForm.modelName} onChange={(e) => setLLMModelForm({ ...llmModelForm, modelName: e.target.value })} className={inputClass} required placeholder="GPT-4 Turbo" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Slug</label>
                  <input type="text" value={llmModelForm.slug} onChange={(e) => setLLMModelForm({ ...llmModelForm, slug: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Provider</label>
                  <input type="text" value={llmModelForm.provider} onChange={(e) => setLLMModelForm({ ...llmModelForm, provider: e.target.value })} className={inputClass} placeholder="OpenAI" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={llmModelForm.description} onChange={(e) => setLLMModelForm({ ...llmModelForm, description: e.target.value })} className={inputClass} rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Price Input ($/MTok)</label>
                  <input type="number" step="0.01" value={llmModelForm.priceInput || ''} onChange={(e) => setLLMModelForm({ ...llmModelForm, priceInput: parseFloat(e.target.value) || undefined })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Price Output ($/MTok)</label>
                  <input type="number" step="0.01" value={llmModelForm.priceOutput || ''} onChange={(e) => setLLMModelForm({ ...llmModelForm, priceOutput: parseFloat(e.target.value) || undefined })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Context Window</label>
                  <input type="number" value={llmModelForm.contextWindow || ''} onChange={(e) => setLLMModelForm({ ...llmModelForm, contextWindow: parseInt(e.target.value) || undefined })} className={inputClass} placeholder="128000" />
                </div>
              </div>
              <button type="submit" className={`w-full ${btnPrimary}`}>Create Model</button>
            </form>
          )}

          {/* ═══ MODEL CREATORS TAB ═══ */}
          {activeTab === 'modelcreator' && (
            <form onSubmit={handleSubmitModelCreator} className="space-y-5">
              <h2 className="text-lg font-medium text-text-primary mb-4">Create Model Creator</h2>
              <div>
                <label className={labelClass}>Slug</label>
                <input type="text" value={modelCreatorForm.slug} onChange={(e) => setModelCreatorForm({ ...modelCreatorForm, slug: e.target.value })} className={inputClass} required placeholder="openai" />
              </div>
              <div>
                <label className={labelClass}>Name</label>
                <input type="text" value={modelCreatorForm.name} onChange={(e) => setModelCreatorForm({ ...modelCreatorForm, name: e.target.value })} className={inputClass} required placeholder="OpenAI" />
              </div>
              <button type="submit" className={`w-full ${btnPrimary}`}>Create Creator</button>
            </form>
          )}

          {/* ═══ BENCHMARKS TAB ═══ */}
          {activeTab === 'benchmark' && (
            <form onSubmit={handleSubmitBenchmark} className="space-y-5">
              <h2 className="text-lg font-medium text-text-primary mb-4">Create Benchmark</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Benchmark Type</label>
                  <input type="text" value={benchmarkForm.benchmarkType} onChange={(e) => setBenchmarkForm({ ...benchmarkForm, benchmarkType: e.target.value })} className={inputClass} required placeholder="TERMINAL_BENCH_HARD" />
                </div>
                <div>
                  <label className={labelClass}>Display Name</label>
                  <input type="text" value={benchmarkForm.displayName} onChange={(e) => setBenchmarkForm({ ...benchmarkForm, displayName: e.target.value })} className={inputClass} required placeholder="Terminal Bench Hard" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category Group</label>
                  <select value={benchmarkForm.categoryGroup} onChange={(e) => setBenchmarkForm({ ...benchmarkForm, categoryGroup: e.target.value })} className={inputClass} required>
                    {['Composite', 'Agentic', 'Reasoning', 'Coding', 'Math', 'Specialized'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input type="number" value={benchmarkForm.sortOrder} onChange={(e) => setBenchmarkForm({ ...benchmarkForm, sortOrder: parseInt(e.target.value) })} className={inputClass} required />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea value={benchmarkForm.description} onChange={(e) => setBenchmarkForm({ ...benchmarkForm, description: e.target.value })} className={inputClass} rows={2} required />
              </div>
              <div>
                <label className={labelClass}>Explanation (Optional)</label>
                <textarea value={benchmarkForm.explanation} onChange={(e) => setBenchmarkForm({ ...benchmarkForm, explanation: e.target.value })} className={inputClass} rows={3} />
              </div>
              <button type="submit" className={`w-full ${btnPrimary}`}>Create Benchmark</button>
            </form>
          )}
        </div>
      </div>

      {/* ═══ DELETE CONFIRMATION DIALOG ═══ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-text-primary mb-2">Delete Article</h3>
            <p className="text-sm text-text-muted mb-6">
              Are you sure you want to delete "<span className="text-text-secondary">{truncate(deleteConfirm.title, 60)}</span>"?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className={`flex-1 ${btnSecondary}`}>Cancel</button>
              <button onClick={handleDeleteArticle} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EDIT ARTICLE MODAL ═══ */}
      {editArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 max-w-2xl w-full mx-4">
            <form onSubmit={handleUpdateArticle} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-text-primary">Edit Article</h3>
                <button type="button" onClick={() => setEditArticle(null)} className="text-text-muted hover:text-text-primary text-sm">Close</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Item Type</label>
                  <select value={editForm.itemType} onChange={(e) => setEditForm({ ...editForm, itemType: e.target.value as any })} className={inputClass}>
                    <option value="BLOG">BLOG</option>
                    <option value="DISCUSSION">DISCUSSION</option>
                    <option value="REPO">REPO</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Source</label>
                  <input type="text" value={editForm.source || ''} onChange={(e) => setEditForm({ ...editForm, source: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Category</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={inputClass}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Korean Title</label>
                <input type="text" value={editForm.summaryKoTitle || ''} onChange={(e) => setEditForm({ ...editForm, summaryKoTitle: e.target.value })} className={inputClass} maxLength={500} />
              </div>

              <div>
                <label className={labelClass}>Korean Body</label>
                <textarea value={editForm.summaryKoBody || ''} onChange={(e) => setEditForm({ ...editForm, summaryKoBody: e.target.value })} className={inputClass} rows={4} />
              </div>

              <div>
                <label className={labelClass}>English Title</label>
                <input type="text" value={editForm.titleEn || ''} onChange={(e) => setEditForm({ ...editForm, titleEn: e.target.value })} className={inputClass} maxLength={500} />
              </div>

              <div>
                <label className={labelClass}>URL</label>
                <input type="url" value={editForm.url || ''} onChange={(e) => setEditForm({ ...editForm, url: e.target.value })} className={inputClass} maxLength={1000} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Score</label>
                  <input type="number" value={editForm.score ?? 0} onChange={(e) => setEditForm({ ...editForm, score: parseInt(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Tags (comma-separated)</label>
                  <input type="text" value={editTagsInput} onChange={(e) => setEditTagsInput(e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="border-t border-surface-border pt-4 mt-1">
                <h4 className="text-sm font-medium text-text-secondary mb-3">Metadata (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Stars</label>
                    <input
                      type="number"
                      value={editForm.metadata?.stars ?? ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, stars: parseOptionalInt(e.target.value) },
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Comments</label>
                    <input
                      type="number"
                      value={editForm.metadata?.comments ?? ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, comments: parseOptionalInt(e.target.value) },
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Upvotes</label>
                    <input
                      type="number"
                      value={editForm.metadata?.upvotes ?? ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, upvotes: parseOptionalInt(e.target.value) },
                      })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Read Time</label>
                    <input
                      type="text"
                      value={editForm.metadata?.readTime || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, readTime: e.target.value || undefined },
                      })}
                      className={inputClass}
                      placeholder="5분"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Language</label>
                    <input
                      type="text"
                      value={editForm.metadata?.language || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        metadata: { ...editForm.metadata, language: e.target.value || undefined },
                      })}
                      className={inputClass}
                      placeholder="English"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditArticle(null)} className={`flex-1 ${btnSecondary}`}>Cancel</button>
                <button type="submit" className={`flex-1 ${btnPrimary}`}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
