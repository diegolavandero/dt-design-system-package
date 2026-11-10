import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { cn } from '@/ds/lib/cn';
import { NAV, type NavItem } from './nav';
import { I18nProvider, useI18n } from './i18n';
import { Card, SectionHeader } from './ui';
import Overview from './sections/Overview';
import { Colors, Iconography, Radii, Shadows, Spacing, Typography } from './sections/Foundations';
import { Alerts, EmptyState, ImageUploader } from './sections/Components2';
import { Brand, Voice, Buttons, Badges, Chips } from './sections/Components1';
import './docs.css';

/* Registro renderer → componente. Las secciones sin componente muestran el aviso de «pendiente de portar». */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RENDERERS: Record<string, ComponentType<any>> = {
  overview: Overview, colors: Colors, typography: Typography, spacing: Spacing, radii: Radii, shadows: Shadows, iconography: Iconography,
  alerts: Alerts, imageUploader: ImageUploader, emptyState: EmptyState, brand: Brand, voice: Voice, buttons: Buttons, badges: Badges, chips: Chips,
};

const loaders = import.meta.glob('./content/sections/**/*.json', { import: 'default' }) as Record<string, () => Promise<unknown>>;
const LOGO = `${import.meta.env.BASE_URL}sections/assets/logos/dt-wordmark-white.svg`;

const allItems = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g, tab: g.tab })));
const findItem = (id: string) => allItems.find((i) => i.id === id);
const currentId = () => location.hash.replace(/^#\/?/, '') || 'overview';

/* ───────────── Topbar ───────────── */
function Search({ onPick }: { onPick: (id: string) => void }) {
  const { t } = useI18n();
  const [q, setQ] = useState('');
  const [data, setData] = useState<Record<string, string[]>>({});
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Palabras clave de cada sección (campo `keywords` del JSON) para el buscador.
    Promise.all(allItems.map(async (i) => {
      const load = loaders[`./content/${i.path}`];
      const d = load ? ((await load()) as { keywords?: string[] }) : {};
      return [i.id, d.keywords ?? []] as const;
    })).then((rows) => setData(Object.fromEntries(rows)));
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!term) return [];
    return allItems.filter((i) => i.label.toLowerCase().includes(term) || t(i.i18n, i.label).toLowerCase().includes(term) || (data[i.id] ?? []).some((k) => k.toLowerCase().includes(term)));
  }, [term, data, t]);
  const hl = (text: string) => {
    const idx = text.toLowerCase().indexOf(term);
    if (idx < 0) return text;
    return <>{text.slice(0, idx)}<mark className="rounded-[2px] bg-b-2 px-px not-italic text-b-7">{text.slice(idx, idx + term.length)}</mark>{text.slice(idx + term.length)}</>;
  };

  return (
    <div className="relative flex w-[300px] items-center gap-2 rounded-md border border-white/[.12] bg-white/[.08] px-2.5 py-1.5 text-white max-[940px]:hidden">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
      <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => setTimeout(() => setQ(''), 150)} autoComplete="off"
        placeholder={t('search.placeholder', 'Buscar tokens, componentes…')} className="flex-1 border-0 bg-transparent text-xs text-white outline-none placeholder:text-white/40" />
      {!term && <kbd className="rounded-[3px] border border-white/15 bg-white/10 px-[5px] py-px text-[10px] font-semibold text-white/60">⌘K</kbd>}
      {term && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] max-h-[380px] min-w-[340px] overflow-y-auto rounded-lg border border-n-3 bg-white shadow-[0_8px_32px_rgba(19,32,69,.18)]">
          {results.length === 0 && <div className="px-3 py-4 text-center text-[13px] text-n-5">Sin resultados</div>}
          {results.map((i) => (
            <div key={i.id} onMouseDown={() => { onPick(i.id); setQ(''); }} className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-b-1">
              <NavIcon item={i} className="h-4 w-4 shrink-0 text-n-5" />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-n-7">{hl(t(i.i18n, i.label))}</span>
              <span className="shrink-0 text-[11px] text-n-5">{t(i.group.i18n, i.group.group)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Topbar({ onPick }: { onPick: (id: string) => void }) {
  const { lang, setLang } = useI18n();
  return (
    <header className="sticky top-0 z-[100] flex h-[52px] items-center gap-4 bg-indigo px-[22px]">
      <div className="flex shrink-0 items-center"><img src={LOGO} height={18} alt="DispatchTrack" style={{ height: 18 }} /></div>
      <nav className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden text-[13px] text-white/80">
        <span className="text-white/70">dispatchtrack</span><span className="opacity-40">/</span>
        <span className="font-bold text-white">design-system</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/80">main · v2.4</span>
      </nav>
      <Search onPick={onPick} />
      <div role="group" aria-label="Language" className="inline-flex h-7 shrink-0 overflow-hidden rounded-md border border-white/[.18]">
        {(['es', 'en'] as const).map((l) => (
          <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}
            className={cn('cursor-pointer border-0 px-2.5 text-[11px] font-semibold tracking-[.04em]', lang === l ? 'bg-white/[.18] text-white' : 'bg-transparent text-white/70 hover:bg-white/[.08] hover:text-white')}>{l.toUpperCase()}</button>
        ))}
      </div>
    </header>
  );
}

/* ───────────── Sidebar ───────────── */
const FIGMA_LOGO = '<path fill="#F24E1E" d="M5 28.5A9.5 9.5 0 0 1 14.5 19H24V38H14.5A9.5 9.5 0 0 1 5 28.5z" transform="scale(.5)"/><path fill="#FF7262" d="M24 1H33.5A9.5 9.5 0 1 1 33.5 20H24z" transform="scale(.5)"/><circle fill="#1ABCFE" cx="18" cy="9.5" r="4.5" transform="scale(.5) translate(10,0)"/><path fill="#0ACF83" d="M5 47.5A9.5 9.5 0 0 1 14.5 38H24v9.5A9.5 9.5 0 1 1 5 47.5z" transform="scale(.5)"/><path fill="#A259FF" d="M5 28.5a9.5 9.5 0 0 1 9.5-9.5H24V38H14.5A9.5 9.5 0 0 1 5 28.5z" transform="scale(.5) translate(0,-10)"/>';

function NavIcon({ item, className }: { item: NavItem; className?: string }) {
  if (item.id === 'figma') return <svg className={className} width="14" height="14" viewBox="0 0 38 57" fill="none" dangerouslySetInnerHTML={{ __html: FIGMA_LOGO }} />;
  if (!item.icon) return null;
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={item.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/* Las etiquetas de estado son texto estático en el original (no pasan por i18n). */
const STATUS: Record<string, { key: string; label: string; cls: string }> = {
  complete: { key: 'status.live', label: 'En producción', cls: 'bg-g-1 text-g-7' },
  production: { key: 'status.live', label: 'En producción', cls: 'bg-g-1 text-g-7' },
  ready: { key: 'status.ready', label: 'Listo para dev', cls: 'bg-b-1 text-b-7' },
  'in-progress': { key: 'status.wip', label: 'En progreso', cls: 'bg-o-1 text-[#7A4A00]' },
};

function Sidebar({ activeId, tab, onTab, onNavigate }: { activeId: string; tab: 'desktop' | 'mobile'; onTab: (t: 'desktop' | 'mobile') => void; onNavigate: (id: string) => void }) {
  const { t } = useI18n();
  return (
    <aside className="sidebar-scroll sticky top-[52px] max-h-[calc(100vh-52px)] w-64 shrink-0 self-start overflow-y-auto border-r border-n-3 bg-white py-3.5 max-[940px]:static max-[940px]:max-h-none max-[940px]:w-full max-[940px]:border-b max-[940px]:border-r-0">
      <div role="tablist" className="sticky top-0 z-[6] flex gap-1 border-b border-n-3 bg-white px-3 pb-2 pt-2.5">
        {(['desktop', 'mobile'] as const).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => onTab(k)}
            className={cn('h-7 flex-1 cursor-pointer rounded-md border text-xs font-semibold transition-colors', tab === k ? 'border-b-6 bg-b-1 text-b-7' : 'border-n-3 bg-white text-n-5 hover:bg-n-1')}>
            {t(`tabs.${k}`, k === 'desktop' ? 'Escritorio' : 'App móvil')}
          </button>
        ))}
      </div>
      {NAV.filter((g) => g.tab === tab).map((g, gi) => (
        <div key={g.group}>
          <div className={cn('px-5 pb-[5px] pt-2.5 text-[10px] font-bold uppercase tracking-[.08em] text-n-5', gi > 0 && 'mt-2')}>{t(g.i18n, g.group)}</div>
          {g.items.map((item) => {
            const st = item.status ? STATUS[item.status] : undefined;
            const active = item.id === activeId;
            return (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
                className={cn('flex items-center gap-2 border-l-[3px] px-5 py-1.5 text-[13px] font-medium text-n-7 hover:bg-n-1 hover:no-underline', active ? 'border-b-5 bg-b-1 font-bold hover:bg-b-1' : 'border-transparent')}>
                <NavIcon item={item} className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-b-6' : 'text-n-5')} />
                <span className="min-w-0 truncate">{t(item.i18n, item.label)}</span>
                {st && (
                  <span className={cn('ml-auto inline-flex h-4 shrink-0 items-center gap-[3px] rounded-full px-[5px] text-[9px] font-bold leading-none tracking-[.02em]', st.cls)}>
                    <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="3" /></svg>{st.label}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      ))}
    </aside>
  );
}

/* ───────────── Contenido ───────────── */
function SectionView({ id, onNavigate }: { id: string; onNavigate: (id: string) => void }) {
  const item = findItem(id) ?? findItem('overview')!;
  const [data, setData] = useState<{ id: string; value: unknown } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setError('');
    const load = loaders[`./content/${item.path}`];
    if (!load) { setError('Sección no encontrada'); return; }
    load().then((v) => alive && setData({ id: item.id, value: v })).catch((e) => alive && setError(String(e)));
    window.scrollTo({ top: 0 });
    return () => { alive = false; };
  }, [item.id, item.path]);

  if (error) return <Card><p className="text-r-6">Error loading section: {error}</p></Card>;
  if (!data || data.id !== item.id) return <div className="p-[60px] text-center text-sm text-n-5">Cargando…</div>;
  const Comp = RENDERERS[item.renderer];
  if (!Comp) {
    const d = data.value as { title: string; titleKey?: string; description?: string };
    return (
      <>
        <SectionHeader data={d} />
        <Card className="!bg-n-1"><p className="text-[13px] text-n-5">Esta sección todavía se está portando a React + Tailwind (contenido original: <code>{item.path}</code>).</p></Card>
      </>
    );
  }
  return <Comp data={data.value} onNavigate={onNavigate} />;
}

function Shell() {
  const [id, setId] = useState(currentId);
  const [tab, setTab] = useState<'desktop' | 'mobile'>(() => {
    try { return localStorage.getItem('dt-ds-tab') === 'mobile' ? 'mobile' : 'desktop'; } catch { return 'desktop'; }
  });

  const navigate = useCallback((next: string) => {
    const item = findItem(next) ?? findItem('overview')!;
    history.replaceState(null, '', `#${item.id}`);
    setId(item.id);
    setTab(item.tab);
    try { localStorage.setItem('dt-ds-tab', item.tab); } catch { /* sin storage */ }
  }, []);

  useEffect(() => {
    const onHash = () => { const n = currentId(); const item = findItem(n); if (item) { setId(item.id); setTab(item.tab); } };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const changeTab = (t: 'desktop' | 'mobile') => {
    if (t === tab) return;
    navigate(t === 'mobile' ? 'mobile-overview' : 'overview');
  };

  return (
    <div className="docs-root">
      <Topbar onPick={navigate} />
      <div className="flex min-h-[calc(100vh-52px)] max-[940px]:flex-col">
        <Sidebar activeId={id} tab={tab} onTab={changeTab} onNavigate={navigate} />
        <main className="min-w-0 flex-1 px-10 pb-20 pt-8 max-[940px]:px-[18px] max-[940px]:pb-[60px] max-[940px]:pt-5">
          <SectionView id={id} onNavigate={navigate} />
        </main>
      </div>
    </div>
  );
}

export default function DocsApp() {
  return <I18nProvider><Shell /></I18nProvider>;
}
