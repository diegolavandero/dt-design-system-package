// Mapa del DS (Leaflet, pines de docs/sections/MapPins.tsx) sobre un fondo de calles de Google en gris claro con pines, rutas, lazo y arrastre.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/ds';
import { addBaseLayer } from './mapTiles';
import { CoachBar, HintBubble, MapChip, RtIcon } from './parts';
import { DEPOTS, type LatLng } from './data';
import { ICON_PATHS } from '@/ds';

const SCL: L.LatLngTuple = [-33.4489, -70.6493];

/** Resuelve un token CSS (p. ej. `--su2`) a su valor: Leaflet dibuja SVG con atributos, que no aceptan var(). */
export const tok = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || 'currentColor';

/* ── Pines: mismo trazado que el pin de orden del DS (MapPins › orderPin) ── */
const PB = 'M16.5 1.5C24.78 1.5 31.5 8.22 31.5 16.5C31.5 21.44 29.11 25.82 25.43 28.55C22.61 30.67 18.58 34.04 17.66 39.48C17.56 40.05 17.08 40.5 16.5 40.5C15.92 40.5 15.44 40.05 15.34 39.48C14.42 34.04 10.39 30.67 7.56 28.55C3.88 25.82 1.5 21.44 1.5 16.5C1.5 8.22 8.22 1.5 16.5 1.5Z';
const PIN_W = 30;
const PIN_H = Math.round((PIN_W * 49) / 33);

function pinHtml(fill: string, inner: string, cls = '') {
  return `<div class="rt-pin ${cls}"><svg width="${PIN_W}" height="${PIN_H}" viewBox="0 0 33 49"><path d="${PB}" style="fill:var(${fill});stroke:var(--white)" stroke-width="2"/>${inner}</svg></div>`;
}
const numInner = (n: string | number) =>
  `<circle cx="16.5" cy="16.5" r="10.5" style="fill:var(--white)"/><text x="16.5" y="16.5" text-anchor="middle" dominant-baseline="central" font-family="DM Sans,sans-serif" font-weight="700" font-size="${String(n).length > 1 ? 10 : 11}" style="fill:var(--n7)">${n}</text>`;
const dotInner = `<circle cx="16.5" cy="16.5" r="6" style="fill:var(--white)"/>`;
const iconInner = (path: string) => `<g transform="translate(8.5 8.5) scale(.5)" style="fill:var(--white)">${path}</g>`;

export interface MapPin {
  id: string;
  lat: number;
  lng: number;
  /** Token de color del cuerpo del pin (p. ej. `--su2`, `--n4-5`). */
  color: string;
  label?: number;
  /** Seleccionado por lazo guardado o selección manual: sombra azul. */
  marked?: boolean;
  dim?: boolean;
  draggable?: boolean;
  hint: ReactNode;
}
export interface MapVehicle {
  id: string;
  lat: number;
  lng: number;
  color: string;
  hint: ReactNode;
}
export interface MapLine {
  id: string;
  color: string;
  points: LatLng[];
  dim?: boolean;
}

interface RouteMapProps {
  pins: MapPin[];
  vehicles?: MapVehicle[];
  lines?: MapLine[];
  showDepots?: boolean;
  /** Cambia para volver a encuadrar el mapa. */
  fitKey: string;
  /** Presionar un pin: el padre decide si es clic o arrastre. */
  onPinPress?: (id: string, e: { clientX: number; clientY: number }) => void;
  lasso?: { active: boolean; onToggle: (on: boolean) => void; onClose: (ids: string[], at: { x: number; y: number }) => void; banner: ReactNode };
  coach?: ReactNode;
  onCoachClose?: () => void;
  layers?: { label: string; on: boolean; toggle: () => void }[];
  /** Capa extra sobre el mapa (popup del lazo). */
  overlay?: ReactNode;
  /** Marca el mapa como zona de destino durante un arrastre. */
  dropHint?: boolean;
}

export function RouteMap({ pins, vehicles = [], lines = [], showDepots, fitKey, onPinPress, lasso, coach, onCoachClose, layers, overlay, dropHint }: RouteMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const group = useRef<L.LayerGroup | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const [tip, setTip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const pressRef = useRef(onPinPress);
  pressRef.current = onPinPress;
  const pinsRef = useRef(pins);
  pinsRef.current = pins;

  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { center: SCL, zoom: 11, zoomControl: false, scrollWheelZoom: true, attributionControl: true });
    m.attributionControl.setPrefix(false);
    addBaseLayer(m, tok);
    group.current = L.layerGroup().addTo(m);
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
  }, []);

  const toScreen = (lat: number, lng: number) => {
    const m = map.current!;
    const p = m.latLngToContainerPoint([lat, lng]);
    const r = m.getContainer().getBoundingClientRect();
    return { x: r.left + p.x, y: r.top + p.y };
  };

  // Redibuja capas cuando cambian los datos (≤ 60 marcadores: más simple que reconciliar).
  useEffect(() => {
    const m = map.current;
    const g = group.current;
    if (!m || !g) return;
    g.clearLayers();
    markers.current.clear();
    for (const ln of lines) {
      L.polyline(ln.points.map((p) => [p.lat, p.lng] as L.LatLngTuple), { color: tok(ln.color), weight: 4, opacity: ln.dim ? 0.18 : 0.85, interactive: false }).addTo(g);
    }
    if (showDepots) {
      for (const d of DEPOTS) {
        L.marker([d.lat, d.lng], { icon: L.divIcon({ html: pinHtml('--b5', iconInner(ICON_PATHS.store)), className: '', iconSize: [PIN_W, PIN_H], iconAnchor: [PIN_W / 2, Math.round((PIN_H * 40.5) / 49)] }), interactive: true, keyboard: false, zIndexOffset: -100 })
          .on('mouseover', () => {
            const s = toScreen(d.lat, d.lng);
            setTip({ x: s.x, y: s.y - PIN_H + 6, content: <><b className="block">{d.name}</b>Distribution center</> });
          })
          .on('mouseout', () => setTip(null))
          .addTo(g);
      }
    }
    for (const v of vehicles) {
      L.marker([v.lat, v.lng], { icon: L.divIcon({ html: pinHtml(v.color, iconInner(ICON_PATHS.truck), 'rt-pin--vehicle'), className: '', iconSize: [PIN_W, PIN_H], iconAnchor: [PIN_W / 2, Math.round((PIN_H * 40.5) / 49)] }), zIndexOffset: 400, keyboard: false })
        .on('mouseover', () => {
          const s = toScreen(v.lat, v.lng);
          setTip({ x: s.x, y: s.y - PIN_H + 6, content: v.hint });
        })
        .on('mouseout', () => setTip(null))
        .addTo(g);
    }
    for (const p of pins) {
      const inner = p.label !== undefined ? numInner(p.label) : dotInner;
      const cls = cn(p.marked && 'rt-pin--marked', p.dim && 'rt-pin--dim', p.draggable && 'rt-pin--drag');
      const mk = L.marker([p.lat, p.lng], {
        icon: L.divIcon({ html: pinHtml(p.color, inner, cls), className: '', iconSize: [PIN_W, PIN_H], iconAnchor: [PIN_W / 2, Math.round((PIN_H * 40.5) / 49)] }),
        zIndexOffset: p.marked ? 300 : p.dim ? -50 : 100,
        keyboard: false,
      });
      mk.on('mouseover', () => {
        const s = toScreen(p.lat, p.lng);
        setTip({ x: s.x, y: s.y - PIN_H + 6, content: p.hint });
      });
      mk.on('mouseout', () => setTip(null));
      mk.addTo(g);
      // Escucha nativa en el ícono: se dispara antes que el arrastre del mapa (que vive en un panel padre).
      const icon = mk.getElement();
      icon?.addEventListener('pointerdown', (ev: PointerEvent) => {
        if (ev.button !== 0 || !pressRef.current) return;
        ev.stopPropagation();
        ev.preventDefault();
        setTip(null);
        pressRef.current(p.id, ev);
      });
      icon?.addEventListener('mousedown', (ev) => pressRef.current && ev.stopPropagation());
      icon?.addEventListener('touchstart', (ev) => pressRef.current && ev.stopPropagation(), { passive: true });
      markers.current.set(p.id, mk);
    }
  }, [pins, vehicles, lines, showDepots]);

  // Encuadre: solo cuando cambia la vista (paso, ruta abierta), no en cada edición.
  const points = useMemo(() => [...pins.map((p) => [p.lat, p.lng]), ...vehicles.map((v) => [v.lat, v.lng])] as L.LatLngTuple[], [pins, vehicles]);
  const pointsRef = useRef(points);
  pointsRef.current = points;
  const fit = () => {
    const m = map.current;
    if (!m) return;
    const pts = pointsRef.current;
    if (pts.length) m.fitBounds(L.latLngBounds(pts), { padding: [56, 56], maxZoom: 14 });
    else m.setView(SCL, 11);
  };
  useEffect(() => {
    const id = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey]);

  /* ── Lazo (patrón del DS: dibujo libre sobre una capa transparente) ── */
  const [path, setPath] = useState<[number, number][]>([]);
  const [closed, setClosed] = useState(false);
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (lasso?.active) {
      m.dragging.disable();
    } else {
      m.dragging.enable();
      setPath([]);
      setClosed(false);
    }
  }, [lasso?.active]);

  const startLasso = (e: React.PointerEvent) => {
    if (!lasso || !frame.current) return;
    e.preventDefault();
    const rect = () => frame.current!.getBoundingClientRect();
    const pts: [number, number][] = [[e.clientX - rect().left, e.clientY - rect().top]];
    setPath([...pts]);
    setClosed(false);
    const move = (ev: PointerEvent) => {
      const r = rect();
      pts.push([ev.clientX - r.left, ev.clientY - r.top]);
      setPath([...pts]);
    };
    const up = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      if (pts.length < 4) {
        setPath([]);
        return;
      }
      setClosed(true);
      const m = map.current!;
      const mr = m.getContainer().getBoundingClientRect();
      const fr = rect();
      const inside = (x: number, y: number) => {
        let c = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const [xi, yi] = pts[i];
          const [xj, yj] = pts[j];
          if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
        }
        return c;
      };
      const ids = pinsRef.current
        .filter((p) => {
          const cp = m.latLngToContainerPoint([p.lat, p.lng]);
          return inside(cp.x + mr.left - fr.left, cp.y + mr.top - fr.top);
        })
        .map((p) => p.id);
      lasso.onClose(ids, { x: ev.clientX - fr.left, y: ev.clientY - fr.top });
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };
  const d = path.length < 2 ? '' : 'M' + path.map((p) => p.join(',')).join(' L') + (closed ? 'Z' : '');

  return (
    <div ref={frame} className={cn('relative h-full min-h-0 w-full overflow-hidden bg-canvas', lasso?.active && 'rt-lasso-frame', dropHint && 'rt-drop-map')}>
      <div ref={el} className="absolute inset-0 z-ds-base" />

      {lasso?.active && (
        <div className="absolute inset-x-0 top-0 z-ds-dropdown flex h-ds-8 items-center gap-ds-3 bg-action-text px-ds-4 text-ds-body-s text-fg-inverse">
          <RtIcon name="lasso" size={18} />
          <span className="min-w-0 flex-1 truncate">{lasso.banner}</span>
          <button type="button" onClick={() => lasso.onToggle(false)} className="shrink-0 font-bold underline">
            Cancel
          </button>
        </div>
      )}

      <div className={cn('absolute right-ds-4 z-ds-dropdown flex items-center gap-ds-2', lasso?.active ? 'top-ds-10' : 'top-ds-4')}>
        {lasso && (
          <MapChip icon="lasso" active={lasso.active} onClick={() => lasso.onToggle(!lasso.active)} hint={lasso.active ? 'Exit lasso mode. Saved selections are cleared.' : 'Draw around stops on the map to select several orders at once.'}>
            Select with lasso
          </MapChip>
        )}
        {layers && (
          <div className="relative">
            <MapChip icon="view" active={layersOpen} onClick={() => setLayersOpen((o) => !o)} hint="Choose what the map shows.">
              View
            </MapChip>
            {layersOpen && (
              <div className="absolute right-0 top-full z-ds-menu mt-ds-2 min-w-ds-popover rounded-ds-md border border-line bg-surface py-ds-1 shadow-ds-md">
                {layers.map((l) => (
                  <label key={l.label} className="flex h-ds-cell cursor-pointer items-center gap-ds-2 px-ds-3 text-ds-body-s text-fg hover:bg-action-soft hover:text-action-strong">
                    <input type="checkbox" checked={l.on} onChange={l.toggle} className="h-ds-4 w-ds-4 cursor-pointer accent-action" />
                    {l.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {coach && !lasso?.active && (
        <div className="absolute left-ds-4 top-ds-4 z-ds-dropdown max-w-ds-drawer">
          <CoachBar icon="touch--1" onClose={onCoachClose}>
            {coach}
          </CoachBar>
        </div>
      )}

      <div className="absolute bottom-ds-6 right-ds-4 z-ds-dropdown flex items-center gap-ds-2">
        <MapChip icon="reset" onClick={fit} hint="Fit every stop in view.">
          Reset zoom
        </MapChip>
        <div className="flex h-ds-7 items-center overflow-hidden rounded-ds-pill border border-line bg-surface shadow-ds-sm">
          <button type="button" aria-label="Zoom out" onClick={() => map.current?.zoomOut()} className="flex h-full w-ds-7 items-center justify-center text-fg hover:bg-canvas">
            <RtIcon name="subtract" size={16} />
          </button>
          <span className="h-ds-5 w-px bg-line" />
          <button type="button" aria-label="Zoom in" onClick={() => map.current?.zoomIn()} className="flex h-full w-ds-7 items-center justify-center text-fg hover:bg-canvas">
            <RtIcon name="add" size={16} />
          </button>
        </div>
      </div>

      {lasso?.active && (
        <>
          <svg className="pointer-events-none absolute inset-0 z-ds-float h-full w-full" aria-hidden="true">
            <path d={d} className="rt-lasso-path" />
          </svg>
          <div onPointerDown={startLasso} className="absolute inset-0 z-ds-float cursor-crosshair" />
        </>
      )}

      {overlay}
      {tip && (
        <HintBubble x={tip.x} y={tip.y} side="top">
          {tip.content}
        </HintBubble>
      )}
    </div>
  );
}
