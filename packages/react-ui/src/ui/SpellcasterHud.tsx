export interface EnergyCoreProps {
  canFire?: boolean;
  energy: number;
  label?: string;
  maxEnergy: number;
}

export function EnergyCore({ canFire = true, energy, label = 'Energy Core', maxEnergy }: EnergyCoreProps) {
  const percent = Math.max(0, Math.min(100, (energy / Math.max(maxEnergy, 1)) * 100));
  const state = percent < 15 ? 'critical' : percent < 30 ? 'low' : canFire ? 'ready' : 'charging';

  return (
    <div className={`crui-energy-core crui-energy-core--${state}`}>
      <div className="crui-energy-core__label">{label}</div>
      <div className="crui-energy-core__track">
        <span style={{ width: `${percent}%` }} />
        <strong>{Math.round(energy)}/{maxEnergy}</strong>
      </div>
      <div className="crui-energy-core__status">{canFire ? 'Ready' : 'Recharging'}</div>
    </div>
  );
}

export interface TimerBadgeProps {
  label?: string;
  seconds: number;
  tone?: 'neutral' | 'warning' | 'danger';
}

export function TimerBadge({ label = 'Time', seconds, tone = 'neutral' }: TimerBadgeProps) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, '0');

  return (
    <div className={`crui-timer-badge crui-timer-badge--${tone}`}>
      <span>{label}</span>
      <strong>{minutes}:{remainder}</strong>
    </div>
  );
}

export interface ScanlineOverlayProps {
  intensity?: 'subtle' | 'strong';
}

export function ScanlineOverlay({ intensity = 'subtle' }: ScanlineOverlayProps) {
  return <div aria-hidden="true" className={`crui-scanline-overlay crui-scanline-overlay--${intensity}`} />;
}
