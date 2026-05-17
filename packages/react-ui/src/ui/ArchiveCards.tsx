import type { ReactNode } from 'react';

export interface PreviewCardMeta {
  label: string;
  value: ReactNode;
}

export interface PreviewCardProps {
  action?: ReactNode;
  description?: string;
  imageAlt?: string;
  imageUrl?: string;
  meta?: readonly PreviewCardMeta[];
  title: string;
}

export function PreviewCard({ action, description, imageAlt, imageUrl, meta = [], title }: PreviewCardProps) {
  return (
    <article className="crui-preview-card">
      <div className="crui-preview-card__media">
        {imageUrl ? <img alt={imageAlt ?? title} src={imageUrl} /> : <span aria-hidden="true">{title.slice(0, 1)}</span>}
      </div>
      <div className="crui-preview-card__body">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        {meta.length > 0 ? (
          <dl>
            {meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {action ? <div className="crui-preview-card__action">{action}</div> : null}
    </article>
  );
}

export interface FlipTileProps {
  back: ReactNode;
  disabled?: boolean;
  flipped?: boolean;
  front: ReactNode;
  label: string;
  onClick?: () => void;
}

export function FlipTile({ back, disabled = false, flipped = false, front, label, onClick }: FlipTileProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={flipped}
      className={[
        'crui-flip-tile',
        flipped ? 'crui-flip-tile--flipped' : '',
        disabled ? 'crui-flip-tile--disabled' : ''
      ].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="crui-flip-tile__inner">
        <span className="crui-flip-tile__face crui-flip-tile__face--front">{front}</span>
        <span className="crui-flip-tile__face crui-flip-tile__face--back">{back}</span>
      </span>
    </button>
  );
}
