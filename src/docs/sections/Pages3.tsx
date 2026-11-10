import { useState } from 'react';
import { SectionHeader } from '../ui';
import { useDrafts } from '../drafts-store';
import { cn } from '@/ds/lib/cn';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Head = { title: string; titleKey?: string; description?: string };

/* ───────────── BACKLOG ───────────── */
export function Backlog({ data }: { data: Head & any }) {
  const items: { label: string; description?: string }[] = data.items ?? [];
  return (
    <>
      <SectionHeader data={data} />
      <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-o-3 bg-o-1 px-4 py-3.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-px shrink-0 stroke-o-7" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <div>
          <div className="mb-0.5 text-[13px] font-bold leading-[normal] text-o-7">Componentes planificados — sin especificación aprobada</div>
          <div className="text-xs leading-normal text-o-7">Estos items están en el roadmap del DS pero aún no tienen diseño final ni están disponibles para uso en producción. Para proponer un componente nuevo, usá la sección <strong>Drafts</strong>.</div>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-n-3 bg-white px-4 py-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-n-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-n-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-[3px] text-[13px] font-bold leading-[normal] text-n-7">{it.label}</div>
              <div className="text-xs leading-normal text-n-5">{it.description || ''}</div>
            </div>
            <span className="h-5 shrink-0 whitespace-nowrap rounded-full border border-n-3 bg-n-2 px-2 text-[10px] font-semibold leading-5 text-n-5">Planned</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ───────────── DRAFTS ───────────── */
const OPTS: [string, string, string, string][] = [
  ['new', '➕ New section', 'Create a new nav section for this component.', 'New section'],
  ['existing', '📂 Existing section', 'Add it inside an existing DS section.', 'Existing section'],
  ['replace', '🔄 Replace existing component', 'This draft replaces a previous version of the same component.', 'Replace existing'],
];
const PILL = 'inline-flex cursor-pointer items-center whitespace-nowrap rounded-[50px] font-bold leading-[normal]';

export function Drafts({ data }: { data: Head & any }) {
  const { drafts, update } = useDrafts();
  const [active, setActive] = useState<number | null>(null);
  const [opt, setOpt] = useState<string | null>(null);
  const add = () => {
    const name = window.prompt('Component name:'); if (!name) return;
    const description = window.prompt('Short description:', '') || '';
    update((d) => [...d, { name, description, status: 'pending' }]);
  };
  const confirmApproval = () => {
    if (active === null || !opt) return;
    const label = OPTS.find((o) => o[0] === opt)![3];
    update((d) => d.map((x, i) => (i === active ? { ...x, status: 'approved', addedTo: label } : x)));
    setActive(null); setOpt(null);
  };
  const discard = (i: number) => { if (!window.confirm('Discard this draft? It will be removed.')) return; update((d) => d.filter((_, j) => j !== i)); };
  return (
    <>
      <SectionHeader data={data} />
      <div className="mt-1 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {!drafts.length && (
          <div className="col-span-full rounded-lg border border-n-3 bg-white px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-n-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="stroke-n-5" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg></div>
            <div className="mb-1 text-sm font-bold leading-[normal] text-n-6">No draft components</div>
            <div className="mx-auto mb-4 max-w-[320px] text-xs leading-[normal] text-n-5">When a new component is proposed it will appear here for review before entering the DS.</div>
            <button onClick={add} className={cn(PILL, 'h-8 gap-1.5 border-0 bg-b-6 px-4 text-[13px] text-white hover:bg-b-7')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add draft component
            </button>
          </div>
        )}
        {drafts.map((d, i) => {
          const ok = d.status === 'approved';
          return (
            <div key={i} className={cn('flex flex-col overflow-hidden rounded-[10px] border-[1.5px] bg-white transition-shadow duration-150 hover:shadow-[0_4px_16px_rgba(19,32,69,.1)]', ok ? 'border-solid border-g-5' : 'border-dashed border-o-5')}>
              <div className="flex min-h-[120px] items-center justify-center bg-n-2 p-6" dangerouslySetInnerHTML={{ __html: d.preview || '<span style="font-size:12px;color:var(--n5)">No preview</span>' }} />
              <div className="flex flex-1 flex-col gap-1.5 px-4 pb-2.5 pt-3.5">
                <span className={cn('inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[9px] font-bold uppercase leading-[normal] tracking-[.06em]', ok ? 'bg-g-1 text-g-7' : 'bg-o-1 text-[#7A4A00]')}>{ok ? '✓ Approved' : 'Pending review'}</span>
                {d.addedTo && <span className="text-[11px] leading-[normal] text-n-5">→ {d.addedTo}</span>}
                <div className="text-sm font-bold leading-[normal] text-n-7">{d.name}</div>
                <div className="flex-1 text-xs leading-normal text-n-5">{d.description}</div>
              </div>
              {!ok && (
                <div className="flex gap-2 px-4 pb-3.5 pt-2.5">
                  <button onClick={() => { setActive(i); setOpt(null); }} className={cn(PILL, 'h-[30px] gap-[5px] border-0 bg-g-6 px-3.5 text-xs text-white hover:bg-g-7')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Approve</button>
                  <button onClick={() => discard(i)} className={cn(PILL, 'h-[30px] gap-[5px] border border-r-6 bg-white px-3.5 text-xs text-r-6 hover:bg-r-1')}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Discard</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {active !== null && drafts[active] && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(19,32,69,.5)] p-5" onClick={(e) => e.target === e.currentTarget && setActive(null)}>
          <div className="w-full max-w-[460px] rounded-xl bg-white shadow-[0_12px_48px_rgba(19,32,69,.2)]">
            <div className="border-b border-n-3 px-5 pb-3.5 pt-5">
              <h4 className="m-0 mb-1 text-[15px] font-bold leading-[normal] text-n-7">Approve: {drafts[active].name}</h4>
              <p className="m-0 text-[13px] leading-[normal] text-n-5">Where do you want to add it to the Design System?</p>
            </div>
            <div className="flex flex-col gap-2.5 px-5 py-4">
              {OPTS.map(([v, t, desc]) => (
                <div key={v} onClick={() => setOpt(v)} className={cn('cursor-pointer rounded-lg border-[1.5px] px-3.5 py-3 transition-colors duration-[120ms] hover:border-b-6 hover:bg-b-1', opt === v ? 'border-b-6 bg-b-1' : 'border-n-3')}>
                  <div className="text-[13px] font-bold leading-[normal] text-n-7">{t}</div>
                  <div className="mt-0.5 text-xs leading-[normal] text-n-5">{desc}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 border-t border-n-3 px-5 py-3">
              <button onClick={() => setActive(null)} className={cn(PILL, 'h-8 border border-n-3 bg-white px-4 text-[13px] text-n-6')}>Cancel</button>
              <button disabled={!opt} onClick={confirmApproval} className={cn(PILL, 'h-8 border-0 bg-b-6 px-4 text-[13px] text-white', opt ? 'opacity-100' : 'cursor-default opacity-40')}>Confirm approval</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
