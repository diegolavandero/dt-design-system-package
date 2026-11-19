import { useState } from 'react';
import { AppShell, ToastProvider } from '@/ds';
import { Console } from './Console';
import { Wizard, WizardHeader } from './Wizard';
import { usePlanner } from './usePlanner';
import './routing.css';

/** Prototipo Unified Routing: asistente de 3 pasos (órdenes, vehículos, parámetros) y consola de planificación. */
export default function UnifiedRouting() {
  const p = usePlanner();
  const [layout, setLayout] = useState<'split' | 'table' | 'map'>('split');
  return (
    <ToastProvider>
      <AppShell selected="Rutas" topbar={{ tenant: 'ACME CO' }}>
        <div className="flex h-full min-h-0 flex-col bg-surface">
          {p.step < 3 ? (
            <>
              <WizardHeader p={p} layout={layout} setLayout={setLayout} />
              <Wizard p={p} layout={layout} />
            </>
          ) : (
            <Console p={p} />
          )}
        </div>
      </AppShell>
    </ToastProvider>
  );
}
