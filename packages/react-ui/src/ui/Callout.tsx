import type { HTMLAttributes, ReactNode } from 'react';

export type CalloutTone = 'neutral' | 'accent' | 'success' | 'warning';

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode;
  children: ReactNode;
  compact?: boolean;
  icon?: ReactNode;
  title?: string;
  tone?: CalloutTone;
}

export function Callout({
  action,
  children,
  className = '',
  compact = false,
  icon,
  title,
  tone = 'neutral',
  ...rest
}: CalloutProps) {
  return (
    <div
      className={[
        'crui-callout',
        `crui-callout--${tone}`,
        compact ? 'crui-callout--compact' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {icon ? <span className="crui-callout__icon" aria-hidden="true">{icon}</span> : null}
      <div className="crui-callout__body">
        {title ? <strong className="crui-callout__title">{title}</strong> : null}
        <p>{children}</p>
      </div>
      {action ? <div className="crui-callout__action">{action}</div> : null}
    </div>
  );
}
