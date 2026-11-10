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

const GAP = 4;
const PAD = 4;

/** Selector de segmentos del DS: pista n2 + píldora blanca que se desliza. Todas las pestañas miden lo mismo. */
export function Tabs({ items, value, onChange }: TabsProps) {
  const hasIcons = items.some((i) => i.icon);
  const longest = Math.max(...items.map((i) => i.label.length));
  const width = Math.max(74, longest * 7 + (hasIcons ? 22 : 0) + 30);

  return (
    <div role="tablist" className="relative inline-flex select-none rounded-2xl bg-canvas" style={{ gap: GAP, padding: PAD }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1 h-[26px] rounded-[13px] bg-surface shadow-pill transition-[left] duration-200 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ width, left: PAD + value * (width + GAP) }}
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
            'relative z-10 inline-flex h-[26px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[13px] text-xs font-bold leading-none transition-colors',
            i === value ? 'text-fg' : 'text-fg-secondary hover:bg-[rgba(193,205,225,.45)]',
          )}
        >
          {item.icon && <Icon name={item.icon} size={15} />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
