import { Card, CardHeader, CopySwatch, SectionHeader, isLight } from '../ui';

type Head = { title: string; titleKey?: string; description?: string };

/* ───────────── COLORS ───────────── */
interface Sw { hex: string; label: string; hsb?: string; hcl?: number; use?: string }
interface Scale { id: string; label: string; group?: string; special?: Sw[]; swatches: Sw[] }
interface ColorsData extends Head {
  scales?: Scale[];
  opacity?: { label?: string; dark: Array<{ css: string; label: string; desc: string }>; light: Array<{ css: string; label: string; desc: string }> };
  semanticTokens?: Array<{ hex: string; name: string; sub?: string; use: string }>;
}

const scaleTitle = 'mb-0.5 text-[22px] font-bold leading-[1.2] text-n-7';

function Swatch({ s }: { s: Sw }) {
  const tc = isLight(s.hex) ? '#39414D' : '#fff';
  return (
    <CopySwatch value={s.hex} className="flex min-h-[108px] flex-1 flex-col justify-end gap-px border-r border-black/[.07] px-2.5 pb-3 pt-3.5 transition-[filter] last:border-r-0 hover:brightness-90" style={{ background: s.hex, color: tc }}>
      <div className="text-[13px] leading-[1.3]">{s.label}</div>
      <div className="text-[11px] leading-normal">Hex: {s.hex}</div>
      {s.hsb && <div className="text-[10px] leading-[1.4] opacity-75">HSB: {s.hsb}</div>}
      {s.hcl != null && <div className="text-[10px] leading-[1.4] opacity-75">HCL: {s.hcl}</div>}
      {s.use && <div className="text-[10px] leading-[1.4] opacity-75">Use: {s.use}</div>}
    </CopySwatch>
  );
}

export function Colors({ data }: { data: ColorsData }) {
  const neutral = data.scales?.find((s) => s.id === 'neutral');
  const others = data.scales?.filter((s) => s.id !== 'neutral') ?? [];
  const op = data.opacity;
  return (
    <>
      <SectionHeader data={data} />
      {neutral && (
        <div className="mb-10">
          <p className={scaleTitle}>{neutral.label}</p>
          {neutral.group && <span className="mb-3.5 block text-xs text-n-5">{neutral.group}</span>}
          <div className="flex overflow-hidden rounded-t-lg border border-b-0 border-n-3">
            {neutral.special?.map((s, i) => {
              const tc = isLight(s.hex) ? '#39414D' : '#fff';
              return (
                <CopySwatch key={s.hex} value={s.hex}
                  className={i === 0 ? 'flex min-h-[128px] flex-[1.2] flex-col justify-end gap-px border-r border-black/[.07] bg-white px-2.5 pb-3 pt-3.5 text-[#39414D]' : 'flex min-h-[128px] flex-[2] flex-col justify-end gap-px border-r border-white/[.12] px-2.5 pb-3 pt-3.5 last:border-r-0'}
                  style={i > 0 ? { background: s.hex, color: tc } : undefined}>
                  <div className="text-[13px] leading-[1.3]">{s.label}</div>
                  <div className="text-[11px] leading-normal">Hex: {s.hex}</div>
                  {s.hcl != null && <div className="text-[10px] leading-[1.4] opacity-75">HCL: {s.hcl}</div>}
                </CopySwatch>
              );
            })}
          </div>
          <div className="flex overflow-hidden rounded-b-lg border border-t-0 border-n-3">{neutral.swatches.map((s) => <Swatch key={s.hex + s.label} s={s} />)}</div>
        </div>
      )}
      {others.map((scale) => (
        <div key={scale.id} className="mb-10">
          <p className={scaleTitle}>{scale.label}</p>
          <div className="flex overflow-hidden rounded-lg border border-n-3">{scale.swatches.map((s) => <Swatch key={s.hex + s.label} s={s} />)}</div>
        </div>
      ))}
      {op && (
        <div className="mb-10">
          <p className={scaleTitle}>{op.label ?? 'Opacity scale'}</p>
          <div className="mb-[3px] flex items-stretch overflow-hidden rounded-lg border border-n-3 bg-white">
            <div className="flex w-[136px] shrink-0 items-center p-3.5 text-[13px] text-n-7">Dark Opacity</div>
            <div className="flex flex-1 overflow-hidden">
              {op.dark.map((o) => (
                <CopySwatch key={o.label} value={o.label} className="flex min-h-[88px] flex-1 flex-col justify-end gap-0.5 border-l border-black/[.07] px-2.5 pb-3 pt-3.5 text-n-7" style={{ background: o.css }}>
                  <div className="text-[11px] leading-[1.3]">{o.label}</div><div className="text-[10px] leading-[1.3] opacity-70">{o.desc}</div>
                </CopySwatch>
              ))}
            </div>
          </div>
          <div className="mb-[3px] flex items-stretch overflow-hidden rounded-lg bg-indigo">
            <div className="flex w-[136px] shrink-0 items-center p-3.5 text-[13px] text-white">Light Opacity</div>
            <div className="flex flex-1 overflow-hidden">
              {op.light.map((o) => (
                <CopySwatch key={o.label} value={o.label} className="flex min-h-[88px] flex-1 flex-col justify-end gap-0.5 border-l border-white/[.12] px-2.5 pb-3 pt-3.5 text-white" style={{ background: o.css }}>
                  <div className="text-[11px] leading-[1.3]">{o.label}</div><div className="text-[10px] leading-[1.3] opacity-70">{o.desc}</div>
                </CopySwatch>
              ))}
            </div>
          </div>
        </div>
      )}
      {data.semanticTokens?.length ? (
        <div className="mb-10">
          <p className={`${scaleTitle} !text-xl`}>Design tokens</p>
          <span className="mb-3.5 block text-xs text-n-5">Semantic <Code>$dt-*</Code> variables</span>
          <Table head={['Swatch', 'Token', 'Hex', 'Use']} widths={['56px']}>
            {data.semanticTokens.map((t) => (
              <tr key={t.name}>
                <Td><CopySwatch value={t.hex} className="h-9 w-9 rounded border border-[rgba(19,32,69,.1)]" style={{ background: t.hex }} /></Td>
                <Td><Code>{t.name}</Code></Td>
                <Td><Code>{t.hex}</Code>{t.sub && <span className="text-[10px] text-n-5"> · {t.sub}</span>}</Td>
                <Td className="text-n-5">{t.use}</Td>
              </tr>
            ))}
          </Table>
        </div>
      ) : null}
    </>
  );
}

/* Tabla de tokens del original (.ttbl) */
export const Code = ({ children }: { children: React.ReactNode }) => <code className="rounded-[3px] bg-n-2 px-[5px] py-px text-[11px] font-medium">{children}</code>;
const Td = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => <td className={`border-b border-n-3 px-2.5 py-2 align-middle group-last:border-0 ${className}`}>{children}</td>;
function Table({ head, widths, children }: { head: string[]; widths?: string[]; children: React.ReactNode }) {
  return (
    <table className="w-full border-collapse text-xs [&_tbody_tr:last-child_td]:border-0">
      <thead><tr>{head.map((h, i) => <th key={h} style={widths?.[i] ? { width: widths[i] } : undefined} className="border-b border-n-4 bg-n-2 px-2.5 py-2 text-left text-[11px] font-bold text-n-7">{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/* ───────────── TYPOGRAPHY ───────────── */
interface TypoData extends Head {
  rule?: string;
  fonts?: Array<{ family: string; token?: string; specimen: string; sample?: string; note: string }>;
  scale?: Array<{ name: string; token?: string; sample: string; size: number; lineHeight: number; weight: number; italic?: boolean }>;
}
const weightLabel = (w: number) => (w >= 700 ? 'Bold' : w >= 600 ? 'Semi-bold' : w >= 500 ? 'Medium' : 'Regular');

export function Typography({ data }: { data: TypoData }) {
  return (
    <>
      <SectionHeader data={data} />
      <Card className="!mb-3">
        <div>
          {data.fonts?.map((f) => (
            <div key={f.family}>
              <div className="mb-[7px] text-[10px] font-medium uppercase tracking-[.1em] text-n-5">{f.family} {f.token && <>— <code>{f.token}</code></>}</div>
              <div className="text-[32px] font-bold leading-[1.1] tracking-[-.02em] text-n-7">{f.specimen}</div>
              {f.sample && <div className="mt-[7px] text-base leading-5 text-n-7">{f.sample}</div>}
              <div className="mt-[7px] text-xs text-n-5">{f.note}</div>
            </div>
          ))}
        </div>
      </Card>
      {data.rule && (
        <div className="mb-3.5 flex items-start gap-[9px] rounded border-l-[3px] border-b-6 bg-b-1 px-3 py-[9px] text-xs leading-[1.4]">
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--b6)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span className="text-[13px] leading-[normal] text-n-7"><strong>Rule:</strong> {data.rule}</span>
        </div>
      )}
      <Card flush>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-n-4 bg-n-2">
              <th className="w-40 px-4 py-2.5 text-left text-xs font-bold text-n-7">Style · Token</th>
              <th className="border-l border-n-3 px-4 py-2.5 text-left text-xs font-bold text-n-7">Preview · Specs</th>
            </tr>
          </thead>
          <tbody>
            {data.scale?.map((s) => (
              <tr key={s.name} className="border-b border-n-3">
                <td className="w-40 whitespace-nowrap px-4 py-3.5 align-middle text-base leading-[21px]">
                  <div className="text-xs font-bold leading-[normal] text-n-7">{s.name}</div>
                  <div className="mt-[3px]">{s.token && <code className="text-[10px] leading-[normal] text-n-45">{s.token}</code>}</div>
                </td>
                <td className="border-l border-n-3 px-4 py-3.5 align-middle text-base leading-[21px]">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap text-n-7" style={{ font: `${s.weight} ${s.size}px/${s.lineHeight}px 'DM Sans',sans-serif`, fontStyle: s.italic ? 'italic' : 'normal' }}>{s.sample}</div>
                  <div className="mt-1"><span className="text-[11px] leading-[normal] text-n-5">{s.size}/{s.lineHeight}px · {weightLabel(s.weight)}{s.italic ? ' Italic' : ''}</span></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

/* ───────────── SPACING ───────────── */
export function Spacing({ data }: { data: Head & { scale: Array<{ token: string; px: number; use: string }> } }) {
  return (
    <>
      <SectionHeader data={data} />
      <Card>
        {data.scale.map((s) => (
          <div key={s.token} className="flex items-center gap-3 border-b border-dashed border-n-3 py-[5px] last:border-0">
            <div className="w-40 text-[11px] font-semibold text-n-7">{s.token}</div>
            <div className="w-[52px] text-[11px] text-n-5">{s.px}px</div>
            <div className="h-2.5 rounded-[2px] bg-b-6" style={{ width: s.px }} />
            <div className="ml-auto text-[11px] text-n-5">{s.use}</div>
          </div>
        ))}
      </Card>
    </>
  );
}

/* ───────────── RADII ───────────── */
export function Radii({ data }: { data: Head & { scale: Array<{ px: number; label: string; use: string; special?: string }> } }) {
  return (
    <>
      <SectionHeader data={data} />
      <Card>
        <div className="grid grid-cols-3 gap-3 min-[941px]:grid-cols-6">
          {data.scale.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              {s.special === 'pill' ? <div className="h-8 w-20 rounded-full bg-b-6" />
                : s.special === 'topbar' ? <div className="relative h-16 w-20 overflow-hidden border border-n-4 bg-white before:absolute before:inset-x-0 before:top-0 before:h-[22px] before:bg-indigo before:content-['']" style={{ borderRadius: `${s.px}px 0 0 0` }} />
                : <div className="h-16 w-20 border border-b-3 bg-b-1" style={{ borderRadius: s.px }} />}
              <div className="text-[11px] font-semibold text-n-7">{s.label}</div>
              <div className="text-[10px] text-n-5">{s.use}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ───────────── SHADOWS ───────────── */
export function Shadows({ data }: { data: Head & { levels: Array<{ name: string; css: string; description: string }>; focusRing?: { css?: string; description?: string } } }) {
  const f = data.focusRing ?? {};
  return (
    <>
      <SectionHeader data={data} />
      <Card>
        <div className="grid grid-cols-2 gap-4 min-[941px]:grid-cols-5">
          {data.levels.map((l) => (
            <div key={l.name} className="flex flex-col items-center gap-2">
              <div className="h-[72px] w-full rounded-lg border border-n-4 bg-white" style={{ boxShadow: l.css }} />
              <div className="text-[11px] font-semibold text-n-7">{l.name}</div>
              <div className="text-[10px] text-n-5">{l.css.replace('rgba(0,0,0,0.15)', '').trim()}</div>
              <div className="mt-0.5 text-[10px] text-n-5">{l.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 text-center">
          <div className="mx-auto h-[72px] max-w-[220px] rounded-lg border border-b-5 bg-white" style={{ boxShadow: f.css || '0 0 0 3px rgba(75,130,250,.25)' }} />
          <div className="mt-[7px] text-[11px] font-semibold text-n-7">focus-ring</div>
          <div className="mt-[3px] text-[10px] text-n-5">{f.css ?? ''} — {f.description ?? ''}</div>
        </div>
      </Card>
    </>
  );
}

/* ───────────── ICONOGRAPHY ───────────── */
interface IconData extends Head {
  library?: { name?: string; vendor?: string; package?: string; version?: string; viewBox?: string; style?: string; cdnBase?: string };
  topbarOrder?: string[];
  categories?: Array<{ label: string; icons: Array<[string, string, string?]> }>;
}
export function Iconography({ data }: { data: IconData }) {
  const lib = data.library;
  return (
    <>
      <SectionHeader data={data} />
      {lib?.name && (
        <Card className="flex items-center gap-3 !px-4 !py-3">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="var(--b5)"><path d="M8,4V8H4V4Zm2-2H2v8h8Zm8,2V8H14V4Zm2-2H12v8h8Zm8,2V8H24V4Zm2-2H22v8h8ZM8,14v4H4V14Zm2-2H2v8h8Zm8,2v4H14V14Zm2-2H12v8h8Zm8,2v4H24V14Zm2-2H22v8h8ZM8,24v4H4V24Zm2-2H2v8h8Zm8,2v4H14V24Zm2-2H12v8h8Zm8,2v4H24V24Zm2-2H22v8h8Z" /></svg>
          <div>
            <div className="text-[13px] font-semibold text-n-7">{lib.name} <span className="font-normal text-n-5">by {lib.vendor}</span></div>
            <div className="mt-0.5 text-[11px] text-n-5">{lib.package}@{lib.version} · {lib.viewBox} · {lib.style}-based · <a href={lib.cdnBase} target="_blank" rel="noreferrer" className="text-b-7">{lib.cdnBase}</a></div>
          </div>
        </Card>
      )}
      {data.categories?.map((cat) => (
        <Card key={cat.label} className="!mb-2.5">
          <CardHeader title={cat.label} />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-1.5 px-3.5 pb-2.5 pt-3.5">
            {cat.icons.map(([name, inner, tag]) => (
              <div key={name} className="flex flex-col items-center gap-1 rounded-md border border-n-3 bg-white px-1 py-2">
                <svg className="h-5 w-5 fill-n-7" viewBox="0 0 32 32" dangerouslySetInnerHTML={{ __html: inner }} />
                <span className="break-all text-center text-[9px] text-n-5">{name.toLowerCase()}</span>
                {tag && <span className="whitespace-nowrap rounded-[2px] bg-b-1 px-1 py-px text-center text-[8px] font-semibold leading-normal text-b-7">{tag}</span>}
              </div>
            ))}
          </div>
        </Card>
      ))}
      {data.topbarOrder?.length ? (
        <Card flush className="!mt-2.5">
          <CardHeader title="Topbar icon order (invariable)" />
          <div className="flex items-center gap-5 p-3.5">{data.topbarOrder.map((n, i) => <span key={n} className="text-xs font-medium text-n-5">{i + 1} · {n}</span>)}</div>
        </Card>
      ) : null}
    </>
  );
}
