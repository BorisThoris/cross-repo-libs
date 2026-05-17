import { useMemo, useState } from 'react';
import { IconGlyph } from './IconGlyph.js';

export interface TagEditorProps {
  label?: string;
  maxTags?: number;
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: readonly string[];
  tags?: readonly string[];
}

const cleanTag = (value: string) => value.replace(/^#+/, '').trim();

function normalizeTags(tags: readonly string[], maxTags: number) {
  const unique = new Map<string, string>();
  for (const tag of tags) {
    const clean = cleanTag(tag);
    if (clean) unique.set(clean.toLowerCase(), clean);
  }
  return Array.from(unique.values()).slice(0, maxTags);
}

export function TagEditor({
  label = 'Tags',
  maxTags = 12,
  onChange,
  placeholder = 'Add tag',
  suggestions = [],
  tags = []
}: TagEditorProps) {
  const [inputValue, setInputValue] = useState('');
  const [liveTags, setLiveTags] = useState(() => normalizeTags(tags, maxTags));
  const suggestionList = useMemo(() => {
    const active = new Set(liveTags.map((tag) => tag.toLowerCase()));
    const query = cleanTag(inputValue).toLowerCase();
    return normalizeTags(suggestions, maxTags * 3)
      .filter((tag) => !active.has(tag.toLowerCase()))
      .filter((tag) => !query || tag.toLowerCase().includes(query))
      .slice(0, 6);
  }, [inputValue, liveTags, maxTags, suggestions]);

  const commitTags = (nextTags: readonly string[]) => {
    const normalized = normalizeTags(nextTags, maxTags);
    setLiveTags(normalized);
    onChange?.(normalized);
  };

  const addTag = (tag: string) => {
    const clean = cleanTag(tag);
    if (!clean) return;
    commitTags([...liveTags, clean]);
    setInputValue('');
  };

  return (
    <div className="crui-tag-editor">
      <label className="crui-tag-editor__label" htmlFor="crui-tag-editor-input">
        <IconGlyph name="tag" size={16} />
        {label}
      </label>
      <div className="crui-tag-editor__chips">
        {liveTags.length > 0 ? liveTags.map((tag) => (
          <span className="crui-tag-editor__chip" key={tag}>
            {tag}
            <button aria-label={`Remove ${tag}`} onClick={() => commitTags(liveTags.filter((item) => item !== tag))} type="button">
              <IconGlyph name="close" size={12} />
            </button>
          </span>
        )) : <span className="crui-tag-editor__empty">No tags yet</span>}
      </div>
      <div className="crui-tag-editor__input-row">
        <input
          id="crui-tag-editor-input"
          onChange={(event) => setInputValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              addTag(inputValue);
            }
            if (event.key === 'Backspace' && !inputValue && liveTags.length) {
              commitTags(liveTags.slice(0, -1));
            }
          }}
          placeholder={placeholder}
          value={inputValue}
        />
        <button disabled={!cleanTag(inputValue)} onClick={() => addTag(inputValue)} type="button">
          <IconGlyph name="plus" size={15} />
        </button>
      </div>
      {suggestionList.length > 0 ? (
        <div className="crui-tag-editor__suggestions" aria-label="Tag suggestions">
          {suggestionList.map((tag) => (
            <button key={tag} onClick={() => addTag(tag)} type="button">
              {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface SelectionCheckboxProps {
  ariaLabel?: string;
  checked?: boolean;
  label?: string;
  onToggle?: (checked: boolean) => void;
  title?: string;
}

export function SelectionCheckbox({
  ariaLabel,
  checked = false,
  label,
  onToggle,
  title
}: SelectionCheckboxProps) {
  return (
    <label className="crui-selection-checkbox" title={title}>
      <input
        aria-label={ariaLabel ?? label ?? title ?? 'Select item'}
        checked={checked}
        onChange={(event) => onToggle?.(event.currentTarget.checked)}
        type="checkbox"
      />
      <span aria-hidden="true">
        <IconGlyph name="check" size={14} />
      </span>
      {label ? <strong>{label}</strong> : null}
    </label>
  );
}
