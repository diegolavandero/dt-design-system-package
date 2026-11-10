import { Icon, type IconName } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

export interface TabItem {
  label: string;
  icon?: IconName;
}

interface TabsProps {
  items: TabItem[];
  value: number;
  onChange: (index: number) => void;
}

const INSET = 'var(--space-1)';

/** Selector de segmentos del DS: pista n2 + píldora blanca que se desliza. Todas las pestañas miden lo mismo. */
export function Tabs({ items, value, onChange }: TabsProps) {
  const hasIcons = items.some((i) => i.icon);
  const longest = Math.max(...items.map((i) => i.label.length));
  const width = Math.max(74, longest * 7 + (hasIcons ? 22 : 0) + 30);

  return (
    <div role="tablist" className="relative inline-flex select-none rounded-ds-chip bg-canvas" style={{ gap: INSET, padding: INSET }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-ds-1 h-ds-6 rounded-ds-xl bg-surface shadow-ds-xs transition-all duration-ds-fast ease-in-out"
        style={{ width, left: `calc(${INSET} + ${value} * (${width}px + ${INSET}))` }}
      />
      {items.map((item, i) => (
        <button
          key={item.label}
          type="button"
          role="tab"
          aria-selected={i === value}
          onClick={() => onChange(i)}
          style={{ width }}
          className={cn(
            'relative z-ds-sticky inline-flex h-ds-6 shrink-0 items-center justify-center gap-ds-2 whitespace-nowrap rounded-ds-xl text-ds-caption font-bold leading-none transition-colors',
            i === value ? 'text-fg' : 'text-fg-secondary hover:bg-surface-header',
          )}
        >
          {item.icon && <Icon name={item.icon} size={15} />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
