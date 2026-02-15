/**
 * WikiContentColumn - Center column rendering progressive Core-6 sections.
 * Shows summary-first with expandable deep content and architecture diagrams when present.
 */

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { WikiSnapshot, SectionType } from '../../types/wiki';

interface WikiContentColumnProps {
  snapshot: WikiSnapshot;
  visibleSections: string[];
}

const SECTION_META: Record<string, { title: string; icon: string }> = {
  what: { title: '프로젝트 개요', icon: '📌' },
  how: { title: '작동 원리', icon: '⚙️' },
  architecture: { title: '아키텍처', icon: '🏗️' },
  activity: { title: '활동 내역', icon: '📊' },
  releases: { title: '릴리스', icon: '🚀' },
  chat: { title: '채팅', icon: '💬' },
};

export default function WikiContentColumn({ snapshot, visibleSections }: WikiContentColumnProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(visibleSections.filter(s => snapshot[s as SectionType]?.defaultExpanded))
  );

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {visibleSections.map(sectionKey => {
        const section = snapshot[sectionKey as SectionType];
        if (!section) return null;

        const meta = SECTION_META[sectionKey];
        const isExpanded = expandedSections.has(sectionKey);
        const hasDiagram = !!section.generatedDiagramDsl;

        return (
          <section
            key={sectionKey}
            id={`section-${sectionKey}`}
            className="bg-surface-card rounded-xl border border-surface-border overflow-hidden"
          >
            {/* Section Header */}
            <div className="px-5 py-3 border-b border-surface-border bg-surface-elevated/30">
              <h2 className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <span>{meta?.icon}</span>
                <span>{meta?.title || sectionKey}</span>
              </h2>
            </div>

            {/* Section Content */}
            <div className="px-5 py-5 space-y-4">
              {/* Summary */}
              <p className="text-sm text-text-primary leading-relaxed">{section.summary}</p>

              {/* Architecture Diagram (if present) */}
              {hasDiagram && (
                <div className="bg-surface-elevated/50 rounded-lg p-4 border border-surface-border">
                  <pre className="text-xs text-text-muted overflow-x-auto font-mono">
                    {section.generatedDiagramDsl}
                  </pre>
                  <p className="text-2xs text-text-muted mt-2">
                    Generated architecture diagram (Mermaid DSL)
                  </p>
                </div>
              )}

              {/* Deep Dive (expandable) */}
              {section.deepDiveMarkdown && (
                <div>
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="flex items-center gap-2 text-xs text-accent hover:text-accent-light transition-colors"
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span>{isExpanded ? '기술 세부사항 접기' : '기술 세부사항 펼치기'}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{section.deepDiveMarkdown}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* Generation Metadata */}
      <div className="text-center py-4">
        <p className="text-2xs text-text-muted">
          Generated: {new Date(snapshot.generatedAt).toLocaleString('ko-KR')}
        </p>
      </div>
    </div>
  );
}
