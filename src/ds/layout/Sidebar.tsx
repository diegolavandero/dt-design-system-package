import { Icon, type IconName } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

type Item = { icon: IconName; label: string; selected?: boolean } | 'divider';

const BASE: Item[] = [
  { icon: 'report-data', label: 'Resumen' }, { icon: 'dashboard', label: 'Actividad' },
  { icon: 'network-3', label: 'Rutas' }, { icon: 'document-multiple', label: 'Órdenes' },
  { icon: 'delivery', label: 'Flota' }, { icon: 'chart-column', label: 'Estadísticas' },
  { icon: 'notification', label: 'Alertas' }, { icon: 'events', label: 'Clientes' },
  { icon: 'file-system', label: 'Documentos' }, { icon: 'currency', label: 'Módulo de Costos' },
  { icon: 'return', label: 'Logística inversa' }, { icon: 'white-paper', label: 'Rendición de Documentos' },
  { icon: 'store', label: 'Retiro en tienda' }, { icon: 'document-import', label: 'Importar' },
  'divider',
  { icon: 'settings', label: 'Ajustes' },
];

/** Sidebar colapsada (52px) que se expande al hover. */
interface SidebarProps {
  /** Etiqueta del ítem seleccionado. */
  selected?: string;
  /** Muestra «Monitoreo de tutoriales» (solo administradores). */
  showMonitoring?: boolean;
}

export function Sidebar({ selected, showMonitoring = false }: SidebarProps) {
  const all: Item[] = showMonitoring ? [...BASE, { icon: 'education', label: 'Monitoreo de tutoriales' }] : BASE;
  const items = all.map((it) => (it === 'divider' ? it : { ...it, selected: it.label === selected }));
  return (
    <aside className="group w-[52px] shrink-0 overflow-hidden border-r border-line bg-surface py-2 transition-[width] duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)] hover:w-[248px]">
      <nav aria-label="Principal">
        {items.map((it, i) =>
          it === 'divider' ? (
            <div key={`d${i}`} className="mx-3.5 my-1 h-px bg-surface-header" />
          ) : (
            <a
              key={it.label}
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-current={it.selected ? 'page' : undefined}
              className="flex h-10 items-center"
            >
              <span className={cn('h-10 w-1.5 shrink-0', it.selected && 'bg-nav-selected')} />
              <span className={cn('flex h-10 flex-1 items-center overflow-hidden transition-colors', it.selected ? 'bg-action-selected' : 'hover:bg-action-hover-soft')}>
                <span className="flex w-[46px] shrink-0 justify-center">
                  <Icon name={it.icon} size={18} color={it.selected ? 'var(--color-action-strong)' : 'var(--color-action-text)'} />
                </span>
                <span className={cn('flex-1 overflow-hidden whitespace-nowrap text-sm opacity-0 transition-opacity delay-75 duration-200 group-hover:opacity-100', it.selected ? 'font-semibold text-action-strong' : 'text-fg')}>
                  {it.label}
                </span>
              </span>
            </a>
          ),
        )}
      </nav>
    </aside>
  );
}
