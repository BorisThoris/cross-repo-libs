import { createElement, type HTMLAttributes, type ReactNode } from 'react';

export type PanelVariant = 'default' | 'strong' | 'muted' | 'accent';
export type PanelPadding = 'none' | 'md' | 'lg' | 'section';

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'aside';
  children: ReactNode;
  maxViewportHeight?: boolean;
  padding?: PanelPadding;
  scrollable?: boolean;
  variant?: PanelVariant;
}

export function Panel({
  as = 'div',
  children,
  className = '',
  maxViewportHeight = false,
  padding = 'md',
  scrollable = false,
  variant = 'default',
  ...rest
}: PanelProps) {
  return createElement(
    as,
    {
      className: [
        'crui-panel',
        `crui-panel--${variant}`,
        `crui-panel--padding-${padding}`,
        maxViewportHeight ? 'crui-panel--max-height' : '',
        scrollable ? 'crui-panel--scrollable' : '',
        className
      ]
        .filter(Boolean)
        .join(' '),
      ...rest
    },
    children
  );
}
