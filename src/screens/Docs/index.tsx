import { useState, type ReactNode } from 'react';
import {
  Avatar, Badge, Button, Card, CardHeader, Donut, EmptyState, Icon, KpiCard, Pagination, ProgressRing,
  Tabs, ToastProvider, useToast, VIZ_PALETTE, VIZ_STATE, ColumnChart, BarsChart, DataTable, MutedText, ResetFiltersButton,
  type BadgeVariant,
} from '@/ds';
import { ICON_PATHS } from '@/ds/icons/paths';
import type { IconName } from '@/ds';

const SECTIONS = [
  ['tokens', 'Tokens'], ['tipografia', 'Tipografía'], ['iconos', 'Íconos'], ['acciones', 'Botones'],
  ['estado', 'Badges y KPIs'], ['navegacion', 'Tabs y paginación'], ['tablas', 'Tabla de datos'],
  ['graficos', 'Gráficos'], ['feedback', 'Toasts y vacíos'],
] as const;

const SEMANTIC: Array<[string, string, string]> = [
  ['--color-fg', 'text-fg', 'Texto principal'], ['--color-fg-muted', 'text-fg-muted', 'Texto secundario'],
  ['--color-canvas', 'bg-canvas', 'Fondo de página'], ['--color-surface', 'bg-surface', 'Tarjetas y paneles'],
  ['--color-line', 'border-line', 'Bordes'], ['--color-action', 'bg-action', 'Acción primaria'],
  ['--color-action-soft', 'bg-action-soft', 'Acción suave'], ['--color-success', 'text-success', 'Éxito'],
  ['--color-danger', 'text-danger', 'Peligro'], ['--color-warning', 'text-warning', 'Advertencia'],
  ['--color-info', 'text-info', 'Información'], ['--color-nav', 'bg-nav', 'Navegación'],
];
const PRIMITIVES = ['n', 'b', 'g', 'o', 'r', 'p', 't'].map((f) => ({
  family: f, steps: (f === 'n' ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6, 7]).map((n) => `--${f}${n}`),
}));
const SCALE: Array<[string, string, string]> = [
  ['text-2xs', '11px', 'Etiquetas, badges'], ['text-xs', '12px', 'Texto auxiliar'], ['text-base', '14px', 'Cuerpo y botones'],
  ['text-lg', '16px', 'Subtítulos'], ['text-3xl', '22px', 'Títulos de página'], ['text-4xl', '24px', 'Títulos de hero'],
];
const ICONS = Object.keys(ICON_PATHS) as IconName[];
const VARIANTS: BadgeVariant[] = ['success', 'danger', 'warning', 'info', 'neutral', 'outline'];

function Section({ id, title, intro, children }: { id: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section id={`sec-${id}`} className="scroll-mt-6 border-t border-line py-10 first:border-t-0">
      <h2 className="text-3xl font-bold text-fg">{title}</h2>
      <p className="mb-6 mt-1 max-w-[640px] text-base text-fg-muted">{intro}</p>
      {children}
    </section>
  );
}
const Demo = ({ children, label }: { children: ReactNode; label?: string }) => (
  <div className="mb-4">
    {label && <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-fg-muted">{label}</p>}
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-4">{children}</div>
  </div>
);

function ToastDemo() {
  const notify = useToast();
  return (
    <Demo label="useToast()">
      {(['success', 'error', 'warning', 'info', 'neutral'] as const).map((t) => (
        <Button key={t} onClick={() => notify(t, `Toast ${t}`, 'Mensaje de ejemplo del design system.')}>{t}</Button>
      ))}
    </Demo>
  );
}

interface Row { id: string; name: string; status: string; progress: number }
const ROWS: Row[] = [
  { id: '1', name: 'Maya Jensen', status: 'Activo', progress: 80 },
  { id: '2', name: 'Liam Smith', status: 'Activo', progress: 45 },
  { id: '3', name: 'Lucas Martínez', status: 'Inactivo', progress: 10 },
];

export default function Docs() {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(2);
  const [sel, setSel] = useState<Set<string>>(new Set());
  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-nav px-6 text-fg-inverse">
          <strong className="text-lg">LastMile DS</strong>
          <span className="text-xs opacity-70">React 18 · Tailwind · tokens semánticos</span>
          <nav className="ml-auto hidden gap-4 text-xs md:flex">
            <a className="opacity-80 hover:opacity-100" href="#/monitoreo">Monitoreo</a>
            <a className="opacity-80 hover:opacity-100" href="#/usuarios">Usuarios</a>
            <a className="opacity-80 hover:opacity-100" href="#/ayuda">Ayuda</a>
          </nav>
        </header>
        <div className="mx-auto flex max-w-[1100px] gap-10 px-6 py-8">
          <aside className="sticky top-20 hidden h-fit w-44 shrink-0 md:block">
            <ul className="flex flex-col gap-1 text-sm">
              {SECTIONS.map(([id, label]) => (
                <li key={id}><a className="block rounded px-2 py-1 text-fg-secondary hover:bg-action-soft hover:text-action-strong" href={`#sec-${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth' }); }}>{label}</a></li>
              ))}
            </ul>
          </aside>
          <main className="min-w-0 flex-1">
            <h1 className="text-4xl font-bold text-fg">Design system</h1>
            <p className="mt-2 max-w-[640px] text-base text-fg-muted">Dos capas de tokens: primitivos (valores del DS original) y semánticos (lo que consumen los componentes vía clases Tailwind). Todo lo que ves aquí es el componente real, no una captura.</p>

            <Section id="tokens" title="Tokens" intro="Los componentes usan solo tokens semánticos. Para tematizar (dark, otro producto) se redefinen en semantic.css sin tocar componentes.">
              <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-fg-muted">Semánticos</p>
              <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                {SEMANTIC.map(([v, cls, d]) => (
                  <div key={v} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2.5">
                    <span className="h-9 w-9 shrink-0 rounded border border-line" style={{ background: `var(${v})` }} />
                    <span className="min-w-0"><code className="block truncate text-xs font-semibold text-fg">{cls}</code><span className="block truncate text-2xs text-fg-muted">{d}</span></span>
                  </div>
                ))}
              </div>
              <p className="mb-2 text-2xs font-semibold uppercase tracking-wider text-fg-muted">Primitivos</p>
              <div className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4">
                {PRIMITIVES.map((fam) => (
                  <div key={fam.family} className="flex items-center gap-1">
                    <code className="w-8 text-2xs text-fg-muted">{fam.family}</code>
                    {fam.steps.map((s) => <span key={s} title={s} className="h-7 flex-1 rounded-sm border border-line" style={{ background: `var(${s})` }} />)}
                  </div>
                ))}
              </div>
            </Section>

            <Section id="tipografia" title="Tipografía" intro="Una sola familia (Plus Jakarta Sans) y una escala corta de tamaños.">
              <div className="divide-y divide-line rounded-lg border border-line bg-surface">
                {SCALE.map(([cls, px, use]) => (
                  <div key={cls} className="flex items-baseline gap-4 px-4 py-3">
                    <code className="w-24 shrink-0 text-xs text-fg-muted">{cls} · {px}</code>
                    <span className={`${cls} font-semibold text-fg`}>Entrega a tiempo</span>
                    <span className="ml-auto hidden text-xs text-fg-subtle md:block">{use}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="iconos" title="Íconos" intro={`${ICONS.length} íconos Carbon. <Icon name="…" size={16} /> hereda currentColor.`}>
              <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                {ICONS.map((n) => (
                  <div key={n} className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-surface px-1 py-3 text-fg">
                    <Icon name={n} size={20} /><code className="max-w-full truncate text-2xs text-fg-muted">{n}</code>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="acciones" title="Botones" intro="Píldora primaria rellena y secundaria outline; admiten ícono.">
              <Demo><Button variant="primary">Nueva orden</Button><Button variant="primary" icon="add">Con ícono</Button><Button>Exportar a excel</Button><Button icon="download">Con ícono</Button><ResetFiltersButton onClick={() => undefined} /></Demo>
            </Section>

            <Section id="estado" title="Badges y KPIs" intro="Estados con fondo, borde y texto desde la capa semántica.">
              <Demo label="Badge">{VARIANTS.map((v) => <Badge key={v} variant={v}>{v}</Badge>)}</Demo>
              <div className="mb-4 grid gap-3 md:grid-cols-2">
                <KpiCard icon="user" tone="info" label="Usuarios en onboarding" value={8} />
                <KpiCard icon="task-complete" tone="success" label="Completaron el programa" value={3} />
                <KpiCard icon="time" tone="warning" label="En progreso" value={4} />
                <KpiCard icon="alerts" tone="danger" label="Sin iniciar" value={2} />
              </div>
              <Demo label="Avatar · ProgressRing"><Avatar name="Maya Jensen" color={VIZ_PALETTE[0]} /><Avatar name="Liam Smith" color={VIZ_PALETTE[4]} /><ProgressRing done={3} total={8} /></Demo>
            </Section>

            <Section id="navegacion" title="Tabs y paginación" intro="La píldora de Tabs se desliza; todas las pestañas miden lo mismo.">
              <Demo><Tabs items={[{ label: 'Resumen', icon: 'dashboard' }, { label: 'Por tutorial', icon: 'document-multiple' }]} value={tab} onChange={setTab} /></Demo>
              <Demo><div className="w-full"><Pagination page={page} pages={5} onChange={setPage} /></div></Demo>
            </Section>

            <Section id="tablas" title="Tabla de datos" intro="Orden por columna, selección con acciones masivas y celdas reutilizables.">
              <Card>
                <CardHeader title="Usuarios" meta="3 filas" />
                <DataTable<Row>
                  rows={ROWS} rowKey={(r) => r.id} emptyMessage="Sin resultados"
                  selection={{ selected: sel, onChange: setSel }}
                  bulkActions={<Button>Enviar recordatorio</Button>}
                  columns={[
                    { key: 'name', header: 'Usuario', sortValue: (r) => r.name, render: (r) => <span className="flex items-center gap-2"><Avatar name={r.name} color={VIZ_PALETTE[1]} size={24} />{r.name}</span> },
                    { key: 'status', header: 'Estado', sortValue: (r) => r.status, render: (r) => <Badge variant={r.status === 'Activo' ? 'success' : 'neutral'}>{r.status}</Badge> },
                    { key: 'progress', header: 'Progreso', sortValue: (r) => r.progress, render: (r) => <MutedText>{r.progress}%</MutedText> },
                  ]}
                />
              </Card>
            </Section>

            <Section id="graficos" title="Gráficos" intro="Los gráficos usan la paleta de visualización: la única excepción documentada a «solo tokens semánticos».">
              <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr]">
                <Card><div className="flex justify-center p-4"><Donut size={110} centerValue={6} centerLabel="usuarios" segments={[{ label: 'Activos', value: 5, color: VIZ_STATE.positive }, { label: 'Inactivos', value: 1, color: VIZ_STATE.idle }]} /></div></Card>
                <Card><div className="p-5"><BarsChart labelWidth={90} items={[{ label: 'Monitoreo', value: 8 }, { label: 'Usuarios', value: 5 }, { label: 'Ayuda', value: 3 }]} /></div></Card>
                <Card><div className="p-5"><ColumnChart items={[{ label: 'L', value: 3 }, { label: 'M', value: 6 }, { label: 'X', value: 4 }]} /></div></Card>
              </div>
            </Section>

            <Section id="feedback" title="Toasts y estados vacíos" intro="Feedback inmediato sin sacar al usuario de contexto.">
              <ToastDemo />
              <Card><EmptyState tag="Nuevo usuario" title="Aún no hay tutoriales completados" description="Cuando completes tu primer tutorial, tu progreso aparecerá aquí." actions={<Button variant="primary">Ver tutoriales</Button>} /></Card>
            </Section>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
