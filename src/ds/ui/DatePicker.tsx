import { useEffect, useRef, useState } from 'react';
import { cn } from '@/ds/lib/cn';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const toLabel = (v: string) => v.split('-').reverse().join('/');

interface DatePickerProps {
  /** Fecha en formato ISO (aaaa-mm-dd) o vacío. */
  value: string;
  placeholder: string;
  onChange: (iso: string) => void;
}

const CAL_ICON = 'M26,4h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20V26z M26,10H6V6h4v2h2V6h8v2h2V6h4V10z';

/** Selector de fecha del DS: campo de 32px + calendario en popover (vista de días y de meses) con botón «Aceptar». */
export function DatePicker({ value, placeholder, onChange }: DatePickerProps) {
  const today = new Date();
  const base = value ? value.split('-').map(Number) : [today.getFullYear(), today.getMonth() + 1];
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(base[0]);
  const [month, setMonth] = useState(base[1]);
  const [view, setView] = useState<'day' | 'month'>('day');
  const [pick, setPick] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const step = (dir: number) => {
    if (view === 'month') return setYear((y) => y + dir);
    const m = month + dir;
    if (m < 1) { setMonth(12); setYear((y) => y - 1); } else if (m > 12) { setMonth(1); setYear((y) => y + 1); } else setMonth(m);
  };

  let first = new Date(year, month - 1, 1).getDay();
  first = first === 0 ? 6 : first - 1;
  const days = new Date(year, month, 0).getDate();

  return (
    <div ref={ref} className="relative min-w-ds-menu flex-1">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => { setPick(value); setOpen((o) => !o); }}
        className={cn(
          'box-border flex h-ds-7 w-full items-center gap-ds-2 rounded-ds-md border bg-surface px-ds-3 text-left text-ds-body-s hover:bg-canvas',
          open ? 'border-2 border-action' : value ? 'border-fg-muted' : 'border-line',
        )}
      >
        <span className={cn('flex-1 truncate', value ? 'text-fg' : 'text-fg-muted')}>{value ? toLabel(value) : placeholder}</span>
        <svg viewBox="0 0 32 32" width="14" height="14" aria-hidden="true" className="shrink-0 text-fg-muted" fill="currentColor"><path d={CAL_ICON} /></svg>
      </button>
      {open && (
        <div role="dialog" aria-label={placeholder} className="absolute left-0 top-full z-ds-dropdown mt-ds-1 w-ds-calendar overflow-hidden rounded-ds-xl bg-surface shadow-ds-lg">
          <div className="px-ds-3 py-ds-3">
            <div className="mb-ds-3 flex items-center justify-between">
              <button type="button" aria-label="Anterior" onClick={() => step(-1)} className="px-ds-2 text-ds-body-l leading-none text-action">‹</button>
              <button type="button" onClick={() => setView((v) => (v === 'day' ? 'month' : 'day'))} className="rounded-ds-sm px-ds-2 text-ds-body-l font-bold text-fg hover:bg-canvas">
                {view === 'month' ? year : `${MONTHS[month - 1]} ${year}`}
              </button>
              <button type="button" aria-label="Siguiente" onClick={() => step(1)} className="px-ds-2 text-ds-body-l leading-none text-action">›</button>
            </div>
            {view === 'month' ? (
              <div className="grid grid-cols-3 gap-ds-1">
                {MONTHS_SHORT.map((n, i) => (
                  <button key={n} type="button" onClick={() => { setMonth(i + 1); setView('day'); }} className={cn('rounded-ds-md px-ds-1 py-ds-2 text-ds-caption', i + 1 === month ? 'bg-action font-bold text-fg-inverse' : 'text-fg hover:bg-canvas')}>
                    {n}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-px">
                {WEEKDAYS.map((d, i) => <div key={i} className="pb-ds-1 text-center text-ds-caption font-semibold text-fg-muted">{d}</div>)}
                {Array.from({ length: first }, (_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: days }, (_, i) => {
                  const d = iso(year, month, i + 1);
                  return (
                    <button key={d} type="button" aria-pressed={d === pick} onClick={() => setPick(d)} className={cn('mx-auto flex h-ds-cell w-ds-cell items-center justify-center rounded-ds-pill text-ds-body-s', d === pick ? 'bg-action text-fg-inverse' : 'text-fg hover:bg-canvas')}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="px-ds-3 pb-ds-3 pt-ds-1">
            <button
              type="button"
              disabled={!pick}
              onClick={() => { onChange(pick); setOpen(false); }}
              className={cn('h-ds-cell w-full rounded-ds-pill text-ds-body-s font-bold text-fg-inverse', pick ? 'bg-action hover:bg-action-hover' : 'bg-line-strong')}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
