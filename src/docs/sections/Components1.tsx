import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../icons';
import { Banner, Card, CodeBlock, CopyCode, SectionHeader, TabCard, TCode, Td, TTable, UsageCard } from '../ui';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };

/* ───────────── BRAND ───────────── */
export function Brand({ data }: { data: Head & { products?: Array<{ name: string; hex: string; description: string }>; honeypotBrand?: Record<string, string> } }) {
  const hp = data.honeypotBrand ?? {};
  return (
    <>
      <SectionHeader data={data} />
      <Card className="grid grid-cols-4 gap-2.5">
        {data.products?.map((p) => (
          <div key={p.name} className="flex h-[100px] flex-col justify-end rounded-lg p-3 text-white" style={{ background: p.hex }}>
            <b className="text-[13px]">{p.name}</b>
            <span className="font-mono text-[10px] opacity-85">{p.hex}</span>
            <span className="mt-0.5 text-[11px] opacity-80">{p.description}</span>
          </div>
        ))}
      </Card>
      <Card className="!mt-0">
        <h3 className="mb-2.5 text-[13px] font-bold text-n-7">Honeypot brand</h3>
        <div className="flex gap-2.5">
          {(['primary', 'secondary', 'tertiary'] as const).filter((k) => hp[k]).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded border border-black/[.08]" style={{ background: hp[k] }} />
              <code className="font-mono text-[11px] font-medium">{hp[k]} · $hp-{k}</code>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ───────────── VOICE ───────────── */
export function Voice({ data }: { data: Head & { guidelines?: Array<{ text: string }>; examples?: Array<{ type: string; text: string }> } }) {
  return (
    <>
      <SectionHeader data={data} />
      <Card className="!mb-3">
        <ul className="m-0 list-disc pl-4 text-[13px] leading-[2] text-n-7">
          {data.guidelines?.map((g, i) => <li key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: g.text }} />)}
        </ul>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        {data.examples?.map((e, i) => {
          const good = e.type === 'do';
          return (
            <div key={i} className={cn('rounded-lg border border-n-3 border-l-[3px] bg-white p-3.5', good ? 'border-l-g-6' : 'border-l-r-6')}>
              <div className={cn('mb-1.5 text-[10px] font-bold uppercase tracking-[.08em]', good ? 'text-g-6' : 'text-r-6')}>{good ? '✓ Do' : '✗ Don\'t'}</div>
              <div className="text-[13px] italic leading-normal text-n-7" dangerouslySetInnerHTML={{ __html: e.text }} />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ───────────── BUTTONS ───────────── */
interface BtnState { label: string; text: string; bg: string; color: string; border?: string; underline?: boolean }
interface ButtonsData extends Head {
  pageUsage?: string; code?: string;
  tokens?: Record<string, string | number>; mobileTokens?: Record<string, string | number>;
  variants?: Array<{ label: string; states: BtnState[] }>;
}
function States({ states, height, padding, fontSize, fontWeight, lineHeight }: { states: BtnState[]; height: string; padding: string; fontSize: string; fontWeight: string | number; lineHeight: string }) {
  return (
    <>
      {states.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-[5px]">
          <button
            type="button"
            className="inline-flex min-w-16 cursor-pointer items-center justify-center rounded-[50px]"
            style={{ background: s.bg, color: s.color, border: s.border && s.border !== 'none' ? s.border : 'none', textDecoration: s.underline ? 'underline' : undefined, font: `${fontWeight} ${fontSize}/${lineHeight} var(--font-sans)`, height, padding }}
          >{s.text}</button>
          <span className="text-[9px] uppercase tracking-[.05em] text-n-45">{s.label}</span>
        </div>
      ))}
    </>
  );
}
const th = 'border-b border-n-4 bg-n-2 px-3.5 py-[9px] text-left text-[11px] font-bold text-n-7';
export function Buttons({ data }: { data: ButtonsData }) {
  const t = data.tokens ?? {}, mt = data.mobileTokens ?? {};
  const s = (v: unknown, d: string) => (v == null ? d : String(v));
  const preview = (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className={cn(th, 'w-[110px]')}>Variant</th>
          <th className={cn(th, 'border-l border-n-3')}>
            <span className="flex items-center gap-[5px]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              Desktop <span className="ml-1 font-normal text-n-5">32px · body-small-bold · 0 32px</span>
            </span>
          </th>
          <th className={cn(th, 'border-l border-n-3')}>
            <span className="flex items-center gap-[5px]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              Mobile <span className="ml-1 font-normal text-n-5">48px · 14px · 0 24px</span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.variants?.map((v) => (
          <tr key={v.label} className="border-b border-n-3">
            <td className="w-[110px] p-3.5 align-middle"><div className="text-[11px] font-bold text-n-7">{v.label}</div></td>
            <td className="border-l border-n-3 bg-[#FAFBFD] p-3.5 align-middle">
              <div className="flex flex-wrap items-end gap-2.5"><States states={v.states} height={s(t.height, '32px')} padding={s(t.padding, '0 32px')} fontSize={s(t.fontSize, '14px')} fontWeight={s(t.fontWeight, '700')} lineHeight={s(t.lineHeight, '20px')} /></div>
            </td>
            <td className="border-l border-n-3 bg-[#F5F6FA] p-3.5 align-middle">
              <div className="flex flex-wrap items-end gap-2.5"><States states={v.states} height={s(mt.height, '48px')} padding={s(mt.padding, '0 24px')} fontSize={s(mt.fontSize, '14px')} fontWeight={s(mt.fontWeight ?? t.fontWeight, '700')} lineHeight={s(mt.lineHeight ?? t.lineHeight, '20px')} /></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  const tokens = (
    <div className="p-4">
      {mt.note && <Banner className="!mb-3.5">{String(mt.note)}</Banner>}
      <TTable head={['Token', 'Desktop', 'Mobile']}>
        {Object.entries(t).map(([k, v]) => (
          <tr key={k}><Td><TCode>{k}</TCode></Td><Td><TCode>{String(v)}</TCode></Td><Td><TCode>{String(mt[k] ?? '—')}</TCode></Td></tr>
        ))}
      </TTable>
    </div>
  );
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      <TabCard tabs={[
        { label: 'Preview', content: preview },
        { label: 'Code', content: <CopyCode text={data.code ?? ''} flat>{data.code}</CopyCode> },
        { label: 'Tokens', content: tokens },
      ]} />
    </>
  );
}

/* ───────────── BADGES ───────────── */
const BADGE: Record<string, string> = {
  success: 'bg-g-1 text-g-6', danger: 'bg-r-1 text-r-6', warning: 'bg-[#FFF0B3] text-[#7D4E00]', info: 'bg-b-1 text-b-7', neutral: 'bg-n-2 text-n-7',
  outline: 'border border-n-4 bg-white px-2 py-px text-n-7',
};
export function Badges({ data }: { data: Head & { pageUsage?: string; badges?: Array<{ type: string; label: string; dot?: boolean }>; chips?: Array<{ initials: string; label: string; avatarBg: string; avatarColor: string; chipBg?: string; chipColor?: string }> } }) {
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      <Card>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {data.badges?.map((b, i) => (
            <span key={i} className={cn('inline-flex items-center gap-[5px] rounded-full px-[9px] py-0.5 text-[11px] font-semibold', BADGE[b.type] ?? BADGE.neutral)}>
              {b.dot && <span className="h-[5px] w-[5px] rounded-full bg-current" />}{b.label}
            </span>
          ))}
          {data.chips?.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-[5px] rounded-full bg-n-2 py-[3px] pl-[3px] pr-[9px] text-[11px] font-medium text-n-7" style={c.chipBg ? { background: c.chipBg, color: c.chipColor } : undefined}>
              <span className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: c.avatarBg, color: c.avatarColor }}>{c.initials}</span>{c.label}
            </span>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ───────────── CHIPS ───────────── */
const VARIANTS = ['text', 'no-outline', 'outline', 'icon-outline', 'icon-outline-x', 'icon-solid-x', 'solid'] as const;
const VARIANT_LABELS = ['Text', 'No outline', 'Outline', 'Icon', 'Icon + ×', 'Solid + ×', 'Solid'];
const CC: Record<string, { light: string; bd: string; fg: string; solid: string; solidFg: string }> = {
  info: { light: 'var(--b1)', bd: 'var(--b3)', fg: 'var(--b6)', solid: 'var(--b5)', solidFg: '#fff' },
  success: { light: 'var(--g1)', bd: 'var(--g3)', fg: 'var(--g7)', solid: 'var(--g5)', solidFg: '#fff' },
  warning: { light: 'var(--o1)', bd: 'var(--o3)', fg: 'var(--o7)', solid: 'var(--o5)', solidFg: '#fff' },
  error: { light: 'var(--r1)', bd: 'var(--r3)', fg: 'var(--r6)', solid: 'var(--r5)', solidFg: '#fff' },
  neutral: { light: 'var(--n2)', bd: 'var(--n4)', fg: 'var(--n6)', solid: 'var(--n5)', solidFg: '#fff' },
};
const PILL = 'inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-semibold leading-none';
const XBtn = () => <Icon name="close" size={10} style={{ opacity: 0.7, flexShrink: 0 }} />;
function Pill({ label, icon, color, variant }: { label: string; icon?: string; color: string; variant: string }) {
  const c = CC[color] ?? CC.neutral;
  const ic = icon ? <Icon name={icon} size={12} color={variant.includes('solid') ? c.solidFg : c.fg} /> : null;
  const base: CSSProperties = { background: c.light, color: c.fg };
  const outline: CSSProperties = { ...base, border: `1px solid ${c.bd}` };
  const solid: CSSProperties = { background: c.solid, color: c.solidFg };
  const map: Record<string, [CSSProperties, ReactNode]> = {
    text: [{ background: 'transparent', color: c.fg }, label],
    'no-outline': [base, label],
    outline: [outline, label],
    'icon-outline': [outline, <>{ic}{label}</>],
    'icon-outline-x': [outline, <>{ic}{label}<XBtn /></>],
    'icon-solid-x': [solid, <>{ic}{label}<XBtn /></>],
    solid: [solid, label],
  };
  const [style, content] = map[variant] ?? [base, label];
  return <span className={PILL} style={style}>{content}</span>;
}
const lbl = 'text-[11px] font-semibold uppercase leading-none tracking-[.05em] text-n-5';
export function Chips({ data }: { data: Head & { tokens?: Record<string, string>; statuses?: Array<{ label: string; icon?: string; color: string }>; groups?: Array<{ title: string; pills: Array<{ label: string; icon?: string; color: string; dismissible?: boolean }> }> } }) {
  const snippet = `<span class="pill-info">Scheduled</span>
<span class="pill-success">Delivered</span>
<span class="pill-warning">Pending</span>
<span class="pill-error">Failed</span>
<span class="pill-neutral">Draft</span>

<!-- With icon -->
<span class="pill-success pill-icon">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
  Delivered
</span>

<!-- Dismissible -->
<span class="pill-info pill-x">
  Zone: North
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
</span>`;
  const h = 'px-3 py-2 text-left text-[11px] font-semibold uppercase leading-none tracking-[.04em] text-n-5';
  return (
    <>
      <SectionHeader data={data} />
      <Card flush className="!mb-6">
        <div className="border-b border-n-3 px-4 py-3.5 leading-[21px]"><span className="text-[13px] font-semibold leading-none text-n-7">Tokens</span></div>
        <table className="w-full border-collapse">
          <thead><tr className="bg-n-2"><th className={h}>Property</th><th className={h}>Token</th><th className={h}>Value</th></tr></thead>
          <tbody>
            {Object.entries(data.tokens ?? {}).map(([k, v]) => (
              <tr key={k}>
                <td className="px-3 py-2 text-xs font-semibold leading-none text-n-7">{k}</td>
                <td className="px-3 py-2 text-xs leading-none text-n-5">--chip-{k}</td>
                <td className="px-3 py-2 text-xs leading-none text-b-6">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card className="!mb-6">
        <div className="mb-4 text-[13px] font-semibold leading-none text-n-7">Status × variant grid</div>
        <div className="grid items-center gap-1.5" style={{ gridTemplateColumns: `repeat(${VARIANTS.length}, minmax(0,1fr))` }}>
          {VARIANT_LABELS.map((l) => <div key={l} className={cn(lbl, 'py-1.5')}>{l}</div>)}
          {data.statuses?.map((s) => VARIANTS.map((v) => <div key={s.label + v} className="flex items-center"><Pill label={s.label} icon={s.icon} color={s.color} variant={v} /></div>))}
        </div>
      </Card>
      <Card className="!mb-6">
        <div className="mb-4 text-[13px] font-semibold leading-none text-n-7">Groups</div>
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {data.groups?.map((g) => (
            <div key={g.title} className="min-w-[200px] flex-1">
              <div className={cn(lbl, 'mb-2.5')}>{g.title}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.pills.map((p) => {
                  const c = CC[p.color] ?? CC.neutral;
                  return <span key={p.label} className={PILL} style={{ background: c.light, color: c.fg, border: `1px solid ${c.bd}` }}>{p.icon && <Icon name={p.icon} size={12} color={c.fg} />}{p.label}{p.dismissible && <XBtn />}</span>;
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="!mb-6">
        <div className="mb-3 text-[13px] font-semibold leading-none text-n-7">Usage</div>
        <CodeBlock code={snippet} />
      </Card>
    </>
  );
}
