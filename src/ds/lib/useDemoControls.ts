import { useEffect, useRef } from 'react';

export interface DemoMessage {
  control: string;
  value?: string;
}

/** Recibe controles de demo enviados por la página que aloja el prototipo (postMessage, mismo origen). Los controles viven fuera del diseño. */
export function useDemoControls(handler: (msg: DemoMessage) => void) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { source?: string; control?: string; value?: string } | null;
      if (d?.source === 'dt-demo' && typeof d.control === 'string') ref.current({ control: d.control, value: d.value });
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);
}
