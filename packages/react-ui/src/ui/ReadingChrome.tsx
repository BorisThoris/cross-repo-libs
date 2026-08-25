import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ProgressHTMLAttributes,
  ReactNode
} from 'react';

export interface ReadingProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  formatValue?: (value: number, max: number) => ReactNode;
  label: string;
  max?: number;
  progressProps?: Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'aria-label' | 'max' | 'value'>;
  value: number;
}

export function ReadingProgress({
  className = '',
  formatValue,
  label,
  max = 100,
  progressProps,
  value,
  ...rest
}: ReadingProgressProps) {
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 100;
  const normalizedValue = Number.isFinite(value) ? Math.min(normalizedMax, Math.max(0, value)) : 0;
  const formattedValue = formatValue
    ? formatValue(normalizedValue, normalizedMax)
    : `${Math.round((normalizedValue / normalizedMax) * 100)}%`;
  const progressClassName = ['crui-reading-progress__bar', progressProps?.className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={['crui-reading-progress', className].filter(Boolean).join(' ')} {...rest}>
      <div className="crui-reading-progress__summary">
        <span className="crui-reading-progress__label">{label}</span>
        <span className="crui-reading-progress__value">{formattedValue}</span>
      </div>
      <progress
        {...progressProps}
        aria-label={label}
        className={progressClassName}
        max={normalizedMax}
        value={normalizedValue}
      />
    </div>
  );
}

export type CompactToolbarElement = 'div' | 'header' | 'nav';
export type CompactToolbarPosition = 'static' | 'sticky' | 'fixed';

export interface CompactToolbarProps extends HTMLAttributes<HTMLElement> {
  as?: CompactToolbarElement;
  center?: ReactNode;
  leading?: ReactNode;
  position?: CompactToolbarPosition;
  trailing?: ReactNode;
  translateY?: string;
}

export function CompactToolbar({
  as: Tag = 'header',
  center,
  children,
  className = '',
  leading,
  position = 'static',
  style,
  trailing,
  translateY,
  ...rest
}: CompactToolbarProps) {
  const toolbarStyle =
    translateY === undefined
      ? style
      : ({ '--crui-compact-toolbar-translate-y': translateY, ...(style ?? {}) } as CSSProperties);

  return (
    <Tag
      className={['crui-compact-toolbar', `crui-compact-toolbar--${position}`, className]
        .filter(Boolean)
        .join(' ')}
      style={toolbarStyle}
      {...rest}
    >
      <div className="crui-compact-toolbar__leading">{leading}</div>
      <div className="crui-compact-toolbar__center">{center ?? children}</div>
      <div className="crui-compact-toolbar__trailing">{trailing}</div>
    </Tag>
  );
}

export interface BookmarkButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'aria-pressed'> {
  active?: boolean;
  activeLabel: string;
  icon?: ReactNode;
  inactiveLabel: string;
}

export function BookmarkButton({
  active = false,
  activeLabel,
  children,
  className = '',
  icon,
  inactiveLabel,
  type = 'button',
  ...rest
}: BookmarkButtonProps) {
  return (
    <button
      {...rest}
      aria-label={active ? activeLabel : inactiveLabel}
      aria-pressed={active}
      className={[
        'crui-bookmark-button',
        active ? 'crui-bookmark-button--active' : '',
        children ? 'crui-bookmark-button--with-label' : '',
        className
      ]
        .filter(Boolean)
        .join(' ')}
      type={type}
    >
      <span aria-hidden="true" className="crui-bookmark-button__icon">
        {icon ?? (
          <svg focusable="false" viewBox="0 0 24 24">
            <path d="M6.75 3.75h10.5v16.5L12 17.1l-5.25 3.15V3.75Z" />
          </svg>
        )}
      </span>
      {children ? <span className="crui-bookmark-button__label">{children}</span> : null}
    </button>
  );
}
