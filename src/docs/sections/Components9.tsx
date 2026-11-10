import { Card, SectionHeader, TTable, TCode, Td, UsageCard } from '../ui';
import { Icon } from '../icons';
import { Bell, CapChip, TopbarHelp } from './shared';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
interface Variant { breakpoint: string; width: string; logo: string; icons: string[]; customerSlot?: { text?: string; show?: boolean } }
interface TopbarData extends Head {
  tokens?: Record<string, any>; iconOrder?: string[]; breakpoints?: Record<string, string>; pageUsage?: string;
  products?: Array<{ id: string; name: string; logoDesktop?: string; logoMobile?: string; variants?: Variant[] }>;
}
const BASE = import.meta.env.BASE_URL;
const asset = (p: string) => /^https?:|^data:/.test(p) ? p : `${BASE}${p.replace(/^\//, '')}`;
const HAMB = <svg width="20" height="20" viewBox="0 0 32 32" fill="#fff" className="block shrink-0"><path d="M4 8h24v2H4zM4 15h24v2H4zM4 22h24v2H4z" /></svg>;
const BPL: Record<string, string> = { desktop: 'Desktop', tablet: 'Tablet ≥768px', mobile: 'Mobile <768px' };

function Icons({ names, size = 18 }: { names: string[]; size?: number }) {
  return <>{names.map((n) => n === 'help' ? <TopbarHelp key={n} /> : n === 'alerts' ? <Bell key={n}><Icon name={n} size={size} color="#fff" /></Bell> : <Icon key={n} name={n} size={size} color="#fff" className="shrink-0" />)}</>;
}
const Tbar = ({ mobile, style, children }: { mobile?: boolean; style?: React.CSSProperties; children: React.ReactNode }) => (
  <div className={cn('flex h-[52px] items-center overflow-hidden rounded-[4px] bg-indigo', mobile ? 'px-4' : 'px-[22px]')} style={style}>{children}</div>
);
const Acts = ({ mobile, children }: { mobile?: boolean; children: React.ReactNode }) => <div className={cn('ml-auto flex items-center', mobile ? 'gap-3.5' : 'gap-7')}>{children}</div>;
const Slot = ({ mobile, children }: { mobile?: boolean; children: React.ReactNode }) => (
  <div className={cn('ml-5 flex h-[52px] shrink-0 items-center justify-center rounded-tl-[20px] bg-white font-bold text-indigo', mobile ? 'w-10 text-[10px]' : 'w-[98px] text-[11px]')}>{children}</div>
);
const C = ({ children }: { children: React.ReactNode }) => <code className="rounded-[3px] bg-n-2 px-[5px] py-px text-[11px] font-medium">{children}</code>;
const H = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => <div className="mb-1 flex items-center gap-2 text-[15px] font-bold leading-[normal] text-n-7">{icon}{children}</div>;
const P = ({ children }: { children: React.ReactNode }) => <p className="mb-4 text-[13px] leading-[1.6] text-n-5">{children}</p>;
const L = ({ children }: { children: React.ReactNode }) => <div className="mb-2 text-[11px] font-semibold uppercase leading-[normal] tracking-[.05em] text-n-5">{children}</div>;

export function Topbar({ data }: { data: TopbarData }) {
  const t = data.tokens ?? {};
  const order = data.iconOrder ?? ['apps', 'alerts', 'messages', 'help', 'user'];
  const colors = t.productColors as Record<string, string> | undefined;
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      <Card className="flex flex-col gap-5 !bg-n-2">
        {data.products?.map((p) => (
          <div key={p.id}>
            <div className="mb-1.5 text-[11px] font-medium uppercase leading-[normal] tracking-[.05em] text-n-5">{p.name}</div>
            {p.variants?.map((v) => {
              const mob = v.breakpoint === 'mobile';
              return (
                <div key={v.breakpoint} className="mb-1.5">
                  <div className="mb-[3px] text-[9px] font-medium uppercase leading-[normal] tracking-[.07em] text-n-4">{BPL[v.breakpoint] ?? v.breakpoint}</div>
                  <Tbar mobile={mob} style={{ maxWidth: v.breakpoint === 'desktop' ? '100%' : v.width, ...(mob ? { gap: 10, padding: '0 12px' } : {}) }}>
                    {mob && HAMB}
                    <img src={asset(v.logo)} height={mob ? 16 : 18} alt={p.name} className="block shrink-0" style={{ height: mob ? 16 : 18 }} />
                    <Acts mobile={mob}><Icons names={v.icons} /></Acts>
                    {!mob && v.customerSlot?.show && <Slot>{v.customerSlot.text}</Slot>}
                  </Tbar>
                </div>
              );
            })}
          </div>
        ))}
      </Card>

      <Card className="!mb-0 mt-2.5 !p-3.5">
        <div className="text-xs leading-[1.8] text-n-5">
          <strong className="text-n-7">Rules:</strong> background always <C>#132045</C> · height 52px · company slot <C>border-radius: 25px 0 0 0</C> · usar logo <strong>white</strong> sobre fondo oscuro
        </div>
        {data.breakpoints && <div className="mt-2.5 flex flex-col gap-1">{Object.entries(data.breakpoints).map(([bp, d]) => <div key={bp} className="text-[11px] text-n-5"><strong className="capitalize text-n-7">{bp}</strong> — {d}</div>)}</div>}
        {colors && <div className="mt-2.5 flex flex-wrap gap-4">{Object.entries(colors).map(([n, hex]) => <div key={n} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ background: hex }} /><span className="text-xs text-n-5">{n} · {hex}</span></div>)}</div>}
      </Card>

      <div className="mt-6">
        <H icon={<Icon name="education" size={14} color="var(--b6)" />}>Variante — Topbar con Capacitaciones</H>
        <P>Mueve <strong className="text-n-7">Capacitaciones</strong> fuera del menú de ayuda a un chip propio en la barra, con el <strong className="text-n-7">total de tutoriales</strong> y el <strong className="text-n-7">porcentaje de avance</strong>. Al hacer clic abre el centro de capacitaciones. El conteo y el porcentaje son dinámicos: si se agrega un tutorial, el total sube y el porcentaje baja (incluso desde 100%).</P>
        <Card className="!bg-n-2">
          <Tbar>
            <img src={`${BASE}sections/assets/logos/lastmile-desktop-white.svg`} height={18} alt="Last Mile" className="block shrink-0" style={{ height: 18 }} />
            <Acts><CapChip total={49} pct={13} /><Icon name="apps" size={18} color="#fff" /><TopbarHelp withCapacitaciones={false} /><Icon name="messages" size={18} color="#fff" /><Bell><Icon name="alerts" size={18} color="#fff" /></Bell><Icon name="user" size={18} color="#fff" /></Acts>
            <Slot>ACME CO</Slot>
          </Tbar>
        </Card>
      </div>

      <div className="mt-6">
        <H icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>}>Mobile topbar</H>
        <P>On mobile the topbar removes the company slot and most action icons. A <strong className="text-n-7">hamburger icon (☰)</strong> appears at the far left — before the product logo. Tapping it slides in the sidebar as a full-height drawer with a dark overlay behind it.</P>
        <Card className="!bg-n-2">
          <div className="mb-5">
            <L>Desktop topbar</L>
            <div className="flex h-[52px] items-center gap-3 rounded-md bg-[#132045] pl-5">
              <img src={`${BASE}sections/assets/logos/lastmile-desktop-white.svg`} height={18} alt="logo" className="block" style={{ height: 18 }} />
              <div className="ml-auto flex items-center gap-[22px]">
                {order.map((n) => n === 'help' ? <TopbarHelp key={n} /> : n === 'alerts'
                  ? <div key={n} className="relative"><Icon name={n} size={18} color="#fff" /><div className="absolute -right-0.5 -top-0.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-[#132045] bg-[#FF5630]" /></div>
                  : <Icon key={n} name={n} size={18} color="#fff" />)}
              </div>
              <div className="flex h-[52px] w-[88px] shrink-0 items-center justify-center rounded-tl-[20px] bg-white text-[11px] font-bold text-[#132045]">ACME CO</div>
            </div>
          </div>
          <div>
            <L>Mobile topbar — hamburger left · logo · minimal icons</L>
            <div className="flex h-[52px] max-w-[375px] items-center gap-2.5 rounded-md bg-[#132045] px-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center">{HAMB}</div>
              <img src={`${BASE}sections/assets/logos/lastmile-desktop-white.svg`} height={16} alt="logo" className="block shrink-0" style={{ height: 16 }} />
              <div className="ml-auto flex items-center gap-[18px]">
                <div className="relative"><Icon name="alerts" size={18} color="#fff" /><div className="absolute -right-0.5 -top-0.5 h-[7px] w-[7px] rounded-full border-[1.5px] border-[#132045] bg-[#FF5630]" /></div>
                <Icon name="user" size={18} color="#fff" />
              </div>
            </div>
          </div>
        </Card>
        <Card flush className="mt-2.5 overflow-hidden">
          <TTable head={['Element', 'Desktop', 'Mobile']}>
            {[['Hamburger', '—', 'Far left, before logo', 'text-g-6 font-semibold'], ['Product logo', 'Left, after icon strip', 'After hamburger', ''], ['Action icons', 'Apps · Alerts · Messages · Help · User', 'Alerts · User only', ''], ['Company slot', 'Right edge, 88px', 'Hidden', 'text-r-6'], ['Height', '52px', '52px (unchanged)', ''], ['Background', '#132045', '#132045 (unchanged)', '']].map(([a, b, c, cls]) => (
              <tr key={a}><Td>{a}</Td><Td>{b}</Td><Td className={cls}>{c}</Td></tr>
            ))}
          </TTable>
        </Card>
      </div>

      <h3 className="mb-2.5 mt-5 text-[15px] font-bold leading-[1.4] text-n-7">Design tokens</h3>
      <Card><TTable head={['Token', 'Value']}>{Object.entries(t).filter(([k]) => k !== 'productColors').map(([k, v]) => <tr key={k}><Td><TCode>{k}</TCode></Td><Td><TCode>{String(v)}</TCode></Td></tr>)}</TTable></Card>
    </>
  );
}
