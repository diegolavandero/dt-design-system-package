import { useRef, useState, type ReactNode } from 'react';
import { Card, CardHeader, CopyCode, SectionHeader } from '../ui';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };

/* ───────────── Botón `.btn` del chrome de la documentación ───────────── */
const BTN = {
  pri: 'bg-b-6 text-white hover:bg-b-6/90 active:bg-b-7',
  sec: '!border-n-4 bg-white text-b-7 hover:bg-n-1 active:!border-b-6 active:bg-b-1 active:text-b-6',
  sub: 'bg-transparent text-b-7 hover:bg-[rgba(48,110,242,.08)]',
  dan: 'bg-r-6 text-white hover:bg-r-7',
} as const;
export function Btn({ kind, children }: { kind: keyof typeof BTN; children: ReactNode }) {
  return <button type="button" className={cn('box-border inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-transparent px-4 text-base font-bold leading-8 transition-colors duration-[120ms]', BTN[kind])}>{children}</button>;
}

/* ───────────── Alert canónico (dsAlert) ───────────── */
const TC: Record<string, { bg: string; bd: string; fg: string; ic: string; ip: string }> = {
  info: { bg: 'var(--b2)', bd: 'var(--b3)', fg: 'var(--b7)', ic: 'var(--b6)', ip: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
  neutral: { bg: 'var(--n2)', bd: 'var(--n3)', fg: 'var(--n6)', ic: 'var(--n5)', ip: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z' },
  warning: { bg: 'var(--o1)', bd: 'var(--o3)', fg: 'var(--n7)', ic: 'var(--o7)', ip: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' },
  error: { bg: 'var(--r1)', bd: '#f5c2c7', fg: 'var(--r7)', ic: 'var(--r6)', ip: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' },
  success: { bg: 'var(--g1)', bd: 'var(--g2)', fg: 'var(--g7)', ic: 'var(--g6)', ip: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z' },
};
export interface AlertRow { text?: string; title?: string; paragraphs?: string[]; hasClose?: boolean; extraActions?: string[] }
const ACTION: Record<string, ReactNode> = {
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
};
const iconBtn = 'flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0 leading-[0]';
export function DsAlert({ row, type }: { row: AlertRow | string; type: string }) {
  const r: AlertRow = typeof row === 'string' ? { text: row, hasClose: false } : row;
  const c = TC[type] ?? TC.info;
  const box = { background: c.bg, border: `1px solid ${c.bd}`, color: c.fg };
  const close = r.hasClose !== false && (
    <button type="button" title="Dismiss" className={cn(iconBtn, 'opacity-55')}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </button>
  );
  if (r.title) {
    return (
      <div className="relative rounded-md py-3.5 pl-4 pr-10" style={box}>
        {r.hasClose !== false && <div className="absolute right-2.5 top-2.5">{close}</div>}
        <strong className="mb-2 block text-base font-bold leading-[1.4]">{r.title}</strong>
        {(r.paragraphs ?? (r.text ? [r.text] : [])).map((p, i) => <p key={i} className="m-0 mb-1.5 text-sm font-normal leading-normal">{p}</p>)}
      </div>
    );
  }
  const lines = (r.text ?? '').split('\n');
  return (
    <div className="flex items-center gap-2.5 rounded-md px-3 py-2.5" style={box}>
      <svg className="mt-px shrink-0" width="16" height="16" viewBox="0 0 24 24" fill={c.ic}><path d={c.ip} /></svg>
      <span className="flex-1 text-sm font-normal leading-[1.4]">{lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</span>
      {r.extraActions?.map((a) => (
        <button key={a} type="button" className={cn(iconBtn, 'opacity-60')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{ACTION[a]}</svg></button>
      ))}
      {!r.extraActions?.length && close}
    </div>
  );
}

export function Alerts({ data }: { data: Head & { types?: string[]; groups?: Array<{ rows: AlertRow[] }> } }) {
  const types = data.types ?? ['info', 'neutral', 'warning', 'error', 'success'];
  return (
    <>
      <SectionHeader data={data} />
      {data.groups?.map((g, gi) => (
        <div key={gi} className="mb-6 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${types.length},1fr)` }}>
          {g.rows.flatMap((row, ri) => types.map((t) => <DsAlert key={`${ri}-${t}`} row={row} type={t} />))}
        </div>
      ))}
    </>
  );
}

/* ───────────── Tokens: tabla Token/Value ───────────── */
const thTok = 'px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[.05em] text-n-5';
function TokenTable({ tokens }: { tokens: Record<string, string> }) {
  return (
    <table className="w-full border-collapse text-xs">
      <thead><tr className="border-b border-n-3 bg-n-2"><th className={thTok}>Token</th><th className={thTok}>Value</th></tr></thead>
      <tbody>
        {Object.entries(tokens).map(([k, v]) => (
          <tr key={k} className="border-b border-n-3">
            <td className="px-3 py-2 text-xs font-semibold text-n-7">{k}</td>
            <td className="px-3 py-2 text-xs text-b-6">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
const descP = 'm-0 mb-6 text-base leading-normal text-n-6';

/* ───────────── IMAGE UPLOADER ───────────── */
const USER = <svg viewBox="0 0 32 32" fill="currentColor" width="40" height="40"><path d="M16,4a5,5,0,1,1-5,5,5,5,0,0,1,5-5m0-2a7,7,0,1,0,7,7A7,7,0,0,0,16,2Z" /><path d="M26,30H24V25a5.0055,5.0055,0,0,0-5-5H13a5.0055,5.0055,0,0,0-5,5v5H6V25a7.0082,7.0082,0,0,1,7-7h6a7.0082,7.0082,0,0,1,7,7Z" /></svg>;
const CAM = <svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M26,24H6a2,2,0,0,1-2-2V10A2,2,0,0,1,6,8h4l2-3h8l2,3h4a2,2,0,0,1,2,2V22A2,2,0,0,1,26,24ZM6,10V22H26V10ZM16,20a4,4,0,1,1,4-4A4,4,0,0,1,16,20Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,16,14Z" /></svg>;
const RENEW = <svg viewBox="0 0 32 32" fill="currentColor" width="14" height="14"><path d="M12,10H6.78A11,11,0,0,1,27,16h2A13,13,0,0,0,6,7.68V4H4v8h8Z" /><path d="M20,22h5.22A11,11,0,0,1,5,16H3a13,13,0,0,0,23,8.32V28h2V20H20Z" /></svg>;

function Avatar({ dragOver, overlay, interactive }: { dragOver?: boolean; overlay?: boolean; interactive?: boolean }) {
  const [drag, setDrag] = useState(false);
  const [hover, setHover] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const inp = useRef<HTMLInputElement>(null);
  const apply = (f?: File) => {
    if (!f || !/image\/(jpeg|png)/.test(f.type) || f.size > 2 * 1024 * 1024) return;
    const r = new FileReader();
    r.onload = (e) => setImg(String(e.target?.result));
    r.readAsDataURL(f);
  };
  const over = interactive ? drag : dragOver;
  const ov = interactive ? hover : overlay;
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-lg border px-5 py-6 transition-[border-color,background] duration-150"
      style={{ background: over ? 'var(--b1)' : 'var(--n2)', borderColor: over ? 'var(--b5)' : 'var(--n3)' }}
      onDragOver={interactive ? (e) => { e.preventDefault(); setDrag(true); } : undefined}
      onDragLeave={interactive ? () => setDrag(false) : undefined}
      onDrop={interactive ? (e) => { e.preventDefault(); setDrag(false); apply(e.dataTransfer.files[0]); } : undefined}
    >
      <div className="relative h-[88px] w-[88px] cursor-pointer rounded-full" onClick={interactive ? () => inp.current?.click() : undefined} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full bg-n-3 bg-cover bg-center text-n-5" style={img ? { backgroundImage: `url(${img})` } : undefined}>{!img && USER}</div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[3px] rounded-full bg-[rgba(19,32,69,.60)] text-[10px] font-semibold tracking-[.03em] text-white transition-opacity duration-[180ms]" style={{ opacity: ov ? 1 : 0 }}>
          {CAM}<span>Cambiar</span>
        </div>
      </div>
      <button type="button" onClick={interactive ? () => inp.current?.click() : undefined} className="inline-flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 text-sm font-semibold text-b-6">{RENEW}Reemplazar imagen</button>
      <p className="m-0 text-[11px] text-n-5">Tamaño sugerido 224×224 px (PNG o JPG)</p>
      {interactive && <input ref={inp} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => apply(e.target.files?.[0])} />}
    </div>
  );
}
const secHdr = 'border-b border-n-3 px-4 py-3.5 leading-[21px]';
export function ImageUploader({ data }: { data: Head & { tokens?: Record<string, string> } }) {
  const variants: Array<[string, ReactNode]> = [['Empty', <Avatar />], ['Drag over', <Avatar dragOver />], ['Hover overlay', <Avatar overlay />]];
  return (
    <div className="mb-6">
      <p className={descP}>{data.description}</p>
      <Card flush className="!mb-6">
        <div className={secHdr}><span className="text-sm font-semibold text-n-7">Design tokens</span></div>
        <TokenTable tokens={data.tokens ?? {}} />
      </Card>
      <div className="mb-6 grid grid-cols-3 gap-4">
        {variants.map(([t, el]) => (
          <Card key={t} flush className="!mb-0">
            <div className="border-b border-n-3 px-3.5 py-2.5 leading-[21px]"><span className="text-xs font-semibold text-n-7">{t}</span></div>
            <div className="p-4">{el}</div>
          </Card>
        ))}
      </div>
      <Card flush className="!mb-6">
        <div className={secHdr}>
          <span className="text-sm font-semibold text-n-7">Interactive demo</span>
          <span className="ml-2 text-xs text-n-5">Click the avatar or drag an image onto the container</span>
        </div>
        <div className="flex justify-center bg-n-2 p-6"><div className="w-[280px]"><Avatar interactive /></div></div>
      </Card>
      <Card flush>
        <div className={secHdr}><span className="text-sm font-semibold text-n-7">Code</span></div>
        <div className="overflow-x-auto whitespace-pre rounded-b-lg bg-[#1e1e2e] p-4 font-mono text-xs leading-[1.6] text-[#cdd6f4]">{IMG_CODE}</div>
      </Card>
    </div>
  );
}
const T = ({ c, children }: { c: string; children: ReactNode }) => <span style={{ color: c }}>{children}</span>;
const IMG_CODE = (
  <>
    {'<'}<T c="#89b4fa">div</T> <T c="#a6e3a1">class</T>=<T c="#f38ba8">"dt-img-upload"</T> <T c="#a6e3a1">id</T>=<T c="#f38ba8">"img-upload-zone"</T>{'\n'}
    {'     '}<T c="#a6e3a1">ondragover</T>=<T c="#f38ba8">"imgDragOver(event)"</T>{'\n'}
    {'     '}<T c="#a6e3a1">ondragleave</T>=<T c="#f38ba8">"imgDragLeave(event)"</T>{'\n'}
    {'     '}<T c="#a6e3a1">ondrop</T>=<T c="#f38ba8">"imgDrop(event)"</T>{'>'}{'\n'}
    {'  <'}<T c="#89b4fa">div</T> <T c="#a6e3a1">class</T>=<T c="#f38ba8">"dt-img-circle"</T>{'>'}{'\n'}
    {'    <'}<T c="#89b4fa">div</T> <T c="#a6e3a1">class</T>=<T c="#f38ba8">"dt-img-av"</T> <T c="#a6e3a1">id</T>=<T c="#f38ba8">"img-av"</T>{'><!-- IBM Carbon User 32px --></'}<T c="#89b4fa">div</T>{'>'}{'\n'}
    {'    <'}<T c="#89b4fa">div</T> <T c="#a6e3a1">class</T>=<T c="#f38ba8">"dt-img-overlay"</T>{'><!-- IBM Carbon Camera --></'}<T c="#89b4fa">div</T>{'>'}{'\n'}
    {'  </'}<T c="#89b4fa">div</T>{'>'}{'\n'}
    {'  <'}<T c="#89b4fa">button</T> <T c="#a6e3a1">class</T>=<T c="#f38ba8">"dt-img-replace"</T>{'>Reemplazar imagen</'}<T c="#89b4fa">button</T>{'>'}{'\n'}
    {'  <'}<T c="#89b4fa">p</T> <T c="#a6e3a1">class</T>=<T c="#f38ba8">"dt-img-hint"</T>{'>Tamaño sugerido 224×224 px</'}<T c="#89b4fa">p</T>{'>'}{'\n'}
    {'  <'}<T c="#89b4fa">input</T> <T c="#a6e3a1">type</T>=<T c="#f38ba8">"file"</T> <T c="#a6e3a1">id</T>=<T c="#f38ba8">"img-input"</T> <T c="#a6e3a1">accept</T>=<T c="#f38ba8">"image/jpeg,image/png"</T> <T c="#a6e3a1">style</T>=<T c="#f38ba8">"display:none"</T>{'>'}{'\n'}
    {'</'}<T c="#89b4fa">div</T>{'>'}{'\n\n'}
    <T c="#6c7086">/* CSS */</T>{'\n'}
    <T c="#89b4fa">.dt-img-upload</T>{' { display:flex; flex-direction:column; align-items:center; gap:12px;\n  padding:24px 20px; background:var(--n2); border-radius:8px; border:1px solid var(--n3); }\n'}
    <T c="#89b4fa">.dt-img-upload.drag-over</T>{' { border-color:var(--b5); background:var(--b1); }\n'}
    <T c="#89b4fa">.dt-img-circle</T>{' { position:relative; width:88px; height:88px; border-radius:50%; cursor:pointer; }\n'}
    <T c="#89b4fa">.dt-img-overlay</T>{' { position:absolute; inset:0; border-radius:50%; opacity:0; transition:opacity .18s; }\n'}
    <T c="#89b4fa">.dt-img-circle:hover .dt-img-overlay</T>{' { opacity:1; }'}
  </>
);

/* ───────────── EMPTY STATE ───────────── */
const ICO: Record<string, string> = {
  report: 'M26,16H6V4H26ZM26,28H6V18H26ZM4,2V30a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V2a2,2,0,0,0-2-2H6A2,2,0,0,0,4,2ZM9,7h2v4H9ZM9,21h2v4H9Z',
  clock: 'M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z M20.5859,22,15,16.4141V7h2v8.5859l5,5Z',
  users: 'M26,14H24v2h2a3.0033,3.0033,0,0,1,3,3v4h2V19A5.0058,5.0058,0,0,0,26,14Z M24,4a3,3,0,1,1-3,3,3,3,0,0,1,3-3m0-2a5,5,0,1,0,5,5A5,5,0,0,0,24,2Z M23,30H21V28a3.0033,3.0033,0,0,0-3-3H14a3.0033,3.0033,0,0,0-3,3v2H9V28a5.0059,5.0059,0,0,1,5-5h4a5.0059,5.0059,0,0,1,5,5Z M16,13a3,3,0,1,1-3,3,3,3,0,0,1,3-3m0-2a5,5,0,1,0,5,5A5,5,0,0,0,16,11Z M8,14H6a5.0059,5.0059,0,0,0-5,5v4H3V19a3.0033,3.0033,0,0,1,3-3H8Z M8,4A3,3,0,1,1,5,7,3,3,0,0,1,8,4M8,2a5,5,0,1,0,5,5A5,5,0,0,0,8,2Z',
  list: 'M4,4H28V8H4Zm0,8H28v4H4Zm0,8H20v4H4Z',
  search: 'M29,27.5859l-7.5521-7.5521a11.0177,11.0177,0,1,0-1.4141,1.4141L27.5859,29ZM4,13a9,9,0,1,1,9,9A9.01,9.01,0,0,1,4,13Z',
};
function Empty({ icon, title, desc, cta, compact }: { icon: string; title: string; desc: string; cta?: ReactNode; compact?: boolean }) {
  const tile = compact ? 36 : 44, isz = compact ? 18 : 22;
  return (
    <div className={cn('flex flex-col items-center rounded-lg border border-n-3 bg-white text-center', compact ? 'gap-2 px-5 py-7' : 'gap-2.5 px-6 py-12')}>
      <div className="flex shrink-0 items-center justify-center rounded-lg bg-n-2 text-n-45" style={{ width: tile, height: tile }}>
        <svg viewBox="0 0 32 32" fill="currentColor" width={isz} height={isz}>{icon.split(' M').map((d, i) => <path key={i} d={i ? 'M' + d : d} />)}</svg>
      </div>
      <p className="m-0 text-base font-bold text-n-7">{title}</p>
      <p className="m-0 max-w-[280px] text-sm leading-normal text-n-5">{desc}</p>
      {cta && <div className="mt-1.5">{cta}</div>}
    </div>
  );
}
const VarCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card flush>
    <CardHeader title={title} />
    <div className="bg-n-2 p-4">{children}</div>
  </Card>
);
export function EmptyState({ data }: { data: Head & { tokens?: Record<string, string>; code?: string } }) {
  return (
    <div className="mb-6">
      <p className={descP}>{data.description}</p>
      <Card flush className="!mb-6">
        <CardHeader title="Design tokens" />
        <TokenTable tokens={data.tokens ?? {}} />
      </Card>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <VarCard title="Con CTA primario"><Empty icon={ICO.report} title="Sin reportes programados" desc="Crea un reporte programado para recibirlo automáticamente por correo según la frecuencia que elijas." cta={<Btn kind="pri">Crear primer reporte</Btn>} /></VarCard>
        <VarCard title="Con CTA secundario"><Empty icon={ICO.clock} title="No hay actividad reciente" desc="Cuando se registren eventos en tu cuenta aparecerán aquí. Ajusta el rango para ver datos antiguos." cta={<Btn kind="sec">Cambiar rango de fechas</Btn>} /></VarCard>
        <VarCard title="Sin CTA (informativo)"><Empty icon={ICO.users} title="Sin usuarios asociados" desc="Usa el formulario para asociar usuarios a tu cuenta." /></VarCard>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <VarCard title="Compacto (inline)"><Empty compact icon={ICO.list} title="Lista vacía" desc="Para paneles pequeños o secciones dentro de una tarjeta." /></VarCard>
        <VarCard title="Sin resultados (búsqueda)"><Empty icon={ICO.search} title="No encontramos coincidencias" desc="Prueba con otros términos o limpia los filtros para ver todos los registros." cta={<Btn kind="sub">Limpiar filtros</Btn>} /></VarCard>
      </div>
      <Card flush className="!mb-6">
        <CardHeader title="Cuándo usar CTA" />
        <div className="grid grid-cols-2 gap-5 p-5 text-[13px] leading-[1.6] text-n-6">
          <div>
            <p className="m-0 mb-1.5 text-xs font-bold text-g-6">CON CTA</p>
            El usuario puede crear el primer ítem desde aquí mismo. Usa <code className="text-xs text-b-6">.btn.pri</code> con un verbo de acción ("Crear primer reporte"). Una sola acción primaria por estado vacío.
          </div>
          <div>
            <p className="m-0 mb-1.5 text-xs font-bold text-n-5">SIN CTA</p>
            Los datos se llenan en otra parte (otro formulario, un proceso automático, o un permiso que el usuario no tiene). Solo ícono + título + descripción que explique cómo se poblará.
          </div>
        </div>
      </Card>
      <Card flush>
        <CardHeader title="Snippet" />
        <CopyCode text={data.code ?? ''} flat>{data.code}</CopyCode>
      </Card>
    </div>
  );
}
