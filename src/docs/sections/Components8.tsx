import { useState } from 'react';
import { Card, SectionHeader, TTable, TCode, Td, Banner, UsageCard } from '../ui';
import { Icon } from '../icons';
import { SettingsSidebar, type SbItem, type SbProduct } from './shared';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
interface SidebarData extends Head { tokens?: Record<string, string>; mobileTokens?: Record<string, string>; products?: SbProduct[]; pageUsage?: string }
const BASE = import.meta.env.BASE_URL;

/* Desktop colapsado → hover para expandir */
function Collapsed({ items }: { items: SbItem[] }) {
  return (
    <div className="group/sb min-h-[600px] w-[52px] shrink-0 cursor-default overflow-hidden rounded-br-[24px] bg-white py-2 shadow-[0_6px_12px_rgba(0,0,0,.15)] transition-[width] duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)] hover:w-60">
      {items.map((it, i) => it.divider ? <div key={i} className="mx-3.5 my-1 h-px bg-[#E9ECF2]" /> : (
        <div key={i} className={cn('group/row flex h-10 cursor-pointer items-center')}>
          <div className={cn('h-10 w-1.5 shrink-0', it.state === 'selected' ? 'bg-[#0052CC]' : 'bg-transparent')} />
          <div className={cn('flex h-10 flex-1 items-center transition-colors duration-[120ms]', it.state === 'selected' ? 'bg-[rgba(75,130,250,.08)]' : 'group-hover/row:bg-[rgba(75,130,250,.04)]')}>
            <div className="flex w-[46px] shrink-0 items-center justify-center"><Icon name={it.icon ?? 'apps'} size={18} color={it.state === 'selected' ? '#0052CC' : '#4B82FA'} className="block" /></div>
            <span className={cn('flex-1 overflow-hidden whitespace-nowrap text-[13px] leading-none opacity-0 transition-opacity delay-[60ms] duration-[180ms] group-hover/sb:opacity-100', it.state === 'selected' ? 'font-semibold text-[#0052CC]' : 'text-[#39414D]')}>{it.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const MOBILE_LOGO: Record<string, string> = { lastmile: 'lastmile-mobile-white.svg', plannerpro: 'plannerpro-mobile-white.svg', ondemand: 'ondemand-mobile-white.svg' };
const HAMB = <svg width="22" height="22" viewBox="0 0 32 32" fill="#fff"><path d="M4 8h24v2H4zM4 15h24v2H4zM4 22h24v2H4z" /></svg>;
const CLOSE = <svg width="22" height="22" viewBox="0 0 32 32" fill="#39414D"><path d="M24 9.4 22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16z" /></svg>;

function Phone({ p }: { p: SbProduct }) {
  const [open, setOpen] = useState(false);
  const logo = MOBILE_LOGO[p.id]
    ? <img src={`${BASE}sections/assets/logos/${MOBILE_LOGO[p.id]}`} height={16} alt={p.name} className="block h-4 w-auto shrink-0" />
    : <span className="whitespace-nowrap text-[11px] font-bold text-white">{p.name}</span>;
  return (
    <div className="w-60 rounded-[28px] bg-[#1a1a1a] p-2 shadow-[0_8px_24px_rgba(0,0,0,.3)]">
      <div className="relative h-[480px] overflow-hidden rounded-[22px] bg-n-2">
        <div className="absolute left-1/2 top-1.5 z-[5] h-1 w-[60px] -translate-x-1/2 rounded-sm bg-[#1a1a1a]" />
        {!open ? (
          <div className="absolute inset-0 flex flex-col">
            <div className="h-[22px]" />
            <div className="flex flex-1 flex-col bg-white">
              <div className="flex h-[52px] shrink-0 items-center gap-2.5 bg-[#132045] px-3">
                <button onClick={() => setOpen(true)} className="flex shrink-0 cursor-pointer items-center border-0 bg-transparent p-0.5">{HAMB}</button>
                {logo}
                <div className="ml-auto flex items-center gap-3.5">
                  <div className="relative"><Icon name="alerts" size={16} color="#fff" /><div className="absolute -right-0.5 -top-0.5 h-[5px] w-[5px] rounded-full bg-[#FF5630]" /></div>
                  <Icon name="user" size={16} color="#fff" />
                </div>
              </div>
              <div className="flex flex-col gap-2 p-3">
                {[['h-3.5 w-2/5 rounded-[4px]'], ['h-2.5 w-[70%] rounded-[3px]'], ['h-2.5 w-[55%] rounded-[3px]'], ['mt-1.5 h-20 rounded-md'], ['h-2.5 w-[80%] rounded-[3px]'], ['h-2.5 w-[60%] rounded-[3px]']].map(([c], i) => <div key={i} className={cn('bg-n-2', c)} />)}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <div className="h-[22px]" />
            <div className="relative flex-1 bg-white">
              <div className="flex h-[52px] shrink-0 items-center bg-[#132045] px-3">{logo}</div>
              <div onClick={() => setOpen(false)} className="absolute inset-x-0 bottom-0 top-[52px] z-[1] cursor-pointer bg-[rgba(19,32,69,.45)]" />
              <div className="absolute inset-y-0 left-0 z-[2] flex w-[208px] flex-col bg-white shadow-[3px_0_16px_rgba(0,0,0,.18)]">
                <div className="flex h-[52px] shrink-0 items-center gap-2.5 bg-[#132045] px-3">
                  <button onClick={() => setOpen(false)} className="flex cursor-pointer items-center border-0 bg-transparent p-0.5">{CLOSE}</button>{logo}
                </div>
                <div className="flex-1 overflow-y-auto py-1.5">
                  {p.items.map((it, i) => it.divider ? <div key={i} className="mx-3 my-[3px] h-px bg-[#E9ECF2]" /> : (
                    <div key={i} className={cn('flex h-10 cursor-pointer items-center gap-3 px-3.5', it.state === 'selected' && 'border-l-[3px] border-[#0052CC] bg-[rgba(75,130,250,.08)] !pl-[11px]')}>
                      <Icon name={it.icon ?? 'apps'} size={20} color={it.state === 'selected' ? '#0052CC' : '#4B82FA'} className="block shrink-0" />
                      <span className={cn('text-[13px] leading-none', it.state === 'selected' ? 'font-semibold text-[#0052CC]' : 'text-[#39414D]')}>{it.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Mini = ({ children }: { children: string }) => <div className="text-[10px] font-medium uppercase leading-[normal] tracking-[.07em] text-n-5">{children}</div>;
const Dot = ({ c = 'bg-b-6', children }: { c?: string; children: string }) => <div className="flex items-center gap-2"><span className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', c)} />{children}</div>;
const Anat = ({ title, rows }: { title: string; rows: Array<[string, string?]> }) => (
  <div className="rounded-lg border border-n-3 bg-white px-3.5 py-3">
    <div className="mb-2 text-xs font-bold text-n-7">{title}</div>
    <div className="flex flex-col gap-[5px] text-xs leading-[normal] text-n-5">{rows.map(([t, c]) => <Dot key={t} c={c}>{t}</Dot>)}</div>
  </div>
);
const H3 = ({ children }: { children: string }) => <h3 className="mb-2.5 mt-5 text-[15px] font-bold leading-[1.4] text-n-7">{children}</h3>;
const DesktopIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
const PhoneIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>;

export function Sidebar({ data }: { data: SidebarData }) {
  const mt = data.mobileTokens ?? {};
  const tokRows = (o?: Record<string, string>) => Object.entries(o ?? {}).filter(([k]) => k !== 'note').map(([k, v]) => <tr key={k}><Td><TCode>{k}</TCode></Td><Td><TCode>{String(v)}</TCode></Td></tr>);
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      {mt.note && <Banner kind="in" className="mb-3.5">{mt.note}</Banner>}
      <Card className="!bg-n-2">
        {data.products?.map((p) => (
          <div key={p.id} className="mb-10">
            <div className="mb-4 flex items-center gap-2"><div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }} /><span className="text-[14px] font-bold text-n-7">{p.name}</span></div>
            <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold leading-[normal] text-n-7">{DesktopIcon}Desktop</div>
            <div className="mb-5 flex flex-col gap-5">
              <div className="flex flex-col gap-[7px]"><Mini>Collapsed → hover to expand</Mini><Collapsed items={p.items} /></div>
              {(p.settingsPanel || p.settingsItems) && <div className="flex flex-col gap-[7px]"><Mini>Settings mode — panel pushes content right</Mini><SettingsSidebar product={p} /></div>}
            </div>
            <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold leading-[normal] text-n-7">{PhoneIcon}Mobile · interactive</div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="flex flex-col gap-[7px]">
                <div className="text-[10px] font-medium uppercase leading-[normal] tracking-[.07em] text-n-5">Tap <strong className="text-n-7">☰</strong> to open · tap overlay or <strong className="text-n-7">×</strong> to close</div>
                <Phone p={p} />
              </div>
              <div className="flex min-w-[220px] flex-1 flex-col gap-2.5 pt-6">
                <Anat title="Mobile topbar anatomy" rows={[['Hamburger icon — leftmost, 44×44px touch target'], ['Product logo — after hamburger, height 16px white'], ['Right icons — only Alerts + User (no apps/help/gear)'], ['Company slot — hidden on mobile', 'bg-b-5']]} />
                <Anat title="Mobile drawer anatomy" rows={[['Slides in from left, width 208px'], ['Header: indigo bg · × close icon + logo'], ['Nav rows: 40px height (compact), 13px font'], ['Overlay: rgba(19,32,69,.45) — tap to close']]} />
              </div>
            </div>
          </div>
        ))}
      </Card>
      <H3>Desktop tokens</H3>
      <Card><TTable head={['Token', 'Value']}>{tokRows(data.tokens)}</TTable></Card>
      <H3>Mobile tokens</H3>
      <Card><TTable head={['Token', 'Value']}>{tokRows(mt)}</TTable></Card>
    </>
  );
}
