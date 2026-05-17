import type { HTMLAttributes, ReactNode } from 'react';

export type StatTileDensity = 'default' | 'compact' | 'dense' | 'minimal';

export interface StatTileProps extends HTMLAttributes<HTMLElement> {
  label: string;
  value: ReactNode;
  density?: StatTileDensity;
  valueAccent?: boolean;
  valueFirst?: boolean;
  valueLg?: boolean;
}

export function StatTile({
  className = '',
  density = 'default',
  label,
  value,
  valueAccent = false,
  valueFirst = false,
  valueLg = false,
  ...rest
}: StatTileProps) {
  return (
    <article
      className={[
        'crui-stat',
        `crui-stat--${density}`,
        valueFirst ? 'crui-stat--value-first' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <span className="crui-stat__label">{label}</span>
      <strong
        className={[
          'crui-stat__value',
          valueAccent ? 'crui-stat__value--accent' : '',
          valueLg ? 'crui-stat__value--lg' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </strong>
    </article>
  );
}
