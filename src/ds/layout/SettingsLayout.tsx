import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

export interface SettingsGroup {
  label: string;
  items: { label: string; count?: number }[];
}

interface SettingsLayoutProps {
  /** Íconos del riel izquierdo (ninguno seleccionado: estamos dentro de Ajustes). */
  rail: IconName[];
  groups: SettingsGroup[];
  activeItem: string;
  version?: string;
  children: ReactNode;
}

/** Layout «Sidebar de ajustes» del DS: riel de íconos + panel de secciones + contenido. */
export function SettingsLayout({ rail, groups, activeItem, version, children }: SettingsLayoutProps) {
  return (
    <div className="flex min-h-ds-main">
      <nav aria-label="Módulos" className="w-ds-sidebar shrink-0 border-r border-line bg-surface py-ds-2">
        {rail.map((icon) => (
          <div key={icon} className="flex h-ds-control items-center justify-center border-l-ds-accent border-l-transparent">
            <Icon name={icon} size={18} color="var(--color-action-text)" />
          </div>
        ))}
      </nav>
      <aside aria-label="Ajustes" className="w-ds-settings-nav shrink-0 self-stretch overflow-y-auto border-r border-line bg-surface py-ds-2">
        {groups.map((g) => (
          <div key={g.label} className="mb-ds-1">
            <div className="px-ds-4 pb-ds-2 pt-ds-3 text-ds-body-s font-bold leading-none text-fg">{g.label}</div>
            <ul className="ml-ds-4">
              {g.items.map((it) => {
                const active = it.label === activeItem;
                return (
                  <li
                    key={it.label}
                    aria-current={active ? 'page' : undefined}
                    className={cn('flex min-h-ds-7 items-center justify-between gap-ds-2 border-l-2 py-ds-1 pl-ds-4 pr-ds-4 text-ds-body-s leading-ds-body', active ? 'border-l-nav-selected bg-action-selected font-bold text-action-strong' : 'border-l-line text-fg-secondary')}
                  >
                    {it.label}
                    {it.count != null && <span className="inline-flex h-ds-5 min-w-ds-6 items-center justify-center rounded-ds-xl bg-action-soft-hover px-ds-2 text-ds-caption font-semibold text-action">{it.count}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {version && (
          <>
            <div className="mx-ds-4 my-ds-2 h-px bg-surface-header" />
            <div className="px-ds-4 py-ds-3 text-ds-caption text-fg-muted">Versión {version}</div>
          </>
        )}
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-ds-5 bg-canvas px-ds-6 pb-ds-4 pt-ds-5">{children}</main>
    </div>
  );
}
