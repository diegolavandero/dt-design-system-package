import { createPortal } from 'react-dom';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
export const BigBadgeCtx = createContext(false);
import { Card, SectionHeader, TCode, Td, TTable, UsageCard } from '../ui';
import { Icon } from '../icons';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
/* eslint-disable @typescript-eslint/no-explicit-any */
type Cell = any;
interface Col { label?: string; type?: string; sort?: 'asc' | 'desc'; sortable?: boolean; sub?: string }
interface Row { state?: string; cells?: Cell[] }
interface Def { label?: string; columns?: Col[]; rows?: Row[] }
interface TableData extends Head {
  pageUsage?: string; tokens?: Record<string, string>;
  rowTypes?: Array<{ label: string; bg?: string; stripeColor?: string; opacity?: number | string; description: string }>;
  cellTypes?: Array<{ id: string; label: string; description: string; badgeVariants?: Array<{ label: string; variant: string }> }>;
  columnTypeMap?: Record<string, string[]>;
  rowTypeDemo?: Def; cellTypeDemo?: Def; scrollDemo?: Def; cellTypeDemoGroups?: Def[];
}

const PC: Record<string, string> = {
  success: 'border-g-3 bg-g-1 text-g-7', danger: 'border-r-3 bg-r-1 text-r-6', error: 'border-r-3 bg-r-1 text-r-6',
  warning: 'border-o-3 bg-o-1 text-o-7', info: 'border-b-3 bg-b-1 text-b-6', neutral: 'border-n-4 bg-n-2 text-n-6', outline: 'border-n-4 bg-white text-n-6',
};
export const BadgeT = ({ label, type }: { label: string; type?: string }) => (
  <span className={cn('inline-flex h-[22px] items-center whitespace-nowrap rounded-[4px] border px-1.5 py-0.5 text-[11px] font-semibold leading-none', PC[type ?? 'neutral'] ?? PC.neutral)}>{label}</span>
);

const MB: Record<string, string> = { success: 'bg-[#E3FCEF] text-[#006844]', info: 'bg-b-1 text-b-7', warning: 'bg-o-1 text-o-7', danger: 'bg-r-1 text-r-6' };
const SORT = { both: 'M16 4L6 16h20L16 4zm0 24L6 16h20l-10 12z', asc: 'M6 20h20L16 8z', desc: 'M6 12h20l-10 12z' };
const Sort = ({ kind }: { kind: 'both' | 'asc' | 'desc' }) => <svg className="ml-[5px] inline align-middle opacity-[.55]" width="9" height="9" viewBox="0 0 32 32" fill="currentColor"><path d={SORT[kind]} /></svg>;
const sortOf = (c: Col) => c.sort === 'asc' ? <Sort kind="asc" /> : c.sort === 'desc' ? <Sort kind="desc" /> : c.sortable ? <Sort kind="both" /> : null;

function Track({ on: init, label }: { on: boolean; label?: string }) {
  const [on, setOn] = useState(init);
  const tr = <div onClick={() => setOn(!on)} className={cn('relative inline-block h-[17px] w-[30px] shrink-0 cursor-pointer rounded-full transition-colors duration-150', on ? 'bg-b-5' : 'bg-n-4')}><div className="absolute top-0.5 h-[13px] w-[13px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)] transition-[left] duration-150" style={{ left: on ? 15 : 2 }} /></div>;
  return label === undefined ? tr : <div className="inline-flex items-center gap-[7px] text-[13px] leading-[normal] text-n-7">{tr}<span>{label}</span></div>;
}
function Stars({ value }: { value: number }) {
  const [n, setN] = useState(Math.round(value || 0));
  const [h, setH] = useState(-1);
  return (
    <div className="inline-flex cursor-pointer gap-0.5" onMouseLeave={() => setH(-1)}>
      {[0, 1, 2, 3, 4].map((i) => <span key={i} onClick={() => setN(i + 1)} onMouseEnter={() => setH(i)} className="select-none text-[15px] leading-none transition-colors duration-[80ms]" style={{ color: i < n || i <= h ? '#FFAB00' : 'var(--n3)' }}>★</span>)}
    </div>
  );
}
const ABTN = 'flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-[4px] border-0 bg-transparent p-0 text-n-5 hover:bg-n-2 hover:text-n-7';
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function Actions({ acts }: { acts: string[] }) {
  const [menu, setMenu] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    if (!menu) return;
    const h = () => setMenu(null);
    const t = setTimeout(() => document.addEventListener('click', h), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', h); };
  }, [menu]);
  return (
    <div className="flex items-center gap-px">
      {(acts.length <= 2 ? acts : acts.slice(0, 1)).map((a) => <button key={a} type="button" title={a} className={ABTN}><Icon name={a} size={14} /></button>)}
      {acts.length > 2 && (
        <button type="button" title="More options" className={ABTN} onClick={(e) => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setMenu(menu ? null : { top: r.bottom + 4, left: Math.max(8, r.right - 180) }); }}><Icon name="overflow-menu-vertical" size={14} /></button>
      )}
      {menu && createPortal(
        <div className="docs-root fixed z-[9999] min-w-[168px] rounded-lg bg-white py-1 shadow-[0_4px_20px_rgba(0,0,0,.16),0_0_0_1px_rgba(0,0,0,.07)]" style={{ top: menu.top, left: menu.left }}>
          {acts.slice(1).map((a, i) => <div key={a} className={cn('flex h-10 cursor-pointer items-center gap-2.5 whitespace-nowrap px-3.5 text-[13px] text-n-7 hover:bg-b-1 hover:text-b-7', i === 0 && 'bg-n-2')}><Icon name={a} size={14} color="var(--n5)" />{cap(a)}</div>)}
        </div>, document.body)}
    </div>
  );
}

const TD = 'min-w-[110px] whitespace-nowrap border-b border-n-3 px-4 py-2.5 align-middle group-last:border-b-0';
const ACTS_TD = 'sticky right-0 z-[1] w-[82px] min-w-[82px] max-w-[82px] bg-white text-center shadow-[-6px_0_12px_-6px_rgba(0,0,0,.10)] before:pointer-events-none before:absolute before:-left-px before:inset-y-0 before:w-px before:bg-n-3';
const Two = ({ a, b, bc = 'text-n-5', first }: { a: string; b: string; bc?: string; first?: boolean }) => first
  ? <><span className="block text-[11px] leading-[1.3] text-n-5">{b}</span><span className="mt-0.5 block text-[13px] leading-[1.3] text-n-7">{a}</span></>
  : <><span className="block text-[13px] leading-[1.3] text-n-7">{a}</span><span className={cn('mt-0.5 block text-[11px] leading-[1.3]', bc)}>{b}</span></>;
function Td2({ cell, onSel }: { cell: Cell; onSel: (el: HTMLInputElement) => void }) {
  if (cell === null || cell === undefined) return <td className={TD} />;
  if (typeof cell !== 'object') return <td className={TD}>{String(cell)}</td>;
  const big = useContext(BigBadgeCtx);
  const v = cell.value;
  switch (cell.type) {
    case 'checkbox': return <td className={cn(TD, '!min-w-[40px] !max-w-[40px] !w-[40px] !px-0 text-center')}><div className="flex items-center justify-center"><input type="checkbox" defaultChecked={!!v} onClick={(e) => onSel(e.currentTarget)} className="h-3.5 w-3.5 cursor-pointer accent-b-5" /></div></td>;
    case 'avatar-text': {
      const ini = cell.initials || String(v ?? '').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
      return <td className={TD}><div className="flex items-center gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: cell.color || '#1F60ED' }}>{ini}</div><span>{v}</span></div></td>;
    }
    case 'text-icon': case 'icon-text': return <td className={TD}><div className="flex items-center gap-1.5"><Icon name={cell.icon || 'location'} size={14} color="var(--n5)" /><span>{v}</span></div></td>;
    case 'text-icon-right': return <td className={TD}><div className="flex items-center gap-1.5">{v} <Icon name={cell.icon || 'document'} size={14} color="var(--n5)" /></div></td>;
    case 'text-sub': return <td className={TD}><Two a={v ?? ''} b={cell.sub ?? ''} /></td>;
    case 'text-error': return <td className={TD}><Two a={v ?? ''} b={cell.error ?? ''} bc="text-r-6" /></td>;
    case 'text-icon-error': return <td className={TD}><div className="flex items-center gap-1.5"><Icon name="close-filled" size={14} color="var(--r6)" /><span className="text-[13px] leading-[1.3] text-n-7">{v}</span></div><span className="mt-0.5 block text-[11px] leading-[1.3] text-r-6">{cell.error}</span></td>;
    case 'sub-header': return <td className={TD}><Two a={v ?? ''} b={cell.sub ?? cell.label ?? ''} first /></td>;
    case 'link': return <td className={cn(TD, 'cursor-pointer font-semibold text-b-7')}>{v}</td>;
    case 'badge': return <td className={TD}>{big ? <BadgeT label={v ?? ''} type={cell.variant || 'neutral'} /> : <span className={cn('inline-flex h-[18px] items-center whitespace-nowrap rounded-[3px] px-1.5 text-[10px] font-semibold leading-none', MB[cell.variant] ?? 'bg-n-2 text-n-6')}>{v}</span>}</td>;
    case 'number': return <td className={cn(TD, 'text-right tabular-nums')}>{String(v ?? '')}</td>;
    case 'text-secondary': return <td className={cn(TD, 'text-n-5')}>{v}</td>;
    case 'rating': return <td className={TD}><Stars value={v} /></td>;
    case 'switch': return <td className={TD}><Track on={!!v} /></td>;
    case 'switch-text': return <td className={TD}><Track on={!!v} label={cell.label || (v ? 'On' : 'Off')} /></td>;
    case 'chip-lg': return <td className={TD}><span className="inline-flex items-center whitespace-nowrap rounded-[4px] border border-n-3 bg-n-2 px-3 py-[5px] text-[13px] text-n-7">{v}</span></td>;
    case 'chip-sm': return <td className={TD}><span className="inline-flex h-[22px] items-center whitespace-nowrap rounded-[4px] border border-n-4 bg-n-2 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-n-6">{v}</span></td>;
    case 'pill-new': return <td className={TD}><span className="inline-flex h-[22px] items-center whitespace-nowrap rounded-[4px] border border-b-3 bg-b-1 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-b-6">{v || 'New'}</span></td>;
    case 'loading-bar': { const pct = Math.min(100, Math.max(0, v || 0)); return <td className={TD}><div className="flex min-w-[90px] items-center gap-[7px]"><div className="h-[5px] flex-1 overflow-hidden rounded-[3px] bg-n-2"><div className="h-full rounded-[3px] bg-b-5 transition-[width] duration-[400ms]" style={{ width: `${pct}%` }} /></div><span className="min-w-[28px] whitespace-nowrap text-right text-[11px] text-n-5">{pct}%</span></div></td>; }
    case 'lazy': return <td className={TD}><div className="h-[13px] w-3/4 animate-pulse rounded-[3px] bg-n-2" /></td>;
    case 'actions': return <td className={cn(TD, ACTS_TD)}><Actions acts={v || []} /></td>;
    default: return <td className={TD}>{String(v ?? '')}</td>;
  }
}

const TH = 'whitespace-nowrap border-b border-n-4 bg-n-3 px-4 py-2.5 text-left text-[13px] font-bold text-n-7 min-w-[110px]';
export function DemoTable({ def }: { def: Def }) {
  const cols = def.columns ?? [], rows = def.rows ?? [];
  const isBulk = cols.some((c) => c.type === 'checkbox') && cols.some((c) => c.type === 'actions');
  const [sel, setSel] = useState<Set<number>>(new Set());
  const master = useRef<HTMLInputElement>(null);
  const bulkActs = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.cells?.forEach((c) => { if (c?.type === 'actions') (c.value as string[]).filter((a) => a !== 'edit').forEach((a) => s.add(a)); }));
    return [...s];
  }, [rows]);
  useEffect(() => { if (master.current) master.current.indeterminate = sel.size > 0 && sel.size < rows.length; }, [sel, rows.length]);
  const bulk = isBulk && sel.size >= 2;
  const toggle = (i: number, on: boolean) => setSel((s) => { const n = new Set(s); on ? n.add(i) : n.delete(i); return n; });
  return (
    <div className={cn('group/o relative', bulk && 'bulk-active')}>
      {isBulk && (
        <div className={cn('absolute left-10 right-0 top-0 z-[5] flex h-[39px] items-center gap-3 border-b border-b-3 bg-b-1 px-4 transition-[transform,opacity] duration-[220ms] ease-out', bulk ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-7 opacity-0')}>
          <span className="whitespace-nowrap text-[13px] font-semibold text-b-7">{sel.size} selected</span>
          <div className="flex items-center gap-1.5">{bulkActs.map((a) => <button key={a} type="button" title={a} className="inline-flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[4px] border border-b-3 bg-white px-2.5 text-xs font-medium text-b-7 transition-colors hover:border-b-5 hover:bg-b-1"><Icon name={a} size={14} color="currentColor" /><span>{cap(a)}</span></button>)}</div>
        </div>
      )}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-auto min-w-full border-collapse text-[13px] text-n-7">
          <thead><tr>
            {cols.map((c, i) => {
              if (c.type === 'lazy') return <th key={i} className={TH}><div className="h-2.5 w-[55%] animate-pulse rounded-[3px] bg-n-2" /></th>;
              if (c.type === 'checkbox') return <th key={i} className="w-10 !min-w-[40px] border-b border-n-4 bg-n-3 py-2.5 text-center">{isBulk ? <div className="flex items-center justify-center"><input ref={master} type="checkbox" checked={sel.size === rows.length && rows.length > 0} onChange={(e) => setSel(e.target.checked ? new Set(rows.map((_, k) => k)) : new Set())} className="h-3.5 w-3.5 cursor-pointer accent-b-5" /></div> : null}</th>;
              if (c.type === 'actions') return <th key={i} className="sticky right-0 z-[2] w-[82px] min-w-[82px] max-w-[82px] whitespace-nowrap border-b border-n-4 bg-n-3 px-1 py-2.5 text-center text-[13px] font-bold text-n-7 shadow-[-6px_0_12px_-6px_rgba(0,0,0,.14)] before:pointer-events-none before:absolute before:-left-px before:inset-y-0 before:w-px before:bg-n-4">{c.label}</th>;
              const inner = c.sub
                ? <div className="flex flex-col gap-px"><span className="mb-px text-[10px] font-normal normal-case tracking-normal text-n-5">{c.sub}</span><span>{c.label}{sortOf(c)}</span></div>
                : <>{c.label}{sortOf(c)}</>;
              return <th key={i} className={TH}><div className={cn(isBulk && 'transition-[transform,opacity] duration-[220ms]', bulk && 'translate-x-6 opacity-0')}>{inner}</div></th>;
            })}
          </tr></thead>
          <tbody>
            {rows.map((r, ri) => {
              const st = r.state === 'hover' ? 'hov' : r.state === 'selected' ? 'sel' : r.state === 'disabled' ? 'dis' : '';
              const picked = sel.has(ri);
              return (
                <tr key={ri} className={cn('group', st === 'dis' && 'pointer-events-none opacity-40',
                  (st === 'sel' || picked) ? '[&>td]:bg-b-1 [&>td:first-child]:shadow-[inset_3px_0_0_var(--g5)]' : st === 'hov' && '[&>td]:bg-n-2')}>
                  {(r.cells ?? []).map((c, ci) => <Td2 key={ci} cell={c} onSel={(el) => toggle(ri, el.checked)} />)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STitle = ({ children }: { children: ReactNode }) => <div className="mb-3.5 text-lg font-bold leading-none text-n-7" style={{ fontSize: 16 }}>{children}</div>;
const SDesc = ({ children }: { children: ReactNode }) => <div className="mb-3.5 text-[13px] leading-normal text-n-5">{children}</div>;
const Code = ({ children, mr }: { children: ReactNode; mr?: boolean }) => <TCode>{mr ? <span className="mr-[3px]">{children}</span> : children}</TCode>;

/* ───────── Responsive móvil ───────── */
const SNIP = {
  scroll: `/* ── Pattern 1: Horizontal scroll (default) ── */
.tbl-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
/* No extra CSS needed — .tbl-wrap already handles this */`,
  card: `/* ── Pattern 2: Card view ── */
@media (max-width: 639px) {
  .tbl-wrap table { display: none; }          /* hide desktop table */
  .tbl-cards      { display: flex; flex-direction: column; gap: 8px; }
}
.tbl-cards { display: none; }                 /* hidden on desktop */

/* Each card */
.tbl-card { background:#fff; border:1px solid var(--n3);
            border-radius:8px; overflow:hidden; }
.tbl-card-head { padding:10px 12px; display:flex; align-items:center;
                 gap:8px; border-bottom:1px solid var(--n3); }
.tbl-card-body { padding:8px 12px; }
.tbl-card-row  { display:flex; gap:6px; padding:3px 0;
                 font:400 12px var(--font-sans); }
.tbl-card-lbl  { width:64px; flex-shrink:0; color:var(--n5);
                 font-size:10px; padding-top:1px; }`,
  priority: `/* ── Pattern 3: Priority columns ── */
/* Mark columns as low priority in your column definitions */
/* data-priority="low" → hidden below 640px                 */

@media (max-width: 639px) {
  th[data-priority="low"],
  td[data-priority="low"] { display: none; }
}

/* Usage in tblDemoTable columns: */
{ label: 'Conductor', type: 'text', priority: 'low' }
{ label: 'Fecha',     type: 'date', priority: 'low' }
/* Core columns (always visible): # Orden, Cliente, Estado */`,
};
function CellText({ cell }: { cell: Cell }) {
  if (!cell) return <>—</>;
  if (typeof cell !== 'object') return <>{String(cell)}</>;
  if (cell.type === 'badge') return <span className={cn('inline-flex h-[18px] items-center rounded-[3px] px-1.5 text-[10px] font-semibold leading-none', MB[cell.variant] ?? 'bg-n-2 text-n-6')}>{cell.value}</span>;
  if (cell.type === 'avatar-text') return <span className="text-xs font-medium text-n-7">{cell.value}</span>;
  if (cell.type === 'chip-sm') return <span className="inline-flex h-[18px] rounded-[3px] border border-n-4 bg-n-2 px-1.5 text-[10px] font-semibold leading-[18px] text-n-6">{cell.value}</span>;
  return <>{String(cell.value ?? '')}</>;
}
const MTH = 'whitespace-nowrap px-2.5 py-2 text-left text-[11px] font-semibold uppercase leading-none tracking-[.04em] text-n-5';
function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase leading-[normal] tracking-[.04em] text-n-5"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>{label}</div>
      <div className="w-[375px] max-w-full overflow-hidden rounded-xl border-[1.5px] border-n-4 bg-n-2 shadow-[0_2px_12px_rgba(19,32,69,.08)]">
        <div className="flex h-1.5 items-center justify-center bg-n-3"><div className="h-[3px] w-8 rounded-sm bg-n-4" /></div>
        <div className="p-2">{children}</div>
      </div>
    </div>
  );
}
function Pattern({ n, title, badge, badgeCls, sub, pros, phone, phoneLabel, codeTitle, code }: { n: number; title: string; badge: string; badgeCls: string; sub?: string; pros: string[]; phone: ReactNode; phoneLabel: string; codeTitle: string; code: string }) {
  const when = 'mb-1.5 text-[11px] font-semibold uppercase leading-[normal] tracking-[.04em] text-n-5';
  return (
    <div className="mb-4 overflow-hidden rounded-[10px] border border-n-3 bg-white">
      <div className="flex items-center gap-2.5 border-b border-n-3 px-4 py-3.5">
        <span className="text-sm font-bold leading-[normal] text-n-7">{n} · {title}</span>
        <span className={cn('h-5 rounded-full px-2 text-[10px] font-bold leading-5', badgeCls)}>{badge}</span>
        {sub && <span className="ml-1 text-xs text-n-5">{sub}</span>}
      </div>
      <div className="flex flex-wrap items-start gap-6 px-4 py-5">
        <div className="min-w-[220px] flex-1">
          <div className={when}>When to use</div>
          <ul className="m-0 list-none p-0">{pros.map((p) => <li key={p} className="flex gap-1.5 py-0.5 text-xs leading-[normal] text-n-6"><span className="shrink-0 font-bold text-g-6">✓</span>{p}</li>)}</ul>
          <div className="mt-3.5"><Phone label={phoneLabel}>{phone}</Phone></div>
        </div>
        <div className="min-w-[260px] flex-1">
          <div className={when}>{codeTitle}</div>
          <pre className="mt-0 overflow-x-auto whitespace-pre rounded-md border border-n-3 bg-n-1 px-3.5 py-3 text-[11px] leading-[1.7] text-n-6" style={{ fontFamily: 'inherit' }}>{code}</pre>
        </div>
      </div>
    </div>
  );
}
function MobilePatterns({ sd }: { sd: Def }) {
  const cols = sd.columns ?? [], rows = (sd.rows ?? []).slice(0, 4);
  const pr = [cols[1], cols[2], cols[3]];
  const scroll = (
    <div className="overflow-x-auto rounded-md border border-n-3 bg-white">
      <table className="w-full min-w-[580px] border-collapse">
        <thead className="bg-n-2"><tr>{pr.concat([cols[4], cols[5]]).map((c, i) => <th key={i} className={MTH}>{c?.label}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => { const c = r.cells ?? []; return (
          <tr key={i} className="border-t border-n-3">
            <td className="whitespace-nowrap px-2.5 py-2 text-xs text-b-7">{String(c[1]?.value ?? '')}</td>
            <td className="whitespace-nowrap px-2.5 py-2 text-xs text-n-7">{c[2]?.value}</td>
            <td className="px-2.5 py-2"><CellText cell={c[3]} /></td>
            <td className="whitespace-nowrap px-2.5 py-2 text-xs text-n-7"><CellText cell={c[4]} /></td>
            <td className="whitespace-nowrap px-2.5 py-2 text-xs text-n-7">{c[5]?.value}</td>
          </tr>); })}</tbody>
      </table>
    </div>
  );
  const cards = rows.map((r, i) => {
    const c = r.cells ?? [];
    const ini = c[2]?.initials || String(c[2]?.value ?? '').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
    const acts: string[] = c[12]?.type === 'actions' ? (c[12].value ?? []).slice(0, 2) : [];
    const row = (l: string, v: ReactNode, grow?: boolean) => <div className="flex items-center gap-1.5"><span className="w-16 shrink-0 text-[10px] leading-[normal] text-n-5">{l}</span><span className={cn('text-xs leading-[normal] text-n-7', grow && 'flex-1')}>{v}</span></div>;
    return (
      <div key={i} className="mb-2 overflow-hidden rounded-lg border border-n-3 bg-white">
        <div className="flex items-center gap-2 border-b border-n-3 px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none text-white" style={{ background: c[2]?.color || 'var(--b6)' }}>{ini}</div>
          <div className="min-w-0 flex-1"><div className="text-xs font-bold leading-none text-b-7">{String(c[1]?.value ?? '—')}</div><div className="mt-0.5 text-[11px] font-medium leading-none text-n-7"><CellText cell={c[2]} /></div></div>
          {c[3] && <CellText cell={c[3]} />}
        </div>
        <div className="flex flex-col gap-[5px] px-3 py-2">{row('Zona', <CellText cell={c[4]} />)}{row('Dirección', c[5]?.value ?? '—', true)}{row('Conductor', String(c[6]?.value ?? '—'))}</div>
        {acts.length > 0 && <div className="flex justify-end gap-1 border-t border-n-3 px-3 py-2">{acts.map((a) => <button key={a} className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] border-0 bg-n-2 text-n-6"><Icon name={a} size={13} color="currentColor" /></button>)}</div>}
      </div>
    );
  });
  const priority = (
    <div className="overflow-hidden rounded-md border border-n-3 bg-white">
      <table className="w-full border-collapse"><thead className="bg-n-2"><tr>{pr.map((c, i) => <th key={i} className={MTH}>{c?.label}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => { const c = r.cells ?? []; return <tr key={i} className="border-t border-n-3"><td className="whitespace-nowrap px-2.5 py-2 text-xs text-b-7">{String(c[1]?.value ?? '')}</td><td className="whitespace-nowrap px-2.5 py-2 text-xs text-n-7">{c[2]?.value}</td><td className="px-2.5 py-2"><CellText cell={c[3]} /></td></tr>; })}</tbody></table>
      <div className="flex items-center gap-1 border-t border-n-3 px-2.5 py-2 text-[11px] text-n-5"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>4 columnas ocultas en mobile</div>
    </div>
  );
  return (
    <div className="mt-8">
      <STitle>Mobile responsive patterns</STitle>
      <p className="mb-5 text-[13px] leading-[1.6] text-n-5">Three patterns depending on table density and use case. All previews are at 375px (iPhone 14 width).</p>
      <Pattern n={1} title="Horizontal scroll" badge="Default" badgeCls="bg-g-1 text-g-7" sub="No extra CSS needed — built into .tbl-wrap" pros={['All columns are equally important', 'Users need to compare values across columns', 'Table has fewer than 7 columns']} phone={scroll} phoneLabel="Mobile · 375px — scrolls horizontally" codeTitle="CSS" code={SNIP.scroll} />
      <Pattern n={2} title="Card view" badge="Recommended for dense tables" badgeCls="bg-b-1 text-b-7" pros={['Table has 6+ columns', 'Row identity is key (orders, deliveries, clients)', 'Users scan per-record rather than compare columns']} phone={<>{cards}</>} phoneLabel="Mobile · 375px — card per row" codeTitle="CSS + HTML structure" code={SNIP.card} />
      <Pattern n={3} title="Priority columns" badge="Balanced" badgeCls="bg-o-1 text-o-7" pros={['Table has 4–6 columns', '2–3 columns are critical, others are secondary', 'Actions need to remain visible at all times']} phone={priority} phoneLabel="Mobile · 375px — 3 key columns only" codeTitle="CSS" code={SNIP.priority} />
      <div className="mt-1 rounded-lg border border-n-3 bg-white p-4">
        <div className="mb-2.5 text-xs font-semibold text-n-7">Breakpoints reference</div>
        <div className="grid grid-cols-3 gap-2">
          {[['Mobile', '< 640px', 'Card view or priority cols'], ['Tablet', '640–1023px', 'Scroll or reduced cols'], ['Desktop', '≥ 1024px', 'Full table with all columns']].map(([l, bp, rec]) => (
            <div key={l} className="rounded-md border border-n-3 px-3 py-2.5"><div className="mb-0.5 text-[11px] font-bold text-n-7">{l}</div><div className="mb-1 text-[11px] font-semibold text-b-6">{bp}</div><div className="text-[11px] text-n-5">{rec}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSection({ data }: { data: TableData }) {
  const badgeVars = data.cellTypes?.find((c) => c.badgeVariants)?.badgeVariants;
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      <div className="mb-7">
        <STitle>Row types</STitle>
        {data.rowTypeDemo && <Card flush className="!mb-3.5"><DemoTable def={data.rowTypeDemo} /></Card>}
        <Card>
          <TTable head={['State', 'Background', 'Description']}>
            {data.rowTypes?.map((rt) => (
              <tr key={rt.label}>
                <Td><strong>{rt.label}</strong></Td>
                <Td>
                  <span className="mr-[5px] inline-block h-4 w-4 rounded-[3px] border border-black/10 align-middle" style={{ background: rt.bg || '#fff', boxShadow: rt.stripeColor ? `inset 3px 0 0 ${rt.stripeColor}` : undefined, opacity: rt.opacity ? 0.4 : undefined }} />
                  <TCode>{rt.bg || '—'}</TCode>{rt.stripeColor && <> + <TCode>{rt.stripeColor}</TCode> stripe</>}{rt.opacity ? <> · {rt.opacity} opacity</> : null}
                </Td>
                <Td>{rt.description}</Td>
              </tr>
            ))}
          </TTable>
        </Card>
      </div>

      {data.scrollDemo && (
        <div className="mb-7">
          <STitle>Sticky actions · horizontal scroll</STitle>
          <SDesc>With many columns the Actions column stays fixed to the right edge — white background so it covers scrolled content. All other columns scroll under it.</SDesc>
          <Card flush><DemoTable def={data.scrollDemo} /></Card>
        </div>
      )}

      <div className="mb-7">
        <STitle>Cell types</STitle>
        {data.cellTypeDemo && <Card flush className="!mb-5"><DemoTable def={data.cellTypeDemo} /></Card>}
        {data.cellTypeDemoGroups?.map((g) => (
          <div key={g.label} className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase leading-[normal] tracking-[.05em] text-n-5">{g.label}</div>
            <Card flush><DemoTable def={g} /></Card>
          </div>
        ))}
        {badgeVars && <div className="mb-3.5"><span className="mr-2.5 text-[11px] font-semibold uppercase tracking-[.05em] text-n-5">Badge variants</span>{badgeVars.map((b) => <span key={b.label} className="mr-1"><BadgeT label={b.label} type={b.variant} /></span>)}</div>}
        <Card>
          <TTable head={['ID', 'Label', 'Description']}>{data.cellTypes?.map((ct) => <tr key={ct.id}><Td><TCode>{ct.id}</TCode></Td><Td><strong>{ct.label}</strong></Td><Td>{ct.description}</Td></tr>)}</TTable>
        </Card>
      </div>

      <div className="mb-7">
        <STitle>Column type inference</STitle>
        <SDesc>Column names matching these patterns are auto-assigned the corresponding cell type.</SDesc>
        <Card><TTable head={['Cell type', 'Matching column names']}>{Object.entries(data.columnTypeMap ?? {}).map(([t, ps]) => <tr key={t}><Td><TCode>{t}</TCode></Td><Td>{ps.map((p) => <Code key={p} mr>{p || '""'}</Code>)}</Td></tr>)}</TTable></Card>
      </div>

      <div>
        <STitle>Tokens</STitle>
        <Card><TTable head={['Token', 'Value']}>{Object.entries(data.tokens ?? {}).map(([k, v]) => <tr key={k}><Td><TCode>{k}</TCode></Td><Td>{v}</Td></tr>)}</TTable></Card>
      </div>

      {data.scrollDemo && <MobilePatterns sd={data.scrollDemo} />}
    </>
  );
}
