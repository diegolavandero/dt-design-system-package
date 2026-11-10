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
    <section className={cn('rounded-ds-lg border border-line bg-surface', flush ? 'overflow-hidden' : 'px-ds-4 py-ds-4', className)}>
      {children}
    </section>
  );
}

export function CardHeader({ title, meta }: { title: string; meta?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-surface-subtle px-ds-4 py-ds-3">
      <h3 className="text-ds-caption font-bold text-fg">{title}</h3>
      {meta && <span className="text-ds-caption text-fg-muted">{meta}</span>}
    </header>
  );
}

/** Título de tarjeta con subtítulo opcional (gráficos). */
export function CardTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={subtitle ? 'mb-ds-4' : 'mb-ds-3'}>
      <h3 className="text-ds-body-s font-bold leading-ds-body text-fg">{title}</h3>
      {subtitle && <p className="mt-ds-1 text-ds-caption text-fg-muted">{subtitle}</p>}
    </div>
  );
}
