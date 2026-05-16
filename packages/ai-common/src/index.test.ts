import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadJobs, requireExistingPath, resolveFromBase, runCommand } from './index.js';

describe('ai-common', () => {
  it('loads jobs from array and object shapes', () => {
    const dir = join(process.cwd(), 'tmp', 'ai-common-tests');
    mkdirSync(dir, { recursive: true });
    const arrayPath = join(dir, 'array.json');
    const objectPath = join(dir, 'object.json');
    writeFileSync(arrayPath, JSON.stringify([{ id: 'a' }]), 'utf8');
    writeFileSync(objectPath, JSON.stringify({ jobs: [{ id: 'b' }] }), 'utf8');

    expect(loadJobs<{ id: string }>(arrayPath)).toEqual([{ id: 'a' }]);
    expect(loadJobs<{ id: string }>(objectPath)).toEqual([{ id: 'b' }]);
  });

  it('resolves relative paths against a base directory', () => {
    expect(resolveFromBase('file.txt', 'C:/work')).toBe('C:\\work\\file.txt');
  });

  it('validates existing paths and supports dry-run commands', () => {
    expect(requireExistingPath(process.cwd(), 'cwd')).toBe(process.cwd());
    expect(runCommand('node', ['--version'], { dryRun: true })).toBeNull();
  });
});
