import { useMemo, useState } from 'react';
import {
  Badge, Button, DataTable, EmptyState, FilterBar, Icon, LinkText, Pagination, RowMenu, VideoPlayer,
  type Column, type FilterField,
} from '@/ds';
import { ORDERS, SECTION, SECTION_TUTORIAL_ID, type Order } from './data';
import type { HelpCenter } from './useHelpCenter';

const FIELDS: FilterField[] = [
  { key: 'dateType', type: 'select', placeholder: 'Tipo de fecha', options: ['Creación', 'Entrega', 'Despacho'] },
  { key: 'date', type: 'date', placeholder: 'Seleccionar fecha' },
  { key: 'code', type: 'text', placeholder: 'Código de orden' },
  { key: 'client', type: 'text', placeholder: 'Nombre del contacto' },
];
const NO_FILTERS = { dateType: '', date: '', code: '', client: '' };

interface OrdersPageProps {
  hc: HelpCenter;
  empty: boolean;
  notify: (type: 'info' | 'success', title: string, text?: string) => void;
}

function OrdersEmptyState({ hc }: { hc: HelpCenter }) {
  return (
    <EmptyState
      tag={<><Icon name="document-multiple" size={16} /> {SECTION.name}</>}
      title="Aún no tienes órdenes"
      description={`${SECTION.desc} Mira el video, responde 3 preguntas y crea tu primera orden para empezar.`}
      actions={
        <>
          <Button variant="primary" icon="add" className="h-ds-7 px-ds-5">Crear primera orden</Button>
          <Button icon="document-import" className="h-ds-7 px-ds-5">Importar órdenes</Button>
        </>
      }
    >
      <div className="w-full overflow-hidden rounded-ds-xl border border-line shadow-ds-sm">
        <VideoPlayer tag={SECTION.name} duration={SECTION.videoDur} onFirstPlay={hc.markSectionSeen} embedUrl={SECTION.videoEmbed || undefined} />
      </div>
      <div className="flex w-full items-center justify-between gap-ds-3 rounded-ds-xl border border-line bg-surface-subtle px-ds-4 py-ds-4 text-left">
        <div>
          <p className="text-ds-body-s font-bold leading-ds-body text-fg">Pon a prueba lo que aprendiste</p>
          <p className="mt-ds-1 text-ds-caption leading-ds-caption text-fg-muted">3 preguntas para completar el aprendizaje de la sección.</p>
        </div>
        <Button className="shrink-0" onClick={hc.startSectionQuiz}>Probar lo aprendido</Button>
      </div>
    </EmptyState>
  );
}

export function OrdersPage({ hc, empty, notify }: OrdersPageProps) {
  const [filters, setFilters] = useState<Record<string, string>>(NO_FILTERS);
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      ORDERS.filter(
        (o) =>
          (!filters.code || o.code.toLowerCase().includes(filters.code.trim().toLowerCase())) &&
          (!filters.client || o.cliente.toLowerCase().includes(filters.client.trim().toLowerCase())),
      ),
    [filters],
  );

  const columns: Column<Order>[] = [
    { key: 'code', header: 'Órdenes', sortValue: (o) => o.code, render: (o) => <LinkText>{o.code}</LinkText> },
    { key: 'estado', header: 'Estado', sortValue: (o) => o.estado.label, render: (o) => <Badge variant={o.estado.variant}>{o.estado.label}</Badge> },
    { key: 'sub', header: 'Subestado', sortValue: (o) => o.subestado?.label ?? '', render: (o) => (o.subestado ? <Badge variant={o.subestado.variant}>{o.subestado.label}</Badge> : null) },
    { key: 'veh', header: 'Vehículo', sortValue: (o) => o.vehiculo, render: (o) => o.vehiculo },
    { key: 'cli', header: 'Cliente', sortValue: (o) => o.cliente, render: (o) => o.cliente },
    { key: 'centro', header: 'Centro de despacho', sortValue: (o) => o.centro, render: (o) => o.centro },
    { key: 'fecha', header: 'Fecha de entrega', sortValue: (o) => o.fecha, render: (o) => o.fecha },
  ];

  return (
    <div className="flex flex-col gap-ds-5 bg-canvas px-ds-6 pb-ds-4 pt-ds-5">
      <div className="flex items-start justify-between gap-ds-3">
        <div>
          <h1 className="text-ds-subtitle font-bold leading-none text-fg">Órdenes/guías</h1>
          <p className="mt-ds-1 flex items-center gap-ds-2 text-ds-body-s leading-ds-body text-fg-muted">
            Revisa el estado de las distintas órdenes y sus clientes.
            <button type="button" onClick={() => hc.openTutorial(SECTION_TUTORIAL_ID)} title="Ver tutorial de Órdenes" aria-label="Ver tutorial de Órdenes" className="inline-flex shrink-0 text-action transition-opacity hover:opacity-ds-muted">
              <Icon name="education" size={18} />
            </button>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-ds-3">
          <Button icon="download">Exportar a excel</Button>
          <Button variant="primary" icon="add">Nueva orden</Button>
        </div>
      </div>

      <section className="flex flex-col gap-ds-5 rounded-ds-lg border border-line-strong bg-surface p-ds-5">
        {empty ? (
          <OrdersEmptyState hc={hc} />
        ) : (
          <>
            <FilterBar fields={FIELDS} applied={filters} onApply={setFilters} />
            <div className="overflow-hidden rounded-ds-sm border border-line-strong">
              <DataTable
                columns={columns}
                rows={rows}
                rowKey={(o) => o.id}
                emptyMessage="Ninguna orden coincide con los filtros seleccionados."
                selection={{ selected, onChange: setSelected }}
                rowActions={(o) => (
                  <RowMenu
                    label={`Más acciones para ${o.code}`}
                    items={[
                      { label: 'Trazabilidad', onSelect: () => hc.openArticle('trazabilidad') },
                      { label: 'Ver detalle', onSelect: () => notify('info', 'Ver detalle', o.code) },
                      { label: 'Editar', onSelect: () => notify('info', 'Editar orden', o.code) },
                    ]}
                  />
                )}
              />
            </div>
          </>
        )}
      </section>

      {!empty && <Pagination page={page} pages={3} onChange={setPage} />}
    </div>
  );
}
