import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildHunyuanCommand,
  buildManifest,
  buildRoomCommand,
  discoverBlenderPath,
  parseAi3dArgs,
  referenceImagePath,
  selectBackend,
  validateOptions
} from './ai3dCli.js';

describe('ai3dCli', () => {
  it('parses prop generation args and selects Hunyuan3D', () => {
    const options = parseAi3dArgs(['prop', '--prompt', 'red sci-fi button', '--out', 'button.glb'], 'C:/game');
    expect(options.command).toBe('prop');
    expect(options.prompt).toBe('red sci-fi button');
    expect(options.out).toBe(resolve('C:/game/button.glb'));
    expect(selectBackend(options.command)).toBe('hunyuan3d');
  });

  it('parses room generation args and selects procedural Blender', () => {
    const options = parseAi3dArgs(['room', '--prompt', 'small office room'], 'C:/game');
    expect(selectBackend(options.command)).toBe('blender-procedural');
    expect(buildManifest(options).dimensionsMeters).toEqual({ width: 5, depth: 4, height: 2.8 });
  });

  it('validates required inputs', () => {
    expect(() => validateOptions(parseAi3dArgs(['from-image'], 'C:/game'))).toThrow('from-image requires --image');
    expect(() => validateOptions(parseAi3dArgs(['prop'], 'C:/game'))).toThrow('prop requires --prompt');
    expect(() => validateOptions(parseAi3dArgs(['room'], 'C:/game'))).toThrow('room requires --prompt');
  });

  it('builds dry-run backend commands without running models', () => {
    const room = parseAi3dArgs(['room', '--prompt', 'office room', '--out', 'office.glb'], 'C:/game');
    const roomCommand = buildRoomCommand(room, 'C:/libs/scripts/procedural_room.py', 'blender.exe');
    expect(roomCommand.cmd).toBe('blender.exe');
    expect(roomCommand.args).toContain('--background');
    expect(roomCommand.args).toContain(resolve('C:/game/office.glb'));

    const prop = parseAi3dArgs(['prop', '--prompt', 'button', '--out', 'button.glb'], 'C:/game');
    const propCommand = buildHunyuanCommand(prop, 'C:/libs/scripts/hunyuan3d_generate.py', 'py');
    expect(propCommand.cmd).toBe('py');
    expect(propCommand.args).toContain('button');
    expect(propCommand.args).toContain(resolve('C:/game/button.glb'));
  });

  it('builds game-ready manifest defaults', () => {
    const options = parseAi3dArgs(['prop', '--prompt', 'button'], 'C:/game');
    const manifest = buildManifest(options);
    expect(manifest.backend).toBe('hunyuan3d');
    expect(manifest.files.glb).toContain('button.glb');
    expect(manifest.files.referenceImage).toContain('references\\button.png');
    expect(manifest.gameReady.units).toBe('meters');
  });

  it('uses provided images as the source image for from-image manifests', () => {
    const options = parseAi3dArgs(['from-image', '--image', 'ref.png', '--out', 'asset.glb'], 'C:/game');
    expect(referenceImagePath(options)).toBe(resolve('C:/game/ref.png'));
    expect(buildManifest(options).files.referenceImage).toBe(resolve('C:/game/ref.png'));
  });

  it('discovers Blender by priority', () => {
    expect(discoverBlenderPath({ env: { BLENDER: 'D:/Tools/blender.exe' } })).toBe('D:/Tools/blender.exe');
    expect(discoverBlenderPath({ env: {}, pathCommand: 'C:/Path/blender.exe' })).toBe('C:/Path/blender.exe');
    expect(
      discoverBlenderPath({
        env: {},
        registryPaths: ['E:/Program Files/Blender Foundation/Blender 4.3/blender.exe'],
        exists: (path) => path.includes('Blender 4.3')
      })
    ).toBe('E:/Program Files/Blender Foundation/Blender 4.3/blender.exe');
  });

  it('falls back to common Windows install paths', () => {
    const expected = 'E:\\Program Files\\Blender Foundation\\Blender 4.3\\blender.exe';
    expect(
      discoverBlenderPath({
        env: {},
        platform: 'win32',
        exists: (path) => path === expected
      })
    ).toBe(expected);
  });
});
