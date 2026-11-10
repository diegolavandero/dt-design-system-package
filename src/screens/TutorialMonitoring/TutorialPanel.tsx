import { Badge, BarsChart, Card, CardHeader, CardTitle, ColumnChart, DataTable, FilterBar, LinkText, ProgressCell, type Column, type FilterField } from '@/ds';
import { useMemo, useState } from 'react';
import { TUTORIAL_STATS, tutorialStatus, type TutorialStat } from './data';

const EMPTY = { tut: '', nivel: '', estado: '' };

const FIELDS: FilterField[] = [
  { key: 'tut', placeholder: 'Todos los tutoriales', options: TUTORIAL_STATS.map((t) => t.name) },
  { key: 'nivel', placeholder: 'Todos los niveles', options: ['Nivel 100', 'Nivel 200', 'Nivel 300'] },
  { key: 'estado', placeholder: 'Estado: Todos', options: ['Completado', 'En progreso', 'Sin iniciar'] },
];

const COLUMNS: Column<TutorialStat>[] = [
  { key: 'name', header: 'Tutorial', sortValue: (t) => t.name, render: (t) => <LinkText>{t.name}</LinkText> },
  { key: 'level', header: 'Nivel', sortValue: (t) => t.level, render: (t) => <Badge>{`Nivel ${t.level}`}</Badge> },
  { key: 'comp', header: 'Completados', sortValue: (t) => t.comp, render: (t) => t.comp },
  { key: 'prog', header: 'En progreso', sortValue: (t) => t.prog, render: (t) => t.prog },
  { key: 'tasa', header: 'Tasa de aprobación', sortValue: (t) => t.tasa, render: (t) => `${t.tasa}%` },
  { key: 'avance', header: 'Avance', sortValue: (t) => t.avance, render: (t) => <ProgressCell value={t.avance} /> },
];

const Empty = () => <p className="py-ds-7 text-center text-ds-body-s text-fg-muted">Sin datos para los filtros seleccionados.</p>;

export function TutorialPanel() {
  const [filters, setFilters] = useState<Record<string, string>>(EMPTY);

  const tutorials = useMemo(
    () =>
      TUTORIAL_STATS.filter(
        (t) =>
          (!filters.tut || t.name === filters.tut) &&
          (!filters.nivel || `Nivel ${t.level}` === filters.nivel) &&
          (!filters.estado || tutorialStatus(t) === filters.estado),
      ),
    [filters],
  );

  const top = useMemo(() => [...tutorials].sort((a, b) => b.comp - a.comp).slice(0, 5).map((t) => ({ label: t.name, value: t.comp })), [tutorials]);
  const levels = useMemo(
    () =>
      (['100', '200', '300'] as const).flatMap((lv) => {
        const arr = tutorials.filter((t) => t.level === lv);
        return arr.length ? [{ label: `Nivel ${lv}`, value: Math.round(arr.reduce((s, t) => s + t.avance, 0) / arr.length) }] : [];
      }),
    [tutorials],
  );

  return (
    <>
      <FilterBar fields={FIELDS} applied={filters} onApply={setFilters} />

      <div className="grid gap-ds-4 ds-wide:grid-cols-2">
        <Card>
          <CardTitle title="Tutoriales más completados" subtitle="Cantidad de usuarios que completaron cada tutorial" />
          {top.length ? <BarsChart items={top} labelWidth={185} /> : <Empty />}
        </Card>
        <Card>
          <CardTitle title="Avance promedio por nivel" />
          {levels.length ? <ColumnChart items={levels} suffix="%" /> : <Empty />}
        </Card>
      </div>

      <Card flush>
        <CardHeader title="Estado por tutorial" meta={`${tutorials.length} ${tutorials.length === 1 ? 'registro' : 'registros'}`} />
        <DataTable columns={COLUMNS} rows={tutorials} rowKey={(t) => t.name} emptyMessage="Ningún tutorial coincide con los filtros seleccionados." />
      </Card>
    </>
  );
}
