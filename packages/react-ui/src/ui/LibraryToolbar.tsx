import type { InputHTMLAttributes, ReactNode } from 'react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  clearLabel?: string;
  label?: string;
  onValueChange?: (value: string) => void;
}

export function SearchInput({
  className = '',
  clearLabel = 'Clear search',
  label = 'Search',
  onValueChange,
  placeholder = 'Search...',
  value = '',
  ...rest
}: SearchInputProps) {
  const stringValue = String(value ?? '');

  return (
    <label className={['crui-search-input', className].filter(Boolean).join(' ')}>
      <span className="crui-search-input__label">{label}</span>
      <span className="crui-search-input__control">
        <span aria-hidden="true" className="crui-search-input__icon">/</span>
        <input
          aria-label={label}
          onChange={(event) => onValueChange?.(event.currentTarget.value)}
          placeholder={placeholder}
          value={stringValue}
          {...rest}
        />
        {stringValue ? (
          <button aria-label={clearLabel} onClick={() => onValueChange?.('')} type="button">
            x
          </button>
        ) : null}
      </span>
    </label>
  );
}

export interface FilterChipProps {
  children: ReactNode;
  count?: number;
  onSelectedChange?: (selected: boolean) => void;
  selected?: boolean;
}

export function FilterChip({ children, count, onSelectedChange, selected = false }: FilterChipProps) {
  return (
    <button
      aria-pressed={selected}
      className={['crui-filter-chip', selected ? 'crui-filter-chip--selected' : ''].filter(Boolean).join(' ')}
      onClick={() => onSelectedChange?.(!selected)}
      type="button"
    >
      <span>{children}</span>
      {count !== undefined ? <strong>{count}</strong> : null}
    </button>
  );
}

export interface SegmentedControlOption<T extends string = string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string = string> {
  ariaLabel: string;
  className?: string;
  onValueChange?: (value: T) => void;
  options: readonly SegmentedControlOption<T>[];
  value: T;
}

export function SegmentedControl<T extends string = string>({
  ariaLabel,
  className = '',
  onValueChange,
  options,
  value
}: SegmentedControlProps<T>) {
  return (
    <div aria-label={ariaLabel} className={['crui-segmented-control', className].filter(Boolean).join(' ')} role="group">
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          key={option.value}
          onClick={() => onValueChange?.(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export interface LibraryToolbarFilter {
  count?: number;
  label: string;
  selected?: boolean;
}

export interface LibraryToolbarProps<T extends string = string> {
  actions?: ReactNode;
  filters?: readonly LibraryToolbarFilter[];
  onFilterChange?: (label: string, selected: boolean) => void;
  onSearchChange?: (value: string) => void;
  onSegmentChange?: (value: T) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  segmentAriaLabel?: string;
  segmentOptions?: readonly SegmentedControlOption<T>[];
  segmentValue?: T;
}

export function LibraryToolbar<T extends string = string>({
  actions,
  filters = [],
  onFilterChange,
  onSearchChange,
  onSegmentChange,
  searchPlaceholder = 'Search library...',
  searchValue = '',
  segmentAriaLabel = 'Library view',
  segmentOptions = [],
  segmentValue
}: LibraryToolbarProps<T>) {
  return (
    <div className="crui-library-toolbar">
      <div className="crui-library-toolbar__main">
        <SearchInput onValueChange={onSearchChange} placeholder={searchPlaceholder} value={searchValue} />
        {segmentOptions.length > 0 && segmentValue ? (
          <SegmentedControl
            ariaLabel={segmentAriaLabel}
            onValueChange={onSegmentChange}
            options={segmentOptions}
            value={segmentValue}
          />
        ) : null}
      </div>
      {filters.length > 0 ? (
        <div aria-label="Library filters" className="crui-library-toolbar__filters">
          {filters.map((filter) => (
            <FilterChip
              count={filter.count}
              key={filter.label}
              onSelectedChange={(selected) => onFilterChange?.(filter.label, selected)}
              selected={filter.selected}
            >
              {filter.label}
            </FilterChip>
          ))}
        </div>
      ) : null}
      {actions ? <div className="crui-library-toolbar__actions">{actions}</div> : null}
    </div>
  );
}
