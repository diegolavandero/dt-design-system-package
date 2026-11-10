import { Badge, Pagination, Button, DataTable, FilterButton, Icon, LinkText, ResetFiltersButton, RowMenu, SettingsLayout, TextField, ToastProvider, Topbar, useToast, type Column, type IconName } from '@/ds';
import { useMemo, useState } from 'react';
import { INITIAL_USERS, RAIL_ICONS, SETTINGS_GROUPS, type WebUser } from './data';

interface Filters {
  name: string;
  user: string;
  includeInactive: boolean;
}
const NO_FILTERS: Filters = { name: '', user: '', includeInactive: true };

const plural = (n: number) => `${n} ${n === 1 ? 'usuario' : 'usuarios'}`;

function BulkButton({ icon, children, onClick }: { icon: IconName; children: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded border border-action-border-soft bg-surface px-2.5 text-xs font-medium text-action-strong transition-colors hover:border-focus hover:bg-action-soft"
    >
      <Icon name={icon} size={14} />
      {children}
    </button>
  );
}

function UsersScreen() {
  const notify = useToast();
  const [users, setUsers] = useState<WebUser[]>(INITIAL_USERS);
  const [draft, setDraft] = useState<Filters>(NO_FILTERS);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const patch = (ids: string[], change: Partial<WebUser>) =>
    setUsers((xs) => xs.map((x) => (ids.includes(x.id) ? { ...x, ...change } : x)));

  const visible = useMemo(
    () =>
      users.filter(
        (x) =>
          (!filters.name || x.name.toLowerCase().includes(filters.name.trim().toLowerCase())) &&
          (!filters.user || x.user.toLowerCase().includes(filters.user.trim().toLowerCase())) &&
          (filters.includeInactive || x.estado === 'Activo'),
      ),
    [users, filters],
  );

  const apply = () => setFilters(draft);
  const reset = () => {
    setDraft(NO_FILTERS);
    setFilters(NO_FILTERS);
  };

  const toggleCap = (x: WebUser) => {
    patch([x.id], { cap: !x.cap });
    notify('success', `Capacitación ${x.cap ? 'desactivada' : 'activada'}`, x.name);
  };
  const toggleBlock = (x: WebUser) => {
    const blocked = x.estado !== 'Bloqueado';
    patch([x.id], { estado: blocked ? 'Bloqueado' : 'Activo' });
    notify('success', blocked ? 'Usuario bloqueado' : 'Usuario activado', x.name);
  };

  const ids = visible.filter((x) => selected.has(x.id)).map((x) => x.id);
  const bulkCap = (on: boolean) => {
    patch(ids, { cap: on });
    notify('success', `Capacitación ${on ? 'activada' : 'desactivada'}`, plural(ids.length));
  };
  const bulkBlock = () => {
    patch(ids, { estado: 'Bloqueado' });
    notify('success', 'Usuarios bloqueados', plural(ids.length));
  };

  const columns: Column<WebUser>[] = [
    { key: 'name', header: 'Nombre', sortValue: (x) => x.name, render: (x) => <LinkText>{x.name}</LinkText> },
    { key: 'estado', header: 'Estado', sortValue: (x) => x.estado, render: (x) => <Badge variant={x.estado === 'Activo' ? 'success' : 'danger'}>{x.estado}</Badge> },
    { key: 'user', header: 'Usuario', sortValue: (x) => x.user, render: (x) => x.user },
    { key: 'role', header: 'Rol', sortValue: (x) => x.role, render: (x) => x.role },
    { key: 'cap', header: 'Capacitación', sortValue: (x) => Number(x.cap), render: (x) => <Badge variant={x.cap ? 'success' : 'neutral'}>{x.cap ? 'Sí' : 'No'}</Badge> },
    { key: 'last', header: 'Última conexión', render: (x) => x.last },
  ];

  return (
    <>
      <div className="sticky top-0 z-50">
        <Topbar tenant="ACME CO" />
      </div>
      <SettingsLayout rail={RAIL_ICONS} groups={SETTINGS_GROUPS} activeItem="Usuarios web" version="20.25.10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
            <h1 className="text-3xl font-bold leading-none text-fg">Usuarios web</h1>
            <span className="text-sm text-fg-muted">
              Usuarios activos: <b className="text-fg">30</b> · Usuarios bloqueados: <b className="text-fg">8</b>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button icon="plan">Bitácora</Button>
            <Button icon="group">Roles de usuario</Button>
            <Button variant="primary" icon="add">Nuevo usuario</Button>
          </div>
        </div>

        <section className="flex flex-col gap-5 rounded-lg border border-line-strong bg-surface p-5">
          <div className="flex flex-wrap items-center gap-2">
            <TextField placeholder="Nombre" value={draft.name} onChange={(name) => setDraft((d) => ({ ...d, name }))} onEnter={apply} />
            <TextField placeholder="Usuario" value={draft.user} onChange={(user) => setDraft((d) => ({ ...d, user }))} onEnter={apply} />
            <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-fg">
              <input type="checkbox" checked={draft.includeInactive} onChange={(e) => setDraft((d) => ({ ...d, includeInactive: e.target.checked }))} className="h-[15px] w-[15px] cursor-pointer accent-focus" />
              Incluir inactivos
            </label>
            <FilterButton onClick={apply} />
            <ResetFiltersButton onClick={reset} />
          </div>

          <div className="overflow-hidden rounded border border-line-strong">
            <DataTable
              columns={columns}
              rows={visible}
              rowKey={(x) => x.id}
              emptyMessage="Ningún usuario coincide con los filtros seleccionados."
              selection={{ selected, onChange: setSelected }}
              bulkActions={
                <>
                  <BulkButton icon="misuse" onClick={bulkBlock}>Bloquear usuarios</BulkButton>
                  <BulkButton icon="task-complete" onClick={() => bulkCap(true)}>Activar capacitación</BulkButton>
                  <BulkButton icon="close-filled" onClick={() => bulkCap(false)}>Desactivar capacitación</BulkButton>
                </>
              }
              rowActions={(x) => (
                <RowMenu
                  label={`Más acciones para ${x.name}`}
                  items={[
                    { label: 'Editar', onSelect: () => notify('info', 'Editar usuario', x.name) },
                    { label: 'Ver permisos', onSelect: () => notify('info', 'Ver permisos', x.name) },
                    { label: x.estado === 'Bloqueado' ? 'Desbloquear usuario' : 'Bloquear usuario', onSelect: () => toggleBlock(x) },
                    { label: x.cap ? 'Desactivar capacitación' : 'Activar capacitación', onSelect: () => toggleCap(x) },
                  ]}
                />
              )}
            />
          </div>
        </section>

        <Pagination page={page} pages={3} onChange={setPage} />
      </SettingsLayout>
    </>
  );
}

export default function UsersSettings() {
  return (
    <ToastProvider>
      <UsersScreen />
    </ToastProvider>
  );
}
