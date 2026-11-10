import { useState } from 'react';
import { AppShell, Button, Icon, Modal, Quiz, ToastProvider, VideoPlayer, useToast } from '@/ds';
import { HelpDrawer } from './HelpDrawer';
import { OrdersPage } from './OrdersPage';
import { NEW_FEATURE } from './data';
import { useHelpCenter } from './useHelpCenter';

/** Chip «N tutoriales · P%» de la barra superior: abre el catálogo. */
function CapChip({ total, pct, onClick }: { total: number; pct: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title="Capacitaciones" className="inline-flex h-ds-7 shrink-0 items-center gap-ds-2 rounded-ds-pill border border-nav-line bg-nav-hover px-ds-3 text-ds-caption font-bold leading-none text-fg-inverse transition-colors hover:bg-surface/20">
      <Icon name="education" size={16} color="var(--color-fg-inverse)" />
      <span>{total} tutoriales · {pct}%</span>
    </button>
  );
}

/** Interruptor solo de prototipo: alterna estados y dispara eventos de demostración. */
function DemoToggle({ empty, setEmpty, onAnnounce, onAddTutorial }: { empty: boolean; setEmpty: (v: boolean) => void; onAnnounce: () => void; onAddTutorial: () => void }) {
  const tab = (on: boolean) => `rounded-ds-pill px-ds-3 py-ds-1 text-ds-caption font-semibold ${on ? 'bg-action text-fg-inverse' : 'text-fg-secondary hover:bg-canvas'}`;
  return (
    <div className="fixed bottom-ds-4 left-ds-4 z-ds-fab flex items-center gap-ds-2 rounded-ds-pill border border-dashed border-line-strong bg-surface py-ds-1 pl-ds-3 pr-ds-2 text-ds-caption font-semibold text-fg-muted shadow-ds-sm">
      <span>Demo:</span>
      <button type="button" className={tab(!empty)} onClick={() => setEmpty(false)}>Con datos</button>
      <button type="button" className={tab(empty)} onClick={() => setEmpty(true)}>Nuevo usuario (vacío)</button>
      <span className="mx-ds-1 h-ds-4 w-px bg-line" />
      <button type="button" className={tab(false)} onClick={onAnnounce}>Anuncio función nueva</button>
      <button type="button" className={tab(false)} onClick={onAddTutorial}>+ Tutorial nuevo</button>
    </div>
  );
}

function Screen() {
  const hc = useHelpCenter();
  const notify = useToast();
  const [empty, setEmpty] = useState(false);

  return (
    <>
        <AppShell
          selected="Órdenes"
          showMonitoring
          drawerOpen={hc.open}
          topbar={{
            extra: <CapChip total={hc.progress.total} pct={hc.progress.pct} onClick={hc.openCatalog} />,
            helpMenu: [
              { label: 'Help Center', icon: 'help', onSelect: hc.openHelp },
              { label: 'API Documentation', icon: 'code' },
            ],
          }}
        >
          <OrdersPage hc={hc} empty={empty} notify={notify} />
        </AppShell>

      <HelpDrawer hc={hc} />

      {hc.quiz && (
        <Quiz
          open
          title={hc.quiz.title}
          questions={hc.quiz.questions}
          done={hc.quiz.done}
          onComplete={hc.quiz.onComplete}
          onClose={hc.closeQuiz}
        />
      )}

      <Modal
        open={hc.announce}
        onClose={() => hc.setAnnounce(false)}
       
        title={NEW_FEATURE.name}
        header={<span className="inline-flex items-center gap-ds-2 rounded-ds-pill bg-action px-ds-3 py-ds-2 text-ds-caption font-bold uppercase leading-none tracking-ds-label text-fg-inverse"><Icon name="notification" size={12} color="var(--color-fg-inverse)" /> Nueva función</span>}
        footer={
          <>
            <Button icon="task-complete" onClick={() => { hc.setAnnounce(false); hc.startFeatureQuiz(); }}>Prueba tus conocimientos</Button>
            <Button variant="primary" onClick={() => { hc.setAnnounce(false); notify('info', `Te llevamos a ${NEW_FEATURE.name}`); }}>Ir a {NEW_FEATURE.name}<Icon name="arrow-right" size={14} color="var(--color-fg-inverse)" /></Button>
          </>
        }
      >
        <h3 className="mb-ds-4 mt-ds-1 text-ds-subtitle font-bold leading-ds-subtitle text-fg">{NEW_FEATURE.name}</h3>
        <div className="overflow-hidden rounded-ds-xl border border-line"><VideoPlayer tag={NEW_FEATURE.name} duration={NEW_FEATURE.videoDur} /></div>
        <p className="mb-ds-1 mt-ds-4 text-ds-body-s leading-ds-body text-fg-muted">{NEW_FEATURE.desc}</p>
      </Modal>

      <DemoToggle empty={empty} setEmpty={setEmpty} onAnnounce={() => hc.setAnnounce(true)} onAddTutorial={hc.addTutorial} />
    </>
  );
}

export default function HelpCenter() {
  return (
    <ToastProvider>
      <Screen />
    </ToastProvider>
  );
}
