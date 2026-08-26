export type BookColorScheme = 'dark' | 'light';

export interface BookWorkMetadata {
  readonly id: string;
  readonly title: string;
  readonly shortTitle?: string;
  readonly author?: string;
}

export interface BookLocaleMetadata {
  readonly activeLocale: string;
  readonly defaultLocale: string;
  readonly enabledLocales: readonly string[];
  readonly fallbackLocale?: string;
  readonly sourceLocale?: string;
}

export interface BookThemeMetadata {
  readonly id: string;
  readonly colorScheme: BookColorScheme;
  readonly backgroundColor: string;
  readonly themeColor: string;
  readonly tokens?: Readonly<Record<`--${string}`, string>>;
}

export interface BookStorageMetadata {
  readonly namespace: string;
  readonly legacyNamespaces?: readonly string[];
}

export interface StorageAdapter {
  readonly namespace: string;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface BookRouteDescriptor {
  readonly workId: string;
  readonly viewId: string;
  readonly chapterId?: string;
  readonly anchor?: string;
  readonly parameters?: Readonly<Record<string, string>>;
}

export interface BookRouteAdapter<TRoute extends BookRouteDescriptor = BookRouteDescriptor> {
  parse(input: string): TRoute | undefined;
  serialize(route: TRoute): string;
}

export interface BookRoutingMetadata {
  readonly basePath?: string;
  readonly includeWorkIdInUrls: boolean;
  readonly workQueryParameter?: string;
}

export interface WorkScopedRepository {
  readonly workId: string;
}

export interface BookPackage<
  TRepository extends WorkScopedRepository = WorkScopedRepository
> {
  readonly schemaVersion: 1;
  readonly packageId: string;
  readonly work: BookWorkMetadata;
  readonly locale: BookLocaleMetadata;
  readonly theme: BookThemeMetadata;
  readonly storage: BookStorageMetadata;
  readonly routing: BookRoutingMetadata;
  readonly repository: TRepository;
}

const ID_PATTERN = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i;
const QUERY_PARAMETER_PATTERN = /^[a-z][a-z0-9_-]*$/i;

function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function getBookPackageValidationIssues<TRepository extends WorkScopedRepository>(
  bookPackage: BookPackage<TRepository>
): readonly string[] {
  const issues: string[] = [];
  const { locale, repository, routing, storage, theme, work } = bookPackage;

  if (bookPackage.schemaVersion !== 1) {
    issues.push('schemaVersion must be 1');
  }
  if (!ID_PATTERN.test(bookPackage.packageId)) {
    issues.push(`packageId is invalid: ${bookPackage.packageId}`);
  }
  if (!ID_PATTERN.test(work.id)) {
    issues.push(`work.id is invalid: ${work.id}`);
  }
  if (!isNonEmpty(work.title)) {
    issues.push('work.title must not be empty');
  }
  if (repository.workId !== work.id) {
    issues.push(`repository work ${repository.workId} does not match package work ${work.id}`);
  }

  const enabledLocales = new Set(locale.enabledLocales);
  if (enabledLocales.size !== locale.enabledLocales.length) {
    issues.push('locale.enabledLocales must not contain duplicates');
  }
  if (!enabledLocales.has(locale.activeLocale)) {
    issues.push(`active locale ${locale.activeLocale} is not enabled`);
  }
  if (!enabledLocales.has(locale.defaultLocale)) {
    issues.push(`default locale ${locale.defaultLocale} is not enabled`);
  }
  if (locale.fallbackLocale && !enabledLocales.has(locale.fallbackLocale)) {
    issues.push(`fallback locale ${locale.fallbackLocale} is not enabled`);
  }

  if (!ID_PATTERN.test(theme.id)) {
    issues.push(`theme.id is invalid: ${theme.id}`);
  }
  if (!isNonEmpty(theme.backgroundColor)) {
    issues.push('theme.backgroundColor must not be empty');
  }
  if (!isNonEmpty(theme.themeColor)) {
    issues.push('theme.themeColor must not be empty');
  }
  for (const token of Object.keys(theme.tokens ?? {})) {
    if (!token.startsWith('--')) {
      issues.push(`theme token must start with --: ${token}`);
    }
  }

  if (!ID_PATTERN.test(storage.namespace)) {
    issues.push(`storage.namespace is invalid: ${storage.namespace}`);
  }
  const legacyNamespaces = storage.legacyNamespaces ?? [];
  if (new Set(legacyNamespaces).size !== legacyNamespaces.length) {
    issues.push('storage.legacyNamespaces must not contain duplicates');
  }
  if (legacyNamespaces.includes(storage.namespace)) {
    issues.push('storage.legacyNamespaces must not contain the active namespace');
  }
  for (const namespace of legacyNamespaces) {
    if (!ID_PATTERN.test(namespace)) {
      issues.push(`legacy storage namespace is invalid: ${namespace}`);
    }
  }

  if (routing.basePath && !routing.basePath.startsWith('/')) {
    issues.push('routing.basePath must start with /');
  }
  if (
    routing.workQueryParameter &&
    !QUERY_PARAMETER_PATTERN.test(routing.workQueryParameter)
  ) {
    issues.push(`routing.workQueryParameter is invalid: ${routing.workQueryParameter}`);
  }
  if (routing.includeWorkIdInUrls && !routing.workQueryParameter) {
    issues.push('routing.workQueryParameter is required when work IDs are included in URLs');
  }

  return issues;
}

export class BookPackageValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid book package:\n- ${issues.join('\n- ')}`);
    this.name = 'BookPackageValidationError';
    this.issues = Object.freeze([...issues]);
  }
}

export function validateBookPackage<TRepository extends WorkScopedRepository>(
  bookPackage: BookPackage<TRepository>
): void {
  const issues = getBookPackageValidationIssues(bookPackage);
  if (issues.length > 0) {
    throw new BookPackageValidationError(issues);
  }
}

export function defineBookPackage<TRepository extends WorkScopedRepository>(
  bookPackage: BookPackage<TRepository>
): BookPackage<TRepository> {
  validateBookPackage(bookPackage);
  return bookPackage;
}

export function createBookRepository<TRepository extends WorkScopedRepository>(
  bookPackage: BookPackage<TRepository>
): TRepository {
  validateBookPackage(bookPackage);
  return bookPackage.repository;
}
