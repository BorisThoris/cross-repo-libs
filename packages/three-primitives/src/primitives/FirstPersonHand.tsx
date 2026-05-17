import type { ReactNode } from 'react';
import type { Euler, Vector3 } from 'three';

export type Vector3Tuple = [number, number, number];

export interface HeldItemAnchorProps {
  children?: ReactNode;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
}

export function HeldItemAnchor({
  children,
  position = [0.18, 0.52, -0.16],
  rotation = [-0.45, 0.16, -0.08],
  scale = 0.46
}: HeldItemAnchorProps) {
  return (
    <group position={position} rotation={rotation as unknown as Euler} scale={scale as unknown as Vector3}>
      {children}
    </group>
  );
}

export type FirstPersonHandGesture = 'idle' | 'pointing' | 'grip';
export type FirstPersonHandSide = 'left' | 'right';

export interface FirstPersonHandProps {
  gesture?: FirstPersonHandGesture;
  handedness?: FirstPersonHandSide;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
  skinColor?: string;
  sleeveColor?: string;
}

const fingerSpread = [-0.21, -0.07, 0.07, 0.2] as const;

export function FirstPersonHand({
  gesture = 'idle',
  handedness = 'right',
  position = [0.62, -0.54, -1.2],
  rotation = [-0.28, 0.12, -0.25],
  scale = 1,
  skinColor = '#e7b98a',
  sleeveColor = '#263241'
}: FirstPersonHandProps) {
  const side = handedness === 'right' ? 1 : -1;
  const grip = gesture === 'grip';
  const pointing = gesture === 'pointing';

  return (
    <group position={position} rotation={rotation as unknown as Euler} scale={scale as unknown as Vector3}>
      <mesh position={[0, -0.28, 0]} rotation={[0.08, 0, 0.08 * side]}>
        <boxGeometry args={[0.7, 0.55, 0.28]} />
        <meshStandardMaterial color={sleeveColor} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.52, 0.5, 0.24]} />
        <meshStandardMaterial color={skinColor} roughness={0.72} />
      </mesh>
      <mesh position={[0.31 * side, 0.08, 0.02]} rotation={[0, 0, -0.8 * side]}>
        <capsuleGeometry args={[0.065, grip ? 0.26 : 0.34, 8, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.72} />
      </mesh>
      {fingerSpread.map((x, index) => {
        const isIndex = index === 1;
        const length = pointing && isIndex ? 0.56 : grip ? 0.26 : 0.42 - index * 0.02;
        const curl = grip ? -0.68 : pointing && isIndex ? 0.06 : -0.18;

        return (
          <mesh key={x} position={[x * side, 0.38, 0.02]} rotation={[curl, 0.04 * side, 0.02 * side]}>
            <capsuleGeometry args={[0.055, length, 8, 12]} />
            <meshStandardMaterial color={skinColor} roughness={0.72} />
          </mesh>
        );
      })}
    </group>
  );
}
