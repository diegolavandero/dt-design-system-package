import { useState, type ReactNode } from 'react';
import { Card, CardHeader, SectionHeader, UsageCard } from '../ui';
import { BigBadgeCtx, DemoTable } from './Components7';
import { FilterField, FltBtn, FltIconBtn, applyFilters, ClassBar, type FField, type FValues } from './filters-kit';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };
/* eslint-disable @typescript-eslint/no-explicit-any */
interface FiltersData extends Head { fields?: FField[]; filterBtnLabel?: string; scrollDemo?: any; rules?: string[]; pageUsage?: string }

const OV: FField[] = [
  { type: 'select', placeholder: 'Zona', colIdx: 4, options: ['Zona Norte', 'Zona Sur', 'Zona Este', 'Zona Centro'] },
  { type: 'select', placeholder: 'Calificación', colIdx: 10, options: ['5 estrellas', '4 estrellas', '3 estrellas', '1-2 estrellas'] },
  { type: 'text', placeholder: 'Código de orden', colIdx: 1 },
];
const CloseIc = <svg viewBox="0 0 32 32" width="14" height="14" fill="var(--n5)"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6z" /></svg>;
const Panel = ({ n, onClose, children }: { n: number; onClose?: () => void; children: ReactNode }) => (
  <div className="rounded-lg border border-n-4 bg-white p-4">
    <div className="mb-2 flex h-[18px] items-center justify-between"><span className="text-[13px] font-bold uppercase leading-none tracking-[.04em] text-b-7">Otros filtros ({n})</span><button type="button" onClick={onClose} className="flex cursor-pointer items-center border-0 bg-transparent p-0 leading-[0]">{CloseIc}</button></div>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);
const H = ({ children, mt = 24 }: { children: ReactNode; mt?: number }) => <h3 className="mb-1.5 text-[15px] font-bold leading-[normal] text-n-7" style={{ marginTop: mt }}>{children}</h3>;
const Cap = ({ children }: { children: ReactNode }) => <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase leading-[normal] tracking-[.04em] text-n-5">{children}</div>;

/** Demo funcional: barra + tabla filtrable. `overflow` agrega el panel de filtros extra. */
function LiveBar({ fields, label, def, overflow, mobile }: { fields: FField[]; label: string; def: any; overflow?: boolean; mobile?: boolean }) {
  const main = mobile ? fields.slice(0, 1) : fields;
  const extra: FField[] = overflow ? [...(mobile ? fields.slice(1) : []), ...OV] : [];
  const all = [...main, ...extra];
  const [vals, setVals] = useState<FValues>({});
  const [applied, setApplied] = useState(false);
  const [openOv, setOpenOv] = useState(false);
  const set = (i: number) => (v: string) => setVals((s) => ({ ...s, [i]: v }));
  const hasActive = extra.some((_, k) => (vals[main.length + k] ?? '').trim());
  const rows = applyFilters(def.rows ?? [], all, vals, applied);
  const reset = () => { setVals({}); setApplied(false); setOpenOv(false); };
  return (
    <>
      <div className={cn('flex flex-col rounded-lg border border-n-4 bg-white p-5', overflow ? 'gap-3' : 'gap-5', mobile ? 'max-w-[400px]' : 'mb-7')}>
        <ClassBar>
          {main.map((f, i) => <FilterField key={i} f={f} value={vals[i] ?? ''} onChange={set(i)} />)}
          <FltBtn onClick={() => setApplied(true)}>{label}</FltBtn>
          <FltIconBtn kind="add" onClick={overflow ? () => setOpenOv(!openOv) : undefined} badge={overflow && hasActive} />
          <FltIconBtn kind="reset" onClick={reset} />
        </ClassBar>
        {overflow && openOv && <Panel n={extra.length} onClose={() => setOpenOv(false)}>{mobile ? extra.map((f, k) => <div key={k} className="flex"><FilterField f={f} value={vals[main.length + k] ?? ''} onChange={set(main.length + k)} /></div>) : <div className="flex gap-2">{extra.map((f, k) => <FilterField key={k} f={f} value={vals[main.length + k] ?? ''} onChange={set(main.length + k)} />)}</div>}</Panel>}
        {!mobile && <div className="overflow-hidden rounded-[4px] border border-n-4"><BigBadgeCtx.Provider value><DemoTable def={{ ...def, rows }} /></BigBadgeCtx.Provider></div>}
      </div>
    </>
  );
}

/* barras estáticas */
const SInp = () => <div className="box-border flex h-8 min-w-0 flex-1 items-center rounded-md border border-n-3 bg-white px-2.5"><span className="text-base text-n-5">Label</span></div>;
const SSel = () => <div className="box-border flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-between gap-1.5 rounded-md border border-n-3 bg-white px-2.5"><span className="flex-1 truncate text-base text-n-5">Label</span><svg viewBox="0 0 32 32" width="11" height="11" fill="var(--n5)" className="shrink-0"><path d="M16 22L4 10l1.5-1.5L16 19l10.5-10.5L28 10z" /></svg></div>;
const SBar = ({ kids, add, badge }: { kids: ReactNode; add?: boolean; badge?: boolean }) => (
  <div className="flex items-center gap-2 rounded-lg border border-n-4 bg-white px-4 py-3">{kids}<FltBtn>Filtrar</FltBtn>{add && <FltIconBtn kind="add" badge={badge} />}<FltIconBtn kind="reset" /></div>
);
const Row = ({ label, gap = 6, children }: { label: string; gap?: number; children: ReactNode }) => <div className="flex flex-col" style={{ gap }}><span className="text-xs font-semibold leading-[normal] text-n-5">{label}</span>{children}</div>;

export function Filters({ data }: { data: FiltersData }) {
  const fields = data.fields ?? [];
  const label = data.filterBtnLabel || 'Filtrar';
  const def = data.scrollDemo ?? {};
  const four = <>{<SInp />}{<SSel />}{<SInp />}{<SSel />}</>;
  return (
    <>
      <SectionHeader data={data} />
      <UsageCard snippet={data.pageUsage} />
      <h3 className="mb-2.5 text-[15px] font-bold leading-[normal] text-n-7">Filter bar · live demo</h3>
      <LiveBar fields={fields} label={label} def={def} />

      <H>Filter bar variants</H>
      <p className="mb-4 text-[13px] leading-[1.6] text-n-5">La barra muestra hasta <strong>4 filtros</strong> en línea. Si hay más de 4, los adicionales se agrupan en el panel de overflow activado con el botón <em>Agregar filtros</em>. Si hay filtros activos en el overflow, aparece un punto rojo sobre ese botón.</p>
      <Card className="flex flex-col gap-5">
        <Row label="1 filtro"><SBar kids={<SInp />} /></Row>
        <Row label="2 filtros"><SBar kids={<><SInp /><SSel /></>} /></Row>
        <Row label="3 filtros"><SBar kids={<><SInp /><SSel /><SInp /></>} /></Row>
        <Row label="4 filtros — máximo visible sin overflow"><SBar kids={four} /></Row>
        <Row label="5+ filtros — botón overflow sin filtros activos en el panel" gap={4}><SBar kids={four} add /></Row>
        <Row label="5+ filtros — hay filtros activos en el panel (punto rojo)" gap={4}><SBar kids={four} add badge /></Row>
        <Row label="Panel de overflow abierto — 8 filtros adicionales" gap={4}>
          <SBar kids={four} add badge />
          <div className="mt-1"><Panel n={8}>{[0, 1].map((r) => <div key={r} className="flex gap-2"><SInp /><SInp /><SInp /><SInp /></div>)}</Panel></div>
        </Row>
      </Card>

      <H>5+ filtros · live preview</H>
      <p className="mb-4 text-[13px] leading-[1.6] text-n-5">Todos los inputs y botones son funcionales. <strong>Desktop</strong>: 4 campos visibles + overflow. <strong>Mobile</strong>: solo el primer campo visible; todos los demás van al panel de overflow.</p>
      <Cap><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>Desktop</Cap>
      <LiveBar fields={fields} label={label} def={def} overflow />
      <Cap><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>Mobile — solo el primer filtro visible</Cap>
      <LiveBar fields={fields} label={label} def={def} overflow mobile />

      <H>Icon buttons</H>
      <Card className="mb-7 flex flex-wrap items-start gap-8">
        {(['add', 'reset'] as const).map((k) => (
          <div key={k} className="flex flex-col items-center gap-2"><div className="flex gap-2"><FltIconBtn kind={k} /></div><span className="text-[11px] font-semibold text-n-6">filter--{k}</span><span className="text-[10px] text-n-4">default · hover</span></div>
        ))}
      </Card>
      <Card flush>
        <CardHeader title="Tokens" />
        <div className="flex flex-col gap-1.5 px-4 py-3.5">{data.rules?.map((r) => <div key={r} className="text-[13px] leading-normal text-n-6">{r}</div>)}</div>
      </Card>
    </>
  );
}
