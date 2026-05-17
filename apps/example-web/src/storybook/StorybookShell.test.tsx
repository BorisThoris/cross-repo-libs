import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { StorybookShell } from './StorybookShell.js';
import { storyRegistry } from './storyRegistry.js';

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;

async function render(node: React.ReactNode) {
  await act(async () => {
    root = createRoot(container);
    root.render(node);
  });
}

describe('custom storybook shell', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root!.unmount();
      });
      root = null;
    }
    container.remove();
  });

  test('renders every accepted story in navigation', async () => {
    await render(<StorybookShell stories={storyRegistry} />);

    for (const story of storyRegistry) {
      expect(container.textContent).toContain(story.title);
    }
  });

  test('switches active story from navigation', async () => {
    await render(<StorybookShell stories={storyRegistry} />);

    const torchButton = Array.from(container.querySelectorAll('.storybook-nav__item')).find((button) =>
      button.textContent?.includes('Torch')
    ) as HTMLButtonElement | undefined;
    expect(torchButton).toBeTruthy();

    await act(async () => {
      torchButton!.click();
    });

    expect(container.querySelector('[data-story-preview="torch"]')).toBeTruthy();
    expect(container.textContent).toContain('portable scene prop');
  });

  test('switches variants for the active story', async () => {
    window.history.replaceState(null, '', '/#button/variants');

    await render(<StorybookShell stories={storyRegistry} />);

    const disabledVariant = Array.from(container.querySelectorAll('.variant-tabs button')).find((button) =>
      button.textContent?.includes('Disabled')
    ) as HTMLButtonElement | undefined;
    expect(disabledVariant).toBeTruthy();

    await act(async () => {
      disabledVariant!.click();
    });

    const disabledButtons = Array.from(container.querySelectorAll('.story-preview__stage button')).filter(
      (button) => (button as HTMLButtonElement).disabled
    );
    expect(disabledButtons.length).toBeGreaterThan(0);
    expect(disabledVariant!.getAttribute('aria-pressed')).toBe('true');
    expect(window.location.hash).toBe('#button/disabled');
  });

  test('marks compact stories with compact preview sizing', async () => {
    window.history.replaceState(null, '', '/#button/variants');

    await render(<StorybookShell stories={storyRegistry} />);

    const stage = container.querySelector('[data-story-preview="button"]');
    expect(stage?.getAttribute('data-preview-size')).toBe('compact');
    expect(stage?.closest('.story-preview')?.className).toContain('story-preview--compact');
  });

  test('opens directly to a hash-addressed story and variant', async () => {
    window.history.replaceState(null, '', '/#torch/cool');

    await render(<StorybookShell stories={storyRegistry} />);

    expect(container.querySelector('[data-story-preview="torch"]')).toBeTruthy();
    expect(container.textContent).toContain('Cool flame');
  });

  test('opens the showcase on AeroLiquidBackground by default', async () => {
    await render(<StorybookShell stories={storyRegistry} />);

    expect(container.querySelector('[data-story-preview="aero-liquid-background"]')).toBeTruthy();
    expect(container.textContent).toContain('Showcase Effects');
  });

  test('renders public catalog language', async () => {
    await render(<StorybookShell stories={storyRegistry} />);

    expect(container.textContent).toContain('Component Storybook');
    expect(container.textContent).toContain('component stories');
    expect(container.textContent).not.toMatch(/\b(vetted|candidate|accepted|rejected|deferred|why it passed|source provenance)\b/i);
  });
});
