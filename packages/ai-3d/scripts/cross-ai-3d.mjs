#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDir, '..');
const workspaceRoot = resolve(packageRoot, '..', '..');
const repoRoot = process.env.CROSS_AI_REPO_ROOT?.trim() ? resolve(process.env.CROSS_AI_REPO_ROOT) : process.cwd();

function parseArgs(argv) {
    const command = argv[0];
    if (!['verify', 'prop', 'from-image', 'room'].includes(command)) {
        throw new Error('Usage: cross-ai-3d <verify|prop|from-image|room> [--prompt text] [--image path] [--out path] [--dry-run]');
    }

    const options = { command, repoRoot, dryRun: false };
    for (let i = 1; i < argv.length; i++) {
        const arg = argv[i];
        const next = argv[i + 1];
        if (arg === '--prompt' && next) {
            options.prompt = next;
            i++;
        } else if (arg === '--image' && next) {
            options.image = resolve(repoRoot, next);
            i++;
        } else if (arg === '--out' && next) {
            options.out = resolve(repoRoot, next);
            i++;
        } else if (arg === '--dry-run') {
            options.dryRun = true;
        }
    }
    return options;
}

function slugify(value) {
    return (
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 64) || 'asset'
    );
}

function outPath(options) {
    return options.out ?? resolve(options.repoRoot, 'local-output', 'ai-3d', `${slugify(options.prompt || options.command)}.glb`);
}

function manifestPath(glbPath) {
    return glbPath.replace(/\.glb$/i, '') + '.manifest.json';
}

function backendFor(command) {
    return command === 'room' ? 'blender-procedural' : 'hunyuan3d';
}

function roomDimensions(prompt = '') {
    const lower = prompt.toLowerCase();
    if (lower.includes('large')) return { width: 10, depth: 8, height: 3.2 };
    if (lower.includes('small')) return { width: 5, depth: 4, height: 2.8 };
    return { width: 7, depth: 5, height: 3 };
}

function manifestFor(options) {
    const glb = outPath(options);
    const isRoom = options.command === 'room';
    const referenceImage = referenceImagePath(options);
    return {
        kind: 'cross-ai-3d-manifest',
        prompt: options.prompt ?? null,
        sourceImage: options.image ?? null,
        backend: backendFor(options.command),
        files: { glb, manifest: manifestPath(glb), referenceImage },
        gameReady: {
            units: 'meters',
            origin: isRoom ? 'floor-center' : 'object-center',
            collider: isRoom ? 'box' : 'mesh'
        },
        dimensionsMeters: isRoom ? roomDimensions(options.prompt ?? '') : null
    };
}

function validate(options) {
    if (options.command === 'prop' && !options.prompt) throw new Error('prop requires --prompt');
    if (options.command === 'room' && !options.prompt) throw new Error('room requires --prompt');
    if (options.command === 'from-image' && !options.image) throw new Error('from-image requires --image');
}

function commandExists(command) {
    const probe = process.platform === 'win32' ? 'where.exe' : 'which';
    const result = spawnSync(probe, [command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return result.status === 0;
}

function defaultAi3dPython() {
    const explicit = process.env.AI3D_PYTHON?.trim() || process.env.PYTHON?.trim();
    if (explicit) return explicit;
    const local = resolve(workspaceRoot, '.venv-ai-3d', process.platform === 'win32' ? 'Scripts\\python.exe' : 'bin/python');
    if (existsSync(local)) return local;
    return process.platform === 'win32' ? 'py' : 'python3';
}

function defaultHunyuanRoot() {
    const explicit = process.env.HUNYUAN3D_ROOT?.trim();
    if (explicit) return explicit;
    const local = resolve(workspaceRoot, 'local-models', 'hunyuan3d-2');
    return existsSync(local) ? local : '';
}

function referenceImagePath(options) {
    if (options.command !== 'prop' || options.image) return options.image ?? null;
    const slug = slugify(options.prompt || 'asset');
    return resolve(options.repoRoot, 'local-output', 'ai-3d', 'references', `${slug}.png`);
}

function runPythonCheck(python, code) {
    const args = python === 'py' ? ['-3', '-c', code] : ['-c', code];
    const result = spawnSync(python, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return {
        ok: result.status === 0,
        stdout: result.stdout.trim(),
        stderr: result.stderr.trim()
    };
}

function pythonModuleStatus(python) {
    const code = `
import importlib, json
out = {}
for name in ["hy3dgen", "hy3dgen.shapegen", "trimesh", "xatlas", "pymeshlab", "diffusers", "torch"]:
    try:
        mod = importlib.import_module(name)
        out[name] = getattr(mod, "__version__", "ok")
    except Exception as exc:
        out[name] = "MISSING: " + type(exc).__name__ + ": " + str(exc)[:120]
try:
    import torch
    out["cuda"] = bool(torch.cuda.is_available())
except Exception:
    out["cuda"] = False
print(json.dumps(out))
`;
    const check = runPythonCheck(python, code);
    if (!check.ok) return { error: check.stderr || check.stdout || 'python check failed' };
    try {
        return JSON.parse(check.stdout);
    } catch {
        return { error: check.stdout || 'invalid python check output' };
    }
}

function commandPath(command) {
    const probe = process.platform === 'win32' ? 'where.exe' : 'which';
    const result = spawnSync(probe, [command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (result.status !== 0) return null;
    return result.stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? null;
}

function registryBlenderPaths() {
    if (process.platform !== 'win32') return [];
    const script = `
$keys = @(
 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
 'HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*',
 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
)
foreach ($k in $keys) {
 Get-ItemProperty $k -ErrorAction SilentlyContinue |
  Where-Object { $_.DisplayName -match 'Blender' -or $_.InstallLocation -match 'Blender' } |
  ForEach-Object {
   if ($_.InstallLocation) {
    Join-Path $_.InstallLocation 'blender.exe'
   }
   if ($_.DisplayIcon -and $_.DisplayIcon -match 'blender\\.exe') {
    $_.DisplayIcon -replace ',\\d+$',''
   }
  }
}
`;
    const result = spawnSync('powershell', ['-NoProfile', '-Command', script], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore']
    });
    if (result.status !== 0) return [];
    return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function defaultBlenderCandidates() {
    if (process.platform !== 'win32') {
        return ['/usr/bin/blender', '/usr/local/bin/blender', '/opt/blender/blender'];
    }
    const versions = ['4.4', '4.3', '4.2', '4.1', '4.0', '3.6'];
    const roots = ['C:\\Program Files', 'D:\\Program Files', 'E:\\Program Files'];
    return roots.flatMap((root) => versions.map((version) => `${root}\\Blender Foundation\\Blender ${version}\\blender.exe`));
}

function discoverBlenderPath() {
    const explicit = process.env.BLENDER?.trim();
    if (explicit) return explicit;

    const pathHit = commandPath('blender');
    if (pathHit) return pathHit;

    for (const candidate of registryBlenderPaths()) {
        if (existsSync(candidate)) return candidate;
    }

    for (const candidate of defaultBlenderCandidates()) {
        if (existsSync(candidate)) return candidate;
    }

    return null;
}

function blenderVersion(blenderPath) {
    if (!blenderPath) return null;
    const result = spawnSync(blenderPath, ['--version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    if (result.status !== 0) return null;
    return result.stdout.split(/\r?\n/).find((line) => line.trim().startsWith('Blender '))?.trim() ?? null;
}

function verify() {
    const blender = discoverBlenderPath();
    const python = defaultAi3dPython();
    const hunyuanRoot = defaultHunyuanRoot();
    const moduleStatus = pythonModuleStatus(python);
    const checks = {
        blender: Boolean(blender),
        blenderPath: blender,
        blenderVersion: blenderVersion(blender),
        python: python === 'python' ? commandExists('python') || commandExists('py') : python === 'py' ? commandExists('py') : existsSync(python),
        pythonPath: python,
        hunyuan3dRoot: hunyuanRoot ? existsSync(hunyuanRoot) : false,
        hunyuan3dRootPath: hunyuanRoot || null,
        hunyuan3dModel: process.env.HUNYUAN3D_MODEL?.trim() || 'tencent/Hunyuan3D-2mini',
        modules: moduleStatus
    };
    console.log(JSON.stringify(checks, null, 2));
    return checks.blender || checks.python ? 0 : 1;
}

function run(options) {
    validate(options);
    const manifest = manifestFor(options);
    mkdirSync(dirname(manifest.files.manifest), { recursive: true });

    if (options.dryRun) {
        console.log(JSON.stringify({ dryRun: true, manifest }, null, 2));
        return 0;
    }

    mkdirSync(dirname(manifest.files.glb), { recursive: true });
    if (manifest.files.referenceImage) mkdirSync(dirname(manifest.files.referenceImage), { recursive: true });
    writeFileSync(manifest.files.manifest, JSON.stringify(manifest, null, 2), 'utf8');

    if (options.command === 'room') {
        const blender = discoverBlenderPath();
        if (!blender) {
            console.error('cross-ai-3d room could not find Blender. Set BLENDER to blender.exe or install Blender.');
            return 1;
        }
        const result = spawnSync(
            blender,
            [
                '--background',
                '--python',
                resolve(scriptDir, 'procedural_room.py'),
                '--',
                '--prompt',
                options.prompt,
                '--out',
                manifest.files.glb,
                '--manifest',
                manifest.files.manifest
            ],
            { cwd: options.repoRoot, stdio: 'inherit', shell: false }
        );
        if (result.error) {
            console.error(`cross-ai-3d room failed to launch Blender: ${result.error.message}`);
            return 1;
        }
        return result.status ?? 1;
    }

    const python = defaultAi3dPython();
    const env = {
        ...process.env,
        AI3D_PYTHON: python,
        HUNYUAN3D_ROOT: defaultHunyuanRoot(),
        HUNYUAN3D_MODEL: process.env.HUNYUAN3D_MODEL?.trim() || 'tencent/Hunyuan3D-2mini',
        HUNYUAN3D_SUBFOLDER: process.env.HUNYUAN3D_SUBFOLDER?.trim() || 'hunyuan3d-dit-v2-mini'
    };
    if (options.command === 'prop' && !options.image) {
        const refArgs = [resolve(scriptDir, 'generate_reference_image.py'), '--prompt', options.prompt, '--out', manifest.files.referenceImage];
        if (python === 'py') refArgs.unshift('-3');
        const refResult = spawnSync(python, refArgs, { cwd: options.repoRoot, env, stdio: 'inherit', shell: false });
        if (refResult.error) {
            console.error(`cross-ai-3d reference image generation failed to launch Python: ${refResult.error.message}`);
            return 1;
        }
        if ((refResult.status ?? 1) !== 0) return refResult.status ?? 1;
        options.image = manifest.files.referenceImage;
    }

    const args = [resolve(scriptDir, 'hunyuan3d_generate.py'), 'from-image', '--out', manifest.files.glb, '--manifest', manifest.files.manifest];
    if (python === 'py') args.unshift('-3');
    if (options.prompt) args.push('--prompt', options.prompt);
    if (options.image) args.push('--image', options.image);
    const result = spawnSync(python, args, { cwd: options.repoRoot, env, stdio: 'inherit', shell: false });
    if (result.error) {
        console.error(`cross-ai-3d Hunyuan3D backend failed to launch Python: ${result.error.message}`);
        return 1;
    }
    return result.status ?? 1;
}

try {
    const options = parseArgs(process.argv.slice(2));
    process.exit(options.command === 'verify' ? verify() : run(options));
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
