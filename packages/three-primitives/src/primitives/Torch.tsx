import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, PointLight } from 'three';

export type Vector3Tuple = [number, number, number];

export interface TorchProps {
  color?: string;
  flameColor?: string;
  flicker?: boolean;
  intensity?: number;
  position?: Vector3Tuple;
  scale?: number;
}

export function Torch({
  color = '#ff6b35',
  flameColor = '#ffaa00',
  flicker = true,
  intensity = 2,
  position = [0, 0, 0],
  scale = 1
}: TorchProps) {
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (!flicker || !lightRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const flickerIntensity =
      intensity + Math.sin(elapsed * 15) * 0.3 + Math.sin(elapsed * 23) * 0.2 + Math.sin(elapsed * 7) * 0.1;
    lightRef.current.intensity = Math.max(0.1, flickerIntensity);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#7a4522" roughness={0.8} />
      </mesh>

      <mesh position={[0, 1.08, 0]}>
        <sphereGeometry args={[0.15, 12, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[0, 1.28, 0]}>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <meshStandardMaterial color={flameColor} emissive={flameColor} emissiveIntensity={0.85} transparent opacity={0.92} />
      </mesh>

      <mesh position={[0, 1.34, 0]} rotation={[0, 0, Math.PI / 8]}>
        <coneGeometry args={[0.13, 0.32, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.45} transparent opacity={0.62} />
      </mesh>

      <mesh position={[0, 1.4, 0]} rotation={[0, 0, -Math.PI / 10]}>
        <coneGeometry args={[0.16, 0.38, 8]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={0.25} transparent opacity={0.34} />
      </mesh>

      <pointLight ref={lightRef} color={color} decay={2} distance={8} intensity={intensity} position={[0, 1.2, 0]} />
    </group>
  );
}
