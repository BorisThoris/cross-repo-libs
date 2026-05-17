import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import type { Vector3Tuple } from './Torch.js';

export interface ProjectileOrbProps {
  color?: string;
  position?: Vector3Tuple;
  scale?: number;
  speed?: number;
}

export function ProjectileOrb({ color = '#00ff88', position = [0, 0, 0], scale = 1, speed = 1 }: ProjectileOrbProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * speed;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.26;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <dodecahedronGeometry args={[0.34, 2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} roughness={0.24} />
      </mesh>
      {[0, Math.PI / 3, -Math.PI / 3].map((rotation) => (
        <mesh key={rotation} rotation={[Math.PI / 2, rotation, 0]}>
          <torusGeometry args={[0.52, 0.018, 8, 42]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.38} transparent opacity={0.58} />
        </mesh>
      ))}
      <pointLight color={color} distance={5} intensity={1.4} />
    </group>
  );
}

export interface ProjectileTrailProps {
  color?: string;
  count?: number;
  length?: number;
  position?: Vector3Tuple;
}

export function ProjectileTrail({ color = '#00ff88', count = 8, length = 1.8, position = [0, 0, 0] }: ProjectileTrailProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.04;
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: count }, (_, index) => {
        const t = index / Math.max(count - 1, 1);
        return (
          <mesh key={index} position={[0, 0, -t * length]} scale={1 - t * 0.75}>
            <sphereGeometry args={[0.16, 12, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} transparent opacity={0.62 - t * 0.44} />
          </mesh>
        );
      })}
    </group>
  );
}
