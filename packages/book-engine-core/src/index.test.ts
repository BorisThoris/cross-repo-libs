import { describe, expect, it } from 'vitest';
import {
  BookPackageValidationError,
  createBookRepository,
  defineBookPackage,
  getBookPackageValidationIssues,
  type BookPackage
} from './index.js';

interface FixtureRepository {
  readonly workId: string;
  readonly chapterIds: readonly string[];
  readonly marker: string;
}

function createFixturePackage(): BookPackage<FixtureRepository> {
  return {
    schemaVersion: 1,
    packageId: 'fixture.first-book',
    work: {
      id: 'book.fixture_first',
      title: 'Fixture First'
    },
    locale: {
      activeLocale: 'en-US',
      defaultLocale: 'en-US',
      enabledLocales: ['en-US'],
      fallbackLocale: 'en-US',
      sourceLocale: 'en-US'
    },
    theme: {
      id: 'fixture-light',
      colorScheme: 'light',
      backgroundColor: '#f4f0e6',
      themeColor: '#1c4b43',
      tokens: {
        '--book-accent': '#1c4b43'
      }
    },
    storage: {
      namespace: 'fixture.first-book'
    },
    routing: {
      basePath: '/books',
      includeWorkIdInUrls: true,
      workQueryParameter: 'work'
    },
    repository: {
      workId: 'book.fixture_first',
      chapterIds: ['book.fixture_first.ch01'],
      marker: 'first-package'
    }
  };
}

describe('book package boundary', () => {
  it('defines a valid package and returns its repository by identity', () => {
    const bookPackage = defineBookPackage(createFixturePackage());

    expect(createBookRepository(bookPackage)).toBe(bookPackage.repository);
    expect(bookPackage.repository.marker).toBe('first-package');
  });

  it('assembles a synthetic second package without core changes', () => {
    const first = createFixturePackage();
    const secondRepository = {
      workId: 'book.fixture_second',
      chapterIds: ['book.fixture_second.ch01'],
      marker: 'second-package'
    } as const;
    const second = defineBookPackage({
      ...first,
      packageId: 'fixture.second-book',
      work: {
        id: secondRepository.workId,
        title: 'Fixture Second'
      },
      storage: {
        namespace: 'fixture.second-book',
        legacyNamespaces: ['fixture.second-book-v0']
      },
      repository: secondRepository
    });

    expect(createBookRepository(second)).toBe(secondRepository);
    expect(second.theme).toBe(first.theme);
  });

  it('reports all package-level invariant failures', () => {
    const valid = createFixturePackage();
    const invalid: BookPackage<FixtureRepository> = {
      ...valid,
      locale: {
        ...valid.locale,
        activeLocale: 'fr-FR',
        enabledLocales: ['en-US', 'en-US']
      },
      repository: {
        ...valid.repository,
        workId: 'book.wrong'
      },
      routing: {
        includeWorkIdInUrls: true
      },
      storage: {
        namespace: valid.storage.namespace,
        legacyNamespaces: [valid.storage.namespace]
      }
    };

    expect(getBookPackageValidationIssues(invalid)).toEqual(
      expect.arrayContaining([
        'repository work book.wrong does not match package work book.fixture_first',
        'locale.enabledLocales must not contain duplicates',
        'active locale fr-FR is not enabled',
        'storage.legacyNamespaces must not contain the active namespace',
        'routing.workQueryParameter is required when work IDs are included in URLs'
      ])
    );
    expect(() => validateThroughFactory(invalid)).toThrow(BookPackageValidationError);
  });
});

function validateThroughFactory(bookPackage: BookPackage<FixtureRepository>) {
  return createBookRepository(bookPackage);
}
