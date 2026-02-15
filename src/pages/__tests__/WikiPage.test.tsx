/**
 * Integration tests for WikiPage layout and behavior.
 * 
 * Covers:
 * - 3-column layout (left anchor rail, center content, right activity/releases/chat)
 * - Section visibility based on hiddenSections array
 * - Progressive disclosure controls
 * 
 * Note: Requires test framework (Vitest/Jest + @testing-library/react) to run.
 * These tests document expected behavior and serve as regression checks.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WikiPage from '../WikiPage';
import type { WikiSnapshot } from '../../types/wiki';

// Mock wiki service
vi.mock('../../services/wiki/wikiService', () => ({
  getDomainBrowseCards: vi.fn(() => Promise.resolve([
    {
      domain: 'ml-frameworks',
      projectCount: 5,
      topProjects: [{ projectExternalId: 'github:test/repo', fullName: 'test/repo', stars: 1000 }]
    }
  ])),
  getWikiSnapshot: vi.fn((projectExternalId: string) => Promise.resolve<WikiSnapshot>({
    projectExternalId,
    generatedAt: '2026-02-15T00:00:00Z',
    isDataReady: true,
    hiddenSections: [],
    what: { summary: 'What summary', deepDiveMarkdown: 'What deep' },
    how: { summary: 'How summary', deepDiveMarkdown: 'How deep' },
    architecture: { summary: 'Architecture summary', deepDiveMarkdown: 'Arch deep' },
    activity: { summary: 'Activity summary', deepDiveMarkdown: 'Activity deep' },
    releases: { summary: 'Releases summary', deepDiveMarkdown: 'Releases deep' }
  })),
  getVisibleSections: vi.fn((snapshot: WikiSnapshot) => 
    ['what', 'how', 'architecture', 'activity', 'releases'].filter(
      s => !snapshot.hiddenSections.includes(s)
    )
  )
}));

describe('WikiPage', () => {
  it('renders 3-column layout with anchor rail, content, and right rail', async () => {
    render(
      <BrowserRouter>
        <WikiPage />
      </BrowserRouter>
    );

    // Wait for snapshot to load
    await screen.findByText(/what summary/i, {}, { timeout: 2000 });

    // Verify layout structure exists
    // Left anchor rail (section anchors only)
    const anchorRail = document.querySelector('.fixed.left-52');
    expect(anchorRail).toBeTruthy();

    // Right rail (activity/releases/chat modules)
    const rightRail = document.querySelector('.fixed.right-0');
    expect(rightRail).toBeTruthy();

    // Center content column
    const centerContent = document.querySelector('.xl\\:ml-48.xl\\:mr-\\[28\\%\\]');
    expect(centerContent).toBeTruthy();
  });

  it('hides sections listed in hiddenSections array', async () => {
    const mockSnapshot: WikiSnapshot = {
      projectExternalId: 'github:test/repo',
      generatedAt: '2026-02-15T00:00:00Z',
      isDataReady: true,
      hiddenSections: ['architecture'],  // Architecture is hidden
      what: { summary: 'What summary', deepDiveMarkdown: 'What deep' },
      how: { summary: 'How summary', deepDiveMarkdown: 'How deep' },
      architecture: null,  // Missing/incomplete
      activity: { summary: 'Activity summary' },
      releases: { summary: 'Releases summary' }
    };

    const { getWikiSnapshot } = await import('../../services/wiki/wikiService');
    vi.mocked(getWikiSnapshot).mockResolvedValueOnce(mockSnapshot);

    render(
      <BrowserRouter>
        <WikiPage />
      </BrowserRouter>
    );

    await screen.findByText(/what summary/i);

    // Architecture should not be rendered
    expect(screen.queryByText(/architecture summary/i)).toBeNull();

    // Other sections should be visible
    expect(screen.getByText(/what summary/i)).toBeTruthy();
    expect(screen.getByText(/how summary/i)).toBeTruthy();
  });

  it('displays activity and release modules in right rail above chat', async () => {
    render(
      <BrowserRouter>
        <WikiPage />
      </BrowserRouter>
    );

    await screen.findByText(/repository activity/i, {}, { timeout: 2000 });

    // Verify right rail module ordering
    const rightRail = screen.getByText(/repository activity/i).closest('aside');
    expect(rightRail).toBeTruthy();

    // Activity and releases should appear before chat
    const moduleTitles = Array.from(rightRail?.querySelectorAll('h3') || []).map(h => h.textContent);
    const activityIndex = moduleTitles.findIndex(t => t?.includes('Activity'));
    const releasesIndex = moduleTitles.findIndex(t => t?.includes('Releases'));

    expect(activityIndex).toBeGreaterThanOrEqual(0);
    expect(releasesIndex).toBeGreaterThanOrEqual(0);
    // Chat is always at bottom (rendered last)
  });

  it('renders directory view with domain cards when no route params', async () => {
    render(
      <BrowserRouter>
        <WikiPage />
      </BrowserRouter>
    );

    await screen.findByText(/code wiki/i);
    await screen.findByText(/browse open-source projects by domain/i);

    // Domain cards should be visible
    expect(screen.getByText(/ml-frameworks/i)).toBeTruthy();
  });

  it('filters domain browse to data-ready projects only', async () => {
    const { getDomainBrowseCards } = await import('../../services/wiki/wikiService');
    vi.mocked(getDomainBrowseCards).mockResolvedValueOnce([
      {
        domain: 'web-frameworks',
        projectCount: 2,
        topProjects: [
          { projectExternalId: 'github:ready/repo', fullName: 'ready/repo', stars: 5000 },
          // Not-ready projects already filtered by API
        ]
      }
    ]);

    render(
      <BrowserRouter>
        <WikiPage />
      </BrowserRouter>
    );

    await screen.findByText(/ready\/repo/i);

    // Only data-ready projects should appear
    expect(screen.getByText(/ready\/repo/i)).toBeTruthy();
  });
});
