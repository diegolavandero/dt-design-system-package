import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';
import { Avatar } from './Avatar';

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
      className="h-3.5 w-3.5 cursor-pointer accent-focus"
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
    return <p className="px-4 py-10 text-center text-sm text-fg-muted">{emptyMessage}</p>;
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

  const stickyHead = 'sticky right-0 z-[2] w-[82px] min-w-[82px] bg-surface-header px-1 text-center shadow-[-6px_0_12px_-6px_rgba(0,0,0,.14)]';
  const stickyCell = 'sticky right-0 z-[1] w-[82px] min-w-[82px] bg-surface px-1 text-center shadow-[-6px_0_12px_-6px_rgba(0,0,0,.10)]';

  return (
    <div className="relative">
      {bulkActive && (
        <div
          role="toolbar"
          aria-label="Acciones masivas"
          className="absolute inset-x-0 top-0 z-[5] flex h-[39px] items-center gap-3 border-b border-action-border-soft bg-action-soft pl-[52px] pr-4 animate-[bulk-in_.22s_ease]"
        >
          <span className="whitespace-nowrap text-sm font-semibold text-action-strong">{selectedCount} seleccionados</span>
          <div className="flex items-center gap-1.5">{bulkActions}</div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {selection && (
                <th scope="col" className="w-10 border-b border-line-strong bg-surface-header py-2.5 text-center">
                  <Checkbox label="Seleccionar todo" checked={allSelected} indeterminate={selectedCount > 0 && !allSelected} onChange={setAll} />
                </th>
              )}
              {columns.map((c) => {
                const active = sort?.key === c.key ? sort.dir : null;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (active === 'asc' ? 'ascending' : 'descending') : undefined}
                    className="whitespace-nowrap border-b border-line-strong bg-surface-header px-4 py-2.5 text-left text-sm font-bold text-fg"
                  >
                    <span className={cn('block transition-[opacity,transform] duration-200', bulkActive && 'translate-x-6 opacity-0')}>
                      {c.sortValue ? (
                        <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1.5 font-bold">
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
                <th scope="col" className={cn(stickyHead, 'border-b border-line-strong py-2.5 text-sm font-bold')}>
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
                <tr key={id} className={cn('group border-b border-line last:border-b-0', isSel ? 'bg-action-soft' : 'hover:bg-surface-subtle')}>
                  {selection && (
                    <td className={cn('w-10 py-2.5 text-center', isSel && 'shadow-[inset_3px_0_0_var(--color-success)]')}>
                      <Checkbox label="Seleccionar fila" checked={isSel} onChange={(v) => setOne(id, v)} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-4 py-2.5 align-middle text-fg">
                      {c.render(row)}
                    </td>
                  ))}
                  {rowActions && <td className={cn(stickyCell, isSel && '!bg-action-soft')}>{rowActions(row)}</td>}
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
    <span className="inline-flex items-center gap-2">
      <Avatar name={name} color={color} />
      {name}
    </span>
  );
}

export function ProgressCell({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-[5px] w-[72px] overflow-hidden rounded-full bg-surface-header" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <span className="block h-full rounded-full bg-action" style={{ width: `${value}%` }} />
      </span>
      <span className="w-9 text-xs text-fg-secondary">{value}%</span>
    </span>
  );
}

export const MutedText = ({ children }: { children: ReactNode }) => <span className="text-fg-muted">{children}</span>;

export const LinkText = ({ children }: { children: ReactNode }) => (
  <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-action hover:underline">
    {children}
  </a>
);
