import { useEffect, useState } from 'react';
import { Card, CardHeader, CopyCode, Cm, Kw, Str, Tg, SectionHeader } from '../ui';
import { useAuth } from '../auth';
import changelog from '../content/sections/changelog.json';

interface Overview {
  title: string; titleKey?: string; description?: string;
  dashboard?: { stats: Array<{ label: string; value: string; trend: string }>; a11yWarnings: Array<{ component: string; id: string; severity: string; issue: string }> };
  install?: { tokens: string };
  products?: Array<{ name: string; hex: string; description: string }>;
  repoStructure?: Array<{ icon: string; name: string; desc: string }>;
}
interface Entry { hash: string; type: string; section: string; message: string; author: string; date: string }

const AUTHOR_COLORS: Record<string, string> = { Diego: '#4B82FA', Cristina: '#47D09A', Carlos: '#F27B42' };
const DEFAULT_COLORS = ['#8777D9', '#00B8D9', '#FF5630', '#FFAB00'];
const TYPE_COLOR: Record<string, string> = { fix: '#C45000', feat: '#1A7F3C', update: '#0052CC' };
const TYPE_LABEL: Record<string, string> = { fix: 'Fix', feat: 'New', update: 'Update' };

function authorColor(name: string) {
  if (AUTHOR_COLORS[name]) return AUTHOR_COLORS[name];
  let hash = 0;
  for (const c of name || '?') hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return DEFAULT_COLORS[hash % DEFAULT_COLORS.length];
}

const WarnIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--o7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--b6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
);

function latestEntries(): Entry[] {
  const flat: Entry[] = [];
  for (const day of (changelog as { days: Array<{ date: string; entries: Omit<Entry, 'date'>[] }> }).days) {
    for (const e of day.entries) { flat.push({ ...e, date: day.date }); if (flat.length === 6) return flat; }
  }
  return flat;
}

const pill = 'inline-flex items-center gap-[5px] rounded-full px-[9px] py-0.5 text-[11px] font-semibold';

export default function Overview({ data, onNavigate }: { data: Overview; onNavigate: (id: string) => void }) {
  const { online } = useAuth();
  const d = data.dashboard;
  const warn = d?.a11yWarnings.filter((w) => w.severity === 'warning').length ?? 0;
  const info = d?.a11yWarnings.filter((w) => w.severity === 'info').length ?? 0;
  const [today, setToday] = useState('');
  useEffect(() => setToday(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })), []);
  const entries = latestEntries();

  return (
    <>
      <SectionHeader data={data} />
      <div className="mb-7">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="m-0 flex items-center gap-2 text-lg font-bold text-n-7">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--b6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            Dashboard
          </h2>
          <span className="text-[11px] text-n-5">{today}</span>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-3 min-[941px]:grid-cols-3">
          {d?.stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-n-3 bg-white px-5 py-[18px]">
              <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[.07em] text-n-5">{s.label}</div>
              <div className="text-[32px] font-bold leading-none text-n-7">{s.label === 'Users on DS' && online != null ? online : s.value}</div>
              <div className="mt-[5px] text-[11px] text-n-5">{s.trend}</div>
            </div>
          ))}
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3 min-[941px]:grid-cols-[1fr_300px]">
          <div className="overflow-hidden rounded-lg border border-n-3 bg-white">
            <div className="flex items-center justify-between border-b border-n-3 bg-[var(--doc-card-header)] px-4 py-[11px]">
              <span className="flex items-center gap-[7px] text-xs font-bold text-n-7">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                Latest updates
              </span>
            </div>
            {entries.length === 0 && <div className="px-4 py-[18px] text-xs text-n-5">No updates yet.</div>}
            {entries.map((e) => (
              <div key={e.hash + e.message} className="flex items-start gap-2.5 border-b border-n-3 px-4 py-2.5 last:border-b-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: authorColor(e.author) }}>{(e.author || '?')[0].toUpperCase()}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-n-7">
                    {e.author}
                    <span className="ml-[5px] inline-block rounded-[3px] px-1.5 py-[2px] align-middle text-[9px] font-semibold leading-none text-white" style={{ background: TYPE_COLOR[e.type] ?? TYPE_COLOR.update }}>{TYPE_LABEL[e.type] ?? 'Update'}</span>
                    <span className="ml-1 text-[11px] font-normal text-n-5">{e.section}</span>
                  </div>
                  <div className="mt-px overflow-hidden text-ellipsis whitespace-nowrap text-xs text-n-6">{e.message}</div>
                  <div className="mt-[3px] text-[10px] text-n-45">
                    {new Date(e.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · <code className="text-[10px] text-n-5">{e.hash}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-lg border border-n-3 bg-white">
            <div className="flex items-center justify-between border-b border-n-3 bg-[var(--doc-card-header)] px-4 py-[11px]">
              <span className="flex items-center gap-[7px] text-xs font-bold text-n-7"><WarnIcon />Accessibility</span>
              <div className="flex gap-[5px]">
                {warn > 0 && <span className={`${pill} bg-[var(--doc-warn-bg)] text-[var(--doc-warn-fg)]`}>{warn} warning{warn > 1 ? 's' : ''}</span>}
                {info > 0 && <span className={`${pill} bg-b-1 text-b-7`}>{info} info</span>}
              </div>
            </div>
            {d?.a11yWarnings.map((w) => (
              <a key={w.id} href={`#${w.id}`} onClick={(e) => { e.preventDefault(); onNavigate(w.id); }} className="flex cursor-pointer items-start gap-2.5 border-b border-n-3 px-4 py-2.5 last:border-b-0 hover:bg-n-1 hover:no-underline">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${w.severity === 'warning' ? 'bg-o-1' : 'bg-b-1'}`}>{w.severity === 'warning' ? <WarnIcon /> : <InfoIcon />}</div>
                <div>
                  <div className="text-[11px] font-bold text-n-7">{w.component}</div>
                  <div className="mt-0.5 text-[11px] leading-[1.4] text-n-6">{w.issue}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <h3 className="mb-3.5 text-base font-bold">What's inside this repo</h3>
        <div className="grid grid-cols-2 gap-2.5 min-[941px]:grid-cols-4">
          {data.products?.map((p) => (
            <div key={p.name} className="rounded-lg border border-n-3 bg-white p-3.5" style={{ borderTop: `3px solid ${p.hex}` }}>
              <div className="text-[13px] font-bold">{p.name}</div>
              <div className="my-[3px] text-[10px] font-medium text-n-5">{p.hex}</div>
              <div className="text-[11px] text-n-5">{p.description}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card flush>
        <CardHeader title="colors_and_type.css" meta="v2.4 · 8.2 KB" />
        <CopyCode text={`@import '~@beetrack/hp-tokens-style';\n${data.install?.tokens ?? ''}`}>
          <Cm>{'/* Instalar: npm install @beetrack/hp-tokens-style */'}</Cm>{'\n'}
          <Kw>@import</Kw> <Str>{"'~@beetrack/hp-tokens-style'"}</Str>;{'\n\n'}
          <Cm>{'/* O carga las fuentes directamente */'}</Cm>{'\n'}
          <Kw>@import</Kw> <Str>{"url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&display=swap')"}</Str>;{'\n\n'}
          <Cm>{'/* Tokens clave de colors.scss */'}</Cm>{'\n'}
          {(data.install?.tokens ?? '').split('\n').map((l, i, a) => (
            <span key={i}><Tg>{l.split(':')[0]}</Tg>:{l.split(':').slice(1).join(':')}{i < a.length - 1 ? '\n' : ''}</span>
          ))}
        </CopyCode>
      </Card>

      <h3 className="mb-2.5 mt-5 text-[15px] font-bold leading-[1.4] text-n-7">Repository structure</h3>
      <Card className="!bg-n-1">
        <div className="text-xs leading-[2] text-n-7">
          {data.repoStructure?.map((r) => <div key={r.name}>{r.icon} <strong>{r.name}</strong> — {r.desc}</div>)}
        </div>
      </Card>
    </>
  );
}

