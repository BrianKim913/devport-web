/**
 * WikiAnchorRail - Left rail with section anchors for navigation.
 * Only shows visible sections based on data readiness.
 */

interface WikiAnchorRailProps {
  sections: string[];
}

const SECTION_LABELS: Record<string, string> = {
  what: '프로젝트 개요',
  how: '작동 원리',
  architecture: '아키텍처',
  activity: '활동 내역',
  releases: '릴리스',
  chat: '채팅',
};

export default function WikiAnchorRail({ sections }: WikiAnchorRailProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="space-y-1">
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-3">목차</h3>
      {sections.map(section => (
        <button
          key={section}
          onClick={() => scrollToSection(section)}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
        >
          {SECTION_LABELS[section] || section}
        </button>
      ))}
    </nav>
  );
}
