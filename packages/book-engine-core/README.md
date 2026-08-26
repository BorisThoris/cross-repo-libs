# @cross-repo-libs/book-engine-core

Dependency-free contracts and invariant validation for applications that host one or more books.

The package owns package-level metadata and repository mounting. It does not prescribe content schemas, route parsing, persistence technology, or UI.

## API

- `defineBookPackage(bookPackage)` validates and preserves a typed package descriptor.
- `createBookRepository(bookPackage)` validates the package boundary and returns its work-scoped repository.
- `validateBookPackage(bookPackage)` throws `BookPackageValidationError` with all detected invariant failures.
- `getBookPackageValidationIssues(bookPackage)` returns validation issues without throwing.
- `BookPackage`, `WorkScopedRepository`, metadata, storage, theme, and route contracts are exported as TypeScript types.

## Example

```ts
import {
  createBookRepository,
  defineBookPackage
} from '@cross-repo-libs/book-engine-core';

const bookPackage = defineBookPackage({
  schemaVersion: 1,
  packageId: 'example.handbook',
  work: {
    id: 'book.example_handbook',
    title: 'Example Handbook'
  },
  locale: {
    activeLocale: 'en-US',
    defaultLocale: 'en-US',
    enabledLocales: ['en-US']
  },
  theme: {
    id: 'paper',
    colorScheme: 'light',
    backgroundColor: '#f5f0e5',
    themeColor: '#234c43'
  },
  storage: {
    namespace: 'example.handbook'
  },
  routing: {
    includeWorkIdInUrls: true,
    workQueryParameter: 'work'
  },
  repository: {
    workId: 'book.example_handbook',
    chapters: []
  }
});

const repository = createBookRepository(bookPackage);
```

Repositories remain application-defined. The only required repository field is `workId`, which must match `bookPackage.work.id`.
