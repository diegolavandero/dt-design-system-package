import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../../icons';
import { cn } from '@/ds/lib/cn';

/* Kit del DS móvil (Drivers App · prefijo DTM). Port de los helpers m* de renderers.js. */
const BASE = import.meta.env.BASE_URL;
export const LOGO_MOBILE = `${BASE}sections/assets/logos/lastmile-mobile-color.svg`;
export const LOGO_DESKTOP = `${BASE}sections/assets/logos/lastmile-desktop-color.svg`;
export const LOGO_BRAND = `${BASE}sections/assets/logos/dispatchtrack-brand-color.svg`;

const I = ({ n, s = 16, c }: { n: string; s?: number; c?: string }) => <Icon name={n} size={s} color={c} />;
export const MIcon = I;

/* ── Estructura ── */
export function MPhone({ children, width = 360, height, className }: { children: ReactNode; width?: number; height?: number; className?: string }) {
  return (
    <div className={cn('flex max-w-full shrink-0 flex-col overflow-hidden rounded-[18px] border border-n-3 bg-n-1 shadow-[0_1px_3px_rgba(19,32,69,.08)]', className)} style={{ width, ...(height ? { height } : {}) }}>
      {children}
    </div>
  );
}
export function MStage({ children, pad = 20, gap = 16, align = 'flex-start', col, className }: { children: ReactNode; pad?: number; gap?: number; align?: CSSProperties['alignItems']; col?: boolean; className?: string }) {
  return <div className={cn('mb-3.5 flex flex-wrap rounded-lg border border-n-3 bg-n-1', col && 'flex-col', className)} style={{ padding: pad, gap, alignItems: align }}>{children}</div>;
}
export const MLabel = ({ children }: { children: ReactNode }) => <div className="mb-2.5 mt-[18px] text-[11px] font-bold uppercase leading-[normal] tracking-[.07em] text-n-5">{children}</div>;
export const MWrap = ({ label, children, w = 300 }: { label: string; children: ReactNode; w?: number }) => <div style={{ width: w }}><MLabel>{label}</MLabel>{children}</div>;
export const MSheet = ({ children }: { children: ReactNode }) => <div className="overflow-hidden rounded-xl border border-n-3 bg-white">{children}</div>;

export function MSpecTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mb-3.5 overflow-hidden rounded-lg border border-n-3">
      <table className="w-full border-collapse bg-white"><tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="whitespace-nowrap border-b border-n-2 px-3 py-[7px] text-xs font-semibold leading-[normal] text-n-7">{r[0]}</td>
            <td className="border-b border-n-2 px-3 py-[7px] text-xs leading-normal text-n-6">{r[1]}</td>
          </tr>
        ))}
      </tbody></table>
    </div>
  );
}
const TAGS: Record<string, string> = { NEW: 'bg-[#E3FCEF] text-[#006844]', EXTENDED: 'bg-[#EDF5FF] text-[#0052CC]', RULE: 'bg-[#FFFAE6] text-[#7A4A00]' };
export function MComponentCard({ name, tag = 'NEW', preview, specs, notes }: { name?: string; tag?: string; preview?: ReactNode; specs?: string[][]; notes?: string }) {
  return (
    <div className="mb-5 rounded-lg border border-n-3 bg-white p-5">
      <h3 className="m-0 mb-3 flex items-center gap-2 text-[15px] font-bold leading-[normal] text-n-7">{name}<span className={cn('rounded-full px-2 py-1 text-[9px] font-bold leading-none tracking-[.04em]', TAGS[tag] || TAGS.NEW)}>{tag}</span></h3>
      {preview}
      {specs && specs.length > 0 && <MSpecTable rows={specs} />}
      {notes && <div className="text-xs leading-[1.6] text-n-5">{notes}</div>}
    </div>
  );
}
export function MRules({ rules, title = 'Reglas de uso' }: { rules?: string[]; title?: string }) {
  if (!rules?.length) return null;
  return (
    <div className="mb-5 rounded-lg border border-n-3 bg-white p-5">
      <h3 className="m-0 mb-2.5 text-[15px] font-bold leading-[normal] text-n-7">{title}</h3>
      <ul className="m-0 pl-[18px]">{rules.map((r, i) => <li key={i} className="mb-1 text-[13px] leading-[1.7] text-n-6">{r}</li>)}</ul>
    </div>
  );
}
export const MCompCard = ({ composition }: { composition?: string[][] }) => composition?.length ? (
  <div className="mb-5 rounded-lg border border-n-3 bg-white p-5"><h3 className="m-0 mb-3 text-[15px] font-bold leading-[normal] text-n-7">Componentes del DS utilizados</h3><MSpecTable rows={composition} /></div>
) : null;

/* ── Átomos ── */
export function MBadge({ label, type = 'neutral' }: { label: string; type?: 'success' | 'danger' | 'error' | 'warning' | 'info' | 'neutral' | 'outline' }) {
  const C = { success: 'bg-g-1 border-g-3 text-g-7', danger: 'bg-r-1 border-r-3 text-r-6', error: 'bg-r-1 border-r-3 text-r-6', warning: 'bg-o-1 border-o-3 text-o-7', info: 'bg-b-1 border-b-3 text-b-6', neutral: 'bg-n-2 border-n-4 text-n-6', outline: 'bg-white border-n-4 text-n-6' };
  return <span className={cn('inline-flex h-[22px] items-center whitespace-nowrap rounded-[4px] border px-1.5 py-0.5 text-[11px] font-semibold leading-none', C[type])}>{label}</span>;
}
type BV = 'primary' | 'outline' | 'ghost' | 'danger'; type BS = 'default' | 'pressed' | 'disabled';
const BTN: Record<BV, Record<BS, string>> = {
  primary: { default: 'bg-b-6 text-white border-0', pressed: 'bg-b-7 text-white border-0', disabled: 'bg-n-4 text-white border-0' },
  outline: { default: 'bg-white text-b-6 border border-b-6', pressed: 'bg-b-1 text-b-6 border border-b-6', disabled: 'bg-white text-n-4 border border-n-4' },
  ghost: { default: 'bg-transparent text-b-6 border-0', pressed: 'bg-b-1 text-b-6 border-0', disabled: 'bg-transparent text-n-4 border-0' },
  danger: { default: 'bg-r-6 text-white border-0', pressed: 'bg-r-7 text-white border-0', disabled: 'bg-n-4 text-white border-0' },
};
export function MBtn({ label, variant = 'primary', state = 'default', className, onClick }: { label: ReactNode; variant?: BV; state?: BS; className?: string; onClick?: () => void }) {
  return <button onClick={onClick} disabled={state === 'disabled'} className={cn('box-border inline-flex h-10 items-center justify-center gap-1.5 rounded-[100px] px-5 text-[14px] font-bold leading-none', state === 'disabled' ? 'cursor-not-allowed' : 'cursor-pointer', BTN[variant][state], className)}>{label}</button>;
}
const FIELD: Record<string, string> = {
  default: 'border border-n-3 bg-white', focus: 'border-2 border-b-6 bg-b-1', filled: 'border border-n-5 bg-white', error: 'border border-r-6 bg-white', valid: 'border border-g-5 bg-white', disabled: 'border border-n-3 bg-n-1',
};
export function MInput({ label, value, state = 'default', helper, rightIcon }: { label?: string; value: string; state?: string; helper?: string; rightIcon?: string }) {
  const ph = state === 'default' || state === 'focus' || state === 'disabled';
  return (
    <div className="mb-3.5">
      {label && <div className="mb-[5px] text-xs font-medium leading-[normal] text-n-6">{label}</div>}
      <div className={cn('box-border flex h-11 items-center justify-between rounded-md px-3', FIELD[state] || FIELD.default)}>
        <span className={cn('truncate text-[14px] leading-[normal]', ph ? 'text-n-6' : 'text-n-7')}>{value}</span>
        {state === 'valid' ? <I n="checkmark-filled" s={16} c="var(--g6)" /> : rightIcon ? <I n={rightIcon} s={16} c="var(--n5)" /> : null}
      </div>
      {helper && <div className={cn('mt-1 text-xs leading-[normal]', state === 'error' ? 'text-r-6' : 'text-n-5')}>{helper}</div>}
    </div>
  );
}
export function MStepper({ value, trash }: { value: number; trash?: boolean }) {
  const b = 'inline-flex h-8 w-8 items-center justify-center rounded-md border p-0 text-base font-medium leading-[normal] text-n-6';
  return (
    <span className="inline-flex items-center rounded-md">
      <button className={cn(b, trash ? 'border-r-6 bg-r-6' : 'border-n-3 bg-white')}>{trash ? <I n="delete" s={14} c="#fff" /> : '−'}</button>
      <span className="min-w-10 text-center text-[14px] font-medium leading-[normal] text-n-7">{value}</span>
      <button className={cn(b, 'border-n-3 bg-white')}>+</button>
    </span>
  );
}
export function MPin({ num, variant = 'default' }: { num: number | string; variant?: 'default' | 'outline' | 'muted' | 'error' }) {
  const V = { default: 'bg-b-6 text-white border-b-6', outline: 'bg-white text-b-6 border-b-6', muted: 'bg-n-4 text-white border-n-4', error: 'bg-r-6 border-0' };
  return <span className={cn('inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border text-xs font-bold leading-[normal]', V[variant])}>{variant === 'error' ? <I n="close" s={14} c="#fff" /> : num}</span>;
}
export const MMeta = ({ icon, text }: { icon: string; text: string }) => <span className="inline-flex items-center gap-[3px] text-xs leading-[normal] text-n-5"><I n={icon} s={14} c="var(--n5)" />{text}</span>;
export const MCustomFieldChip = ({ label = 'Campo personalizado' }: { label?: string }) => <span className="inline-flex h-[22px] items-center gap-[5px] whitespace-nowrap rounded-[4px] bg-n-2 px-2 py-0.5 text-[11px] font-semibold leading-[normal] text-n-6"><span className="h-1.5 w-1.5 rounded-full bg-n-5" />{label}</span>;
const STATUS_ICON: Record<string, [string, string]> = { delivered: ['var(--g6)', 'checkmark-filled'], partial: ['var(--o5)', 'warning'], failed: ['var(--r6)', 'close-filled'] };

export interface OrderCardProps { num?: number; addr?: string; order?: string; person?: string; time?: string; items?: number; custom?: boolean; state?: string; selected?: boolean; pin?: 'default' | 'outline'; statusBadge?: boolean }
export function MOrderCard(o: OrderCardProps) {
  const state = o.state || 'default'; const err = state === 'error';
  const left = STATUS_ICON[state] ? <span className="shrink-0"><I n={STATUS_ICON[state][1]} s={20} c={STATUS_ICON[state][0]} /></span> : <MPin num={o.num ?? 1} variant={err ? 'error' : o.pin || 'default'} />;
  const hasSel = o.selected !== undefined && o.selected !== null;
  return (
    <div className={cn('flex items-start gap-2.5 rounded-lg bg-white p-3', o.selected ? 'border-2 border-b-6' : 'border border-n-3')}>
      {left}
      <div className="min-w-0 flex-1">
        <div className={cn('text-[14px] font-bold leading-[1.35]', err ? 'text-r-6' : 'text-n-7')}>{o.addr || ''}</div>
        {o.order && <div className="mt-0.5 text-[11px] font-semibold leading-[normal] text-n-6">{o.order}</div>}
        {err && <div className="mt-1 flex items-center gap-[5px] text-xs font-semibold leading-[normal] text-r-6"><I n="warning" s={14} c="var(--r6)" />Dirección no verificada</div>}
        {!err && (
          <div className="my-1.5 flex flex-wrap items-center gap-2">
            {o.statusBadge !== false && <MBadge label="Entrega" type="info" />}
            {o.custom !== false && <MCustomFieldChip />}
          </div>
        )}
        {!err && (
          <div className="flex flex-wrap items-center gap-2.5">
            {o.person && <MMeta icon="user" text={o.person} />}{o.time && <MMeta icon="time" text={o.time} />}{o.items != null && <MMeta icon="package" text={String(o.items)} />}
          </div>
        )}
      </div>
      {hasSel && <span className={cn('inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px]', o.selected ? 'bg-b-6' : 'border-[1.5px] border-n-4 bg-white')}>{o.selected && <I n="check" s={12} c="#fff" />}</span>}
    </div>
  );
}
export function MRouteCard({ title, cta, muted, plus24 }: { title?: string; cta?: boolean; muted?: boolean; plus24?: boolean }) {
  return (
    <div className="rounded-lg border border-n-3 bg-white p-3.5">
      <div className="text-[11px] leading-[normal] text-n-5">Ruta</div>
      <div className={cn('flex items-center gap-2 text-[14px] font-bold leading-[normal]', muted ? 'text-n-5' : 'text-n-7')}>{title}{muted && <MBadge label="Sin iniciar" type="neutral" />}</div>
      <div className={cn('flex flex-wrap items-center gap-2.5 pt-2.5', cta ? 'pb-3.5' : 'pb-0')}>
        <MMeta icon="truck" text="VEH 123" /><MMeta icon="package" text="12 órdenes" /><MMeta icon="package" text="200 items" />{muted && <MMeta icon="location" text="50 km" />}<MMeta icon="time" text="8:00 – 17:00" />{plus24 && <MMeta icon="calendar" text="+24 hrs" />}
      </div>
      {cta && <MBtn label="Iniciar ruta" className="w-full" />}
    </div>
  );
}
export function MRouteTabs({ active = 0, enroute = 12, done = 0, grey }: { active?: number; enroute?: number; done?: number; grey?: boolean }) {
  const tab = (on: boolean, icon: string, label: string) => (
    <div className={cn('flex h-10 flex-1 items-center justify-center gap-1.5 text-[14px] leading-[normal]', on ? 'border-b-2 border-b-6 font-bold text-b-6' : 'font-normal text-n-5')}>
      <I n={icon} s={16} c={on ? 'var(--b6)' : 'var(--n5)'} />{label}
    </div>
  );
  return <div className={cn('flex border-b', grey ? 'border-n-3 bg-n-1' : 'border-n-2 bg-white')}>{tab(active === 0, 'truck', `En ruta: ${enroute}`)}{tab(active === 1, 'task-complete', `Terminadas: ${done}`)}</div>;
}
export function MChip({ label, selected, tone = 'blue', icon, iconColor }: { label: string; selected?: boolean; tone?: 'blue' | 'amber'; icon?: string; iconColor?: string }) {
  return (
    <span className={cn('inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-xs font-medium leading-[normal]', selected ? (tone === 'amber' ? 'bg-o-1 text-o-7' : 'bg-b-6 text-white') : 'border border-n-3 bg-white text-n-6')}>
      {icon && <I n={icon} s={13} c={iconColor} />}{label}
    </span>
  );
}
export const MChipRow = ({ children, grey }: { children: ReactNode; grey?: boolean }) => <div className={cn('flex gap-1.5 overflow-x-auto px-3 py-2.5', grey ? 'bg-n-1' : 'bg-white')}>{children}</div>;
export const MDivider = ({ children, tone = 'gray' }: { children: ReactNode; tone?: 'gray' | 'blue' }) => <div className={cn('px-3 py-1.5 text-xs font-bold leading-[normal] text-n-6', tone === 'blue' ? 'bg-b-1' : 'bg-n-1')}>{children}</div>;
export function MSyncLabel({ state }: { state: 'syncing' | 'idle' }) {
  return state === 'syncing'
    ? <span className="inline-flex h-5 items-center gap-1 rounded-[4px] bg-g-1 px-2 text-[11px] font-semibold leading-[normal] text-g-7"><I n="refresh" s={12} c="var(--g7)" />Sincronizando</span>
    : <span className="inline-flex h-5 items-center gap-1 rounded-[4px] bg-n-2 px-2 text-[11px] font-semibold leading-[normal] text-n-5"><I n="ban" s={12} c="var(--n5)" />Sin sincronizar</span>;
}
export function MMapBg({ h = 160 }: { h?: number }) {
  return (
    <div className="relative overflow-hidden" style={{ height: h, background: 'repeating-linear-gradient(0deg,#E8EAED 0 1px,transparent 1px 28px),repeating-linear-gradient(90deg,#E8EAED 0 1px,transparent 1px 28px),linear-gradient(135deg,#EDEFF2,#E3E6EB)' }}>
      <div className="absolute left-[-5%] top-[30%] h-[5px] w-[60%] rotate-[18deg] rounded-[3px] bg-b-5" />
      <div className="absolute left-1/4 top-[55%] h-[5px] w-[55%] -rotate-12 rounded-[3px] bg-b-5" />
      <div className="absolute left-[35%] top-[40%] h-[5px] w-[30%] rotate-[40deg] rounded-[3px] bg-o-5" />
    </div>
  );
}
export function MMapPin({ label, bg = 'var(--b6)', selected, icon }: { label?: string; bg?: string; selected?: boolean; icon?: string }) {
  const size = selected ? 34 : 26;
  return (
    <span className="relative inline-flex flex-col items-center">
      <span className="flex items-center justify-center rounded-[50%_50%_50%_0] border-2 border-white shadow-[0_1px_3px_rgba(19,32,69,.3)]" style={{ width: size, height: size, background: bg, transform: 'rotate(-45deg)' }}>
        <span className="flex items-center justify-center font-bold leading-[normal] text-white" style={{ transform: 'rotate(45deg)', fontSize: selected ? 13 : 11 }}>{icon ? <I n={icon} s={14} c="#fff" /> : label}</span>
      </span>
    </span>
  );
}
export const MToggle = ({ on }: { on?: boolean }) => <span className={cn('relative inline-block h-5 w-9 shrink-0 rounded-full', on ? 'bg-b-6' : 'bg-n-4')}><span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white', on ? 'right-0.5' : 'left-0.5')} /></span>;

export function MRouteHeader({ title = '332131491204912', back, meta = true }: { title?: string; back?: boolean; meta?: boolean }) {
  return (
    <>
      <div className="flex justify-center pb-1 pt-2"><span className="h-1 w-9 rounded-full bg-n-3" /></div>
      <div className="flex items-center justify-between gap-2 px-3 pb-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {back ? <><I n="arrow-left" s={20} c="var(--n7)" /><span className="text-[14px] font-bold leading-[normal] text-n-7">{title}</span></> : (
            <div><div className="text-[11px] leading-[normal] text-n-5">Ruta</div><div className="max-w-[200px] truncate text-[14px] font-bold leading-[normal] text-n-7">{title}</div></div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2"><I n="search" s={20} c="var(--n6)" /><I n="overflow-menu-vertical" s={20} c="var(--n6)" /></div>
      </div>
      {meta && <div className="flex flex-wrap items-center gap-2 px-3 pb-2.5"><MMeta icon="package" text="12 órdenes" /><MMeta icon="package" text="200 items" /><MMeta icon="time" text="8:00 – 17:00" /><MMeta icon="time" text="4hrs 19min" /></div>}
    </>
  );
}
const TOAST = { success: { icon: 'checkmark-filled', color: '#57D9A3' }, error: { icon: 'misuse', color: '#FF7452' }, warning: { icon: 'warning-filled', color: '#FFE380' }, info: null } as const;
export function MToast({ text, tone = 'success', close = true }: { text: string; tone?: keyof typeof TOAST; close?: boolean | string }) {
  const t = TOAST[tone];
  return (
    <div className="box-border flex items-center gap-2.5 rounded-lg bg-n-7 px-3.5 py-3 shadow-[0_2px_8px_rgba(19,32,69,.32)]" style={t ? { border: `1.5px solid ${t.color}` } : undefined}>
      {t && <span className="flex shrink-0"><I n={t.icon} s={20} c={t.color} /></span>}
      <span className="flex-1 text-xs leading-[1.4] text-white">{text}</span>
      {close === false ? null : typeof close === 'string'
        ? <span className="shrink-0 cursor-pointer whitespace-nowrap text-[11px] font-bold uppercase leading-none tracking-[.04em] text-white underline">{close}</span>
        : <span className="flex shrink-0 cursor-pointer items-center opacity-60"><I n="close" s={18} c="#fff" /></span>}
    </div>
  );
}
export function MBanner({ text, tone = 'warning' }: { text: string; tone?: 'warning' | 'info' }) {
  const warn = tone === 'warning';
  return <div className={cn('flex items-start gap-2 rounded-md p-3', warn ? 'bg-o-1' : 'bg-b-1')}><I n={warn ? 'warning' : 'help-circle'} s={16} c={warn ? 'var(--o5)' : 'var(--b6)'} /><span className={cn('flex-1 text-xs leading-normal', warn ? 'text-o-7' : 'text-n-7')}>{text}</span></div>;
}
export function MReqRow({ icon, label, sub, state = 'default', preview }: { icon?: string; label: string; sub?: string; state?: 'required' | 'done' | 'default'; preview?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-n-2 px-3 py-3.5">
      {icon && <I n={icon} s={18} c="var(--n6)" />}
      <div className="min-w-0 flex-1"><div className="text-[14px] font-bold leading-[normal] text-n-7">{label}</div>{sub && <div className="mt-0.5 text-xs leading-[normal] text-n-5">{sub}</div>}</div>
      {preview}
      {state === 'done' ? <I n="checkmark-filled" s={18} c="var(--g6)" /> : state === 'required' ? <MBadge label="Requerido" type="warning" /> : <I n="chevron--right" s={16} c="var(--n5)" />}
    </div>
  );
}
export function MPhotoStrip({ count = 4, max = 10 }: { count?: number; max?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-[1.5px] border-dashed border-n-4"><I n="camera" s={18} c="var(--n5)" /></span>
      {Array.from({ length: count }, (_, i) => <span key={i} className="relative h-11 w-11 shrink-0 rounded-md bg-[linear-gradient(135deg,#C8D0DC,#9aa7b8)]">{i === count - 1 && <span className="absolute -right-1 -top-1"><I n="checkmark-filled" s={14} c="var(--g6)" /></span>}</span>)}
      <span className="ml-1 text-xs font-semibold leading-[normal] text-n-5">{count}/{max}</span>
    </div>
  );
}
export const MSignatureStroke = ({ color = 'var(--b6)' }: { color?: string }) => <svg viewBox="0 0 200 70" className="h-[50px] w-[140px]"><path d="M8,50 C20,10 30,60 42,38 C52,20 60,55 72,40 C88,20 96,58 110,35 C120,18 128,52 140,40 C150,30 160,46 175,22 L172,40 L185,30" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const TONE = { g: ['bg-g-1', 'border-g-5', 'var(--g7)', 'text-g-7'], o: ['bg-o-1', 'border-o-5', 'var(--o7)', 'text-o-7'], r: ['bg-r-1', 'border-r-6', 'var(--r6)', 'text-r-6'] } as const;
export function MStatusSelector({ options, selected }: { options: { label: string; icon: string; tone: 'g' | 'o' | 'r' }[]; selected: number }) {
  return (
    <div className="flex h-16 rounded-xl border border-n-3 bg-white">
      {options.map((o, i) => {
        const sel = i === selected; const t = TONE[o.tone] || TONE.g;
        const divider = i < options.length - 1 && !sel && i + 1 !== selected;
        return sel ? (
          <div key={i} className={cn('-m-px box-border flex h-full flex-1 flex-col items-center justify-center gap-[5px] rounded-xl border-[1.5px]', t[0], t[1])}><I n={o.icon} s={18} c={t[2]} /><span className={cn('whitespace-nowrap text-[13px] font-semibold leading-none', t[3])}>{o.label}</span></div>
        ) : (
          <div key={i} className={cn('box-border flex h-full flex-1 flex-col items-center justify-center gap-[5px]', divider && 'border-r border-n-3')}><I n={o.icon} s={18} c="var(--n4)" /><span className="whitespace-nowrap text-[13px] font-normal leading-none text-n-6">{o.label}</span></div>
        );
      })}
    </div>
  );
}

/* ── Piezas de pantalla ── */
export const MIconBtn = ({ icon }: { icon: string }) => <button className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent"><I n={icon} s={20} c="var(--n7)" /></button>;
export function MTopAppBar() {
  return <div className="flex h-14 shrink-0 items-center border-b border-n-3 bg-white px-1"><MIconBtn icon="menu" /><div className="flex min-w-0 flex-1 justify-center"><img src={LOGO_MOBILE} height={20} alt="LastMile" className="h-5 w-auto" /></div><MIconBtn icon="refresh" /></div>;
}
export function MDateNav({ label }: { label: string }) {
  const chev = (ic: string) => <button className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white shadow-[0_1px_2px_rgba(19,32,69,.12)]"><I n={ic} s={14} c="var(--n7)" /></button>;
  return <div className="m-3 flex h-8 items-center justify-between rounded-full bg-n-2 px-1">{chev('chevron--left')}<span className="text-xs font-medium leading-[normal] text-n-7">{label}</span>{chev('chevron--right')}</div>;
}
export const MPickupSelect = ({ label }: { label: string }) => <div className="mx-3 mt-3 flex h-10 cursor-pointer items-center justify-between rounded-md border border-n-3 bg-white px-3"><span className="text-[14px] leading-[normal] text-n-6">{label}</span><I n="chevron--down" s={16} c="var(--n5)" /></div>;
