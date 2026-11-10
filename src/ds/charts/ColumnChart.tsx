import { vizColor } from '@/ds/lib/vizPalette';
import type { BarItem } from './BarsChart';

const PLOT_HEIGHT = 150;

export function ColumnChart({ items, suffix = '' }: { items: BarItem[]; suffix?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex justify-center gap-ds-8 px-ds-4">
      {items.map((item, i) => (
        <div key={item.label} className="flex w-ds-9 flex-col items-center">
          <div className="flex flex-col items-center justify-end border-b border-line" style={{ height: PLOT_HEIGHT + 22 }}>
            <span className="mb-ds-1 text-ds-caption font-bold text-fg">
              {item.value}
              {suffix}
            </span>
            <div className="w-ds-9 rounded-t-ds-sm transition-all duration-ds-base" style={{ height: (item.value / max) * PLOT_HEIGHT, background: vizColor(i) }} />
          </div>
          <span className="mt-ds-2 whitespace-nowrap text-ds-caption text-fg-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
