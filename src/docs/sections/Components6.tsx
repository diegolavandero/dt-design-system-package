import { useState, type ReactNode } from 'react';
import { Card, SectionHeader, TTable, TCode, Td, Banner } from '../ui';
import { DsAlert } from './Components2';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
interface Field { label: string; required?: boolean; state?: string; value?: string; helper?: string; type?: string }
interface ModalData extends Head {
  tokens?: Record<string, string>; mobileTokens?: Record<string, string>;
  preview?: { title?: string; subtitle?: string; fields?: Field[]; warning?: string; actions?: Array<{ label: string; type: string }> };
}
const CHEV = <svg viewBox="0 0 32 32" width="12" height="12" fill="currentColor" className="pointer-events-none shrink-0 text-n-5"><path d="M16 22L4 10l1.5-1.5L16 19l10.5-10.5L28 10z" /></svg>;
const X = (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const LBL = ({ f }: { f: Field }) => <label className="text-xs leading-4 text-n-7">{f.label}{f.required && <span className="ml-0.5 text-r-6">*</span>}</label>;
const Helper = ({ t }: { t?: string }) => t ? <p className="mb-0 mt-0.5 text-[11px] leading-[normal] text-n-5">{t}</p> : null;

function DsInput({ f }: { f: Field }) {
  const [v, setV] = useState(f.value ?? '');
  const [focus, setFocus] = useState(f.state === 'focus');
  const [hover, setHover] = useState(false);
  const border = focus ? '2px solid var(--b6)' : v ? '1px solid var(--n5)' : '1px solid var(--n3)';
  const bg = focus ? 'var(--b1)' : hover ? 'var(--n2)' : '#fff';
  return (
    <div className="mb-3.5 flex flex-col gap-1">
      <LBL f={f} />
      <input value={v} placeholder={f.label} onChange={(e) => setV(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        className="box-border h-8 w-full rounded-md px-2.5 text-base leading-5 text-n-7 outline-none" style={{ border, background: bg }} />
      <Helper t={f.helper} />
    </div>
  );
}
function DsSelect({ f }: { f: Field }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="mb-3.5 flex flex-col gap-1">
      <LBL f={f} />
      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="box-border flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-n-3 px-2.5" style={{ background: hover ? 'var(--n2)' : '#fff' }}>
        <span className="flex-1 text-base leading-5" style={{ color: f.value ? 'var(--n7)' : 'var(--n6)' }}>{f.value || f.label}</span>{CHEV}
      </div>
      <Helper t={f.helper} />
    </div>
  );
}
const Fields = ({ fields }: { fields: Field[] }) => <>{fields.map((f, i) => f.type === 'select' ? <DsSelect key={i} f={f} /> : <DsInput key={i} f={f} />)}</>;

function PillBtn({ type, label, flex }: { type: string; label: string; flex?: boolean }) {
  const pri = type === 'primary';
  return <button className={cn('box-border inline-flex h-10 cursor-pointer items-center justify-center rounded-[50px] px-6 text-base font-bold leading-none', flex && 'flex-1', pri ? 'border-0 bg-b-6 text-white hover:bg-b-7' : 'border border-b-6 bg-white text-[#4B82FA] hover:bg-[#EDF5FF]')}>{label}</button>;
}
const Actions = ({ actions, mobile }: { actions: Array<{ label: string; type: string }>; mobile?: boolean }) => (
  <div className={cn('mt-2 flex gap-2 border-t border-n-3 pt-4', !mobile && 'justify-end')}>{actions.map((a) => <PillBtn key={a.label} {...a} flex={mobile} />)}</div>
);

/* ── fondo "tabla" ── */
const ci = (d: string, fill: string, s = 16) => <svg viewBox="0 0 32 32" width={s} height={s} fill={fill}><path d={d} /></svg>;
const W = 'rgba(255,255,255,.7)';
const TOP = [
  'M8 4H4v4h4V4zm10 0h-4v4h4V4zm10 0h-4v4h4V4zM8 14H4v4h4v-4zm10 0h-4v4h4v-4zm10 0h-4v4h4v-4zM8 24H4v4h4v-4zm10 0h-4v4h4v-4zm10 0h-4v4h4v-4z',
  'M28 26H4v-2l2-2V15a10 10 0 017-9.5V5a3 3 0 016 0v.5A10 10 0 0127 15v7l2 2v2zm-12 4a3 3 0 003-3h-6a3 3 0 003 3z',
  'M16 2A14 14 0 102 16 14 14 0 0016 2zm0 26A12 12 0 114 16a12 12 0 0112 12zM17 22h-2v-2h2zm0-4h-2v-8h2z',
  'M16 4a6 6 0 110 12A6 6 0 0116 4zm0 14c6.6 0 12 2.7 12 6v2H4v-2c0-3.3 5.4-6 12-6z',
];
const SIDE: Array<[string, string]> = [
  ['M16 2L2 12v2h3v14h10v-8h2v8h10V14h3v-2z', 'var(--b5)'], ['M12 4H4v8h8V4zm16 0h-8v8h8V4zM12 20H4v8h8v-8zm16 0h-8v8h8v-8z', 'var(--b5)'],
  ['M28 6H4v2h24V6zM4 14h24v-2H4v2zm24 6H4v2h24v-2z', 'var(--b5)'], ['M26 6H6a2 2 0 00-2 2v16a2 2 0 002 2h20a2 2 0 002-2V8a2 2 0 00-2-2zm0 4H6V8h20v2zm0 14H6V13h20v11z', 'var(--b5)'],
  ['M27 16.76V16a11 11 0 10-11 11h.76a5.6 5.6 0 002.24 2H16A13 13 0 113 16a13 13 0 0113-13h.76z', 'var(--n4)'], ['M27 16.8V16a11 11 0 10-11 11h.8a5.6 5.6 0 012.2 2H16A13 13 0 113 16a13 13 0 0113-13h.8z', 'var(--n4)'],
];
const ROWS: Array<[string, string, string, string, string, string, string, string, number]> = [
  ['#ORD-4821', 'Maya Johnson', 'MJ', '#1F60ED', 'Entregado', '#00875A', 'Zona Norte', '10-10-25 14:00', 100],
  ['#ORD-3917', 'Lucas Martínez', 'LM', '#8777D9', 'En tránsito', '#1F60ED', 'Zona Sur', '—', 52],
  ['#ORD-5102', 'Aisha Patel', 'AP', '#00B8D9', 'Pendiente', '#FFAB00', 'Zona Este', '10-10-25 16:00', 20],
  ['#ORD-2856', 'Liam Smith', 'LS', '#36B37E', 'Cancelado', '#DE350B', 'Zona Centro', '08-10-25 11:00', 0],
  ['#ORD-6631', 'Sara López', 'SL', '#F27B42', 'Entregado', '#00875A', 'Zona Norte', '11-10-25 09:30', 100],
];
const TH = 'px-2.5 py-1.5 text-left text-[11px] font-bold leading-[normal] text-n-5';
const FBOX = 'flex h-7 flex-1 items-center rounded-md border border-n-3 px-2 text-xs leading-[normal] text-n-5';
const SMALL = 'h-7 cursor-default rounded-[50px] px-3 text-xs font-bold leading-[normal]';
function BgTablePage() {
  return (
    <>
      <div className="flex h-[52px] shrink-0 items-center bg-[#132045] px-4">
        <img src={`${import.meta.env.BASE_URL}sections/assets/logos/lastmile-desktop-white.svg`} height={16} alt="LastMile" className="mr-auto h-4 w-auto" />
        <div className="mr-3 flex items-center gap-[18px]">{TOP.map((d, i) => <span key={i} className="flex">{ci(d, W)}</span>)}</div>
        <div className="flex h-[52px] w-[72px] items-center justify-center rounded-tl-[14px] bg-white text-[10px] font-bold text-[#132045]">ACME CO</div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[52px] shrink-0 flex-col items-center gap-1.5 border-r border-n-3 bg-white py-3">
          {SIDE.map(([d, f], i) => <div key={i} className="flex h-9 w-9 items-center justify-center rounded-md" style={i === 3 ? { background: 'rgba(75,130,250,.08)' } : undefined}>{ci(d, f, 18)}</div>)}
        </div>
        <div className="flex-1 overflow-hidden bg-n-2 px-[18px] py-4">
          <div className="mb-3.5 flex items-center">
            <span className="flex-1 text-xl font-bold leading-none text-n-7">Órdenes</span>
            <div className="flex gap-2"><button className={cn(SMALL, 'border border-b-6 bg-white text-[#4B82FA]')}>Exportar</button><button className={cn(SMALL, 'border-0 bg-b-6 text-white')}>+ Nueva orden</button></div>
          </div>
          <div className="overflow-hidden rounded-lg border border-n-3 bg-white p-3.5">
            <div className="mb-3 flex gap-2">
              <div className={FBOX}>Cliente</div>
              <div className={cn(FBOX, 'justify-between')}>Estado {ci('M16 22L4 10l1.5-1.5L16 19l10.5-10.5L28 10z', 'var(--n5)', 10)}</div>
              <div className={FBOX}>F. Creación</div>
              <button className={cn(SMALL, 'border border-b-6 bg-white text-[#4B82FA]')}>Filtrar</button>
            </div>
            <table className="w-full border-collapse">
              <thead><tr className="border-b border-n-3 bg-n-2"><th className="w-4 px-2.5 py-1.5" />{['# Orden', 'Cliente', 'Estado', 'Zona', 'F. Entrega', 'Progreso'].map((h) => <th key={h} className={TH}>{h}</th>)}</tr></thead>
              <tbody>{ROWS.map(([o, n, ini, clr, b, bc, z, d, pr]) => (
                <tr key={o} className="border-b border-n-3">
                  <td className="w-4 px-2.5 py-2"><input type="checkbox" className="pointer-events-none accent-b-6" readOnly /></td>
                  <td className="px-2.5 py-2 text-sm leading-[normal] text-b-6">{o}</td>
                  <td className="px-2.5 py-2"><div className="flex items-center gap-[7px]"><div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: clr }}>{ini}</div><span className="text-sm leading-[normal] text-n-7">{n}</span></div></td>
                  <td className="px-2.5 py-2"><span className="rounded-full px-2 py-0.5 text-[11px] font-semibold leading-[normal] text-white" style={{ background: bc }}>{b}</span></td>
                  <td className="px-2.5 py-2 text-xs leading-[normal] text-n-7">{z}</td>
                  <td className="px-2.5 py-2 text-xs leading-[normal] text-n-5">{d}</td>
                  <td className="px-2.5 py-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-n-3"><div className="h-full rounded-full bg-b-5" style={{ width: `${pr}%` }} /></div></td>
                </tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function ModalBody({ p, mobile }: { p: NonNullable<ModalData['preview']>; mobile?: boolean }) {
  return (
    <>
      <div className="mb-1.5 flex items-start">
        <div className="flex-1">
          <h1 className={cn('mx-0 mb-1 mt-0 font-bold leading-[1.3] text-n-7', mobile ? 'text-[18px]' : 'text-[22px]')}>{p.title}</h1>
          <p className={cn('m-0 leading-[normal] text-n-5', mobile ? 'text-xs' : 'text-sm')}>{p.subtitle}</p>
        </div>
        <button className="mt-0.5 flex shrink-0 cursor-pointer border-0 bg-transparent p-0.5 text-n-5 hover:text-n-7">{X(mobile ? 16 : 18)}</button>
      </div>
      <div className={mobile ? 'mt-3.5' : 'mt-4'}>
        <Fields fields={p.fields ?? []} />
        {p.warning && <div className="mb-4"><DsAlert row={{ text: p.warning, hasClose: false }} type="warning" /></div>}
        <Actions actions={p.actions ?? []} mobile={mobile} />
      </div>
    </>
  );
}
const Lbl = ({ icon, title, note }: { icon: ReactNode; title: string; note: string }) => (
  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold leading-[normal] text-n-7">{icon}{title}<span className="ml-auto font-normal text-n-5">{note}</span></div>
);
const svg = (children: ReactNode) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{children}</svg>;

export function Modal({ data }: { data: ModalData }) {
  const p = data.preview ?? {}, t = data.tokens ?? {}, mt = data.mobileTokens ?? {};
  return (
    <>
      <SectionHeader data={data} />
      <div className="mb-5">
        <Lbl icon={svg(<><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>)} title="In use — modal sobre tabla page" note="Overlay rgba(19,32,69,.45) · modal 440px centrado" />
        <Card flush className="overflow-hidden">
          <div className="relative flex h-[500px] flex-col overflow-hidden">
            <BgTablePage />
            <div className="pointer-events-none absolute inset-0 bg-[rgba(19,32,69,.45)]" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
              <div className="pointer-events-auto w-[440px] max-w-[calc(100%-48px)] rounded-lg bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,.35)]"><ModalBody p={p} /></div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <Lbl icon={svg(<><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></>)} title="Desktop" note="500px wide · centered" />
          <Card flush>
            <div className="flex min-h-[520px] items-center justify-center rounded-lg bg-[rgba(19,32,69,.45)] px-6 py-8">
              <div className="w-[440px] max-w-full rounded-lg bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,.18)]"><ModalBody p={p} /></div>
            </div>
          </Card>
        </div>
        <div>
          <Lbl icon={svg(<><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>)} title="Mobile" note="inline actions · stacked if labels are long" />
          <Card flush>
            <div className="flex min-h-[560px] items-center justify-center rounded-lg bg-[rgba(19,32,69,.45)] px-4 py-6">
              <div className="w-[296px] rounded-[28px] bg-[#1a1a1a] p-2 shadow-[0_8px_24px_rgba(0,0,0,.4)]">
                <div className="relative overflow-hidden rounded-[22px] bg-n-2">
                  <div className="absolute left-1/2 top-1.5 z-[2] h-1 w-[60px] -translate-x-1/2 rounded-sm bg-[#1a1a1a]" />
                  <div className="mx-3.5 mb-3.5 mt-7 rounded-[10px] bg-white px-4 py-[18px] shadow-[0_4px_12px_rgba(0,0,0,.1)]"><ModalBody p={p} mobile /></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {mt.note && <Banner kind="in" className="mb-3.5">{mt.note}</Banner>}
      <h3 className="mb-2.5 mt-5 text-[15px] font-bold leading-[1.4] text-n-7">Design tokens</h3>
      <Card>
        <TTable head={['Token', 'Desktop', 'Mobile']}>{Object.entries(t).map(([k, v]) => <tr key={k}><Td><TCode>{k}</TCode></Td><Td><TCode>{String(v)}</TCode></Td><Td><TCode>{String(mt[k] ?? '—')}</TCode></Td></tr>)}</TTable>
      </Card>
    </>
  );
}
