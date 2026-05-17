import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface LibraryCardMeta {
  label: string;
  value: ReactNode;
}

export interface LibraryCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  actions?: ReactNode;
  description?: string;
  meta?: readonly LibraryCardMeta[];
  selected?: boolean;
  title: string;
}

export function LibraryCard({
  actions,
  className = '',
  description,
  disabled,
  meta = [],
  onClick,
  selected = false,
  title,
  type = 'button',
  ...rest
}: LibraryCardProps) {
  const interactive = Boolean(onClick) && !disabled;

  return (
    <button
      aria-pressed={interactive ? selected : undefined}
      className={[
        'crui-library-card',
        interactive ? 'crui-library-card--interactive' : '',
        selected ? 'crui-library-card--selected' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      <span className="crui-library-card__top">
        <span className="crui-library-card__title">{title}</span>
        {actions ? <span className="crui-library-card__actions">{actions}</span> : null}
      </span>
      {description ? <span className="crui-library-card__description">{description}</span> : null}
      {meta.length > 0 ? (
        <span className="crui-library-card__meta">
          {meta.map((item) => (
            <span className="crui-library-card__meta-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </span>
          ))}
        </span>
      ) : null}
    </button>
  );
}
