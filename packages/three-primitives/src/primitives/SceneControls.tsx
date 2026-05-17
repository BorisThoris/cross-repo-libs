import type { Euler, Vector3 } from 'three';
import type { Vector3Tuple } from './Torch.js';

export interface DoorProps {
  color?: string;
  frameColor?: string;
  open?: boolean;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  scale?: number | Vector3Tuple;
}

export function Door({
  color = '#72513b',
  frameColor = '#2f3a48',
  open = false,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}: DoorProps) {
  return (
    <group position={position} rotation={rotation as unknown as Euler} scale={scale as unknown as Vector3}>
      <mesh position={[0, 0.95, -0.04]}>
        <boxGeometry args={[1.28, 2.05, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.85} />
      </mesh>
      <group position={[-0.5, 0, 0]} rotation={[0, open ? -0.72 : 0, 0]}>
        <mesh position={[0.5, 0.95, 0.02]}>
          <boxGeometry args={[1, 1.82, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.78} />
        </mesh>
        <mesh position={[0.88, 0.95, 0.09]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#d6a85e" metalness={0.35} roughness={0.42} />
        </mesh>
      </group>
    </group>
  );
}

export interface LeverProps {
  active?: boolean;
  baseColor?: string;
  handleColor?: string;
  position?: Vector3Tuple;
  scale?: number | Vector3Tuple;
}

export function Lever({
  active = false,
  baseColor = '#475467',
  handleColor = '#bf3f3f',
  position = [0, 0, 0],
  scale = 1
}: LeverProps) {
  return (
    <group position={position} scale={scale as unknown as Vector3}>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.16, 18]} />
        <meshStandardMaterial color={baseColor} roughness={0.75} />
      </mesh>
      <group rotation={[0, 0, active ? -0.72 : 0.58]}>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.78, 10]} />
          <meshStandardMaterial color="#384250" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.12, 14, 10]} />
          <meshStandardMaterial color={handleColor} roughness={0.46} />
        </mesh>
      </group>
    </group>
  );
}

export interface PressurePlateProps {
  activeColor?: string;
  baseColor?: string;
  pressed?: boolean;
  position?: Vector3Tuple;
  scale?: number | Vector3Tuple;
}

export function PressurePlate({
  activeColor = '#2aa876',
  baseColor = '#5a6574',
  pressed = false,
  position = [0, 0, 0],
  scale = 1
}: PressurePlateProps) {
  return (
    <group position={position} scale={scale as unknown as Vector3}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1, 0.08, 0.76]} />
        <meshStandardMaterial color="#2f3a48" roughness={0.82} />
      </mesh>
      <mesh position={[0, pressed ? 0.07 : 0.13, 0]}>
        <boxGeometry args={[0.84, 0.08, 0.58]} />
        <meshStandardMaterial color={pressed ? activeColor : baseColor} roughness={0.72} />
      </mesh>
    </group>
  );
}
