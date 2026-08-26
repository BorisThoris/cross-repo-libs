import {
  createContext,
  type ReactNode,
  useContext,
  useMemo
} from 'react';
import {
  createBookRepository,
  type BookLocaleMetadata,
  type BookPackage,
  type BookRoutingMetadata,
  type BookStorageMetadata,
  type BookThemeMetadata,
  type BookWorkMetadata,
  type WorkScopedRepository
} from '@cross-repo-libs/book-engine-core';

export interface BookEngine<
  TRepository extends WorkScopedRepository = WorkScopedRepository
> {
  readonly bookPackage: BookPackage<TRepository>;
  readonly repository: TRepository;
  readonly locale: BookLocaleMetadata;
  readonly routing: BookRoutingMetadata;
  readonly storage: BookStorageMetadata;
  readonly storageNamespace: string;
  readonly theme: BookThemeMetadata;
  readonly work: BookWorkMetadata;
}

export function createBookEngine<TRepository extends WorkScopedRepository>(
  bookPackage: BookPackage<TRepository>
): BookEngine<TRepository> {
  return Object.freeze({
    bookPackage,
    repository: createBookRepository(bookPackage),
    locale: bookPackage.locale,
    routing: bookPackage.routing,
    storage: bookPackage.storage,
    storageNamespace: bookPackage.storage.namespace,
    theme: bookPackage.theme,
    work: bookPackage.work
  });
}

const EngineContext = createContext<BookEngine | null>(null);
EngineContext.displayName = 'BookEngineContext';

export interface EngineProviderProps<
  TRepository extends WorkScopedRepository = WorkScopedRepository
> {
  readonly bookPackage: BookPackage<TRepository>;
  readonly children: ReactNode;
}

export function EngineProvider<TRepository extends WorkScopedRepository>({
  bookPackage,
  children
}: EngineProviderProps<TRepository>) {
  const engine = useMemo(() => createBookEngine(bookPackage), [bookPackage]);

  return <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>;
}

export function useOptionalBookEngine<
  TRepository extends WorkScopedRepository = WorkScopedRepository
>(): BookEngine<TRepository> | null {
  return useContext(EngineContext) as BookEngine<TRepository> | null;
}

export function useBookEngine<
  TRepository extends WorkScopedRepository = WorkScopedRepository
>(): BookEngine<TRepository> {
  const engine = useOptionalBookEngine<TRepository>();
  if (!engine) {
    throw new Error('Book engine is unavailable outside EngineProvider');
  }
  return engine;
}

export function useBookPackage<
  TRepository extends WorkScopedRepository = WorkScopedRepository
>(): BookPackage<TRepository> {
  return useBookEngine<TRepository>().bookPackage;
}

export function useBookRepository<
  TRepository extends WorkScopedRepository = WorkScopedRepository
>(): TRepository {
  return useBookEngine<TRepository>().repository;
}

export type {
  BookLocaleMetadata,
  BookPackage,
  BookRoutingMetadata,
  BookStorageMetadata,
  BookThemeMetadata,
  BookWorkMetadata,
  WorkScopedRepository
} from '@cross-repo-libs/book-engine-core';
