// Selector «View»: tarjeta con miniaturas de cada disposición (patrón «Visualización» del diseño de la consola).
// Hoy el DS no tiene un selector de vista; se arma con tokens y se comporta como un grupo de radios accesible.
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/ds';
import { Pill } from './parts';

export type ViewKind = 'map' | 'table' | 'split';

/** Miniatura 160×96: barra superior, riel izquierdo y área principal (mapa con pin, filas de tabla o ambas). */
function Thumb({ kind, on }: { kind: ViewKind; on: boolean }) {
  const solid = on ? 'fill-b-3' : 'fill-n-3';
  const soft = on ? 'fill-b-1' : 'fill-n-2';
  const pin = (
    <>
      <circle cx={kind === 'split' ? 100 : 100} cy={kind === 'split' ? 70 : 54} r="6" className="fill-o-6" />
      <circle cx={kind === 'split' ? 100 : 100} cy={kind === 'split' ? 70 : 54} r="2" className="fill-surface" />
    </>
  );
  const rows = (n: number, h: number) => [...Array(n)].map((_, i) => <rect key={i} x="48" y={22 + i * h} width="106" height={h - 4} rx="2" className={solid} />);
  return (
    <svg viewBox="0 0 160 96" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <rect x="6" y="6" width="148" height="10" rx="2" className={solid} />
      <rect x="6" y="20" width="38" height="70" rx="2" className={solid} />
      {kind === 'map' && (
        <>
          <rect x="48" y="20" width="106" height="70" rx="2" className={soft} />
          {pin}
        </>
      )}
      {kind === 'table' && rows(7, 10)}
      {kind === 'split' && (
        <>
          {rows(3, 10)}
          <rect x="48" y="54" width="106" height="36" rx="2" className={soft} />
          {pin}
        </>
      )}
    </svg>
  );
}

export function ViewMenu({ title = 'View', value, options, onChange, hint }: { title?: string; value: ViewKind; options: { id: ViewKind; label: string }[]; onChange: (v: ViewKind) => void; hint?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLSpanElement>(null);
  const uid = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.querySelector('button')?.focus();
    };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <span ref={trigger}>
        <Pill trailing="chevron--down" pressed={open} hint={open ? undefined : hint} onClick={() => setOpen((o) => !o)}>
          {title}
        </Pill>
      </span>
      {open && (
        <div role="group" aria-labelledby={`${uid}-t`} className="absolute right-0 top-full z-ds-menu mt-ds-2 rounded-ds-xl border border-line bg-surface p-ds-6 shadow-ds-lg">
          <p id={`${uid}-t`} className="mb-ds-4 text-ds-subtitle font-bold text-fg">
            {title}
          </p>
          <div role="radiogroup" aria-labelledby={`${uid}-t`} className="flex gap-ds-4">
            {options.map((o) => {
              const on = value === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                  className="flex flex-col gap-ds-2 text-left"
                >
                  <span className={cn('text-ds-body-l', on ? 'font-bold text-action-text' : 'text-fg-secondary')}>{o.label}</span>
                  <span className={cn('rt-thumb block rounded-ds-lg border-2 bg-surface-subtle p-ds-2 transition-colors', on ? 'border-action' : 'border-transparent hover:border-line-strong')}>
                    <Thumb kind={o.id} on={on} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
