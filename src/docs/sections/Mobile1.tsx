import { Fragment, type ReactNode } from 'react';
import { SectionHeader } from '../ui';
import { cn } from '@/ds/lib/cn';
import {
  MIcon as I, LOGO_DESKTOP, MPhone, MStage, MLabel, MWrap, MSheet, MComponentCard, MRules, MBadge, MBtn, MInput, MStepper, MPin, MMeta, MCustomFieldChip,
  MOrderCard, MRouteCard, MMapBg, MMapPin, MReqRow, MBanner, MStatusSelector, MTopAppBar, MDateNav, MPickupSelect,
} from './mobile/kit';

/* eslint-disable @typescript-eslint/no-explicit-any */
type D = any;
const W = ({ label, w = 300, children }: { label: string; w?: number; children: ReactNode }) => <MWrap label={label} w={w}>{children}</MWrap>;
const Box = ({ children, className }: { children: ReactNode; className?: string }) => <div className={cn('rounded-xl border border-n-3 bg-white p-4', className)}>{children}</div>;

/* ───────────── Overview ───────────── */
export function MOverview({ data, onNavigate }: { data: D; onNavigate?: (id: string) => void }) {
  const th = 'bg-n-1 px-3 py-2 text-left text-[11px] font-bold leading-[normal] tracking-[.05em] text-n-5';
  return (
    <>
      <SectionHeader data={data} />
      <MLabel>Principios</MLabel>
      <div className="mb-2.5 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
        {(data.principles || []).map((p: D, i: number) => <div key={i} className="rounded-lg border border-n-3 bg-white p-4"><div className="mb-[5px] text-[13px] font-bold leading-[normal] text-n-7">{p.title}</div><div className="text-xs leading-[1.6] text-n-5">{p.desc}</div></div>)}
      </div>
      <MLabel>Tokens — uso en móvil</MLabel>
      <div className="mb-2.5 overflow-hidden rounded-lg border border-n-3">
        <table className="w-full border-collapse bg-white"><tbody>
          <tr><th className={th}>USO</th><th className={th}>TOKEN</th><th className={th}>VALOR</th></tr>
          {(data.tokens || []).map((t: D, i: number) => (
            <tr key={i}>
              <td className="border-b border-n-2 px-3 py-2.5 text-xs leading-[normal] text-n-7">{t.use}</td>
              <td className="border-b border-n-2 px-3 py-2.5 text-xs font-medium leading-[normal] text-b-7">{t.token}</td>
              <td className="border-b border-n-2 px-3 py-2.5"><span className="inline-flex items-center gap-[7px] text-xs leading-[normal] text-n-6"><span className="h-3.5 w-3.5 rounded-[4px] border border-n-3" style={{ background: t.value }} />{t.value}</span></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <MLabel>Plataformas</MLabel>
      <div className="mb-2.5 flex flex-wrap gap-3">
        {(data.platformNotes || []).map((p: D, i: number) => <div key={i} className="min-w-[260px] flex-1 rounded-lg border border-n-3 bg-white p-4"><div className="mb-[5px] text-[13px] font-bold leading-[normal] text-n-7">{p.platform}</div><div className="text-xs leading-[1.6] text-n-5">{p.notes}</div></div>)}
      </div>
      <MLabel>Secciones del DS móvil</MLabel>
      <div className="mb-6 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        {(data.sections || []).map((s: D, i: number) => (
          <a key={i} href={`#${s.id}`} onClick={(e) => { e.preventDefault(); onNavigate?.(s.id); }} className="block rounded-lg border border-n-3 bg-white px-4 py-3.5 no-underline transition-colors hover:border-b-6">
            <div className="mb-[3px] text-[13px] font-bold leading-[normal] text-b-7">{s.label}</div>
            <div className="text-xs leading-normal text-n-5">{s.desc}</div>
          </a>
        ))}
      </div>
    </>
  );
}

/* ───────────── Topbar ───────────── */
export function MTopbar({ data }: { data: D }) {
  const c = data.components || {};
  const body = (extra?: ReactNode) => <MPhone width={300}><MTopAppBar />{extra}<div className="h-[120px]" /></MPhone>;
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.appBar?.name} tag="NEW" specs={c.appBar?.specs} notes="El app bar vive solo en el Home de rutas y pantallas de primer nivel. Dentro de una ruta, el header del bottom sheet toma su lugar."
        preview={<MStage>
          <div><MLabel>Base</MLabel>{body()}</div>
          <div><MLabel>Con navegador de fecha</MLabel>{body(<MDateNav label="Rutas de hoy 01-01-24" />)}</div>
          <div><MLabel>Con punto de retiro</MLabel>{body(<><MPickupSelect label="Selecciona tu punto de retiro" /><MDateNav label="Rutas de hoy 01-01-24" /></>)}</div>
        </MStage>} />
      <MComponentCard name={c.dateNav?.name} tag="NEW" specs={c.dateNav?.specs} notes="Navega entre días de operación. El label siempre indica el contexto: «Rutas de hoy» + fecha corta."
        preview={<MStage><div className="w-[300px] bg-n-1"><MDateNav label="Rutas de hoy 01-01-24" /></div></MStage>} />
      <MComponentCard name={c.pickupSelect?.name} tag="EXTENDED" specs={c.pickupSelect?.specs} notes="Variante móvil del dropdown del DS (dt-drop-wrap). Aparece solo en cuentas con múltiples puntos de retiro."
        preview={<MStage><div className="w-[300px] bg-n-1 pb-3"><MPickupSelect label="Selecciona tu punto de retiro" /></div></MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Nav (drawer) ───────────── */
const NAV_ICONS: Record<string, string> = {
  'Agregar ruta': 'add', 'Crear ruta': 'add', 'Agregar orden': 'add', 'Sincronizar datos': 'refresh', 'Historial de recaudo': 'receipt',
  'Historial de rutas por recepcionar': 'return', 'Chat supervisor': 'message', 'Llamada de emergencia': 'phone', 'Solicitudes co-piloto': 'group', 'Configuración': 'settings',
};
function Drawer({ groups, cta, expanded }: { groups: string[][]; cta: string; expanded?: boolean }) {
  return (
    <MPhone width={340}>
      <div className="flex h-[640px] bg-[rgba(19,32,69,.45)]">
        <div className="flex w-[76.94%] flex-col bg-white">
          <div className="border-b border-n-2 px-4 pb-4 pt-6">
            <img src={LOGO_DESKTOP} height={18} alt="DispatchTrack LastMile" className="mb-[21px] h-[18px] w-auto" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-b-1 text-[13px] font-bold leading-[normal] text-b-7">DT</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-bold leading-[normal] text-n-7">Diego Tapia – Wal…</div>
                <div className="text-xs leading-[normal] text-n-5">Código de negocio · 1234</div>
              </div>
              <I n={expanded ? 'chevron--down' : 'chevron--right'} s={16} c="var(--n5)" />
            </div>
            {expanded && (
              <div className="mt-2.5 border-t border-n-2">
                {['Perfil de usuario', 'Cambiar usuario'].map((l) => <div key={l} className="flex h-11 cursor-pointer items-center justify-between text-[14px] leading-[normal] text-n-7">{l}<I n="chevron--right" s={14} c="var(--n5)" /></div>)}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden py-1">
            {groups.map((g, gi) => (
              <div key={gi}>
                {g.map((l) => (
                  <div key={l} className="flex h-12 cursor-pointer items-center gap-3 px-4 hover:bg-n-1">
                    <I n={NAV_ICONS[l] || 'document'} s={20} c="var(--n6)" />
                    <span className="text-[14px] leading-[normal] text-n-7">{l}</span>
                    {l === 'Solicitudes co-piloto' && <span className="h-2 w-2 rounded-full bg-r-6" />}
                  </div>
                ))}
                <div className="my-2 h-px bg-n-2" />
              </div>
            ))}
          </div>
          <div className="px-4 pb-6 pt-4"><button className="h-10 w-full cursor-pointer rounded-full border border-b-6 bg-white text-[14px] font-bold leading-[normal] text-b-6">{cta}</button></div>
        </div>
        <div className="flex-1" />
      </div>
    </MPhone>
  );
}
export function MNav({ data }: { data: D }) {
  const c = data.components || {}; const menus = data.menus || {};
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.drawer?.name} tag="NEW" specs={c.drawer?.specs} notes="Los iconos son IBM Carbon 20px. El orden de los ítems es fijo y está definido por producto — no se reordena por cuenta."
        preview={<MStage>
          <div><MLabel>Sin ruta iniciada</MLabel><Drawer groups={menus.noRoute || []} cta="Cerrar sesión" /></div>
          <div><MLabel>Con ruta activa</MLabel><Drawer groups={menus.onRoute || []} cta="Finalizar ruta" /></div>
          <div><MLabel>Perfil expandido</MLabel><Drawer groups={(menus.onRoute || []).slice(0, 2)} cta="Finalizar ruta" expanded /></div>
        </MStage>} />
      <MComponentCard name={c.profile?.name} tag="NEW" specs={c.profile?.specs} notes="El bloque de perfil soporta multi-cuenta: al expandir se accede a «Perfil de usuario» y «Cambiar usuario» (lista de empresas con logo y código de negocio)." />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Buttons ───────────── */
export function MButtons({ data }: { data: D }) {
  const c = data.components || {};
  const V = [['primary', 'Primario'], ['outline', 'Secundario'], ['ghost', 'Ghost'], ['danger', 'Danger']] as const;
  const S = [['default', 'Default'], ['pressed', 'Pressed'], ['disabled', 'Disabled']] as const;
  const circle = (cls: string, icon: string, color: string, dis?: boolean) => <button className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full', dis ? 'cursor-not-allowed' : 'cursor-pointer', cls)}><I n={icon} s={20} c={color} /></button>;
  const chip = (icon: string, label: string) => <button className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-n-3 bg-white px-3 text-xs font-medium leading-[normal] text-b-6"><I n={icon} s={14} c="var(--b6)" />{label}</button>;
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.button?.name} tag="EXTENDED" specs={c.button?.specs} notes="Misma forma pill y tokens del botón de escritorio, con alto 40dp para target táctil móvil. El estado pressed reemplaza al hover."
        preview={
          <div className="mb-3.5 grid max-w-[560px] grid-cols-[90px_repeat(3,1fr)] items-center gap-2.5 rounded-lg border border-n-3 bg-white p-4">
            <span />{S.map((s) => <span key={s[0]} className="text-center text-[10px] font-bold leading-[normal] tracking-[.06em] text-n-5">{s[1].toUpperCase()}</span>)}
            {V.map((v) => (<Fragment key={v[0]}>
              <span className="text-xs font-semibold leading-[normal] text-n-7">{v[1]}</span>
              {S.map((s) => <div key={v[0] + s[0]} className="text-center"><MBtn label="Cancelar" variant={v[0]} state={s[0]} /></div>)}
            </Fragment>))}
          </div>} />
      <MComponentCard name={c.pair?.name} tag="NEW" specs={c.pair?.specs}
        preview={<MStage><div className="w-[300px]">
          <MLabel>Full width — CTA de pantalla</MLabel><Box><MBtn label="Iniciar ruta" className="w-full" /></Box>
          <MLabel>Par de acciones</MLabel><Box className="flex gap-3"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Confirmar" className="flex-1" /></Box>
          <MLabel>Par con primario deshabilitado (formulario incompleto)</MLabel><Box className="flex gap-3"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Confirmar" state="disabled" className="flex-1" /></Box>
        </div></MStage>} />
      <MComponentCard name={c.iconButton?.name} tag="NEW" specs={c.iconButton?.specs} notes="De izquierda a derecha: primario relleno, outline, ghost con sombra (sobre mapa), danger y disabled."
        preview={<MStage align="center">
          {circle('bg-b-6 border-0', 'planner-route', '#fff')}
          {circle('bg-white border border-b-6', 'planner-route', 'var(--b6)')}
          {circle('bg-white border-0 shadow-[0_1px_4px_rgba(19,32,69,.18)]', 'location', 'var(--n6)')}
          {circle('bg-r-6 border-0', 'close-filled', '#fff')}
          {circle('bg-n-3 border-0', 'planner-route', 'var(--n4)', true)}
        </MStage>} />
      <MComponentCard name={c.quickChip?.name} tag="NEW" specs={c.quickChip?.specs} notes="Viven bajo la información de entrega en el detalle de orden. Disparan acciones de un toque sin abrir formularios."
        preview={<MStage align="center">{chip('phone', 'Llamar')}{chip('location', 'Llegando')}{chip('time', 'Atrasado')}</MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Cards ───────────── */
const ADDR = 'Martín de Zamora 5760, 7560969, Las Condes, Región Metropolitana';
const ORD = 'Orden #3829183901234564';
function ItemCard({ check }: { check: boolean | null }) {
  const has = check !== null;
  return (
    <div className="rounded-lg border border-n-3 bg-white p-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="text-[13px] font-bold leading-[1.3] text-n-7">ZAPATILLAS HOOPS 3.0 LOW CLASSIC VINTAGE</div>
        {has ? (check ? <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] bg-b-6"><I n="check" s={12} c="#fff" /></span> : <span className="h-[18px] w-[18px] shrink-0 rounded-[4px] border-[1.5px] border-n-4 bg-white" />) : <I n="edit" s={16} c="var(--b6)" />}
      </div>
      <div className="my-1 text-xs leading-[normal] text-n-5">SKU: 9AS-345345 -234234</div>
      <div className="flex items-end justify-between gap-2.5">
        <span className="text-xs font-medium leading-[normal] text-n-6">Cantidad <b className="text-n-7">12</b>&nbsp;&nbsp;Entregado <b className="text-n-7">12</b></span>
        {has && <I n="edit" s={16} c="var(--b6)" />}
      </div>
    </div>
  );
}
function CollectRow({ id, amount, positive }: { id: string; amount: string; positive?: boolean }) {
  return (
    <div className="mb-2 rounded-lg border border-n-3 bg-white p-3">
      <div className="text-xs font-medium leading-[normal] text-n-7">{id}</div>
      <div className={cn('my-1 text-[14px] font-bold leading-[normal]', positive ? 'text-g-6' : 'text-r-6')}>$ {positive ? '+' : '−'} {amount} clp</div>
      <div className="inline-flex items-center gap-1 text-xs leading-[normal] text-n-5"><I n="calendar" s={14} c="var(--n5)" />2026-10-24 · 17:00</div>
    </div>
  );
}
export function MCards({ data }: { data: D }) {
  const c = data.components || {};
  const w = (label: string, node: ReactNode) => <W label={label} w={320}>{node}</W>;
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.orderCard?.name} tag="NEW" specs={c.orderCard?.specs} notes="Unidad base de la operación. El pin refleja la parada; el icono de estado solo aparece en órdenes ya gestionadas. La selección usa checkbox + borde azul."
        preview={<>
          <MStage>
            {w('Orden actual (pin azul)', <MOrderCard num={1} addr={ADDR} order={ORD} person="Raúl Ríos" time="8:00 – 9:00" items={3} />)}
            {w('Otra orden (pin borde azul)', <MOrderCard num={2} pin="outline" addr={ADDR} order={ORD} person="Ana López" time="9:00 – 9:30" items={1} />)}
            {w('Seleccionada', <MOrderCard num={3} pin="outline" addr={ADDR} order={ORD} person="Ana Álvarez" time="8:00 – 17:00" items={3} selected />)}
            {w('Sin georeferencia (error)', <MOrderCard addr="Lux 45, Las Condes, Región Metropolitana" order={ORD} state="error" />)}
          </MStage>
          <MStage>{w('Lista de órdenes (gap 8 · 1 actual + otras)', <div className="flex flex-col gap-2">
            <MOrderCard num={1} addr={ADDR} order={ORD} person="Raúl Ríos" time="8:00 – 9:00" items={3} />
            <MOrderCard num={2} pin="outline" addr="Av. Las Condes 8977 Casa A, Las Condes, Región Metropolitana" order="Orden #3829183901840564" person="Ana López" time="9:00 – 9:30" items={1} />
            <MOrderCard num={3} pin="outline" addr={ADDR} order="Orden #3829183901471454571" person="Pedro Gómez" time="9:00 – 10:00" items={3} />
          </div>)}</MStage>
          <MStage>
            {w('Terminada · Entregado', <MOrderCard state="delivered" addr={ADDR} order={ORD} person="Ana Álvarez" time="8:00 – 17:00" items={3} />)}
            {w('Terminada · Parcial', <MOrderCard state="partial" addr={ADDR} order={ORD} person="Pedro Pérez" time="8:00 – 17:00" items={10} />)}
            {w('Terminada · No entregado', <MOrderCard state="failed" addr={ADDR} order={ORD} person="Pedro Pérez" time="8:00 – 17:00" items={10} />)}
          </MStage>
        </>} />
      <MComponentCard name={c.routeCard?.name} tag="NEW" specs={c.routeCard?.specs}
        preview={<MStage>
          {w('Con CTA Iniciar', <MRouteCard title="332131491204912" cta />)}
          {w('Nombre asignado', <MRouteCard title="Sector oriente 2040 mañana" cta />)}
          {w('Sin iniciar (deshabilitada)', <MRouteCard title="332131491204912" muted />)}
        </MStage>} />
      <MComponentCard name={c.itemCard?.name} tag="NEW" specs={c.itemCard?.specs}
        preview={<MStage>{w('Con editar', <ItemCard check={null} />)}{w('Seleccionada (escaneo)', <ItemCard check />)}</MStage>} />
      <MComponentCard name={c.collectCard?.name} tag="NEW" specs={c.collectCard?.specs}
        preview={<MStage>{w('Historial de recaudo', <><CollectRow id="1. #2453453452345343…" amount="40.000" positive /><CollectRow id="2. #3453453452345343…" amount="19.000" /></>)}</MStage>} />
      <MComponentCard name={c.groupCard?.name} tag="NEW" specs={c.groupCard?.specs}
        preview={<MStage>{w('Agrupación', (
          <div className="overflow-hidden rounded-lg border border-n-3 bg-white">
            <div className="bg-b-1 px-3 py-1.5 text-xs font-bold leading-[normal] text-n-7">4 órdenes</div>
            <div className="p-3">
              <div className="mb-1.5 text-[13px] font-bold leading-[normal] text-n-7">Categoría A</div>
              <div className="mb-2 flex flex-wrap gap-2"><MCustomFieldChip /><MCustomFieldChip label="Otro campo" /></div>
              <div className="flex items-center justify-between"><MMeta icon="user" text="Raúl Ríos, Marta Morales, Camilo C…" /><MMeta icon="package" text="22" /></div>
            </div>
          </div>))}</MStage>} />
      <MComponentCard name={c.serviceUnit?.name} tag="NEW" specs={c.serviceUnit?.specs}
        preview={<MStage>{w('Service unit', (
          <div className="overflow-hidden rounded-lg border border-n-3 bg-white">
            <div className="p-3">
              <div className="mb-2 text-[14px] font-bold leading-[normal] text-n-7">Service Unit 1</div>
              <div className="flex flex-col gap-[5px]">
                <MMeta icon="location" text="245 Cooper Square, New York, NY, 1…" />
                <div className="flex gap-2.5"><MMeta icon="truck" text="VEH 123" /><MMeta icon="location" text="3 stops" /><MMeta icon="package" text="12 orders" /></div>
                <MMeta icon="time" text="8:00 – 17:00" />
              </div>
            </div>
            <div className="box-border inline-flex w-full items-center gap-[5px] border-t border-n-2 bg-n-1 px-3 py-2 text-xs font-medium leading-[normal] text-n-6"><I n="time" s={14} c="var(--n6)" />Scheduled Departure 9:00 AM</div>
          </div>))}</MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Maps ───────────── */
const PinCap = ({ children, pin }: { children: ReactNode; pin: ReactNode }) => <div className="text-center">{pin}<div className="mt-1.5 text-[11px] leading-[normal] text-n-5">{children}</div></div>;
const Fab = ({ bg, icon, color }: { bg: string; icon: string; color: string }) => <span className="flex h-11 w-11 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(19,32,69,.2)]" style={{ background: bg }}><I n={icon} s={20} c={color} /></span>;
export function MMaps({ data }: { data: D }) {
  const c = data.components || {};
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.pins?.name} tag="NEW" specs={c.pins?.specs} notes="El color del pin es semántico, igual que en las cards: azul activo, gris inactivo, naranja en gestión, verde/amber/rojo según resultado."
        preview={<MStage col>
          <div className="flex items-end gap-[18px]">
            <PinCap pin={<MMapPin label="3" />}>Numerado</PinCap>
            <PinCap pin={<MMapPin label="1" selected />}>Seleccionado</PinCap>
            <PinCap pin={<MMapPin label="5" bg="var(--n4)" />}>Inactivo</PinCap>
            <PinCap pin={<MMapPin label="2" bg="var(--o5)" />}>Actual</PinCap>
            <PinCap pin={<MMapPin icon="location" />}>Start</PinCap>
          </div>
          <div className="mt-[18px] flex items-end gap-[18px]">
            <PinCap pin={<MMapPin bg="var(--g6)" icon="checkmark-filled" />}>Entregado</PinCap>
            <PinCap pin={<MMapPin bg="var(--o5)" icon="ban" />}>Parcial</PinCap>
            <PinCap pin={<MMapPin bg="var(--r6)" icon="close-filled" />}>No entregado</PinCap>
            <PinCap pin={<span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-white bg-b-6 text-xs font-bold leading-[normal] text-white shadow-[0_1px_3px_rgba(19,32,69,.3)]">12</span>}>Cluster</PinCap>
          </div>
        </MStage>} />
      <MComponentCard name={c.routeLine?.name} tag="NEW" specs={c.routeLine?.specs}
        preview={<MStage><W label="Línea de ruta (azul recorrido / naranja activo)" w={280}><MPhone width={280}><MMapBg h={180} /></MPhone></W></MStage>} />
      <MComponentCard name={c.fabs?.name} tag="NEW" specs={c.fabs?.specs}
        preview={<MStage><W label="FABs y pins sobre el mapa" w={280}>
          <MPhone width={280}><div className="relative"><MMapBg h={280} />
            <div className="absolute bottom-3 right-3 flex flex-col gap-2.5"><Fab bg="#fff" icon="gps" color="var(--n6)" /><Fab bg="#fff" icon="maximize" color="var(--n6)" /><Fab bg="var(--b6)" icon="navigation" color="#fff" /></div>
            <div className="absolute left-[30%] top-[35%]"><MMapPin label="1" selected /></div>
            <div className="absolute left-[55%] top-[25%]"><MMapPin label="2" /></div>
            <div className="absolute left-[45%] top-[60%]"><MMapPin label="3" bg="var(--n4)" /></div>
          </div></MPhone>
        </W></MStage>} />
      <MComponentCard name={c.navWidget?.name} tag="NEW" specs={c.navWidget?.specs}
        preview={<MStage><W label="Widget de navegación (sobre Waze / Google Maps)" w={320}>
          <div className="rounded-xl bg-[#cfe0c8] p-3.5">
            <div className="overflow-hidden rounded-xl bg-white shadow-[0_4px_16px_rgba(19,32,69,.18)]">
              <div className="flex items-start gap-2.5 p-3">
                <MPin num={1} />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold leading-[1.35] text-n-7">Av. Las Condes 8977 Casa A, Las Condes, 7753425, Región Metro…</div>
                  <div className="mt-1.5 flex gap-2"><MBadge label="Entrega" type="info" /><span className="inline-flex items-center gap-1 text-xs leading-[normal] text-n-6"><span className="h-1.5 w-1.5 rounded-full bg-r-6" />Prioridad: Alta</span></div>
                  <div className="mt-1.5 flex gap-2.5"><MMeta icon="time" text="8:00 – 9:00" /><MMeta icon="package" text="3" /></div>
                </div>
                <I n="overflow-menu-vertical" s={18} c="var(--n5)" />
              </div>
              <div className="px-3 pb-3"><MBtn label="Llegué" className="w-full" /></div>
            </div>
          </div>
        </W></MStage>} />
      <MComponentCard name={c.georefModal?.name} tag="NEW" specs={c.georefModal?.specs}
        preview={<MStage><W label="Modal — órdenes sin georeferencia" w={300}>
          <div className="w-[280px] rounded-xl bg-white p-5 shadow-[0_8px_32px_rgba(19,32,69,.2)]">
            <div className="mb-2 flex items-center justify-between"><span className="text-[15px] font-bold leading-[normal] text-n-7">Órdenes sin georeferencia</span><I n="close-filled" s={16} c="var(--n5)" /></div>
            <div className="mb-[18px] text-[13px] leading-normal text-n-5">Tienes 2 órdenes sin georeferencia. Al continuar considera que no aparecerán dentro del mapa.</div>
            <div className="flex gap-2.5"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Continuar" className="flex-1" /></div>
          </div>
        </W></MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Order management ───────────── */
const DELIVERY = [{ label: 'No entregado', icon: 'close-filled', tone: 'r' as const }, { label: 'Parcial', icon: 'ban', tone: 'o' as const }, { label: 'Entregado', icon: 'checkmark-filled', tone: 'g' as const }];
const PICKUP = [{ label: 'No recogida', icon: 'close-filled', tone: 'r' as const }, { label: 'Parcial', icon: 'ban', tone: 'o' as const }, { label: 'Recogida', icon: 'checkmark-filled', tone: 'g' as const }];
function Milestone({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="border-b border-n-2 px-3 py-3.5">
      <div className="flex items-center justify-between"><span className="text-[14px] font-bold leading-[normal] text-n-7">{label}</span>{done ? <I n="checkmark-filled" s={18} c="var(--g6)" /> : <MBadge label="Requerido" type="warning" />}</div>
      {done
        ? <div className="mt-2 flex items-center justify-between"><button className="h-[30px] rounded-full border border-b-6 bg-white px-3 text-xs font-semibold leading-[normal] text-b-6">Marcar como no confirmado</button><span className="text-xs leading-[normal] text-n-5">Confirmado a las 09:30</span></div>
        : <button className="mt-2 h-[30px] rounded-full border-0 bg-b-6 px-3 text-xs font-semibold leading-[normal] text-white">Marcar como confirmado</button>}
    </div>
  );
}
export function MOrderManagement({ data }: { data: D }) {
  const c = data.components || {};
  const addr = 'Martín de Zamora 5760, 7560969, Las Condes';
  const modalHead = (t: string, sz = 15) => <div className="mb-2.5 flex items-center justify-between"><span className="font-bold leading-[normal] text-n-7" style={{ fontSize: sz }}>{t}</span><I n="close-filled" s={16} c="var(--n5)" /></div>;
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.statusSelector?.name} tag="NEW" specs={c.statusSelector?.specs} notes="El color del estado seleccionado es semántico: verde entregado, amber parcial, rojo no entregado."
        preview={<MStage>
          <W label="Entrega · Entregado" w={360}><Box><MStatusSelector options={DELIVERY} selected={2} /></Box></W>
          <W label="Entrega · Parcial" w={360}><Box><MStatusSelector options={DELIVERY} selected={1} /></Box></W>
          <W label="Entrega · No entregado" w={360}><Box><MStatusSelector options={DELIVERY} selected={0} /></Box></W>
          <W label="Recogida (variante)" w={360}><Box><MStatusSelector options={PICKUP} selected={2} /></Box></W>
        </MStage>} />
      <MComponentCard name={c.substatus?.name} tag="NEW" specs={c.substatus?.specs}
        preview={<MStage><W label="Subestado buscable"><Box>
          <MInput label="*Subestado" value="Selecciona un subestado" rightIcon="chevron--down" />
          <div className="overflow-hidden rounded-md border border-n-3 shadow-[0_4px_16px_rgba(0,0,0,.12)]">
            <div className="flex items-center gap-2 border-b border-n-2 px-3 py-2"><I n="search" s={14} c="var(--n5)" /><span className="text-[13px] leading-[normal] text-n-6">Buscar subestado</span></div>
            {['Sin moradores', 'Producto dañado', 'Producto faltante', 'Dirección errónea'].map((o) => <div key={o} className="flex h-10 items-center px-3 text-[14px] leading-[normal] text-n-7">{o}</div>)}
          </div>
        </Box></W></MStage>} />
      <MComponentCard name={c.managementAccordion?.name} tag="NEW" specs={c.managementAccordion?.specs}
        preview={<MStage><W label="Acordeón de gestión" w={320}><MSheet>
          <MReqRow label="Información de entrega" />
          <div className="border-b border-n-2 px-3 py-3.5 text-center"><div className="mb-2 text-[13px] leading-[normal] text-n-5">Para gestionar confirma que llegaste al punto de entrega</div><MBtn label="Llegué" className="w-[60%]" /></div>
          <MReqRow label="Estado" state="required" /><MReqRow label="Ítems" sub="0 de 3 entregado" /><MReqRow label="Pruebas de entrega" sub="0 de 3 completado" state="required" /><MReqRow label="Recaudo" sub="0 de 150.000" state="required" />
          <div className="flex gap-2.5 p-3"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Confirmar gestión" className="flex-1" /></div>
        </MSheet></W></MStage>} />
      <MComponentCard name={c.milestones?.name} tag="NEW" specs={c.milestones?.specs}
        preview={<MStage><W label="Hitos de operación" w={320}><MSheet>
          <Milestone label="Arrival at client" done /><Milestone label="Start download" />
          <div className="p-3"><MBanner text="Marca el hito en tiempo real, tal como aparece la hora en el registro." tone="warning" /></div>
        </MSheet></W></MStage>} />
      <MComponentCard name={c.bulkManagement?.name} tag="NEW" specs={c.bulkManagement?.specs}
        preview={<MStage>
          <W label="Selección múltiple" w={320}><MSheet>
            <div className="bg-n-1 px-3 py-2.5 text-[13px] font-bold leading-[normal] text-n-7">4 órdenes</div>
            <div className="flex flex-col gap-2 p-3"><MOrderCard num={1} addr={addr} order="Orden #382918390" person="Ana Álvarez" items={3} selected custom={false} /><MOrderCard num={2} addr={addr} order="Orden #382918390" person="Ana Álvarez" items={3} selected={false} custom={false} /></div>
            <div className="flex gap-2.5 p-3"><MBtn label="Gestionar selección" variant="outline" className="flex-1" /><MBtn label="Gestionar todas (4)" className="flex-1" /></div>
          </MSheet></W>
          <W label="Comprobante QR" w={260}>
            <div className="w-60 rounded-xl bg-white p-5 text-center shadow-[0_8px_32px_rgba(19,32,69,.2)]">
              {modalHead('Entrega código QR', 14)}
              <div className="mb-3.5 text-xs leading-normal text-n-5">Comparte las órdenes gestionadas mediante este código para que sea escaneado.</div>
              <div className="mb-3.5 flex justify-center"><I n="qr" s={96} c="var(--n7)" /></div>
              <MBtn label="Cerrar" className="w-full" />
            </div>
          </W>
        </MStage>} />
      <MComponentCard name={c.cashCollection?.name} tag="NEW" specs={c.cashCollection?.specs}
        preview={<MStage>
          <W label="Recaudo (cash on delivery)" w={320}><MSheet>
            <div className="p-4">
              <div className="mb-3.5 rounded-lg bg-b-1 p-3.5 text-center"><div className="text-xs leading-[normal] text-n-6">Total a recaudar</div><div className="text-[22px] font-bold leading-[normal] text-b-7">$134.500 <span className="text-xs font-normal">CLP</span></div></div>
              <label className="mb-3.5 flex items-center gap-2 text-[13px] leading-[normal] text-n-7"><span className="inline-block h-[18px] w-[18px] rounded-[4px] border-[1.5px] border-n-4" />Considerar saldo anterior</label>
              <MInput label="*Medio de transacción" value="Efectivo" state="filled" rightIcon="chevron--down" />
              <div className="mb-2.5 mt-1 text-xs font-medium leading-[normal] text-n-6">Detalle billetes/monedas recibidos</div>
              {['2.000', '5.000', '10.000', '20.000'].map((v) => <div key={v} className="mb-2.5 flex items-center justify-between"><span className="text-[14px] leading-[normal] text-n-7">{v}</span><MStepper value={0} /></div>)}
            </div>
            <div className="flex gap-2.5 border-t border-n-2 p-3"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Confirmar" className="flex-1" /></div>
          </MSheet></W>
          <W label="Confirmar monto (discrepancia)" w={280}>
            <div className="w-[260px] rounded-xl bg-white p-5 shadow-[0_8px_32px_rgba(19,32,69,.2)]">
              {modalHead('Confirmar monto')}
              <div className="mb-2 text-[13px] leading-normal text-n-5">El monto recaudado no coincide con los precios de los ítems.</div>
              <div className="mb-4 text-center text-[18px] font-bold leading-[normal] text-r-6">$35.000 / $245.000 CLP</div>
              <div className="flex gap-2.5"><MBtn label="Finalizar" variant="danger" className="flex-1" /><MBtn label="Cancelar" variant="outline" className="flex-1" /></div>
            </div>
          </W>
        </MStage>} />
      <MComponentCard name={c.successScreen?.name} tag="NEW" specs={c.successScreen?.specs}
        preview={<MStage><W label="Pantalla de éxito (360×640)" w={360}><MPhone width={360}>
          <div className="flex h-[640px] w-[360px] flex-col items-center justify-center gap-7 bg-b-6">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="52" stroke="#fff" strokeWidth="6" /><path d="M38 61 L53 77 L83 43" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="text-[24px] font-bold leading-[normal] text-white">Gestión finalizada</div>
          </div>
        </MPhone></W></MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}
