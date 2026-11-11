import { useState } from 'react';
import { AppShell, Badge, Button, Icon, Modal, ProgressChip, Quiz, Tabs, ToastProvider, VideoPlayer, useToast } from '@/ds';
import { HelpDrawer } from './HelpDrawer';
import { OrdersPage } from './OrdersPage';
import { NEW_FEATURE } from './data';
import { useHelpCenter } from './useHelpCenter';

/** Controles solo de prototipo: alternan estados y disparan eventos de demostración. */
function DemoToggle({ empty, setEmpty, onAnnounce, onAddTutorial }: { empty: boolean; setEmpty: (v: boolean) => void; onAnnounce: () => void; onAddTutorial: () => void }) {
  return (
    <div className="fixed bottom-ds-4 left-ds-4 z-ds-fab flex items-center gap-ds-3 rounded-ds-pill border border-dashed border-line-strong bg-surface py-ds-1 pl-ds-4 pr-ds-2 text-ds-caption font-semibold text-fg-muted shadow-ds-sm">
      <span>Demo:</span>
      <Tabs items={[{ label: 'Con datos' }, { label: 'Nuevo usuario' }]} value={empty ? 1 : 0} onChange={(i) => setEmpty(i === 1)} />
      <Button onClick={onAnnounce}>Anuncio función nueva</Button>
      <Button onClick={onAddTutorial} icon="add">Tutorial nuevo</Button>
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
            extra: <ProgressChip label={`${hc.progress.total} tutoriales · ${hc.progress.pct}%`} title="Panel de tutoriales" onClick={hc.openCatalog} />,
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
        header={<Badge variant="info">Nueva función</Badge>}
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
