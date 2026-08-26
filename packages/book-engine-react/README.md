# @cross-repo-libs/book-engine-react

React runtime context for packages defined with `@cross-repo-libs/book-engine-core`.

## API

- `createBookEngine(bookPackage)` creates an immutable runtime view of validated package metadata and its repository.
- `EngineProvider` mounts a `BookPackage` for a React subtree.
- `useBookEngine()` returns the complete runtime.
- `useBookPackage()` and `useBookRepository()` return typed package and repository views.
- `useOptionalBookEngine()` returns `null` outside a provider.

## Example

```tsx
import { EngineProvider, useBookRepository } from '@cross-repo-libs/book-engine-react';
import { handbookPackage, type HandbookRepository } from './handbook-package.js';

function ChapterTitle() {
  const repository = useBookRepository<HandbookRepository>();
  return <h1>{repository.chapterById(repository.defaultChapterId)?.title}</h1>;
}

export function App() {
  return (
    <EngineProvider bookPackage={handbookPackage}>
      <ChapterTitle />
    </EngineProvider>
  );
}
```

The provider does not mutate document metadata, route state, or storage. Applications decide when and how to apply the exposed work, locale, theme, routing, and storage metadata.
