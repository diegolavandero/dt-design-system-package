import { useCallback, useMemo, useState } from 'react';
import { ORDER_BY_ID, ROUTE_COLORS, VEHICLES, VEHICLE_BY_ID, cheapestInsert, planRoutes, sequence } from './data';

export interface Route {
  vehicleId: string;
  orderIds: string[];
  locked: boolean;
  hidden: boolean;
  confirmed: boolean;
  /** Creada a mano con «Add new route»: se conserva aunque quede vacía. */
  added?: boolean;
}

/** Destino de una reasignación: una ruta (exista o no) o la bolsa de órdenes sin asignar. */
export type Target = { kind: 'route'; vehicleId: string; index?: number } | { kind: 'unassigned' };
export type SelSource = 'lasso' | 'manual';

export function usePlanner() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [selOrders, setSelOrders] = useState<Set<string>>(new Set());
  const [selVehicles, setSelVehicles] = useState<Set<string>>(new Set());
  const [paramId, setParamId] = useState('default');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [unassigned, setUnassigned] = useState<string[]>([]);
  const [selection, setSelection] = useState<Map<string, SelSource>>(new Map());

  /** Color estable por vehículo según su posición en la flota. */
  const colorOf = useCallback((vehicleId: string) => ROUTE_COLORS[VEHICLES.findIndex((v) => v.id === vehicleId) % ROUTE_COLORS.length], []);

  const plan = useCallback(() => {
    const r = planRoutes([...selOrders], [...selVehicles], paramId);
    setRoutes(r.routes);
    setUnassigned(r.unassigned);
    setSelection(new Map());
    setStep(3);
  }, [selOrders, selVehicles, paramId]);

  const routeOf = useCallback((orderId: string) => routes.find((r) => r.orderIds.includes(orderId)), [routes]);

  /** Mueve órdenes a una ruta (crea la ruta si el vehículo no tenía) o a «sin asignar». */
  const move = useCallback(
    (ids: string[], target: Target, optimize = false) => {
      setRoutes((prev) => {
        let next = prev.map((r) => (r.locked ? r : { ...r, orderIds: r.orderIds.filter((id) => !ids.includes(id)) }));
        const movable = ids.filter((id) => !prev.some((r) => r.locked && r.orderIds.includes(id)));
        if (target.kind === 'route') {
          const v = VEHICLE_BY_ID.get(target.vehicleId)!;
          let r = next.find((x) => x.vehicleId === target.vehicleId);
          if (!r) {
            r = { vehicleId: target.vehicleId, orderIds: [], locked: false, hidden: false, confirmed: false };
            next = [...next, r];
          }
          let seq = r.orderIds.filter((id) => !movable.includes(id));
          if (target.index !== undefined) {
            // Índice calculado sobre la lista original: se ajusta si la orden venía de esta misma ruta, antes del punto.
            const orig = prev.find((x) => x.vehicleId === target.vehicleId)?.orderIds ?? [];
            const before = orig.slice(0, target.index).filter((id) => movable.includes(id)).length;
            const at = Math.max(0, Math.min(seq.length, target.index - before));
            seq = [...seq.slice(0, at), ...movable, ...seq.slice(at)];
          } else {
            for (const id of movable) seq = cheapestInsert(v, seq, id);
          }
          if (optimize) seq = sequence(v, seq);
          next = next.map((x) => (x.vehicleId === target.vehicleId ? { ...x, orderIds: seq, confirmed: false } : x));
        }
        // Las rutas que pierden o ganan órdenes dejan de estar confirmadas; las vacías desaparecen.
        next = next.map((x) => {
          const old = prev.find((p) => p.vehicleId === x.vehicleId);
          return old && old.orderIds.join() !== x.orderIds.join() ? { ...x, confirmed: false } : x;
        });
        return next.filter((x) => x.orderIds.length > 0 || x.added);
      });
      setUnassigned((prev) => {
        const lockedIds = new Set(routes.filter((r) => r.locked).flatMap((r) => r.orderIds));
        const movable = ids.filter((id) => !lockedIds.has(id));
        const rest = prev.filter((id) => !movable.includes(id));
        return target.kind === 'unassigned' ? [...rest, ...movable.filter((id) => !rest.includes(id))] : rest;
      });
    },
    [routes],
  );

  const patchRoute = useCallback((vehicleId: string, patch: Partial<Route>) => setRoutes((rs) => rs.map((r) => (r.vehicleId === vehicleId ? { ...r, ...patch } : r))), []);
  const confirmAll = useCallback(() => setRoutes((rs) => rs.map((r) => (r.orderIds.length ? { ...r, confirmed: true } : r))), []);
  const addRoute = useCallback((vehicleId: string) => setRoutes((rs) => (rs.some((r) => r.vehicleId === vehicleId) ? rs : [...rs, { vehicleId, orderIds: [], locked: false, hidden: false, confirmed: false, added: true }])), []);
  const removeRoute = useCallback((vehicleId: string) => setRoutes((rs) => rs.filter((r) => r.vehicleId !== vehicleId || r.orderIds.length > 0)), []);

  const select = useCallback((ids: string[], source: SelSource) => setSelection((s) => {
    const n = new Map(s);
    ids.forEach((id) => n.set(id, n.get(id) === 'manual' ? 'manual' : source));
    return n;
  }), []);
  const unselect = useCallback((ids: string[]) => setSelection((s) => {
    const n = new Map(s);
    ids.forEach((id) => n.delete(id));
    return n;
  }), []);
  const clearLassoSelection = useCallback(() => setSelection((s) => new Map([...s].filter(([, src]) => src !== 'lasso'))), []);

  /** Foto del plan para «Deshacer»: las listas son inmutables, así que basta con guardar las referencias. */
  const snapshot = useCallback(() => ({ routes, unassigned, selection }), [routes, unassigned, selection]);
  const restore = useCallback((s: { routes: Route[]; unassigned: string[]; selection: Map<string, SelSource> }) => {
    setRoutes(s.routes);
    setUnassigned(s.unassigned);
    setSelection(s.selection);
  }, []);

  const restart = useCallback(() => {
    setRoutes([]);
    setUnassigned([]);
    setSelection(new Map());
    setStep(0);
  }, []);

  const planned = useMemo(() => [...routes.flatMap((r) => r.orderIds), ...unassigned], [routes, unassigned]);

  return {
    step, setStep, selOrders, setSelOrders, selVehicles, setSelVehicles, paramId, setParamId,
    routes, unassigned, selection, planned, colorOf, routeOf,
    plan, move, patchRoute, confirmAll, addRoute, removeRoute, select, unselect, clearLassoSelection, restart, snapshot, restore,
  };
}

export type Planner = ReturnType<typeof usePlanner>;
export const orderOf = (id: string) => ORDER_BY_ID.get(id)!;
