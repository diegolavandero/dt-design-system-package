import type { ReactNode } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  selected: string;
  showMonitoring?: boolean;
  topbar?: Parameters<typeof Topbar>[0];
  /** Reserva el ancho del drawer a la derecha cuando hay un panel lateral abierto. */
  drawerOpen?: boolean;
  children: ReactNode;
}

export function AppShell({ selected, showMonitoring, topbar, drawerOpen = false, children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <Topbar {...topbar} />
      <div className="flex min-h-0 flex-1">
        <Sidebar selected={selected} showMonitoring={showMonitoring} />
        <main className={`scroll-hover min-w-0 flex-1 overflow-auto transition-all duration-ds-base ease-out ${drawerOpen ? 'mr-ds-drawer' : 'mr-0'}`}>{children}</main>
      </div>
    </div>
  );
}
