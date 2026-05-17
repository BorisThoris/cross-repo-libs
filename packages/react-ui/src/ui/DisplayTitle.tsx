import { createElement, type HTMLAttributes, type ReactNode } from 'react';

export type DisplayTitleRole = 'hero' | 'screen' | 'section' | 'panel' | 'modal';
export type DisplayTitleTag = 'h1' | 'h2' | 'h3';

export interface DisplayTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: DisplayTitleTag;
  children: ReactNode;
  role?: DisplayTitleRole;
}

const defaultTag: Record<DisplayTitleRole, DisplayTitleTag> = {
  hero: 'h1',
  screen: 'h1',
  section: 'h2',
  panel: 'h3',
  modal: 'h3'
};

export function DisplayTitle({ as, children, className = '', role = 'section', ...rest }: DisplayTitleProps) {
  const Tag = as ?? defaultTag[role];

  return createElement(
    Tag,
    {
      className: ['crui-display-title', `crui-display-title--${role}`, className].filter(Boolean).join(' '),
      ...rest
    },
    children
  );
}
