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
    <div className="flex min-h-[calc(100vh-52px)]">
      <nav aria-label="Módulos" className="w-[52px] shrink-0 border-r border-line bg-surface py-2">
        {rail.map((icon) => (
          <div key={icon} className="flex h-10 items-center justify-center border-l-[6px] border-l-transparent">
            <Icon name={icon} size={18} color="var(--color-action-text)" />
          </div>
        ))}
      </nav>
      <aside aria-label="Ajustes" className="w-56 shrink-0 self-stretch overflow-y-auto border-r border-line bg-surface py-2">
        {groups.map((g) => (
          <div key={g.label} className="mb-1">
            <div className="px-4 pb-1.5 pt-3 text-base font-bold leading-none text-fg">{g.label}</div>
            <ul className="ml-3.5">
              {g.items.map((it) => {
                const active = it.label === activeItem;
                return (
                  <li
                    key={it.label}
                    aria-current={active ? 'page' : undefined}
                    className={cn('flex min-h-9 items-center justify-between gap-2 border-l-2 py-1 pl-3.5 pr-4 text-sm leading-tight', active ? 'border-l-nav-selected bg-action-selected font-bold text-action-strong' : 'border-l-line text-fg-secondary')}
                  >
                    {it.label}
                    {it.count != null && <span className="inline-flex h-5 min-w-[22px] items-center justify-center rounded-[10px] bg-action-soft-hover px-1.5 text-2xs font-semibold text-action">{it.count}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {version && (
          <>
            <div className="mx-4 my-2 h-px bg-surface-header" />
            <div className="px-4 py-2.5 text-2xs text-fg-muted">Versión {version}</div>
          </>
        )}
      </aside>
      <main className="flex min-w-0 flex-1 flex-col gap-5 bg-canvas px-6 pb-4 pt-5">{children}</main>
    </div>
  );
}
