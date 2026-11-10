import { useState, type ReactNode } from 'react';
import { CalPopover, useOutside } from './Components4';
import { cn } from '@/ds/lib/cn';

export interface FField { type: 'text' | 'select' | 'date'; placeholder: string; colIdx?: number; options?: string[] }
export type FValues = Record<string, string>;

const ADD = 'M21 8.5C21.6875 8.5 22.25 9.0625 22.25 9.75V11H21V9.75H8.5V11.75L13.5 16.75V22.25H16V21H17.25V22.25C17.25 22.9375 16.6875 23.5 16 23.5H13.5C12.8125 23.5 12.25 22.9375 12.25 22.25V17.25L7.625 12.625C7.375 12.375 7.25 12.0625 7.25 11.75V9.75C7.25 9.0625 7.8125 8.5 8.5 8.5H21ZM20.5 12.375V16.4375H24.5625V17.6875H20.5V21.75H19.25V17.6875H15.25V16.4375H19.25V12.375H20.5Z';
const RES = 'M21 8.5C21.3315 8.5 21.6494 8.63179 21.8838 8.86621C22.1182 9.10063 22.25 9.41848 22.25 9.75V11H21V9.75H8.5V11.7314L13.1338 16.3662L13.5 16.7314V22.25H16V21H17.25V22.25C17.25 22.5815 17.1182 22.8994 16.8838 23.1338C16.6494 23.3682 16.3315 23.5 16 23.5H13.5C13.1685 23.5 12.8506 23.3682 12.6162 23.1338C12.3818 22.8994 12.25 22.5815 12.25 22.25V17.25L7.61621 12.6162C7.5001 12.5001 7.40756 12.3617 7.34473 12.21C7.28201 12.0584 7.24999 11.8955 7.25 11.7314V9.75C7.25 9.41848 7.38179 9.10063 7.61621 8.86621C7.85063 8.63179 8.16848 8.5 8.5 8.5H21ZM24.75 13.1338L21.8838 16L24.75 18.8672L23.8672 19.75L21 16.8838L18.1348 19.75L17.25 18.8652L20.1162 16L17.25 13.1338L18.1338 12.25L21 15.1162L23.8662 12.25L24.75 13.1338Z';

/** Botón circular 32px de filtros: `add` (azul) o `reset` (rojo), con hover. */
export function FltIconBtn({ kind, onClick, badge, title }: { kind: 'add' | 'reset'; onClick?: () => void; badge?: boolean; title?: string }) {
  const [h, setH] = useState(false);
  const c = kind === 'add' ? '#1F60ED' : '#DE350B';
  const fill = h ? (kind === 'add' ? '#EDF3FF' : '#FFEBE6') : 'none';
  return (
    <button type="button" title={title ?? (kind === 'add' ? 'Agregar filtro' : 'Limpiar filtros')} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="relative inline-flex h-8 w-8 shrink-0 cursor-pointer border-0 bg-transparent p-0">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x=".5" y=".5" width="31" height="31" rx="15.5" fill={fill} stroke={c} /><path d={kind === 'add' ? ADD : RES} fill={c} /></svg>
      {badge && <span className="pointer-events-none absolute -right-[3px] -top-[3px] h-2.5 w-2.5 rounded-full border-2 border-white bg-r-6" />}
    </button>
  );
}

export function FltBtn({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button type="button" onClick={onClick} className="h-8 min-w-16 shrink-0 cursor-pointer whitespace-nowrap rounded-[50px] border border-b-6 bg-white px-4 text-[14px] font-bold leading-5 text-[#4B82FA] hover:bg-[#EDF5FF] active:bg-[#D1E0FF]">{children}</button>;
}

const CHEV = <svg viewBox="0 0 32 32" width="12" height="12" fill="currentColor" className="pointer-events-none shrink-0"><path d="M16 22L4 10l1.5-1.5L16 19l10.5-10.5L28 10z" /></svg>;
const CAL = <svg viewBox="0 0 32 32" width="14" height="14" fill="currentColor" className="pointer-events-none shrink-0 text-n-5"><path d="M26,4h-4V2h-2v2h-8V2h-2v2H6C4.9,4,4,4.9,4,6v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V6C28,4.9,27.1,4,26,4z M26,26H6V12h20V26z M26,10H6V6h4v2h2V6h8v2h2V6h4V10z" /></svg>;

function Sel({ f, value, onChange }: { f: FField; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <div onClick={() => setOpen(!open)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="box-border flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5" style={{ background: open ? '#fff' : hover ? 'var(--n2)' : '#fff', borderColor: open ? 'var(--b6)' : value ? 'var(--n5)' : 'var(--n3)', borderWidth: open ? 2 : 1 }}>
        <span className="flex-1 truncate text-base leading-5" style={{ color: value ? 'var(--n7)' : 'var(--n6)' }}>{value || f.placeholder}</span>
        <span className="flex shrink-0 text-n-5">{CHEV}</span>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-[110] rounded-md border border-n-3 bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,.12)]">
          {(f.options ?? []).map((o) => <div key={o} onClick={() => { onChange(o); setOpen(false); }} className="flex h-9 cursor-pointer items-center px-3 text-base leading-5 text-n-7 hover:bg-b-1 hover:text-b-7">{o}</div>)}
        </div>
      )}
    </div>
  );
}
function Txt({ f, value, onChange }: { f: FField; value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <div className="min-w-0 flex-1">
      <input type="text" value={value} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="box-border h-8 w-full rounded-md px-2.5 text-base leading-5 text-n-7 outline-none" style={{ border: focus ? '2px solid var(--b6)' : value ? '1px solid var(--n5)' : '1px solid var(--n3)', background: focus ? 'var(--b1)' : hover ? 'var(--n2)' : '#fff' }} />
    </div>
  );
}
function DateF({ f, value, onChange }: { f: FField; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative min-w-0 flex-1">
      <div onClick={() => setOpen(!open)} className="box-border flex h-8 w-full cursor-pointer items-center gap-1.5 rounded-md border border-n-3 bg-white px-2.5 hover:bg-n-2">
        <span className="flex-1 text-base leading-none" style={{ color: value ? 'var(--n7)' : 'var(--n5)' }}>{value || f.placeholder}</span>{CAL}
      </div>
      {open && <CalPopover init={{ m: 4, y: 2025 }} onAccept={(l) => { onChange(l); setOpen(false); }} />}
    </div>
  );
}
export function FilterField({ f, value, onChange }: { f: FField; value: string; onChange: (v: string) => void }) {
  return f.type === 'select' ? <Sel f={f} value={value} onChange={onChange} /> : f.type === 'date' ? <DateF f={f} value={value} onChange={onChange} /> : <Txt f={f} value={value} onChange={onChange} />;
}

/** Texto plano de una celda del demo (para filtrar). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cellText = (c: any): string => c == null ? '' : typeof c !== 'object' ? String(c) : String(c.value ?? '');
/** Aplica los valores de filtro (texto parcial / select exacto) a las filas. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyFilters(rows: any[], fields: FField[], values: FValues, applied: boolean) {
  if (!applied) return rows;
  return rows.filter((r) => fields.every((f, i) => {
    const v = (values[i] ?? '').trim().toLowerCase();
    if (!v || f.colIdx == null || f.colIdx < 0 || f.type === 'date') return true;
    const t = cellText(r.cells?.[f.colIdx]).trim().toLowerCase();
    return f.type === 'select' ? t === v : t.includes(v);
  }));
}
export const ClassBar = ({ children, id }: { children: ReactNode; id?: string }) => <div id={id} className={cn('flex items-center gap-2')}>{children}</div>;
