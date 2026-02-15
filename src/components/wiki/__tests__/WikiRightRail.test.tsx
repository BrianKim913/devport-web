/**
 * Tests for WikiRightRail module ordering.
 * 
 * Covers:
 * - Right rail module order: activity → releases → chat (bottom)
 * - Module visibility based on hiddenSections
 * 
 * Note: Requires test framework (Vitest/Jest + @testing-library/react) to run.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WikiRightRail from '../WikiRightRail';
import type { WikiSnapshot } from '../../../types/wiki';

describe('WikiRightRail', () => {
  it('renders activity module, releases module, then chat in correct order', () => {
    const snapshot: WikiSnapshot = {
      projectExternalId: 'github:test/repo',
      generatedAt: '2026-02-15T00:00:00Z',
      isDataReady: true,
      hiddenSections: [],
      activity: { summary: 'Activity summary', deepDiveMarkdown: 'Activity detail' },
      releases: { summary: 'Release summary', deepDiveMarkdown: 'Release detail' },
      what: { summary: 'What' },
      how: { summary: 'How' }
    };

    const { container } = render(
      <WikiRightRail snapshot={snapshot} projectExternalId="github:test/repo" />
    );

    // Get all module containers in order
    const modules = container.querySelectorAll('.bg-surface-card');

    // Verify ordering: activity (index 0), releases (index 1), chat (always last, outside card)
    expect(modules.length).toBeGreaterThanOrEqual(2);

    const moduleHeadings = Array.from(modules).map(m => m.querySelector('h3')?.textContent);

    // Activity should come first
    expect(moduleHeadings[0]).toContain('Repository Activity');

    // Releases should come second
    expect(moduleHeadings[1]).toContain('Recent Releases');

    // Chat panel is rendered after modules (always at bottom)
    const chatPanel = container.querySelector('div > div:last-child');
    expect(chatPanel).toBeTruthy();  // Chat is always present
  });

  it('hides activity module when in hiddenSections', () => {
    const snapshot: WikiSnapshot = {
      projectExternalId: 'github:test/repo',
      generatedAt: '2026-02-15T00:00:00Z',
      isDataReady: true,
      hiddenSections: ['activity'],  // Activity is hidden
      activity: { summary: 'Activity summary' },
      releases: { summary: 'Release summary' },
      what: { summary: 'What' },
      how: { summary: 'How' }
    };

    render(
      <WikiRightRail snapshot={snapshot} projectExternalId="github:test/repo" />
    );

    // Activity module should not render
    expect(screen.queryByText(/repository activity/i)).toBeNull();

    // Releases should still render
    expect(screen.getByText(/recent releases/i)).toBeTruthy();
  });

  it('hides releases module when in hiddenSections', () => {
    const snapshot: WikiSnapshot = {
      projectExternalId: 'github:test/repo',
      generatedAt: '2026-02-15T00:00:00Z',
      isDataReady: true,
      hiddenSections: ['releases'],  // Releases is hidden
      activity: { summary: 'Activity summary' },
      releases: { summary: 'Release summary' },
      what: { summary: 'What' },
      how: { summary: 'How' }
    };

    render(
      <WikiRightRail snapshot={snapshot} projectExternalId="github:test/repo" />
    );

    // Releases module should not render
    expect(screen.queryByText(/recent releases/i)).toBeNull();

    // Activity should still render
    expect(screen.getByText(/repository activity/i)).toBeTruthy();
  });

  it('always renders chat panel at bottom regardless of other module visibility', () => {
    const snapshotAllHidden: WikiSnapshot = {
      projectExternalId: 'github:test/repo',
      generatedAt: '2026-02-15T00:00:00Z',
      isDataReady: true,
      hiddenSections: ['activity', 'releases'],  // Both modules hidden
      what: { summary: 'What' },
      how: { summary: 'How' }
    };

    const { container } = render(
      <WikiRightRail snapshot={snapshotAllHidden} projectExternalId="github:test/repo" />
    );

    // Chat should still be rendered even when activity/releases are hidden
    // (Chat is a separate component, not controlled by hiddenSections)
    const chatPanel = container.querySelector('[class*="space-y"] > div:last-child');
    expect(chatPanel).toBeTruthy();
  });

  it('renders modules with correct summary content', () => {
    const snapshot: WikiSnapshot = {
      projectExternalId: 'github:test/repo',
      generatedAt: '2026-02-15T00:00:00Z',
      isDataReady: true,
      hiddenSections: [],
      activity: { summary: 'Last 30 days: 45 commits, 12 PRs merged' },
      releases: { summary: 'v2.1.0 released 3 days ago' },
      what: { summary: 'What' },
      how: { summary: 'How' }
    };

    render(
      <WikiRightRail snapshot={snapshot} projectExternalId="github:test/repo" />
    );

    // Verify summaries are rendered
    expect(screen.getByText(/45 commits, 12 PRs merged/i)).toBeTruthy();
    expect(screen.getByText(/v2\.1\.0 released 3 days ago/i)).toBeTruthy();
  });
});
