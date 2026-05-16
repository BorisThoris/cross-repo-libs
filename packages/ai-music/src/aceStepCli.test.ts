import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildAceStepPythonAttempts, normalizeAceStepArgs, resolveAceStepProjectRoot } from './aceStepCli.js';

describe('aceStepCli', () => {
  it('accepts the optional ace-step subcommand and injects repo root', () => {
    expect(normalizeAceStepArgs(['ace-step', '--dry-run'], 'C:/repo')).toEqual([
      '--repo-root',
      resolve('C:/repo'),
      '--dry-run'
    ]);
  });

  it('preserves an explicit repo root', () => {
    expect(normalizeAceStepArgs(['--repo-root', 'D:/game', '--dry-run'], 'C:/repo')).toEqual([
      '--repo-root',
      'D:/game',
      '--dry-run'
    ]);
  });

  it('prefers explicit and local ACE-Step project roots', () => {
    const workspaceRoot = resolve('C:/libs');
    expect(resolveAceStepProjectRoot(workspaceRoot, { ACESTEP_PROJECT_ROOT: 'D:/models/ace' })).toBe('D:/models/ace');

    const localModelRoot = resolve(workspaceRoot, 'local-models', 'ace-step-1.5');
    expect(resolveAceStepProjectRoot(workspaceRoot, {}, (path) => path === localModelRoot)).toBe(localModelRoot);
  });

  it('builds deterministic Python attempts without running Python', () => {
    const scriptPath = resolve('C:/libs/packages/ai-music/scripts/batch_ace_step.py');
    const consumerRoot = resolve('C:/game');
    const venvPython = resolve(consumerRoot, '.venv-audio/Scripts/python.exe');
    const attempts = buildAceStepPythonAttempts(
      {
        consumerRoot,
        workspaceRoot: resolve('C:/libs'),
        scriptPath,
        platform: 'win32',
        env: { ACESTEP_PYTHON: 'C:/Python/python.exe' },
        exists: (path) => path === 'C:/Python/python.exe' || path === venvPython
      },
      ['--repo-root', consumerRoot, '--dry-run']
    );

    expect(attempts.map((attempt) => attempt.cmd)).toEqual([
      'C:/Python/python.exe',
      venvPython,
      'py',
      'python3',
      'python'
    ]);
    expect(attempts[2]?.args.slice(0, 2)).toEqual(['-3', scriptPath]);
  });
});
