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

export function CopyCode({ text, children }: { text: string; children: ReactNode }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text.trim()).catch(() => undefined);
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };
  return (
    <div className="relative overflow-x-auto rounded-md bg-[var(--doc-code-bg)] p-3.5 text-xs leading-[1.6] text-[var(--doc-code-fg)]">
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
