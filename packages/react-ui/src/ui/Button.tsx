import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  children,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  type = 'button',
  variant = 'secondary',
  ...rest
}: ButtonProps) {
  const hasLabel = Boolean(children);
  const iconOnly = Boolean(icon) && !hasLabel;
  const classNames = [
    'crui-button',
    `crui-button--${variant}`,
    `crui-button--${size}`,
    fullWidth ? 'crui-button--full' : '',
    iconOnly ? 'crui-button--icon-only' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} type={type} {...rest}>
      {icon && iconPosition === 'left' ? <span className="crui-button__icon">{icon}</span> : null}
      {hasLabel ? <span className="crui-button__label">{children}</span> : null}
      {icon && iconPosition === 'right' ? <span className="crui-button__icon">{icon}</span> : null}
    </button>
  );
}
