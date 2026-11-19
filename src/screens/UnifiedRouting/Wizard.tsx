import { useMemo, useState, type ReactNode } from 'react';
import { Badge, DataTable, FilterBar, Select, cn, useToast, type Column } from '@/ds';
import { ORDERS, PARAMETERS, VEHICLES, fmtMoney, fmtNum, fmtTime, sumAmount, sumOrderCap, sumVehicleCap, type Order, type Vehicle } from './data';
import { RouteMap, type MapPin, type MapVehicle } from './RouteMap';
import { Bullet, Checkbox, Hint, Pill, RtIcon, Sep } from './parts';
import { ViewMenu } from './ViewMenu';
import type { Planner } from './usePlanner';

const STEPS = [
  { title: 'Select orders', hint: 'Choose the orders to plan. Check them in the table or click their pins on the map.' },
  { title: 'Select vehicles', hint: 'Check the vehicles that will run today’s routes. Their drivers appear on the map.' },
  { title: 'Select parameters', hint: 'Pick the planning configuration, review orders and drivers, then plan the routes.' },
];

/* ── Riel izquierdo: pasos del asistente ── */
function StepCard({ n, title, state, onClick, summary }: { n: number; title: string; state: 'active' | 'done' | 'todo'; onClick?: () => void; summary?: ReactNode }) {
  const body = (
    <span className={cn('flex w-full flex-col rounded-ds-lg px-ds-3 py-ds-3 text-left transition-colors', state === 'active' ? 'bg-action-soft' : 'bg-surface-subtle', state === 'done' && 'group-hover:bg-action-soft')}>
      <span className="flex w-full items-center gap-ds-2">
        {state === 'done' ? (
          <RtIcon name="checkmark-filled" size={24} color="var(--color-action)" />
        ) : (
          <span className={cn('flex h-ds-6 w-ds-6 shrink-0 items-center justify-center rounded-ds-pill text-ds-caption font-bold', state === 'active' ? 'bg-action text-fg-inverse' : 'bg-line-strong text-fg-secondary')}>{n}</span>
        )}
        <span className={cn('min-w-0 flex-1 whitespace-nowrap text-ds-body-s font-bold', state === 'todo' ? 'text-fg-secondary' : 'text-action-strong')}>{title}</span>
        {state === 'active' && <RtIcon name="arrow-right" size={18} color="var(--color-fg)" />}
      </span>
      {summary && <span className="mt-ds-1 block text-ds-caption leading-ds-caption text-fg">{summary}</span>}
    </span>
  );
  if (state !== 'done') return <div aria-current={state === 'active' ? 'step' : undefined}>{body}</div>;
  return (
    <Hint text={`Go back to “${title}”. Your choices are kept.`} side="right" block>
      <button type="button" onClick={onClick} className="group w-full rounded-ds-lg text-left">
        {body}
      </button>
    </Hint>
  );
}

/** Línea de resumen en caption con viñetas; un valor en rojo avisa que las órdenes superan la capacidad de los vehículos. */
function SummaryLine({ items }: { items: ReactNode[] }) {
  return (
    <span className="flex flex-wrap items-center gap-x-ds-2">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-ds-2 whitespace-nowrap">
          {i > 0 && <Bullet />}
          {it}
        </span>
      ))}
    </span>
  );
}

function CapValue({ n, used, max }: { n: number; used: number; max?: number }) {
  const over = max !== undefined && used > max;
  const text = <>Cap {n}: {fmtNum(used)}</>;
  if (!over) return text;
  return (
    <Hint text={`Warning: the selected orders need ${fmtNum(used)} of capacity ${n} but the selected vehicles carry ${fmtNum(max)}. Some orders will stay unassigned.`}>
      <span tabIndex={0} className="cursor-help font-semibold text-danger-fg underline decoration-dotted underline-offset-2">
        {text}
      </span>
    </Hint>
  );
}

function OrdersSummary({ p }: { p: Planner }) {
  const cap = sumOrderCap(p.selOrders);
  const veh = p.selVehicles.size ? sumVehicleCap(p.selVehicles) : undefined;
  return (
    <>
      <SummaryLine items={[<>Orders: {p.selOrders.size}</>, <>Amount: {fmtMoney(sumAmount(p.selOrders))}</>]} />
      <SummaryLine items={[<CapValue n={1} used={cap[0]} max={veh?.[0]} />, <CapValue n={2} used={cap[1]} max={veh?.[1]} />]} />
    </>
  );
}

function VehiclesSummary({ p }: { p: Planner }) {
  const veh = sumVehicleCap(p.selVehicles);
  const need = sumOrderCap(p.selOrders);
  const cap = (i: number) =>
    need[i] > veh[i] ? (
      <Hint text={`Warning: the selected orders need ${fmtNum(need[i])} of capacity ${i + 1} but these vehicles carry ${fmtNum(veh[i])}. Some orders will stay unassigned.`}>
        <span tabIndex={0} className="cursor-help font-semibold text-danger-fg underline decoration-dotted underline-offset-2">
          Cap {i + 1}: {fmtNum(veh[i])}
        </span>
      </Hint>
    ) : (
      <>Cap {i + 1}: {fmtNum(veh[i])}</>
    );
  return (
    <>
      <SummaryLine items={[<>Vehicles: {p.selVehicles.size}</>]} />
      <SummaryLine items={[cap(0), cap(1)]} />
    </>
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
  { key: 'id', header: 'Vehicle', sortValue: (v) => v.id, render: (v) => <span className={cn('font-semibold', v.available ? 'text-fg' : 'text-fg-secondary')}>{v.id}</span> },
  { key: 'plate', header: 'Plate', render: (v) => <span className={v.available ? '' : 'text-fg-secondary'}>{v.plate}</span> },
  { key: 'driver', header: 'Driver', sortValue: (v) => v.driver, render: (v) => <span className={v.available ? '' : 'text-fg-secondary'}>{v.driver}</span> },
  { key: 'origin', header: 'Origin DC', render: (v) => (v.available ? v.originDc : <span className="font-semibold text-danger-fg">No DC assigned</span>) },
  { key: 'dest', header: 'Destination DC', render: (v) => (v.available ? v.destDc : <span className="font-semibold text-danger-fg">No DC assigned</span>) },
  { key: 'cap', header: 'Capacity (units · kg · m³)', render: (v) => <span className={v.available ? 'text-fg-secondary' : 'text-fg-secondary'}>{v.cap.join(' · ')}</span> },
  { key: 'status', header: 'Status', render: (v) => (v.available ? <Badge variant="success">Available</Badge> : <Badge variant="neutral">Can’t be planned</Badge>) },
];

export function WizardHeader({ p, layout, setLayout }: { p: Planner; layout: 'split' | 'table' | 'map'; setLayout: (l: 'split' | 'table' | 'map') => void }) {
  const canNext = p.step === 0 ? p.selOrders.size > 0 : p.step === 1 ? p.selVehicles.size > 0 : true;
  const nextHint = p.step === 0 ? (canNext ? 'Continue to vehicles.' : 'Select at least one order to continue.') : p.step === 1 ? (canNext ? 'Continue to parameters.' : 'Select at least one vehicle to continue.') : 'Create routes by matching each driver with the nearest group of orders.';
  return (
    <div className="flex items-center gap-ds-4 px-ds-6 pb-ds-4 pt-ds-5">
      <h1 className="min-w-0 flex-1 text-ds-subtitle font-bold tracking-ds-title text-fg">Route planner</h1>
      <div className="flex items-center gap-ds-2">
        {p.step < 2 && (
          <ViewMenu
            value={layout}
            onChange={setLayout}
            hint="Choose how the table and the map share the screen."
            options={[
              { id: 'split', label: 'Table and map' },
              { id: 'table', label: 'Table' },
              { id: 'map', label: 'Map' },
            ]}
          />
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
          <StepCard
            key={s.title}
            n={i + 1}
            title={s.title}
            state={i === step ? 'active' : i < step ? 'done' : 'todo'}
            onClick={() => p.setStep(i as 0 | 1)}
            summary={i === 0 && step >= 1 ? <OrdersSummary p={p} /> : i === 1 && step >= 1 && p.selVehicles.size > 0 ? <VehiclesSummary p={p} /> : undefined}
          />
        ))}
        {step === 0 && <UploadBlock count={ORDERS.length} />}
        {step === 2 && (
          <div className="mt-ds-4 flex flex-col gap-ds-4">
            <h3 className="text-ds-body-l font-bold text-fg">Configuration</h3>
            <Select label="Planning parameter" value={p.paramId} options={PARAMETERS.map((x) => ({ value: x.id, label: x.label }))} onChange={p.setParamId} helper={param.note} />
          </div>
        )}
      </aside>
      <section className="flex min-w-0 flex-1 flex-col bg-surface">
        <div className="flex items-center gap-ds-3 px-ds-5 pb-ds-3 pt-ds-4">
          <span className="h-ds-3 w-ds-3 shrink-0 rounded-ds-pill bg-action" aria-hidden="true" />
          <h2 className="shrink-0 whitespace-nowrap text-ds-body-l font-bold text-fg">
            {STEPS[step].title}
            {step === 0 && ` (${p.selOrders.size}/${ORDERS.length})`}
            {step === 1 && ` (${p.selVehicles.size}/${available})`}
          </h2>
          <Sep />
          {step === 1 && (
            <>
              <span className="shrink-0 whitespace-nowrap text-ds-body-s text-fg"><b>{available}</b> available</span>
              <Sep />
              <Hint text="Vehicles without a distribution center can’t be planned. Assign one in Fleet.">
                <span tabIndex={0} className="inline-flex shrink-0 items-center gap-ds-1 whitespace-nowrap text-ds-body-s text-fg"><b className="text-danger-fg">{VEHICLES.length - available}</b> without DC <RtIcon name="information" size={14} color="var(--color-action-text)" /></span>
              </Hint>
              <Sep />
            </>
          )}
          <p className="min-w-0 flex-1 truncate text-ds-body-s text-fg" title={STEPS[step].hint}>{STEPS[step].hint}</p>
          {step === 0 && (
            <Checkbox
              label="Select every order in the table"
              checked={rows.length > 0 && rows.every((r) => p.selOrders.has(r.id))}
              indeterminate={rows.some((r) => p.selOrders.has(r.id)) && !rows.every((r) => p.selOrders.has(r.id))}
              onChange={(on) => p.setSelOrders(on ? new Set([...p.selOrders, ...rows.map((r) => r.id)]) : new Set([...p.selOrders].filter((id) => !rows.some((r) => r.id === id))))}
            />
          )}
        </div>
        {content}
      </section>
    </div>
  );
}
