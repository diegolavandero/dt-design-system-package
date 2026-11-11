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
  size?: 'md' | 'lg';
  children: ReactNode;
  footer?: ReactNode;
}

/** Diálogo modal con scrim. Cierra con Esc o clic en el fondo, y devuelve el foco al elemento que lo abrió. */
export function Modal({ open, onClose, title, header, size = 'md', children, footer }: ModalProps) {
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
    <div className="fixed inset-0 z-ds-toast flex items-center justify-center p-ds-4">
      <div className="absolute inset-0 bg-scrim-dark" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn('relative flex max-h-ds-main max-w-full flex-col overflow-hidden rounded-ds-xl bg-surface shadow-ds-lg outline-none', size === 'lg' ? 'w-ds-modal-wide' : 'w-ds-modal')}
      >
        <div className={cn('flex shrink-0 items-center justify-between px-ds-5 py-ds-4', title && 'border-b border-line')}>
          {header ?? <h2 className="text-ds-body-l font-bold text-fg">{title}</h2>}
          <CloseButton onClick={onClose} />
        </div>
        <div className="overflow-y-auto px-ds-5 py-ds-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-ds-3 px-ds-5 pb-ds-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
