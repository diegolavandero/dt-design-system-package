import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { Select } from './Select';
import { FilterButton, ResetFiltersButton, TextField } from './FilterControls';

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
        if (f.type === 'date') return <DatePicker key={f.key} placeholder={f.placeholder} value={value} onChange={set} />;
        return <Select key={f.key} placeholder={f.placeholder} options={f.options ?? []} clearable value={value} onChange={set} className="min-w-ds-menu flex-1" />;
      })}
      <FilterButton onClick={() => onApply(draft)} />
      <ResetFiltersButton onClick={reset} />
    </div>
  );
}
