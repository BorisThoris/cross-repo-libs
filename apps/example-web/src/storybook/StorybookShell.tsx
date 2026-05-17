import { useEffect, useMemo, useState } from 'react';
import type { StoryRecord } from './types.js';
import { StoryDocs } from './StoryDocs.js';
import { StoryPreview } from './StoryPreview.js';

interface StorybookShellProps {
  stories: readonly StoryRecord[];
}

export function StorybookShell({ stories }: StorybookShellProps) {
  const initialSelection = readHashSelection(stories);
  const [activeStoryId, setActiveStoryId] = useState(initialSelection.storyId);
  const [activeVariantByStory, setActiveVariantByStory] = useState<Record<string, string>>(
    initialSelection.variantId ? { [initialSelection.storyId]: initialSelection.variantId } : {}
  );

  const activeStory = stories.find((story) => story.id === activeStoryId) ?? stories[0];
  const groupedStories = useMemo(() => {
    const groups = new Map<StoryRecord['group'], StoryRecord[]>();
    for (const story of stories) {
      groups.set(story.group, [...(groups.get(story.group) ?? []), story]);
    }
    return Array.from(groups.entries());
  }, [stories]);

  useEffect(() => {
    const syncFromHash = () => {
      const selection = readHashSelection(stories);
      setActiveStoryId(selection.storyId);
      if (selection.variantId) {
        setActiveVariantByStory((current) => ({ ...current, [selection.storyId]: selection.variantId! }));
      }
    };

    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [stories]);

  if (!activeStory) {
    return (
      <main className="storybook-empty">
        <h1>No component stories found</h1>
      </main>
    );
  }

  const activeVariantId = activeVariantByStory[activeStory.id] ?? activeStory.variants[0]?.id;
  const activeVariant = activeStory.variants.find((variant) => variant.id === activeVariantId) ?? activeStory.variants[0];

  const selectStory = (storyId: string) => {
    setActiveStoryId(storyId);
    const story = stories.find((item) => item.id === storyId);
    const variantId = story ? (activeVariantByStory[story.id] ?? story.variants[0]?.id) : undefined;
    writeHash(storyId, variantId);
  };

  const setVariant = (variantId: string) => {
    setActiveVariantByStory((current) => ({ ...current, [activeStory.id]: variantId }));
    writeHash(activeStory.id, variantId);
  };

  return (
    <main className="storybook-app">
      <aside className="storybook-sidebar" aria-label="Component stories">
        <div className="storybook-brand">
          <p className="sb-eyebrow">Cross Repo Libs</p>
          <h1>Component Storybook</h1>
          <span>{stories.length} component stories</span>
        </div>

        <nav className="storybook-nav">
          {groupedStories.map(([group, groupStories]) => (
            <section className="storybook-nav__group" key={group}>
              <h2>{group}</h2>
              {groupStories.map((story) => (
                <button
                  aria-current={story.id === activeStory.id ? 'page' : undefined}
                  className="storybook-nav__item"
                  key={story.id}
                  onClick={() => selectStory(story.id)}
                  type="button"
                >
                  <span>{story.title}</span>
                  <small>{story.packageName.replace('@cross-repo-libs/', '')}</small>
                </button>
              ))}
            </section>
          ))}
        </nav>
      </aside>

      <section className="storybook-main">
        <header className="storybook-topbar">
          <div>
            <p className="sb-eyebrow">Component</p>
            <h2>{activeStory.title}</h2>
          </div>
          <div className="variant-tabs" aria-label={`${activeStory.title} variants`}>
            {activeStory.variants.map((variant) => (
              <button
                aria-pressed={variant.id === activeVariant.id}
                key={variant.id}
                onClick={() => setVariant(variant.id)}
                type="button"
              >
                {variant.label}
              </button>
            ))}
          </div>
        </header>

        <div className="storybook-content">
          <StoryPreview story={activeStory} variant={activeVariant} />
          <StoryDocs story={activeStory} variant={activeVariant} />
        </div>
      </section>
    </main>
  );
}

function readHashSelection(stories: readonly StoryRecord[]) {
  const fallbackStory = stories[0]?.id ?? '';
  if (typeof window === 'undefined') {
    return { storyId: fallbackStory, variantId: undefined };
  }

  const [storyId, variantId] = window.location.hash.replace(/^#/, '').split('/');
  const story = stories.find((item) => item.id === storyId) ?? stories[0];
  const variant = story?.variants.find((item) => item.id === variantId);

  return {
    storyId: story?.id ?? fallbackStory,
    variantId: variant?.id
  };
}

function writeHash(storyId: string, variantId: string | undefined) {
  if (typeof window === 'undefined') return;
  const nextHash = `#${storyId}${variantId ? `/${variantId}` : ''}`;
  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, '', nextHash);
  }
}
