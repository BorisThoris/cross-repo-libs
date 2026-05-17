import { describe, expect, test } from 'vitest';
import { storyRegistry } from './storyRegistry.js';

describe('storyRegistry', () => {
  const publicGroups = [
    'Showcase Effects',
    '3D Primitives',
    'Interactive Systems',
    'Application Components',
    'UI Primitives',
    'Notifications'
  ];

  test('contains stable story metadata for every custom component story', () => {
    expect(storyRegistry.length).toBeGreaterThanOrEqual(10);

    for (const story of storyRegistry) {
      expect(story.id).toBeTruthy();
      expect(story.title).toBeTruthy();
      expect(story.packageName).toMatch(/^@cross-repo-libs\//);
      expect(story.variants.length).toBeGreaterThan(0);
      expect(story.importSnippet).toContain(story.packageName);
      expect(story.overview.length).toBeGreaterThan(20);
      expect(story.usage.length).toBeGreaterThan(20);
      expect(story.packageNotes.length).toBeGreaterThan(20);
      expect(publicGroups).toContain(story.group);
      expect(['compact', 'standard', 'wide', 'canvas', 'immersive']).toContain(story.previewSize);
    }
  });

  test('orders the public showcase by visual impact first', () => {
    expect(storyRegistry[0]?.id).toBe('aero-liquid-background');
    expect(storyRegistry[1]?.group).toBe('3D Primitives');

    const groupOrder = Array.from(new Set(storyRegistry.map((story) => story.group)));
    expect(groupOrder).toEqual(publicGroups);
  });

  test('keeps story ids unique', () => {
    const ids = storyRegistry.map((story) => story.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('uses public-facing story copy', () => {
    const internalTerms = /\b(vetted|candidate|accepted|rejected|deferred|why it passed|source provenance)\b/i;
    const publicCopy = storyRegistry
      .flatMap((story) => [
        story.title,
        story.overview,
        story.usage,
        story.packageNotes,
        ...story.variants.flatMap((variant) => [variant.label, variant.description])
      ])
      .join(' ');

    expect(publicCopy).not.toMatch(internalTerms);
  });
});
