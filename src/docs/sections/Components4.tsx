import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Card, CopyCode, SectionHeader, TabCard, TCode, Td, TTable, UsageCard } from '../ui';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
const P = ({ d }: { d: string }) => <path d={d} />;
const Svg = ({ size = 14, d, className }: { size?: number; d: string | string[]; className?: string }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" className={cn('shrink-0', className)}>{(Array.isArray(d) ? d : [d]).map((x, i) => <P key={i} d={x} />)}</svg>
);
const D = {
  search: 'M29,27.5859l-7.5521-7.5521a11.0177,11.0177,0,1,0-1.4141,1.4141L27.5859,29ZM4,13a9,9,0,1,1,9,9A9.01,9.01,0,0,1,4,13Z',
  error: 'M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M15,8h2v12h-2V8z M16,24c-0.8,0-1.5-0.7-1.5-1.5S15.2,21,16,21s1.5,0.7,1.5,1.5S16.8,24,16,24z',
  ok: 'M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M14,21.5L8.5,16l1.4-1.4L14,18.6l8.1-8.1l1.4,1.4L14,21.5z',
  infoOut: 'M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28ZM17,22H15V14h2ZM16,10a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,10Z',
  infoFil: 'M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm-1,8h2v2H15Zm4,14H13V22h2V16H13V14h4v8h2Z',
  chevron: 'M16 22L4 10l1.5-1.5L16 19l10.5-10.5L28 10z',
  list: 'M8 6H28V8H8zM4 6H6V8H4zM8 14H28V16H8zM4 14H6V16H4zM8 22H28V24H8zM4 22H6V24H4z',
  x: 'M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6z',
  add: 'M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z',
  sub: 'M8 15h16v2H8z',
  view: 'M16 7C9.5 7 4 12 4 16s5.5 9 12 9 12-5 12-9S22.5 7 16 7zm0 16c-5.4 0-10-3.8-10-7s4.6-7 10-7 10 3.8 10 7-4.6 7-10 7zm0-12a5 5 0 100 10A5 5 0 0016 11zm0 8a3 3 0 110-6 3 3 0 010 6z',
  hide: 'M5.4 6.8L4 8.2l4.4 4.4C6.8 13.7 6 14.8 6 16c0 2.8 2.8 5.5 8 8.5L6.5 28l1.4 1.4 20-20L26.6 8l-4.3 4.3C20.3 10.8 18.2 10 16 10c-1 0-2 .2-2.9.5L5.4 6.8zm7.8 7.8l6.2 6.2A3 3 0 0113 16a3 3 0 01.2-1.4zM16 12c1 0 2 .2 2.9.5l-2.4 2.4A3 3 0 0013 19l-2.4 2.4C9 19.9 8 18 8 16c0-2.4 3.3-4 8-4z',
  lock: 'M24 14h-2V8a6 6 0 00-12 0v6H8v16h24V14zm-12-6a4 4 0 018 0v6H12V8zm12 16H10V16h14v8zm-7-7a2 2 0 100 4 2 2 0 000-4z',
};

/* ───────────── Text inputs ───────────── */
interface Variant { label: string; state?: string; value?: string; placeholder?: string; trailingIcon?: string; labelTooltip?: string; helperText?: string }
function InfoTip({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  return (
    <span className="relative inline-flex cursor-default items-center" onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      <Svg d={on ? D.infoFil : D.infoOut} className="text-n-5" />
      <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-[99] w-[180px] -translate-x-1/2 whitespace-normal rounded-md bg-n-7 px-2.5 py-2 text-xs leading-4 text-white transition-opacity duration-150" style={{ opacity: on ? 1 : 0, visibility: on ? 'visible' : 'hidden' }}>
        {text}
        <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-n-7" />
      </div>
    </span>
  );
}
const SECLBL = 'mb-2 text-xs font-semibold uppercase leading-4 tracking-[.07em] text-n-5';
function InputVariant({ v, hasLabel }: { v: Variant; hasLabel: boolean }) {
  const dis = v.state === 'disabled', foc = v.state === 'focused', fil = v.state === 'filled', err = v.state === 'error', val = v.state === 'valid';
  const needsIcons = err || val;
  const [value, setValue] = useState(v.value ?? v.placeholder ?? 'Placeholder');
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const valid = ref.current?.validity.valid ?? true;
  // estado visual: el estático del ejemplo hasta que el usuario interactúa
  let border = '1px solid var(--n3)';
  if (foc) border = '2px solid var(--b6)';
  if (fil) border = '1px solid var(--n5)';
  if (err) border = '1px solid var(--r6)';
  if (val) border = '1px solid var(--g5)';
  let showErr = err, showOk = val;
  if (focus) { border = '2px solid var(--b6)'; showErr = showOk = false; }
  else if (touched) {
    if (needsIcons) {
      if (!value) { border = '1px solid var(--n3)'; showErr = showOk = false; }
      else if (valid) { border = '1px solid var(--g5)'; showOk = true; showErr = false; }
      else { border = '1px solid var(--r6)'; showErr = true; showOk = false; }
    } else border = value ? '1px solid var(--n5)' : '1px solid var(--n3)';
  }
  const bg = dis ? 'var(--n1)' : '#fff';
  const background = focus || (foc && !touched) ? 'var(--b1)' : hover && !dis ? 'var(--n2)' : bg;
  const padR = needsIcons || v.trailingIcon ? 34 : 10;
  const ico = 'pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center';
  return (
    <div className="flex w-[200px] flex-col">
      <div className={SECLBL}>{v.label}</div>
      {hasLabel && <div className="mb-1 flex items-center gap-1 text-xs leading-4 text-n-7">Label{v.labelTooltip && <InfoTip text={v.labelTooltip} />}</div>}
      <div className="relative">
        <input
          ref={ref} type={needsIcons ? 'email' : 'text'} value={value} placeholder={v.placeholder || 'Placeholder'} disabled={dis}
          onChange={(e) => { setValue(e.target.value); setTouched(true); }}
          onFocus={() => setFocus(true)} onBlur={() => { setFocus(false); setTouched(true); }}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          className={cn('box-border h-8 w-full rounded-md pl-2.5 text-base leading-5 text-n-7 outline-none', dis && 'cursor-not-allowed opacity-55')}
          style={{ border, background, paddingRight: padR }}
        />
        {needsIcons && <><div className={cn(ico, 'text-r-6')} style={{ display: showErr ? 'flex' : 'none' }}><Svg d={D.error} /></div><div className={cn(ico, 'text-g-5')} style={{ display: showOk ? 'flex' : 'none' }}><Svg d={D.ok} /></div></>}
        {!needsIcons && v.trailingIcon === 'search' && <div className={cn(ico, 'text-n-5')}><Svg d={D.search} /></div>}
      </div>
      {v.helperText && <div className={cn('mt-[3px] text-xs leading-4', err ? 'text-r-6' : 'text-n-5')}>{v.helperText}</div>}
    </div>
  );
}

/* ───────────── Dropdown triggers estáticos ───────────── */
function Trig({ type, theme, state, filled, hasIcon }: { type: 'select' | 'multi'; theme: 'border' | 'borderless'; state: string; filled: boolean; hasIcon: boolean }) {
  const bd = theme === 'border';
  const dis = state === 'disabled';
  let border = bd ? '1px solid var(--n3)' : '1px solid transparent';
  if (state === 'active') border = '2px solid var(--b6)';
  let bg = bd ? '#fff' : 'transparent';
  if (state === 'hover') bg = 'var(--n2)';
  if (dis) bg = 'var(--n1)';
  const tc = filled ? (dis ? 'text-n-5' : 'text-n-7') : 'text-n-5';
  return (
    <div className="box-border flex h-8 w-full items-center gap-1.5 rounded-md px-2.5" style={{ border, background: bg, opacity: dis ? 0.55 : undefined }}>
      {hasIcon && <span className="flex text-n-5"><Svg d={D.list} /></span>}
      {type === 'multi' ? (
        <div className="min-w-0 flex-1 overflow-hidden">
          {filled
            ? <span className={cn('inline-flex h-5 items-center gap-[3px] rounded-full border px-1.5 text-xs leading-none', dis ? 'border-n-4 bg-n-3 text-n-5' : 'border-b-3 bg-b-1 text-b-6')}><Svg size={9} d={D.x} />&nbsp;All</span>
            : <span className="text-base leading-5 text-n-5">Placeholder...</span>}
        </div>
      ) : <span className={cn('flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-base leading-5', tc)}>{filled ? 'example' : 'Placeholder...'}</span>}
      <span className="flex shrink-0" style={{ color: dis ? 'var(--n4)' : 'var(--n5)' }}><Svg size={12} d={D.chevron} /></span>
    </div>
  );
}
const STATES = ['normal', 'hover', 'active', 'disabled'] as const;
const STLBL = { normal: 'Normal', hover: 'Hover', active: 'Active', disabled: 'Disabled' };
const CONFIGS = [{ theme: 'border', hasIcon: false }, { theme: 'border', hasIcon: true }, { theme: 'borderless', hasIcon: false }, { theme: 'borderless', hasIcon: true }] as const;
function StateGrid({ type, filled }: { type: 'select' | 'multi'; filled: boolean }) {
  const h = 'border-b-2 border-n-3 pb-1.5 text-xs font-bold leading-4 text-n-7';
  return (
    <div className="mb-6">
      <div className="mb-3 text-base font-bold leading-5 text-n-7">Filled: {filled ? 'T' : 'F'}</div>
      <div className="grid items-center gap-x-3 gap-y-2" style={{ gridTemplateColumns: '100px repeat(4,1fr)' }}>
        <div /><div className={cn(h, 'col-span-2')}>Theme: border</div><div className={cn(h, 'col-span-2')}>Theme: borderless</div>
        <div />{CONFIGS.map((c, i) => <div key={i} className="text-xs leading-4 text-n-5">{c.hasIcon ? 'With icon' : 'Simple'}</div>)}
        {STATES.map((s) => (
          <FragmentRow key={s}>
            <div className="whitespace-nowrap text-base leading-5 text-n-5">State: {STLBL[s]}</div>
            {CONFIGS.map((c, i) => <div key={i} className="min-w-0"><Trig type={type} {...c} state={s} filled={filled} /></div>)}
          </FragmentRow>
        ))}
      </div>
    </div>
  );
}
const FragmentRow = ({ children }: { children: ReactNode }) => <>{children}</>;

/* ───────────── Dropdowns interactivos ───────────── */
export function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) close(); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [open, close]);
  return ref;
}
const MENU = 'absolute left-0 right-0 top-[calc(100%+4px)] z-[100] rounded-md border border-n-3 bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,.12)]';
function SelectDemo({ theme, options }: { theme: 'border' | 'borderless'; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  const bl = theme === 'borderless';
  const border = open ? '2px solid var(--b6)' : bl ? '1px solid transparent' : val ? '1px solid var(--n5)' : '1px solid var(--n3)';
  const bg = open ? 'var(--b1)' : val ? '#fff' : hover ? 'var(--n2)' : bl ? 'transparent' : '#fff';
  return (
    <div ref={ref} className="relative w-[240px]">
      <div onClick={() => setOpen((o) => !o)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5" style={{ border, background: bg }}>
        <span className="flex-1 text-base leading-5" style={{ color: val ? 'var(--n7)' : 'var(--n6)' }}>{val ?? 'Select an option...'}</span>
        <span className="flex shrink-0 text-n-5"><Svg size={12} d={D.chevron} /></span>
      </div>
      {open && (
        <div className={MENU}>
          {options.map((o) => <div key={o} onClick={() => { setVal(o); setOpen(false); }} className="flex h-9 cursor-pointer items-center px-3 text-base leading-5 text-n-7 hover:bg-b-1 hover:text-b-7">{o}</div>)}
        </div>
      )}
    </div>
  );
}
function MultiDemo({ options }: { options: string[] }) {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [hover, setHover] = useState(false);
  const ref = useOutside(open, () => setOpen(false));
  const border = open ? '2px solid var(--b6)' : sel.length ? '1px solid var(--n5)' : '1px solid var(--n3)';
  return (
    <div ref={ref} className="relative w-[240px]">
      <div onClick={() => setOpen((o) => !o)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5" style={{ border, background: open ? 'var(--b1)' : hover ? 'var(--n2)' : '#fff' }}>
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
          {sel.length ? sel.map((l) => (
            <span key={l} className="inline-flex h-5 shrink-0 items-center gap-[3px] rounded-full border border-b-3 bg-b-1 px-1.5 text-xs leading-none text-b-6">
              <button type="button" onClick={(e) => { e.stopPropagation(); setSel(sel.filter((x) => x !== l)); }} className="flex cursor-pointer border-0 bg-transparent p-0 text-b-6"><Svg size={9} d={D.x} /></button>{l}
            </span>
          )) : <span className="text-base leading-5 text-n-6">Select options...</span>}
        </div>
        <span className="flex shrink-0 text-n-5"><Svg size={12} d={D.chevron} /></span>
      </div>
      {open && (
        <div className={MENU}>
          {options.map((o) => (
            <label key={o} onClick={(e) => e.stopPropagation()} className="flex h-9 cursor-pointer items-center gap-2 px-3 text-base leading-5 text-n-7 hover:bg-b-1">
              <input type="checkbox" checked={sel.includes(o)} onChange={(e) => setSel(e.target.checked ? [...sel, o] : sel.filter((x) => x !== o))} className="cursor-pointer accent-b-6" />{o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── Special inputs ───────────── */
const INP = 'box-border h-8 placeholder:text-n-6 rounded-md border border-n-3 bg-white text-base leading-5 text-n-7 outline-none hover:bg-n-2 focus:border-2 focus:border-b-6 focus:bg-b-1';
const iconBtn = 'absolute right-2 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-0 bg-transparent p-0.5 leading-[0] text-n-5 hover:text-n-7';
interface Special { id: string; label: string; description?: string; placeholder?: string; value?: string; min?: number; defaultValue?: number; buttonLabel?: string }
function SpecialDemo({ sv }: { sv: Special }) {
  const [n, setN] = useState(String(sv.defaultValue ?? 0));
  const [show, setShow] = useState(false);
  const [applied, setApplied] = useState(false);
  const [txt, setTxt] = useState('');
  const min = sv.min ?? 0;
  const btn = 'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-n-5 hover:bg-n-2';
  if (sv.id === 'number') return (
    <div className="inline-flex h-8 w-40 items-stretch overflow-hidden rounded-md border border-n-3 bg-white focus-within:border-2 focus-within:border-b-6 focus-within:bg-b-1">
      <button type="button" aria-label="Decrementar" className={cn(btn, 'border-r border-n-3')} onClick={() => setN(String(Math.max(min, parseInt(n || '0') - 1)))}><Svg d={D.sub} /></button>
      <input type="text" inputMode="numeric" value={n} onChange={(e) => setN(e.target.value.replace(/[^0-9]/g, ''))} className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-center text-base font-medium leading-none text-n-7 outline-none" />
      <button type="button" aria-label="Incrementar" className={cn(btn, 'border-l border-n-3')} onClick={() => setN(String(parseInt(n || '0') + 1))}><Svg d={D.add} /></button>
    </div>
  );
  if (sv.id === 'textarea') return <textarea placeholder={sv.placeholder || 'Escribe aquí…'} className={cn(INP, '!h-24 max-h-24 w-60 resize-none overflow-y-auto px-2.5 py-2')} />;
  if (sv.id === 'password') return (
    <div className="relative inline-flex w-60 items-center">
      <input type={show ? 'text' : 'password'} placeholder={sv.placeholder || 'Contraseña'} className={cn(INP, 'w-full pl-2.5 pr-9')} />
      <button type="button" tabIndex={-1} title="Mostrar / ocultar contraseña" onClick={() => setShow(!show)} className={iconBtn}><Svg d={show ? D.hide : D.view} /></button>
    </div>
  );
  if (sv.id === 'readonly') return (
    <div className="relative inline-flex w-60 items-center">
      <input type="text" readOnly value={sv.value || 'Valor por defecto'} title="Campo de solo lectura" className={cn(INP, 'w-full cursor-default !bg-n-1 pl-2.5 pr-[34px] !text-n-5')} />
      <span className="pointer-events-none absolute right-2.5 top-1/2 flex -translate-y-1/2 text-n-4"><Svg d={D.lock} /></span>
    </div>
  );
  if (sv.id === 'search') return (
    <div className="relative inline-flex w-60 items-center">
      <input type="search" placeholder={sv.placeholder || 'Buscar…'} className={cn(INP, 'w-full appearance-none pl-2.5 pr-9')} />
      <button type="button" title="Buscar" className={iconBtn}><Svg d={D.search} /></button>
    </div>
  );
  if (sv.id === 'input-button') {
    const lbl = sv.buttonLabel || 'Aplicar';
    const apply = () => { if (!txt.trim()) return; setApplied(true); setTimeout(() => setApplied(false), 1200); };
    return (
      <div className="relative inline-flex w-[260px] items-center">
        <input type="text" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder={sv.placeholder || 'Ingresa un valor…'} className={cn(INP, 'w-full pl-2.5 pr-[84px]')} />
        <button type="button" onClick={apply} className={cn('absolute right-[5px] top-1/2 h-[22px] -translate-y-1/2 cursor-pointer whitespace-nowrap rounded-[50px] border-0 px-2.5 text-[11px] font-bold leading-none text-white transition-colors duration-[120ms]', applied ? 'bg-g-6' : 'bg-b-6 hover:bg-b-7')}>{applied ? '✓' : lbl}</button>
      </div>
    );
  }
  return null;
}

const SubHead = ({ children }: { children: ReactNode }) => <div className="mb-6 border-b-2 border-n-3 pb-3.5 font-bold leading-6 text-n-7" style={{ fontSize: 18 }}>{children}</div>;
const GroupHead = ({ title, desc }: { title: string; desc: string }) => (<><div className="mb-1 text-lg font-bold leading-[22px] text-n-7" style={{ fontSize: 16 }}>{title}</div><div className="mb-5 text-base leading-5 text-n-5">{desc}</div></>);

/* ───────────── Date / time pickers ───────────── */
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MSHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

interface MonthState { m: number; y: number; view: 'day' | 'month' }
function MonthGrid({ ms, mode, sel, start, end, onDay, onMonth, compact }: { ms: MonthState; mode: 'single' | 'range'; sel: string; start: string; end: string; onDay: (d: string) => void; onMonth: (m: number) => void; compact?: boolean }) {
  if (ms.view === 'month') {
    return (
      <div className="grid grid-cols-3 gap-1">
        {MSHORT.map((n, i) => (
          <button key={n} type="button" onClick={() => onMonth(i + 1)} className={cn('cursor-pointer rounded-md border-0 px-1 py-2 text-xs', i + 1 === ms.m ? 'bg-b-6 font-bold text-white' : 'bg-transparent font-normal text-n-7 hover:bg-n-2')}>{n}</button>
        ))}
      </div>
    );
  }
  let first = new Date(ms.y, ms.m - 1, 1).getDay();
  first = first === 0 ? 6 : first - 1;
  const days = new Date(ms.y, ms.m, 0).getDate();
  const gap = compact ? 'gap-px' : 'gap-0.5';
  return (
    <div className={cn('grid grid-cols-7', gap)} style={{ minHeight: undefined }}>
      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <div key={i} className="pb-1 text-center text-[11px] font-semibold text-n-5">{d}</div>)}
      {Array.from({ length: first }).map((_, i) => <div key={'e' + i} />)}
      {Array.from({ length: days }).map((_, i) => {
        const d = ymd(ms.y, ms.m, i + 1);
        const edge = mode === 'single' ? d === sel : d === start || d === end;
        const inRange = mode === 'range' && start && end && d > start && d < end;
        return (
          <button key={d} type="button" onClick={() => onDay(d)} className={cn('mx-auto flex h-9 w-9 cursor-pointer items-center justify-center border-0 text-base', edge ? 'rounded-full bg-b-6 text-white' : inRange ? 'rounded-none bg-b-1 text-n-7' : 'rounded-full bg-transparent text-n-7')}>{i + 1}</button>
        );
      })}
    </div>
  );
}
function useCal(init: { m: number; y: number; sel?: string; start?: string; end?: string }, mode: 'single' | 'range') {
  const [ms, setMs] = useState<MonthState>({ m: init.m, y: init.y, view: 'day' });
  const [sel, setSel] = useState(init.sel ?? '');
  const [start, setStart] = useState(init.start ?? '');
  const [end, setEnd] = useState(init.end ?? '');
  const nav = (dir: number) => setMs((s) => {
    if (s.view === 'month') return { ...s, y: s.y + dir };
    let m = s.m + dir, y = s.y;
    if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
    return { ...s, m, y };
  });
  const onDay = (d: string) => {
    if (mode === 'single') setSel(d);
    else if (!start || (start && end)) { setStart(d); setEnd(''); }
    else if (d < start) setStart(d);
    else setEnd(d);
  };
  const ready = mode === 'single' ? !!(sel || start) : !!(start && end);
  const reset = () => { setSel(''); setStart(''); setEnd(''); };
  return { ms, setMs, sel, start, end, nav, onDay, ready, reset };
}
const NavBtn = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => <button type="button" onClick={onClick} className="cursor-pointer border-0 bg-transparent px-1.5 py-0.5 text-[18px] leading-none text-b-6">{children}</button>;
function Accept({ ready, onClick, className }: { ready: boolean; onClick?: () => void; className?: string }) {
  return <button type="button" disabled={!ready} onClick={onClick} className={cn('cursor-pointer rounded-[20px] border-0 text-sm font-bold text-white', ready ? 'bg-b-6' : 'bg-n-4', className)}>Aceptar</button>;
}
/** Calendario simple (popover). */
export function CalPopover({ init, onAccept }: { init: { m: number; y: number; sel?: string; start?: string; end?: string }; onAccept: (label: string) => void }) {
  const c = useCal(init, 'single');
  const label = c.ms.view === 'month' ? String(c.ms.y) : `${MONTHS[c.ms.m - 1]} ${c.ms.y}`;
  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[200] w-[300px] overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(19,32,69,.14)]">
      <div className="px-3 py-2.5">
        <div className="mb-2.5 flex items-center justify-between">
          <NavBtn onClick={() => c.nav(-1)}>‹</NavBtn>
          <button type="button" onClick={() => c.setMs((s) => ({ ...s, view: s.view === 'day' ? 'month' : 'day' }))} className="cursor-pointer rounded border-0 bg-transparent px-2 py-0.5 text-base font-bold text-n-7 hover:bg-n-2">{label}</button>
          <NavBtn onClick={() => c.nav(1)}>›</NavBtn>
        </div>
        <MonthGrid ms={c.ms} mode="single" sel={c.sel} start={c.start} end={c.end} onDay={c.onDay} onMonth={(m) => c.setMs({ ...c.ms, m, view: 'day' })} compact />
      </div>
      <div className="px-3 pb-3 pt-1"><Accept ready={c.ready} className="h-9 w-full !text-sm" onClick={() => { const s = c.sel || c.start; if (s) onAccept(s.split('-').reverse().join('/')); }} /></div>
    </div>
  );
}
function RangePopover({ onAccept }: { onAccept: () => void }) {
  const [a, setA] = useState<MonthState>({ m: 4, y: 2025, view: 'day' });
  const [b, setB] = useState<MonthState>({ m: 5, y: 2025, view: 'day' });
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const onDay = (d: string) => { if (!start || (start && end)) { setStart(d); setEnd(''); } else if (d < start) setStart(d); else setEnd(d); };
  const nav = (set: typeof setA, dir: number) => set((s) => { let m = s.m + dir, y = s.y; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; } return { ...s, m, y }; });
  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[200] w-[600px] overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(19,32,69,.14)]">
      <div className="flex">
        <div className="flex-1 border-r border-n-3 px-2.5 pt-2.5">
          <div className="mb-2 flex items-center justify-between"><button type="button" onClick={() => nav(setA, -1)} className="cursor-pointer border-0 bg-transparent px-1 py-0.5 text-base leading-none text-b-6">‹</button><span className="text-xs font-bold text-n-7">{MONTHS[a.m - 1]} {a.y}</span><div className="w-[22px]" /></div>
          <MonthGrid ms={a} mode="range" sel="" start={start} end={end} onDay={onDay} onMonth={() => undefined} compact />
        </div>
        <div className="flex-1 px-2.5 pt-2.5">
          <div className="mb-2 flex items-center justify-between"><div className="w-[22px]" /><span className="text-xs font-bold text-n-7">{MONTHS[b.m - 1]} {b.y}</span><button type="button" onClick={() => nav(setB, 1)} className="cursor-pointer border-0 bg-transparent px-1 py-0.5 text-base leading-none text-b-6">›</button></div>
          <MonthGrid ms={b} mode="range" sel="" start={start} end={end} onDay={onDay} onMonth={() => undefined} compact />
        </div>
      </div>
      <div className="flex justify-center px-2.5 pb-2.5 pt-2"><Accept ready={!!(start && end)} onClick={onAccept} className="h-9 w-[280px] !text-sm" /></div>
    </div>
  );
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const HOURS_24a = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const HOURS_24b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
function Clock({ step, h24, hour, minute, onHour, onMinute }: { step: 'hour' | 'minute'; h24: boolean; hour: number; minute: number; onHour: (h: number) => void; onMinute: (m: number) => void }) {
  const cx = 110, cy = 110, R = 90, r2 = 58;
  const rings = step === 'minute' ? [{ r: R, vals: MINS }] : h24 ? [{ r: R, vals: HOURS_24a }, { r: r2, vals: HOURS_24b }] : [{ r: R, vals: HOURS_12 }];
  const cur = step === 'minute' ? minute : hour;
  const circles: ReactNode[] = [], texts: ReactNode[] = [];
  let hand: ReactNode = null;
  rings.forEach((ring) => ring.vals.forEach((v, i) => {
    const a = (i / ring.vals.length) * 2 * Math.PI - Math.PI / 2;
    const px = cx + ring.r * Math.cos(a), py = cy + ring.r * Math.sin(a);
    const sel = v === cur;
    circles.push(<circle key={`c${ring.r}-${v}`} cx={px} cy={py} r={18} fill={sel ? 'var(--b6)' : 'transparent'} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); step === 'minute' ? onMinute(v) : onHour(v); }} />);
    texts.push(<text key={`t${ring.r}-${v}`} x={px} y={py} textAnchor="middle" dominantBaseline="central" fontSize={step === 'minute' ? 12 : 13} fill={sel ? '#fff' : 'var(--n7)'} fontFamily="DM Sans,sans-serif" style={{ pointerEvents: 'none' }}>{step === 'minute' ? pad(v) : v}</text>);
    if (sel) hand = <><line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--b6)" strokeWidth={2} /><circle cx={cx} cy={cy} r={5} fill="var(--b6)" /></>;
  }));
  return (
    <svg width={210} height={210} viewBox="0 0 220 220" className="mx-auto block">
      <circle cx={cx} cy={cy} r={R} fill="#E8ECF4" />
      {step === 'hour' && h24 && <circle cx={cx} cy={cy} r={r2} fill="#D6DCE8" />}
      {circles}{hand}{texts}
    </svg>
  );
}
function TimePopover({ h24, initHour, initAmpm, onSave, onCancel }: { h24: boolean; initHour: number; initAmpm: string; onSave: (s: string) => void; onCancel: () => void }) {
  const [step, setStep] = useState<'hour' | 'minute'>('hour');
  const [hour, setHour] = useState(initHour);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState(initAmpm);
  const [text, setText] = useState(false);
  const box = (active: boolean): CSSProperties => ({ border: active ? '2px solid var(--b6)' : '1px solid var(--n3)' });
  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-[200] w-[260px] rounded-xl bg-n-2 p-3.5 shadow-[0_4px_24px_rgba(19,32,69,.14)]">
      <div className="mb-2.5 text-sm font-semibold text-n-7">{step === 'hour' ? 'Seleccionar hora' : 'Seleccionar minutos'}</div>
      <div className="mb-2.5 flex items-center gap-2">
        <div onClick={() => setStep('hour')} className="flex h-[50px] w-16 cursor-pointer items-center justify-center rounded-lg bg-white text-[28px] font-bold text-n-7" style={box(step === 'hour')}>{pad(hour)}</div>
        <span className="text-2xl font-bold text-n-7">:</span>
        <div onClick={() => setStep('minute')} className="flex h-[50px] w-16 cursor-pointer items-center justify-center rounded-lg bg-white text-[28px] font-bold text-n-5" style={box(step === 'minute')}>{pad(minute)}</div>
        {!h24 && (
          <div className="flex flex-col overflow-hidden rounded-lg border border-n-3">
            {(['AM', 'PM'] as const).map((v, i) => (
              <div key={v}>{i > 0 && <div className="h-px bg-n-3" />}<button type="button" onClick={() => setAmpm(v)} className={cn('cursor-pointer border-0 px-[9px] py-[3px] text-[10px] font-semibold', ampm === v ? 'bg-b-6 text-white' : 'bg-transparent text-n-6')}>{v}</button></div>
            ))}
          </div>
        )}
      </div>
      {text ? (
        <div className="mb-2 flex gap-2">
          <div className="flex flex-col gap-[3px]"><input value={pad(hour)} onChange={(e) => setHour(parseInt(e.target.value) || 0)} maxLength={2} className="h-[50px] w-16 rounded-lg border-2 border-b-6 bg-white text-center text-[28px] font-bold outline-none" /><span className="text-center text-[10px] text-n-5">Hora</span></div>
          <div className="pt-3 text-2xl font-bold text-n-7">:</div>
          <div className="flex flex-col gap-[3px]"><input value={pad(minute)} onChange={(e) => setMinute(parseInt(e.target.value) || 0)} maxLength={2} className="h-[50px] w-16 rounded-lg border border-n-3 bg-white text-center text-[28px] font-bold outline-none focus:border-2 focus:border-b-6" /><span className="text-center text-[10px] text-n-5">Minuto</span></div>
        </div>
      ) : <Clock step={step} h24={h24} hour={hour} minute={minute} onHour={setHour} onMinute={setMinute} />}
      <div className="mt-1.5 flex items-center justify-between">
        <button type="button" onClick={() => setText(!text)} className="flex cursor-pointer border-0 bg-transparent">
          {text
            ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--n5)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--n5)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
        </button>
        <div className="flex gap-3.5">
          <button type="button" onClick={onCancel} className="cursor-pointer border-0 bg-transparent text-sm font-medium text-n-6">Cancelar</button>
          <button type="button" onClick={() => onSave(`${pad(hour)}:${pad(minute)}${h24 ? '' : ' ' + ampm}`)} className="cursor-pointer border-0 bg-transparent text-sm font-semibold text-b-6">Guardar</button>
        </div>
      </div>
    </div>
  );
}

const CAL = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const CLK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const PLBL = 'text-[11px] font-semibold uppercase tracking-[.04em] text-n-5';
function PickerField({ label, placeholder, icon, children }: { label: string; placeholder: string; icon: ReactNode; children: (close: (v?: string) => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string | null>(null);
  const ref = useOutside(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative inline-flex flex-col gap-1">
      <span className={PLBL}>{label}</span>
      <div onClick={() => setOpen((o) => !o)} className="relative box-border flex h-8 w-[220px] cursor-pointer items-center gap-1.5 rounded-md border border-n-3 bg-white px-2.5 hover:bg-n-2">
        <span className="flex-1 text-base leading-none text-n-5">{val ?? placeholder}</span><span className="flex text-n-5">{icon}</span>
      </div>
      {open && children((v) => { if (v) setVal(v); setOpen(false); })}
    </div>
  );
}
const H3 = ({ children, mt }: { children: ReactNode; mt: number }) => <h3 className="mb-1.5 font-bold text-n-7" style={{ fontSize: 18, marginTop: mt }}>{children}</h3>;
const Desc = ({ children }: { children: ReactNode }) => <p className="mb-4 max-w-[660px] text-sm leading-[1.6] text-n-5">{children}</p>;

/* ───────────── INPUTS ───────────── */
interface InputsData extends Head {
  pageUsage?: string; code?: string; dropdownCode?: string;
  tokens?: Record<string, string>; dropdownTokens?: Record<string, string>;
  variantGroups?: Array<{ id: string; label: string; description: string; variants: Variant[] }>;
  dropdownOptions?: string[]; dropdownMultiOptions?: string[];
  specialVariants?: Special[];
}
export function Inputs({ data }: { data: InputsData }) {
  const opts = data.dropdownOptions ?? ['Todos', 'Esta semana', 'Este mes', 'Últimos 3 meses', 'Personalizado'];
  const multi = data.dropdownMultiOptions ?? ['Todos', 'Santiago', 'Valparaíso', 'Biobío', 'Maule'];
  const tokensTbl = (t?: Record<string, string>) => <TTable head={['Token', 'Value']}>{Object.entries(t ?? {}).map(([k, v]) => <tr key={k}><Td><TCode>{k}</TCode></Td><Td><TCode>{String(v)}</TCode></Td></tr>)}</TTable>;
  const preview = (
    <div className="bg-n-1 p-6">
      <div className="mb-12">
        <SubHead>Text inputs</SubHead>
        {data.variantGroups?.map((g) => (
          <div key={g.id} className="mb-8">
            <GroupHead title={g.label} desc={g.description} />
            <div className="flex flex-wrap gap-x-7 gap-y-5">{g.variants.map((v) => <InputVariant key={v.label} v={v} hasLabel={g.id === 'with-label'} />)}</div>
          </div>
        ))}
      </div>
      {!!data.specialVariants?.length && (
        <div className="mb-12">
          <SubHead>Special inputs</SubHead>
          <div className="flex flex-wrap items-start gap-x-12 gap-y-8">
            {data.specialVariants.map((sv) => (
              <div key={sv.id} className="flex min-w-[200px] flex-col gap-1.5">
                <div className="text-xs font-semibold uppercase leading-4 tracking-[.07em] text-n-5">{sv.label}</div>
                <div className="mb-1.5 max-w-[260px] text-xs leading-4 text-n-5">{sv.description}</div>
                <SpecialDemo sv={sv} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <SubHead>Dropdowns</SubHead>
        <div className="mb-10">
          <GroupHead title="Interactive" desc="Click to open, select an option to see the filled state." />
          <div className="flex flex-wrap gap-6">
            {[['Select', <SelectDemo key="a" theme="border" options={opts} />], ['Select — borderless', <SelectDemo key="b" theme="borderless" options={opts} />], ['Multiselect', <MultiDemo key="c" options={multi} />]].map(([l, el]) => (
              <div key={l as string} className="flex flex-col gap-1.5"><div className="text-xs font-semibold uppercase leading-4 tracking-[.07em] text-n-5">{l as string}</div>{el as ReactNode}</div>
            ))}
          </div>
        </div>
        <div className="mb-10"><GroupHead title="Select" desc="Single-value dropdown. Border and borderless themes." /><StateGrid type="select" filled /><StateGrid type="select" filled={false} /></div>
        <div className="mb-10"><GroupHead title="Multiselect" desc='Multiple selections shown as chips. Filled: T shows default "All" chip.' /><StateGrid type="multi" filled /><StateGrid type="multi" filled={false} /></div>
      </div>
    </div>
  );
  const combined = (data.code ?? '') + '\n\n\n/* ──────────── DROPDOWNS ──────────── */\n\n' + (data.dropdownCode ?? '');
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      <TabCard tabs={[
        { label: 'Preview', content: preview },
        { label: 'Code', content: <CopyCode text={combined} flat>{combined}</CopyCode> },
        { label: 'Tokens', content: <div className="p-4"><div className="mb-3 text-base font-bold leading-5 text-n-7">Text inputs</div>{tokensTbl(data.tokens)}<div className="mb-3 mt-6 text-base font-bold leading-5 text-n-7">Dropdowns</div>{tokensTbl(data.dropdownTokens)}</div> },
      ]} />
      <H3 mt={32}>Date picker</H3>
      <Desc>Click en el input para abrir el calendario. Navega con ‹ ›. Aceptar se activa al seleccionar.</Desc>
      <Card className="flex flex-wrap items-start gap-5 !pb-[320px] !mb-0">
        <PickerField label="Fecha de creación" placeholder="F. Creación" icon={CAL}>{(close) => <CalPopover init={{ m: 4, y: 2025 }} onAccept={close} />}</PickerField>
        <PickerField label="Con fecha seleccionada" placeholder="01/04/2025" icon={CAL}>{(close) => <CalPopover init={{ m: 4, y: 2025, sel: '2025-04-01' }} onAccept={close} />}</PickerField>
        <PickerField label="Con rango seleccionado" placeholder="01/04 – 10/04" icon={CAL}>{(close) => <CalPopover init={{ m: 4, y: 2025, start: '2025-04-01', end: '2025-04-10' }} onAccept={close} />}</PickerField>
      </Card>
      <H3 mt={24}>Date range picker</H3>
      <Desc>Dos inputs (Desde/Hasta) que abren un popover con dos meses continuos — exactamente el ancho de ambos inputs juntos.</Desc>
      <Card className="!pb-[340px] !mb-0"><PickerField label="Rango de fechas" placeholder="Seleccionar rango" icon={CAL}>{(close) => <RangePopover onAccept={() => close()} />}</PickerField></Card>
      <H3 mt={24}>Time picker</H3>
      <Desc>Click en el input de hora para abrir el reloj. El ícono inferior alterna entre reloj y texto.</Desc>
      <Card className="flex flex-wrap items-start gap-5 !pb-[420px]">
        <PickerField label="12h — AM/PM" placeholder="--:-- AM" icon={CLK}>{(close) => <TimePopover h24={false} initHour={7} initAmpm="AM" onSave={close} onCancel={() => close()} />}</PickerField>
        <PickerField label="24h" placeholder="--:--" icon={CLK}>{(close) => <TimePopover h24 initHour={20} initAmpm="" onSave={close} onCancel={() => close()} />}</PickerField>
      </Card>
    </>
  );
}
