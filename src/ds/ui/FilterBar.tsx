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
    <div ref={ref} className="relative min-w-[168px] flex-1" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-surface px-3 text-sm',
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
        <ul id={listId} role="listbox" className="absolute left-0 top-11 z-20 max-h-60 min-w-full overflow-auto rounded-md border border-line bg-surface py-1 shadow-pop">
          {[{ label: field.placeholder, val: '' }, ...(field.options ?? []).map((o) => ({ label: o, val: o }))].map(({ label, val }) => (
            <li
              key={label}
              role="option"
              aria-selected={val === value}
              onClick={() => {
                onChange(val);
                setOpen(false);
              }}
              className={cn('cursor-pointer whitespace-nowrap px-3 py-1.5 text-sm hover:bg-action-soft', val === value ? 'font-bold text-action' : 'text-fg', !val && 'text-fg-muted')}
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
    <div className="flex flex-wrap items-center gap-2">
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
