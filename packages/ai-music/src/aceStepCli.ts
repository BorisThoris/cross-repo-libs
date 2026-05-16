import { join, resolve } from 'node:path';

export interface AceStepCliContext {
  consumerRoot: string;
  workspaceRoot: string;
  scriptPath: string;
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  exists?: (path: string) => boolean;
}

export interface CommandAttempt {
  cmd: string;
  args: string[];
}

export function normalizeAceStepArgs(rawArgs: string[], consumerRoot: string): string[] {
  const forwarded = rawArgs[0] === 'ace-step' ? rawArgs.slice(1) : rawArgs;
  return forwarded.includes('--repo-root') ? forwarded : ['--repo-root', resolve(consumerRoot), ...forwarded];
}

export function resolveAceStepProjectRoot(
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
  exists: (path: string) => boolean = () => false
): string | null {
  const explicit = env.ACESTEP_PROJECT_ROOT?.trim();
  if (explicit) {
    return explicit;
  }

  const localModelRoot = resolve(workspaceRoot, 'local-models', 'ace-step-1.5');
  if (exists(localModelRoot)) {
    return localModelRoot;
  }

  const legacySiblingRoot = resolve(workspaceRoot, '..', 'Ace-Step1.5');
  if (exists(legacySiblingRoot)) {
    return legacySiblingRoot;
  }

  return null;
}

export function buildAceStepPythonAttempts(context: AceStepCliContext, forwardedArgs: string[]): CommandAttempt[] {
  const platform = context.platform ?? process.platform;
  const env = context.env ?? process.env;
  const exists = context.exists ?? (() => false);
  const out: CommandAttempt[] = [];

  const envPython = env.ACESTEP_PYTHON?.trim();
  if (envPython && exists(envPython)) {
    out.push({ cmd: envPython, args: [context.scriptPath, ...forwardedArgs] });
  }

  const venvPython =
    platform === 'win32'
      ? join(context.consumerRoot, '.venv-audio', 'Scripts', 'python.exe')
      : join(context.consumerRoot, '.venv-audio', 'bin', 'python');
  if (exists(venvPython)) {
    out.push({ cmd: venvPython, args: [context.scriptPath, ...forwardedArgs] });
  }

  if (platform === 'win32') {
    out.push({ cmd: 'py', args: ['-3', context.scriptPath, ...forwardedArgs] });
  }

  out.push({ cmd: 'python3', args: [context.scriptPath, ...forwardedArgs] });
  out.push({ cmd: 'python', args: [context.scriptPath, ...forwardedArgs] });

  return out;
}
