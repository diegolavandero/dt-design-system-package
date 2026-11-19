import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Avatar, Badge, DataTable, FilterBar, Modal, TextField, cn, useToast, type Column } from '@/ds';
import { ORDER_BY_ID, VEHICLES, VEHICLE_BY_ID, fmtDuration, MAX_ROUTE_MIN, routeIssues, fmtKm, fmtMoney, fmtNum, fmtTime, routeStats, type Order } from './data';
import { RouteMap, type MapLine, type MapPin } from './RouteMap';
import { Bullet, Checkbox, Dot, Hint, IconAction, MenuItem, Pill, RtIcon, Sep } from './parts';
import { ViewMenu } from './ViewMenu';
import { DragProvider, useDrag, useDropZone, type DragPayload, type DropTarget } from './useDrag';
import type { Planner, Route } from './usePlanner';

type Panel = { kind: 'route'; id: string } | { kind: 'unassigned' } | { kind: 'selected' } | null;
const UNASSIGNED_COLOR = '--n5';
const PLAN = { name: 'Plan08 Macul', date: '14/07/2026', id: '456455784532' };

const order = (id: string) => ORDER_BY_ID.get(id)!;
const sumCap = (ids: string[]) => ids.reduce((a, id) => a.map((v, i) => v + order(id).cap[i]) as [number, number, number], [0, 0, 0] as [number, number, number]);

/* ─────────────── Encabezado ─────────────── */
function ConsoleHeader({ p, view, setView, onConfirm, openUnassigned }: { p: Planner; view: 'map' | 'table'; setView: (v: 'map' | 'table') => void; onConfirm: () => void; openUnassigned: () => void }) {
  const toast = useToast();
  const [name, setName] = useState(PLAN.name);
  const [editing, setEditing] = useState(false);
  const allConfirmed = p.routes.length > 0 && p.routes.every((r) => r.confirmed);
  const totals = useMemo(() => {
    const stats = p.routes.map((r) => routeStats(r.vehicleId, r.orderIds));
    const used = stats.reduce((a, s) => a.map((v, i) => v + s.cap[i]), [0, 0, 0]);
    const max = p.routes.reduce((a, r) => a.map((v, i) => v + VEHICLE_BY_ID.get(r.vehicleId)!.cap[i]), [0, 0, 0]);
    const dist = stats.reduce((a, s) => a + s.dist, 0);
    const min = stats.reduce((a, s) => a + s.minutes, 0);
    const cost = Math.round(dist * 620 + p.planned.length * 1150 - p.unassigned.length * 1150);
    return { used, max, dist, min, cost };
  }, [p.routes, p.planned.length, p.unassigned.length]);
  const fleet = VEHICLES.filter((v) => v.available).length;

  return (
    <div>
      <div className="flex items-center gap-ds-4 border-b border-line px-ds-6 pb-ds-4 pt-ds-5">
        <h1 className="shrink-0 text-ds-subtitle font-bold tracking-ds-title text-fg">Planning console</h1>
        <Sep />
        {editing ? (
          <TextField value={name} placeholder="Plan name" onChange={setName} onEnter={() => setEditing(false)} className="max-w-ds-popover flex-none" />
        ) : (
          <span className="text-ds-body-l font-bold text-fg-secondary">{name}</span>
        )}
        <span className="text-ds-body-s text-fg">{PLAN.date}</span>
        <IconAction icon={editing ? 'check' : 'edit'} label={editing ? 'Save plan name' : 'Rename plan'} onClick={() => setEditing((e) => !e)} />
        <Sep />
        <span className="text-ds-body-s text-fg">{PLAN.id}</span>
        <IconAction
          icon="copy"
          label="Copy plan ID"
          onClick={() => {
            navigator.clipboard?.writeText(PLAN.id).catch(() => undefined);
            toast('success', 'Plan ID copied');
          }}
        />
        <div className="ml-auto flex items-center gap-ds-2">
          <ViewMenu
            value={view}
            onChange={(v) => setView(v === 'table' ? 'table' : 'map')}
            hint="Switch between the map and a table of the current list."
            options={[
              { id: 'map', label: 'Map' },
              { id: 'table', label: 'Table' },
            ]}
          />
          <Pill variant="primary" disabled={allConfirmed || !p.routes.length} onClick={onConfirm} hint={allConfirmed ? 'All routes are confirmed. Edit a route to confirm it again.' : 'Confirm every route and notify the drivers.'}>
            {allConfirmed ? 'Routes confirmed' : 'Confirm routes'}
          </Pill>
        </div>
      </div>
      <div className="flex items-center gap-ds-3 border-b border-line px-ds-6 py-ds-3 text-ds-body-s text-fg">
        <span>Vehicles: {p.routes.length}/{fleet}</span>
        <Bullet />
        <span className="inline-flex items-center gap-ds-1">
          Unplanned orders:
          <Hint text="Show the orders that didn’t fit any route.">
            <button type="button" onClick={openUnassigned} className="font-semibold text-danger-fg underline">
              {p.unassigned.length}/{p.planned.length}
            </button>
          </Hint>
        </span>
        <Bullet />
        <span>Capacity 1: {fmtNum(totals.used[0])}/{totals.max[0]}</span>
        <Bullet />
        <span>Capacity 2: {fmtNum(totals.used[1])}/{totals.max[1]}</span>
        <Bullet />
        <span>Capacity 3: {fmtNum(totals.used[2])}/{totals.max[2]}</span>
        <Bullet />
        <span>Distance: {fmtKm(totals.dist)}</span>
        <Bullet />
        <span>Time: {fmtDuration(totals.min)}</span>
        <Bullet />
        <span>Total cost: {fmtMoney(totals.cost)}</span>
        <Hint text="3 planners are working on this plan.">
          <span className="ml-auto flex items-center">
            {[['Kristen Muñoz', 'var(--b7)'], ['Marcela Ortiz', 'var(--g7)'], ['Diego Lavandero', 'var(--p7)']].map(([n, c], i) => (
              <span key={n} className={cn('rounded-ds-pill ring-2 ring-surface', i > 0 && '-ml-ds-2')}>
                <Avatar name={n} color={c} size={26} />
              </span>
            ))}
            <RtIcon name="chevron--down" size={14} className="ml-ds-1" color="var(--color-fg-muted)" />
          </span>
        </Hint>
      </div>
    </div>
  );
}

/* ─────────────── Riel izquierdo ─────────────── */
function RailCard({ title, dot, children, open, onOpen, actions, drop, selected }: { title: string; dot: ReactNode; children?: ReactNode; open: boolean; onOpen: () => void; actions?: ReactNode; drop?: ReturnType<typeof useDropZone>; selected?: boolean }) {
  return (
    <div
      data-drop={drop?.['data-drop']}
      data-drop-blocked={drop?.['data-drop-blocked']}
      onClick={onOpen}
      className={cn(
        'cursor-pointer rounded-ds-lg border px-ds-4 py-ds-3 transition-colors',
        open ? 'border-action-border-soft bg-surface shadow-ds-sm' : selected ? 'border-transparent bg-action-soft hover:border-action-border-soft' : 'border-transparent bg-surface-subtle hover:border-line',
        drop?.active && !drop.over && 'border-dashed border-line-strong',
        drop?.className,
      )}
    >
      <div className="flex items-center gap-ds-2">
        {dot}
        <span className={cn('min-w-0 flex-1 truncate text-ds-body-l font-bold', selected ? 'text-action-strong' : 'text-fg')}>{title}</span>
        <span className="flex items-center gap-ds-1" onClick={(e) => e.stopPropagation()}>
          {actions}
          <IconAction icon={open ? 'arrow-left' : 'arrow-right'} label={open ? 'Close details' : 'Open details'} hint={open ? 'Close the detail panel.' : 'Open the detail panel with every order.'} onClick={onOpen} />
        </span>
      </div>
      {children && <div className="mt-ds-1 text-ds-caption leading-ds-caption text-fg">{children}</div>}
    </div>
  );
}

function RouteCard({ r, p, open, onOpen }: { r: Route; p: Planner; open: boolean; onOpen: () => void }) {
  const s = routeStats(r.vehicleId, r.orderIds);
  const v = VEHICLE_BY_ID.get(r.vehicleId)!;
  const bad = routeIssues(r.vehicleId, s);
  const drop = useDropZone(`route:${r.vehicleId}`, r.locked);
  return (
    <RailCard
      title={r.vehicleId}
      dot={<Dot color={`var(${p.colorOf(r.vehicleId)})`} />}
      open={open}
      onOpen={onOpen}
      drop={drop}
      actions={
        <>
          <IconAction icon={r.hidden ? 'view--off' : 'view'} label={r.hidden ? 'Show route' : 'Hide route'} hint={r.hidden ? 'Show this route on the map.' : 'Hide this route on the map.'} onClick={() => p.patchRoute(r.vehicleId, { hidden: !r.hidden })} />
          {r.confirmed ? (
            <Hint text="Confirmed. The driver was notified.">
              <span className="inline-flex h-ds-6 w-ds-6 items-center justify-center">
                <RtIcon name="checkmark-filled" size={18} color="var(--color-success)" />
              </span>
            </Hint>
          ) : (
            <IconAction icon={r.locked ? 'locked' : 'unlocked'} active={r.locked} label={r.locked ? 'Unlock route' : 'Lock route'} hint={r.locked ? 'Locked: its orders can’t be moved. Click to unlock.' : 'Lock the route so its orders can’t be moved by mistake.'} onClick={() => p.patchRoute(r.vehicleId, { locked: !r.locked })} />
          )}
        </>
      }
    >
      <span className="block text-fg-secondary">{v.driver}</span>
      <Items items={[<>Stops: {s.stops}</>, <Flag issue={bad.time}>Duration: {fmtDuration(s.minutes)}</Flag>]} />
      <Items items={[<Flag issue={bad.cap[0]}>Cap 1: {fmtNum(s.cap[0])}/{v.cap[0]}</Flag>, <>Dist: {fmtKm(s.dist)}</>]} />
      <span className="block">Amount: {fmtMoney(s.amount)}</span>
      {drop.over && <span className={cn('mt-ds-1 block text-ds-caption font-semibold', r.locked ? 'text-danger-fg' : 'text-action-strong')}>{r.locked ? 'Locked route — unlock it to add orders' : 'Release to add the order here'}</span>}
    </RailCard>
  );
}

function Rail({ p, panel, setPanel, showUnassigned, setShowUnassigned }: { p: Planner; panel: Panel; setPanel: (x: Panel) => void; showUnassigned: boolean; setShowUnassigned: (v: boolean) => void }) {
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const [menu, setMenu] = useState(false);
  const dropU = useDropZone('unassigned');
  const dropS = useDropZone('selected');
  const uCap = sumCap(p.unassigned);
  const sel = [...p.selection.keys()];
  const sCap = sumCap(sel);
  const shown = p.routes.filter((r) => !q || r.vehicleId.toLowerCase().includes(q.toLowerCase()) || VEHICLE_BY_ID.get(r.vehicleId)!.driver.toLowerCase().includes(q.toLowerCase()));
  const allLocked = p.routes.length > 0 && p.routes.every((r) => r.locked);
  const toggle = (x: Panel) => setPanel(panel && x && panel.kind === x.kind && (panel.kind !== 'route' || (x.kind === 'route' && panel.id === x.id)) ? null : x);

  return (
    <aside data-autoscroll className="rt-rail scroll-hover flex shrink-0 flex-col gap-ds-2 overflow-y-auto border-r border-line bg-surface p-ds-4">
      <RailCard
        title="Unassigned"
        dot={<Dot color={`var(${UNASSIGNED_COLOR})`} />}
        open={panel?.kind === 'unassigned'}
        onOpen={() => {
          toggle({ kind: 'unassigned' });
          setShowUnassigned(true);
        }}
        drop={dropU}
        actions={<IconAction icon={showUnassigned ? 'view' : 'view--off'} label={showUnassigned ? 'Hide unassigned orders' : 'Show unassigned orders'} hint={showUnassigned ? 'Hide unassigned orders on the map.' : 'Show unassigned orders on the map. Click a pin to select it.'} onClick={() => setShowUnassigned(!showUnassigned)} />}
      >
        <Items items={[<>Orders: {p.unassigned.length}</>, <>Amount: {fmtMoney(p.unassigned.reduce((a, id) => a + order(id).amount, 0))}</>]} />
        <Items items={[<>Cap 1: {fmtNum(uCap[0])}</>, <>Cap 2: {fmtNum(uCap[1])}</>, <>Cap 3: {fmtNum(uCap[2])}</>]} />
        {dropU.over && <span className="mt-ds-1 block text-ds-caption font-semibold text-action-strong">Release to unassign the order</span>}
      </RailCard>
      <RailCard title="Selected" selected dot={<Dot ring color="var(--color-action-text)" />} open={panel?.kind === 'selected'} onOpen={() => toggle({ kind: 'selected' })} drop={dropS}>
        <Items items={[<>Orders: {sel.length}</>, <>Amount: {fmtMoney(sel.reduce((a, id) => a + order(id).amount, 0))}</>]} />
        <Items items={[<>Cap 1: {fmtNum(sCap[0])}</>, <>Cap 2: {fmtNum(sCap[1])}</>, <>Cap 3: {fmtNum(sCap[2])}</>]} />
        {dropS.over && <span className="mt-ds-1 block text-ds-caption font-semibold text-action-strong">Release to add the order to Selected</span>}
      </RailCard>

      <div className="mt-ds-3 flex items-center gap-ds-1">
        <h2 className="text-ds-body-l font-bold text-fg">Routes</h2>
        <Hint text="Each route is a vehicle. Drop orders on a card to add them, or open it to reorder its stops.">
          <span className="inline-flex"><RtIcon name="information" size={16} color="var(--color-fg-muted)" /></span>
        </Hint>
        <span className="ml-auto flex items-center gap-ds-1">
          <IconAction icon="search" label="Search routes" hint="Find a route by vehicle or driver." active={searching} onClick={() => setSearching((s) => !s)} />
          <IconAction icon={allLocked ? 'locked' : 'unlocked'} label={allLocked ? 'Unlock all routes' : 'Lock all routes'} active={allLocked} onClick={() => p.routes.forEach((r) => p.patchRoute(r.vehicleId, { locked: !allLocked }))} />
          <span className="relative">
            <IconAction icon="overflow-menu-vertical" label="More options" onClick={() => setMenu((m) => !m)} />
            {menu && (
              <div role="menu" className="absolute right-0 top-full z-ds-menu mt-ds-1 min-w-ds-popover rounded-ds-md border border-line bg-surface p-ds-1 shadow-ds-md">
                <MenuItem icon="view" onClick={() => { p.routes.forEach((r) => p.patchRoute(r.vehicleId, { hidden: false })); setMenu(false); }}>Show all routes</MenuItem>
                <MenuItem icon="view--off" onClick={() => { p.routes.forEach((r) => p.patchRoute(r.vehicleId, { hidden: true })); setMenu(false); }}>Hide all routes</MenuItem>
                <MenuItem icon="undo" onClick={() => { setMenu(false); p.restart(); }}>Start a new plan</MenuItem>
              </div>
            )}
          </span>
        </span>
      </div>
      {searching && <TextField value={q} placeholder="Vehicle or driver" onChange={setQ} className="flex-none" />}
      {shown.map((r) => (
        <RouteCard key={r.vehicleId} r={r} p={p} open={panel?.kind === 'route' && panel.id === r.vehicleId} onOpen={() => toggle({ kind: 'route', id: r.vehicleId })} />
      ))}
      {!shown.length && <p className="px-ds-2 py-ds-4 text-center text-ds-body-s text-fg-muted">{p.routes.length ? 'No routes match your search.' : 'No routes yet.'}</p>}
    </aside>
  );
}

/* ─────────────── Tarjetas de orden (panel de detalle) ─────────────── */
function OrderCard({ id, idx, color, routeId, timing, checked, onCheck, locked, tag }: { id: string; idx?: number; color: string; routeId: string; timing?: { arrive: number; leave: number; late: boolean }; checked: boolean; onCheck: (v: boolean) => void; locked?: boolean; tag?: ReactNode }) {
  const o = order(id);
  const { press } = useDrag();
  const [open, setOpen] = useState(false);
  const drop = useDropZone(routeId === 'unassigned' ? `ucard:${idx}` : `card:${routeId}:${idx}`, locked);
  const insert = drop.over && !locked ? 'rt-insert-before' : '';
  const { drag } = useDrag();
  const after = drag?.key === `card:${routeId}:${idx}:after`;
  return (
    <div
      data-drop={routeId === 'unassigned' ? undefined : drop['data-drop']}
      data-drop-blocked={drop['data-drop-blocked']}
      onPointerDown={(e) => {
        if (locked || e.button !== 0 || (e.target as HTMLElement).closest('input,button')) return;
        press(e, { ids: [id], label: `#${id}`, color, from: routeId });
      }}
      className={cn('rounded-ds-lg border bg-surface p-ds-3 transition-shadow', checked ? 'border-action-border-soft bg-action-soft' : 'border-line', locked ? 'cursor-default' : 'rt-grab hover:shadow-ds-sm', drag?.payload.ids.includes(id) && 'opacity-ds-disabled', after ? 'rt-insert-after' : insert)}
    >
      <div className="flex items-center gap-ds-2">
        <Hint text={locked ? 'Unlock the route to move this order.' : 'Drag to reorder or move to another route.'}>
          <span className={cn('inline-flex shrink-0', locked ? 'text-fg-subtle' : 'text-fg-muted')}>
            <RtIcon name={locked ? 'locked' : 'draggable'} size={16} />
          </span>
        </Hint>
        {idx !== undefined && routeId !== 'unassigned' ? (
          <span className="flex h-ds-5 w-ds-5 shrink-0 items-center justify-center box-border rounded-ds-pill border-2 bg-surface text-ds-caption font-bold text-fg" style={{ borderColor: `var(${color})` }}>{idx + 1}</span>
        ) : (
          <Dot color={`var(${color})`} />
        )}
        <span className="min-w-0 flex-1 truncate text-ds-body-s text-fg"><b>{o.id}</b> {o.customer}</span>
        <button type="button" aria-label={open ? 'Collapse order' : 'Expand order'} aria-expanded={open} onClick={() => setOpen((x) => !x)} className="inline-flex shrink-0 text-fg-secondary">
          <RtIcon name="chevron--down" size={16} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      <div className="mt-ds-1 flex gap-ds-2 pl-ds-6">
        <span className="pt-ds-1"><Checkbox label={`Select order ${o.id}`} checked={checked} onChange={onCheck} /></span>
        <div className="min-w-0 flex-1 text-ds-caption leading-ds-caption text-fg-secondary">
          <span className="block truncate text-ds-body-s text-fg">{o.address}</span>
          {timing ? (
            <span className="mt-ds-1 flex flex-wrap items-center gap-ds-2">
              S: {fmtTime(timing.arrive)} <span>E: {fmtTime(timing.leave)}</span> <Bullet />
              <Hint text={timing.late ? 'Arrival falls outside the customer’s time window.' : 'Customer’s time window.'}>
                <span className={cn('underline', timing.late ? 'text-danger-fg' : 'text-action-strong')}>W: {fmtTime(o.winStart)} – {fmtTime(o.winEnd)}</span>
              </Hint>
            </span>
          ) : (
            <span className="mt-ds-1 block">W: {fmtTime(o.winStart)} – {fmtTime(o.winEnd)}</span>
          )}
          {tag && <span className="mt-ds-1 block">{tag}</span>}
          {open && (
            <span className="mt-ds-2 flex flex-wrap gap-ds-2">
              <Badge variant={o.statusTone}>{o.status}</Badge>
              <Badge variant="outline">{o.type}</Badge>
              <span>Cap: {o.cap[0]} u · {o.cap[1]} kg · {o.cap[2]} m³</span>
              <span>{fmtMoney(o.amount)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PanelShell({ dot, title, subtitle, onClose, children, drop }: { dot: ReactNode; title: string; subtitle?: string; onClose: () => void; children: ReactNode; drop?: ReturnType<typeof useDropZone> }) {
  return (
    <aside data-drop={drop?.['data-drop']} className={cn('rt-panel flex shrink-0 flex-col border-r border-line bg-surface', drop?.className)}>
      <div className="flex items-center gap-ds-2 border-b-2 border-action px-ds-4 py-ds-3">
        {dot}
        <span className="text-ds-body-l font-bold text-fg">{title}</span>
        {subtitle && <span className="min-w-0 flex-1 truncate text-ds-body-s text-fg-secondary">{subtitle}</span>}
        <button type="button" aria-label="Close panel" onClick={onClose} className="ml-auto inline-flex shrink-0 rounded-ds-sm p-ds-1 text-fg-secondary hover:bg-canvas">
          <RtIcon name="close" size={18} />
        </button>
      </div>
      {children}
    </aside>
  );
}

function Items({ items }: { items: ReactNode[] }) {
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-x-ds-1">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-ds-1 whitespace-nowrap">
          {i > 0 && <Bullet />}
          {it}
        </span>
      ))}
    </span>
  );
}

/** Valor que incumple un límite: rojo, subrayado punteado (no solo color) y tooltip rojo con la explicación. */
function Flag({ issue, children }: { issue: string | null; children: ReactNode }) {
  if (!issue) return <>{children}</>;
  return (
    <Hint tone="danger" text={issue}>
      <span tabIndex={0} className="cursor-help font-semibold text-danger-fg underline decoration-dotted underline-offset-2">
        {children}
      </span>
    </Hint>
  );
}

function Stat({ icon, children, items }: { icon: Parameters<typeof RtIcon>[0]['name']; children?: ReactNode; items?: ReactNode[] }) {
  return (
    <div className="flex items-start gap-ds-2 text-ds-caption leading-ds-caption text-fg">
      <RtIcon name={icon} size={14} className="mt-px shrink-0" color="var(--color-fg-secondary)" />
      {items ? <Items items={items} /> : <span className="min-w-0">{children}</span>}
    </div>
  );
}

function ListTools({ q, setQ, all, onAll, checkedCount, actions }: { q: string; setQ: (v: string) => void; all: boolean | 'some'; onAll: (v: boolean) => void; checkedCount: number; actions: ReactNode }) {
  return (
    <div className="flex flex-col gap-ds-3 px-ds-4 pt-ds-4">
      <div className="flex items-center gap-ds-2">
        <span className="relative min-w-0 flex-1">
          <RtIcon name="search" size={14} className="pointer-events-none absolute left-ds-3 top-1/2 -translate-y-1/2" color="var(--color-fg-muted)" />
          <TextField value={q} placeholder="Search order or customer" onChange={setQ} className="w-full pl-ds-8" />
        </span>
      </div>
      <div className="flex items-center gap-ds-2">
        <label className="flex cursor-pointer items-center gap-ds-2 whitespace-nowrap text-ds-body-s text-fg">
          <Checkbox label="Select all" checked={all === true} indeterminate={all === 'some'} onChange={onAll} />
          {checkedCount ? `${checkedCount} checked` : 'All'}
        </label>
        <span className="ml-auto flex items-center gap-ds-2">{actions}</span>
      </div>
    </div>
  );
}

function useChecked(ids: string[]) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  useEffect(() => setChecked((c) => new Set([...c].filter((id) => ids.includes(id)))), [ids]);
  const all: boolean | 'some' = checked.size && checked.size === ids.length ? true : checked.size ? 'some' : false;
  const set = (id: string, v: boolean) => setChecked((c) => {
    const n = new Set(c);
    if (v) n.add(id);
    else n.delete(id);
    return n;
  });
  return { checked, setChecked, all, set };
}

const match = (q: string) => (id: string) => !q || id.includes(q.trim()) || order(id).customer.toLowerCase().includes(q.trim().toLowerCase());

function RoutePanel({ r, p, onClose, onAssign }: { r: Route; p: Planner; onClose: () => void; onAssign: (ids: string[]) => void }) {
  const toast = useToast();
  const v = VEHICLE_BY_ID.get(r.vehicleId)!;
  const s = routeStats(r.vehicleId, r.orderIds);
  const color = p.colorOf(r.vehicleId);
  const [q, setQ] = useState('');
  const ck = useChecked(r.orderIds);
  const pickups = r.orderIds.filter((id) => order(id).type.startsWith('Pickup')).length;
  const late = s.timings.filter((t) => t.late).length;
  const bad = routeIssues(r.vehicleId, s);
  return (
    <PanelShell dot={<Dot color={`var(${color})`} />} title={r.vehicleId} subtitle={`Route ${r.vehicleId.slice(3)} · ${v.plate}`} onClose={onClose}>
      <div className="flex flex-col gap-ds-1 border-b border-line px-ds-4 py-ds-3">
        <Stat icon="route" items={[<>Orders: {s.stops}</>, <>Stops: {s.stops}</>, <>Dist.: {fmtKm(s.dist)}</>]} />
        <Stat icon="package" items={[<>Pickups: {pickups}</>, <>Deliveries: {s.stops - pickups}</>, <>{fmtMoney(s.amount)}</>]} />
        <Stat icon="location" items={[<>Origin: {v.originDc}</>, <>End: last stop</>]} />
        <Stat icon="truck" items={[0, 1, 2].map((i) => <Flag issue={bad.cap[i]}>Cap {i + 1}: {fmtNum(s.cap[i])}/{v.cap[i]}</Flag>)} />
        <Stat icon="time" items={[<>Start: {fmtTime(s.start)}</>, <>End: {fmtTime(s.end)}</>, <Flag issue={bad.time}>T: {fmtDuration(s.minutes)}/{MAX_ROUTE_MIN / 60}h</Flag>]} />
        <Stat icon="user">Driver: {v.driver}</Stat>
        {late > 0 && (
          <Stat icon="warning-filled">
            <Flag issue={bad.late}>
              {late} {late === 1 ? 'stop arrives' : 'stops arrive'} outside the time window
            </Flag>
          </Stat>
        )}
        <div className="mt-ds-1 flex justify-end">
          {r.confirmed ? (
            <Badge variant="success">Route confirmed</Badge>
          ) : (
            <Pill
              variant="primary"
              hint="Confirm this route only and notify its driver."
              onClick={() => {
                p.patchRoute(r.vehicleId, { confirmed: true });
                toast('success', `${r.vehicleId} confirmed`, `${v.driver} was notified.`);
              }}
            >
              Confirm route
            </Pill>
          )}
        </div>
      </div>
      <ListTools
        q={q}
        setQ={setQ}
        all={ck.all}
        onAll={(on) => ck.setChecked(new Set(on ? r.orderIds : []))}
        checkedCount={ck.checked.size}
        actions={
          <>
            <Pill disabled={!ck.checked.size || r.locked} onClick={() => { p.move([...ck.checked], { kind: 'unassigned' }); toast('info', `${ck.checked.size} orders unassigned`); }} hint="Remove the checked orders from this route.">
              Deselect
            </Pill>
            <Pill disabled={!ck.checked.size || r.locked} onClick={() => onAssign([...ck.checked])} hint="Move the checked orders to another vehicle.">
              Assign
            </Pill>
          </>
        }
      />
      {r.locked && <p className="mx-ds-4 mt-ds-3 rounded-ds-md bg-warning-bg px-ds-3 py-ds-2 text-ds-caption text-warning-fg">This route is locked. Unlock it in the route list to move its orders.</p>}
      <div data-autoscroll className="scroll-hover mt-ds-3 flex min-h-0 flex-1 flex-col gap-ds-2 overflow-y-auto px-ds-4 pb-ds-4">
        {r.orderIds.map((id, i) =>
          match(q)(id) ? (
            <OrderCard key={id} id={id} idx={i} color={color} routeId={r.vehicleId} timing={s.timings[i]} checked={ck.checked.has(id)} onCheck={(on) => ck.set(id, on)} locked={r.locked} />
          ) : null,
        )}
      </div>
    </PanelShell>
  );
}

function UnassignedPanel({ p, onClose, onAssign }: { p: Planner; onClose: () => void; onAssign: (ids: string[]) => void }) {
  const toast = useToast();
  const [q, setQ] = useState('');
  const ck = useChecked(p.unassigned);
  const drop = useDropZone('unassigned');
  const cap = sumCap(p.unassigned);
  return (
    <PanelShell dot={<Dot color={`var(${UNASSIGNED_COLOR})`} />} title="Unassigned orders" onClose={onClose} drop={drop}>
      <div className="flex flex-col gap-ds-2 border-b border-line px-ds-4 py-ds-4">
        <Stat icon="route" items={[<>Orders: {p.unassigned.length}</>, <>Amount: {fmtMoney(p.unassigned.reduce((a, id) => a + order(id).amount, 0))}</>]} />
        <Stat icon="truck" items={[<>Cap 1: {fmtNum(cap[0])}</>, <>Cap 2: {fmtNum(cap[1])}</>, <>Cap 3: {fmtNum(cap[2])}</>]} />
        <p className="text-ds-caption text-fg-muted">These orders didn’t fit a coherent route: they’re far from every selected vehicle or would exceed its capacity.</p>
      </div>
      <ListTools
        q={q}
        setQ={setQ}
        all={ck.all}
        onAll={(on) => ck.setChecked(new Set(on ? p.unassigned : []))}
        checkedCount={ck.checked.size}
        actions={
          <>
            <Pill disabled={!ck.checked.size} onClick={() => { p.select([...ck.checked], 'manual'); toast('info', `${ck.checked.size} orders added to Selected`); ck.setChecked(new Set()); }} hint="Keep the checked orders in the Selected list.">
              Add to selection
            </Pill>
            <Pill disabled={!ck.checked.size} onClick={() => onAssign([...ck.checked])} hint="Assign the checked orders to a vehicle.">
              Assign
            </Pill>
          </>
        }
      />
      <div data-autoscroll className="scroll-hover mt-ds-3 flex min-h-0 flex-1 flex-col gap-ds-2 overflow-y-auto px-ds-4 pb-ds-4">
        {p.unassigned.filter(match(q)).map((id) => (
          <OrderCard key={id} id={id} color={UNASSIGNED_COLOR} routeId="unassigned" checked={ck.checked.has(id)} onCheck={(on) => ck.set(id, on)} tag={p.selection.has(id) ? <span className="font-semibold text-action-strong">In your selection</span> : undefined} />
        ))}
        {!p.unassigned.length && <p className="py-ds-6 text-center text-ds-body-s text-fg-muted">Every order is on a route.</p>}
      </div>
    </PanelShell>
  );
}

function SelectedPanel({ p, onClose, onAssign }: { p: Planner; onClose: () => void; onAssign: (ids: string[]) => void }) {
  const ids = [...p.selection.keys()];
  const drop = useDropZone('selected');
  const cap = sumCap(ids);
  return (
    <PanelShell dot={<Dot ring color="var(--color-action-text)" />} title="Selected orders" onClose={onClose} drop={drop}>
      <div className="flex flex-col gap-ds-2 border-b border-line px-ds-4 py-ds-4">
        <Stat icon="route" items={[<>Orders: {ids.length}</>, <>Amount: {fmtMoney(ids.reduce((a, id) => a + order(id).amount, 0))}</>]} />
        <Stat icon="truck" items={[<>Cap 1: {fmtNum(cap[0])}</>, <>Cap 2: {fmtNum(cap[1])}</>, <>Cap 3: {fmtNum(cap[2])}</>]} />
        <p className="text-ds-caption text-fg-muted">Orders you picked with the lasso, dragged here or added from a list. They stay on their routes until you assign or deselect them.</p>
      </div>
      <div className="flex items-center justify-end gap-ds-2 px-ds-4 pt-ds-3">
        <Pill disabled={!ids.length} onClick={() => p.unselect(ids)} hint="Empty the Selected list. Orders stay where they are.">
          Clear
        </Pill>
        <Pill variant="primary" disabled={!ids.length} onClick={() => onAssign(ids)} hint="Move every selected order to one vehicle.">
          Assign
        </Pill>
      </div>
      <div data-autoscroll className="scroll-hover mt-ds-3 flex min-h-0 flex-1 flex-col gap-ds-2 overflow-y-auto px-ds-4 pb-ds-4">
        {ids.map((id) => {
          const r = p.routeOf(id);
          return (
            <OrderCard
              key={id}
              id={id}
              color={r ? p.colorOf(r.vehicleId) : UNASSIGNED_COLOR}
              routeId={r ? r.vehicleId : 'unassigned'}
              checked
              onCheck={(on) => !on && p.unselect([id])}
              locked={r?.locked}
              tag={<span>{r ? `On ${r.vehicleId} · stop ${r.orderIds.indexOf(id) + 1}` : 'Unassigned'} · {p.selection.get(id) === 'lasso' ? 'lasso selection' : 'added manually'}</span>}
            />
          );
        })}
        {!ids.length && <p className="py-ds-6 text-center text-ds-body-s text-fg-muted">Nothing selected yet. Use the lasso on the map or “Add to selection” in a list.</p>}
      </div>
    </PanelShell>
  );
}

/* ─────────────── Vista tabla ─────────────── */
interface Row extends Order {
  stop?: number;
  routeId?: string;
}
const TABLE_FILTERS = [
  { key: 'q', placeholder: 'Order', type: 'text' as const },
  { key: 'type', placeholder: 'Type', options: ['Delivery', 'Pickup', 'Pickup & delivery', 'Immediate delivery'] },
  { key: 'status', placeholder: 'Status', options: ['Pending', 'Rescheduled', 'Partial delivery', 'Failed delivery'] },
];

function TableView({ p, panel, setPanel, onAssign, onClose }: { p: Planner; panel: Panel; setPanel: (x: Panel) => void; onAssign: (ids: string[]) => void; onClose: () => void }) {
  const toast = useToast();
  const { press } = useDrag();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const route = panel?.kind === 'route' ? p.routes.find((r) => r.vehicleId === panel.id) : undefined;
  const mode: 'route' | 'selected' | 'unassigned' = route ? 'route' : panel?.kind === 'selected' ? 'selected' : 'unassigned';
  const ids = mode === 'route' ? route!.orderIds : mode === 'selected' ? [...p.selection.keys()] : p.unassigned;
  const [checked, setChecked] = useState<Set<string>>(new Set());
  useEffect(() => setChecked(new Set()), [mode, route?.vehicleId]);
  const rows: Row[] = ids
    .map((id, i) => {
      const r = p.routeOf(id);
      return { ...order(id), stop: mode === 'route' ? i + 1 : r ? r.orderIds.indexOf(id) + 1 : undefined, routeId: r?.vehicleId };
    })
    .filter((o) => (!filters.q || o.id.includes(filters.q) || o.customer.toLowerCase().includes(filters.q.toLowerCase())) && (!filters.type || o.type === filters.type) && (!filters.status || o.status === filters.status));
  const color = (o: Row) => (o.routeId ? p.colorOf(o.routeId) : UNASSIGNED_COLOR);
  const locked = !!route?.locked;

  const columns: Column<Row>[] = [
    {
      key: 'drag',
      header: '',
      render: (o) => (
        <Hint text={locked ? 'Unlock the route to move this order.' : 'Drag onto a route card to reassign.'} side="right">
          <span
            onPointerDown={(e) => !locked && press(e, { ids: [o.id], label: `#${o.id}`, color: color(o), from: o.routeId ?? 'unassigned' })}
            className={cn('inline-flex items-center gap-ds-2', locked ? 'text-fg-subtle' : 'rt-grab text-fg-muted')}
          >
            <RtIcon name={locked ? 'locked' : 'draggable'} size={16} />
            <Dot color={`var(${color(o)})`} />
          </span>
        </Hint>
      ),
    },
    ...(mode !== 'unassigned' ? [{ key: 'stop', header: mode === 'route' ? 'Stop' : 'Route', sortValue: (o: Row) => (mode === 'route' ? o.stop ?? 0 : o.routeId ?? ''), render: (o: Row) => (mode === 'route' ? o.stop : o.routeId ? `${o.routeId} · ${o.stop}` : 'Unassigned') }] : []),
    { key: 'id', header: 'Order', sortValue: (o) => o.id, render: (o) => <span className="font-semibold text-action">{o.id}</span> },
    { key: 'type', header: 'Type', sortValue: (o) => o.type, render: (o) => o.type },
    { key: 'status', header: 'Status', render: (o) => <Badge variant={o.statusTone}>{o.status}</Badge> },
    { key: 'sub', header: 'Substatus', render: (o) => o.substatus },
    { key: 'customer', header: 'Customer', sortValue: (o) => o.customer, render: (o) => o.customer },
    { key: 'address', header: 'Address', render: (o) => <span className="block max-w-ds-popover truncate">{o.address}</span> },
    { key: 'dc', header: 'Distribution center', render: (o) => o.dc },
  ];

  const title = mode === 'route' ? route!.vehicleId : mode === 'selected' ? 'Selected' : 'Unassigned';
  const desc = mode === 'route' ? `${VEHICLE_BY_ID.get(route!.vehicleId)!.driver} · ${ids.length} stops in delivery order` : mode === 'selected' ? 'Orders you picked with the lasso or from other lists' : 'Assign them to an existing route or create a new one';
  const n = checked.size;

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-surface">
      <div className="flex items-center gap-ds-3 px-ds-5 pb-ds-3 pt-ds-4">
        {mode === 'selected' ? <Dot ring color="var(--color-action-text)" /> : <Dot color={`var(${mode === 'route' ? p.colorOf(route!.vehicleId) : UNASSIGNED_COLOR})`} />}
        <h2 className="shrink-0 text-ds-body-l font-bold text-fg">{title}</h2>
        <Sep />
        <p className="min-w-0 flex-1 truncate text-ds-body-s text-fg">{desc}</p>
        {mode === 'route' && <Pill onClick={() => setPanel(null)} hint="Show the unassigned orders table.">See unassigned</Pill>}
      </div>
      <div className="px-ds-5 pb-ds-3">
        <FilterBar fields={TABLE_FILTERS} applied={filters} onApply={setFilters} />
      </div>
      <div className="scroll-hover min-h-0 flex-1 overflow-auto border-t border-line">
        <DataTable columns={columns} rows={rows} rowKey={(o) => o.id} emptyMessage={mode === 'selected' ? 'Nothing selected yet.' : mode === 'route' ? 'This route has no orders.' : 'Every order is on a route.'} selection={{ selected: checked, onChange: setChecked }} />
      </div>
      <div className="flex items-center justify-end gap-ds-2 border-t border-line px-ds-5 py-ds-3">
        <span className="mr-auto text-ds-body-s text-fg-secondary">{n ? `${n} of ${rows.length} checked` : `${rows.length} orders`}</span>
        <Pill onClick={onClose} hint="Close the table and go back to the map.">Close</Pill>
        {mode === 'route' && (
          <Pill disabled={!n || locked} onClick={() => { p.move([...checked], { kind: 'unassigned' }); toast('info', `${n} orders unassigned`); }} hint="Take the checked orders off this route. The route keeps its order.">
            Deselect
          </Pill>
        )}
        {mode !== 'selected' && (
          <Pill disabled={!n} onClick={() => { p.select([...checked], 'manual'); toast('info', `${n} orders added to Selected`); setChecked(new Set()); }} hint="Add the checked orders to the Selected list. They stay where they are.">
            Add to selection
          </Pill>
        )}
        <Pill variant="primary" disabled={!n || locked} onClick={() => onAssign([...checked])} hint={n ? 'Assign the checked orders to a vehicle.' : 'Check at least one order to assign it.'}>
          Assign
        </Pill>
      </div>
    </section>
  );
}

/* ─────────────── Modal «Assign to route» ─────────────── */
function AssignModal({ ids, p, onClose, onDone }: { ids: string[]; p: Planner; onClose: () => void; onDone: (vehicleId: string, n: number) => void }) {
  const [target, setTarget] = useState<string | null>(null);
  const [optimize, setOptimize] = useState(false);
  const groups = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const id of ids) {
      const k = p.routeOf(id)?.vehicleId ?? 'unassigned';
      m.set(k, [...(m.get(k) ?? []), id]);
    }
    return [...m.entries()];
  }, [ids, p]);
  const vehicles = useMemo(() => {
    const inPlan = p.routes.map((r) => r.vehicleId);
    const selectedNoRoute = [...p.selVehicles].filter((id) => !inPlan.includes(id));
    const rest = VEHICLES.filter((v) => v.available && !inPlan.includes(v.id) && !selectedNoRoute.includes(v.id)).map((v) => v.id);
    return [...inPlan.map((id) => ({ id, tag: 'On a route' })), ...selectedNoRoute.map((id) => ({ id, tag: 'Selected, no route' })), ...rest.map((id) => ({ id, tag: 'Not in this plan' }))];
  }, [p.routes, p.selVehicles]);

  const capCell = (used: number, max: number, add: number) => {
    const next = used + add;
    const over = next > max;
    return (
      <span className="flex flex-col">
        <span className="text-fg">{fmtNum(used)}/{max} ({Math.round((used / max) * 100)}%)</span>
        <span className={cn('font-semibold', over ? 'text-danger-fg' : 'text-success-fg')}>+{fmtNum(add)} = {fmtNum(next)}</span>
      </span>
    );
  };

  const over = useMemo(() => {
    if (!target) return [] as number[];
    const v = VEHICLE_BY_ID.get(target)!;
    const current = p.routes.find((x) => x.vehicleId === target)?.orderIds ?? [];
    const total = sumCap([...new Set([...current, ...ids])]);
    return total.map((c, i) => (c > v.cap[i] ? i + 1 : 0)).filter(Boolean);
  }, [target, ids, p.routes]);

  const th = 'border-b border-line-strong bg-surface-header px-ds-3 py-ds-2 text-left text-ds-caption font-bold text-fg';
  const td = 'border-b border-line px-ds-3 py-ds-2 align-middle text-ds-caption text-fg';

  return (
    <Modal
      open
      size="lg"
      title="Assign to route"
      onClose={onClose}
      footer={
        <>
          <label className="mr-auto flex cursor-pointer items-center gap-ds-2 text-ds-body-s text-fg">
            <Checkbox label="Optimize the route after assigning" checked={optimize} onChange={setOptimize} />
            Optimize the route after assigning
          </label>
          <Pill onClick={onClose}>Cancel</Pill>
          <Pill variant="primary" disabled={!target} hint={target ? `Move ${ids.length} orders to ${target}.` : 'Choose a vehicle first.'} onClick={() => { p.move(ids, { kind: 'route', vehicleId: target! }, optimize); onDone(target!, ids.length); }}>
            Assign
          </Pill>
        </>
      }
    >
      {over.length > 0 && (
        <p role="status" className="mb-ds-3 flex items-center gap-ds-2 rounded-ds-md bg-warning-bg px-ds-3 py-ds-2 text-ds-body-s text-warning-fg">
          <RtIcon name="warning-filled" size={16} />
          {target} would exceed capacity {over.join(' and ')}. You can still assign, but the driver may not fit every order.
        </p>
      )}
      <p className="mb-ds-3 text-ds-body-s text-fg">
        <b>SELECTED ORDERS: {ids.length}</b> <span className="text-fg-secondary">· Add them to a vehicle: one that already has a route, or one you didn’t use in this plan.</span>
      </p>
      <table className="w-full border-collapse overflow-hidden rounded-ds-md border border-line">
        <thead>
          <tr>
            <th className={th}>Origin</th>
            <th className={th}>Orders</th>
            <th className={th}>Cap. 1 total</th>
            <th className={th}>Cap. 2 total</th>
            <th className={th}>Cap. 3 total</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(([k, g]) => {
            const c = sumCap(g);
            return (
              <tr key={k}>
                <td className={td}><span className="flex flex-wrap items-center gap-x-ds-2 whitespace-nowrap"><Dot color={`var(${k === 'unassigned' ? UNASSIGNED_COLOR : p.colorOf(k)})`} />{k === 'unassigned' ? 'Unassigned' : k}</span></td>
                <td className={td}>{g.length}</td>
                <td className={td}>{fmtNum(c[0])}</td>
                <td className={td}>{fmtNum(c[1])}</td>
                <td className={td}>{fmtNum(c[2])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="rt-modal-scroll scroll-hover mt-ds-4 overflow-y-auto rounded-ds-md border border-line">
        <table className="w-full border-collapse" role="radiogroup" aria-label="Destination vehicle">
          <thead className="sticky top-0 z-ds-raised">
            <tr>
              <th className={cn(th, 'w-ds-8')} />
              <th className={th}>Vehicle</th>
              <th className={th}>Capacity 1</th>
              <th className={th}>Capacity 2</th>
              <th className={th}>Capacity 3</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(({ id, tag }) => {
              const r = p.routes.find((x) => x.vehicleId === id);
              const v = VEHICLE_BY_ID.get(id)!;
              const current = r ? r.orderIds : [];
              const incoming = ids.filter((x) => !current.includes(x));
              const used = sumCap(current);
              const add = sumCap(incoming);
              const disabled = !!r?.locked || incoming.length === 0;
              return (
                <tr key={id} onClick={() => !disabled && setTarget(id)} className={cn(disabled ? 'cursor-not-allowed opacity-ds-disabled' : 'cursor-pointer hover:bg-canvas', target === id && 'bg-action-soft')}>
                  <td className={cn(td, 'text-center')}>
                    <input type="radio" name="assign-target" aria-label={id} checked={target === id} disabled={disabled} onChange={() => setTarget(id)} className="h-ds-4 w-ds-4 cursor-pointer accent-action" />
                  </td>
                  <td className={td}>
                    <span className="flex items-center gap-ds-2 font-semibold">
                      {r ? <Dot color={`var(${p.colorOf(id)})`} /> : <Dot ring color="var(--color-line-strong)" />}
                      {id}
                    </span>
                    <span className="block text-fg-muted">{r?.locked ? 'Locked route' : incoming.length === 0 ? 'Already has these orders' : `${v.driver.split(' ')[0]} · ${tag}`}</span>
                  </td>
                  <td className={td}>{capCell(used[0], v.cap[0], add[0])}</td>
                  <td className={td}>{capCell(used[1], v.cap[1], add[1])}</td>
                  <td className={td}>{capCell(used[2], v.cap[2], add[2])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

/* ─────────────── Consola ─────────────── */
function ConsoleBody({ p }: { p: Planner }) {
  const toast = useToast();
  const { press, drag } = useDrag();
  const [panel, setPanel] = useState<Panel>(null);
  const [view, setView] = useState<'map' | 'table'>('map');
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [lasso, setLasso] = useState(false);
  const [popup, setPopup] = useState<{ ids: string[]; fresh: number; x: number; y: number } | null>(null);
  const [assign, setAssign] = useState<string[] | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [coach, setCoach] = useState(true);

  useEffect(() => {
    if (panel?.kind === 'route' && !p.routes.some((r) => r.vehicleId === panel.id)) setPanel(null);
  }, [p.routes, panel]);

  const unassignedVisible = showUnassigned || panel?.kind === 'unassigned';
  const pins: MapPin[] = useMemo(() => {
    const out: MapPin[] = [];
    if (showRoutes)
      for (const r of p.routes) {
        if (r.hidden) continue;
        const color = p.colorOf(r.vehicleId);
        r.orderIds.forEach((id, i) => {
          const o = order(id);
          out.push({
            id,
            lat: o.lat,
            lng: o.lng,
            color,
            label: i + 1,
            marked: p.selection.has(id),
            dim: panel?.kind === 'route' && panel.id !== r.vehicleId,
            draggable: !r.locked,
            hint: (
              <>
                <b className="block">#{id} · {r.vehicleId} · Stop {i + 1}</b>
                <span className="block">{o.customer} · {o.address}</span>
                <span className="mt-ds-1 block font-semibold">{r.locked ? 'Locked route · click to open it' : 'Drag onto a route or between stops · click to open the route'}</span>
              </>
            ),
          });
        });
      }
    if (unassignedVisible)
      for (const id of p.unassigned) {
        const o = order(id);
        out.push({
          id,
          lat: o.lat,
          lng: o.lng,
          color: UNASSIGNED_COLOR,
          marked: p.selection.has(id),
          draggable: true,
          hint: (
            <>
              <b className="block">#{id} · Unassigned</b>
              <span className="block">{o.customer} · {o.address}</span>
              <span className="mt-ds-1 block font-semibold">{p.selection.has(id) ? 'Click to remove from Selected' : 'Click to select · drag onto a route to assign'}</span>
            </>
          ),
        });
      }
    return out;
  }, [p.routes, p.unassigned, p.selection, unassignedVisible, showRoutes, panel, p]);

  const lines: MapLine[] = useMemo(
    () =>
      showRoutes
        ? p.routes
            .filter((r) => !r.hidden)
            .map((r) => {
              const v = VEHICLE_BY_ID.get(r.vehicleId)!;
              return { id: r.vehicleId, color: p.colorOf(r.vehicleId), points: [v, ...r.orderIds.map(order)], dim: panel?.kind === 'route' && panel.id !== r.vehicleId };
            })
        : [],
    [p.routes, showRoutes, panel, p],
  );

  const vehiclePins = useMemo(
    () =>
      p.routes
        .filter((r) => !r.hidden && showRoutes)
        .map((r) => {
          const v = VEHICLE_BY_ID.get(r.vehicleId)!;
          return { id: v.id, lat: v.lat, lng: v.lng, color: p.colorOf(v.id), hint: <><b className="block">{v.id} · {v.driver}</b><span className="block">Starts at {v.originDc}, 8:00am</span></> };
        }),
    [p.routes, showRoutes, p],
  );

  const onPinPress = (id: string, e: { clientX: number; clientY: number }) => {
    const r = p.routeOf(id);
    if (r) {
      const open = () => setPanel({ kind: 'route', id: r.vehicleId });
      if (r.locked) return open();
      press(e, { ids: [id], label: `#${id}`, color: p.colorOf(r.vehicleId), from: r.vehicleId }, open);
    } else {
      const toggle = () => (p.selection.has(id) ? p.unselect([id]) : p.select([id], 'manual'));
      press(e, { ids: [id], label: `#${id}`, color: UNASSIGNED_COLOR, from: 'unassigned' }, toggle);
    }
  };

  const exitLasso = () => {
    setLasso(false);
    setPopup(null);
    p.clearLassoSelection();
  };

  const openAssign = (ids: string[]) => {
    setPopup(null);
    setAssign(ids);
  };

  const main =
    view === 'table' ? (
      <TableView p={p} panel={panel} setPanel={setPanel} onAssign={openAssign} onClose={() => setView('map')} />
    ) : (
      <div className="min-w-0 flex-1">
        <RouteMap
          pins={pins}
          vehicles={vehiclePins}
          lines={lines}
          showDepots
          fitKey={`console-${p.routes.length > 0}`}
          onPinPress={onPinPress}
          dropHint={!!drag}
          coach={coach ? 'Drag a pin or an order card onto another route to reassign it. Click a route to see its stops in order.' : undefined}
          onCoachClose={() => setCoach(false)}
          layers={[
            { label: 'Orders on routes', on: showRoutes, toggle: () => setShowRoutes((s) => !s) },
            { label: 'Unassigned orders', on: showUnassigned, toggle: () => setShowUnassigned((s) => !s) },
          ]}
          lasso={{
            active: lasso,
            onToggle: (on) => (on ? (setLasso(true), setPopup(null)) : exitLasso()),
            banner: 'You’re in lasso mode. Click on the map and draw around the stops to select them.',
            onClose: (ids, at) => setPopup({ ids, fresh: ids.filter((id) => !p.selection.has(id)).length, ...at }),
          }}
          overlay={
            popup && (
              <div className="absolute z-ds-menu w-ds-sidebar-open rounded-ds-lg border border-line bg-surface p-ds-4 shadow-ds-lg" style={{ left: Math.max(16, popup.x - 120), top: Math.max(56, popup.y + 12) }} role="dialog" aria-label="Lasso selection">
                <div className="flex items-start gap-ds-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-ds-body-l font-bold text-fg">{popup.ids.length ? `${popup.ids.length} orders selected` : 'No orders inside the lasso'}</p>
                    <p className="text-ds-body-s text-fg-secondary">{popup.ids.length ? `(${popup.fresh} newly selected)` : 'Draw around the pins you want to select.'}</p>
                  </div>
                  <button type="button" aria-label="Close" onClick={() => setPopup(null)} className="inline-flex rounded-ds-sm p-ds-1 text-fg-secondary hover:bg-canvas">
                    <RtIcon name="close" size={16} />
                  </button>
                </div>
                {popup.ids.length > 0 && (
                  <div className="mt-ds-3 flex flex-col" role="menu">
                    <Hint block text="Choose a vehicle for these orders." side="right">
                      <MenuItem icon="truck" onClick={() => openAssign(popup.ids)}>Assign to route</MenuItem>
                    </Hint>
                    <Hint block text="Take them off their routes. The routes keep the remaining stops in order." side="right">
                      <MenuItem
                        icon="close"
                        onClick={() => {
                          p.move(popup.ids, { kind: 'unassigned' });
                          p.unselect(popup.ids);
                          toast('info', `${popup.ids.length} orders unassigned`, 'The affected routes were renumbered.');
                          setPopup(null);
                        }}
                      >
                        Deselect
                      </MenuItem>
                    </Hint>
                    <Hint block text="Keep them selected and draw another lasso. Leaving lasso mode clears saved selections." side="right">
                      <MenuItem
                        icon="checkmark-filled"
                        onClick={() => {
                          p.select(popup.ids, 'lasso');
                          setPopup(null);
                        }}
                      >
                        Save selection
                      </MenuItem>
                    </Hint>
                  </div>
                )}
              </div>
            )
          }
        />
      </div>
    );

  return (
    <>
      <ConsoleHeader
        p={p}
        view={view}
        setView={setView}
        onConfirm={() => setConfirm(true)}
        openUnassigned={() => {
          setPanel({ kind: 'unassigned' });
          setShowUnassigned(true);
        }}
      />
      <div className="flex min-h-0 flex-1">
        <Rail p={p} panel={panel} setPanel={setPanel} showUnassigned={showUnassigned} setShowUnassigned={setShowUnassigned} />
        {view === 'map' && panel?.kind === 'route' && (() => {
          const r = p.routes.find((x) => x.vehicleId === panel.id);
          return r ? <RoutePanel r={r} p={p} onClose={() => setPanel(null)} onAssign={openAssign} /> : null;
        })()}
        {view === 'map' && panel?.kind === 'unassigned' && <UnassignedPanel p={p} onClose={() => setPanel(null)} onAssign={openAssign} />}
        {view === 'map' && panel?.kind === 'selected' && <SelectedPanel p={p} onClose={() => setPanel(null)} onAssign={openAssign} />}
        {main}
      </div>

      {assign && (
        <AssignModal
          ids={assign}
          p={p}
          onClose={() => setAssign(null)}
          onDone={(vid, n) => {
            p.unselect(assign);
            setAssign(null);
            toast('success', `${n} ${n === 1 ? 'order' : 'orders'} assigned to ${vid}`, 'The route on the map was updated.');
          }}
        />
      )}
      <Modal
        open={confirm}
        title="Confirm all routes"
        onClose={() => setConfirm(false)}
        footer={
          <>
            <Pill onClick={() => setConfirm(false)}>Cancel</Pill>
            <Pill
              variant="primary"
              onClick={() => {
                p.confirmAll();
                setConfirm(false);
                toast('success', 'Routes confirmed', `${p.routes.length} drivers received a push notification.`);
              }}
            >
              Confirm
            </Pill>
          </>
        }
      >
        <p className="text-ds-body-l text-fg">Are you sure you want to confirm every route in this plan? Drivers will get a push notification saying their route is ready to start.</p>
        {p.unassigned.length > 0 && <p className="mt-ds-3 rounded-ds-md bg-warning-bg px-ds-3 py-ds-2 text-ds-body-s text-warning-fg">{p.unassigned.length} orders are still unassigned and won’t be delivered today.</p>}
      </Modal>
    </>
  );
}

export function Console({ p }: { p: Planner }) {
  const toast = useToast();
  const onDrop = (payload: DragPayload, t: DropTarget) => {
    const before = p.snapshot();
    const n = payload.ids.length;
    const what = n === 1 ? `Order ${payload.label}` : `${n} orders`;
    // Aviso con «Undo» abajo al centro (como «Deshacer envío» de Gmail): 10 s, se puede cerrar, y un movimiento nuevo reemplaza al aviso anterior.
    const notify = (title: string) =>
      toast('info', title, undefined, {
        action: {
          label: 'Undo',
          onClick: () => {
            p.restore(before);
            toast('neutral', 'Move undone', undefined, { position: 'bottom-center', replaceKey: 'undo' });
          },
        },
        duration: 10000,
        position: 'bottom-center',
        replaceKey: 'undo',
      });
    if (t.kind === 'selected') {
      if (payload.ids.every((id) => p.selection.has(id))) return;
      p.select(payload.ids, 'manual');
      notify(`${what} moved to Selected`);
      return;
    }
    if (t.kind === 'unassigned') {
      if (payload.from === 'unassigned') return;
      p.move(payload.ids, { kind: 'unassigned' });
      notify(`${what} moved to Unassigned`);
      return;
    }
    const vid = t.vehicleId;
    if (p.routes.find((r) => r.vehicleId === vid)?.locked) return;
    if (t.kind === 'slot') {
      p.move(payload.ids, { kind: 'route', vehicleId: vid, index: t.index });
      notify(payload.from === vid ? `${what} reordered in ${vid}` : `${what} moved to ${vid}`);
      return;
    }
    if (payload.from === vid) return;
    p.move(payload.ids, { kind: 'route', vehicleId: vid });
    notify(`${what} moved to ${vid}`);
  };
  return (
    <DragProvider onDrop={onDrop}>
      <div className="flex min-h-0 flex-1 flex-col bg-surface">
        <ConsoleBody p={p} />
      </div>
    </DragProvider>
  );
}
