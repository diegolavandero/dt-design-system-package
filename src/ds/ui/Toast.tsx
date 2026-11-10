import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  text?: string;
}

type Notify = (type: ToastType, title: string, text?: string) => void;

const ToastContext = createContext<Notify>(() => undefined);
export const useToast = () => useContext(ToastContext);

const BORDER: Record<ToastType, string> = {
  success: 'border-l-g-6',
  error: 'border-l-r-6',
  warning: 'border-l-o-5',
  info: 'border-l-b-6',
  neutral: 'border-l-n-4',
};
const STROKE: Record<ToastType, string> = {
  success: 'var(--color-success)', error: 'var(--color-danger-fg)', warning: 'var(--color-warning)', info: 'var(--color-action)', neutral: 'var(--color-fg-muted)',
};
const ICON: Record<ToastType, string> = {
  success: '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>',
  error: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
  warning: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  neutral: '<circle cx="12" cy="12" r="10"/><path d="M12 8h.01M12 12v4"/>',
};

const DURATION = 4000;

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), DURATION);
    return () => clearTimeout(t);
  }, [item.id, onDismiss]);

  return (
    <div role="status" className={`pointer-events-auto flex animate-ds-toast items-start gap-ds-3 rounded-ds-md border-l-ds-accent bg-surface px-ds-4 py-ds-3 shadow-ds-md ${BORDER[item.type]}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={STROKE[item.type]} strokeWidth="2" className="mt-px shrink-0" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON[item.type] }} />
      <div className="min-w-0 flex-1">
        <div className="mb-ds-1 text-ds-body-s font-semibold text-fg">{item.title}</div>
        {item.text && <div className="text-ds-caption leading-ds-caption text-fg-muted">{item.text}</div>}
      </div>
      <button type="button" aria-label="Cerrar" onClick={() => onDismiss(item.id)} className="-mt-ds-1 ml-ds-1 flex h-ds-5 w-ds-5 shrink-0 items-center justify-center rounded-ds-sm text-fg-subtle hover:bg-canvas hover:text-fg">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const notify = useCallback<Notify>((type, title, text) => setItems((xs) => [...xs, { id: nextId.current++, type, title, text }]), []);
  const value = useMemo(() => notify, [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-ds-4 top-ds-4 z-ds-menu flex w-ds-drawer max-w-ds-viewport-inset flex-col gap-ds-2" aria-live="polite">
        {items.map((it) => (
          <Toast key={it.id} item={it} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
