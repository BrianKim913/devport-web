/**
 * WikiContentColumn - Center column rendering progressive dynamic wiki sections.
 */

import { useState } from 'react';
import type { WikiSection, WikiSnapshot } from '../../types/wiki';
import WikiMarkdownRenderer, { MermaidCodeBlock } from './WikiMarkdownRenderer';

interface WikiContentColumnProps {
  snapshot: WikiSnapshot;
  sections: WikiSection[];
}

const SECTION_ICONS: Record<string, string> = {
  what: '📌',
  how: '⚙️',
  architecture: '🏗️',
  activity: '📊',
  releases: '🚀',
  chat: '💬',
};

export default function WikiContentColumn({ snapshot, sections }: WikiContentColumnProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.filter(section => section.defaultExpanded).map(section => section.sectionId))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {sections.map(section => {
        const icon = SECTION_ICONS[section.sectionId] || '📄';
        const isExpanded = expandedSections.has(section.sectionId);
        const hasDiagram = !!section.generatedDiagramDsl;

        return (
          <section
            key={section.sectionId}
            id={`section-${section.anchor}`}
            className="bg-surface-card rounded-xl border border-surface-border overflow-hidden"
          >
            {/* Section Header */}
            <div className="px-5 py-3 border-b border-surface-border bg-surface-elevated/30">
              <h2 className="text-sm font-medium text-text-secondary flex items-center gap-2">
                <span>{icon}</span>
                <span>{section.heading}</span>
              </h2>
            </div>

            {/* Section Content */}
            <div className="px-5 py-5 space-y-4">
              {/* Summary */}
              <div className="text-sm text-text-primary leading-relaxed">
                <WikiMarkdownRenderer content={section.summary} />
              </div>

              {/* Architecture Diagram (if present) */}
              {hasDiagram && (
                <MermaidCodeBlock source={section.generatedDiagramDsl || ''} title="Generated architecture diagram (Mermaid)" />
              )}

              {/* Deep Dive (expandable) */}
              {section.deepDiveMarkdown && (
                <div>
                  <button
                    onClick={() => toggleSection(section.sectionId)}
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
                    <div className="mt-4">
                      <WikiMarkdownRenderer content={section.deepDiveMarkdown} />
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
