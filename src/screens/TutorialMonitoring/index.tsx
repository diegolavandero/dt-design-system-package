import { AppShell, Icon, Tabs, type TabItem } from '@/ds';
import { useState } from 'react';
import { ResumenPanel } from './ResumenPanel';
import { TutorialPanel } from './TutorialPanel';

const TABS: TabItem[] = [
  { label: 'Resumen', icon: 'report-data' },
  { label: 'Por tutorial', icon: 'education' },
];

function NoAccess() {
  return (
    <div role="alert" className="mx-auto mt-24 flex max-w-md flex-col items-center gap-3 rounded-lg border border-line bg-surface px-8 py-10 text-center">
      <Icon name="warning" size={28} color="var(--color-warning)" />
      <h1 className="text-lg font-bold text-fg">No tienes acceso a esta sección</h1>
      <p className="text-sm text-fg-muted">El monitoreo de tutoriales está disponible solo para usuarios con rol administrador.</p>
    </div>
  );
}

function Monitoring({ isAdmin }: { isAdmin: boolean }) {
  const [tab, setTab] = useState(0);
  if (!isAdmin) return <NoAccess />;

  return (
    <div className="flex flex-col gap-4 px-6 py-[18px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold leading-tight text-fg">Monitoreo de tutoriales</h1>
            <span className="inline-flex h-[22px] items-center gap-1 rounded-full bg-action-soft px-2.5 text-3xs font-bold uppercase tracking-wider text-action">
              <Icon name="user" size={11} />
              Solo administradores
            </span>
          </div>
          <p className="mt-0.5 text-base text-fg-muted">Avance de capacitación de los usuarios de tu cuenta.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-action bg-surface px-4 text-base font-bold text-action-text transition-colors hover:bg-action-soft"
        >
          <Icon name="download" size={14} />
          Exportar a Excel
        </button>
      </div>

      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <Tabs items={TABS} value={tab} onChange={setTab} />
        </div>
        {/* key reinicia filtros y orden al cambiar de pestaña, igual que el original */}
        <div className="flex flex-col gap-4 p-4">{tab === 0 ? <ResumenPanel key="r" /> : <TutorialPanel key="t" />}</div>
      </section>
    </div>
  );
}

/** Interruptor de demo: alterna entre vista administrador y usuario sin acceso. */
function DemoToggle({ isAdmin, onChange }: { isAdmin: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="fixed bottom-3 left-16 z-30 flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs shadow-float">
      <span className="text-fg-muted">Ver como:</span>
      {([true, false] as const).map((v) => (
        <button key={String(v)} type="button" onClick={() => onChange(v)} aria-pressed={isAdmin === v} className={isAdmin === v ? 'font-bold text-action' : 'text-fg-secondary hover:text-fg'}>
          {v ? 'Administrador' : 'Usuario'}
        </button>
      ))}
    </div>
  );
}

export default function TutorialMonitoring() {
  const [isAdmin, setIsAdmin] = useState(true);
  return (
    <>
      <AppShell selected="Monitoreo de tutoriales" showMonitoring={isAdmin}>
        <Monitoring isAdmin={isAdmin} />
      </AppShell>
      <DemoToggle isAdmin={isAdmin} onChange={setIsAdmin} />
    </>
  );
}
