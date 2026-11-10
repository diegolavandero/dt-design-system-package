import type { ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';

interface CardProps {
  children: ReactNode;
  /** Sin padding interno: para tablas y contenedores que manejan su propio espaciado. */
  flush?: boolean;
  className?: string;
}

export function Card({ children, flush, className }: CardProps) {
  return (
    <section className={cn('rounded-lg border border-line bg-surface', flush ? 'overflow-hidden' : 'px-4 py-3.5', className)}>
      {children}
    </section>
  );
}

export function CardHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-surface-subtle px-4 py-2.5">
      <h3 className="text-xs font-bold text-fg">{title}</h3>
      {meta && <span className="text-2xs text-fg-muted">{meta}</span>}
    </header>
  );
}

/** Título de tarjeta con subtítulo opcional (gráficos). */
export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={subtitle ? 'mb-4' : 'mb-3'}>
      <h3 className="text-base font-bold leading-tight text-fg">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-fg-muted">{subtitle}</p>}
    </div>
  );
}
