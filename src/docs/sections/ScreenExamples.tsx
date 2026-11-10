import { cn } from '@/ds/lib/cn';

/* eslint-disable @typescript-eslint/no-explicit-any */
const STATUS: Record<string, string> = {
  paid: 'bg-g-1 text-g-6', applied: 'bg-g-1 text-g-6', pending: 'bg-o-1 text-o-7', upcoming: 'bg-n-2 text-n-7', overdue: 'bg-r-1 text-r-6',
};
const SIDE = [
  { d: 'M22 12h-4l-3 9L9 3l-3 9H2', active: true },
  { d: 'M1 3h15v13H1zM16 8l4-2 2 2v9H16V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z' },
  { d: 'M18 20V10M12 20V4M6 20v-6' },
  { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' },
  { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6' },
  { d: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18' },
];
const TopIco = ({ children }: { children: React.ReactNode }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="2">{children}</svg>;
const Chk = ({ on }: { on?: boolean }) => <div className={cn('flex h-[17px] w-[17px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border-[1.5px]', on ? 'border-b-6 bg-b-6' : 'border-n-4 bg-white')}>{on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}</div>;
const Chev = ({ d, c = 'var(--n5)' }: { d: string; c?: string }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polyline points={d} /></svg>;
const BTN = 'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-solid px-4 text-[14px] font-bold leading-8 transition-colors duration-[120ms]';
const Sec = ({ children, className }: { children: React.ReactNode; className?: string }) => <button className={cn(BTN, 'border-n-4 bg-white text-b-7 hover:bg-n-1 active:border-b-6 active:bg-b-1 active:text-b-6', className)}>{children}</button>;
const INP = 'flex h-10 items-center rounded-[4px] border border-n-3 bg-white px-3.5';
const PG = 'flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] border border-n-3 bg-white p-0';
const TH = 'whitespace-nowrap border-b border-n-4 bg-n-3 px-4 py-2.5 text-left text-[13px] font-bold text-n-7 min-w-[110px]';
const TD = 'min-w-[110px] whitespace-nowrap border-b border-n-3 px-4 py-2.5 align-middle group-last/row:border-b-0';

export function ScreenExamples({ data }: { data: any }) {
  const rows: any[] = data.rows ?? [];
  return (
    <>
      <h1 className="m-0 mb-1.5 text-[28px] font-bold leading-[1.2] tracking-[-.01em] text-n-7">{data.title}</h1>
      <p className="m-0 mb-7 max-w-[660px] text-[14px] leading-[1.6] text-n-5">{data.description}</p>
      <h3 className="m-0 mb-3 text-[15px] font-bold leading-[normal] text-n-7">{data.screenTitle || 'Invoice list'}</h3>
      <div className="mb-3.5 overflow-hidden rounded-lg border border-n-3 bg-white">
        <div className="flex h-[52px] shrink-0 items-center gap-3.5 bg-indigo px-5">
          <span className="text-[15px] font-bold leading-[normal] tracking-[-.01em] text-white">DispatchTrack</span>
          <span className="text-[14px] text-white/30">|</span>
          <span className="text-[13px] font-bold leading-[normal] text-[#F27B42]">lastmile</span>
          <div className="flex-1" />
          <TopIco><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></TopIco>
          <TopIco><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></TopIco>
          <TopIco><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></TopIco>
          <div className="relative"><TopIco><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></TopIco><span className="absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rounded-full border-2 border-indigo bg-r-5" /></div>
          <TopIco><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></TopIco>
        </div>
        <div className="flex min-h-[520px]">
          <div className="flex w-[52px] shrink-0 flex-col items-center gap-1.5 border-r border-n-3 bg-white py-4">
            {SIDE.map((ic, i) => (
              <div key={i} className={cn('relative flex h-9 w-9 items-center justify-center rounded-lg', ic.active && 'bg-b-1')}>
                {ic.active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-[3px] bg-b-5" />}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ic.active ? 'var(--b6)' : 'var(--n5)'} strokeWidth="2"><path d={ic.d} /></svg>
              </div>
            ))}
            <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--n5)" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></svg></div>
          </div>
          <div className="min-w-0 flex-1 bg-n-1 px-8 py-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h1 className="m-0 text-[24px] font-bold leading-[1.2] text-n-7">{data.pageTitle || 'Invoices'}</h1>
              <div className="flex gap-2">
                <Sec>{data.secondaryBtn || 'Secondary'}</Sec>
                <button className={cn(BTN, 'border-transparent bg-b-6 text-white hover:bg-[#1F60ED] active:bg-b-7')}>{data.primaryBtn || 'Primary'}</button>
              </div>
            </div>
            <div className="mb-3.5 flex flex-wrap gap-2">
              <div className={cn(INP, 'min-w-[130px] max-w-[210px] flex-1')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--n5)" strokeWidth="2" className="flex shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input placeholder="Document" className="ml-2 min-w-0 flex-1 border-0 bg-transparent text-[13px] text-n-7 outline-0 placeholder:text-n-5" />
              </div>
              <div className={cn(INP, 'min-w-[130px] max-w-[210px] flex-1')}><input placeholder="Account" className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-n-7 outline-0 placeholder:text-n-5" /></div>
              {['Status', 'Currency'].map((l) => (
                <div key={l} className={cn(INP, 'min-w-[120px] max-w-[170px] flex-1 cursor-pointer justify-between')}><span className="text-[13px] text-n-5">{l}</span><Chev d="6 9 12 15 18 9" /></div>
              ))}
              <Sec className="shrink-0">Filter</Sec>
              <Sec className="shrink-0 !px-2.5 !py-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></Sec>
            </div>
            <div className="overflow-hidden rounded-lg border border-n-3 bg-white">
              <table className="w-full border-collapse text-[13px] text-n-7">
                <thead>
                  <tr>
                    <th className={cn(TH, '!w-8 !min-w-10 !py-[9px] !pl-4 !pr-2')}><Chk /></th>
                    {['Document', 'Status', 'Total amount', 'Pending amount', 'Currency', 'Account', 'Due date'].map((h) => <th key={h} className={TH}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="group/row">
                      <td className={cn(TD, '!py-[9px] !pl-4 !pr-2')}><Chk on={r.checked} /></td>
                      <td className={TD}><a className="cursor-pointer font-semibold text-b-7">{r.document}</a></td>
                      <td className={TD}><span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[normal]', STATUS[String(r.status ?? '').toLowerCase()] || STATUS.upcoming)}>{r.status}</span></td>
                      <td className={TD}>{r.total}</td><td className={TD}>{r.pending || '—'}</td><td className={TD}>{r.currency}</td><td className={TD}>{r.account}</td><td className={TD}>{r.dueDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-wrap items-center justify-center gap-1 border-t border-n-3 px-4 py-3 text-[13px] leading-[normal] text-n-5">
                <span className="mr-2">{data.paginationLabel || '11 – 20 of 117'}</span>
                <button className={PG}><Chev d="15 18 9 12 15 6" /></button>
                <button className="h-7 w-7 cursor-pointer rounded-[4px] border-0 bg-b-6 text-xs font-bold leading-[normal] text-white">1</button>
                <span className="px-0.5 text-n-4">···</span>
                {[4, 5, 6, 7, 8].map((n) => <button key={n} className={cn(PG, 'text-xs font-medium leading-[normal] text-n-7')}>{n}</button>)}
                <span className="px-0.5 text-n-4">···</span>
                <button className={cn(PG, 'text-xs font-medium leading-[normal] text-n-7')}>12</button>
                <button className={PG}><Chev d="9 18 15 12 9 6" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
