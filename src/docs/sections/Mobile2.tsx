import type { ReactNode } from 'react';
import { SectionHeader } from '../ui';
import { cn } from '@/ds/lib/cn';
import {
  MIcon as I, MPhone, MStage, MLabel, MWrap, MSheet, MComponentCard, MRules, MBtn, MInput, MToast, MBanner, MReqRow, MPhotoStrip, MSignatureStroke,
} from './mobile/kit';

/* eslint-disable @typescript-eslint/no-explicit-any */
type D = any;
const W = ({ label, w = 300, children }: { label: string; w?: number; children: ReactNode }) => <MWrap label={label} w={w}>{children}</MWrap>;

/* ───────────── Pruebas de entrega ───────────── */
export function MPod({ data }: { data: D }) {
  const c = data.components || {};
  const lvRow = (label: string, count: string, tone: 'g' | 'o' | 'r') => (
    <div key={label + count} className="flex items-center gap-2.5 border-b border-n-2 p-3">
      <I n={tone === 'g' ? 'checkmark-filled' : tone === 'o' ? 'warning' : 'close-filled'} s={18} c={tone === 'g' ? 'var(--g6)' : tone === 'o' ? 'var(--o5)' : 'var(--r6)'} />
      <span className="flex-1 text-[14px] leading-[normal] text-n-7">{label}</span>
      <span className="text-[13px] font-semibold leading-[normal] text-n-6">{count}</span>
      <I n="chevron--down" s={16} c="var(--n5)" />
    </div>
  );
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.requirementRow?.name} tag="NEW" specs={c.requirementRow?.specs} notes="Base de todos los formularios de gestión y PoD. Badge «Requerido» mientras está pendiente; check verde + preview al completar."
        preview={<MStage><W label="Filas de requisito (pendiente / completo)"><MSheet>
          <MReqRow icon="package" label="Escanea ítems" sub="0 de 64 entregado" state="required" />
          <MReqRow icon="pen" label="Agregar firma" state="required" />
          <MReqRow icon="camera" label="Foto de entrega" sub="4/10" state="done" preview={<MPhotoStrip count={4} />} />
          <MReqRow icon="time" label="Agregar hora" sub="18:00" state="done" />
        </MSheet></W></MStage>} />
      <MComponentCard name={c.photoCapture?.name} tag="NEW" specs={c.photoCapture?.specs}
        preview={<MStage>
          <W label="Cámara" w={240}><MPhone width={240}>
            <div className="flex h-[380px] flex-1 flex-col bg-[#1b1b1f]">
              <div className="flex justify-between px-3.5 py-3"><I n="arrow-left" s={20} c="#fff" /><span className="text-[13px] font-semibold leading-[normal] text-white">Agregar foto</span><I n="camera" s={20} c="#fff" /></div>
              <div className="flex flex-1 items-center justify-center"><div className="h-[130px] w-[200px] rounded-md bg-[linear-gradient(135deg,#3a3a40,#26262b)]" /></div>
              <div className="flex justify-center p-5"><span className="h-14 w-14 rounded-full border-4 border-[rgba(255,255,255,.4)] bg-white" /></div>
            </div>
          </MPhone></W>
          <W label="Tira de evidencia (en formulario)"><MSheet><div className="p-4"><MPhotoStrip count={4} /></div></MSheet></W>
        </MStage>} />
      <MComponentCard name={c.signature?.name} tag="NEW" specs={c.signature?.specs}
        preview={<MStage>
          <W label="Vacío"><MSheet><div className="p-6 text-center"><div className="flex justify-center"><I n="pen" s={28} c="var(--n5)" /></div><div className="mb-1 mt-2.5 text-[15px] font-bold leading-[normal] text-n-7">Firma acá</div><div className="text-xs leading-[1.5] text-n-5">Después de firmar, puedes apretar el botón para intentarlo de nuevo.</div></div></MSheet></W>
          <W label="Firmado + RUT"><MSheet>
            <div className="px-4 py-6 text-center"><div className="mb-2.5 flex justify-center"><MSignatureStroke /></div><button className="inline-flex cursor-pointer items-center gap-[5px] border-0 bg-transparent text-[13px] font-medium leading-[normal] text-r-6"><I n="delete" s={14} c="var(--r6)" />Borrar</button></div>
            <div className="px-4 pb-4"><MInput label="*RUT de quien recibe" value="16.999.999-9" state="filled" /></div>
          </MSheet></W>
        </MStage>} />
      <MComponentCard name={c.scanner?.name} tag="NEW" specs={c.scanner?.specs}
        preview={<MStage>
          <W label="Escáner (código de barras)" w={240}><MPhone width={240}>
            <div className="relative flex h-[380px] flex-1 flex-col bg-[#1b1b1f]">
              <div className="flex items-center justify-between px-3.5 py-3"><I n="arrow-left" s={20} c="#fff" /><span className="rounded-full bg-[rgba(255,255,255,.15)] px-2.5 py-[3px] text-xs font-semibold leading-[normal] text-white">30s</span><span className="text-xs font-semibold leading-[normal] text-white">⚡</span></div>
              <div className="flex flex-1 items-center justify-center"><div className="h-[110px] w-[170px] rounded-[10px] border-2 border-white shadow-[0_0_0_2000px_rgba(0,0,0,.35)]" /></div>
              <div className="px-3.5 pb-2.5"><MToast text="Código 9AS-345345 -234234 exitoso." tone="success" close={false} /></div>
              <div className="flex gap-2.5 bg-white px-3.5 py-3"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Fin del escaneo" className="flex-1" /></div>
            </div>
          </MPhone></W>
          <W label="Resultados"><div className="flex flex-col gap-2.5"><MToast text="Código 9AS-345345 -234234 exitoso." tone="success" close={false} /><MToast text="Código no encontrado dentro de tus órdenes." tone="error" close={false} /></div></W>
        </MStage>} />
      <MComponentCard name={c.loadValidation?.name} tag="NEW" specs={c.loadValidation?.specs}
        preview={<MStage><W label="Validación de carga (semáforo por orden)"><MSheet>
          <div className="flex items-center justify-between bg-n-1 p-3"><span className="text-[14px] font-bold leading-[normal] text-n-7">Estado</span><span className="flex items-center gap-1.5 text-xs leading-[normal] text-n-5">64 de 64 completado <I n="checkmark-filled" s={16} c="var(--g6)" /></span></div>
          {lvRow('Orden #12321312', '40/40', 'g')}{lvRow('Orden #22321312', '39/40', 'o')}{lvRow('Orden #22321312', '0/40', 'r')}
        </MSheet></W></MStage>} />
      <MComponentCard name={c.startForm?.name} tag="NEW" specs={c.startForm?.specs}
        preview={<MStage><W label="Formulario de inicio (stepper)"><MSheet>
          <div className="flex items-center gap-2.5 border-b border-n-2 p-3"><I n="arrow-left" s={20} c="var(--n7)" /><span className="flex-1 text-[14px] font-bold leading-[normal] text-n-7">Formulario de inicio</span><span className="text-xs leading-[normal] text-n-5">4/9</span></div>
          <MReqRow icon="camera" label="Foto de facturas" sub="4/10" state="done" preview={<MPhotoStrip count={4} />} />
          <MReqRow icon="package" label="Escanear ítems" sub="8/10 ítems escaneados" state="done" />
          <MReqRow icon="pen" label="Agregar firma" state="done" preview={<span className="mr-2"><MSignatureStroke /></span>} />
          <MReqRow icon="time" label="Agregar hora" state="required" />
          <MReqRow icon="receipt" label="Escanear la factura" state="required" />
          <div className="p-3"><MBtn label="Continuar" className="w-full" /></div>
        </MSheet></W></MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}

/* ───────────── Toasts y banners ───────────── */
const TOAST_ROWS = [
  { tone: 'info', label: 'Información', text: 'Tu solicitud está siendo procesada en segundo plano.' },
  { tone: 'error', label: 'Error', text: 'Código no encontrado dentro de tus órdenes.' },
  { tone: 'warning', label: 'Advertencia', text: 'No puedes finalizar ruta hasta que se sincronicen todas las órdenes.' },
  { tone: 'success', label: 'Éxito', text: 'Orden agregada a la gestión masiva correctamente.' },
] as const;
const ColLabel = ({ children }: { children: ReactNode }) => <div className="mb-2 text-[11px] font-bold uppercase leading-[normal] tracking-[.06em] text-n-5">{children}</div>;
function SyncBar({ label, color, fill, dark }: { label: string; color: string; fill: string; dark?: boolean }) {
  return (
    <div className={cn('overflow-hidden rounded-lg', dark ? 'bg-n-7' : 'border border-n-3 bg-white')}>
      <div className={cn('flex items-center justify-between px-3 py-2.5 text-xs font-semibold leading-[normal]', dark ? 'text-white' : 'text-n-7')}>
        <span className="flex items-center gap-1.5"><I n={dark ? 'ban' : 'refresh'} s={14} c={dark ? '#fff' : color} />{label}</span>
      </div>
      <div className={cn('h-1', dark ? 'bg-[rgba(255,255,255,.2)]' : 'bg-n-2')}><div className="h-full" style={{ width: fill, background: color }} /></div>
    </div>
  );
}
function ConfirmModal({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <div className="w-[300px] rounded-xl bg-white p-5 shadow-[0_8px_32px_rgba(19,32,69,.2)]">
      <div className="mb-2 flex items-start justify-between"><div className="text-[15px] font-bold leading-[normal] text-n-7">{title}</div><I n="close-filled" s={18} c="var(--n5)" /></div>
      <div className="mb-[18px] text-[14px] leading-normal text-n-5">{body}</div>
      <div className="flex gap-2.5">{children}</div>
    </div>
  );
}
export function MToasts({ data }: { data: D }) {
  const c = data.components || {};
  return (
    <>
      <SectionHeader data={data} />
      <MComponentCard name={c.toast?.name} tag="NEW" specs={c.toast?.specs} notes="Confirma acciones puntuales. Éxito en verde, error en rojo; nunca un toast de advertencia para una acción exitosa."
        preview={<div className="rounded-lg bg-n-2 p-5">
          {TOAST_ROWS.map((r) => (
            <div key={r.tone} className="mb-5 w-full">
              <div className="mb-2.5 text-xs font-bold leading-[normal] text-n-6">{r.label}</div>
              <div className="grid grid-cols-3 gap-3">
                <div><ColLabel>Sin acción</ColLabel><MToast text={r.text} tone={r.tone} close={false} /></div>
                <div><ColLabel>Con cierre</ColLabel><MToast text={r.text} tone={r.tone} close /></div>
                <div><ColLabel>Con acción</ColLabel><MToast text={r.text} tone={r.tone} close="AGREGAR" /></div>
              </div>
            </div>
          ))}
        </div>} />
      <MComponentCard name={c.syncBar?.name} tag="NEW" specs={c.syncBar?.specs} notes="Comunica el estado de conexión y el progreso de sincronización. No se puede finalizar ruta con órdenes sin sincronizar."
        preview={<MStage>
          <W label="Sin conexión" w={320}><SyncBar label="Estás desconectado. Las órdenes se actualizarán al reconectar." color="var(--n4)" fill="0%" dark /></W>
          <W label="Conexión intermitente" w={320}><SyncBar label="Conexión intermitente · Pendientes 7/10" color="var(--o5)" fill="30%" /></W>
          <W label="En línea" w={320}><SyncBar label="Sincronizando órdenes" color="var(--g6)" fill="75%" /></W>
        </MStage>} />
      <MComponentCard name={c.warningBanner?.name} tag="EXTENDED" specs={c.warningBanner?.specs}
        preview={<MStage>
          <W label="Advertencia (acción requerida)" w={320}><MBanner text="Debes escanear para acceder a los estados Parcial y Entregado. Por defecto solo podrás seleccionar No entregado." tone="warning" /></W>
          <W label="Info (neutra)" w={320}><MBanner text="Sin items faltantes, entrega completa." tone="info" /></W>
        </MStage>} />
      <MComponentCard name={c.confirmModal?.name} tag="EXTENDED" specs={c.confirmModal?.specs} notes="Siempre nombra la acción o el item específico. Nunca usa copy genérico como «¿Estás seguro?»."
        preview={<MStage>
          <div><MLabel>Confirmación (VoLTE)</MLabel><ConfirmModal title="Modo VoLTE activado" body="Para que la aplicación funcione correctamente, necesitas desactivar el modo VoLTE en la configuración de tu teléfono."><MBtn label="Ahora no" variant="outline" className="flex-1" /><MBtn label="Ir a ajustes" className="flex-1" /></ConfirmModal></div>
          <div><MLabel>Destructiva (nombra el item)</MLabel><ConfirmModal title="Eliminar orden" body="Al eliminar la orden, perderás su información y no se podrá recuperar. ¿Estás seguro de querer eliminarla?"><MBtn label="Cancelar" variant="outline" className="flex-1" /><MBtn label="Confirmar" variant="danger" className="flex-1" /></ConfirmModal></div>
        </MStage>} />
      <MRules rules={data.rules} />
    </>
  );
}
