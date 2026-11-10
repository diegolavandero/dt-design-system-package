import type { ReactNode } from 'react';
import { Icon } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

interface ListRowProps {
  onClick: () => void;
  /** Elemento a la izquierda (indicador de estado). */
  leading?: ReactNode;
  children: ReactNode;
  /** Elemento a la derecha antes del chevron (p. ej. una insignia). */
  trailing?: ReactNode;
  className?: string;
}

/** Fila navegable: indicador · etiqueta · insignia · chevron. */
export function ListRow({ onClick, leading, children, trailing, className }: ListRowProps) {
  return (
    <button type="button" onClick={onClick} className={cn('group flex w-full items-center gap-2.5 rounded-lg px-2 py-[9px] text-left transition-colors hover:bg-surface-subtle', className)}>
      {leading && <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{leading}</span>}
      <span className="min-w-0 flex-1 text-sm font-medium leading-[18px] text-fg group-hover:text-action-strong">{children}</span>
      {trailing && <span className="shrink-0">{trailing}</span>}
      <span className="flex shrink-0 text-fg-subtle group-hover:text-action"><Icon name="chevron--right" size={16} /></span>
    </button>
  );
}

/** Tarjeta de artículo: título + descripción + flecha. */
export function ArticleCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mb-2 flex w-full items-start gap-2.5 rounded-lg border border-line px-3.5 py-3 text-left transition-colors hover:border-focus hover:bg-action-soft">
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-[18px] text-fg">{title}</span>
        <span className="mt-0.5 block text-xs leading-4 text-fg-muted">{description}</span>
      </span>
      <span className="mt-0.5 flex shrink-0 text-fg-subtle"><Icon name="arrow-right" size={14} /></span>
    </button>
  );
}

/** Enlaces secundarios de soporte. */
export function LinkList({ items }: { items: { icon: Parameters<typeof Icon>[0]['name']; label: string }[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-0.5 border-t border-line pt-3.5">
      {items.map((it) => (
        <li key={it.label}>
          <button type="button" className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-[9px] text-left text-sm text-fg hover:bg-canvas">
            <span className="flex shrink-0 text-fg-muted"><Icon name={it.icon} size={16} /></span>
            {it.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
