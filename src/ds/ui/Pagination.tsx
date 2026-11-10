import { Icon } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

const base = 'inline-flex h-7 min-w-7 items-center justify-center rounded border px-1 text-xs transition-colors';

export function Pagination({ page, pages, onChange }: PaginationProps) {
  return (
    <nav aria-label="Paginación" className="flex items-center justify-end gap-1">
      <button type="button" aria-label="Página anterior" disabled={page <= 1} onClick={() => onChange(page - 1)} className={cn(base, 'w-7 border-line bg-surface hover:bg-canvas disabled:opacity-40')}>
        <Icon name="chevron--left" size={12} color="var(--color-fg-secondary)" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChange(n)}
          className={cn(base, n === page ? 'border-action bg-action font-bold text-fg-inverse' : 'border-line bg-surface font-medium text-fg-secondary hover:bg-canvas')}
        >
          {n}
        </button>
      ))}
      <button type="button" aria-label="Página siguiente" disabled={page >= pages} onClick={() => onChange(page + 1)} className={cn(base, 'w-7 border-line bg-surface hover:bg-canvas disabled:opacity-40')}>
        <Icon name="chevron--right" size={12} color="var(--color-fg-secondary)" />
      </button>
    </nav>
  );
}
