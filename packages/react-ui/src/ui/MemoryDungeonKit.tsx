import type { CSSProperties, ReactNode } from 'react';

export type DungeonCardTone = 'ember' | 'rune' | 'gold' | 'frost';

export interface DungeonCardFaceProps {
  label?: string;
  revealed?: boolean;
  sigil?: 'circle' | 'diamond' | 'hex' | 'triangle';
  subtitle?: string;
  tone?: DungeonCardTone;
}

export function DungeonCardFace({
  label = '07',
  revealed = true,
  sigil = 'diamond',
  subtitle = 'Arcane memory',
  tone = 'gold'
}: DungeonCardFaceProps) {
  return (
    <article className={`crui-dungeon-card crui-dungeon-card--${tone} ${revealed ? 'crui-dungeon-card--revealed' : 'crui-dungeon-card--hidden'}`}>
      <div className="crui-dungeon-card__rim" aria-hidden="true" />
      <div className="crui-dungeon-card__face">
        <span className={`crui-dungeon-card__sigil crui-dungeon-card__sigil--${sigil}`} aria-hidden="true" />
        <strong>{revealed ? label : '?'}</strong>
        <small>{revealed ? subtitle : 'Hidden pair'}</small>
      </div>
    </article>
  );
}

export type RelicRarity = 'common' | 'uncommon' | 'rare';

export interface RelicChoice {
  id: string;
  archetype?: string;
  description: string;
  impact: string;
  rarity?: RelicRarity;
  title: string;
}

export interface RelicChoiceGridProps {
  choices: readonly RelicChoice[];
  onPick?: (choice: RelicChoice) => void;
  title?: string;
}

export function RelicChoiceGrid({ choices, onPick, title = 'Choose a relic' }: RelicChoiceGridProps) {
  return (
    <section className="crui-relic-grid" aria-label={title}>
      <header className="crui-relic-grid__header">
        <span>Relic Draft</span>
        <strong>{title}</strong>
      </header>
      <div className="crui-relic-grid__choices">
        {choices.map((choice, index) => (
          <button
            className={`crui-relic-card crui-relic-card--${choice.rarity ?? 'common'}`}
            key={choice.id}
            onClick={() => onPick?.(choice)}
            style={{ '--crui-relic-delay': index } as CSSProperties}
            type="button"
          >
            <span className="crui-relic-card__runes" aria-hidden="true" />
            <span className="crui-relic-card__rarity">{choice.rarity ?? 'common'}</span>
            <strong>{choice.title}</strong>
            <em>{choice.archetype ?? 'Memory'}</em>
            <p>{choice.description}</p>
            <small>{choice.impact}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export interface MemoryHudMetric {
  label: string;
  value: ReactNode;
  detail?: string;
}

export interface MemoryHudStripProps {
  floor?: number;
  lives?: number;
  metrics?: readonly MemoryHudMetric[];
  mode?: string;
  score?: string;
}

export function MemoryHudStrip({
  floor = 7,
  lives = 3,
  metrics = [
    { label: 'Shards', value: 12, detail: 'Guards 2' },
    { label: 'Chain', value: 'x4', detail: 'Perfect memory' }
  ],
  mode = 'Classic Dungeon',
  score = '18,420'
}: MemoryHudStripProps) {
  return (
    <header className="crui-memory-hud" aria-label="Memory dungeon HUD">
      <div className="crui-memory-hud__floor">
        <span>Floor</span>
        <strong>{floor}</strong>
      </div>
      <div className="crui-memory-hud__core">
        <span>{mode}</span>
        <strong>{score}</strong>
      </div>
      <div className="crui-memory-hud__lives" aria-label={`${lives} lives`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span className={index < lives ? 'crui-memory-hud__heart--active' : 'crui-memory-hud__heart'} key={index}>
            ♥
          </span>
        ))}
      </div>
      <div className="crui-memory-hud__metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            {metric.detail ? <small>{metric.detail}</small> : null}
          </div>
        ))}
      </div>
    </header>
  );
}
