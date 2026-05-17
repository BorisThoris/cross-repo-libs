import type { ReactNode } from 'react';

export interface ResourceMeterProps {
  label: string;
  max?: number;
  tone?: 'health' | 'energy' | 'neutral' | 'danger';
  value: number;
}

export function ResourceMeter({ label, max = 100, tone = 'neutral', value }: ResourceMeterProps) {
  const percent = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={['crui-resource-meter', `crui-resource-meter--${tone}`].join(' ')}>
      <div className="crui-resource-meter__label">
        <span>{label}</span>
        <strong>{value}/{max}</strong>
      </div>
      <div className="crui-resource-meter__track">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export interface InventorySlot {
  id: string;
  icon?: ReactNode;
  label: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  uses?: string;
}

export interface InventorySlotGridProps {
  items: readonly InventorySlot[];
  onSelect?: (item: InventorySlot) => void;
  selectedId?: string;
}

export function InventorySlotGrid({ items, onSelect, selectedId }: InventorySlotGridProps) {
  return (
    <div aria-label="Inventory" className="crui-inventory-grid">
      {items.map((item) => (
        <button
          aria-label={item.label}
          aria-pressed={item.id === selectedId}
          className={['crui-inventory-grid__slot', item.rarity ? `crui-inventory-grid__slot--${item.rarity}` : ''].join(' ')}
          key={item.id}
          onClick={() => onSelect?.(item)}
          type="button"
        >
          <span className="crui-inventory-grid__icon">{item.icon ?? item.label.slice(0, 1)}</span>
          <span className="crui-inventory-grid__label">{item.label}</span>
          {item.uses ? <span className="crui-inventory-grid__uses">{item.uses}</span> : null}
        </button>
      ))}
    </div>
  );
}

export interface ControlHint {
  action: string;
  key: string;
}

export interface ControlHintsProps {
  hints: readonly ControlHint[];
  title?: string;
}

export function ControlHints({ hints, title = 'Controls' }: ControlHintsProps) {
  return (
    <div className="crui-control-hints">
      <strong>{title}</strong>
      <dl>
        {hints.map((hint) => (
          <div key={`${hint.key}-${hint.action}`}>
            <dt>{hint.key}</dt>
            <dd>{hint.action}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export interface GameHudOverlayProps {
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
  className?: string;
  topLeft?: ReactNode;
  topRight?: ReactNode;
}

export function GameHudOverlay({ bottomLeft, bottomRight, className = '', topLeft, topRight }: GameHudOverlayProps) {
  return (
    <div className={['crui-game-hud', className].filter(Boolean).join(' ')}>
      <div className="crui-game-hud__corner crui-game-hud__corner--top-left">{topLeft}</div>
      <div className="crui-game-hud__corner crui-game-hud__corner--top-right">{topRight}</div>
      <div className="crui-game-hud__corner crui-game-hud__corner--bottom-left">{bottomLeft}</div>
      <div className="crui-game-hud__corner crui-game-hud__corner--bottom-right">{bottomRight}</div>
    </div>
  );
}
