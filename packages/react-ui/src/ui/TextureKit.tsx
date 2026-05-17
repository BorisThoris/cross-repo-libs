import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

export interface PaletteColor {
  name: string;
  value: string;
}

export interface PaletteSwatchGridProps {
  colors: readonly PaletteColor[];
  onSelectColor?: (color: PaletteColor) => void;
  selectedValue?: string;
}

export function PaletteSwatchGrid({ colors, onSelectColor, selectedValue }: PaletteSwatchGridProps) {
  return (
    <div aria-label="Color palette" className="crui-palette-grid">
      {colors.map((color) => (
        <button
          aria-label={color.name}
          aria-pressed={selectedValue === color.value}
          className="crui-palette-grid__swatch"
          key={`${color.name}-${color.value}`}
          onClick={() => onSelectColor?.(color)}
          style={{ '--crui-swatch': color.value } as CSSProperties}
          title={`${color.name} ${color.value}`}
          type="button"
        />
      ))}
    </div>
  );
}

export interface TexturePreviewTileProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  colors: readonly string[];
  material?: string;
  selected?: boolean;
  subtitle?: string;
  title: string;
}

export function TexturePreviewTile({
  className = '',
  colors,
  material,
  selected = false,
  subtitle,
  title,
  ...rest
}: TexturePreviewTileProps) {
  const gradient = colors.length > 0 ? colors.join(', ') : '#d8dee8, #f7f8fb';

  return (
    <button
      aria-pressed={selected}
      className={['crui-texture-tile', selected ? 'crui-texture-tile--selected' : '', className].filter(Boolean).join(' ')}
      type="button"
      {...rest}
    >
      <span
        aria-hidden="true"
        className="crui-texture-tile__preview"
        style={{ '--crui-texture-gradient': `linear-gradient(135deg, ${gradient})` } as CSSProperties}
      />
      <span className="crui-texture-tile__body">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
        {material ? <em>{material}</em> : null}
      </span>
    </button>
  );
}

export interface TexturePresetCardProps {
  action?: ReactNode;
  description: string;
  preview: ReactNode;
  swatches?: readonly string[];
  tags?: readonly string[];
  title: string;
}

export function TexturePresetCard({
  action,
  description,
  preview,
  swatches = [],
  tags = [],
  title
}: TexturePresetCardProps) {
  return (
    <article className="crui-texture-card">
      <div className="crui-texture-card__preview">{preview}</div>
      <div className="crui-texture-card__body">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        {tags.length > 0 ? (
          <div className="crui-texture-card__tags">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        ) : null}
        {swatches.length > 0 ? (
          <div aria-label="Preset colors" className="crui-texture-card__swatches">
            {swatches.map((swatch) => (
              <span key={swatch} style={{ '--crui-swatch': swatch } as CSSProperties} title={swatch} />
            ))}
          </div>
        ) : null}
      </div>
      {action ? <div className="crui-texture-card__action">{action}</div> : null}
    </article>
  );
}
