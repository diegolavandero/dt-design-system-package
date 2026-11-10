import { AvatarCell, Badge, Card, CardHeader, CardTitle, DataTable, Donut, FilterBar, KpiCard, MutedText, ProgressCell, VIZ_STATE, type BadgeVariant, type Column, type FilterField } from '@/ds';
import { useMemo, useState } from 'react';
import { ENROLLED_USERS, avatarColor, type Classification, type MonitorUser } from './data';

const EMPTY = { user: '', cargo: '', onb: '', clas: '' };

const FIELDS: FilterField[] = [
  { key: 'user', placeholder: 'Todos los usuarios', options: ENROLLED_USERS.map((u) => u.name) },
  { key: 'cargo', placeholder: 'Todos los cargos', options: [...new Set(ENROLLED_USERS.map((u) => u.role))] },
  { key: 'onb', placeholder: 'Onboarding: Todos', options: ['Activo', 'Inactivo'] },
  { key: 'clas', placeholder: 'Clasificación: Todas', options: ['Completado', 'En progreso', 'Sin iniciar'] },
];

const CLAS_VARIANT: Record<Classification, BadgeVariant> = { Completado: 'success', 'En progreso': 'info', 'Sin iniciar': 'neutral' };

const COLUMNS: Column<MonitorUser>[] = [
  { key: 'name', header: 'Usuario', sortValue: (u) => u.name, render: (u) => <AvatarCell name={u.name} color={avatarColor(u.name)} /> },
  { key: 'estado', header: 'Onboarding status', sortValue: (u) => u.estado, render: (u) => <Badge variant={u.estado === 'Activo' ? 'success' : 'danger'}>{u.estado === 'Activo' ? 'Activo' : 'Inactivo'}</Badge> },
  { key: 'role', header: 'Cargo', sortValue: (u) => u.role, render: (u) => u.role },
  { key: 'email', header: 'Email', sortValue: (u) => u.email, render: (u) => <MutedText>{u.email}</MutedText> },
  { key: 'clas', header: 'Clasificación', sortValue: (u) => u.clas, render: (u) => <Badge variant={CLAS_VARIANT[u.clas]}>{u.clas}</Badge> },
  { key: 'reg', header: 'Cursos registrados', sortValue: (u) => u.reg, render: (u) => u.reg },
  { key: 'comp', header: 'Cursos completados', sortValue: (u) => u.comp, render: (u) => u.comp },
  { key: 'exam', header: 'Cursos con examen rendido', sortValue: (u) => u.exam, render: (u) => u.exam },
  { key: 'pub', header: 'Total cursos publicados', sortValue: () => 0, render: () => '—' },
  { key: 'prom', header: 'Promedio notas', sortValue: (u) => u.prom, render: (u) => (u.prom ? u.prom : '—') },
  { key: 'avance', header: 'Avance programa', sortValue: (u) => u.avance, render: (u) => <ProgressCell value={u.avance} /> },
  { key: 'cumpl', header: 'Cumplimiento programa', sortValue: (u) => u.cumpl, render: (u) => <ProgressCell value={u.cumpl} /> },
  { key: 'aprob', header: 'Cursos aprobados', sortValue: (u) => u.aprob, render: (u) => u.aprob },
];

export function ResumenPanel() {
  const [filters, setFilters] = useState<Record<string, string>>(EMPTY);

  const users = useMemo(
    () =>
      ENROLLED_USERS.filter(
        (u) =>
          (!filters.user || u.name === filters.user) &&
          (!filters.cargo || u.role === filters.cargo) &&
          (!filters.onb || (filters.onb === 'Activo' ? u.estado === 'Activo' : u.estado !== 'Activo')) &&
          (!filters.clas || u.clas === filters.clas),
      ),
    [filters],
  );

  const total = users.length;
  const active = users.filter((u) => u.estado === 'Activo').length;
  const byClas = (c: Classification) => users.filter((u) => u.clas === c).length;

  return (
    <>
      <FilterBar fields={FIELDS} applied={filters} onApply={setFilters} />

      <div className="grid grid-cols-2 gap-ds-3 ds-wide:grid-cols-4">
        <KpiCard icon="education" tone="info" label="Usuarios en capacitación" value={total} />
        <KpiCard icon="activity" tone="success" label="Usuarios activos" value={active} />
        <KpiCard icon="task-complete" tone="success" label="Completaron el programa" value={users.filter((u) => u.avance >= 100).length} />
        <KpiCard icon="time" tone="warning" label="Sin iniciar el programa" value={users.filter((u) => u.avance === 0).length} />
      </div>

      <div className="grid gap-ds-4 ds-wide:grid-cols-2">
        <Card>
          <CardTitle title="Estado de onboarding" />
          <Donut
            centerValue={total}
            centerLabel="Usuarios"
            segments={[
              { label: 'Activo', value: active, color: VIZ_STATE.positive },
              { label: 'Inactivo', value: total - active, color: VIZ_STATE.negative },
            ]}
          />
        </Card>
        <Card>
          <CardTitle title="Clasificación de avance" />
          <Donut
            centerValue={total}
            centerLabel="Usuarios"
            segments={[
              { label: 'Completado', value: byClas('Completado'), color: VIZ_STATE.positive },
              { label: 'En progreso', value: byClas('En progreso'), color: VIZ_STATE.progress },
              { label: 'Sin iniciar', value: byClas('Sin iniciar'), color: VIZ_STATE.idle },
            ]}
          />
        </Card>
      </div>

      <Card flush>
        <CardHeader title="Detalle de avance por usuario" meta={`${total} ${total === 1 ? 'registro' : 'registros'}`} />
        <DataTable columns={COLUMNS} rows={users} rowKey={(u) => u.id} emptyMessage="Ningún usuario coincide con los filtros seleccionados." />
      </Card>
    </>
  );
}
