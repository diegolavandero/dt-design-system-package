import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/ds/icons/Icon';

export interface HelpMenuItem {
  label: string;
  icon: IconName;
  onSelect?: () => void;
}

interface TopbarProps {
  tenant?: string;
  /** Elementos extra a la izquierda de los íconos (p. ej. un chip de progreso). */
  extra?: ReactNode;
  /** Si se define, el ícono de ayuda abre este menú. */
  helpMenu?: HelpMenuItem[];
}

const ACTIONS: { icon: IconName; label: string; badge?: boolean }[] = [
  { icon: 'apps', label: 'Aplicaciones' },
  { icon: 'help', label: 'Ayuda' },
  { icon: 'messages', label: 'Mensajes' },
  { icon: 'alerts', label: 'Alertas', badge: true },
  { icon: 'user', label: 'Perfil' },
];

function HelpButton({ items }: { items: HelpMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex">
      <button type="button" aria-label="Ayuda" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex text-fg-inverse">
        <Icon name="help" size={18} color="#fff" />
      </button>
      {open && (
        <div role="menu" className="absolute -right-2 top-[calc(100%+14px)] z-[9999] min-w-[210px] overflow-hidden rounded-lg border border-line bg-surface shadow-[0_4px_16px_rgba(19,32,69,.14)]">
          <div className="px-4 pb-1 pt-2 text-3xs font-bold uppercase tracking-wider text-fg-muted">Ayuda</div>
          <div className="h-px bg-line" />
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                it.onSelect?.();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-fg hover:bg-surface-subtle"
            >
              <Icon name={it.icon} size={16} color="var(--color-fg-muted)" />
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Barra superior del DS. El logo es un wordmark de texto: el asset SVG original no existe en el repo del DS. */
export function Topbar({ tenant = 'beetrack', extra, helpMenu }: TopbarProps) {
  return (
    <header className="flex h-[52px] items-center bg-nav pl-[22px]">
      <span className="text-lg font-bold tracking-tight text-fg-inverse">LastMile</span>
      <nav aria-label="Acciones globales" className="ml-auto flex items-center gap-7 pr-7">
        {extra}
        {ACTIONS.map((a) =>
          a.icon === 'help' && helpMenu ? (
            <HelpButton key={a.icon} items={helpMenu} />
          ) : (
            <button key={a.icon} type="button" aria-label={a.label} className="relative flex text-fg-inverse">
              <Icon name={a.icon} size={18} color="#fff" />
              {a.badge && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger ring-2 ring-nav" />}
            </button>
          ),
        )}
      </nav>
      <div className="flex h-[52px] w-[98px] items-center justify-center rounded-tl-[20px] bg-surface text-sm font-bold text-fg">{tenant}</div>
    </header>
  );
}
