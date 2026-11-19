// Piezas de la pantalla que el DS aún no tiene como componente. Se arman solo con tokens del DS
// (clases semánticas `ds-*`) e íconos del catálogo del DS o de Carbon (misma familia).
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/ds';
import { RT_ICONS, type RtIconName } from './icons';

export function RtIcon({ name, size = 16, color = 'currentColor', className }: { name: RtIconName; size?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} aria-hidden="true" focusable="false" className={className} dangerouslySetInnerHTML={{ __html: RT_ICONS[name] }} />
  );
}

/* ── Hint: tooltip azul de ayuda para acciones (patrón «coachmark» de la consola de ruteo) ── */
type Side = 'top' | 'bottom' | 'left' | 'right';

export function HintBubble({ x, y, side, children }: { x: number; y: number; side: Side; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const gap = 10;
    let left = side === 'left' ? x - w - gap : side === 'right' ? x + gap : x - w / 2;
    let top = side === 'top' ? y - h - gap : side === 'bottom' ? y + gap : y - h / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - h - 8));
    setPos({ left, top });
  }, [x, y, side, children]);
  const arrow = {
    top: 'left-1/2 top-full -translate-x-1/2 -translate-y-1/2',
    bottom: 'left-1/2 bottom-full -translate-x-1/2 translate-y-1/2',
    left: 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2',
    right: 'right-full top-1/2 translate-x-1/2 -translate-y-1/2',
  }[side];
  const arrowStyle = side === 'top' || side === 'bottom' ? { left: Math.min(Math.max(x - pos.left, 12), (ref.current?.offsetWidth ?? 24) - 12) } : undefined;
  return createPortal(
    <div ref={ref} role="tooltip" className="pointer-events-none fixed z-ds-menu max-w-ds-popover rounded-ds-md bg-action-text px-ds-3 py-ds-2 text-ds-caption leading-ds-caption text-fg-inverse shadow-ds-md" style={{ left: pos.left, top: pos.top }}>
      {children}
      <span className={cn('absolute h-ds-2 w-ds-2 rotate-45 bg-action-text', arrow)} style={arrowStyle} />
    </div>,
    document.body,
  );
}

/** Envuelve un elemento y muestra la ayuda azul al pasar el cursor o al enfocarlo. */
export function Hint({ text, side = 'top', children, disabled, block }: { text: ReactNode; side?: Side; children: ReactElement; disabled?: boolean; block?: boolean }) {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const show = () => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = side === 'left' ? r.left : side === 'right' ? r.right : r.left + r.width / 2;
    const y = side === 'top' ? r.top : side === 'bottom' ? r.bottom : r.top + r.height / 2;
    setAt({ x, y });
  };
  useEffect(() => {
    if (!at) return;
    const hide = () => setAt(null);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('pointerdown', hide, true);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('pointerdown', hide, true);
    };
  }, [at]);
  return (
    <span ref={ref} className={block ? 'flex w-full' : 'inline-flex'} onMouseEnter={show} onMouseLeave={() => setAt(null)} onFocus={show} onBlur={() => setAt(null)}>
      {children}
      {at && !disabled && (
        <HintBubble x={at.x} y={at.y} side={side}>
          {text}
        </HintBubble>
      )}
    </span>
  );
}

/** Botón de solo ícono en color de acción, con ayuda azul. */
export function IconAction({ icon, label, hint, onClick, active, disabled, size = 18, side = 'top' }: { icon: RtIconName; label: string; hint?: ReactNode; onClick?: () => void; active?: boolean; disabled?: boolean; size?: number; side?: Side }) {
  return (
    <Hint text={hint ?? label} side={side}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onClick={onClick}
        className={cn('inline-flex h-ds-6 w-ds-6 shrink-0 items-center justify-center rounded-ds-sm transition-colors', disabled ? 'cursor-not-allowed text-fg-subtle' : 'text-action-text hover:bg-action-soft', active && 'bg-action-soft text-action-strong')}
      >
        <RtIcon name={icon} size={size} />
      </button>
    </Hint>
  );
}

export function Checkbox({ checked, indeterminate, onChange, label, disabled }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(e) => e.stopPropagation()}
      className="h-ds-4 w-ds-4 shrink-0 cursor-pointer accent-action disabled:cursor-not-allowed disabled:opacity-ds-disabled"
    />
  );
}

/** Punto de color de una ruta. */
export function Dot({ color, ring, size = 'md' }: { color: string; ring?: boolean; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block shrink-0 rounded-ds-pill', size === 'sm' ? 'h-ds-2 w-ds-2' : 'h-ds-4 w-ds-4', ring && 'border-ds-accent bg-surface')}
      style={ring ? { borderColor: color } : { background: color }}
    />
  );
}

/** Botón píldora del DS con estado deshabilitado. */
export function Pill({ variant = 'secondary', children, onClick, disabled, icon, trailing, className, hint }: { variant?: 'primary' | 'secondary'; children: ReactNode; onClick?: () => void; disabled?: boolean; icon?: RtIconName; trailing?: RtIconName; className?: string; hint?: ReactNode }) {
  const btn = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-ds-7 shrink-0 items-center gap-ds-2 whitespace-nowrap rounded-ds-pill px-ds-4 text-ds-body-s font-bold leading-none transition-colors',
        variant === 'primary'
          ? 'bg-action text-fg-inverse hover:bg-action-hover disabled:bg-surface-header disabled:text-fg-subtle'
          : 'border border-action bg-surface text-action-text hover:bg-action-soft disabled:border-line-strong disabled:bg-surface disabled:text-fg-subtle',
        'disabled:cursor-not-allowed',
        className,
      )}
    >
      {icon && <RtIcon name={icon} size={14} />}
      {children}
      {trailing && <RtIcon name={trailing} size={14} />}
    </button>
  );
  return hint ? <Hint text={hint}>{btn}</Hint> : btn;
}

/** Botón flotante sobre el mapa (Seleccionar con lazo, Ver, Reset zoom). Mismo estilo que MapPins del DS. */
export function MapChip({ icon, children, onClick, active, label, hint }: { icon: RtIconName; children?: ReactNode; onClick: () => void; active?: boolean; label?: string; hint?: ReactNode }) {
  return (
    <Hint text={hint ?? label ?? children} side="bottom">
      <button
        type="button"
        aria-label={label}
        aria-pressed={active}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          'inline-flex h-ds-8 items-center gap-ds-2 whitespace-nowrap rounded-ds-pill border px-ds-4 text-ds-body-s font-bold leading-none shadow-ds-sm transition-colors',
          active ? 'border-action-text bg-action-soft text-action-strong' : 'border-line bg-surface text-fg hover:border-line-strong',
        )}
      >
        <RtIcon name={icon} size={16} />
        {children}
      </button>
    </Hint>
  );
}

/** Barra de ayuda persistente sobre el mapa (misma familia visual que el banner del modo lazo, en tono suave). */
export function CoachBar({ icon, children, onClose }: { icon: RtIconName; children: ReactNode; onClose?: () => void }) {
  return (
    <div role="note" className="flex items-center gap-ds-3 rounded-ds-md border border-action-border-soft bg-action-soft px-ds-4 py-ds-2 text-ds-caption text-action-strong shadow-ds-sm">
      <RtIcon name={icon} size={16} />
      <span className="min-w-0 flex-1">{children}</span>
      {onClose && (
        <button type="button" aria-label="Dismiss tip" onClick={onClose} className="inline-flex shrink-0 rounded-ds-sm p-ds-1 hover:bg-action-soft-hover">
          <RtIcon name="close" size={14} />
        </button>
      )}
    </div>
  );
}

/** Select con etiqueta superior (patrón «Tipo de fecha» del DS). */
export function LabeledSelect({ label, value, options, onChange, hint }: { label: string; value: string; options: { id: string; label: string }[]; onChange: (id: string) => void; hint?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const current = options.find((o) => o.id === value);
  return (
    <div ref={ref} className="relative" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cn('flex w-full items-center justify-between gap-ds-2 rounded-ds-md border bg-surface px-ds-3 py-ds-1 text-left transition-colors', open ? 'border-action' : 'border-fg-muted hover:bg-canvas')}
      >
        <span className="min-w-0">
          <span className="block text-ds-caption text-fg-secondary">{label}</span>
          <span className="block truncate text-ds-body-s text-fg">{current?.label}</span>
        </span>
        <RtIcon name="chevron--down" size={14} className={cn('shrink-0 transition-transform', open && 'rotate-180')} color="var(--color-fg-muted)" />
      </button>
      {hint && <p className="mt-ds-1 text-ds-caption text-fg-muted">{hint}</p>}
      {open && (
        <ul id={id} role="listbox" className="absolute left-0 top-full z-ds-dropdown mt-ds-1 w-full overflow-hidden rounded-ds-md border border-line bg-surface py-ds-1 shadow-ds-md">
          {options.map((o) => (
            <li
              key={o.id}
              role="option"
              aria-selected={o.id === value}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={cn('flex h-ds-cell cursor-pointer items-center px-ds-3 text-ds-body-s hover:bg-action-soft hover:text-action-strong', o.id === value ? 'font-bold text-action' : 'text-fg')}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Menú contextual pequeño (popup del lazo, «Ver»). */
export function MenuItem({ icon, children, onClick, tone = 'action' }: { icon: RtIconName; children: ReactNode; onClick: () => void; tone?: 'action' | 'danger' }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn('flex w-full items-center gap-ds-3 rounded-ds-md px-ds-3 py-ds-2 text-left text-ds-body-s font-semibold transition-colors', tone === 'danger' ? 'text-danger-fg hover:bg-danger-bg' : 'text-action-text hover:bg-action-soft')}
    >
      <RtIcon name={icon} size={18} />
      {children}
    </button>
  );
}

export const Sep = () => <span aria-hidden="true" className="h-ds-5 w-px shrink-0 bg-line-strong" />;
export const Bullet = () => <span aria-hidden="true" className="h-ds-1 w-ds-1 shrink-0 rounded-ds-pill bg-fg-subtle" />;
