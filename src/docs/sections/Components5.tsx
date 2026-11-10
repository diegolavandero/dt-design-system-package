import { useRef, useState, type ReactNode } from 'react';
import { Card, SectionHeader } from '../ui';
import { Switch } from './Components3';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
interface Ctrl { type: 'checkbox' | 'radio' | 'switch'; label: string; states: Array<{ label: string; on?: boolean | 'mixed'; disabled?: boolean }> }

const Chk = ({ on, disabled }: { on?: boolean | 'mixed'; disabled?: boolean }) => (
  <div className={cn('flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px]', disabled ? 'border-n-3 bg-n-2' : on ? 'border-b-6 bg-b-6' : 'border-n-4 bg-white')}>
    {on === true && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
    {on === 'mixed' && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>}
  </div>
);
const Rad = ({ on, disabled }: { on?: boolean | 'mixed'; disabled?: boolean }) => (
  <div className={cn('flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-[1.5px]', disabled ? 'border-n-3 bg-n-2' : on ? 'border-b-6 bg-white' : 'border-n-4 bg-white')}>
    {on && <span className="h-[9px] w-[9px] rounded-full bg-b-6" />}
  </div>
);

/* ── File uploader ── */
const FILE = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>;
const CLOSE = <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const FBTN = 'inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[50px] border bg-white px-3.5 text-sm font-bold leading-none';
function Pill({ name, disabled, onClose }: { name: string; disabled?: boolean; onClose?: () => void }) {
  return (
    <span className={cn('inline-flex h-7 cursor-default items-center gap-1.5 rounded-[4px] border py-0 pl-2.5 pr-2 text-sm leading-[normal]', disabled ? 'border-n-3 bg-n-2 text-n-4' : 'border-n-4 bg-white text-n-7')}>
      <span className={disabled ? 'text-n-4' : 'text-n-5'}>{FILE}</span><span>{name}</span>
      {!disabled && <span onClick={onClose} className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full bg-n-3 text-n-5">{CLOSE}</span>}
    </span>
  );
}
function FuRow({ toggle, on, file }: { toggle: boolean; on: boolean; file?: string }) {
  const dis = toggle && !on;
  return (
    <div className="flex items-center gap-2.5 border-b border-n-3 py-2.5">
      {toggle && <div className={cn('pointer-events-none relative h-[19px] w-8 shrink-0 rounded-full', on ? 'bg-b-6' : 'bg-n-4')}><span className="absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white shadow-[0_1px_2px_rgba(19,32,69,.2)]" style={{ left: on ? 15 : 2 }} /></div>}
      <span className={cn('min-w-[100px] text-sm font-medium leading-[normal]', dis ? 'text-n-4' : 'text-n-6')}>Header Image</span>
      <div className="flex items-center gap-2">
        {file ? <Pill name={file} disabled={dis} /> : <>
          <button className={cn(FBTN, dis ? 'cursor-not-allowed border-n-4 text-n-4' : 'border-b-6 text-[#4B82FA]')}>{FILE}Choose File</button>
          <span className={cn('text-xs', dis ? 'text-n-4' : 'text-n-5')}>No file chosen</span>
        </>}
      </div>
    </div>
  );
}
function LiveUploader() {
  const [on, setOn] = useState(true);
  const [file, setFile] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Card className="!mb-3">
      <div className="mb-4 text-sm font-semibold leading-none text-n-7">Live preview</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div onClick={() => setOn(!on)} className={cn('relative h-[19px] w-8 shrink-0 cursor-pointer rounded-full', on ? 'bg-b-6' : 'bg-n-4')}><span className="absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white shadow-[0_1px_2px_rgba(19,32,69,.2)] transition-[left] duration-150" style={{ left: on ? 15 : 2 }} /></div>
          <span className={cn('min-w-[100px] text-sm font-medium', on ? 'text-n-6' : 'text-n-4')}>Header Image</span>
          <div className="flex items-center gap-2">
            {file ? <Pill name={file} onClose={() => setFile(null)} /> : <>
              <button onClick={() => on && ref.current?.click()} className={cn(FBTN, on ? 'cursor-pointer border-b-6 text-[#4B82FA]' : 'cursor-not-allowed border-n-4 text-n-4')}>{FILE}Choose File</button>
              <span className={cn('text-xs', on ? 'text-n-5' : 'text-n-4')}>No file chosen</span>
            </>}
          </div>
        </div>
        <div className="mt-1 text-xs text-n-5">Please upload the image of width 200px and height 60px</div>
      </div>
      <input ref={ref} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f.name); e.target.value = ''; }} />
    </Card>
  );
}

/* ── Tabs ── */
function TabGroup({ n, size, badges }: { n: number; size: 'dense' | 'wide'; badges: boolean }) {
  const [act, setAct] = useState(0);
  const [hov, setHov] = useState(-1);
  const w = size === 'dense' ? 74 : 98, gap = size === 'dense' ? 12 : 24;
  const BN = [5, 12, 3, 8, 1, 7];
  return (
    <div className="relative inline-flex select-none rounded-2xl bg-n-2 p-1" style={{ gap }}>
      <div className="pointer-events-none absolute top-1 z-0 h-6 rounded-xl bg-white shadow-[0_1px_3px_rgba(19,32,69,.1)] transition-[left] duration-[180ms] ease-[cubic-bezier(.4,0,.2,1)]" style={{ width: w, left: 4 + act * (w + gap) }} />
      {Array.from({ length: n }).map((_, i) => (
        <button key={i} onClick={() => setAct(i)} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)}
          className="relative z-[1] inline-flex h-6 shrink-0 cursor-pointer items-center justify-center rounded-xl border-0 text-xs font-bold leading-none text-n-7"
          style={{ width: w, background: hov === i && act !== i ? 'rgba(193,205,225,.45)' : 'transparent' }}>
          Section{badges && <span className="absolute -right-[5px] -top-2 z-[3] box-border flex h-4 min-w-4 items-center justify-center rounded-lg bg-r-6 px-1 text-[9px] font-bold leading-none text-white">{BN[i] ?? 1}</span>}
        </button>
      ))}
    </div>
  );
}
function TabRows({ size }: { size: 'dense' | 'wide' }) {
  return <>{[2, 3, 4, 5, 6].map((n) => (
    <div key={n} className="flex items-center gap-3 border-b border-n-3 py-2">
      <span className="w-[54px] shrink-0 text-[11px] font-medium leading-[normal] text-n-5">{n} tabs</span>
      <div className="flex flex-wrap items-center gap-5">
        <div><div className="mb-1.5 text-[10px] leading-[normal] text-n-4">No badge</div><TabGroup n={n} size={size} badges={false} /></div>
        <div className="pt-2"><div className="mb-1.5 text-[10px] leading-[normal] text-n-4">With badge</div><TabGroup n={n} size={size} badges /></div>
      </div>
    </div>
  ))}</>;
}
function TabPill({ size, st, badge }: { size: 'dense' | 'wide'; st: string; badge: boolean }) {
  const w = size === 'dense' ? 74 : 98;
  const style = st === 'selected' ? { background: '#fff', boxShadow: '0 1px 3px rgba(19,32,69,.1)' } : st === 'hover' ? { background: '#E1E6ED' } : st === 'focused' ? { background: '#fff', border: '1.5px solid #4B82FA', boxSizing: 'border-box' as const } : {};
  return (
    <div className="relative flex h-6 items-center justify-center rounded-xl text-xs font-bold leading-none text-n-7" style={{ width: w, ...style }}>
      Section{badge && <span className="absolute -right-[5px] -top-2 z-[2] box-border flex h-4 items-center justify-center rounded-lg bg-r-6 px-1 text-[9px] font-bold leading-none text-white" style={{ minWidth: size === 'dense' ? 20 : 17 }}>3</span>}
    </div>
  );
}
const TOK: Array<[string, string, string]> = [['Container bg', '--n2', '#F0F2F5'], ['Container radius', '—', '16px (pill)'], ['Container padding', '—', '4px'], ['Dense tab width', '—', '74px'], ['Wide tab width', '—', '98px'], ['Tab height', '—', '24px'], ['Tab radius', '—', '12px'], ['Selected bg', '—', '#ffffff'], ['Hover bg', '--n3', '#E1E6ED'], ['Focused border', '--b5', '#4B82FA'], ['Badge bg', '--r6', '#DE350B'], ['Tab font', '—', '700 12px DM Sans']];
const FU_CODE = `<!-- File uploader (no toggle) -->
<div class="fu-wrap">
  <label class="fu-label">Header Image</label>
  <div class="fu-control" id="fu-1">
    <button class="fu-btn" onclick="fuOpen('fu-1')">
      <!-- file icon --> Choose File
    </button>
    <span class="fu-placeholder">No file chosen</span>
    <!-- pill injected by JS when file selected -->
  </div>
  <p class="fu-hint">Please upload an image 200×60px</p>
</div>

<!-- With toggle -->
<div class="fu-wrap">
  <div class="swt" id="fu-toggle" onclick="fuToggle(this,'fu-2')"></div>
  <label class="fu-label">Header Image</label>
  <div class="fu-control" id="fu-2" data-disabled="true">...</div>
</div>`;
const TAB_CODE = `<!-- Dense tabs, 3 options, no badge -->
<div class="dt-tabs dt-tabs--dense" data-active="0">
  <div class="dt-tab-indicator"></div>
  <button class="dt-tab dt-tab--active" onclick="dtTabSelect(this,0)">Section 1</button>
  <button class="dt-tab" onclick="dtTabSelect(this,1)">Section 2</button>
  <button class="dt-tab" onclick="dtTabSelect(this,2)">Section 3</button>
</div>

<!-- Wide tabs with badges -->
<div class="dt-tabs dt-tabs--wide" data-active="0">
  <div class="dt-tab-indicator"></div>
  <button class="dt-tab dt-tab--active" onclick="dtTabSelect(this,0)">
    Section 1<span class="dt-tab-badge">3</span>
  </button>
  <button class="dt-tab" onclick="dtTabSelect(this,1)">
    Section 2<span class="dt-tab-badge">12</span>
  </button>
</div>

<!-- CSS -->
<style>
.dt-tabs { display:inline-flex; background:var(--n2); border-radius:16px;
           padding:4px; position:relative; }
.dt-tabs--dense .dt-tab { width:74px; }
.dt-tabs--wide  .dt-tab { width:98px; }
.dt-tab { position:relative; z-index:1; height:24px; border-radius:12px;
          font:700 12px/1 var(--font-sans); color:var(--n7);
          border:none; background:transparent; cursor:pointer; }
.dt-tab:hover:not(.dt-tab--active) { background:var(--n3); }
.dt-tab:focus-visible { outline:1.5px solid var(--b5); }
.dt-tab-indicator { position:absolute; top:4px; left:4px; height:24px;
                    border-radius:12px; background:#fff;
                    box-shadow:0 1px 3px rgba(19,32,69,.1);
                    transition:transform .2s cubic-bezier(.4,0,.2,1); z-index:0; }
.dt-tab-badge { position:absolute; top:-8px; right:-5px; min-width:16px;
                height:16px; border-radius:8px; background:var(--r6);
                color:#fff; font:700 9px/1 var(--font-sans);
                display:flex; align-items:center; justify-content:center; padding:0 4px; }
</style>`;
function SnippetCard({ title, code }: { title: string; code: string }) {
  const [ok, setOk] = useState(false);
  return (
    <Card flush className="!mb-3 overflow-hidden">
      <div className="flex items-center justify-between border-b border-n-3 px-4 py-3">
        <span className="text-sm font-semibold leading-none text-n-7">{title}</span>
        <button onClick={() => { navigator.clipboard?.writeText(code).catch(() => undefined); setOk(true); setTimeout(() => setOk(false), 1200); }} className="h-6 cursor-pointer rounded-[4px] border border-n-3 bg-n-2 px-2.5 text-[11px] font-semibold text-n-6">{ok ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className="m-0 overflow-x-auto bg-n-1 p-4 text-[11px] leading-[1.7] text-n-6" style={{ fontFamily: 'inherit' }}>{code}</pre>
    </Card>
  );
}
const H3 = ({ children }: { children: ReactNode }) => <h3 className="mb-1.5 mt-8 text-xl font-bold text-n-7">{children}</h3>;
const Desc = ({ children }: { children: ReactNode }) => <p className="mb-4 text-sm leading-[1.6] text-n-5">{children}</p>;
const Th = ({ children }: { children: ReactNode }) => <th className="px-3 py-[7px] text-left text-[11px] font-semibold uppercase leading-[normal] tracking-[.04em] text-n-5">{children}</th>;

export function Selection({ data }: { data: Head & { controls?: Ctrl[] } }) {
  return (
    <>
      <SectionHeader data={data} />
      <Card>
        {data.controls?.map((c) => (
          <div key={c.label} className="mb-3 flex flex-wrap items-center gap-[18px]">
            <span className="w-[88px] text-[10px] font-medium uppercase leading-[normal] tracking-[.05em] text-n-5">{c.label}</span>
            {c.states.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-sm leading-[normal]">
                {c.type === 'checkbox' ? <Chk on={s.on} disabled={s.disabled} /> : c.type === 'radio' ? <Rad on={s.on} disabled={s.disabled} /> : <Switch defaultOn={!!s.on} />}{s.label}
              </div>
            ))}
          </div>
        ))}
      </Card>

      <H3>File uploader</H3>
      <Desc>Combines an optional toggle, label and file picker. Clicking Choose File opens the OS picker. The selected file appears as a dismissible pill — closing it returns to the empty state. When the toggle is OFF the whole control is disabled.</Desc>
      <Card className="!mb-3 !px-5 !py-0">
        <div className="grid items-center gap-2.5 pb-1 pt-3 text-[11px] font-semibold uppercase leading-[normal] tracking-[.05em] text-n-5" style={{ gridTemplateColumns: '26px 108px 1fr' }}><span>Toggle</span><span>Label</span><span>Control area</span></div>
        <FuRow toggle={false} on={false} /><FuRow toggle={false} on={false} file="Logo.svg" /><FuRow toggle on={false} /><FuRow toggle on /><FuRow toggle on file="banner.png" />
      </Card>
      <LiveUploader />
      <SnippetCard title="HTML snippet" code={FU_CODE} />

      <H3>Tabs</H3>
      <Desc>Pill-shaped segment switcher. Two sizes (Dense 74px · Wide 98px), 2–6 options, optional numeric badge per tab. Click any tab in the groups below to see the sliding pill animation.</Desc>
      {(['dense', 'wide'] as const).map((sz) => (
        <Card key={sz} className="!mb-3">
          <div className="mb-1 text-sm font-semibold leading-none text-n-7">{sz === 'dense' ? 'Dense' : 'Wide'} · all combinations</div>
          <div className="mb-4 text-[11px] leading-[normal] text-n-5">Tab pill width: {sz === 'dense' ? 74 : 98}px · Container height: 32px · Click any tab to activate</div>
          <TabRows size={sz} />
        </Card>
      ))}
      <Card flush className="!mb-3 overflow-hidden">
        <div className="border-b border-n-3 px-4 py-3 text-sm font-semibold leading-none text-n-7">Tokens</div>
        <table className="w-full border-collapse"><thead><tr className="bg-n-2"><Th>Property</Th><Th>Token</Th><Th>Value</Th></tr></thead>
          <tbody>{TOK.map(([p, t, v]) => <tr key={p} className="border-t border-n-3"><td className="px-3 py-[7px] text-xs font-medium leading-[normal] text-n-7">{p}</td><td className="px-3 py-[7px] text-[11px] leading-[normal] text-b-7">{t}</td><td className="px-3 py-[7px] text-[11px] leading-[normal] text-n-5">{v}</td></tr>)}</tbody></table>
      </Card>
      <SnippetCard title="HTML + CSS snippet" code={TAB_CODE} />
      <Card className="!mb-0 !border-b-3 !bg-b-1">
        <div className="flex items-start gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--b7)" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          <div><div className="mb-1 text-sm font-bold text-b-7">Using tabs in new screens</div>
            <div className="text-xs leading-[1.6] text-b-7">When a screen needs tabs, always call <code className="rounded-[3px] bg-b-2 px-[5px] py-px text-[11px] font-semibold">dtTabsHtml(labels, activeIndex, opts)</code> from <strong>renderers.js</strong>. Never write the container + pill HTML manually — the sliding animation and token usage are handled for you.</div></div>
        </div>
      </Card>
    </>
  );
}
