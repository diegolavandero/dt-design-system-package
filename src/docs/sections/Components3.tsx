import { useState, type ReactNode } from 'react';
import { CopyCode, SectionHeader, TabCard, TCode, Td, TTable } from '../ui';
import { cn } from '@/ds/lib/cn';

type Head = { title: string; titleKey?: string; description?: string };

/* Interruptor `.swt` */
export function Switch({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div onClick={() => setOn(!on)} className={cn('relative h-[19px] w-8 shrink-0 cursor-pointer rounded-full', on ? 'bg-b-6' : 'bg-n-4')}>
      <span className="absolute top-0.5 h-[15px] w-[15px] rounded-full bg-white shadow-[0_1px_2px_rgba(19,32,69,.2)] transition-[left] duration-150" style={{ left: on ? 15 : 2 }} />
    </div>
  );
}

/* ───────────── TOOLTIP ───────────── */
const OUT = 'M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28ZM17,22H15V14h2ZM16,10a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,10Z';
const FIL = 'M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm-1,8h2v2H15Zm4,14H13V22h2V16H13V14h4v8h2Z';
const Ico = ({ d }: { d: string }) => <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" className="shrink-0 text-n-5"><path d={d} /></svg>;

type Dir = 'top' | 'bottom' | 'left' | 'right';
const POS: Record<Dir, string> = {
  top: 'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  bottom: 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  left: 'right-[calc(100%+8px)] top-1/2 -translate-y-1/2',
  right: 'left-[calc(100%+8px)] top-1/2 -translate-y-1/2',
};
const ARROW: Record<Dir, string> = {
  top: 'left-1/2 top-full -translate-x-1/2 border-x-[5px] border-t-[5px] border-x-transparent border-t-n-7',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-x-[5px] border-b-[5px] border-x-transparent border-b-n-7',
  left: 'left-full top-1/2 -translate-y-1/2 border-y-[5px] border-l-[5px] border-y-transparent border-l-n-7',
  right: 'right-full top-1/2 -translate-y-1/2 border-y-[5px] border-r-[5px] border-y-transparent border-r-n-7',
};
const BUBBLE = 'absolute whitespace-normal rounded-md bg-n-7 px-3 py-2.5 text-xs leading-4 text-white';
function Bubble({ dir, children, className, style }: { dir: Dir; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn(BUBBLE, POS[dir], 'w-[200px]', className)} style={style}>
      {children}
      <div className={cn('absolute h-0 w-0', ARROW[dir])} />
    </div>
  );
}
function HoverTip({ text, dir = 'top' }: { text: string; dir?: Dir }) {
  const [on, setOn] = useState(false);
  return (
    <span className="relative inline-flex cursor-default items-center" onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}>
      <Ico d={on ? FIL : OUT} />
      <Bubble dir={dir} className="pointer-events-none z-10 transition-opacity duration-150" style={{ opacity: on ? 1 : 0, visibility: on ? 'visible' : 'hidden' }}>{text}</Bubble>
    </span>
  );
}

const subHead = 'mb-6 border-b-2 border-n-3 pb-3.5 text-xl font-bold leading-6 text-n-7';
const SubHead = ({ children }: { children: ReactNode }) => <div className={subHead} style={{ fontSize: 18 }}>{children}</div>;
const CardLabel = ({ children }: { children: ReactNode }) => <div className="mb-2.5 text-[11px] font-semibold uppercase leading-4 tracking-[.07em] text-n-5">{children}</div>;
const box = 'rounded-lg border border-n-3 bg-white';
const lbl14 = 'flex items-center gap-1.5 text-base leading-5 text-n-7';
const inputCls = 'box-border h-8 w-full rounded-md border border-n-3 bg-white px-2.5 text-base text-n-7 outline-none focus:border-2 focus:border-b-6 focus:bg-b-1';
const hint = 'm-0 mt-0.5 text-[11px] text-n-5';

const PIN = 'M16.5 1.5C24.78 1.5 31.5 8.22 31.5 16.5C31.5 21.44 29.11 25.82 25.43 28.55C22.61 30.67 18.58 34.04 17.66 39.48C17.56 40.05 17.08 40.5 16.5 40.5C15.92 40.5 15.44 40.05 15.34 39.48C14.42 34.04 10.39 30.67 7.56 28.55C3.88 25.82 1.5 21.44 1.5 16.5C1.5 8.22 8.22 1.5 16.5 1.5Z';
const Pin = ({ fill, num }: { fill: string; num: string }) => (
  <div className="relative inline-block cursor-pointer leading-[0] [filter:drop-shadow(0_2px_4px_rgba(19,32,69,.25))]">
    <svg width="33" height="42" viewBox="0 0 33 42"><path d={PIN} fill={fill} stroke="#fff" strokeWidth="2" /><text x="16.5" y="17" textAnchor="middle" dominantBaseline="central" fontFamily="DM Sans,sans-serif" fontWeight="700" fontSize="13" fill="#fff">{num}</text></svg>
  </div>
);
const PinTip = ({ title, sub }: { title: string; sub: string }) => (<><div className="mb-1 text-xs font-bold leading-4">{title}</div><div className="text-white/75">{sub}</div></>);

function PinHover({ fill, num }: { fill: string; num: string }) {
  const [open, setOpen] = useState(false);
  const unassigned = fill === '#8FA0BA';
  return (
    <span className="relative inline-flex cursor-pointer" onClick={() => setOpen((v) => !v)}>
      <Bubble dir="top" className="pointer-events-none z-10 !w-[180px] transition-opacity duration-150" style={{ opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden' }}>
        {unassigned ? <PinTip title="Sin asignar" sub="Sin conductor" /> : <PinTip title={`#ORD-${3900 + parseInt(num) * 11} · Parada ${num}`} sub={`Av. Secundaria ${num}${num}5`} />}
      </Bubble>
      <Pin fill={fill} num={num} />
    </span>
  );
}

export function Tooltip({ data }: { data: Head & { content?: string; code?: string; tokens?: Record<string, string> } }) {
  const text = data.content || 'Tooltip content';
  const [persist, setPersist] = useState(true);
  const preview = (
    <div className="bg-n-1 p-8">
      <div className="mb-10">
        <SubHead>Info icon</SubHead>
        <div className="flex flex-wrap gap-4">
          <div className={cn(box, 'flex flex-col gap-3 px-5 py-4')}><CardLabel>Default</CardLabel><div className={lbl14}>Label <Ico d={OUT} /></div></div>
          <div className={cn(box, 'flex flex-col gap-3 px-5 py-4')}>
            <CardLabel>Hover</CardLabel>
            <div className="relative pt-[74px]"><div className={lbl14}>Label<div className="relative inline-flex items-center"><Bubble dir="top" className="z-[4]">{text}</Bubble><Ico d={FIL} /></div></div></div>
          </div>
          <div className={cn(box, 'flex flex-col gap-3 px-5 py-4')}>
            <CardLabel>Interactive — hover me</CardLabel>
            <div className="relative pt-[74px]"><div className={lbl14}>Label <HoverTip text={text} /></div></div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <SubHead>Placements</SubHead>
        <div className="flex flex-wrap gap-3">
          {(['top', 'bottom', 'left', 'right'] as Dir[]).map((p) => {
            const h = { top: 160, bottom: 160, left: 60, right: 60 }[p];
            const align = { top: 'items-end justify-center pb-5', bottom: 'items-start justify-center pt-5', left: 'items-center justify-end pr-5', right: 'items-center justify-start pl-5' }[p];
            return (
              <div key={p} className={cn(box, 'min-w-[260px] flex-1 px-5 py-4')}>
                <CardLabel>{p}</CardLabel>
                <div className={cn('relative flex overflow-visible', align)} style={{ height: h }}>
                  <div className="relative inline-flex items-center"><Bubble dir={p} className="pointer-events-none z-[4]">{text}</Bubble><Ico d={FIL} /></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <SubHead>Persistent (with close)</SubHead>
        <p className="m-0 mb-5 text-sm text-n-5">Click the icon to open. Tooltip stays visible until the user closes it with ×.</p>
        <div className={cn(box, 'inline-flex p-5')}>
          <div className="relative pt-[74px]">
            <div className={lbl14}>
              Label
              <div className="relative inline-flex cursor-pointer items-center" onClick={() => setPersist((v) => !v)}>
                {persist && (
                  <Bubble dir="top" className="z-[2] !pr-7">
                    {text}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPersist(false); }} className="absolute right-2 top-2 flex cursor-pointer items-center border-0 bg-transparent p-0.5 leading-none text-white opacity-60 hover:opacity-100">
                      <svg viewBox="0 0 32 32" width="10" height="10" fill="currentColor"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6z" /></svg>
                    </button>
                  </Bubble>
                )}
                <Ico d={persist ? FIL : OUT} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <SubHead>Input field + info icon</SubHead>
        <p className="m-0 mb-5 text-sm text-n-5">Tooltip on the info icon explains the purpose or constraints of the field. Hover the icon to activate.</p>
        <div className="flex flex-wrap gap-3">
          <div className={cn(box, 'min-w-[260px] flex-1 p-5')}>
            <CardLabel>Icon next to label</CardLabel>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-[5px]"><label className="text-xs leading-4 text-n-7">Nombre de usuario</label><HoverTip text={text} /></div>
              <input type="text" placeholder="walter.wallace" className={inputCls} />
              <p className={hint}>No debe contener espacios.</p>
            </div>
          </div>
          <div className={cn(box, 'min-w-[260px] flex-1 p-5')}>
            <CardLabel>Icon inside input</CardLabel>
            <div className="flex flex-col gap-1">
              <label className="text-xs leading-4 text-n-7">Contraseña</label>
              <div className="relative">
                <input type="password" placeholder="••••••••" className={cn(inputCls, '!pr-8')} />
                <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2"><HoverTip text={text} /></div>
              </div>
              <p className={hint}>Mínimo 4 caracteres.</p>
            </div>
          </div>
          <div className={cn(box, 'min-w-[260px] flex-1 p-5')}>
            <CardLabel>Switch row</CardLabel>
            <div className="flex items-center gap-2"><span className="flex-1 text-base text-n-7">Crear órdenes nuevas</span><HoverTip text={text} /><Switch /></div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <SubHead>Map pin tooltip</SubHead>
        <p className="m-0 mb-5 text-sm text-n-5">Tooltip appears above the pin on hover — shows order or stop details without opening a panel.</p>
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[240px] flex-1 rounded-lg border border-n-3 bg-n-2 px-7 py-6">
            <CardLabel>Hover (static preview)</CardLabel>
            <div className="flex justify-center pt-20">
              <div className="relative inline-flex">
                <Bubble dir="top" className="z-[4] !w-[180px]"><PinTip title="#ORD-4821 · Maya Johnson" sub="Av. Principal 123 · Zona Norte" /></Bubble>
                <Pin fill="#1F60ED" num="4" />
              </div>
            </div>
          </div>
          <div className="min-w-[240px] flex-1 rounded-lg border border-n-3 bg-n-2 px-7 py-6">
            <CardLabel>Interactive — hover the pin</CardLabel>
            <div className="flex justify-center gap-8 pt-20">
              {([['#1F60ED', '4'], ['#00B8D9', '7'], ['#8FA0BA', '·']] as const).map(([f, n]) => <PinHover key={n} fill={f} num={n} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <SectionHeader data={data} />
      <TabCard tabs={[
        { label: 'Preview', content: preview },
        { label: 'Code', content: <CopyCode text={data.code ?? ''} flat>{data.code}</CopyCode> },
        { label: 'Tokens', content: <div className="p-4"><TTable head={['Token', 'Value']}>{Object.entries(data.tokens ?? {}).map(([k, v]) => <tr key={k}><Td><TCode>{k}</TCode></Td><Td><TCode>{String(v)}</TCode></Td></tr>)}</TTable></div> },
      ]} />
    </>
  );
}
