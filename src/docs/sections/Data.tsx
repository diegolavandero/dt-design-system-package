import type { ReactNode } from 'react';
import { Card, SectionHeader, UsageCard, CopySwatch, isLight } from '../ui';
import { Btn } from './Components2';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
const asset = (p: string) => (/^(https?:|data:)/.test(p) ? p : `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`);

/* ───────────── Charts DS (donut / barras / columnas) ───────────── */
const VIZ = ['#6E8DDE', '#FFCC65', '#57C2D6', '#7EEABC', '#FF8F76', '#A59ADD', '#5EBE95', '#DED95D', '#8DBCE7', '#BF7B83', '#DFA2F4'];
interface Item { label: string; value: number; color?: string }

export function DonutChart({ segments, centerValue, centerLabel = 'Total', size = 150, thickness = 18, legendLabelWidth = 84 }: { segments: Item[]; centerValue?: number | string; centerLabel?: string; size?: number; thickness?: number; legendLabelWidth?: number }) {
  const segs = segments.map((s, i) => ({ ...s, value: Math.max(0, +s.value || 0), color: s.color ?? VIZ[i % VIZ.length] }));
  const live = segs.filter((s) => s.value > 0);
  const r = (size - thickness) / 2, c = size / 2, C = 2 * Math.PI * r;
  const total = segs.reduce((a, s) => a + s.value, 0);
  const single = live.length <= 1, gap = single ? 0 : 3;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center justify-start gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0 overflow-visible">
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--n2)" strokeWidth={thickness} />
        {live.map((s) => {
          const seg = (s.value / total) * C, len = Math.max(0.001, seg - gap);
          const el = <circle key={s.label} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap={single ? 'butt' : 'round'} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${c} ${c})`} />;
          offset += seg;
          return el;
        })}
        <text x={c} y={c - 1} textAnchor="middle" style={{ font: '700 26px/1 var(--font-doc)', fill: 'var(--n7)' }}>{centerValue ?? total}</text>
        <text x={c} y={c + 15} textAnchor="middle" style={{ font: '500 10px/1 var(--font-doc)', fill: 'var(--n5)', letterSpacing: '.05em', textTransform: 'uppercase' }}>{centerLabel}</text>
      </svg>
      <div className="flex flex-col gap-2">
        {segs.map((s) => (
          <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
            <span className="text-sm leading-[1.3] text-n-6" style={{ minWidth: legendLabelWidth }}>{s.label}</span>
            <span className="min-w-[18px] text-right text-sm font-bold leading-none text-n-7">{s.value}</span>
            <span className="min-w-[34px] text-right text-xs leading-none text-n-5">{total ? Math.round((s.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export function BarsChart({ items, labelWidth = 150, suffix = '' }: { items: Item[]; labelWidth?: number; suffix?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((it, i) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-right text-xs font-medium leading-[1.3] text-n-6" style={{ width: labelWidth }}>{it.label}</span>
          <div className="h-3.5 min-w-0 flex-1 overflow-hidden rounded-full bg-n-2">
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.round((it.value / max) * 100))}%`, background: it.color ?? VIZ[i % VIZ.length] }} />
          </div>
          <span className="min-w-[30px] shrink-0 text-right text-sm font-bold leading-none text-n-7">{it.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}
export function ColumnChart({ items, height = 188, suffix = '' }: { items: Item[]; height?: number; suffix?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex items-end gap-[18px]" style={{ height }}>
      {items.map((it, i) => (
        <div key={it.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
          <span className="text-sm font-bold leading-none text-n-7">{it.value}{suffix}</span>
          <div className="w-full max-w-14 rounded-t-md" style={{ height: Math.max(3, Math.round((it.value / max) * (height - 34))), background: it.color ?? VIZ[i % VIZ.length] }} />
          <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[11px] font-medium leading-[1.2] text-n-5">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

const Panel = ({ title, sub, children }: { title: string; sub: string; children: ReactNode }) => (
  <Card>
    <div className="mb-1 text-lg font-bold leading-[1.2] text-n-7" style={{ fontSize: 16 }}>{title}</div>
    <div className="mb-[18px] text-sm leading-normal text-n-5">{sub}</div>
    {children}
  </Card>
);
export function Charts({ data }: { data: Head }) {
  const usage = `dsDonutChart({\n  centerValue: 7, centerLabel: 'Usuarios',\n  segments: [\n    { label: 'Completado',  value: 1, color: '#5EBE95' },\n    { label: 'En progreso', value: 3, color: '#6E8DDE' },\n    { label: 'Sin iniciar', value: 3, color: '#C5D2E7' }\n  ]\n})\n\ndsBarsChart({ items: [ { label: 'Tutorial', value: 6 }, ... ] })\ndsColumnChart({ suffix: '%', items: [ { label: 'Nivel 100', value: 68 }, ... ] })`;
  return (
    <>
      <SectionHeader data={data} />
      <Panel title="Donut / dona" sub="Distribución por categoría, con total al centro y leyenda con valor + porcentaje. Pista en --n2, segmentos con cap redondeado. dsDonutChart().">
        <DonutChart centerValue={7} centerLabel="Usuarios" segments={[{ label: 'Completado', value: 1, color: '#5EBE95' }, { label: 'En progreso', value: 3, color: '#6E8DDE' }, { label: 'Sin iniciar', value: 3, color: '#C5D2E7' }]} />
      </Panel>
      <Panel title="Barras horizontales" sub="Ranking o comparación entre muchos ítems. Pista en --n2, barra pill con color de la paleta data-viz. dsBarsChart().">
        <BarsChart labelWidth={180} items={[{ label: 'Intro: Qué es DT y LM', value: 6 }, { label: 'Usuarios web', value: 5 }, { label: 'Notificaciones', value: 4 }, { label: 'Vehículos', value: 3 }, { label: 'Importador básico', value: 2 }]} />
      </Panel>
      <Panel title="Columnas verticales" sub="Comparación entre pocas categorías. Esquina superior redondeada (--radius-md). dsColumnChart().">
        <ColumnChart suffix="%" items={[{ label: 'Nivel 100', value: 68 }, { label: 'Nivel 200', value: 32 }, { label: 'Nivel 300', value: 15 }]} />
      </Panel>
      <Card className="!bg-n-1">
        <div className="mb-1.5 text-sm font-bold leading-[1.4] text-n-7">Reglas</div>
        <div className="text-sm leading-[1.6] text-n-6">Tipografía DM Sans en todo texto · colores de serie estrictamente desde la <b>paleta data-viz</b> (1 → 11, sin saltar) · radios y elevación del sistema (<code className="font-mono">--radius-*</code>, <code className="font-mono">--shadow-*</code>) · números tabulares para valores · nunca inventar colores fuera de la paleta.</div>
      </Card>
      <UsageCard snippet={usage} />
    </>
  );
}

/* ───────────── Paletas (dataviz / service units) ───────────── */
function PaletteStrip({ colors, note }: { colors: Array<{ hex: string; label?: string }>; note?: string }) {
  const lab = colors.some((c) => c.label);
  return (
    <div>
      <div className="flex">{colors.map((_, i) => <div key={i} className="mb-1 flex-1 text-center text-[11px] text-n-5">{i + 1}</div>)}</div>
      <div className="flex overflow-hidden rounded-lg border border-n-3">
        {colors.map((c) => (
          <CopySwatch key={c.hex} value={c.hex} className="flex min-h-[100px] flex-1 flex-col justify-end border-r border-black/[.07] px-2.5 pb-3 pt-3.5" style={{ background: c.hex, color: isLight(c.hex) ? '#39414D' : '#fff' }}>
            {lab && <div className="text-sm leading-[1.3]" style={{ fontSize: 13 }}>{c.label}</div>}
            <div className={cn('text-[11px]', lab && 'leading-[1.5]')}>Hex: {c.hex}</div>
          </CopySwatch>
        ))}
      </div>
      {note && <div className="mt-2.5 text-[11px] text-n-5">{note}</div>}
    </div>
  );
}
export function DataViz({ data }: { data: Head & { palette?: string[] } }) {
  const p = data.palette ?? [];
  return (<><SectionHeader data={data} /><PaletteStrip colors={p.map((hex) => ({ hex }))} note={`Assign in strict order 1 → ${p.length}. Do not skip or reuse out of sequence.`} /></>);
}
export function ServiceUnits({ data }: { data: Head & { palette?: Array<{ hex: string; label: string }> } }) {
  return (<><SectionHeader data={data} /><PaletteStrip colors={data.palette ?? []} /></>);
}

/* ───────────── Logos ───────────── */
interface LogoV { label: string; path: string; dark: boolean }
function LogoCard({ v, alt }: { v: LogoV; alt: string }) {
  return (
    <div className={cn('flex min-h-[88px] flex-col gap-2 rounded-lg border px-[18px] pb-3 pt-5', v.dark ? 'border-indigo bg-indigo' : 'border-n-3 bg-white')}>
      <div className="flex flex-1 items-center"><img src={asset(v.path)} alt={alt} className="block h-5 w-auto max-w-full" /></div>
      <div className="flex items-center justify-between">
        <div className={cn('text-[9px] font-medium uppercase tracking-[.06em]', v.dark ? 'text-white/50' : 'text-n-5')}>{v.label}</div>
        <a href={asset(v.path)} download className={cn('border-0 bg-transparent p-0 text-[10px] font-semibold hover:no-underline', v.dark ? '!text-b-4' : '!text-b-7')}>↓ Download</a>
      </div>
    </div>
  );
}
export function Logos({ data }: { data: Head & { dtWordmark?: string; products?: Array<{ name: string; color: string; logos?: Record<string, string> }> } }) {
  return (
    <>
      <SectionHeader data={data} />
      {data.dtWordmark && (
        <div className="mb-6">
          <div className="mb-2 text-sm font-bold text-n-7">DispatchTrack Wordmark</div>
          <div className="grid grid-cols-3 gap-2.5"><LogoCard v={{ label: 'White', path: data.dtWordmark, dark: true }} alt="DispatchTrack wordmark" /></div>
        </div>
      )}
      {data.products?.map((p) => {
        const l = p.logos ?? {};
        const vs: LogoV[] = [];
        if (l.desktopColor) vs.push({ label: 'Desktop · Color', path: l.desktopColor, dark: false });
        if (l.desktopWhite) vs.push({ label: 'Desktop · White', path: l.desktopWhite, dark: true });
        if (l.mobileColor) vs.push({ label: 'Mobile · Color', path: l.mobileColor, dark: false });
        if (l.mobileWhite) vs.push({ label: 'Mobile · White', path: l.mobileWhite, dark: true });
        return (
          <div key={p.name} className="mb-6">
            <div className="mb-2 flex items-center gap-2"><div className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} /><span className="text-sm font-bold text-n-7">{p.name}</span></div>
            <div className="grid grid-cols-3 gap-2.5">{vs.map((v) => <LogoCard key={v.label} v={v} alt={`${p.name} ${v.label}`} />)}</div>
          </div>
        );
      })}
      <Card className="!mb-3.5 !mt-1 !px-4 !py-3">
        <p className="m-0 text-xs text-n-5">SVG only. Nunca escalar por debajo de 18px de alto. Usar variante <strong>white</strong> sobre fondos oscuros (#132045) y variante <strong>color</strong> sobre fondos claros.</p>
      </Card>
    </>
  );
}

/* ───────────── Figma ───────────── */
export function Figma({ data }: { data: Head & { files?: Array<{ name: string; nodeId: string; updated: string; fileKey: string }> } }) {
  return (
    <>
      <SectionHeader data={data} />
      {data.files?.map((f) => (
        <Card key={f.fileKey + f.nodeId} className="flex items-center gap-4">
          <svg width="36" height="54" viewBox="0 0 38 57"><path fill="#F24E1E" d="M5 28.5A9.5 9.5 0 0 1 14.5 19H24V38H14.5A9.5 9.5 0 0 1 5 28.5z" /><path fill="#FF7262" d="M24 1H33.5A9.5 9.5 0 1 1 33.5 20H24z" /><circle fill="#1ABCFE" cx="33.5" cy="28.5" r="9.5" /><path fill="#0ACF83" d="M5 47.5A9.5 9.5 0 0 1 14.5 38H24v9.5A9.5 9.5 0 1 1 5 47.5z" /><path fill="#A259FF" d="M5 28.5a9.5 9.5 0 0 1 9.5-9.5H24V38H14.5A9.5 9.5 0 0 1 5 28.5z" /></svg>
          <div className="flex-1">
            <div className="text-base font-bold text-n-7">{f.name}</div>
            <div className="mt-[3px] text-xs text-n-5">Node {f.nodeId} · Updated {f.updated}</div>
            <div className="mt-[3px] font-mono text-[11px] text-n-5">figma.com/design/{f.fileKey}</div>
          </div>
          <a href={`https://figma.com/design/${encodeURIComponent(f.fileKey)}?node-id=${encodeURIComponent(f.nodeId)}`} target="_blank" rel="noreferrer" className="hover:no-underline"><Btn kind="pri">Open in Figma</Btn></a>
        </Card>
      ))}
    </>
  );
}

/* ───────────── Changelog ───────────── */
const TYPE = { fix: ['#C45000', 'Fix'], feat: ['#1A7F3C', 'New'], update: ['#0052CC', 'Update'] } as const;
interface Entry { type: keyof typeof TYPE; section: string; message: string; author?: string; hash: string }
export function Changelog({ data }: { data: { description?: string; days?: Array<{ date: string; entries: Entry[] }> } }) {
  const desc = data?.description || 'Auto-generated from git history. Updated on every push to main.';
  return (
    <>
      <h1 className="mb-1.5 text-[28px] font-bold leading-[1.2] text-n-7">Changelog</h1>
      <p className="mb-7 max-w-[660px] text-base leading-[1.6] text-n-5">{desc}</p>
      <Card className="!px-7 !py-6">
        {!data?.days?.length ? <span className="text-n-5">No entries yet.</span> : data.days.map((day) => (
          <div key={day.date} className="mb-7">
            <div className="mb-1 border-b-2 border-[#E9ECF2] pb-2.5 text-xs font-semibold uppercase leading-none tracking-[.06em] text-n-5">
              {new Date(day.date + 'T12:00:00Z').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {day.entries.map((e, i) => {
              const [color, label] = TYPE[e.type] ?? TYPE.update;
              return (
                <div key={i} className="flex items-center gap-2.5 border-b border-n-2 py-[7px]">
                  <span className="shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold leading-none text-white" style={{ background: color }}>{label}</span>
                  <span className="min-w-20 shrink-0 text-[11px] font-medium leading-none text-[#7B8796]">{e.section}</span>
                  <span className="flex-1 text-sm leading-[1.4] text-n-7">{e.message}</span>
                  {e.author && <span title={e.author} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-n-3 text-[9px] font-bold leading-none text-n-5">{e.author[0].toUpperCase()}</span>}
                  <span className="min-w-[42px] shrink-0 text-right text-[11px] font-medium leading-none text-[#A0ABBB]">{e.author ?? ''}</span>
                  <code className="shrink-0 text-[11px] leading-none text-n-4" style={{ fontFamily: 'monospace' }}>{e.hash}</code>
                </div>
              );
            })}
          </div>
        ))}
      </Card>
    </>
  );
}
