import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface EmptyStateProps {
  action?: ReactNode;
  className?: string;
  helpLink?: AnchorHTMLAttributes<HTMLAnchorElement> & { label: string };
  icon?: ReactNode;
  message: string;
  title?: string;
}

export function EmptyState({ action, className = '', helpLink, icon, message, title }: EmptyStateProps) {
  return (
    <div className={['crui-empty', className].filter(Boolean).join(' ')}>
      {icon ? <div className="crui-empty__icon" aria-hidden="true">{icon}</div> : null}
      {title ? <h3 className="crui-empty__title">{title}</h3> : null}
      <p className="crui-empty__message">{message}</p>
      {action ? <div className="crui-empty__action">{action}</div> : null}
      {helpLink?.href ? (
        <a className="crui-empty__link" target="_blank" rel="noopener noreferrer" {...helpLink}>
          {helpLink.label}
        </a>
      ) : null}
    </div>
  );
}
