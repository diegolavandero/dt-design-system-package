import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: (string | SelectOption)[];
  onChange: (value: string) => void;
  /** Texto cuando no hay valor. Con `clearable` es además la opción que limpia la selección. */
  placeholder?: string;
  clearable?: boolean;
  /** Etiqueta caption sobre el campo (grupo «con etiqueta» de formularios). Sin ella, el campo es el de filtros. */
  label?: string;
  /** Texto de ayuda en caption bajo el campo. */
  helper?: ReactNode;
  className?: string;
}

/** Dropdown de selección única del DS (32 px). Patrón «select-only combobox»: teclado con flechas, Inicio/Fin, Enter y Esc. */
export function Select({ value, options, onChange, placeholder = '', clearable, label, helper, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;
  const labelId = `${uid}-label`;
  const helperId = `${uid}-helper`;

  const items: SelectOption[] = [...(clearable ? [{ value: '', label: placeholder }] : []), ...options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))];
  const current = items.find((o) => o.value === value && (value !== '' || !clearable));

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const show = () => {
    setActive(Math.max(0, items.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(items[i].value);
    setOpen(false);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(items.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(items.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pick(active);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  const text = current?.label || placeholder;
  return (
    <div ref={ref} className={cn('flex flex-col gap-ds-1', className)}>
      {label && (
        <span id={labelId} className="text-ds-caption leading-ds-caption text-fg-secondary">
          {label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${label ? labelId : current?.value ? `${uid}-ph` : ''} ${uid}-value`.trim()}
          aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
          aria-describedby={helper ? helperId : undefined}
          onClick={() => (open ? setOpen(false) : show())}
          onKeyDown={onKeyDown}
          className={cn(
            'box-border flex h-ds-7 w-full items-center justify-between gap-ds-2 rounded-ds-md border px-ds-3 text-left text-ds-body-s leading-ds-body',
            open ? 'border-2 border-action bg-surface' : cn('hover:bg-canvas', current?.value ? 'border-fg-muted bg-surface' : 'border-line bg-surface'),
            current?.value ? 'text-fg' : 'text-fg-secondary',
          )}
        >
          {!label && current?.value && (
            <span id={`${uid}-ph`} className="sr-only">
              {placeholder}
            </span>
          )}
          <span id={`${uid}-value`} className="truncate">
            {text}
          </span>
          <svg width="10" height="10" viewBox="0 0 32 32" aria-hidden="true" className={cn('shrink-0 transition-transform', open && 'rotate-180')}>
            <path d="M16 22L6 12l1.4-1.4L16 19.2l8.6-8.6L26 12z" fill="var(--color-fg-muted)" />
          </svg>
        </button>
        {open && (
          <ul id={listId} role="listbox" aria-labelledby={label ? labelId : undefined} className="absolute left-0 top-full z-ds-dropdown mt-ds-1 max-h-ds-list min-w-full overflow-auto rounded-ds-md border border-line bg-surface py-ds-1 shadow-ds-md">
            {items.map((o, i) => (
              <li
                key={`${o.value}-${i}`}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={o.value === value}
                onClick={() => pick(i)}
                onMouseMove={() => setActive(i)}
                className={cn('flex h-ds-cell cursor-pointer items-center whitespace-nowrap px-ds-3 text-ds-body-s leading-ds-body', i === active && 'bg-action-soft text-action-strong', o.value === value ? 'font-bold text-action' : 'text-fg', clearable && !o.value && 'text-fg-muted')}
              >
                {o.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {helper && (
        <p id={helperId} className="text-ds-caption leading-ds-caption text-fg-secondary">
          {helper}
        </p>
      )}
    </div>
  );
}
