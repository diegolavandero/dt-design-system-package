import { useState } from 'react';
import { AppShell, Button, DRAWER_WIDTH, Icon, Modal, Quiz, ToastProvider, VideoPlayer, useToast } from '@/ds';
import { HelpDrawer } from './HelpDrawer';
import { OrdersPage } from './OrdersPage';
import { NEW_FEATURE } from './data';
import { useHelpCenter } from './useHelpCenter';

/** Chip «N tutoriales · P%» de la barra superior: abre el catálogo. */
function CapChip({ total, pct, onClick }: { total: number; pct: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title="Capacitaciones" className="inline-flex h-[30px] shrink-0 items-center gap-[7px] rounded-full border border-white/20 bg-white/10 px-[13px] text-xs font-bold leading-none text-fg-inverse transition-colors hover:bg-white/20">
      <Icon name="education" size={16} color="#fff" />
      <span>{total} tutoriales · {pct}%</span>
    </button>
  );
}

/** Interruptor solo de prototipo: alterna estados y dispara eventos de demostración. */
function DemoToggle({ empty, setEmpty, onAnnounce, onAddTutorial }: { empty: boolean; setEmpty: (v: boolean) => void; onAnnounce: () => void; onAddTutorial: () => void }) {
  const tab = (on: boolean) => `rounded-full px-[11px] py-[5px] text-2xs font-semibold ${on ? 'bg-action text-fg-inverse' : 'text-fg-secondary hover:bg-canvas'}`;
  return (
    <div className="fixed bottom-4 left-4 z-[160] flex items-center gap-1.5 rounded-full border border-dashed border-line-strong bg-surface py-[5px] pl-3 pr-2 text-2xs font-semibold text-fg-muted shadow-float">
      <span>Demo:</span>
      <button type="button" className={tab(!empty)} onClick={() => setEmpty(false)}>Con datos</button>
      <button type="button" className={tab(empty)} onClick={() => setEmpty(true)}>Nuevo usuario (vacío)</button>
      <span className="mx-0.5 h-4 w-px bg-line" />
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
          inset={hc.open ? DRAWER_WIDTH : 0}
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
        width={520}
        title={NEW_FEATURE.name}
        header={<span className="inline-flex items-center gap-1.5 rounded-full bg-action px-3 py-1.5 text-2xs font-bold uppercase leading-none tracking-wide text-fg-inverse"><Icon name="notification" size={12} color="#fff" /> Nueva función</span>}
        footer={
          <>
            <Button icon="task-complete" onClick={() => { hc.setAnnounce(false); hc.startFeatureQuiz(); }}>Prueba tus conocimientos</Button>
            <Button variant="primary" onClick={() => { hc.setAnnounce(false); notify('info', `Te llevamos a ${NEW_FEATURE.name}`); }}>Ir a {NEW_FEATURE.name}<Icon name="arrow-right" size={14} color="#fff" /></Button>
          </>
        }
      >
        <h3 className="mb-3.5 mt-1 text-2xl font-bold leading-[26px] text-fg">{NEW_FEATURE.name}</h3>
        <div className="overflow-hidden rounded-[10px] border border-line"><VideoPlayer tag={NEW_FEATURE.name} duration={NEW_FEATURE.videoDur} /></div>
        <p className="mb-1 mt-3.5 text-base leading-[21px] text-fg-muted">{NEW_FEATURE.desc}</p>
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
