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
    <button type="button" onClick={onClick} className={cn('group flex w-full items-center gap-ds-3 rounded-ds-lg px-ds-2 py-ds-2 text-left transition-colors hover:bg-surface-subtle', className)}>
      {leading && <span className="flex h-ds-5 w-ds-5 shrink-0 items-center justify-center">{leading}</span>}
      <span className="min-w-0 flex-1 text-ds-body-s font-medium leading-ds-body text-fg group-hover:text-action-strong">{children}</span>
      {trailing && <span className="shrink-0">{trailing}</span>}
      <span className="flex shrink-0 text-fg-subtle group-hover:text-action"><Icon name="chevron--right" size={16} /></span>
    </button>
  );
}

/** Tarjeta de artículo: título + descripción + flecha. */
export function ArticleCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mb-ds-2 flex w-full items-start gap-ds-3 rounded-ds-lg border border-line px-ds-4 py-ds-3 text-left transition-colors hover:border-focus hover:bg-action-soft">
      <span className="min-w-0 flex-1">
        <span className="block text-ds-body-s font-bold leading-ds-body text-fg">{title}</span>
        <span className="mt-ds-1 block text-ds-caption leading-ds-caption text-fg-muted">{description}</span>
      </span>
      <span className="mt-ds-1 flex shrink-0 text-fg-subtle"><Icon name="arrow-right" size={14} /></span>
    </button>
  );
}

/** Enlaces secundarios de soporte. */
export function LinkList({ items }: { items: { icon: Parameters<typeof Icon>[0]['name']; label: string }[] }) {
  return (
    <ul className="mt-ds-4 flex flex-col gap-ds-1 border-t border-line pt-ds-4">
      {items.map((it) => (
        <li key={it.label}>
          <button type="button" className="flex w-full items-center gap-ds-3 rounded-ds-md px-ds-2 py-ds-2 text-left text-ds-body-s text-fg hover:bg-canvas">
            <span className="flex shrink-0 text-fg-muted"><Icon name={it.icon} size={16} /></span>
            {it.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
