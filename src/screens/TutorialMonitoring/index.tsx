import { AppShell, Icon, Tabs, useDemoControls, type TabItem } from '@/ds';
import { useState } from 'react';
import { ResumenPanel } from './ResumenPanel';
import { TutorialPanel } from './TutorialPanel';

const TABS: TabItem[] = [
  { label: 'Resumen', icon: 'report-data' },
  { label: 'Por tutorial', icon: 'education' },
];

function NoAccess() {
  return (
    <div role="alert" className="mx-auto mt-ds-10 flex max-w-ds-readable flex-col items-center gap-ds-3 rounded-ds-lg border border-line bg-surface px-ds-7 py-ds-8 text-center">
      <Icon name="warning" size={28} color="var(--color-warning)" />
      <h1 className="text-ds-body-l font-bold text-fg">No tienes acceso a esta sección</h1>
      <p className="text-ds-body-s text-fg-muted">El monitoreo de tutoriales está disponible solo para usuarios con rol administrador.</p>
    </div>
  );
}

function Monitoring({ isAdmin }: { isAdmin: boolean }) {
  const [tab, setTab] = useState(0);
  if (!isAdmin) return <NoAccess />;

  return (
    <div className="flex flex-col gap-ds-4 px-ds-6 py-ds-5">
      <div className="flex items-start justify-between gap-ds-4">
        <div>
          <div className="flex items-center gap-ds-3">
            <h1 className="text-ds-section font-bold leading-ds-body text-fg">Monitoreo de tutoriales</h1>
            <span className="inline-flex h-ds-6 items-center gap-ds-1 rounded-ds-pill bg-action-soft px-ds-3 text-ds-caption font-bold uppercase tracking-ds-label text-action">
              <Icon name="user" size={11} />
              Solo administradores
            </span>
          </div>
          <p className="mt-ds-1 text-ds-body-s text-fg-muted">Avance de capacitación de los usuarios de tu cuenta.</p>
        </div>
        <button
          type="button"
          className="inline-flex h-ds-7 shrink-0 items-center gap-ds-2 rounded-ds-pill border border-action bg-surface px-ds-4 text-ds-body-s font-bold text-action-text transition-colors hover:bg-action-soft"
        >
          <Icon name="download" size={14} />
          Exportar a Excel
        </button>
      </div>

      <section className="overflow-hidden rounded-ds-lg border border-line bg-surface">
        <div className="border-b border-line px-ds-4 py-ds-3">
          <Tabs items={TABS} value={tab} onChange={setTab} />
        </div>
        {/* key reinicia filtros y orden al cambiar de pestaña, igual que el original */}
        <div className="flex flex-col gap-ds-4 p-ds-4">{tab === 0 ? <ResumenPanel key="r" /> : <TutorialPanel key="t" />}</div>
      </section>
    </div>
  );
}

export default function TutorialMonitoring() {
  const [isAdmin, setIsAdmin] = useState(true);
  /** Variante de demo: la dispara la página que aloja el prototipo, no el diseño. */
  useDemoControls(({ control, value }) => { if (control === 'role') setIsAdmin(value !== 'user'); });
  return (
    <>
      <AppShell selected="Monitoreo de tutoriales" showMonitoring={isAdmin}>
        <Monitoring isAdmin={isAdmin} />
      </AppShell>
    </>
  );
}
