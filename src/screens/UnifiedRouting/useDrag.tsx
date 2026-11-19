// Arrastrar y soltar propio (punteros, no HTML5 DnD): el mismo gesto sirve para pines del mapa y tarjetas,
// con cursor «grabbing», fantasma que sigue al puntero y zonas de destino declaradas con data-drop.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { RtIcon } from './parts';

export interface DragPayload {
  ids: string[];
  label: string;
  color: string;
  /** Ruta de origen (vehicleId) o «unassigned». */
  from: string;
}
/** `route:VEH01` · `unassigned` · `selected` · `card:VEH01:3` (insertar antes o después de la tarjeta 3). */
export type DropTarget = { kind: 'route'; vehicleId: string } | { kind: 'unassigned' } | { kind: 'selected' } | { kind: 'slot'; vehicleId: string; index: number };

interface DragState {
  payload: DragPayload;
  x: number;
  y: number;
  over: DropTarget | null;
  /** Elemento bajo el puntero y si el destino lo rechaza. */
  key: string | null;
  blocked: boolean;
}

interface Ctx {
  drag: DragState | null;
  press: (e: { clientX: number; clientY: number }, payload: DragPayload, onClick?: () => void) => void;
}
const DragContext = createContext<Ctx>({ drag: null, press: () => undefined });
export const useDrag = () => useContext(DragContext);

const THRESHOLD = 5;

function targetAt(x: number, y: number): { t: DropTarget | null; key: string | null; blocked: boolean } {
  const el = document.elementFromPoint(x, y)?.closest('[data-drop]') as HTMLElement | null;
  if (!el) return { t: null, key: null, blocked: false };
  const raw = el.dataset.drop!;
  const blocked = el.dataset.dropBlocked === 'true';
  const [kind, a, b] = raw.split(':');
  if (kind === 'route') return { t: { kind: 'route', vehicleId: a }, key: raw, blocked };
  if (kind === 'unassigned') return { t: { kind: 'unassigned' }, key: raw, blocked };
  if (kind === 'selected') return { t: { kind: 'selected' }, key: raw, blocked };
  if (kind === 'card') {
    const r = el.getBoundingClientRect();
    const index = Number(b) + (y > r.top + r.height / 2 ? 1 : 0);
    return { t: { kind: 'slot', vehicleId: a, index }, key: `${raw}:${y > r.top + r.height / 2 ? 'after' : 'before'}`, blocked };
  }
  return { t: null, key: null, blocked: false };
}

export function DragProvider({ children, onDrop }: { children: ReactNode; onDrop: (p: DragPayload, t: DropTarget) => void }) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;

  const press = useCallback<Ctx['press']>((e, payload, onClick) => {
    const sx = e.clientX;
    const sy = e.clientY;
    let started = false;
    let last: DragState | null = null;
    let px = sx;
    let py = sy;
    let raf = 0;
    // Autodesplazamiento: cerca del borde superior o inferior de una lista con data-autoscroll, la lista avanza sola.
    const tick = () => {
      const box = document.elementFromPoint(px, py)?.closest('[data-autoscroll]') as HTMLElement | null;
      if (box) {
        const r = box.getBoundingClientRect();
        const edge = 48;
        if (py < r.top + edge) box.scrollTop -= Math.ceil((r.top + edge - py) / 4);
        else if (py > r.bottom - edge) box.scrollTop += Math.ceil((py - (r.bottom - edge)) / 4);
      }
      raf = requestAnimationFrame(tick);
    };
    const move = (ev: PointerEvent) => {
      px = ev.clientX;
      py = ev.clientY;
      if (!started && Math.hypot(ev.clientX - sx, ev.clientY - sy) < THRESHOLD) return;
      if (!started) {
        started = true;
        document.body.classList.add('rt-dragging');
        raf = requestAnimationFrame(tick);
      }
      ev.preventDefault();
      const { t, key, blocked } = targetAt(ev.clientX, ev.clientY);
      last = { payload, x: ev.clientX, y: ev.clientY, over: t, key, blocked };
      setDrag(last);
    };
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.body.classList.remove('rt-dragging');
      cancelAnimationFrame(raf);
      if (!started) {
        onClick?.();
        return;
      }
      setDrag(null);
      if (last?.over && !last.blocked) dropRef.current(payload, last.over);
    };
    document.addEventListener('pointermove', move, { passive: false });
    document.addEventListener('pointerup', up);
  }, []);

  useEffect(() => () => document.body.classList.remove('rt-dragging'), []);

  return (
    <DragContext.Provider value={{ drag, press }}>
      {children}
      {drag &&
        createPortal(
          <div className="rt-ghost flex items-center gap-ds-2 rounded-ds-md border border-line bg-surface px-ds-3 py-ds-2 text-ds-caption font-semibold text-fg shadow-ds-lg" style={{ left: drag.x, top: drag.y }}>
            <span className="inline-block h-ds-3 w-ds-3 shrink-0 rounded-ds-pill" style={{ background: `var(${drag.payload.color})` }} />
            <span className="whitespace-nowrap">{drag.payload.label}</span>
            <span className={drag.blocked ? 'whitespace-nowrap text-danger-fg' : 'whitespace-nowrap text-action-text'}>
              {drag.blocked ? '· Route is locked' : drag.over ? '· Release to move here' : '· Drop on a route, Selected or between stops'}
            </span>
            <RtIcon name="move" size={14} color="var(--color-fg-muted)" />
          </div>,
          document.body,
        )}
    </DragContext.Provider>
  );
}

/** Props de una zona de destino: resalta cuando el puntero está encima. */
export function useDropZone(id: string, blocked = false) {
  const { drag } = useDrag();
  const over = !!drag && drag.key !== null && (drag.key === id || drag.key.startsWith(`${id}:`));
  return {
    'data-drop': id,
    'data-drop-blocked': blocked ? 'true' : undefined,
    active: !!drag,
    over,
    className: over ? (blocked ? 'rt-drop-blocked' : 'rt-drop-active') : '',
  };
}
