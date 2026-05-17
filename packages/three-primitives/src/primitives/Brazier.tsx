import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, PointLight } from 'three';
import type { Vector3Tuple } from './Torch.js';

export interface BrazierProps {
  bowlColor?: string;
  flameColor?: string;
  intensity?: number;
  isLit?: boolean;
  position?: Vector3Tuple;
  scale?: number;
}

export function Brazier({
  bowlColor = '#3f3430',
  flameColor = '#ff7a32',
  intensity = 2,
  isLit = true,
  position = [0, 0, 0],
  scale = 1
}: BrazierProps) {
  const flameRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (!isLit) return;
    const elapsed = state.clock.elapsedTime;
    if (flameRef.current) {
      const flicker = Math.sin(elapsed * 8) * 0.08 + 0.94;
      flameRef.current.scale.setScalar(flicker);
      flameRef.current.rotation.z = Math.sin(elapsed * 3) * 0.05;
    }
    if (lightRef.current) {
      const flickerIntensity = intensity + Math.sin(elapsed * 12) * 0.35 + Math.sin(elapsed * 19) * 0.24;
      lightRef.current.intensity = Math.max(0.1, flickerIntensity);
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.36, 0.48, 0.42, 16]} />
        <meshStandardMaterial color={bowlColor} metalness={0.45} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.45, 0.36, 0.18, 16]} />
        <meshStandardMaterial color="#15181f" metalness={0.5} roughness={0.52} />
      </mesh>
      {[
        [-0.32, 0.02, -0.32],
        [0.32, 0.02, -0.32],
        [-0.32, 0.02, 0.32],
        [0.32, 0.02, 0.32]
      ].map((legPosition) => (
        <mesh key={legPosition.join(':')} position={legPosition as Vector3Tuple}>
          <cylinderGeometry args={[0.045, 0.055, 0.34, 8]} />
          <meshStandardMaterial color={bowlColor} metalness={0.42} roughness={0.5} />
        </mesh>
      ))}

      {isLit ? (
        <group ref={flameRef} position={[0, 0.82, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 10, 8]} />
            <meshStandardMaterial color="#ffd36b" emissive="#ffd36b" emissiveIntensity={0.8} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <coneGeometry args={[0.1, 0.34, 8]} />
            <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={0.65} transparent opacity={0.78} />
          </mesh>
          <mesh position={[0, 0.26, 0]} rotation={[0, 0, Math.PI / 10]}>
            <coneGeometry args={[0.16, 0.45, 8]} />
            <meshStandardMaterial color="#ff3f1f" emissive="#ff3f1f" emissiveIntensity={0.35} transparent opacity={0.42} />
          </mesh>
          <pointLight ref={lightRef} color={flameColor} decay={2} distance={9} intensity={intensity} position={[0, 0.12, 0]} />
        </group>
      ) : null}
    </group>
  );
}
