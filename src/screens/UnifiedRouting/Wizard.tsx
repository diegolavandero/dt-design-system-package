import { useMemo, useState, type ReactNode } from 'react';
import { Badge, DataTable, FilterBar, cn, useToast, type Column } from '@/ds';
import { ORDERS, PARAMETERS, VEHICLES, fmtTime, type Order, type Vehicle } from './data';
import { RouteMap, type MapPin, type MapVehicle } from './RouteMap';
import { Checkbox, Hint, LabeledSelect, Pill, RtIcon, Sep } from './parts';
import type { Planner } from './usePlanner';

const STEPS = [
  { title: 'Select orders', hint: 'Choose the orders to plan. Check them in the table or click their pins on the map.' },
  { title: 'Select vehicles', hint: 'Check the vehicles that will run today’s routes. Their drivers appear on the map.' },
  { title: 'Select parameters', hint: 'Pick the planning configuration, review orders and drivers, then plan the routes.' },
];

/* ── Riel izquierdo: pasos del asistente ── */
function StepCard({ n, title, state, onClick }: { n: number; title: string; state: 'active' | 'done' | 'todo'; onClick?: () => void }) {
  const body = (
    <span className={cn('flex w-full items-center gap-ds-2 rounded-ds-lg px-ds-3 py-ds-3 text-left transition-colors', state === 'active' ? 'bg-action-soft' : 'bg-surface-subtle', state === 'done' && 'hover:bg-action-soft')}>
      {state === 'done' ? (
        <RtIcon name="checkmark-filled" size={22} color="var(--color-action)" />
      ) : (
        <span className={cn('flex h-ds-6 w-ds-6 shrink-0 items-center justify-center rounded-ds-pill text-ds-caption font-bold text-fg-inverse', state === 'active' ? 'bg-action' : 'bg-line-strong')}>{n}</span>
      )}
      <span className={cn('min-w-0 flex-1 whitespace-nowrap text-ds-body-s font-bold', state === 'todo' ? 'text-fg-subtle' : 'text-action-text')}>{title}</span>
      {state === 'active' && <RtIcon name="arrow-right" size={18} color="var(--color-fg)" />}
    </span>
  );
  if (state !== 'done') return <div aria-current={state === 'active' ? 'step' : undefined}>{body}</div>;
  return (
    <Hint text={`Go back to “${title}”. Your choices are kept.`} side="right">
      <button type="button" onClick={onClick} className="w-full">
        {body}
      </button>
    </Hint>
  );
}

function UploadBlock({ count }: { count: number }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-col items-center gap-ds-3 px-ds-2 pt-ds-6 text-center">
      <h3 className="text-ds-body-l font-bold text-fg">Upload Excel files</h3>
      <p className="text-ds-body-s text-fg-secondary">You can upload one or more Excel files at once. Imported orders appear in the table.</p>
      <Pill
        hint="Import orders from .xlsx or .csv files."
        onClick={() => {
          setBusy(true);
          setTimeout(() => {
            setBusy(false);
            toast('success', 'File imported', `${count} orders are ready to plan.`);
          }, 1400);
        }}
      >
        Upload files
      </Pill>
      <div className="mt-ds-2 w-full rounded-ds-lg border border-line bg-surface p-ds-4 text-left">
        <div className="flex items-center gap-ds-2">
          <RtIcon name="document" size={18} color="var(--color-fg-muted)" />
          <span className="min-w-0 flex-1 truncate text-ds-body-s font-semibold text-fg">orders_planning_1407.xlsx</span>
        </div>
        <div className="mt-ds-3 flex items-center justify-between text-ds-caption text-fg-secondary">
          <span>{busy ? 'Uploading orders…' : `${count} orders imported`}</span>
          <span>{busy ? '41%' : '100%'}</span>
        </div>
        <div className="mt-ds-1 h-ds-1 overflow-hidden rounded-ds-pill bg-surface-header">
          <div className={cn('h-full rounded-ds-pill bg-action transition-all duration-ds-base', busy ? 'w-2/5' : 'w-full')} />
        </div>
      </div>
    </div>
  );
}

/* ── Paso 1: órdenes ── */
const ORDER_COLUMNS: Column<Order>[] = [
  { key: 'id', header: 'Order', sortValue: (o) => o.id, render: (o) => <span className="font-semibold text-action">{o.id}</span> },
  { key: 'type', header: 'Type', sortValue: (o) => o.type, render: (o) => o.type },
  { key: 'status', header: 'Status', sortValue: (o) => o.status, render: (o) => <Badge variant={o.statusTone}>{o.status}</Badge> },
  { key: 'sub', header: 'Substatus', render: (o) => o.substatus },
  { key: 'customer', header: 'Customer', sortValue: (o) => o.customer, render: (o) => o.customer },
  { key: 'address', header: 'Address', render: (o) => <span className="block max-w-ds-popover truncate">{o.address}</span> },
  { key: 'window', header: 'Time window', render: (o) => `${fmtTime(o.winStart)} – ${fmtTime(o.winEnd)}` },
  { key: 'dc', header: 'Distribution center', sortValue: (o) => o.dc, render: (o) => o.dc },
];

const ORDER_FILTERS = [
  { key: 'q', placeholder: 'Order', type: 'text' as const },
  { key: 'date', placeholder: 'Commitment date', type: 'date' as const },
  { key: 'status', placeholder: 'Status', options: [...new Set(ORDERS.map((o) => o.status))] },
  { key: 'commune', placeholder: 'Commune', options: [...new Set(ORDERS.map((o) => o.commune))].sort() },
];

function applyOrderFilters(rows: Order[], f: Record<string, string>) {
  return rows.filter((o) => (!f.q || o.id.includes(f.q.trim()) || o.customer.toLowerCase().includes(f.q.trim().toLowerCase())) && (!f.status || o.status === f.status) && (!f.commune || o.commune === f.commune));
}

/* ── Paso 2: vehículos ── */
const VEHICLE_COLUMNS: Column<Vehicle>[] = [
  { key: 'id', header: 'Vehicle', sortValue: (v) => v.id, render: (v) => <span className={cn('font-semibold', v.available ? 'text-fg' : 'text-fg-subtle')}>{v.id}</span> },
  { key: 'plate', header: 'Plate', render: (v) => <span className={v.available ? '' : 'text-fg-subtle'}>{v.plate}</span> },
  { key: 'driver', header: 'Driver', sortValue: (v) => v.driver, render: (v) => <span className={v.available ? '' : 'text-fg-subtle'}>{v.driver}</span> },
  { key: 'origin', header: 'Origin DC', render: (v) => (v.available ? v.originDc : <span className="font-semibold text-danger-fg">No DC assigned</span>) },
  { key: 'dest', header: 'Destination DC', render: (v) => (v.available ? v.destDc : <span className="font-semibold text-danger-fg">No DC assigned</span>) },
  { key: 'cap', header: 'Capacity (units · kg · m³)', render: (v) => <span className={v.available ? 'text-fg-secondary' : 'text-fg-subtle'}>{v.cap.join(' · ')}</span> },
  { key: 'status', header: 'Status', render: (v) => (v.available ? <Badge variant="success">Available</Badge> : <Badge variant="neutral">Can’t be planned</Badge>) },
];

export function WizardHeader({ p, layout, setLayout }: { p: Planner; layout: 'split' | 'table' | 'map'; setLayout: (l: 'split' | 'table' | 'map') => void }) {
  const [open, setOpen] = useState(false);
  const canNext = p.step === 0 ? p.selOrders.size > 0 : p.step === 1 ? p.selVehicles.size > 0 : true;
  const nextHint = p.step === 0 ? (canNext ? 'Continue to vehicles.' : 'Select at least one order to continue.') : p.step === 1 ? (canNext ? 'Continue to parameters.' : 'Select at least one vehicle to continue.') : 'Create routes by matching each driver with the nearest group of orders.';
  return (
    <div className="flex items-center gap-ds-4 px-ds-6 pb-ds-4 pt-ds-5">
      <h1 className="min-w-0 flex-1 text-ds-subtitle font-bold tracking-ds-title text-fg">Route planner</h1>
      {p.step < 2 && (
        <div className="relative">
          <Pill trailing="chevron--down" onClick={() => setOpen((o) => !o)} hint="Choose how the table and map share the screen.">
            View
          </Pill>
          {open && (
            <div className="absolute right-0 top-full z-ds-menu mt-ds-2 min-w-ds-menu rounded-ds-md border border-line bg-surface py-ds-1 shadow-ds-md" role="menu">
              {(['split', 'table', 'map'] as const).map((l) => (
                <button key={l} type="button" role="menuitemradio" aria-checked={layout === l} onClick={() => { setLayout(l); setOpen(false); }} className={cn('flex h-ds-cell w-full items-center gap-ds-2 px-ds-3 text-ds-body-s hover:bg-action-soft', layout === l ? 'font-bold text-action' : 'text-fg')}>
                  <RtIcon name={l === 'map' ? 'map' : l === 'table' ? 'data-table' : 'grid'} size={16} />
                  {l === 'split' ? 'Table and map' : l === 'table' ? 'Table only' : 'Map only'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {p.step > 0 && (
        <Pill icon="arrow-left" onClick={() => p.setStep((p.step - 1) as 0 | 1)} hint="Go back one step. Your choices are kept.">
          Back
        </Pill>
      )}
      <Pill variant="primary" disabled={!canNext} onClick={() => (p.step === 2 ? p.plan() : p.setStep((p.step + 1) as 1 | 2))} hint={nextHint}>
        {p.step === 2 ? 'Plan routes' : 'Next'}
      </Pill>
    </div>
  );
}

export function Wizard({ p, layout }: { p: Planner; layout: 'split' | 'table' | 'map' }) {
  const toast = useToast();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [lasso, setLasso] = useState(false);
  const [coach, setCoach] = useState(true);
  const rows = useMemo(() => applyOrderFilters(ORDERS, filters), [filters]);
  const step = p.step as 0 | 1 | 2;

  const toggleOrder = (id: string) => {
    const n = new Set(p.selOrders);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    p.setSelOrders(n);
  };

  const orderPins: MapPin[] = useMemo(
    () =>
      ORDERS.filter((o) => step === 0 || p.selOrders.has(o.id)).map((o) => {
        const on = p.selOrders.has(o.id);
        return {
          id: o.id,
          lat: o.lat,
          lng: o.lng,
          color: on ? '--n7' : '--n4-5',
          hint: (
            <>
              <b className="block">#{o.id} · {o.customer}</b>
              <span className="block">{o.address}</span>
              {step === 0 && <span className="mt-ds-1 block font-semibold">{on ? 'Click to remove it from the plan' : 'Click to add it to the plan'}</span>}
            </>
          ),
        };
      }),
    [p.selOrders, step],
  );

  const vehiclePins: MapVehicle[] = useMemo(
    () =>
      step === 0
        ? []
        : VEHICLES.filter((v) => p.selVehicles.has(v.id)).map((v) => ({
            id: v.id,
            lat: v.lat,
            lng: v.lng,
            color: p.colorOf(v.id),
            hint: (
              <>
                <b className="block">{v.id} · {v.plate}</b>
                <span className="block">{v.driver}</span>
                <span className="block">Starts at {v.originDc}</span>
              </>
            ),
          })),
    [p.selVehicles, step, p],
  );

  const coachText = step === 0 ? 'Click a pin or check a row to add the order to the plan. Dark pins are already selected.' : step === 1 ? 'Check a vehicle in the table to place its driver on the map.' : 'Orders and drivers that will be planned. Change the parameter on the left if you need different routes.';

  const map = (
    <RouteMap
      pins={orderPins}
      vehicles={vehiclePins}
      showDepots={step > 0}
      fitKey={`w${step}`}
      onPinPress={step === 0 ? (id) => toggleOrder(id) : undefined}
      lasso={
        step === 0
          ? {
              active: lasso,
              onToggle: setLasso,
              banner: 'You’re in lasso mode. Draw around pins to add those orders to the plan.',
              onClose: (ids) => {
                if (!ids.length) return;
                p.setSelOrders(new Set([...p.selOrders, ...ids]));
                toast('info', `${ids.length} orders added to the plan`);
              },
            }
          : undefined
      }
      coach={coach ? coachText : undefined}
      onCoachClose={() => setCoach(false)}
    />
  );

  const vehiclesSel = {
    selected: p.selVehicles,
    onChange: (next: Set<string>) => {
      const blocked = [...next].filter((id) => !VEHICLES.find((v) => v.id === id)?.available);
      if (blocked.length && next.size - blocked.length <= p.selVehicles.size && blocked.some((id) => !p.selVehicles.has(id))) {
        toast('warning', `${blocked[0]} can’t be planned`, 'Assign it a distribution center in Fleet first.');
      }
      p.setSelVehicles(new Set([...next].filter((id) => !blocked.includes(id))));
    },
  };
  const available = VEHICLES.filter((v) => v.available).length;

  let content: ReactNode;
  if (step === 0) {
    content = (
      <div className="flex min-h-0 flex-1 flex-col">
        {layout !== 'map' && (
          <div className={cn('flex flex-col', layout === 'split' ? 'rt-split-table' : 'min-h-0 flex-1')}>
            <div className="px-ds-5 pb-ds-3">
              <FilterBar fields={ORDER_FILTERS} applied={filters} onApply={setFilters} />
            </div>
            <div className="scroll-hover min-h-0 flex-1 overflow-auto border-t border-line">
              <DataTable columns={ORDER_COLUMNS} rows={rows} rowKey={(o) => o.id} emptyMessage="No orders match these filters." selection={{ selected: p.selOrders, onChange: (n) => p.setSelOrders(new Set([...[...p.selOrders].filter((id) => !rows.some((r) => r.id === id)), ...n])) }} />
            </div>
          </div>
        )}
        {layout !== 'table' && <div className="min-h-0 flex-1 border-t border-line">{map}</div>}
      </div>
    );
  } else if (step === 1) {
    content = (
      <div className="flex min-h-0 flex-1 flex-col">
        {layout !== 'map' && (
          <div className={cn('flex flex-col', layout === 'split' ? 'rt-split-table' : 'min-h-0 flex-1')}>
            <div className="flex flex-wrap items-center gap-ds-3 px-ds-5 pb-ds-3 text-ds-body-s text-fg-secondary">
              <span className="text-ds-body-l font-bold text-fg">Selected vehicles ({p.selVehicles.size}/{available})</span>
              <Sep />
              <span><b className="text-fg">{available}</b> available</span>
              <Sep />
              <Hint text="Vehicles without a distribution center can’t be planned. Assign one in Fleet.">
                <span className="inline-flex items-center gap-ds-1"><b className="text-danger-fg">{VEHICLES.length - available}</b> without DC <RtIcon name="information" size={14} color="var(--color-action-text)" /></span>
              </Hint>
            </div>
            <div className="scroll-hover min-h-0 flex-1 overflow-auto border-t border-line">
              <DataTable columns={VEHICLE_COLUMNS} rows={VEHICLES} rowKey={(v) => v.id} emptyMessage="No vehicles." selection={vehiclesSel} />
            </div>
          </div>
        )}
        {layout !== 'table' && <div className="min-h-0 flex-1 border-t border-line">{map}</div>}
      </div>
    );
  } else {
    content = <div className="min-h-0 flex-1 border-t border-line">{map}</div>;
  }

  const param = PARAMETERS.find((x) => x.id === p.paramId)!;

  return (
    <div className="flex min-h-0 flex-1 border-t border-line">
      <aside className="rt-rail scroll-hover flex shrink-0 flex-col gap-ds-2 overflow-y-auto border-r border-line bg-surface p-ds-4">
        {STEPS.map((s, i) => (
          <StepCard key={s.title} n={i + 1} title={s.title} state={i === step ? 'active' : i < step ? 'done' : 'todo'} onClick={() => p.setStep(i as 0 | 1)} />
        ))}
        {step === 0 && <UploadBlock count={ORDERS.length} />}
        {step === 1 && (
          <div className="mt-ds-4 flex flex-col gap-ds-2 rounded-ds-lg border border-line p-ds-4 text-ds-body-s text-fg-secondary">
            <span className="font-bold text-fg">{p.selOrders.size} orders to plan</span>
            <span>Pick enough vehicles to cover them. The planner matches each driver with the closest orders.</span>
          </div>
        )}
        {step === 2 && (
          <div className="mt-ds-4 flex flex-col gap-ds-4">
            <h3 className="text-ds-body-l font-bold text-fg">Configuration</h3>
            <LabeledSelect label="Planning parameter" value={p.paramId} options={PARAMETERS.map((x) => ({ id: x.id, label: x.label }))} onChange={p.setParamId} hint={param.note} />
            <div className="flex flex-col gap-ds-2 rounded-ds-lg bg-surface-subtle p-ds-4 text-ds-body-s text-fg-secondary">
              <span className="flex justify-between"><span>Orders</span><b className="text-fg">{p.selOrders.size}</b></span>
              <span className="flex justify-between"><span>Vehicles</span><b className="text-fg">{p.selVehicles.size}</b></span>
              <span className="flex justify-between"><span>Max. stops per vehicle</span><b className="text-fg">{param.maxStops}</b></span>
            </div>
          </div>
        )}
      </aside>
      <section className="flex min-w-0 flex-1 flex-col bg-surface">
        <div className="flex items-center gap-ds-3 px-ds-5 pb-ds-3 pt-ds-4">
          <span className="h-ds-3 w-ds-3 shrink-0 rounded-ds-pill bg-action" aria-hidden="true" />
          <h2 className="shrink-0 text-ds-body-l font-bold text-fg">{STEPS[step].title}</h2>
          <Sep />
          <p className="min-w-0 flex-1 truncate text-ds-body-s text-fg">{STEPS[step].hint}</p>
          {step === 0 && (
            <Checkbox
              label="Select every order in the table"
              checked={rows.length > 0 && rows.every((r) => p.selOrders.has(r.id))}
              indeterminate={rows.some((r) => p.selOrders.has(r.id)) && !rows.every((r) => p.selOrders.has(r.id))}
              onChange={(on) => p.setSelOrders(on ? new Set([...p.selOrders, ...rows.map((r) => r.id)]) : new Set([...p.selOrders].filter((id) => !rows.some((r) => r.id === id))))}
            />
          )}
          {step === 0 && <span className="shrink-0 text-ds-body-s font-semibold text-fg">{p.selOrders.size} of {ORDERS.length} selected</span>}
        </div>
        {content}
      </section>
    </div>
  );
}
