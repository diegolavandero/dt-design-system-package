// Datos simulados del prototipo Unified Routing (textos de interfaz en inglés).
// Ubicaciones aleatorias con semilla fija dentro de Santiago: el prototipo se ve igual en cada carga.

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface Order {
  id: string;
  lat: number;
  lng: number;
  customer: string;
  address: string;
  commune: string;
  type: string;
  status: string;
  statusTone: Tone;
  substatus: string;
  dc: string;
  /** Ventana horaria en minutos desde la medianoche. */
  winStart: number;
  winEnd: number;
  /** Capacidades consumidas: unidades, kg, m³. */
  cap: [number, number, number];
  amount: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  driver: string;
  originDc: string;
  destDc: string;
  cap: [number, number, number];
  /** Sin centro de distribución asignado: no se puede planificar. */
  available: boolean;
  lat: number;
  lng: number;
}

export interface Depot {
  name: string;
  lat: number;
  lng: number;
}

/* ── RNG con semilla (mulberry32) ── */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20261119);
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
const between = (a: number, b: number) => a + rand() * (b - a);
const int = (a: number, b: number) => Math.floor(between(a, b + 1));

export const DEPOTS: Depot[] = [
  { name: 'DC Quilicura', lat: -33.3605, lng: -70.7312 },
  { name: 'DC Maipú', lat: -33.5098, lng: -70.7561 },
  { name: 'DC Macul', lat: -33.4932, lng: -70.5996 },
  { name: 'DC Las Condes', lat: -33.4113, lng: -70.5662 },
];

/** Zonas residenciales de Santiago (centro y radio aproximado en grados). */
const ZONES = [
  { commune: 'Providencia', lat: -33.4275, lng: -70.6105, r: 0.012, street: ['Av. Providencia', 'Av. Nueva Providencia', 'Los Leones', 'Pedro de Valdivia'] },
  { commune: 'Las Condes', lat: -33.4120, lng: -70.5560, r: 0.018, street: ['Av. Apoquindo', 'Av. Las Condes', 'Martín de Zamora', 'Av. Kennedy'] },
  { commune: 'Ñuñoa', lat: -33.4560, lng: -70.5980, r: 0.014, street: ['Av. Irarrázaval', 'Av. Grecia', 'José Pedro Alessandri', 'Av. Los Leones'] },
  { commune: 'Recoleta', lat: -33.4060, lng: -70.6420, r: 0.012, street: ['Av. Recoleta', 'Av. Perú', 'Dominica', 'Av. El Salto'] },
  { commune: 'Independencia', lat: -33.4160, lng: -70.6620, r: 0.010, street: ['Av. Independencia', 'Av. Santos Dumont', 'Gamero', 'Maruri'] },
  { commune: 'Conchalí', lat: -33.3830, lng: -70.6740, r: 0.012, street: ['Av. Independencia', 'Av. Dorsal', 'Guanaco', 'Av. Zapadores'] },
  { commune: 'Quinta Normal', lat: -33.4300, lng: -70.6960, r: 0.010, street: ['Av. Carrascal', 'Av. Mapocho', 'Walker Martínez', 'Samuel Izquierdo'] },
  { commune: 'Maipú', lat: -33.5100, lng: -70.7560, r: 0.018, street: ['Av. Pajaritos', 'Av. 5 de Abril', 'Av. Los Pajaritos', 'Av. Esquina Blanca'] },
  { commune: 'La Florida', lat: -33.5220, lng: -70.5900, r: 0.016, street: ['Av. Vicuña Mackenna', 'Av. La Florida', 'Walker Martínez', 'Av. Departamental'] },
  { commune: 'Macul', lat: -33.4900, lng: -70.6000, r: 0.010, street: ['Av. Macul', 'Av. Quilín', 'Av. Departamental', 'Exequiel Fernández'] },
  { commune: 'Quilicura', lat: -33.3600, lng: -70.7300, r: 0.012, street: ['Av. Matta', 'Manuel Antonio Matta', 'O’Higgins', 'Av. Las Torres'] },
  { commune: 'Huechuraba', lat: -33.3700, lng: -70.6350, r: 0.010, street: ['Av. Américo Vespucio', 'Av. Pedro Fontova', 'El Carmen', 'Av. Recoleta'] },
];

const FIRST = ['Benjamín', 'Cristóbal', 'Diego', 'Felipe', 'Gabriel', 'Ignacio', 'José', 'Javier', 'Camila', 'Isabella', 'Fernanda', 'Joaquín', 'Valentina', 'Martina', 'Tomás', 'Antonia', 'Matías', 'Sofía', 'Agustín', 'Catalina', 'Vicente', 'Florencia', 'Lucas', 'Josefa'];
const LAST = ['Ahumada', 'Soto', 'Herrera', 'Díaz', 'Flores', 'Miranda', 'Vargas', 'Tapia', 'Salazar', 'Paredes', 'Alarcón', 'Torres', 'Ríos', 'Muñoz', 'Contreras', 'Rojas', 'Morales', 'Fuentes', 'Castillo', 'Pizarro', 'Navarro', 'Reyes'];

const TYPES = ['Delivery', 'Delivery', 'Delivery', 'Pickup', 'Pickup & delivery', 'Immediate delivery'];
const STATUS: { s: string; tone: Tone; sub: string }[] = [
  { s: 'Pending', tone: 'info', sub: 'Ready to route' },
  { s: 'Pending', tone: 'info', sub: 'Ready to route' },
  { s: 'Pending', tone: 'info', sub: 'Ready to route' },
  { s: 'Rescheduled', tone: 'warning', sub: 'Nobody home' },
  { s: 'Partial delivery', tone: 'warning', sub: 'Incomplete' },
  { s: 'Failed delivery', tone: 'danger', sub: 'Damaged product' },
];
const WINDOWS: [number, number][] = [[8 * 60, 11 * 60], [8 * 60 + 30, 12 * 60], [9 * 60, 13 * 60], [10 * 60, 13 * 60], [11 * 60, 14 * 60], [12 * 60, 15 * 60]];

const name = () => `${pick(FIRST)} ${pick(LAST)}`;

function makeOrder(i: number, zone: (typeof ZONES)[number], far?: { lat: number; lng: number; commune: string; street: string }): Order {
  const ang = rand() * Math.PI * 2;
  const dist = Math.sqrt(rand()) * zone.r;
  const lat = far ? far.lat + between(-0.004, 0.004) : zone.lat + Math.sin(ang) * dist;
  const lng = far ? far.lng + between(-0.004, 0.004) : zone.lng + Math.cos(ang) * dist * 1.2;
  const st = pick(STATUS);
  const win = pick(WINDOWS);
  const commune = far ? far.commune : zone.commune;
  return {
    id: String(1876540000 + i * 137 + int(1, 99)),
    lat,
    lng,
    customer: name(),
    address: `${far ? far.street : pick(zone.street)} ${int(120, 9800)}, ${commune}`,
    commune,
    type: pick(TYPES),
    status: st.s,
    statusTone: st.tone,
    substatus: st.sub,
    dc: nearestDepot(lat, lng).name,
    winStart: win[0],
    winEnd: win[1],
    cap: [int(1, 9), int(2, 24), Math.round(between(0.1, 1.6) * 10) / 10],
    amount: int(12, 140) * 1000,
  };
}

/** Órdenes alejadas: el ruteo por cercanía puede dejarlas sin asignar. */
const FAR = [
  { lat: -33.6110, lng: -70.5760, commune: 'Puente Alto', street: 'Av. Concha y Toro' },
  { lat: -33.2850, lng: -70.8770, commune: 'Lampa', street: 'Camino Lo Echevers' },
  { lat: -33.5920, lng: -70.7020, commune: 'San Bernardo', street: 'Av. Portales' },
  { lat: -33.3400, lng: -70.5150, commune: 'Lo Barnechea', street: 'Av. La Dehesa' },
];

export const ORDERS: Order[] = (() => {
  const out: Order[] = [];
  let i = 0;
  for (let k = 0; k < 36; k++) out.push(makeOrder(i++, ZONES[k % ZONES.length]));
  FAR.forEach((f) => out.push(makeOrder(i++, ZONES[0], { ...f, street: f.street })));
  return out;
})();

const PLATES = ['HKTR-21', 'JLPV-48', 'KCSD-73', 'LFRW-12', 'GZYX-36', 'PBTK-90', 'RSDH-55', 'TVWL-07', 'BDXK-64', 'FGHR-19', 'CXZM-83', 'DWPN-27'];
const DRIVERS = ['Kristen Muñoz', 'Pablo Fuentes', 'Rocío Alarcón', 'Marcelo Pinto', 'Daniela Soto', 'Andrés Cáceres', 'Valeria Rojas', 'Ignacio Bravo', 'Paula Lagos', 'Hugo Sepúlveda', 'Lorena Vidal', 'Tomás Riquelme'];

export const VEHICLES: Vehicle[] = PLATES.map((plate, k) => {
  const d = DEPOTS[k % DEPOTS.length];
  const available = k < 9;
  return {
    id: `VEH${String(k + 1).padStart(2, '0')}`,
    plate,
    driver: DRIVERS[k],
    originDc: available ? d.name : '',
    destDc: available ? DEPOTS[(k + 1) % DEPOTS.length].name : '',
    cap: k % 3 === 0 ? [60, 200, 12] : k % 3 === 1 ? [45, 160, 9] : [50, 180, 10],
    available,
    // Pequeño desfase para que los vehículos de un mismo CD no se tapen en el mapa.
    lat: d.lat + ((k % 3) - 1) * 0.0022,
    lng: d.lng + (Math.floor(k / 4) - 1) * 0.0026,
  };
});

/** Configuraciones de planificación (paso 3). */
export const PARAMETERS = [
  { id: 'default', label: 'Default configuration', maxStops: 9, radiusKm: 13, note: 'Up to 9 stops per vehicle, stops within 13 km of the vehicle’s distribution center.' },
  { id: 'dense', label: 'Dense urban routes', maxStops: 12, radiusKm: 9, note: 'Up to 12 stops per vehicle, stops within 9 km of the distribution center.' },
  { id: 'express', label: 'Express same-day', maxStops: 6, radiusKm: 15, note: 'Up to 6 stops per vehicle, stops within 15 km of the distribution center.' },
];

/** Paleta de rutas: tokens de servicio del DS (--su*) en el orden de los mockups, seguidos de tonos 7 de los primitivos para flotas grandes. */
export const ROUTE_COLORS = ['--su2', '--su3', '--su1', '--su5', '--su6', '--su4', '--su7', '--g7', '--p7', '--t7', '--r7', '--b7'] as const;

/* ── Geometría ── */
export type LatLng = { lat: number; lng: number };
export function km(a: LatLng, b: LatLng) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
export function nearestDepot(lat: number, lng: number) {
  return DEPOTS.reduce((best, d) => (km({ lat, lng }, d) < km({ lat, lng }, best) ? d : best), DEPOTS[0]);
}

export const ORDER_BY_ID = new Map(ORDERS.map((o) => [o.id, o]));
export const VEHICLE_BY_ID = new Map(VEHICLES.map((v) => [v.id, v]));

/* ── Secuenciación de una ruta: vecino más cercano + 2-opt ── */
const pathKm = (start: LatLng, ids: string[]) => {
  let d = 0;
  let prev: LatLng = start;
  for (const id of ids) {
    const o = ORDER_BY_ID.get(id)!;
    d += km(prev, o);
    prev = o;
  }
  return d;
};

export function sequence(start: LatLng, ids: string[]): string[] {
  const rest = [...ids];
  const out: string[] = [];
  let prev: LatLng = start;
  while (rest.length) {
    let bi = 0;
    rest.forEach((id, i) => {
      if (km(prev, ORDER_BY_ID.get(id)!) < km(prev, ORDER_BY_ID.get(rest[bi])!)) bi = i;
    });
    const [id] = rest.splice(bi, 1);
    out.push(id);
    prev = ORDER_BY_ID.get(id)!;
  }
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < out.length - 1; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const cand = [...out.slice(0, i), ...out.slice(i, j + 1).reverse(), ...out.slice(j + 1)];
        if (pathKm(start, cand) + 1e-9 < pathKm(start, out)) {
          out.splice(0, out.length, ...cand);
          improved = true;
        }
      }
    }
  }
  return out;
}

/** Inserción de menor costo: dónde agregar una orden en una ruta existente sin re-optimizarla. */
export function cheapestInsert(start: LatLng, ids: string[], id: string): string[] {
  let best = ids.length;
  let bestCost = Infinity;
  for (let i = 0; i <= ids.length; i++) {
    const cand = [...ids.slice(0, i), id, ...ids.slice(i)];
    const c = pathKm(start, cand);
    if (c < bestCost) {
      bestCost = c;
      best = i;
    }
  }
  return [...ids.slice(0, best), id, ...ids.slice(best)];
}

/**
 * Ruteo por cercanía: cada orden va al vehículo cuyo CD de origen está más cerca, respetando el máximo
 * de paradas y la capacidad. Las órdenes fuera del radio de todos los vehículos quedan sin asignar.
 */
export function planRoutes(orderIds: string[], vehicleIds: string[], paramId: string) {
  const p = PARAMETERS.find((x) => x.id === paramId) ?? PARAMETERS[0];
  const vehicles = vehicleIds.map((id) => VEHICLE_BY_ID.get(id)!);
  const load = new Map(vehicles.map((v) => [v.id, { n: 0, c: [0, 0, 0] as number[] }]));
  const assigned = new Map<string, string[]>(vehicles.map((v) => [v.id, []]));
  const pairs: { o: Order; v: Vehicle; d: number }[] = [];
  for (const id of orderIds) {
    const o = ORDER_BY_ID.get(id)!;
    for (const v of vehicles) pairs.push({ o, v, d: km(o, v) });
  }
  pairs.sort((a, b) => a.d - b.d);
  const done = new Set<string>();
  for (const { o, v, d } of pairs) {
    if (done.has(o.id) || d > p.radiusKm) continue;
    const l = load.get(v.id)!;
    if (l.n >= p.maxStops || o.cap.some((c, i) => l.c[i] + c > v.cap[i])) continue;
    l.n++;
    o.cap.forEach((c, i) => (l.c[i] += c));
    assigned.get(v.id)!.push(o.id);
    done.add(o.id);
  }
  const routes = vehicles
    .filter((v) => assigned.get(v.id)!.length)
    .map((v) => ({ vehicleId: v.id, orderIds: sequence(v, assigned.get(v.id)!), locked: false, hidden: false, confirmed: false }));
  const unassigned = orderIds.filter((id) => !done.has(id));
  return { routes, unassigned };
}

/* ── Métricas de ruta ── */
const SPEED_KMH = 24;
const SERVICE_MIN = 8;
const START_MIN = 8 * 60;

export interface StopTiming {
  id: string;
  arrive: number;
  leave: number;
  late: boolean;
}

export function routeStats(vehicleId: string, ids: string[]) {
  const v = VEHICLE_BY_ID.get(vehicleId)!;
  let t = START_MIN;
  let prev: LatLng = v;
  let dist = 0;
  const timings: StopTiming[] = [];
  const cap = [0, 0, 0];
  let amount = 0;
  for (const id of ids) {
    const o = ORDER_BY_ID.get(id)!;
    const d = km(prev, o);
    dist += d;
    t += (d / SPEED_KMH) * 60;
    const arrive = Math.max(t, o.winStart);
    const leave = arrive + SERVICE_MIN;
    timings.push({ id, arrive, leave, late: arrive > o.winEnd });
    t = leave;
    prev = o;
    o.cap.forEach((c, i) => (cap[i] += c));
    amount += o.amount;
  }
  return { dist, minutes: t - START_MIN, end: t, start: START_MIN, timings, cap, amount, stops: ids.length };
}

export const fmtTime = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = Math.round(m % 60);
  const ap = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, '0')}${ap}`;
};
export const fmtDuration = (m: number) => `${Math.floor(m / 60)}h ${String(Math.round(m % 60)).padStart(2, '0')}m`;
export const fmtMoney = (n: number) => `$${n.toLocaleString('en-US')}`;
export const fmtKm = (n: number) => `${n.toFixed(1)} km`;
export const fmtNum = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

/* ── Totales para los resúmenes de pasos y tarjetas ── */
type Cap3 = [number, number, number];
export const sumOrderCap = (ids: Iterable<string>): Cap3 => [...ids].reduce((a, id) => a.map((v, i) => v + ORDER_BY_ID.get(id)!.cap[i]) as Cap3, [0, 0, 0] as Cap3);
export const sumVehicleCap = (ids: Iterable<string>): Cap3 => [...ids].reduce((a, id) => a.map((v, i) => v + VEHICLE_BY_ID.get(id)!.cap[i]) as Cap3, [0, 0, 0] as Cap3);
export const sumAmount = (ids: Iterable<string>) => [...ids].reduce((a, id) => a + ORDER_BY_ID.get(id)!.amount, 0);

/** Límite de tiempo prometido por ruta. */
export const MAX_ROUTE_MIN = 12 * 60;

/** Problemas de una ruta tras una edición manual: capacidad excedida, tiempo prometido excedido y paradas fuera de ventana. */
export function routeIssues(vehicleId: string, s: ReturnType<typeof routeStats>) {
  const v = VEHICLE_BY_ID.get(vehicleId)!;
  const cap = s.cap.map((c, i) =>
    c > v.cap[i] + 1e-9 ? `Capacity ${i + 1} exceeded: this route carries ${fmtNum(c)} but ${v.plate} supports ${v.cap[i]}. Move ${fmtNum(c - v.cap[i])} out of the route or use a larger vehicle.` : null,
  );
  const time = s.minutes > MAX_ROUTE_MIN ? `Route time exceeds the promised 12h: it would take ${fmtDuration(s.minutes)}. Remove stops or split the route.` : null;
  const lateStops = s.timings.flatMap((t, i) => (t.late ? [i + 1] : []));
  const late = lateStops.length ? `${lateStops.length === 1 ? 'Stop' : 'Stops'} ${lateStops.join(', ')} ${lateStops.length === 1 ? 'arrives' : 'arrive'} after the time window closes. Reorder the stops or move them to another route.` : null;
  return { cap, time, late };
}
