import type { ReactNode } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  selected: string;
  showMonitoring?: boolean;
  topbar?: Parameters<typeof Topbar>[0];
  /** Espacio reservado a la derecha (px), p. ej. cuando hay un panel lateral abierto. */
  inset?: number;
  children: ReactNode;
}

export function AppShell({ selected, showMonitoring, topbar, inset = 0, children }: AppShellProps) {
  return (
    <div className="flex h-screen flex-col">
      <Topbar {...topbar} />
      <div className="flex min-h-0 flex-1">
        <Sidebar selected={selected} showMonitoring={showMonitoring} />
        <main style={{ marginRight: inset }} className="scroll-hover min-w-0 flex-1 overflow-auto transition-[margin] duration-[250ms] ease-out">{children}</main>
      </div>
    </div>
  );
}
