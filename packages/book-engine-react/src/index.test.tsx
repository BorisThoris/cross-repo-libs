import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  defineBookPackage,
  type BookPackage
} from '@cross-repo-libs/book-engine-core';
import {
  createBookEngine,
  EngineProvider,
  useBookEngine,
  useBookPackage,
  useBookRepository,
  useOptionalBookEngine
} from './index.js';

interface FixtureRepository {
  readonly workId: string;
  readonly defaultChapterId: string;
}

const fixturePackage: BookPackage<FixtureRepository> = defineBookPackage({
  schemaVersion: 1,
  packageId: 'fixture.react-book',
  work: {
    id: 'book.react_fixture',
    title: 'React Fixture'
  },
  locale: {
    activeLocale: 'en-US',
    defaultLocale: 'en-US',
    enabledLocales: ['en-US']
  },
  theme: {
    id: 'fixture-dark',
    colorScheme: 'dark',
    backgroundColor: '#101713',
    themeColor: '#d5a84b'
  },
  storage: {
    namespace: 'fixture.react-book'
  },
  routing: {
    includeWorkIdInUrls: false
  },
  repository: {
    workId: 'book.react_fixture',
    defaultChapterId: 'book.react_fixture.ch01'
  }
});

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('book engine React runtime', () => {
  it('creates an immutable runtime exposing package metadata', () => {
    const engine = createBookEngine(fixturePackage);

    expect(Object.isFrozen(engine)).toBe(true);
    expect(engine.repository).toBe(fixturePackage.repository);
    expect(engine.storageNamespace).toBe('fixture.react-book');
    expect(engine.theme.id).toBe('fixture-dark');
  });

  it('provides typed engine, package, and repository hooks', async () => {
    function Probe() {
      const engine = useBookEngine<FixtureRepository>();
      const bookPackage = useBookPackage<FixtureRepository>();
      const repository = useBookRepository<FixtureRepository>();

      return (
        <output
          data-locale={engine.locale.activeLocale}
          data-package={bookPackage.packageId}
          data-storage={engine.storageNamespace}
          data-theme={engine.theme.id}
        >
          {repository.defaultChapterId}
        </output>
      );
    }

    await act(async () => {
      root.render(
        <EngineProvider bookPackage={fixturePackage}>
          <Probe />
        </EngineProvider>
      );
    });

    const output = container.querySelector('output');
    expect(output?.textContent).toBe('book.react_fixture.ch01');
    expect(output?.dataset).toMatchObject({
      locale: 'en-US',
      package: 'fixture.react-book',
      storage: 'fixture.react-book',
      theme: 'fixture-dark'
    });
  });

  it('supports optional consumers outside a provider', async () => {
    function OptionalProbe() {
      return <span>{useOptionalBookEngine() ? 'mounted' : 'unmounted'}</span>;
    }

    await act(async () => root.render(<OptionalProbe />));

    expect(container.textContent).toBe('unmounted');
  });
});
