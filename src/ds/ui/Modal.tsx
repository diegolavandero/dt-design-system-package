import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/ds/lib/cn';
import { CloseButton } from './CloseButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Contenido de la cabecera en lugar del título de texto (p. ej. una insignia). */
  header?: ReactNode;
  width?: number;
  children: ReactNode;
  footer?: ReactNode;
}

/** Diálogo modal con scrim. Cierra con Esc o clic en el fondo, y devuelve el foco al elemento que lo abrió. */
export function Modal({ open, onClose, title, header, width = 560, children, footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo/45" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        style={{ width }}
        className={cn('relative flex max-h-[calc(100vh-48px)] max-w-full flex-col overflow-hidden rounded-xl bg-surface shadow-[0_24px_60px_rgba(19,32,69,.35)] outline-none')}
      >
        <div className={cn('flex shrink-0 items-center justify-between px-5 py-4', title && 'border-b border-line')}>
          {header ?? <h2 className="text-lg font-bold text-fg">{title}</h2>}
          <CloseButton onClick={onClose} />
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 px-5 pb-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
