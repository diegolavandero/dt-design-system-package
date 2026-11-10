import { useEffect, useRef, useState, type ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SectionHeader } from '../ui';
import { cn } from '@/ds/lib/cn';
import { depotPin, orderPin, mkIcon } from './MapPins';
import {
  MIcon as I, MPhone, MStage, MLabel, MWrap, MSheet, MComponentCard, MRules, MCompCard, MBtn, MOrderCard, MRouteCard, MRouteTabs, MChip, MChipRow,
  MDivider, MSyncLabel, MToggle, MRouteHeader, MPin, MTopAppBar, MDateNav, type OrderCardProps,
} from './mobile/kit';

/* eslint-disable @typescript-eslint/no-explicit-any */
type D = any;
const W = ({ label, w = 320, children }: { label: string; w?: number; children: ReactNode }) => <MWrap label={label} w={w}>{children}</MWrap>;
const ADDR = 'Martín de Zamora 5760, 7560969, Las Condes, Región Metropolitana';

/* ───────────── Listas y filtros ───────────── */
function StatusChip({ icon, color, label }: { icon: string; color: string; label: string }) {
  return <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-n-3 bg-white px-2.5 text-xs font-medium leading-[normal] text-n-6"><I n={icon} s={13} c={color} />{label}</span>;
}
export function MLists({ data }: { data: D }) {
  const c = data.components || {};
  const SyncCard = ({ label }: { label: ReactNode }) => (
    <div className="flex items-start gap-2.5 rounded-lg border border-n-3 bg-white p-3">
      <MPin num={1} />
      <div className="min-w-0 flex-1">{label}<div className="mt-1 text-[14px] font-bold leading-[1.35] text-n-7">{ADDR}</div><div className="text-xs leading-[normal] text-n-5">Orden #3829183901234564</div></div>
    </div>
  );
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.tabs?.name} tag="NEW" specs={c.tabs?.specs}
        preview={<MStage><W label="En ruta activa"><MSheet><MRouteTabs active={0} enroute={12} done={0} /></MSheet></W><W label="Terminadas activa"><MSheet><MRouteTabs active={1} enroute={8} done={4} /></MSheet></W></MStage>} />
      <MComponentCard name={c.groupChips?.name} tag="NEW" specs={c.groupChips?.specs}
        preview={<MStage><W label="Chips de grupo (scroll horizontal)"><MSheet><MChipRow><MChip label="Group A" selected /><MChip label="Grupo B" /><MChip label="Grupo C" /><MChip label="Grupo D" /><MChip label="Grupo E" /></MChipRow></MSheet></W></MStage>} />
      <MComponentCard name={c.statusFilters?.name} tag="NEW" specs={c.statusFilters?.specs}
        preview={<MStage><W label="Filtros de estado (pestaña Terminadas)"><MSheet><MChipRow>
          <StatusChip icon="checkmark-filled" color="var(--g6)" label="Entregado (1)" /><MChip label="Parcial (1)" selected tone="amber" /><StatusChip icon="close-filled" color="var(--r6)" label="No entregado (1)" />
        </MChipRow></MSheet></W></MStage>} />
      <MComponentCard name={c.sectionDivider?.name} tag="NEW" specs={c.sectionDivider?.specs}
        preview={<MStage>
          <W label="Separador de conteo"><MSheet><MDivider>3 órdenes</MDivider><div className="p-3"><MOrderCard num={3} addr={ADDR} order="Orden #3829183954324" custom={false} /></div></MSheet></W>
          <W label="Banner tienda solicitante"><MSheet><MDivider tone="blue">Tienda solicitante: Bodega 1</MDivider><div className="p-3"><MOrderCard num={1} addr={ADDR} order="Orden #3829183901471454571" person="Raúl Ríos" time="8:00 – 9:00" items={3} /></div></MSheet></W>
        </MStage>} />
      <MComponentCard name={c.syncLabel?.name} tag="NEW" specs={c.syncLabel?.specs} notes="Comunican el estado offline de cada orden. Ver detalle del flujo completo en Toasts y banners → barra de sincronización."
        preview={<MStage><W label="Sin sincronizar"><SyncCard label={<MSyncLabel state="idle" />} /></W><W label="Sincronizando"><SyncCard label={<MSyncLabel state="syncing" />} /></W></MStage>} />
      <MComponentCard name={c.emptyState?.name} tag="NEW" specs={c.emptyState?.specs}
        preview={<MStage><W label="Estado vacío — Terminadas"><MSheet><div className="px-6 py-10 text-center"><div className="flex justify-center"><I n="location" s={32} c="var(--n5)" /></div><div className="mt-3 text-[14px] leading-normal text-n-6">Aquí podrás encontrar y ver el detalle de tus órdenes ya gestionadas.</div></div></MSheet></W></MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Inputs (interactivos) ───────────── */
const Col = ({ children, w = 260 }: { children: ReactNode; w?: number }) => <div className="rounded-xl border border-n-3 bg-white p-4" style={{ width: w }}>{children}</div>;
const FldLbl = ({ children, req }: { children: ReactNode; req?: boolean }) => <div className="mb-[5px] text-xs font-medium leading-[normal] text-n-6">{req && '*'}{children}</div>;
const fieldCls = 'box-border h-11 w-full rounded-md bg-white px-3 text-[14px] leading-none text-n-7outline-none';
function TInput({ placeholder, maxLength, valid, className, type = 'text', defaultValue, disabled, onInput }: { placeholder?: string; maxLength?: number; valid?: boolean | null; className?: string; type?: string; defaultValue?: string; disabled?: boolean; onInput?: (v: string) => void }) {
  const [v, setV] = useState(defaultValue ?? ''); const [f, setF] = useState(false);
  const border = disabled ? 'border border-n-3' : f ? 'border-2 border-b-6 bg-b-1' : valid === true ? 'border border-g-5' : valid === false ? 'border border-r-6' : v ? 'border border-n-5' : 'border border-n-3';
  return <input type={type} value={v} placeholder={placeholder} maxLength={maxLength} disabled={disabled} onFocus={() => setF(true)} onBlur={() => setF(false)} onChange={(e) => { setV(e.target.value); onInput?.(e.target.value); }}
    className={cn(fieldCls, border, f && 'bg-b-1', disabled && '!cursor-not-allowed !bg-n-1 text-n-5', className)} />;
}
function Pw({ label, defaultValue, hint }: { label: string; defaultValue?: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <FldLbl req>{label}</FldLbl>
      <div className="relative"><TInput type={show ? 'text' : 'password'} placeholder="Ingresa tu contraseña" defaultValue={defaultValue} className="pr-10" />
        <span onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 flex -translate-y-1/2 cursor-pointer"><I n={show ? 'view--off' : 'view'} s={18} c="var(--n5)" /></span></div>
      {hint && <div className="mt-1 text-xs leading-[normal] text-n-5">{hint}</div>}
    </div>
  );
}
function RutField() {
  const [msg, setMsg] = useState<'' | 'ok' | 'bad'>('');
  const [len, setLen] = useState(0);
  return (
    <div className="mb-3.5">
      <FldLbl req>RUT de quien recibe</FldLbl>
      <TInput placeholder="16.999.999-9" maxLength={12} valid={len >= 9 ? msg === 'ok' : null} onInput={(v) => { setLen(v.length); setMsg(v.length >= 9 ? (/^[0-9]{7,8}-[0-9kK]$/.test(v.replace(/\./g, '')) ? 'ok' : 'bad') : ''); }} />
      <div className={cn('mt-1 min-h-4 text-xs leading-[normal]', msg === 'ok' ? 'text-g-6' : 'text-r-6')}>{msg === 'ok' ? 'RUT válido' : msg === 'bad' ? 'RUT inválido' : ''}</div>
    </div>
  );
}
function SearchBar() {
  const [v, setV] = useState(''); const [f, setF] = useState(false); const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={cn('mb-4 box-border flex h-11 items-center gap-2 rounded-md bg-white px-3', f ? 'border-2 border-b-6' : 'border border-n-3')}>
      <I n="search" s={16} c="var(--n5)" />
      <input ref={ref} value={v} onChange={(e) => setV(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)} placeholder="Buscar por orden, dirección, cliente…" className="min-w-0 flex-1 border-0 bg-transparent text-[14px] leading-[normal] text-n-7 outline-none" />
      {v && <span className="flex shrink-0 cursor-pointer items-center" onClick={() => { setV(''); ref.current?.focus(); }}><I n="close-filled" s={16} c="var(--n5)" /></span>}
      <span className="flex shrink-0 text-n-6"><I n="document-import" s={18} c="var(--n6)" /></span>
    </div>
  );
}
const CORRECT = '321480';
function PinInput() {
  const [vals, setVals] = useState<string[]>(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const full = vals.every(Boolean); const ok = full && vals.join('') === CORRECT;
  const [focus, setFocus] = useState(0);
  const set = (i: number, raw: string) => {
    const d = raw.replace(/[^0-9]/g, '').slice(-1);
    setVals((p) => { const n = [...p]; n[i] = d; return n; });
    if (d) refs.current[i + 1]?.focus();
  };
  const key = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !vals[i] && i > 0) { e.preventDefault(); setVals((p) => { const n = [...p]; n[i - 1] = ''; return n; }); refs.current[i - 1]?.focus(); }
  };
  const reset = () => { setVals(Array(6).fill('')); refs.current[0]?.focus(); };
  return (
    <>
      <MLabel>Prueba: ingresa 321480 (correcto) o cualquier otro (error)</MLabel>
      <div className="mb-2 flex justify-center gap-2">
        {vals.map((v, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} value={v} maxLength={1} inputMode="numeric" onFocus={() => setFocus(i)} onChange={(e) => set(i, e.target.value)} onKeyDown={(e) => key(i, e)}
            className={cn('box-border h-[52px] w-10 rounded-md bg-white text-center text-[20px] font-bold leading-[normal] text-n-7 outline-none',
              full ? (ok ? 'border border-g-5' : 'border border-r-6') : focus === i || v ? (focus === i ? 'border-2 border-b-6' : 'border border-n-3') : 'border border-n-3')} />
        ))}
      </div>
      <div className={cn('mb-3.5 min-h-[18px] text-center text-xs font-medium leading-[normal]', ok ? 'text-g-6' : 'text-r-6')}>{full ? (ok ? 'Ingresado correctamente' : 'Código incorrecto') : ''}</div>
      <button onClick={reset} className="h-10 w-full cursor-pointer rounded-full border border-n-3 bg-white text-[13px] font-bold leading-none text-n-5">Limpiar / reintentar</button>
      <div className="mt-3.5 text-center text-xs leading-[normal] text-n-6">Si el cliente no puede proporcionar el código contacta a tu <span className="font-bold text-b-6">Supervisor.</span></div>
    </>
  );
}
function LiveStepper({ label, init, trash }: { label: string; init: number; trash?: boolean }) {
  const [v, setV] = useState(init);
  const t = !!trash && v <= 1;
  const b = 'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border p-0 text-base font-medium leading-[normal] text-n-6';
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[14px] leading-[normal] text-n-7">{label}</span>
      <span className="inline-flex items-center rounded-md">
        <button onClick={() => setV((x) => Math.max(0, x - 1))} className={cn(b, t ? 'border-r-6 bg-r-6' : 'border-n-3 bg-white')}>{t ? <I n="delete" s={14} c="#fff" /> : '−'}</button>
        <span className="min-w-10 text-center text-[14px] font-medium leading-[normal] text-n-7">{v}</span>
        <button onClick={() => setV((x) => x + 1)} className={cn(b, 'border-n-3 bg-white')}>+</button>
      </span>
    </div>
  );
}
function Dropdown({ placeholder, options, searchable }: { placeholder: string; options: string[]; searchable?: boolean }) {
  const [open, setOpen] = useState(false); const [val, setVal] = useState(''); const [q, setQ] = useState('');
  const shown = options.filter((o) => !q || o.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="relative">
      <div onClick={() => setOpen((o) => !o)} className={cn('box-border flex h-11 cursor-pointer items-center justify-between rounded-md bg-white px-3', open ? 'border-2 border-b-6' : val ? 'border border-n-5' : 'border border-n-3')}>
        <span className={cn('text-[14px] leading-[normal]', val ? 'text-n-7' : 'text-n-6')}>{val || placeholder}</span>
        <span className={cn('flex transition-transform duration-150', open && 'rotate-180')}><I n="chevron--down" s={16} c="var(--n5)" /></span>
      </div>
      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-n-3 bg-white shadow-[0_4px_16px_rgba(0,0,0,.12)]">
          {searchable && <div className="px-2 pt-2"><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="box-border h-9 w-full rounded-md border border-n-3 bg-white px-2.5 text-[13px] leading-[normal] text-n-7 outline-none focus:border-2 focus:border-b-6" /></div>}
          {shown.map((o) => <div key={o} onClick={() => { setVal(o); setOpen(false); setQ(''); }} className="flex h-11 cursor-pointer items-center px-3 text-[14px] leading-[normal] text-n-7 hover:bg-b-1">{o}</div>)}
        </div>
      )}
    </div>
  );
}
function Textarea({ init = '' }: { init?: string }) {
  const [v, setV] = useState(init); const [f, setF] = useState(false);
  return (
    <>
      <div className={cn('rounded-md', f ? 'border-2 border-b-6 bg-b-1' : v ? 'border border-n-5 bg-white' : 'border border-n-3 bg-white')}>
        <textarea value={v} rows={4} maxLength={300} placeholder={init ? undefined : 'Agrega una observación…'} onChange={(e) => setV(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
          className="box-border block min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2.5 text-[14px] leading-normal text-n-7 outline-none" />
      </div>
      <div className="mt-1 text-right"><span className="text-xs leading-[normal] text-n-5">{v.length}/300</span></div>
    </>
  );
}
export function MInputs({ data }: { data: D }) {
  const c = data.components || {};
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.textInput?.name} tag="EXTENDED" specs={c.textInput?.specs} notes="Mismos tokens que el input de escritorio con alto 44dp. Escribe para ver filled; el RUT valida el formato en tiempo real."
        preview={<MStage>
          <Col><div className="mb-3.5"><FldLbl>Texto</FldLbl><TInput placeholder="Escribir" /></div><div><FldLbl req>Monto</FldLbl><TInput placeholder="Ingresa monto" /><div className="mt-1 text-xs leading-[normal] text-n-5">*Requerido. Valor con opción decimal, ej. $500,67</div></div></Col>
          <Col><RutField /><div><FldLbl>Número</FldLbl><TInput defaultValue="No editable" disabled /></div></Col>
          <Col><MLabel>Variante password</MLabel><div className="mb-3.5"><Pw label="Contraseña" /></div><Pw label="Contraseña (con valor)" defaultValue="MyPass123!" hint="Toca el ojo para mostrar/ocultar" /></Col>
        </MStage>} />
      <MComponentCard name={c.searchBar?.name} tag="NEW" specs={c.searchBar?.specs} notes="Barra persistente en la parte superior del bottom sheet de búsqueda. La X aparece al escribir y limpia el campo."
        preview={<MStage><Col w={300}>
          <MLabel>Barra de búsqueda</MLabel><SearchBar />
          <MLabel>Estado vacío del sheet de búsqueda</MLabel>
          <div className="rounded-lg bg-n-1 px-2.5 py-[18px] text-center">
            <div className="flex justify-center"><I n="location" s={24} c="var(--n5)" /></div>
            <div className="mb-3.5 mt-2.5 text-[13px] leading-normal text-n-6">Puedes buscar por dirección, número de orden, cliente o ítem.</div>
            <button className="inline-flex h-9 cursor-pointer items-center gap-[5px] rounded-full border border-b-6 bg-white px-3.5 text-[13px] font-bold leading-none text-b-6"><I n="document-import" s={16} c="var(--b6)" /> Abrir escáner</button>
          </div>
        </Col></MStage>} />
      <MComponentCard name={c.pinInput?.name} tag="NEW" specs={c.pinInput?.specs} notes="Ingresa 321480 para ver estado correcto; cualquier otro código activa el error. Backspace retrocede entre casillas."
        preview={<MStage><Col w={336}><PinInput /></Col></MStage>} />
      <MComponentCard name={c.stepper?.name} tag="NEW" specs={c.stepper?.specs} notes="El botón − se convierte en basurero rojo al llegar al mínimo eliminable (valor 1). Presiona + y − para probar."
        preview={<MStage>
          <Col w={280}><MLabel>Con basurero (trash=true)</MLabel><LiveStepper label="Entregado" init={1} trash /><LiveStepper label="Ítem A" init={2} trash /><LiveStepper label="Ítem B" init={3} trash /></Col>
          <Col w={280}><MLabel>Estándar</MLabel><LiveStepper label="Cantidad" init={0} /><LiveStepper label="Adultos" init={1} />
            <div className="mt-1"><FldLbl>Razón</FldLbl><div className="flex h-11 items-center justify-between rounded-md border border-n-3 bg-white px-3 text-[14px] leading-[normal] text-n-6"><span>Selecciona razón</span><I n="chevron--down" s={16} c="var(--n5)" /></div></div>
          </Col>
        </MStage>} />
      <MComponentCard name={c.dropdown?.name} tag="EXTENDED" specs={c.dropdown?.specs} notes="Clic en el trigger para abrir/cerrar. La variante buscable filtra opciones en tiempo real."
        preview={<MStage><Col w={280}>
          <MLabel>Dropdown estándar</MLabel><div className="mb-4"><Dropdown placeholder="Selecciona medio de transacción" options={['Efectivo', 'Transferencia', 'Cheque', 'Redcompra']} /></div>
          <MLabel>Variante buscable</MLabel><Dropdown placeholder="Buscar subestado…" searchable options={['No entregado', 'Cliente ausente', 'Dirección errónea', 'Rechazo del cliente', 'Sin tiempo']} />
        </Col></MStage>} />
      <MComponentCard name={c.textarea?.name} tag="EXTENDED" specs={c.textarea?.specs} notes="Foco con borde azul y fondo var(--b1). El contador de caracteres se actualiza mientras escribes."
        preview={<MStage>
          <Col w={280}><MLabel>Vacío</MLabel><FldLbl>Observaciones</FldLbl><Textarea /></Col>
          <Col w={280}><MLabel>Con valor inicial (filled)</MLabel><FldLbl>Observaciones</FldLbl><Textarea init="El cliente indicó que el portón lateral estará abierto." /></Col>
        </MStage>} />
      <div className="mb-5 rounded-lg border border-b-3 bg-b-1 p-5"><h3 className="m-0 mb-1.5 text-[14px] font-bold leading-[normal] text-b-7">Regla — pickers nativos</h3><div className="text-[13px] leading-[1.6] text-n-7">{data.nativeRule || ''}</div></div>
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Bottom sheet: mapa + lista arrastrable ───────────── */
const STOPS: L.LatLngTuple[] = [[-33.405, -70.575], [-33.412, -70.56], [-33.418, -70.547], [-33.398, -70.553], [-33.392, -70.566], [-33.401, -70.582]];
const DEPOT: L.LatLngTuple = [-33.42, -70.585];
function SheetMap({ zoom = 13, className }: { zoom?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const m = L.map(ref.current, { center: [-33.405, -70.565], zoom, scrollWheelZoom: false, zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 19 }).addTo(m);
    L.marker(DEPOT, { icon: mkIcon(depotPin(), 34), zIndexOffset: 200 }).addTo(m);
    L.polyline(STOPS, { color: '#1F60ED', weight: 3, opacity: 0.5 }).addTo(m);
    STOPS.forEach((p, i) => L.marker(p, { icon: mkIcon(orderPin(i + 1, '#1F60ED'), 30) }).addTo(m));
    const id = setTimeout(() => m.invalidateSize(), 120);
    return () => { clearTimeout(id); m.remove(); };
  }, [zoom]);
  return <div ref={ref} className={className} />;
}
const DEMO_ORDERS: OrderCardProps[] = [
  { num: 1, addr: ADDR, order: 'Orden #3829183901234564', person: 'Raúl Ríos', time: '8:00 – 9:00', items: 3 },
  { num: 2, addr: 'Av. Las Condes 8977 Casa A, Las Condes', order: 'Orden #3829183901840564', person: 'Ana López', time: '9:00 – 9:30', items: 1, pin: 'outline' },
  { num: 3, addr: 'Av. Apoquindo 4501, Las Condes', order: 'Orden #3829183901112233', person: 'Pedro Soto', time: '9:30 – 10:00', items: 2, pin: 'outline' },
  { num: 4, addr: 'Camino El Alba 9500, Las Condes', order: 'Orden #3829183901445566', person: 'María Pérez', time: '10:00 – 11:00', items: 5, pin: 'outline' },
  { num: 5, addr: 'Av. Kennedy 5413, Las Condes', order: 'Orden #3829183901778899', person: 'Jorge Díaz', time: '11:00 – 11:30', items: 1, pin: 'outline' },
  { num: 6, addr: 'Isidora Goyenechea 3000, Las Condes', order: 'Orden #3829183901990011', person: 'Carla Muñoz', time: '11:30 – 12:00', items: 4, pin: 'outline' },
];
type SS = 'full' | 'mid' | 'map';
const OFF: Record<SS, number> = { full: 48, mid: 320, map: 529 };
const LBL: Record<SS, string> = { full: 'Lista completa', mid: 'Media (default)', map: 'Mapa completo' };
function MapListDemo() {
  const [state, setState] = useState<SS>('mid');
  const [drag, setDrag] = useState<number | null>(null); // y actual durante arrastre
  const start = useRef<number | null>(null);
  const down = (e: React.PointerEvent) => { if (state === 'full' && e.currentTarget.id === 'list') return; e.preventDefault(); start.current = e.clientY; setDrag(OFF[state]); (e.target as Element).setPointerCapture?.(e.pointerId); };
  const move = (e: React.PointerEvent) => { if (start.current === null) return; setDrag(Math.min(OFF.map, Math.max(OFF.full, OFF[state] + e.clientY - start.current))); };
  const up = (e: React.PointerEvent) => {
    if (start.current === null) return;
    const dy = e.clientY - start.current; start.current = null; setDrag(null);
    if (Math.abs(dy) < 50) return;
    setState((s) => (dy < 0 ? (s === 'map' ? 'mid' : 'full') : (s === 'full' ? 'mid' : 'map')));
  };
  const y = drag ?? OFF[state];
  return (
    <div className="relative h-[640px] w-[360px] max-w-full shrink-0 overflow-hidden rounded-[18px] border border-n-3 bg-n-1 shadow-[0_1px_3px_rgba(19,32,69,.08)]">
      <SheetMap className="absolute inset-0 z-[1]" />
      <div className="pointer-events-none absolute left-1/2 top-3 z-[600] -translate-x-1/2 whitespace-nowrap rounded-full bg-n-7 px-2.5 py-1 text-[11px] font-semibold leading-[normal] text-white opacity-[.92]">{LBL[state]}</div>
      <div className="absolute inset-x-0 top-0 z-[500] flex h-[640px] select-none flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-2px_12px_rgba(19,32,69,.18)]"
        style={{ transform: `translateY(${y}px)`, transition: drag === null ? 'transform .28s cubic-bezier(.2,.8,.3,1)' : 'none' }}>
        <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} className={cn('shrink-0 touch-none bg-n-1 [&>*]:!bg-n-1', drag !== null ? 'cursor-grabbing' : 'cursor-grab')}>
          <MRouteHeader title="332131491204912" />
          <MRouteTabs active={0} enroute={12} done={0} grey />
          <MChipRow grey><MChip label="Group A" selected /><MChip label="Grupo B" /><MChip label="Grupo C" /></MChipRow>
        </div>
        <div id="list" onPointerDown={down} onPointerMove={(e) => { if (state !== 'full' || start.current !== null) move(e); }} onPointerUp={up} onPointerCancel={up}
          className={cn('flex flex-1 touch-pan-y flex-col gap-2 bg-n-1 p-3', state === 'full' ? 'overflow-y-auto' : 'overflow-y-hidden')}>
          {DEMO_ORDERS.map((o) => <MOrderCard key={o.num} {...o} />)}
        </div>
      </div>
    </div>
  );
}
const DemoHint = ({ extra }: { extra?: boolean }) => (
  <div className="max-w-[280px] text-xs leading-[1.6] text-n-5">
    <div className="mb-2.5 text-[11px] font-bold uppercase leading-[normal] tracking-[.07em] text-n-5">Cómo probarlo</div>
    Arrastra el sheet hacia arriba o abajo (mouse o touch).<br /><br />
    · Inicia en altura <b>media</b> (default).<br />· Swipe up → <b>lista completa</b>.<br />· Swipe down → <b>mapa completo</b>.<br />
    · Desde lista completa o mapa completo, el gesto contrario vuelve a la altura media — nunca salta dos estados.
    {extra && <><br /><br />El mapa es el mismo tipo de Map elements (CARTO light) con pins de gota numerados.</>}
  </div>
);
const H = 533;
function StaticSheet({ top, zoom, children }: { top: number; zoom?: number; children: ReactNode }) {
  return (
    <MPhone width={300} height={H}>
      <div className="relative" style={{ height: H }}>
        <SheetMap zoom={zoom} className="absolute inset-0 z-[1]" />
        <div className="absolute inset-x-0 bottom-0 z-[2] overflow-hidden rounded-t-2xl bg-n-1 shadow-[0_-2px_12px_rgba(19,32,69,.18)]" style={{ top }}>{children}</div>
      </div>
    </MPhone>
  );
}
function ModalBox({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="w-[280px] rounded-xl bg-white p-5 shadow-[0_8px_32px_rgba(19,32,69,.2)]">
      <div className="mb-1.5 text-[15px] font-bold leading-[normal] text-n-7">{title}</div>
      <div className="mb-4 text-[13px] leading-normal text-n-5">{body}</div>
      <div className="flex gap-2.5">{children}</div>
    </div>
  );
}
export function MBottomSheets({ data }: { data: D }) {
  const c = data.components || {};
  const sTabs = <MRouteTabs active={0} enroute={12} done={0} grey />;
  const sChips = <MChipRow grey><MChip label="Group A" selected /><MChip label="Grupo B" /><MChip label="Grupo C" /></MChipRow>;
  const list = (cards: ReactNode) => <div className="flex flex-col gap-2 bg-n-1 p-3">{cards}</div>;
  const mi = (icon: string, label: string) => <div className="flex h-11 items-center gap-3 px-3.5 text-[14px] leading-[normal] text-n-7"><I n={icon} s={18} c="var(--n6)" />{label}</div>;
  const mt = (label: string) => <div className="flex h-11 items-center justify-between px-3.5 text-[14px] leading-[normal] text-n-7"><span className="flex items-center gap-3"><I n="route" s={18} c="var(--n6)" />{label}</span><MToggle on /></div>;
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.sheet?.name} tag="NEW" specs={c.sheet?.specs} notes="Tres alturas con snap: colapsada (máximo mapa), media (default) y completa (lista con scroll)."
        preview={<MStage>
          <W label="Colapsado" w={300}><StaticSheet top={H - 111}><MRouteHeader title="332131491204912" /></StaticSheet></W>
          <W label="Media (default)" w={300}><StaticSheet top={Math.round(H / 2)}><MRouteHeader title="332131491204912" />{sTabs}{sChips}{list(<MOrderCard {...DEMO_ORDERS[0]} />)}</StaticSheet></W>
          <W label="Completa" w={300}><StaticSheet top={Math.round((H * 48) / 640)} zoom={14}><MRouteHeader title="332131491204912" />{sTabs}{sChips}{list(<><MOrderCard {...DEMO_ORDERS[0]} /><MOrderCard {...DEMO_ORDERS[1]} addr="Av. Las Condes 8977 Casa A, Las Condes" /></>)}</StaticSheet></W>
        </MStage>} />
      {c.sheetDemo && <MComponentCard name={c.sheetDemo.name} tag="NEW" specs={c.sheetDemo.specs} notes="Demo interactivo: el sheet responde a arrastre con mouse o touch y hace snap a la altura siguiente según la dirección del gesto."
        preview={<MStage gap={24}><MapListDemo /><DemoHint extra /></MStage>} />}
      <MComponentCard name={c.routeHeader?.name} tag="NEW" specs={c.routeHeader?.specs}
        preview={<MStage>
          <W label="Header de ruta" w={300}><MSheet><MRouteHeader title="Sector oriente 2040 mañana" /></MSheet></W>
          <W label="Header en detalle de orden (back)" w={300}><MSheet><MRouteHeader back title="Martín de Zamora 5760, Las Condes" meta={false} /></MSheet></W>
        </MStage>} />
      <MComponentCard name={c.actionMenu?.name} tag="NEW" specs={c.actionMenu?.specs}
        preview={<MStage><div><MLabel>Menú contextual (versión mapa)</MLabel>
          <div className="w-60 overflow-hidden rounded-[10px] border border-n-3 bg-white shadow-[0_4px_16px_rgba(19,32,69,.14)]">
            {mi('refresh', 'Actualizar')}{mi('planner-route', 'Optimizar ruta')}{mi('group', 'Gestión masiva')}{mi('phone', 'Llamada de emergencia')}{mi('message', 'Mensaje de emergencia')}
            <div className="border-t border-n-2" />{mt('Línea del mapa')}{mt('Dígitos del mapa')}
          </div></div></MStage>} />
      <MComponentCard name={c.unsavedModal?.name} tag="NEW" specs={c.unsavedModal?.specs}
        preview={<MStage>
          <div><MLabel>Variante salir</MLabel><ModalBox title="Cambios sin guardar" body="¿Estás seguro de cerrar la gestión y perder los cambios?"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Salir" variant="danger" className="flex-1" /></ModalBox></div>
          <div><MLabel>Variante seguir</MLabel><ModalBox title="Cambios sin guardar" body="¿Estás seguro de cerrar la gestión y perder los cambios?"><MBtn label="Confirmar" variant="outline" className="flex-1" /><MBtn label="Seguir gestionando" className="flex-1" /></ModalBox></div>
        </MStage>} />
      <MRules rules={data.navigationRules} title="Reglas de navegación" />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Pantalla: Mapa + Lista ───────────── */
export function MScreenMapList({ data }: { data: D }) {
  const c = data.components || {};
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.screen?.name} tag="NEW" specs={c.screen?.specs} notes="Plantilla funcional: el sheet responde a arrastre con snap entre las tres alturas. El mapa y los gestos se inicializan al cargar la sección."
        preview={<MStage gap={24}><MapListDemo /><DemoHint /></MStage>} />
      <MCompCard composition={data.composition} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Pantalla: Lista de rutas ───────────── */
const PICK = ['Ejemplo 1', 'Ejemplo 2', 'Ejemplo 3'];
function RouteScreen({ muted, toast, pickup, empty, available }: { muted?: boolean; toast?: boolean; pickup?: boolean; empty?: boolean; available?: boolean }) {
  const [tOpen, setTOpen] = useState(true); const [open, setOpen] = useState(false); const [val, setVal] = useState('');
  return (
    <MPhone width={300} height={560}>
      <div className="relative flex h-[560px] flex-col">
        {toast && tOpen && (
          <div className="absolute inset-x-2 top-2 z-10"><div className="flex items-start gap-2.5 rounded-lg bg-n-7 px-3.5 py-3 shadow-[0_4px_16px_rgba(19,32,69,.24)]">
            <I n="warning" s={16} c="var(--o5)" /><span className="flex-1 text-xs leading-[1.4] text-white">Para completar la acción debes activar el botón «Disponible».</span>
            <span className="flex shrink-0 cursor-pointer items-center" onClick={() => setTOpen(false)}><I n="close-filled" s={14} c="var(--n4)" /></span>
          </div></div>
        )}
        <MTopAppBar />
        {pickup && (
          <div className="relative z-20 mx-3 mt-3">
            <div onClick={() => setOpen((o) => !o)} className={cn('box-border flex h-10 cursor-pointer items-center justify-between rounded-md bg-white px-3', open ? 'border-2 border-b-6' : val ? 'border border-n-5' : 'border border-n-3')}>
              <span className={cn('text-[14px] leading-[normal]', val ? 'text-n-7' : 'text-n-6')}>{val || 'Selecciona tu punto de retiro'}</span>
              <span className={cn('flex transition-transform duration-150', open && 'rotate-180')}><I n="chevron--down" s={16} c="var(--n5)" /></span>
            </div>
            {open && <div className="absolute inset-x-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-md border border-n-3 bg-white shadow-[0_4px_16px_rgba(0,0,0,.12)]">
              {PICK.map((o) => <div key={o} onClick={() => { setVal(o); setOpen(false); }} className="flex h-11 cursor-pointer items-center px-3 text-[14px] leading-[normal] text-n-7 hover:bg-b-1">{o}</div>)}
            </div>}
          </div>
        )}
        <MDateNav label="Rutas de hoy 01-01-24" />
        {empty
          ? <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-6"><I n="route" s={36} c="var(--n4)" /><span className="text-[13px] leading-[normal] text-n-5">No hay rutas disponibles</span></div>
          : <div className="flex flex-col gap-2 overflow-hidden px-3 pb-3">{['332131491204912', '332131491204913', '332131491204914'].map((t) => <MRouteCard key={t} title={t} muted={muted} plus24={!muted} />)}</div>}
        <div className="mt-auto flex shrink-0 items-center justify-center gap-2.5 border-t border-n-3 bg-white px-4 py-2.5"><MToggle on={available} /><span className="text-[14px] font-medium leading-[normal] text-n-7">Disponible</span></div>
      </div>
    </MPhone>
  );
}
export function MScreenRouteList({ data }: { data: D }) {
  const c = data.components || {};
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.screen?.name} tag="NEW" specs={c.screen?.specs} notes="Home del conductor. El toggle «Disponible» habilita la operación: apagado, las rutas se muestran en gris («Sin iniciar») y al intentar iniciar se muestra el toast de bloqueo."
        preview={<MStage>
          <W label="Rutas disponibles (default)" w={300}><RouteScreen available /></W>
          <W label="Con punto de retiro" w={300}><RouteScreen available pickup /></W>
          <W label="No disponible (toggle apagado)" w={300}><RouteScreen muted toast /></W>
          <W label="Sin rutas" w={300}><RouteScreen available empty /></W>
        </MStage>} />
      <MCompCard composition={data.composition} />
      <MRules rules={data.rules} />
    </>
  );
}
