import { vizColor } from '@/ds/lib/vizPalette';
import type { BarItem } from './BarsChart';

const PLOT_HEIGHT = 150;

export function ColumnChart({ items, suffix = '' }: { items: BarItem[]; suffix?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex justify-center gap-10 px-4">
      {items.map((item, i) => (
        <div key={item.label} className="flex w-14 flex-col items-center">
          <div className="flex flex-col items-center justify-end border-b border-line" style={{ height: PLOT_HEIGHT + 22 }}>
            <span className="mb-1 text-xs font-bold text-fg">
              {item.value}
              {suffix}
            </span>
            <div className="w-14 rounded-t transition-[height] duration-300" style={{ height: (item.value / max) * PLOT_HEIGHT, background: vizColor(i) }} />
          </div>
          <span className="mt-2 whitespace-nowrap text-2xs text-fg-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
