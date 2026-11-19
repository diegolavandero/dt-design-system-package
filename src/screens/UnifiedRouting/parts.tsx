// Piezas de la pantalla que el DS aún no tiene como componente. Se arman solo con tokens del DS
// (clases semánticas `ds-*`) e íconos del catálogo del DS o de Carbon (misma familia).
import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button, cn } from '@/ds';
import { Icon, type IconName } from '@/ds';
type RtIconName = IconName;

/** Ícono de la librería del DS (misma `Icon` que usa todo el sistema). */
export function RtIcon({ name, size = 16, color = 'currentColor', className }: { name: RtIconName; size?: number; color?: string; className?: string }) {
  return <Icon name={name} size={size} color={color} className={className} />;
}

/* ── Hint: tooltip azul de ayuda para acciones (patrón «coachmark» de la consola de ruteo) ── */
type Side = 'top' | 'bottom' | 'left' | 'right';

export function HintBubble({ x, y, side, children, id, interactive, onEnter, onLeave, tone = 'info' }: { x: number; y: number; side: Side; children: ReactNode; id?: string; interactive?: boolean; onEnter?: () => void; onLeave?: () => void; tone?: 'info' | 'danger' | 'plain' }) {
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
  const plainArrow = { top: 'border-b border-r border-line', bottom: 'border-t border-l border-line', left: 'border-t border-r border-line', right: 'border-b border-l border-line' };
  const arrowStyle = side === 'top' || side === 'bottom' ? { left: Math.min(Math.max(x - pos.left, 12), (ref.current?.offsetWidth ?? 24) - 12) } : undefined;
  return createPortal(
    <div ref={ref} id={id} role="tooltip" onMouseEnter={onEnter} onMouseLeave={onLeave} className={cn('fixed z-ds-menu max-w-ds-popover rounded-ds-md px-ds-3 py-ds-2 text-ds-caption leading-ds-caption shadow-ds-md', tone === 'danger' ? 'bg-danger-fg text-fg-inverse' : tone === 'plain' ? 'border border-line bg-surface text-fg' : 'bg-action-text text-fg-inverse', interactive ? 'pointer-events-auto' : 'pointer-events-none')} style={{ left: pos.left, top: pos.top }}>
      {children}
      <span className={cn('absolute h-ds-2 w-ds-2 rotate-45', tone === 'danger' ? 'bg-danger-fg' : tone === 'plain' ? cn('bg-surface', plainArrow[side]) : 'bg-action-text', arrow)} style={arrowStyle} />
    </div>,
    document.body,
  );
}

/**
 * Envuelve un elemento y muestra la ayuda azul al pasar el cursor o al enfocarlo (WCAG 1.4.13):
 * se puede descartar con Esc, el cursor puede pasar sobre ella sin que desaparezca y el elemento queda descrito con aria-describedby.
 */
export function Hint({ text, side = 'top', children, disabled, block, tone }: { text: ReactNode; side?: Side; children: ReactElement; disabled?: boolean; block?: boolean; tone?: 'info' | 'danger' }) {
  const [at, setAt] = useState<{ x: number; y: number; side: Side } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const id = useId();
  const show = () => {
    clearTimeout(timer.current);
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    // La ayuda es interactiva (WCAG 1.4.13): si no cabe del lado pedido, se pasa al opuesto para no tapar el propio control.
    let sd = side;
    if (sd === 'top' && r.top < 88) sd = 'bottom';
    else if (sd === 'bottom' && window.innerHeight - r.bottom < 88) sd = 'top';
    else if (sd === 'right' && window.innerWidth - r.right < 240) sd = 'left';
    else if (sd === 'left' && r.left < 240) sd = 'right';
    const x = sd === 'left' ? r.left : sd === 'right' ? r.right : r.left + r.width / 2;
    const y = sd === 'top' ? r.top : sd === 'bottom' ? r.bottom : r.top + r.height / 2;
    setAt({ x, y, side: sd });
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAt(null), 120);
  };
  useEffect(() => {
    if (!at) return;
    const now = () => setAt(null);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && now();
    window.addEventListener('scroll', now, true);
    window.addEventListener('pointerdown', now, true);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('scroll', now, true);
      window.removeEventListener('pointerdown', now, true);
      window.removeEventListener('keydown', esc);
    };
  }, [at]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const visible = !!at && !disabled;
  return (
    <span ref={ref} className={block ? 'flex w-full' : 'inline-flex'} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {visible ? cloneElement(children, { 'aria-describedby': id } as Record<string, string>) : children}
      {visible && (
        <HintBubble id={id} tone={tone} x={at.x} y={at.y} side={at.side} interactive onEnter={() => clearTimeout(timer.current)} onLeave={hide}>
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

/** Checkbox con área de toque de 24 px (WCAG 2.5.8) alrededor del control de 16 px. */
export function Checkbox({ checked, indeterminate, onChange, label, disabled }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <span className="inline-flex h-ds-6 w-ds-6 shrink-0 items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        onClick={(e) => e.stopPropagation()}
        className="h-ds-4 w-ds-4 cursor-pointer accent-action disabled:cursor-not-allowed disabled:opacity-ds-disabled"
      />
    </span>
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

/** Botón del DS (`Button`) con ayuda azul opcional. La separación entre botones es siempre de 8 px (`gap-ds-2`). */
export function Pill({ variant = 'secondary', children, onClick, disabled, icon, trailing, className, hint, pressed, elevated }: { variant?: 'primary' | 'secondary'; children: ReactNode; onClick?: () => void; disabled?: boolean; icon?: RtIconName; trailing?: RtIconName; className?: string; hint?: ReactNode; pressed?: boolean; elevated?: boolean }) {
  const btn = (
    <Button variant={variant} onClick={onClick} disabled={disabled} aria-pressed={pressed} icon={icon ?? trailing} iconPosition={icon ? 'start' : 'end'} className={cn(elevated && 'shadow-ds-sm', className)}>
      {children}
    </Button>
  );
  return hint ? <Hint text={hint}>{btn}</Hint> : btn;
}

/** Botón flotante sobre el mapa: el `Button` secundario del DS con sombra. */
export function MapChip({ icon, children, onClick, active, hint }: { icon: RtIconName; children: ReactNode; onClick: () => void; active?: boolean; hint?: ReactNode }) {
  return (
    <Pill icon={icon} pressed={active} elevated hint={hint ?? children} onClick={onClick}>
      {children}
    </Pill>
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

/** Menú contextual pequeño (popup del lazo, «Ver»). */
export function MenuItem({ icon, children, onClick, tone = 'action', ...rest }: { icon: RtIconName; children: ReactNode; onClick: () => void; tone?: 'action' | 'danger' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      {...rest}
      className={cn('flex w-full items-center gap-ds-3 rounded-ds-md px-ds-3 py-ds-2 text-left text-ds-body-s font-semibold transition-colors', tone === 'danger' ? 'text-danger-fg hover:bg-danger-bg' : 'text-action-strong hover:bg-action-soft')}
    >
      <RtIcon name={icon} size={18} />
      {children}
    </button>
  );
}

export const Sep = () => <span aria-hidden="true" className="h-ds-5 w-px shrink-0 bg-line-strong" />;
export const Bullet = () => <span aria-hidden="true" className="h-ds-1 w-ds-1 shrink-0 rounded-ds-pill bg-fg-subtle" />;

const lum = (hex: string) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** Tinta con mejor contraste (WCAG) sobre un color de ruta: blanco o negro del DS, el que dé más contraste. */
export function inkOn(tokenName: string): 'text-fg-inverse' | 'text-fg-ink' {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return 'text-fg-inverse';
  const L = lum(hex);
  return 1.05 / (L + 0.05) >= (L + 0.05) / 0.05 ? 'text-fg-inverse' : 'text-fg-ink';
}
