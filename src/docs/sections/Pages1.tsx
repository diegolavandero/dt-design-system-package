import { Card, SectionHeader } from '../ui';
import { Icon } from '../icons';
import { Bell, TopbarHelp, SettingsSidebar, type SbItem } from './shared';
import { BigBadgeCtx, DemoTable } from './Components7';
import { FilterField, FltBtn, FltIconBtn, type FField } from './filters-kit';
import { cn } from '@/ds/lib/cn';
import { useI18n } from '../i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Head = { title: string; titleKey?: string; description?: string };
const BASE = import.meta.env.BASE_URL;

/** Topbar de Last Mile (sin radio, flush) usado en las páginas. */
export function LmTopbar() {
  return (
    <div className="flex h-[52px] items-center overflow-hidden bg-indigo pl-[22px]">
      <img src={`${BASE}sections/assets/logos/lastmile-desktop-white.svg`} height={18} alt="LastMile" className="block h-[18px]" />
      <div className="ml-auto flex items-center gap-7">
        <Icon name="apps" size={18} color="#fff" /><TopbarHelp /><Icon name="messages" size={18} color="#fff" /><Bell><Icon name="alerts" size={18} color="#fff" /></Bell><Icon name="user" size={18} color="#fff" />
      </div>
      <div className="ml-5 flex h-[52px] w-[98px] shrink-0 items-center justify-center rounded-tl-[20px] bg-white text-[11px] font-bold text-indigo">ACME CO</div>
    </div>
  );
}

const NAV: SbItem[] = [
  { icon: 'report-data', label: 'Resumen' }, { icon: 'dashboard', label: 'Actividad' }, { icon: 'network-3', label: 'Rutas' }, { icon: 'document-multiple', label: 'Órdenes' },
  { icon: 'delivery', label: 'Flota' }, { icon: 'chart-column', label: 'Estadísticas' }, { icon: 'notification', label: 'Alertas' }, { icon: 'events', label: 'Clientes' },
  { icon: 'file-system', label: 'Documentos' }, { icon: 'currency', label: 'Módulo de Costos' }, { icon: 'return', label: 'Logística inversa' }, { icon: 'white-paper', label: 'Rendición de Documentos' },
  { icon: 'store', label: 'Retiro en tienda' }, { icon: 'document-import', label: 'Importar' }, { divider: true }, { icon: 'settings', label: 'Ajustes' },
];
/** Sidebar colapsada (52px) que se expande al hover; plana con borde derecho. */
export function PageSidebar({ activeNav = 'document-multiple', isAdmin }: { activeNav?: string; isAdmin?: boolean }) {
  const items = isAdmin ? [...NAV, { icon: 'education', label: 'Monitoreo de tutoriales' }] : NAV;
  return (
    <div className="group/sb w-[52px] shrink-0 cursor-default overflow-hidden border-r border-n-3 bg-white py-2 transition-[width] duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)] hover:w-60">
      {items.map((it, i) => {
        if (it.divider) return <div key={i} className="mx-3.5 my-1 h-px bg-[#E9ECF2]" />;
        const sel = it.icon === activeNav;
        return (
          <div key={i} className="group/row flex h-10 cursor-pointer items-center">
            <div className={cn('h-10 w-1.5 shrink-0', sel ? 'bg-[#0052CC]' : 'bg-transparent')} />
            <div className={cn('flex h-10 flex-1 items-center overflow-hidden transition-colors duration-[120ms]', sel ? 'bg-[rgba(75,130,250,.08)]' : 'group-hover/row:bg-[rgba(75,130,250,.04)]')}>
              <div className="flex w-[46px] shrink-0 items-center justify-center"><Icon name={it.icon ?? 'apps'} size={18} color={sel ? '#0052CC' : '#4B82FA'} className="block" /></div>
              <span className={cn('flex-1 overflow-hidden whitespace-nowrap text-[13px] leading-none opacity-0 transition-opacity delay-[60ms] duration-[180ms] group-hover/sb:opacity-100', sel ? 'font-semibold text-[#0052CC]' : 'text-[#39414D]')}>{it.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const PILL = 'inline-flex h-8 cursor-pointer items-center gap-[5px] rounded-[50px] text-[14px] font-bold leading-none box-border';
const Chev = ({ d }: { d: string }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={d} /></svg>;
const PG = 'inline-flex h-7 min-w-7 cursor-pointer items-center justify-center rounded-[4px] border bg-white text-xs';

function MainContent({ data }: { data: any }) {
  const fields = (data.filterFields ?? []) as FField[];
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-hidden bg-n-2 px-6 pb-4 pt-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[22px] font-bold leading-none text-n-7">{data.pageTitle}</span>
        <div className="flex shrink-0 items-center gap-3">
          <button className={cn(PILL, 'border border-b-6 bg-white px-3 text-[#4B82FA]')}><Icon name="plan" size={13} color="#4B82FA" />{data.buttons?.log || 'Bitácora'}</button>
          <button className={cn(PILL, 'border border-b-6 bg-white px-3 text-[#4B82FA]')}><Icon name="download" size={13} color="#4B82FA" />{data.buttons?.export || 'Exportar a excel'}</button>
          <button className={cn(PILL, 'border-0 bg-b-6 px-3.5 text-white')}><svg width="13" height="13" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="3"><line x1="16" y1="6" x2="16" y2="26" /><line x1="6" y1="16" x2="26" y2="16" /></svg>{data.buttons?.create || 'Nueva orden'}</button>
        </div>
      </div>
      <div className="flex flex-col gap-5 rounded-lg border border-n-4 bg-white p-5">
        <div className="flex items-center gap-2">
          {fields.map((f, i) => <FilterField key={i} f={f} value="" onChange={() => undefined} />)}
          <FltBtn>{data.filterBtnLabel || 'Filtrar'}</FltBtn><FltIconBtn kind="add" /><FltIconBtn kind="reset" />
        </div>
        <div className="overflow-hidden rounded-[4px] border border-n-4"><BigBadgeCtx.Provider value><DemoTable def={data.scrollDemo ?? {}} /></BigBadgeCtx.Provider></div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <button className={cn(PG, 'w-7 border-n-3')}><Chev d="15 18 9 12 15 6" /></button>
        <button className={cn(PG, 'border-b-6 !bg-b-6 font-bold text-white')}>1</button>
        {[2, 3].map((n) => <button key={n} className={cn(PG, 'border-n-3 font-medium text-n-6')}>{n}</button>)}
        <button className={cn(PG, 'w-7 border-n-3')}><Chev d="9 18 15 12 9 6" /></button>
      </div>
    </div>
  );
}

export function TablePage({ data }: { data: Head & any }) {
  const { t } = useI18n();
  return (
    <>
      <SectionHeader data={data} />
      <h3 className="mb-2 mt-0 text-[15px] font-bold leading-[normal] text-n-7">{t('ui.standardSidebar', 'Sidebar estándar')}</h3>
      <Card flush className="mb-7 overflow-hidden !rounded-lg">
        <LmTopbar />
        <div className="flex min-h-[540px]"><PageSidebar activeNav={data.activeNav} isAdmin={data.isAdmin} /><MainContent data={data} /></div>
      </Card>
      <h3 className="mb-2 mt-0 text-[15px] font-bold leading-[normal] text-n-7">{t('ui.settingsSidebar', 'Sidebar de ajustes')}</h3>
      <p className="mb-3 text-xs leading-[normal] text-n-5">{t('ui.settingsSidebarDesc', 'Misma tabla — panel de ajustes empuja el contenido a la derecha.')}</p>
      <Card flush className="mb-7 overflow-hidden !rounded-lg">
        <LmTopbar />
        <SettingsSidebar product={data.lmProduct ?? {}}><MainContent data={data} /></SettingsSidebar>
      </Card>
    </>
  );
}
