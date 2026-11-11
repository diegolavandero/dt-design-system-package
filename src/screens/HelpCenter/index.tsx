import { useState } from 'react';
import { AppShell, Badge, Button, Icon, Modal, ProgressChip, Quiz, ToastProvider, VideoPlayer, useDemoControls, useToast } from '@/ds';
import { HelpDrawer } from './HelpDrawer';
import { OrdersPage } from './OrdersPage';
import { NEW_FEATURE } from './data';
import { useHelpCenter } from './useHelpCenter';

function Screen() {
  const hc = useHelpCenter();
  const notify = useToast();
  const [empty, setEmpty] = useState(false);

  /** Variantes de demo: las dispara la página que aloja el prototipo, no el diseño. */
  useDemoControls(({ control, value }) => {
    if (control === 'state') setEmpty(value === 'new-user');
    if (control === 'announce') hc.setAnnounce(true);
    if (control === 'add-tutorial') hc.addTutorial();
  });

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
        header={<div className="flex flex-col items-start gap-ds-2"><Badge variant="info">Nueva función</Badge><h2 className="text-ds-subtitle font-bold leading-ds-subtitle text-fg">{NEW_FEATURE.name}</h2></div>}
        footer={
          <>
            <Button icon="task-complete" onClick={() => { hc.setAnnounce(false); hc.startFeatureQuiz(); }}>Prueba tus conocimientos</Button>
            <Button variant="primary" onClick={() => { hc.setAnnounce(false); notify('info', `Te llevamos a ${NEW_FEATURE.name}`); }}>Ir a {NEW_FEATURE.name}<Icon name="arrow-right" size={14} color="var(--color-fg-inverse)" /></Button>
          </>
        }
      >
        <div className="overflow-hidden rounded-ds-xl border border-line"><VideoPlayer tag={NEW_FEATURE.name} duration={NEW_FEATURE.videoDur} /></div>
        <p className="mb-ds-1 mt-ds-4 text-ds-body-s leading-ds-body text-fg-muted">{NEW_FEATURE.desc}</p>
      </Modal>

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
