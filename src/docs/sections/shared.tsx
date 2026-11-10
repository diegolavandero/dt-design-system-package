import type { ReactNode } from 'react';
import { Icon } from '../icons';
import { cn } from '@/ds/lib/cn';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SbItem { icon?: string; label?: string; state?: string; divider?: boolean }
export interface SbProduct {
  id: string; name: string; color?: string; items: SbItem[]; settingsItems?: SbItem[];
  settingsPanel?: { groups?: Array<{ label: string; items?: Array<{ label: string; state?: string; count?: number }> }>; version?: string };
  logoWhite?: string; logoDesktop?: string;
}

/** Layout de "Settings": barra de iconos (52px) + panel de grupos (224px) + contenido. Réplica de buildSettingsSidebar(). */
export function SettingsSidebar({ product, activeItem, children }: { product: Partial<SbProduct>; activeItem?: string | null; children?: ReactNode }) {
  const items = product.settingsItems ?? product.items ?? [];
  const sp = product.settingsPanel;
  return (
    <div className="flex w-full min-h-[600px] overflow-hidden rounded-br-[24px] border border-n-3 shadow-none">
      <div className="w-[52px] shrink-0 overflow-y-auto border-r border-[#E9ECF2] bg-white py-2">
        {items.map((it, i) => it.divider
          ? <div key={i} className="mx-2 my-1 h-px bg-[#E9ECF2]" />
          : (
            <div key={i} className="flex h-10 items-center border-l-[6px]" style={{ borderColor: it.state === 'selected' ? '#0052CC' : 'transparent' }}>
              <div className="flex h-10 flex-1 items-center justify-center" style={it.state === 'selected' ? { background: 'rgba(75,130,250,.08)' } : undefined}>
                <Icon name={it.icon ?? 'apps'} size={18} color={it.state === 'selected' ? '#0052CC' : '#4B82FA'} />
              </div>
            </div>
          ))}
      </div>
      {sp?.groups && (
        <div className="w-56 shrink-0 self-stretch overflow-y-auto border-r border-[#E9ECF2] bg-white py-2">
          {sp.groups.map((g) => (
            <div key={g.label} className="mb-1">
              <div className="px-4 pb-1.5 pt-3 text-[14px] font-bold leading-none text-n-7">{g.label}</div>
              <div className="ml-3.5">
                {(g.items ?? []).map((it) => {
                  const sel = it.state === 'selected' || it.label === activeItem;
                  return (
                    <div key={it.label} className="flex h-9 items-center justify-between pl-3.5 pr-4" style={{ borderLeft: sel ? '2px solid #0052CC' : '2px solid #E9ECF2', background: sel ? 'rgba(75,130,250,.08)' : undefined }}>
                      <span className="text-[13px] leading-none" style={{ fontWeight: sel ? 700 : 400, color: sel ? '#0052CC' : 'var(--n6)' }}>{it.label}</span>
                      {it.count != null && <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-[10px] bg-b-2 px-1.5 text-[11px] font-semibold leading-none text-b-6">{it.count}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {sp.version && <><div className="mx-4 my-2 h-px bg-[#E9ECF2]" /><div className="px-4 py-2.5 text-[11px] text-n-5">Versión {sp.version}</div></>}
        </div>
      )}
      {children != null
        ? <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
        : <div className="flex w-[180px] items-start rounded-br-[24px] bg-n-1 p-5"><span className="text-xs text-n-4">Content pushed right</span></div>}
    </div>
  );
}

export const cx = cn;

/* ── Topbar: ayuda (dropdown fijo) y chip Capacitaciones ── */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function TopbarHelp({ withCapacitaciones = true }: { withCapacitaciones?: boolean }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const dd = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pos) return;
    const h = (e: MouseEvent) => { if (!dd.current?.contains(e.target as Node) && !ref.current?.contains(e.target as Node)) setPos(null); };
    const t = setTimeout(() => document.addEventListener('click', h), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', h); };
  }, [pos]);
  const item = (icon: string, label: string) => (
    <div key={label} className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 hover:bg-n-1">
      <span className="flex shrink-0"><Icon name={icon} size={16} color="var(--n5)" /></span><span className="text-[13px] font-medium text-n-7">{label}</span>
    </div>
  );
  return (
    <div className="relative flex items-center">
      <span ref={ref} title="Ayuda" className="flex cursor-pointer items-center"
        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos(pos ? null : { top: r.bottom + 8, right: window.innerWidth - r.right + 8 }); }}>
        <Icon name="help" size={18} color="#fff" />
      </span>
      {pos && createPortal(
        <div ref={dd} className="docs-root fixed z-[9999] min-w-[210px] overflow-hidden rounded-lg border border-n-3 bg-white shadow-[0_4px_16px_rgba(19,32,69,.14)]" style={{ top: pos.top, right: pos.right }}>
          <div className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[.07em] text-n-5">Ayuda</div>
          <div className="h-px bg-n-3" />
          {item('help', 'Help Center')}{item('code', 'API Documentation')}{withCapacitaciones && item('education', 'Capacitaciones')}
        </div>, document.body)}
    </div>
  );
}

export function CapChip({ total = 49, pct = 13, onClick }: { total?: number; pct?: number; onClick?: () => void }) {
  return (
    <button type="button" title="Capacitaciones" onClick={onClick} className="inline-flex h-[30px] shrink-0 cursor-pointer items-center gap-[7px] rounded-full border border-white/20 bg-white/10 px-[13px] text-xs font-bold leading-none text-white hover:bg-white/20">
      <span className="flex shrink-0"><Icon name="education" size={16} color="#fff" /></span><span>{total} tutoriales · {pct}%</span>
    </button>
  );
}

/** Icono de campana con punto de alerta (`.bell`). */
export const Bell = ({ children }: { children: ReactNode }) => <div className="relative flex items-center after:absolute after:-right-0.5 after:-top-0.5 after:h-[7px] after:w-[7px] after:rounded-full after:border-2 after:border-indigo after:bg-r-5 after:content-['']">{children}</div>;
