import { resolve } from 'node:path';

export const resolutionPresets = {
  card: '1024x1024',
  'card-square': '1024x1024',
  square: '1024x1024',
  'square-1k': '1024x1024',
  'card-plane': '1024x1536',
  'card-plane-hq': '1024x1536',
  'menu-wide': '1536x1024',
  wide: '1536x1024',
  default: '1536x1024',
  landscape: '1536x1024',
  portrait: '1024x1536'
} as const;

export type ImageSubcommand = 'openai' | 'sdxl-card-backs' | 'sdxl-face-panels' | null;

export function resolveResolutionArg(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (/^\d+x\d+$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return resolutionPresets[trimmed.toLowerCase() as keyof typeof resolutionPresets] ?? null;
}

export function normalizeOpenAiArgs(rawArgs: string[]): string[] {
  return rawArgs[0] === 'openai' ? rawArgs.slice(1) : rawArgs;
}

export function resolveImageSubcommand(rawArgs: string[]): ImageSubcommand {
  const first = rawArgs[0];
  return first === 'openai' || first === 'sdxl-card-backs' || first === 'sdxl-face-panels' ? first : null;
}

export function pythonScriptForSubcommand(subcommand: ImageSubcommand): string | null {
  if (subcommand === 'sdxl-card-backs') {
    return 'batch_local_card_backs.py';
  }
  if (subcommand === 'sdxl-face-panels') {
    return 'batch_local_face_panels.py';
  }
  return null;
}

export function normalizePythonArgs(rawArgs: string[], repoRoot: string): string[] {
  return rawArgs.includes('--repo-root') ? rawArgs : ['--repo-root', resolve(repoRoot), ...rawArgs];
}
