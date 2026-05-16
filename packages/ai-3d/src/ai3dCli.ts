import { dirname, resolve } from 'node:path';

export type Ai3dCommand = 'verify' | 'prop' | 'from-image' | 'room';
export type Ai3dBackend = 'hunyuan3d' | 'blender-procedural';

export interface Ai3dOptions {
  command: Ai3dCommand;
  prompt?: string;
  image?: string;
  out?: string;
  dryRun: boolean;
  backend?: Ai3dBackend;
  repoRoot: string;
}

export interface Ai3dManifest {
  kind: 'cross-ai-3d-manifest';
  prompt: string | null;
  sourceImage: string | null;
  backend: Ai3dBackend;
  files: {
    glb: string;
    manifest: string;
    referenceImage: string | null;
  };
  gameReady: {
    units: 'meters';
    origin: 'floor-center' | 'object-center';
    collider: 'box' | 'mesh';
  };
  dimensionsMeters: {
    width: number;
    depth: number;
    height: number;
  } | null;
}

export interface BuiltCommand {
  cmd: string;
  args: string[];
  cwd: string;
  env: Record<string, string>;
}

export interface BlenderDiscoveryContext {
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
  pathCommand?: string | null;
  registryPaths?: string[];
  exists?: (path: string) => boolean;
}

export function parseAi3dArgs(argv: string[], repoRoot = process.cwd()): Ai3dOptions {
  const command = argv[0] as Ai3dCommand | undefined;
  if (!command || !['verify', 'prop', 'from-image', 'room'].includes(command)) {
    throw new Error('Usage: cross-ai-3d <verify|prop|from-image|room> [options]');
  }

  const options: Ai3dOptions = {
    command,
    dryRun: false,
    repoRoot: resolve(repoRoot)
  };

  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--prompt' && next) {
      options.prompt = next;
      i++;
    } else if (arg === '--image' && next) {
      options.image = resolve(options.repoRoot, next);
      i++;
    } else if (arg === '--out' && next) {
      options.out = resolve(options.repoRoot, next);
      i++;
    } else if (arg === '--backend' && next) {
      options.backend = next as Ai3dBackend;
      i++;
    } else if (arg === '--repo-root' && next) {
      options.repoRoot = resolve(next);
      i++;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

export function selectBackend(command: Ai3dCommand, requested?: Ai3dBackend): Ai3dBackend {
  if (requested) {
    return requested;
  }
  return command === 'room' ? 'blender-procedural' : 'hunyuan3d';
}

export function defaultOutPath(options: Ai3dOptions): string {
  if (options.out) {
    return options.out;
  }
  const slug = slugify(options.prompt || options.command);
  return resolve(options.repoRoot, 'local-output', 'ai-3d', `${slug}.glb`);
}

export function manifestPathFor(outPath: string): string {
  return outPath.replace(/\.glb$/i, '') + '.manifest.json';
}

export function buildManifest(options: Ai3dOptions): Ai3dManifest {
  const backend = selectBackend(options.command, options.backend);
  const out = defaultOutPath(options);
  const isRoom = options.command === 'room';
  return {
    kind: 'cross-ai-3d-manifest',
    prompt: options.prompt ?? null,
    sourceImage: options.image ?? null,
    backend,
    files: {
      glb: out,
      manifest: manifestPathFor(out),
      referenceImage: referenceImagePath(options)
    },
    gameReady: {
      units: 'meters',
      origin: isRoom ? 'floor-center' : 'object-center',
      collider: isRoom ? 'box' : 'mesh'
    },
    dimensionsMeters: isRoom ? inferRoomDimensions(options.prompt ?? '') : null
  };
}

export function referenceImagePath(options: Ai3dOptions): string | null {
  if (options.command !== 'prop' || options.image) {
    return options.image ?? null;
  }
  const slug = slugify(options.prompt || 'asset');
  return resolve(options.repoRoot, 'local-output', 'ai-3d', 'references', `${slug}.png`);
}

export function buildRoomCommand(options: Ai3dOptions, scriptPath: string, blenderPath = 'blender'): BuiltCommand {
  const out = defaultOutPath(options);
  return {
    cmd: blenderPath,
    args: [
      '--background',
      '--python',
      scriptPath,
      '--',
      '--prompt',
      options.prompt ?? 'room',
      '--out',
      out,
      '--manifest',
      manifestPathFor(out)
    ],
    cwd: options.repoRoot,
    env: {}
  };
}

export function discoverBlenderPath(context: BlenderDiscoveryContext = {}): string | null {
  const env = context.env ?? process.env;
  const platform = context.platform ?? process.platform;
  const exists = context.exists ?? (() => false);

  const explicit = env.BLENDER?.trim();
  if (explicit) {
    return explicit;
  }

  if (context.pathCommand) {
    return context.pathCommand;
  }

  for (const registryPath of context.registryPaths ?? []) {
    if (registryPath && exists(registryPath)) {
      return registryPath;
    }
  }

  for (const candidate of defaultBlenderCandidates(platform)) {
    if (exists(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function defaultBlenderCandidates(platform: NodeJS.Platform = process.platform): string[] {
  if (platform !== 'win32') {
    return ['/usr/bin/blender', '/usr/local/bin/blender', '/opt/blender/blender'];
  }

  const versions = ['4.4', '4.3', '4.2', '4.1', '4.0', '3.6'];
  const roots = ['C:\\Program Files', 'D:\\Program Files', 'E:\\Program Files'];
  return roots.flatMap((root) =>
    versions.map((version) => `${root}\\Blender Foundation\\Blender ${version}\\blender.exe`)
  );
}

export function buildHunyuanCommand(options: Ai3dOptions, scriptPath: string, pythonPath = 'python'): BuiltCommand {
  const out = defaultOutPath(options);
  const args = [scriptPath, options.command, '--out', out, '--manifest', manifestPathFor(out)];
  if (options.prompt) {
    args.push('--prompt', options.prompt);
  }
  if (options.image) {
    args.push('--image', options.image);
  }
  return {
    cmd: pythonPath,
    args,
    cwd: options.repoRoot,
    env: {}
  };
}

export function validateOptions(options: Ai3dOptions): void {
  if (options.command === 'prop' && !options.prompt) {
    throw new Error('prop requires --prompt');
  }
  if (options.command === 'room' && !options.prompt) {
    throw new Error('room requires --prompt');
  }
  if (options.command === 'from-image' && !options.image) {
    throw new Error('from-image requires --image');
  }
}

export function outputDirectory(outPath: string): string {
  return dirname(outPath);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'asset';
}

function inferRoomDimensions(prompt: string): { width: number; depth: number; height: number } {
  const lower = prompt.toLowerCase();
  if (lower.includes('large')) {
    return { width: 10, depth: 8, height: 3.2 };
  }
  if (lower.includes('small')) {
    return { width: 5, depth: 4, height: 2.8 };
  }
  return { width: 7, depth: 5, height: 3 };
}
