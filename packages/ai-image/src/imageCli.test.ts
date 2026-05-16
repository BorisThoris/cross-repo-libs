import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  normalizeOpenAiArgs,
  normalizePythonArgs,
  pythonScriptForSubcommand,
  resolveImageSubcommand,
  resolveResolutionArg
} from './imageCli.js';

describe('imageCli', () => {
  it('accepts an optional openai subcommand', () => {
    expect(normalizeOpenAiArgs(['openai', '--list-resolutions'])).toEqual(['--list-resolutions']);
    expect(normalizeOpenAiArgs(['--list-resolutions'])).toEqual(['--list-resolutions']);
  });

  it('dispatches SDXL subcommands to Python scripts', () => {
    expect(resolveImageSubcommand(['sdxl-card-backs'])).toBe('sdxl-card-backs');
    expect(resolveImageSubcommand(['sdxl-face-panels'])).toBe('sdxl-face-panels');
    expect(pythonScriptForSubcommand('sdxl-card-backs')).toBe('batch_local_card_backs.py');
    expect(pythonScriptForSubcommand('sdxl-face-panels')).toBe('batch_local_face_panels.py');
  });

  it('injects repo root for Python subcommands unless explicitly provided', () => {
    expect(normalizePythonArgs(['--dry-run'], 'C:/game')).toEqual(['--repo-root', resolve('C:/game'), '--dry-run']);
    expect(normalizePythonArgs(['--repo-root', 'D:/game', '--dry-run'], 'C:/game')).toEqual([
      '--repo-root',
      'D:/game',
      '--dry-run'
    ]);
  });

  it('resolves image size presets and explicit dimensions', () => {
    expect(resolveResolutionArg('card-plane')).toBe('1024x1536');
    expect(resolveResolutionArg('menu-wide')).toBe('1536x1024');
    expect(resolveResolutionArg('2048x1024')).toBe('2048x1024');
    expect(resolveResolutionArg('not-real')).toBeNull();
  });
});
