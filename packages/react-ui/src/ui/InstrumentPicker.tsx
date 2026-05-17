import type { ReactNode } from 'react';

export interface InstrumentPickerItem {
  description?: string;
  icon?: ReactNode;
  id: string;
  label: string;
}

export interface InstrumentPickerProps {
  description?: string;
  items: readonly InstrumentPickerItem[];
  onSelect?: (item: InstrumentPickerItem) => void;
  selectedId?: string;
  title?: string;
}

export function InstrumentPicker({
  description,
  items,
  onSelect,
  selectedId,
  title = 'Choose an instrument'
}: InstrumentPickerProps) {
  return (
    <section className="crui-instrument-picker">
      <div className="crui-instrument-picker__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="crui-instrument-picker__grid">
        {items.map((item) => (
          <button
            aria-pressed={item.id === selectedId}
            className="crui-instrument-picker__item"
            key={item.id}
            onClick={() => onSelect?.(item)}
            type="button"
          >
            <span className="crui-instrument-picker__icon">{item.icon ?? item.label.slice(0, 1)}</span>
            <strong>{item.label}</strong>
            {item.description ? <span>{item.description}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
