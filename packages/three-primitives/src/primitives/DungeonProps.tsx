import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Group, Points } from 'three';
import type { Vector3Tuple } from './Torch.js';

export interface CandleProps {
  color?: string;
  flameColor?: string;
  isLit?: boolean;
  position?: Vector3Tuple;
  scale?: number;
}

export function Candle({
  color = '#f4ead7',
  flameColor = '#ff9d35',
  isLit = true,
  position = [0, 0, 0],
  scale = 1
}: CandleProps) {
  const flameRef = useRef<Group>(null);

  useFrame((state) => {
    if (!flameRef.current) return;
    const flicker = 0.92 + Math.sin(state.clock.elapsedTime * 11) * 0.08;
    flameRef.current.scale.setScalar(flicker);
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.44, 16]} />
        <meshStandardMaterial color={color} roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 6]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      {isLit ? (
        <group ref={flameRef} position={[0, 0.6, 0]}>
          <mesh>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={0.7} transparent opacity={0.86} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <coneGeometry args={[0.07, 0.2, 10]} />
            <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={0.78} transparent opacity={0.78} />
          </mesh>
          <pointLight color={flameColor} distance={4} intensity={0.85} position={[0, 0.05, 0]} />
        </group>
      ) : null}
    </group>
  );
}

export interface TreasureChestProps {
  color?: string;
  isOpen?: boolean;
  position?: Vector3Tuple;
  scale?: number;
  treasureColor?: string;
}

export function TreasureChest({
  color = '#7a4d2a',
  isOpen = false,
  position = [0, 0, 0],
  scale = 1,
  treasureColor = '#f5c542'
}: TreasureChestProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.95, 0.42, 0.64]} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.5, isOpen ? -0.18 : 0]} rotation={[isOpen ? -0.82 : 0, 0, 0]}>
        <boxGeometry args={[0.98, 0.14, 0.68]} />
        <meshStandardMaterial color={color} roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.52, 0.36]}>
        <boxGeometry args={[0.14, 0.16, 0.08]} />
        <meshStandardMaterial color="#d6a85e" metalness={0.25} roughness={0.36} />
      </mesh>
      {isOpen ? (
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.58, 0.13, 0.36]} />
          <meshStandardMaterial color={treasureColor} emissive={treasureColor} emissiveIntensity={0.44} roughness={0.28} />
        </mesh>
      ) : null}
    </group>
  );
}

export interface DungeonAltarProps {
  accentColor?: string;
  hasCandles?: boolean;
  position?: Vector3Tuple;
  scale?: number;
  stoneColor?: string;
}

export function DungeonAltar({
  accentColor = '#d6a85e',
  hasCandles = true,
  position = [0, 0, 0],
  scale = 1,
  stoneColor = '#746b61'
}: DungeonAltarProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[2.2, 0.32, 1.22]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <boxGeometry args={[1.72, 0.62, 0.92]} />
        <meshStandardMaterial color={stoneColor} roughness={0.88} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[2, 0.16, 1.08]} />
        <meshStandardMaterial color="#8a8177" roughness={0.84} />
      </mesh>
      {[-0.55, 0, 0.55].map((x) => (
        <mesh key={x} position={[x, 1, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.012, 8, 24]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.18} />
        </mesh>
      ))}
      {hasCandles ? (
        <>
          <Candle position={[-0.76, 1, -0.36]} scale={0.65} />
          <Candle position={[0.76, 1, -0.36]} scale={0.65} />
        </>
      ) : null}
    </group>
  );
}

export interface StatueProps {
  accentColor?: string;
  animated?: boolean;
  color?: string;
  position?: Vector3Tuple;
  scale?: number;
  type?: 'guardian' | 'mage' | 'warrior';
}

export function Statue({
  accentColor = '#8b5cf6',
  animated = false,
  color = '#b9bec7',
  position = [0, 0, 0],
  scale = 1,
  type = 'guardian'
}: StatueProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!animated || !groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.48, 0.62, 0.28, 16]} />
        <meshStandardMaterial color="#5b5149" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.24, 0.34, 1.18, 14]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.58, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      <mesh position={[-0.32, 1.08, 0]} rotation={[0, 0, 0.28]}>
        <cylinderGeometry args={[0.055, 0.06, 0.74, 10]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
      <mesh position={[0.32, 1.08, 0]} rotation={[0, 0, -0.28]}>
        <cylinderGeometry args={[0.055, 0.06, 0.74, 10]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
      {type === 'mage' ? (
        <mesh position={[-0.48, 1.34, 0]}>
          <sphereGeometry args={[0.1, 12, 8]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.38} />
        </mesh>
      ) : type === 'warrior' ? (
        <mesh position={[0.48, 1.1, 0.1]}>
          <boxGeometry args={[0.26, 0.38, 0.05]} />
          <meshStandardMaterial color={accentColor} metalness={0.2} roughness={0.42} />
        </mesh>
      ) : (
        <mesh position={[0, 1.8, 0]}>
          <torusGeometry args={[0.21, 0.022, 8, 18]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.32} />
        </mesh>
      )}
    </group>
  );
}

export interface ChainProps {
  color?: string;
  length?: number;
  links?: number;
  position?: Vector3Tuple;
  scale?: number;
  swing?: boolean;
}

export function Chain({
  color = '#8c98a8',
  length = 2.2,
  links = 8,
  position = [0, 0, 0],
  scale = 1,
  swing = true
}: ChainProps) {
  const groupRef = useRef<Group>(null);
  const linkGap = length / Math.max(links, 1);

  useFrame((state) => {
    if (!swing || !groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {Array.from({ length: links }, (_, index) => (
        <mesh key={index} position={[0, -index * linkGap, 0]} rotation={[Math.PI / 2, index % 2 ? Math.PI / 2 : 0, 0]}>
          <torusGeometry args={[0.08, 0.022, 8, 16]} />
          <meshStandardMaterial color={color} metalness={0.35} roughness={0.42} />
        </mesh>
      ))}
    </group>
  );
}

export interface WebProps {
  color?: string;
  position?: Vector3Tuple;
  scale?: number;
  size?: number;
}

export function Web({ color = '#e7edf4', position = [0, 0, 0], scale = 1, size = 1.4 }: WebProps) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]} scale={scale}>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh key={`spoke-${index}`} position={[Math.cos(angle) * size * 0.25, Math.sin(angle) * size * 0.25, 0]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.008, 0.008, size * 0.55, 5]} />
            <meshStandardMaterial color={color} transparent opacity={0.72} />
          </mesh>
        );
      })}
      {[0.2, 0.36, 0.52].map((radius) => (
        <mesh key={radius}>
          <torusGeometry args={[size * radius, 0.009, 5, 32]} />
          <meshStandardMaterial color={color} transparent opacity={0.58} />
        </mesh>
      ))}
    </group>
  );
}

export interface SpikesProps {
  active?: boolean;
  color?: string;
  count?: number;
  position?: Vector3Tuple;
  scale?: number;
}

export function Spikes({ active = true, color = '#8c98a8', count = 5, position = [0, 0, 0], scale = 1 }: SpikesProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[count * 0.28 + 0.2, 0.06, 0.44]} />
        <meshStandardMaterial color="#384250" roughness={0.82} />
      </mesh>
      {Array.from({ length: count }, (_, index) => (
        <mesh key={index} position={[(index - (count - 1) / 2) * 0.28, active ? 0.28 : 0.1, 0]}>
          <coneGeometry args={[0.1, active ? 0.5 : 0.16, 4]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.36} />
        </mesh>
      ))}
    </group>
  );
}

export interface ParticleFieldProps {
  color?: string;
  count?: number;
  radius?: number;
}

export function ParticleField({ color = '#7dd3fc', count = 80, radius = 1.5 }: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const dist = radius * Math.sqrt(index / count);
      data[index * 3] = Math.cos(angle) * dist;
      data[index * 3 + 1] = ((index % 13) / 13) * 1.4;
      data[index * 3 + 2] = Math.sin(angle) * dist;
    }
    return data;
  }, [count, radius]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.045} transparent opacity={0.82} sizeAttenuation />
    </points>
  );
}

export interface TableProps {
  color?: string;
  legColor?: string;
  position?: Vector3Tuple;
  scale?: number;
  size?: Vector3Tuple;
}

export function Table({
  color = '#7a4d2a',
  legColor = '#4a2f1c',
  position = [0, 0, 0],
  scale = 1,
  size = [1.8, 0.12, 1.1]
}: TableProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      {[
        [-0.74, -0.42],
        [0.74, -0.42],
        [-0.74, 0.42],
        [0.74, 0.42]
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.34, z]}>
          <cylinderGeometry args={[0.055, 0.065, 0.68, 10]} />
          <meshStandardMaterial color={legColor} roughness={0.76} />
        </mesh>
      ))}
    </group>
  );
}

export interface BarrelProps {
  color?: string;
  metalColor?: string;
  position?: Vector3Tuple;
  scale?: number;
}

export function Barrel({
  color = '#7a4d2a',
  metalColor = '#9aa4b2',
  position = [0, 0, 0],
  scale = 1
}: BarrelProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.36, 0.42, 0.9, 16]} />
        <meshStandardMaterial color={color} roughness={0.76} />
      </mesh>
      {[0.2, 0.48, 0.76].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.43, 0.43, 0.04, 16]} />
          <meshStandardMaterial color={metalColor} metalness={0.25} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export interface PillarProps {
  color?: string;
  height?: number;
  position?: Vector3Tuple;
  radius?: number;
  scale?: number;
}

export function Pillar({ color = '#8a8177', height = 2.4, position = [0, 0, 0], radius = 0.24, scale = 1 }: PillarProps) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 18]} />
        <meshStandardMaterial color={color} roughness={0.86} />
      </mesh>
      {[0.1, height - 0.1].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[radius * 1.28, radius * 1.28, 0.18, 18]} />
          <meshStandardMaterial color="#6f665d" roughness={0.84} />
        </mesh>
      ))}
    </group>
  );
}

export interface FenceProps {
  color?: string;
  length?: number;
  position?: Vector3Tuple;
  scale?: number;
}

export function Fence({ color = '#7a4d2a', length = 3, position = [0, 0, 0], scale = 1 }: FenceProps) {
  const posts = Math.max(2, Math.round(length / 0.65));

  return (
    <group position={position} scale={scale}>
      {Array.from({ length: posts }, (_, index) => {
        const x = (index / (posts - 1) - 0.5) * length;
        return (
          <mesh key={index} position={[x, 0.54, 0]}>
            <cylinderGeometry args={[0.055, 0.07, 1.08, 8]} />
            <meshStandardMaterial color={color} roughness={0.78} />
          </mesh>
        );
      })}
      {[0.35, 0.72].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[length, 0.1, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

export interface BridgeProps {
  color?: string;
  length?: number;
  position?: Vector3Tuple;
  scale?: number;
  width?: number;
}

export function Bridge({ color = '#7a4d2a', length = 3.6, position = [0, 0, 0], scale = 1, width = 1.2 }: BridgeProps) {
  const plankCount = 8;

  return (
    <group position={position} scale={scale}>
      {Array.from({ length: plankCount }, (_, index) => (
        <mesh key={index} position={[(index / (plankCount - 1) - 0.5) * length, 0.1, 0]}>
          <boxGeometry args={[length / plankCount * 0.82, 0.12, width]} />
          <meshStandardMaterial color={color} roughness={0.76} />
        </mesh>
      ))}
      {[-width / 2, width / 2].map((z) => (
        <mesh key={z} position={[0, 0.28, z]}>
          <boxGeometry args={[length, 0.1, 0.08]} />
          <meshStandardMaterial color="#4a2f1c" roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

export interface MetalGateProps {
  color?: string;
  height?: number;
  open?: boolean;
  position?: Vector3Tuple;
  scale?: number;
  width?: number;
}

export function MetalGate({ color = '#8c98a8', height = 2.3, open = false, position = [0, 0, 0], scale = 1, width = 2 }: MetalGateProps) {
  const bars = 7;

  return (
    <group position={position} scale={scale} rotation={[0, open ? -0.35 : 0, 0]}>
      {Array.from({ length: bars }, (_, index) => (
        <mesh key={index} position={[(index / (bars - 1) - 0.5) * width, height / 2, 0]}>
          <boxGeometry args={[0.045, height, 0.06]} />
          <meshStandardMaterial color={color} metalness={0.42} roughness={0.36} />
        </mesh>
      ))}
      {[0.18, height - 0.18].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[width + 0.18, 0.08, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.42} roughness={0.36} />
        </mesh>
      ))}
    </group>
  );
}

export type ItemOrbRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ItemOrbProps {
  position?: Vector3Tuple;
  rarity?: ItemOrbRarity;
  scale?: number;
  shape?: 'box' | 'cone' | 'orb';
}

const rarityColors: Record<ItemOrbRarity, string> = {
  common: '#f8fafc',
  uncommon: '#2aa876',
  rare: '#60a5fa',
  epic: '#a78bfa',
  legendary: '#f59e0b'
};

export function ItemOrb({ position = [0, 0, 0], rarity = 'rare', scale = 1, shape = 'orb' }: ItemOrbProps) {
  const groupRef = useRef<Group>(null);
  const color = rarityColors[rarity];

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        {shape === 'box' ? <boxGeometry args={[0.55, 0.55, 0.55]} /> : shape === 'cone' ? <coneGeometry args={[0.34, 0.72, 8]} /> : <octahedronGeometry args={[0.42]} />}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.38} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.018, 8, 28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} transparent opacity={0.58} />
      </mesh>
    </group>
  );
}
