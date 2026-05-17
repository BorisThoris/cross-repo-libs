import type { SVGProps } from 'react';

export type IconGlyphName =
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'check'
  | 'close'
  | 'drum'
  | 'edit'
  | 'flame'
  | 'folder'
  | 'grid'
  | 'guitar'
  | 'home'
  | 'info'
  | 'music'
  | 'paint'
  | 'palette'
  | 'play'
  | 'plus'
  | 'save'
  | 'settings'
  | 'tag'
  | 'trash';

export interface IconGlyphProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconGlyphName;
  size?: number;
  title?: string;
}

const paths: Record<IconGlyphName, string[]> = {
  'arrow-down': ['M12 5v14', 'M6 13l6 6 6-6'],
  'arrow-left': ['M19 12H5', 'M11 6l-6 6 6 6'],
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  'arrow-up': ['M12 19V5', 'M6 11l6-6 6 6'],
  check: ['M20 6 9 17l-5-5'],
  close: ['M18 6 6 18', 'M6 6l12 12'],
  drum: ['M6 8c0-2 12-2 12 0v7c0 2-12 2-12 0V8Z', 'M6 8c0 2 12 2 12 0', 'M8 17l-2 4', 'M16 17l2 4'],
  edit: ['M4 20h4l10.5-10.5-4-4L4 16v4Z', 'M13.5 6.5l4 4'],
  flame: ['M12 22c4 0 7-3 7-7 0-4-3-6-4-10-1 3-3 4-5 6-1-2-1-4 0-7-4 3-6 7-6 11 0 4 3 7 8 7Z'],
  folder: ['M3 6h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z'],
  grid: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  guitar: ['M15 5l4-4 4 4-4 4', 'M13 7l4 4-8 8a4 4 0 1 1-4-4l8-8Z', 'M6 18l2-2'],
  home: ['M3 11l9-8 9 8', 'M5 10v10h5v-6h4v6h5V10'],
  info: ['M12 17v-6', 'M12 7h.01', 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'],
  music: ['M9 18V5l10-2v13', 'M9 18a3 3 0 1 1-3-3', 'M19 16a3 3 0 1 1-3-3'],
  paint: ['M5 19c2 0 3-1 3-3 0-1 1-2 2-2h2c4 0 7-3 7-7 0-3-2-5-5-5C8 2 3 7 3 13c0 3 1 6 2 6Z', 'M7 10h.01', 'M10 7h.01', 'M14 7h.01'],
  palette: ['M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1-3.7 1.4 1.4 0 0 1 .7-2.6H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3Z', 'M7.5 11h.01', 'M9 7.5h.01', 'M14 7.5h.01'],
  play: ['M7 5v14l12-7-12-7Z'],
  plus: ['M12 5v14', 'M5 12h14'],
  save: ['M5 3h12l2 2v16H5V3Z', 'M8 3v6h8', 'M8 21v-7h8v7'],
  settings: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.4 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 3.1h5l.4-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2.1-1.5c.1-.3.1-.7.1-1Z'],
  tag: ['M4 4h7l9 9-7 7-9-9V4Z', 'M8 8h.01'],
  trash: ['M5 7h14', 'M9 7V4h6v3', 'M8 7l1 13h6l1-13']
};

export function IconGlyph({ name, size = 20, title, className, ...props }: IconGlyphProps) {
  const titleId = title ? `crui-icon-${name}-${title.replace(/\W+/g, '-').toLowerCase()}` : undefined;

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-labelledby={titleId}
      className={['crui-icon-glyph', className].filter(Boolean).join(' ')}
      fill="none"
      height={size}
      role={title ? 'img' : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {paths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}
