import { useState, type ReactNode } from 'react';
import { SectionHeader } from '../ui';
import { useI18n } from '../i18n';
import { Switch } from './Components3';
import { SettingsSidebar, type SbItem } from './shared';
import { LmTopbar, PageSidebar } from './Pages1';
import { GeofenceMap } from './LeafletMap';
import { cn } from '@/ds/lib/cn';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Head = { title: string; titleKey?: string; description?: string };

const SB: SbItem[] = [
  { icon: 'report-data', label: 'Resumen' }, { icon: 'dashboard', label: 'Actividad' }, { icon: 'network-3', label: 'Rutas' }, { icon: 'document-multiple', label: 'Órdenes' },
  { icon: 'delivery', label: 'Flota' }, { icon: 'chart-column', label: 'Estadísticas' }, { icon: 'notification', label: 'Alertas' }, { icon: 'events', label: 'Clientes' },
  { icon: 'file-system', label: 'Documentos' }, { icon: 'currency', label: 'Módulo de Costos' }, { divider: true }, { icon: 'settings', label: 'Ajustes' },
];

const INP = 'box-border h-8 w-full rounded-md border border-n-3 bg-white px-2.5 text-[14px] leading-5 text-n-7 outline-none placeholder:text-n-5 focus:border-2 focus:border-b-6 focus:bg-b-1';
const Req = () => <span className="text-r-6">*</span>;

function Inp({ label, value = '', placeholder, required }: { label: string; value?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs leading-4 text-n-7">{required && <Req />}{label}</label>
      <input type="text" defaultValue={value || undefined} placeholder={value ? undefined : placeholder || label} className={cn(INP, value && 'border-n-5')} />
    </div>
  );
}

function Sel({ label, placeholder = '', required }: { label: string; placeholder?: string; required?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs leading-4 text-n-7">{required && <Req />}{label}</label>
      <div className="relative">
        <div onClick={() => setOpen(!open)} className={cn('box-border flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-white px-2.5', open ? 'border-2 border-b-6 bg-b-1' : 'border border-n-3 hover:bg-n-2')}>
          <span className="flex-1 text-[14px] leading-5 text-n-6">{placeholder}</span>
          <svg viewBox="0 0 32 32" width="12" height="12" className="shrink-0 fill-n-5"><path d="M16 22L4 10l1.5-1.5L16 19l10.5-10.5L28 10z" /></svg>
        </div>
        {open && <div className="absolute inset-x-0 top-[calc(100%+4px)] z-[100] rounded-md border border-n-3 bg-white py-1 shadow-[0_4px_16px_rgba(0,0,0,.12)]" />}
      </div>
    </div>
  );
}

function Radio({ options, selected = 0 }: { options: string[]; selected?: number }) {
  const [sel, setSel] = useState(selected);
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((o, i) => (
        <label key={o} onClick={() => setSel(i)} className="flex cursor-pointer items-center gap-1.5 text-[14px] leading-[normal] text-n-7">
          <div className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2', i === sel ? 'border-b-6 bg-b-6' : 'border-n-4 bg-white')}>{i === sel && <div className="h-1.5 w-1.5 rounded-full bg-white" />}</div>{o}
        </label>
      ))}
    </div>
  );
}

const Hint = ({ children }: { children: ReactNode }) => <p className="m-0 mt-0.5 text-xs leading-[normal] text-n-5">{children}</p>;
const Note = ({ children }: { children: ReactNode }) => <p className="m-0 mb-3 text-xs leading-[normal] text-n-5">{children}</p>;
const InfoIco = () => <span className="flex items-center"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="stroke-n-4" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg></span>;

function TextArea({ label, placeholder = '' }: { label: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs leading-4 text-n-5">{label}</label>
      <textarea placeholder={placeholder} rows={2} className="box-border w-full resize-y rounded-md border border-n-3 bg-n-2 px-2.5 py-2 text-[14px] leading-normal text-n-7 outline-none focus:border-2 focus:border-b-6 focus:bg-b-1" />
    </div>
  );
}

/* Bloques */
const FpCard = ({ title, children, className }: { title?: string; children: ReactNode; className?: string }) => (
  <div className={cn('flex flex-col gap-4 rounded-lg border border-n-4 bg-white p-5', className)}>
    {title && <div className="border-b border-n-3 pb-3 text-[15px] font-bold leading-[normal] text-n-7">{title}</div>}
    {children}
  </div>
);
const TwoCol = ({ lt, l, rt, r }: { lt: string; l: ReactNode; rt: string; r: ReactNode }) => (
  <div className="grid grid-cols-2 gap-5"><FpCard title={lt}>{l}</FpCard><FpCard title={rt}>{r}</FpCard></div>
);
const Single = ({ title, children }: { title: string; children: ReactNode }) => <FpCard title={title}>{children}</FpCard>;
const InputMap = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-[1fr_1.4fr] gap-5">
    <div className="flex flex-col gap-3 rounded-lg border border-n-4 bg-white p-5">{children}</div>
    <div className="relative min-h-[300px] overflow-hidden rounded-lg border border-n-4 bg-white"><GeofenceMap className="h-full min-h-[300px] w-full" /></div>
  </div>
);
interface SwRow { label: string; on?: boolean; info?: boolean; indent?: boolean }
const Switches = ({ title, rows, activateAll }: { title: string; rows: SwRow[]; activateAll?: boolean }) => (
  <FpCard title={title}>
    {activateAll && <div className="-mt-2 flex justify-end"><span className="cursor-pointer text-[13px] font-bold leading-[normal] text-b-7">Activar todo</span></div>}
    <div className="flex flex-col">
      {rows.map((r, i) => (
        <div key={i} className={cn('py-2.5', i > 0 && 'border-t border-n-3')}>
          <div className={cn('flex items-center gap-2', r.indent && 'pl-5')}>
            <span className="flex-1 text-[14px] leading-[normal] text-n-7">{r.label}</span>{r.info && <InfoIco />}<Switch defaultOn={!!r.on} />
          </div>
        </div>
      ))}
    </div>
  </FpCard>
);
const Custom = ({ title, fields, addGroup }: { title: string; fields: { type: 'select' | 'textarea'; label: string; placeholder?: string }[]; addGroup?: boolean }) => (
  <FpCard title={title}>
    <div className="flex flex-col gap-3">{fields.map((f, i) => f.type === 'textarea' ? <TextArea key={i} label={f.label} placeholder={f.placeholder} /> : <Sel key={i} label={f.label} placeholder={f.label} />)}</div>
    {addGroup && <div className="pt-1"><button className="h-8 cursor-pointer rounded-[50px] border border-n-3 bg-white px-4 text-[13px] font-bold leading-[normal] text-n-6">Agregar grupo</button></div>}
  </FpCard>
);
const FileUp = ({ label, hint }: { label: string; hint?: string }) => (
  <FpCard>
    <div className="flex items-center gap-3">
      <Switch />
      <label className="text-[13px] font-medium leading-[normal] text-n-7">{label}</label>
      <div className="flex items-center gap-2">
        <button className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[50px] border border-b-6 bg-white px-3.5 text-[13px] font-bold leading-[normal] text-[#4B82FA]"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>Choose File</button>
        <span className="text-xs leading-[normal] text-n-5">No file chosen</span>
      </div>
    </div>
    {hint && <Hint>{hint}</Hint>}
  </FpCard>
);

/* Shells */
function FormBody({ breadcrumb, title, children }: { breadcrumb: string[]; title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden bg-n-2 px-6 pb-6 pt-5">
      <div className="flex items-center gap-1 text-xs leading-[normal] text-n-5">
        {breadcrumb.map((b, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>}
            <span className={i === breadcrumb.length - 1 ? 'text-n-6' : ''}>{b}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-5 rounded-lg border border-n-4 bg-white px-6 pb-6 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button className="flex cursor-pointer border-0 bg-transparent p-0.5 text-n-6"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg></button>
            <h2 className="m-0 text-[24px] font-bold leading-none text-n-7">{title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button className="h-8 cursor-pointer rounded-[50px] border border-b-6 bg-white px-4 text-[13px] font-bold leading-none text-[#4B82FA]">Cancelar</button>
            <button className="h-8 cursor-pointer rounded-[50px] border-0 bg-b-6 px-4 text-[13px] font-bold leading-none text-white">Guardar</button>
          </div>
        </div>
        <p className="m-0 text-xs leading-[normal] text-r-6"><span>* </span>Indica el campo es obligatorio</p>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
function StdShell({ breadcrumb, title, children, nav }: { breadcrumb: string[]; title: string; children: ReactNode; nav?: SbItem[] }) {
  return (
    <div className="mb-0 overflow-hidden rounded-lg border border-n-3 bg-white">
      <LmTopbar />
      <div className="flex min-h-[600px]"><PageSidebar activeNav="settings" nav={nav ?? SB} /><FormBody breadcrumb={breadcrumb} title={title}>{children}</FormBody></div>
    </div>
  );
}
function SetShell({ breadcrumb, title, children, product, active }: { breadcrumb: string[]; title: string; children: ReactNode; product: any; active: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-n-3 bg-white">
      <LmTopbar />
      <SettingsSidebar product={product} activeItem={active}><FormBody breadcrumb={breadcrumb} title={title}>{children}</FormBody></SettingsSidebar>
    </div>
  );
}

/* Ejemplos ensamblados */
const WebUser = (a: string) => (
  <>
    <TwoCol lt="Información de usuario"
      l={<><Inp label="Nombre y apellido" value="Walter Wallace" required /><Inp label="Nombre de usuario" value="walter.wallace" required /><Hint>Nombre único para entrar a la plataforma. No debe contener espacios.</Hint><Inp label="Email" value="walter.wallace@email.com" required /><Inp label="Contraseña" required /><Inp label="Repite contraseña" required /></>}
      rt="Agrupaciones"
      r={<><Note>Al seleccionar una agrupación el usuario pierde los accesos a ajustes.</Note><Sel label="Agrupaciones de órdenes" /><Sel label="Agrupaciones de vehículos" /></>} />
    <Single title="Permisos">
      <Note>Selecciona una agrupación de permisos seleccionando un rol o de manera personalizada.</Note>
      <div className="mb-3 flex gap-4" key={a}><Radio options={['Rol de usuario', 'Personalizado']} /></div>
      <Sel label="Seleccionar rol" />
    </Single>
    <Custom title="Campos personalizados" fields={[{ type: 'select', label: 'Tienda' }, { type: 'select', label: 'Cargo' }]} />
  </>
);

function Catalog({ blocks }: { blocks: any[] }) {
  const prev = (id: string): ReactNode => {
    switch (id) {
      case 'two-col': return <TwoCol lt="Bloque A" l={<><Inp label="Campo 1" required /><Inp label="Campo 2" /></>} rt="Bloque B" r={<><Inp label="Campo 3" required /><Sel label="Campo 4" placeholder="Seleccionar" /></>} />;
      case 'single': return <Single title="Bloque completo"><div className="grid grid-cols-3 gap-3"><Inp label="Campo 1" required /><Inp label="Campo 2" /><Sel label="Campo 3" placeholder="Seleccionar" /></div></Single>;
      case 'input-map': return <InputMap><Inp label="Nombre" required /><Sel label="Tipo" placeholder="Seleccionar tipo" required /><Radio options={['Activa', 'Inactiva']} /></InputMap>;
      case 'switches': return <Switches title="Permisos" activateAll rows={[{ label: 'Crear nuevos registros', on: true, info: true }, { label: 'Editar registros', on: true, info: true }, { label: 'Solo dentro de geocerca', info: true, indent: true }, { label: 'Eliminar registros', info: true }]} />;
      case 'custom-fields': return <Custom title="Campos personalizados" addGroup fields={[{ type: 'select', label: 'Tienda' }, { type: 'textarea', label: 'Cargo' }]} />;
      case 'file-upload': return <FileUp label="Foto de perfil" hint="Tamaño sugerido 224×224px (PNG o JPG)" />;
      default: return null;
    }
  };
  return (
    <div className="mb-9 flex flex-col gap-3">
      {blocks.map((b) => (
        <div key={b.id} className="overflow-hidden rounded-[10px] border border-n-3 bg-white">
          <div className="flex items-center gap-2.5 border-b border-n-3 px-4 py-3.5">
            {b.icon && <div className="flex h-7 w-7 items-center justify-center rounded-md bg-b-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-b-7" strokeWidth="2"><path d={b.icon} /></svg></div>}
            <div>
              <div className="text-[13px] font-bold leading-[normal] text-n-7">{b.label}</div>
              <div className="mt-px text-[11px] leading-[normal] text-n-5">{b.description}</div>
            </div>
            <code className="ml-auto shrink-0 rounded-[4px] bg-n-2 px-[7px] py-0.5 text-[11px] font-semibold leading-[normal] text-b-7">{b.id}</code>
          </div>
          <div className="bg-n-2 p-4">{prev(b.id)}</div>
        </div>
      ))}
    </div>
  );
}

export function FormPage({ data }: { data: Head & any }) {
  const { t } = useI18n();
  const H3 = ({ children, className }: { children: ReactNode; className?: string }) => <h3 className={cn('text-[15px] font-bold leading-[normal] text-n-7', className)}>{children}</h3>;
  const H4 = ({ children }: { children: ReactNode }) => <h4 className="m-0 mb-1 text-[13px] font-semibold leading-[normal] text-n-7">{children}</h4>;
  const P = ({ children }: { children: ReactNode }) => <p className="m-0 mb-4 text-xs leading-[normal] text-n-5">{children}</p>;
  const prod = data.lmProduct ?? {};
  return (
    <>
      <SectionHeader data={data} />
      <H3 className="m-0 mb-1.5">{t('ui.pageShell', 'Page shell')}</H3>
      <p className="m-0 mb-4 text-[13px] leading-[1.6] text-n-5" dangerouslySetInnerHTML={{ __html: t('ui.pageShellDesc', 'Every form page uses the same shell: <strong>Topbar</strong> → <strong>Sidebar</strong> → content area with breadcrumb, ← back + title + <em>Cancelar/Guardar</em> buttons, required field note, and a vertical stack of blocks.') }} />
      <H3 className="mb-1.5 mt-6">{t('ui.blockCatalog', 'Block catalog')}</H3>
      <p className="m-0 mb-4 text-[13px] leading-[1.6] text-n-5" dangerouslySetInnerHTML={{ __html: t('ui.blockCatalogDesc', 'Compose any form by stacking blocks. Every block is a white card.') }} />
      <Catalog blocks={data.blocks ?? []} />

      <H3 className="m-0 mb-1">Sidebar estándar</H3>
      <P>Colapsable — para páginas operativas (órdenes, rutas, flota)</P>
      <H4>Nuevo usuario web — two-col + single + custom-fields</H4>
      <div className="mb-5"><StdShell breadcrumb={['Usuarios web', 'Nuevo usuario web']} title="Nuevo usuario web">{WebUser('a')}</StdShell></div>
      <H4>Nuevo usuario móvil — two-col + switches + custom-fields</H4>
      <div className="mb-7">
        <StdShell breadcrumb={['Usuarios móviles', 'Nuevo usuario móvil']} title="Nuevo usuario móvil">
          <TwoCol lt="Información de usuario" l={<><Inp label="Nombre y apellido" placeholder="example" required /><Inp label="Teléfono" placeholder="example" required /><Inp label="ID" /></>}
            rt="Datos de acceso a la plataforma" r={<><Inp label="Usuario" placeholder="example" required /><Hint>No se permiten espacios.</Hint><Inp label="Contraseña" placeholder="example" required /><Hint>Mínimo 4 caracteres.</Hint><FileUp label="Foto de perfil" hint="Tamaño sugerido de 224×224 (PNG o JPG)" /></>} />
          <Switches title="Permisos" activateAll rows={[
            { label: 'Crear órdenes nuevas', on: true, info: true }, { label: 'Agregar órdenes del sistema', on: true, info: true }, { label: 'Solo dentro de geocerca del CD', info: true, indent: true },
            { label: 'Eliminar órdenes', on: true, info: true }, { label: 'Compartir ruta a copiloto', on: true, info: true }, { label: 'Reordenar ruta no iniciada', on: true, info: true }, { label: 'Notificaciones automáticas (pre-entrega)', info: true },
          ]} />
          <Custom title="Campos personalizados" fields={[{ type: 'textarea', label: 'Tienda' }, { type: 'textarea', label: 'Cargo' }]} />
        </StdShell>
      </div>

      <H3 className="m-0 mb-1">Sidebar de ajustes</H3>
      <P>Siempre expandido — para páginas de configuración (usuarios, vehículos, geocercas…)</P>
      <H4>Crear Geocerca — input-map con mapa Leaflet</H4>
      <div className="mb-5">
        <SetShell product={prod} active="Geocercas" breadcrumb={['Configuración', 'Geocerca', 'Crear Geocerca']} title="Crear Geocerca">
          <InputMap>
            <p className="m-0 mb-1 text-[13px] font-bold leading-[normal] text-n-7">Tipo de geocerca</p>
            <p className="m-0 mb-2.5 text-xs leading-[normal] text-n-5">Asociativa: define la zona de despacho de un vehículo.<br />Restrictiva: impide el tránsito por una zona.</p>
            <div className="mb-3"><Radio options={['Asociativa', 'Restrictiva']} selected={1} /></div>
            <Inp label="Nombre" required /><Sel label="Seleccionar geocerca pre-definida" />
            <div className="mt-1"><p className="m-0 mb-2 text-xs leading-[normal] text-n-7">Estado</p><Radio options={['Activa', 'Inactiva']} /></div>
          </InputMap>
        </SetShell>
      </div>
      <H4>Nuevo usuario web — two-col + single + custom-fields</H4>
      <div className="mb-5"><SetShell product={prod} active="Usuarios web" breadcrumb={['Usuarios web', 'Nuevo usuario web']} title="Nuevo usuario web">{WebUser('b')}</SetShell></div>
      <H4>Nuevo vehículo — two-col × 2 + single</H4>
      <div className="mb-7">
        <SetShell product={prod} active="Vehículos" breadcrumb={['Vehículos', 'Nuevo vehículo']} title="Nuevo vehículo">
          <TwoCol lt="Información del vehículo"
            l={<><Inp label="Identificador" required /><div className="grid grid-cols-3 gap-2"><Inp label="Capacidad 1" /><Inp label="Capacidad 2" /><Inp label="Capacidad 3" /></div><Sel label="Grupos" /><Sel label="Tipo de camión" required /><Sel label="Asociar usuario móvil" /></>}
            rt="Otras configuraciones"
            r={<>
              <div className="mb-2 text-[13px] font-semibold leading-[normal] text-n-7">Horas de trabajo</div><Inp label="Turno de trabajo" /><Inp label="Tiempo de descanso" />
              <div className="my-2 text-[13px] font-semibold leading-[normal] text-n-7">Origen y destino</div><Sel label="Centro de despacho de origen" required />
              <div className="my-1 flex items-center gap-2"><Switch defaultOn={false} /><span className="text-[13px] leading-[normal] text-n-7">Auto-iniciar ruta</span></div>
              <Sel label="Centro de despacho de destino" />
              <div className="my-1 flex items-center gap-2"><Switch defaultOn={false} /><span className="text-[13px] leading-[normal] text-n-7">Auto-finalizar ruta</span></div>
            </>} />
          <TwoCol lt="Restricciones"
            l={<><Inp label="Límite de dinero" /><Sel label="Velocidad promedio" /><Inp label="Tiempo de recarga en CD" /><Inp label="Tiempo máximo de conducción" /><Inp label="Distancia máxima por ruta (km)" /><Inp label="Máximas paradas por ruta" /><Inp label="Máximas rutas" /></>}
            rt="Costos" r={<><Inp label="Costos de salida" /><Inp label="Costo por kilómetro" /><Inp label="Costo por viaje" /><Inp label="Costo por hora" /></>} />
          <Single title="Etiquetas"><Sel label="Grupo de etiquetas" /><Inp label="Etiquetas" /></Single>
        </SetShell>
      </div>
    </>
  );
}
