import type { ChangeEvent } from 'react';
import { cn } from '@/ds/lib/cn';

/** Botón «Filtrar» del DS (píldora outline de 32px). */
export function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-ds-7 min-w-ds-10 shrink-0 items-center justify-center whitespace-nowrap rounded-ds-pill border border-action bg-surface px-ds-4 text-ds-body-s font-bold leading-ds-body text-action-text transition-colors hover:bg-action-soft active:bg-action-soft-hover"
    >
      Filtrar
    </button>
  );
}

/** Botón circular para limpiar filtros. */
export function ResetFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Limpiar filtros"
      aria-label="Limpiar filtros"
      className="inline-flex h-ds-7 w-ds-7 shrink-0 items-center justify-center rounded-ds-pill text-danger transition-colors hover:bg-danger-bg"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
        <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="none" stroke="currentColor" />
        <path d="M21 8.5C21.3315 8.5 21.6494 8.63179 21.8838 8.86621C22.1182 9.10063 22.25 9.41848 22.25 9.75V11H21V9.75H8.5V11.7314L13.1338 16.3662L13.5 16.7314V22.25H16V21H17.25V22.25C17.25 22.5815 17.1182 22.8994 16.8838 23.1338C16.6494 23.3682 16.3315 23.5 16 23.5H13.5C13.1685 23.5 12.8506 23.3682 12.6162 23.1338C12.3818 22.8994 12.25 22.5815 12.25 22.25V17.25L7.61621 12.6162C7.5001 12.5001 7.40756 12.3617 7.34473 12.21C7.28201 12.0584 7.24999 11.8955 7.25 11.7314V9.75C7.25 9.41848 7.38179 9.10063 7.61621 8.86621C7.85063 8.63179 8.16848 8.5 8.5 8.5H21ZM24.75 13.1338L21.8838 16L24.75 18.8672L23.8672 19.75L21 16.8838L18.1348 19.75L17.25 18.8652L20.1162 16L17.25 13.1338L18.1338 12.25L21 15.1162L23.8662 12.25L24.75 13.1338Z" />
      </svg>
    </button>
  );
}

interface TextFieldProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  className?: string;
}

export function TextField({ value, placeholder, onChange, onEnter, className }: TextFieldProps) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
      className={cn('box-border h-ds-7 min-w-ds-menu flex-1 rounded-ds-md border bg-surface px-ds-3 text-ds-body-s leading-ds-body text-fg outline-none placeholder:text-fg-secondary hover:bg-canvas focus:border-2 focus:border-action focus:bg-action-soft', value ? 'border-fg-muted' : 'border-line', className)}
    />
  );
}
