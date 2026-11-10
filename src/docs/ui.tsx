import { useState, type ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';
import { useI18n } from './i18n';

/** Cabecera de sección: h1 + descripción, con i18n derivado de titleKey (igual que el original). */
export function SectionHeader({ data }: { data: { title: string; titleKey?: string; description?: string } }) {
  const { t } = useI18n();
  const descKey = data.titleKey ? `section.${data.titleKey.replace(/^nav\./, '')}.desc` : undefined;
  return (
    <>
      <h1 className="mb-1.5 text-[28px] font-bold leading-[1.2] tracking-[-.01em] text-n-7">{t(data.titleKey, data.title)}</h1>
      <p className="mb-7 max-w-[660px] text-base leading-[1.6] text-n-5">{t(descKey, data.description ?? '')}</p>
    </>
  );
}

export function Card({ children, flush, className }: { children: ReactNode; flush?: boolean; className?: string }) {
  return <div className={cn('mb-3.5 rounded-lg border border-n-3 bg-white', flush ? 'overflow-hidden' : 'p-5', className)}>{children}</div>;
}

export function CardHeader({ title, meta, children }: { title?: ReactNode; meta?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-n-3 bg-[var(--doc-card-header)] px-4 py-2.5">
      {children ?? <span className="text-xs font-bold text-n-7">{title}</span>}
      {meta && <span className="text-[11px] text-n-5">{meta}</span>}
    </div>
  );
}

export function CopyCode({ text, children, flat }: { text: string; children: ReactNode; flat?: boolean }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text.trim()).catch(() => undefined);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <div className={cn('relative overflow-x-auto bg-[var(--doc-code-bg)] p-3.5 text-xs leading-[1.6] text-[var(--doc-code-fg)]', !flat && 'rounded-md')}>
      <button type="button" onClick={copy} className="absolute right-2 top-2 cursor-pointer rounded border border-white/10 bg-white/10 px-[9px] py-[3px] text-[10px] font-semibold text-white hover:bg-white/15">
        {done ? 'Copied!' : t('ui.copy', 'Copy')}
      </button>
      <pre className="whitespace-pre">{children}</pre>
    </div>
  );
}

/** Tonos del resaltado de código del original. */
export const Cm = ({ children }: { children: ReactNode }) => <span className="text-[#4B5563]">{children}</span>;
export const Kw = ({ children }: { children: ReactNode }) => <span className="text-[#7DD3FC]">{children}</span>;
export const Str = ({ children }: { children: ReactNode }) => <span className="text-[#A5F3B0]">{children}</span>;
export const Tg = ({ children }: { children: ReactNode }) => <span className="text-[#F0ABFC]">{children}</span>;

export function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return r * 0.2126 + g * 0.7152 + b * 0.0722 > 150;
}

/** Clic para copiar con feedback «Copied!» superpuesto (clase .color-sw del original). */
export function CopySwatch({ value, className, style, children, title }: { value: string; className?: string; style?: React.CSSProperties; children?: ReactNode; title?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      title={title ?? `Copy ${value}`}
      className={cn('relative cursor-pointer', className)}
      style={style}
      onClick={() => { navigator.clipboard?.writeText(value).catch(() => undefined); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLElement).click(); }}
    >
      {children}
      {copied && <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(19,32,69,.82)] text-[11px] font-semibold tracking-[.02em] text-white">Copied!</span>}
    </div>
  );
}

/* ───────────── Piezas compartidas de los renderers de componentes ───────────── */

/** `.code` suelto (codeBlock del original). */
export function CodeBlock({ code, className, flat }: { code: string; className?: string; flat?: boolean }) {
  return (
    <div className={cn(flat ? '' : 'mb-3.5', className)}>
      <CopyCode text={code}>{code}</CopyCode>
    </div>
  );
}

/** Tarjeta «How to call in pages» (usageCard). */
export function UsageCard({ snippet }: { snippet?: string }) {
  const { t } = useI18n();
  if (!snippet) return null;
  return (
    <Card flush className="!mb-6">
      <div className="flex items-center gap-2 border-b border-n-3 bg-[var(--doc-card-header)] px-4 py-2.5">
        <svg width="14" height="14" viewBox="0 0 32 32" fill="var(--b6)"><path d="M10,6L8.59,7.41,13.17,12H4v2h9.17L8.59,18.59,10,20l7-7Zm12,8,7,7-1.41,1.41L22.83,18H32V16H22.83l4.76-4.59L26,10Z" /></svg>
        <span className="text-xs font-bold text-n-7">{t('ui.howToCall', 'How to call in pages')}</span>
      </div>
      <div className="relative overflow-x-auto bg-[var(--doc-code-bg)] p-3.5 text-xs leading-[1.6] text-[var(--doc-code-fg)]">
        <UsageCopy text={snippet} />
        <pre>{snippet}</pre>
      </div>
    </Card>
  );
}
function UsageCopy({ text }: { text: string }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(text.trim()).catch(() => undefined); setDone(true); setTimeout(() => setDone(false), 1500); }} className="absolute right-2 top-2 cursor-pointer rounded border border-white/10 bg-white/10 px-[9px] py-[3px] text-[10px] font-semibold text-white hover:bg-white/15">
      {done ? 'Copied!' : t('ui.copy', 'Copy')}
    </button>
  );
}

/** Tarjeta con pestañas (tabCard). */
export function TabCard({ tabs }: { tabs: Array<{ label: ReactNode; content: ReactNode }> }) {
  const [on, setOn] = useState(0);
  return (
    <Card flush>
      <div className="flex border-b border-n-3 bg-[var(--doc-card-header)]">
        {tabs.map((t, i) => (
          <div key={i} onClick={() => setOn(i)} className={cn('cursor-pointer border-b-2 px-3.5 py-[9px] text-xs', i === on ? 'border-b-5 bg-white font-bold text-n-7' : 'border-transparent font-medium text-n-5')}>{t.label}</div>
        ))}
      </div>
      <div>{tabs[on]?.content}</div>
    </Card>
  );
}

/** Banner `.bn` (in | ok | wr | er). */
const BN = { in: 'bg-b-1 border-b-6', ok: 'bg-g-1 border-g-6', wr: 'bg-o-1 border-o-5', er: 'bg-r-1 border-r-6' } as const;
export function Banner({ kind = 'in', children, className, noIcon }: { kind?: keyof typeof BN; children: ReactNode; className?: string; noIcon?: boolean }) {
  return (
    <div className={cn('mb-[7px] flex items-start gap-[9px] rounded border-l-[3px] px-3 py-[9px] text-xs leading-[1.4] text-n-7 last:mb-0', BN[kind], className)}>
      {!noIcon && <svg className="mt-px shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--b6)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
      <span>{children}</span>
    </div>
  );
}

/** `.ttbl`: tabla de tokens. */
export function TTable({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <table className="w-full border-collapse text-xs [&_tbody_tr:last-child_td]:border-0">
      <thead><tr>{head.map((h, i) => <th key={i} className="border-b border-n-4 bg-n-2 px-2.5 py-2 text-left text-[11px] font-bold text-n-7">{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  );
}
export const TCode = ({ children }: { children: ReactNode }) => <code className="rounded-[3px] bg-n-2 px-[5px] py-px font-doc text-[11px] font-medium">{children}</code>;
export const Td = ({ children, className = '' }: { children?: ReactNode; className?: string }) => <td className={cn('border-b border-n-3 px-2.5 py-2 align-middle', className)}>{children}</td>;
