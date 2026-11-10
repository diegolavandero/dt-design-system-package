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

/** Orden oficial del DS (Topbar › iconOrder): apps, alerts, messages, help, settings, user. */
const ACTIONS: { icon: IconName; label: string; badge?: boolean }[] = [
  { icon: 'apps', label: 'Aplicaciones' },
  { icon: 'alerts', label: 'Alertas', badge: true },
  { icon: 'messages', label: 'Mensajes' },
  { icon: 'help', label: 'Ayuda' },
  { icon: 'settings', label: 'Configuración' },
  { icon: 'user', label: 'Perfil' },
];

const LOGO = `${import.meta.env.BASE_URL}sections/assets/logos/lastmile-desktop-white.svg`;

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
        <Icon name="help" size={18} color="var(--color-fg-inverse)" />
      </button>
      {open && (
        <div role="menu" className="absolute -right-ds-2 top-full mt-ds-3 z-ds-menu min-w-ds-popover overflow-hidden rounded-ds-lg border border-line bg-surface shadow-ds-md">
          <div className="px-ds-4 pb-ds-1 pt-ds-2 text-ds-caption font-bold uppercase tracking-ds-label text-fg-muted">Ayuda</div>
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
              className="flex w-full items-center gap-ds-3 px-ds-4 py-ds-3 text-left text-ds-body-s font-medium text-fg hover:bg-surface-subtle"
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

/** Barra superior del DS (desktop): logo blanco · acciones · slot del cliente con esquina superior izquierda redondeada. */
export function Topbar({ tenant = 'ACME CO', extra, helpMenu }: TopbarProps) {
  return (
    <header className="flex h-ds-topbar items-center overflow-hidden bg-nav pl-ds-6">
      <img src={LOGO} alt="LastMile" className="block h-ds-logo w-auto shrink-0" />
      <nav aria-label="Acciones globales" className="ml-auto flex items-center gap-ds-7">
        {extra}
        {ACTIONS.map((a) =>
          a.icon === 'help' && helpMenu ? (
            <HelpButton key={a.icon} items={helpMenu} />
          ) : (
            <button key={a.icon} type="button" aria-label={a.label} className="relative flex text-fg-inverse">
              <Icon name={a.icon} size={18} color="var(--color-fg-inverse)" />
              {a.badge && <span className="absolute -right-ds-1 -top-ds-1 h-ds-2 w-ds-2 rounded-ds-pill bg-danger ring-2 ring-nav" />}
            </button>
          ),
        )}
      </nav>
      <div className="ml-ds-5 flex h-ds-topbar w-ds-slot shrink-0 items-center justify-center rounded-ds-slot bg-surface text-ds-caption font-bold text-nav">{tenant}</div>
    </header>
  );
}
