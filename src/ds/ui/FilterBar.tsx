import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { DateField, FilterButton, ResetFiltersButton, TextField } from './FilterControls';

export interface FilterField {
  key: string;
  placeholder: string;
  /** `select` (por defecto), `text` o `date`. */
  type?: 'select' | 'text' | 'date';
  options?: string[];
}

interface FilterBarProps {
  fields: FilterField[];
  /** Estado aplicado (el que gobierna la vista). */
  applied: Record<string, string>;
  onApply: (values: Record<string, string>) => void;
}

function Select({ field, value, onChange }: { field: FilterField; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-ds-menu flex-1" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-ds-control w-full items-center justify-between gap-ds-2 rounded-ds-md border bg-surface px-ds-3 text-ds-body-s',
          open ? 'border-action' : 'border-line-strong hover:border-fg-subtle',
          value ? 'text-fg' : 'text-fg-secondary',
        )}
      >
        <span className="truncate">{value || field.placeholder}</span>
        <svg width="10" height="10" viewBox="0 0 32 32" aria-hidden="true" className={cn('shrink-0 transition-transform', open && 'rotate-180')}>
          <path d="M16 22L6 12l1.4-1.4L16 19.2l8.6-8.6L26 12z" fill="var(--color-fg-secondary)" />
        </svg>
      </button>
      {open && (
        <ul id={listId} role="listbox" className="absolute left-0 top-ds-8 z-ds-nav max-h-ds-list min-w-full overflow-auto rounded-ds-md border border-line bg-surface py-ds-1 shadow-ds-md">
          {[{ label: field.placeholder, val: '' }, ...(field.options ?? []).map((o) => ({ label: o, val: o }))].map(({ label, val }) => (
            <li
              key={label}
              role="option"
              aria-selected={val === value}
              onClick={() => {
                onChange(val);
                setOpen(false);
              }}
              className={cn('cursor-pointer whitespace-nowrap px-ds-3 py-ds-2 text-ds-body-s hover:bg-action-soft', val === value ? 'font-bold text-action' : 'text-fg', !val && 'text-fg-muted')}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Barra de filtros del DS: los valores se editan como borrador y solo se aplican con «Filtrar». */
export function FilterBar({ fields, applied, onApply }: FilterBarProps) {
  const [draft, setDraft] = useState<Record<string, string>>(applied);

  const reset = () => {
    const empty = Object.fromEntries(fields.map((f) => [f.key, '']));
    setDraft(empty);
    onApply(empty);
  };

  return (
    <div className="flex flex-wrap items-center gap-ds-2">
      {fields.map((f) => {
        const value = draft[f.key] ?? '';
        const set = (v: string) => setDraft((d) => ({ ...d, [f.key]: v }));
        if (f.type === 'text') return <TextField key={f.key} placeholder={f.placeholder} value={value} onChange={set} onEnter={() => onApply(draft)} />;
        if (f.type === 'date') return <DateField key={f.key} placeholder={f.placeholder} value={value} onChange={set} />;
        return <Select key={f.key} field={f} value={value} onChange={set} />;
      })}
      <FilterButton onClick={() => onApply(draft)} />
      <ResetFiltersButton onClick={reset} />
    </div>
  );
}
