import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';
import { Avatar } from './Avatar';
import { useEntered } from '@/ds/lib/useAnimatedNumber';

export interface Column<T> {
  key: string;
  header: string;
  /** Valor usado para ordenar. Si se omite, la columna no es ordenable. */
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
}

export interface Selection {
  selected: ReadonlySet<string>;
  onChange: (next: Set<string>) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage: string;
  /** Activa checkboxes por fila y selección maestra. */
  selection?: Selection;
  /** Acciones masivas: se muestran sobre el encabezado cuando hay 2 o más filas seleccionadas. */
  bulkActions?: ReactNode;
  /** Columna fija a la derecha con acciones por fila (p. ej. menú «⋮»). */
  rowActions?: (row: T) => ReactNode;
}

type Direction = 'asc' | 'desc';

function SortIcon({ state }: { state: Direction | null }) {
  const up = 'M16 4L6 16h20L16 4z';
  const down = 'M16 28L6 16h20l-10 12z';
  return (
    <svg width="9" height="9" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <path d={up} fill={state === 'asc' ? 'var(--color-action)' : 'var(--color-fg-subtle)'} />
      <path d={down} fill={state === 'desc' ? 'var(--color-action)' : 'var(--color-fg-subtle)'} />
    </svg>
  );
}

function Checkbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: (v: boolean) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-ds-4 w-ds-4 cursor-pointer accent-action"
    />
  );
}

export function DataTable<T>({ columns, rows, rowKey, emptyMessage, selection, bulkActions, rowActions }: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: Direction } | null>(null);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sort?.key);
    if (!sort || !col?.sortValue) return rows;
    const get = col.sortValue;
    const factor = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = get(a);
      const vb = get(b);
      return (typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'es')) * factor;
    });
  }, [rows, columns, sort]);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));

  if (rows.length === 0) {
    return <p className="px-ds-4 py-ds-8 text-center text-ds-body-s text-fg-muted">{emptyMessage}</p>;
  }

  const ids = rows.map(rowKey);
  const selectedCount = selection ? ids.filter((id) => selection.selected.has(id)).length : 0;
  const allSelected = selectedCount > 0 && selectedCount === ids.length;
  const bulkActive = !!selection && !!bulkActions && selectedCount >= 2;

  const setAll = (on: boolean) => selection?.onChange(new Set(on ? ids : []));
  const setOne = (id: string, on: boolean) => {
    if (!selection) return;
    const next = new Set(selection.selected);
    if (on) next.add(id);
    else next.delete(id);
    selection.onChange(next);
  };

  const stickyHead = 'sticky right-0 z-ds-raised w-ds-actions min-w-ds-actions max-w-ds-actions border-l border-line-strong bg-surface-header px-ds-1 text-center shadow-ds-sm';
  const stickyCell = 'sticky right-0 z-ds-base w-ds-actions min-w-ds-actions max-w-ds-actions border-l border-line bg-surface px-ds-1 text-center shadow-ds-xs';

  return (
    <div className="relative">
      {bulkActive && (
        <div
          role="toolbar"
          aria-label="Acciones masivas"
          className="absolute inset-x-0 top-0 z-ds-float flex h-ds-7 items-center gap-ds-3 border-b border-action-border-soft bg-action-soft pl-ds-9 pr-ds-4 animate-ds-bulk"
        >
          <span className="whitespace-nowrap text-ds-body-s font-semibold text-action-strong">{selectedCount} seleccionados</span>
          <div className="flex items-center gap-ds-2">{bulkActions}</div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-auto min-w-full border-collapse text-ds-body-s text-fg">
          <thead>
            <tr>
              {selection && (
                <th scope="col" className="w-ds-control min-w-ds-control max-w-ds-control border-b border-line-strong bg-surface-header px-0 py-ds-2 text-center">
                  <span className="flex items-center justify-center"><Checkbox label="Seleccionar todo" checked={allSelected} indeterminate={selectedCount > 0 && !allSelected} onChange={setAll} /></span>
                </th>
              )}
              {columns.map((c) => {
                const active = sort?.key === c.key ? sort.dir : null;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (active === 'asc' ? 'ascending' : 'descending') : undefined}
                    className="min-w-ds-col-min whitespace-nowrap border-b border-line-strong bg-surface-header px-ds-4 py-ds-2 text-left text-ds-body-s font-bold text-fg"
                  >
                    <span className={cn('block transition-all duration-ds-fast', bulkActive && 'translate-x-ds-6 opacity-0')}>
                      {c.sortValue ? (
                        <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-ds-2 font-bold">
                          {c.header}
                          <SortIcon state={active} />
                        </button>
                      ) : (
                        c.header
                      )}
                    </span>
                  </th>
                );
              })}
              {rowActions && (
                <th scope="col" className={cn(stickyHead, 'border-b border-line-strong py-ds-2 text-ds-body-s font-bold')}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const id = rowKey(row);
              const isSel = !!selection?.selected.has(id);
              return (
                <tr key={id} className={cn('group border-b border-line last:border-b-0', isSel ? 'bg-action-soft' : 'hover:bg-canvas')}>
                  {selection && (
                    <td className={cn('w-ds-control min-w-ds-control max-w-ds-control px-0 py-ds-2 text-center', isSel && 'shadow-ds-inset-success')}>
                      <span className="flex items-center justify-center"><Checkbox label="Seleccionar fila" checked={isSel} onChange={(v) => setOne(id, v)} /></span>
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className="min-w-ds-col-min whitespace-nowrap px-ds-4 py-ds-2 align-middle text-fg">
                      {c.render(row)}
                    </td>
                  ))}
                  {rowActions && <td className={cn(stickyCell, 'py-ds-2', isSel && '!bg-action-soft')}>{rowActions(row)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Celdas reutilizables ── */

export function AvatarCell({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-ds-2">
      <Avatar name={name} color={color} />
      {name}
    </span>
  );
}

export function ProgressCell({ value }: { value: number }) {
  const entered = useEntered();
  return (
    <span className="inline-flex items-center gap-ds-2">
      <span className="h-ds-1 w-ds-10 overflow-hidden rounded-ds-pill bg-surface-header" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <span className="block h-full rounded-ds-pill bg-action transition-all duration-ds-chart ease-out" style={{ width: entered ? `${value}%` : '0%' }} />
      </span>
      <span className="w-ds-7 text-ds-caption text-fg-secondary">{value}%</span>
    </span>
  );
}

export const MutedText = ({ children }: { children: ReactNode }) => <span className="text-fg-muted">{children}</span>;

export const LinkText = ({ children }: { children: ReactNode }) => (
  <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-action hover:underline">
    {children}
  </a>
);
