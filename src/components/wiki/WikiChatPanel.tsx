/**
 * WikiChatPanel - Chat interface with repo-specific Q&A and optional citations.
 * Uses short-lived session memory and handles clarification requests.
 */

import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
  needsClarification?: boolean;
}

interface WikiChatPanelProps {
  projectExternalId: string;
}

export default function WikiChatPanel({ projectExternalId }: WikiChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showCitations, setShowCitations] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/wiki/projects/${encodeURIComponent(projectExternalId)}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectExternalId,
          question: userMessage.content,
          sessionId: sessionId || undefined,
          includeCitations: showCitations,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();

      // Update session ID if this is the first message
      if (!sessionId && data.sessionId) {
        setSessionId(data.sessionId);
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations || [],
        needsClarification: data.needsClarification || false,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-border overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-surface-border bg-surface-elevated/30 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary flex items-center gap-2">
          <span>💬</span>
          <span>Ask about this repository</span>
        </h3>
        <button
          onClick={() => setShowCitations(!showCitations)}
          className="text-2xs text-text-muted hover:text-text-primary transition-colors"
          title="Toggle citations"
        >
          {showCitations ? 'Hide citations' : 'Show citations'}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="px-4 py-3 max-h-[400px] overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-text-muted">Ask a question about this project's architecture, usage, or recent changes.</p>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                msg.role === 'user'
                  ? 'bg-accent/15 text-text-primary'
                  : 'bg-surface-elevated text-text-secondary'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Clarification Notice */}
              {msg.needsClarification && (
                <p className="text-2xs text-text-muted mt-2 italic">
                  Clarification requested - please provide more context.
                </p>
              )}

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-2xs text-text-muted">Sources:</p>
                  {msg.citations.map((cite, i) => (
                    <a
                      key={i}
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xs text-accent hover:text-accent-light block"
                    >
                      {cite.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-elevated rounded-lg px-3 py-2">
              <span className="text-xs text-text-muted">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="px-4 py-3 border-t border-surface-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 bg-surface-elevated/50 border border-surface-border/50 rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg bg-accent/15 text-accent hover:bg-accent/25 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
