import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';

export interface JsonJobFile<TJob = Record<string, unknown>> {
  jobs: TJob[];
}

export function resolveFromBase(value: string, baseDir = process.cwd()): string {
  return isAbsolute(value) ? resolve(value) : resolve(baseDir, value);
}

export function readJsonFile<T = unknown>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

export function loadJobs<TJob = Record<string, unknown>>(path: string): TJob[] {
  const parsed = readJsonFile<TJob[] | JsonJobFile<TJob>>(path);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (parsed && typeof parsed === 'object' && Array.isArray((parsed as JsonJobFile<TJob>).jobs)) {
    return (parsed as JsonJobFile<TJob>).jobs;
  }
  throw new Error(`Jobs file must be a JSON array or an object with a jobs array: ${path}`);
}

export function requireExistingPath(path: string, label = 'path'): string {
  const resolved = resolve(path);
  if (!existsSync(resolved)) {
    throw new Error(`Missing ${label}: ${resolved}`);
  }
  return resolved;
}

export function runCommand(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv; dryRun?: boolean } = {}
): SpawnSyncReturns<Buffer> | null {
  if (options.dryRun) {
    process.stdout.write([command, ...args].join(' ') + '\n');
    return null;
  }
  return spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    env: options.env ?? process.env,
    stdio: 'inherit',
    shell: false
  });
}
