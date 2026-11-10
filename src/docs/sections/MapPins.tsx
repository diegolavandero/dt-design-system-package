import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SectionHeader } from '../ui';
import { cn } from '@/ds/lib/cn';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Head = { title: string; titleKey?: string; description?: string };
const BASE = import.meta.env.BASE_URL;
const TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const ATTR = '© <a href="https://carto.com/">CARTO</a>';

/* ── Pins SVG (para L.divIcon) ── */
const PB = 'M16.5 1.5C24.78 1.5 31.5 8.22 31.5 16.5C31.5 21.44 29.11 25.82 25.43 28.55C22.61 30.67 18.58 34.04 17.66 39.48C17.56 40.05 17.08 40.5 16.5 40.5C15.92 40.5 15.44 40.05 15.34 39.48C14.42 34.04 10.39 30.67 7.56 28.55C3.88 25.82 1.5 21.44 1.5 16.5C1.5 8.22 8.22 1.5 16.5 1.5Z';
const pinSvg = (fill: string, inner: string, sz: number) => {
  const h = Math.round((sz * 49) / 33);
  return `<div style="line-height:0;filter:drop-shadow(0 2px 3px rgba(19,32,69,.3))"><svg width="${sz}" height="${h}" viewBox="0 0 33 49"><path d="${PB}" fill="${fill}" stroke="#fff" stroke-width="2"/>${inner}</svg></div>`;
};
const orderPin = (n: number, color: string) => pinSvg(color, `<circle cx="16.5" cy="16.5" r="10.5" fill="#fff"/><text x="16.5" y="16.5" text-anchor="middle" dominant-baseline="central" font-family="DM Sans,sans-serif" font-weight="700" font-size="11" fill="#39414D">${n}</text>`, 30);
const depotPin = () => pinSvg('#132045', '<path d="M24 18.17V16.5L22.75 10.67H9.83L9 16.5V18.17H9.83V23.17H18.17V18.17H21.5V23.17H23.17V18.17H24ZM16.5 21.5H11.5V18.17H16.5V21.5Z" fill="#fff"/>', 34);
const mkIcon = (html: string, sz: number) => {
  const h = Math.round((sz * 49) / 33);
  return L.divIcon({ html, className: '', iconSize: [sz, h], iconAnchor: [Math.round(sz / 2), Math.round((h * 40.5) / 49)] });
};

const DEPOT: L.LatLngTuple = [-33.472, -70.762];
const SCL: L.LatLngTuple = [-33.4489, -70.6693];
const ROUTES: { color: string; stops: L.LatLngTuple[] }[] = [
  { color: '#1F60ED', stops: [[-33.43, -70.61], [-33.44, -70.58], [-33.46, -70.55]] },
  { color: '#8777D9', stops: [[-33.51, -70.77], [-33.5, -70.68], [-33.52, -70.64], [-33.54, -70.6]] },
  { color: '#FFAB00', stops: [[-33.56, -70.57], [-33.55, -70.62], [-33.53, -70.67]] },
  { color: '#FF5630', stops: [[-33.41, -70.57], [-33.43, -70.53]] },
  { color: '#00B8D9', stops: [[-33.61, -70.58], [-33.59, -70.65], [-33.57, -70.71]] },
  { color: '#36B37E', stops: [[-33.37, -70.74], [-33.39, -70.68], [-33.4, -70.63], [-33.42, -70.59]] },
];

/* ── Mapa con controles Ver + Lazo ── */
function MapBox({ setup, compact, className, mapClass, onMap }: { setup: (el: HTMLElement) => L.Map; compact?: boolean; className?: string; mapClass: string; onMap?: (m: L.Map) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [verOpen, setVerOpen] = useState(false);
  const [lasso, setLasso] = useState(false);
  const [pts, setPts] = useState<[number, number][]>([]);
  const [closed, setClosed] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const ptsRef = useRef<[number, number][]>([]);

  useEffect(() => {
    if (!el.current) return;
    const m = setup(el.current);
    mapRef.current = m; onMap?.(m);
    const id = requestAnimationFrame(() => m.invalidateSize());
    return () => { cancelAnimationFrame(id); m.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!verOpen) return;
    const h = () => setVerOpen(false);
    const t = setTimeout(() => document.addEventListener('click', h), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', h); };
  }, [verOpen]);

  const exit = useCallback(() => {
    setLasso(false); setPts([]); setClosed(false); drawing.current = false; ptsRef.current = [];
    mapRef.current?.dragging.enable(); mapRef.current?.scrollWheelZoom.enable();
  }, []);
  const toggleLasso = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lasso) { exit(); return; }
    setLasso(true); mapRef.current?.dragging.disable(); mapRef.current?.scrollWheelZoom.disable();
  };
  const start = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const rect = () => layer.current!.getBoundingClientRect();
    const r = rect();
    drawing.current = true; ptsRef.current = [[e.clientX - r.left, e.clientY - r.top]]; setPts([...ptsRef.current]); setClosed(false);
    const move = (ev: MouseEvent) => { if (!drawing.current) return; ev.preventDefault(); const r2 = rect(); ptsRef.current.push([ev.clientX - r2.left, ev.clientY - r2.top]); setPts([...ptsRef.current]); };
    const up = (ev: MouseEvent) => {
      document.removeEventListener('mousemove', move, { capture: true });
      document.removeEventListener('mouseup', up, { capture: true });
      if (!drawing.current) return; drawing.current = false;
      if (ptsRef.current.length < 3) return;
      const r3 = rect(); ptsRef.current.push([ev.clientX - r3.left, ev.clientY - r3.top]); setPts([...ptsRef.current]); setClosed(true);
      setTimeout(exit, 600);
    };
    document.addEventListener('mousemove', move, { capture: true, passive: false });
    document.addEventListener('mouseup', up, { capture: true });
  };
  const d = pts.length < 2 ? '' : 'M' + pts.map((p) => p.join(',')).join(' L') + (closed ? 'Z' : '');
  const sz = compact ? 12 : 13;
  const btn = (active: boolean) => cn('inline-flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[50px] border px-3.5 text-[13px] font-bold leading-none shadow-[0_1px_4px_rgba(0,0,0,.12)]', active ? 'border-[#4B82FA] bg-[#EDF5FF] text-[#0052CC]' : 'border-[#E1E6ED] bg-white/95 text-[#39414D] hover:border-[#C5D2E7] hover:bg-white');
  return (
    <>
      <div ref={el} className={mapClass} />
      <div className={cn('absolute z-[1000] flex items-center gap-1.5', compact ? 'right-1.5 top-1.5' : 'right-2.5 top-2.5')}>
        <div className="relative">
          <button className={btn(verOpen)} onClick={(e) => { e.stopPropagation(); setVerOpen(!verOpen); }}>
            <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>Ver
          </button>
          {verOpen && (
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-[calc(100%+6px)] z-[100] min-w-[210px] rounded-md border border-[#E1E6ED] bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,.12)]">
              {[['Órdenes en ruta', true], ['Órdenes sin asignar', false], ['Geocercas', false]].map(([l, c]) => (
                <label key={String(l)} className="flex h-9 cursor-pointer items-center gap-[9px] px-3 text-[13px] leading-[normal] text-[#39414D] hover:bg-[#EDF5FF] hover:text-[#0052CC]"><input type="checkbox" defaultChecked={!!c} className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-[#4B82FA]" />{l}</label>
              ))}
            </div>
          )}
        </div>
        <button className={btn(lasso)} onClick={toggleLasso}>
          <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="10" cy="8" rx="7" ry="5" strokeDasharray="2.5,1.5" /><path d="M10 13v7M7 18l3 3 3-3" /></svg>{compact ? 'Lazo' : 'Seleccionar con lazo'}
        </button>
      </div>
      {lasso && (
        <div className={cn('absolute inset-x-0 top-0 z-[1001] flex h-10 items-center gap-2.5 bg-[#1F60ED] px-4 text-white', compact ? 'text-[11px]' : 'text-xs')}>
          {!compact && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><ellipse cx="10" cy="8" rx="7" ry="5" strokeDasharray="2.5,1.5" /><path d="M10 13v7" /></svg>}
          <span className="leading-[normal]">{compact ? 'Modo lazo activo.' : 'Modo lazo activo — dibuja alrededor de las paradas.'}</span>
          <button onClick={exit} className={cn('ml-auto cursor-pointer border-0 bg-transparent font-bold text-white underline', compact ? 'text-[11px]' : 'text-[13px]')}>Cancelar</button>
        </div>
      )}
      {lasso && <svg className={cn('pointer-events-none absolute inset-0 z-[999] h-full w-full', className)}><path fill="rgba(30,96,237,0.12)" stroke="#1F60ED" strokeWidth={compact ? 2 : 2.5} strokeLinejoin="round" strokeLinecap="round" d={d} /></svg>}
      {lasso && <div ref={layer} onMouseDown={start} className="absolute inset-0 z-[998] cursor-crosshair" />}
    </>
  );
}

const baseMap = (el: HTMLElement, center: L.LatLngTuple, zoom: number) => {
  const m = L.map(el, { center, zoom, scrollWheelZoom: false });
  L.tileLayer(TILES, { attribution: ATTR, subdomains: 'abcd', maxZoom: 19 }).addTo(m);
  return m;
};
const routeSetup = (el: HTMLElement) => {
  const m = baseMap(el, DEPOT, 11);
  L.marker(DEPOT, { icon: mkIcon(depotPin(), 34), zIndexOffset: 200 }).addTo(m);
  ROUTES.forEach((r) => { L.polyline(r.stops, { color: r.color, weight: 3, opacity: 0.5 }).addTo(m); r.stops.forEach((p, i) => L.marker(p, { icon: mkIcon(orderPin(i + 1, r.color), 30) }).addTo(m)); });
  return m;
};

/* ── Form con mapa ── */
const FIELD = 'box-border h-8 w-full rounded-md border bg-white px-2.5 text-[14px] leading-5 text-n-7 outline-none focus:border-2 focus:border-b-6 focus:bg-b-1';
const Lbl = ({ children }: { children: ReactNode }) => <label className="text-xs leading-4 text-n-7">{children}</label>;
const PIN_ICO = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-px shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;

function FormDemo() {
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [addr, setAddr] = useState("Av. Libertador B. O'Higgins 1234");
  const [lat, setLat] = useState(''); const [lng, setLng] = useState('');
  const [res, setRes] = useState<any[]>([]); const [dd, setDd] = useState<'off' | 'loading' | 'on'>('off');
  const [focus, setFocus] = useState(-1); const [flash, setFlash] = useState<'ok' | 'err' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const wrap = useRef<HTMLDivElement>(null);

  const setup = (el: HTMLElement) => {
    const m = baseMap(el, SCL, 14);
    const mk = L.marker(SCL, { icon: mkIcon(depotPin(), 34), draggable: true }).addTo(m);
    mk.on('dragend', () => { const ll = mk.getLatLng(); setLat(ll.lat.toFixed(6)); setLng(ll.lng.toFixed(6)); });
    marker.current = mk; map.current = m; return m;
  };
  const moveTo = (la: number, ln: number) => { marker.current?.setLatLng([la, ln]); map.current?.setView([la, ln], 15); };
  const flashFor = (k: 'ok' | 'err') => { setFlash(k); setTimeout(() => setFlash(null), 2000); };
  const input = (v: string) => {
    setAddr(v); clearTimeout(timer.current);
    if (v.length < 3) { setDd('off'); setRes([]); return; }
    setDd('loading');
    timer.current = setTimeout(() => {
      fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(v) + '&format=json&limit=5&accept-language=es').then((r) => r.json()).then((r) => { setRes(r || []); setFocus(-1); setDd('on'); }).catch(() => setDd('off'));
    }, 280);
  };
  const pick = (i: number) => {
    const r = res[i]; if (!r) return;
    setAddr(String(r.display_name || '').split(', ').slice(0, 2).join(', ')); flashFor('ok');
    const la = parseFloat(r.lat), ln = parseFloat(r.lon); setLat(la.toFixed(6)); setLng(ln.toFixed(6)); moveTo(la, ln); setDd('off'); setRes([]);
  };
  const geocode = () => {
    const q = addr.trim(); if (!q) return;
    fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(q) + '&format=json&limit=1&accept-language=es').then((r) => r.json()).then((d) => {
      if (!d?.length) { flashFor('err'); return; }
      const la = parseFloat(d[0].lat), ln = parseFloat(d[0].lon); setLat(la.toFixed(6)); setLng(ln.toFixed(6)); moveTo(la, ln); flashFor('ok');
    }).catch(() => undefined);
  };
  const fromLatLng = () => {
    const la = parseFloat(lat), ln = parseFloat(lng); if (isNaN(la) || isNaN(ln)) return;
    moveTo(Math.max(-90, Math.min(90, la)), Math.max(-180, Math.min(180, ln)));
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocus(Math.min(focus + 1, res.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocus(Math.max(focus - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (focus >= 0 && res[focus]) pick(focus); else geocode(); }
    else if (e.key === 'Escape') setDd('off');
  };
  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setDd('off'); };
    document.addEventListener('click', h); return () => document.removeEventListener('click', h);
  }, []);
  const addrBorder = flash === 'ok' ? 'border-g-5' : flash === 'err' ? 'border-2 border-r-6' : 'border-n-5';

  return (
    <div className="mt-4 rounded-lg border border-n-4 bg-white p-5">
      <div className="flex items-start gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Lbl>Dirección</Lbl>
            <div className="relative" ref={wrap}>
              <input value={addr} onChange={(e) => input(e.target.value)} onKeyDown={key} autoComplete="off" className={cn(FIELD, 'pr-9 hover:bg-n-2 focus:hover:bg-b-1', addrBorder)} />
              <button onClick={geocode} title="Geocodificar dirección" className="absolute inset-y-0 right-0 flex w-[34px] cursor-pointer items-center justify-center rounded-r-md border-0 border-l border-solid border-n-3 bg-transparent text-n-5 hover:border-b-3 hover:bg-b-1 hover:text-b-6">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </button>
              {dd !== 'off' && (
                <div className="absolute inset-x-0 top-[calc(100%+2px)] z-[2000] overflow-hidden rounded-md border border-n-4 bg-white shadow-[0_6px_20px_rgba(19,32,69,.12)]">
                  {dd === 'loading' && <div className="flex items-center gap-2 px-3 py-2.5 text-xs leading-[normal] text-n-5">Buscando…</div>}
                  {dd === 'on' && !res.length && <div className="px-3 py-2.5 text-xs leading-[normal] text-n-5">Sin resultados</div>}
                  {dd === 'on' && res.map((r, i) => {
                    const parts = String(r.display_name || '').split(', ');
                    const ctx = parts.slice(2, 4).join(', ');
                    return (
                      <div key={i} onMouseDown={() => pick(i)} className={cn('flex cursor-pointer items-start gap-2 border-b border-n-3 px-3 py-2 text-[13px] leading-[1.4] last:border-b-0 hover:bg-b-1 hover:text-b-6', i === focus ? 'bg-b-1 text-b-7' : 'text-n-7')}>
                        {PIN_ICO}<div><div className="font-medium">{parts.slice(0, 2).join(', ')}</div>{ctx && <div className="mt-px text-[11px] font-normal text-n-5">{ctx}</div>}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1"><Lbl>Latitud</Lbl><input value={lat} onChange={(e) => setLat(e.target.value)} onBlur={fromLatLng} onKeyDown={(e) => e.key === 'Enter' && fromLatLng()} placeholder="-33.449700" className={cn(FIELD, 'border-n-3 text-[13px] placeholder:text-n-5', lat && 'border-n-5')} /></div>
            <div className="flex flex-1 flex-col gap-1"><Lbl>Longitud</Lbl><input value={lng} onChange={(e) => setLng(e.target.value)} onBlur={fromLatLng} onKeyDown={(e) => e.key === 'Enter' && fromLatLng()} placeholder="-70.669300" className={cn(FIELD, 'border-n-3 text-[13px] placeholder:text-n-5', lng && 'border-n-5')} /></div>
          </div>
          <div className="flex flex-col gap-1"><Lbl>Ciudad</Lbl><input defaultValue="Santiago" className={cn(FIELD, 'border-n-5 hover:bg-n-2 focus:hover:bg-b-1')} /></div>
          <div className="flex flex-col gap-1"><Lbl>Referencia</Lbl><input placeholder="Ej: Frente al metro Baquedano" className={cn(FIELD, 'border-n-3 placeholder:text-n-5 hover:bg-n-2 focus:hover:bg-b-1')} /></div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Lbl>Ubicación en el mapa</Lbl>
          <div className="relative h-[200px] min-h-[144px] flex-1 overflow-hidden rounded-md border border-n-4">
            <MapBox compact setup={setup} mapClass="h-full min-h-[144px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ZIP ── */
function ZipBar({ files, base }: { files: string[]; base: string }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const go = async () => {
    setBusy(true); setErr('');
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip(); const folder = zip.folder('dt-map-pins')!;
      await Promise.all(files.map(async (f) => { const r = await fetch(`${base}/${f}`); folder.file(f, await r.blob()); }));
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'dt-map-pins.zip'; a.click(); URL.revokeObjectURL(a.href);
    } catch (e) { setErr('Could not build ZIP: ' + (e as Error).message); }
    setBusy(false);
  };
  return (
    <div className="mb-7 flex items-center gap-3 rounded-lg border border-n-3 bg-white px-[18px] py-3.5">
      <div className="flex-1 text-[13px] leading-[normal] text-n-5"><strong className="text-n-7">{files.length} SVG files</strong> — Map pins for all states and types{err && <span className="ml-2 text-r-6">{err}</span>}</div>
      <button disabled={busy} onClick={go} className="flex h-9 shrink-0 cursor-pointer items-center gap-[7px] rounded-md border-0 bg-indigo px-[18px] text-xs font-semibold leading-[normal] text-white hover:bg-[#1a2d5a] disabled:cursor-default disabled:opacity-50">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        {busy ? 'Building ZIP…' : 'Download all as ZIP'}
      </button>
    </div>
  );
}

export function MapPins({ data }: { data: Head & any }) {
  const base = String(data.pinsPath || 'sections/assets/pins/').replace(/\/$/, '');
  const url = `${BASE}${base}`;
  const groups: any[] = data.groups ?? [];
  const files = groups.flatMap((g) => g.pins.map((p: any) => p.file));
  return (
    <>
      <SectionHeader data={data} />
      <ZipBar files={files} base={url} />
      <div>
        <h2 className="m-0 mb-5 flex items-center gap-2 text-[18px] font-bold leading-[normal] text-n-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>Map pins
        </h2>
        {groups.map((g) => (
          <div key={g.label} className="mb-9">
            <div className="mb-3.5 flex items-center gap-2.5 border-b-2 border-n-2 pb-2.5">
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: g.color }} />
              <span className="text-[15px] font-bold leading-[normal] text-n-7">{g.label}</span>
              <span className="text-xs leading-[normal] text-n-5">{g.pins.length} variant{g.pins.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {g.pins.map((p: any) => (
                <div key={p.file} className="relative flex w-[120px] flex-col items-center gap-2.5 rounded-lg border border-n-3 bg-white px-3.5 pb-3 pt-4 transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(19,32,69,.1)]">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-md bg-n-1"><img src={`${url}/${p.file}`} alt={p.label} loading="lazy" className="block h-auto max-h-16 w-auto max-w-[60px]" /></div>
                  <div className="text-center text-[11px] leading-[1.3] text-n-5">{p.label}</div>
                  <a href={`${url}/${p.file}`} download={p.file} className="flex h-[26px] w-full cursor-pointer items-center justify-center gap-1 rounded-[4px] border border-n-3 bg-n-1 text-[10px] font-semibold leading-[normal] text-n-7 no-underline hover:border-b-3 hover:bg-b-1 hover:text-b-7">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>SVG
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-9">
          <div className="mb-1.5 flex items-center gap-2 text-[15px] font-bold leading-[normal] text-n-7">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>Map · Flexible component
          </div>
          <div className="mb-3.5 text-xs leading-[normal] text-n-5">Fill-container width standalone. When inside a form: 240px wide (= 1 input column), min-height 144px (= 3 input rows). CartoDB Positron tiles — minimal palette. Center: Santiago.</div>
          <div className="relative w-full overflow-hidden rounded-lg border border-n-3"><MapBox setup={routeSetup} mapClass="h-[380px] w-full" /></div>
          <FormDemo />
        </div>
      </div>
    </>
  );
}
