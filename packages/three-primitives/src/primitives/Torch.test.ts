import { describe, expect, test } from 'vitest';
import { Brazier } from './Brazier.js';
import {
  Barrel,
  Bridge,
  Candle,
  Chain,
  DungeonAltar,
  Fence,
  ItemOrb,
  MetalGate,
  ParticleField,
  Pillar,
  Spikes,
  Statue,
  Table,
  TreasureChest,
  Web
} from './DungeonProps.js';
import { FirstPersonHand, HeldItemAnchor } from './FirstPersonHand.js';
import { ProjectileOrb, ProjectileTrail } from './ProjectileEffects.js';
import { Door, Lever, PressurePlate } from './SceneControls.js';
import { Torch } from './Torch.js';

describe('three primitives', () => {
  test('exports React components for R3F scenes', () => {
    expect(typeof Torch).toBe('function');
    expect(typeof Brazier).toBe('function');
    expect(typeof FirstPersonHand).toBe('function');
    expect(typeof HeldItemAnchor).toBe('function');
    expect(typeof Door).toBe('function');
    expect(typeof Lever).toBe('function');
    expect(typeof PressurePlate).toBe('function');
    expect(typeof Candle).toBe('function');
    expect(typeof TreasureChest).toBe('function');
    expect(typeof DungeonAltar).toBe('function');
    expect(typeof Statue).toBe('function');
    expect(typeof Chain).toBe('function');
    expect(typeof Web).toBe('function');
    expect(typeof Spikes).toBe('function');
    expect(typeof ParticleField).toBe('function');
    expect(typeof Table).toBe('function');
    expect(typeof Barrel).toBe('function');
    expect(typeof Pillar).toBe('function');
    expect(typeof Fence).toBe('function');
    expect(typeof Bridge).toBe('function');
    expect(typeof MetalGate).toBe('function');
    expect(typeof ItemOrb).toBe('function');
    expect(typeof ProjectileOrb).toBe('function');
    expect(typeof ProjectileTrail).toBe('function');
  });
});
