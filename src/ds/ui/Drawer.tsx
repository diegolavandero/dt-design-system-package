import { useEffect, useRef, type ReactNode } from 'react';
import { CloseButton } from './CloseButton';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Título con elementos a su derecha (p. ej. un contador). */
  title: ReactNode;
  /** Línea de contexto bajo el título (migas de pan). */
  context?: ReactNode;
  children: ReactNode;
  /** Se llama al pulsar Esc; por defecto cierra el panel. Permite volver un nivel en vez de cerrar. */
  onEscape?: () => void;
  /** Cambia para reiniciar el scroll al navegar entre vistas. */
  scrollKey?: string;
  /** Nombre accesible del panel. */
  label?: string;
}

export const DRAWER_WIDTH = 400;

/** Panel lateral no modal: el contenido de la página se desplaza (margin-right) en lugar de quedar tapado. */
export function Drawer({ open, onClose, title, context, children, onEscape, scrollKey, label = 'Panel lateral' }: DrawerProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);

  // `inert` aún no está tipado en React 18: se aplica por referencia para que el panel cerrado no reciba foco.
  useEffect(() => {
    if (panel.current) (panel.current as HTMLElement & { inert: boolean }).inert = !open;
  }, [open]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [scrollKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (onEscape ?? onClose)();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, onEscape]);

  return (
    <aside
      role="complementary"
      ref={panel}
      aria-label={label}
      aria-hidden={!open}
      style={{ width: DRAWER_WIDTH }}
      className={`fixed bottom-0 right-0 top-0 z-[299] flex max-w-full flex-col bg-surface shadow-[-8px_0_24px_rgba(19,32,69,.14)] transition-transform duration-[250ms] ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <header className="flex shrink-0 items-start justify-between border-b border-line px-5 pb-3.5 pt-[18px]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 [&>:first-child]:min-w-0 [&>:first-child]:truncate">{title}</div>
          {context && <div className="mt-0.5 truncate text-xs leading-4 text-fg-muted">{context}</div>}
        </div>
        <CloseButton onClick={onClose} />
      </header>
      <div ref={scroller} className="flex-1 overflow-y-auto p-5">
        {children}
      </div>
    </aside>
  );
}
