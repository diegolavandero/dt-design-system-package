import { vizColor } from '@/ds/lib/vizPalette';

export interface BarItem {
  label: string;
  value: number;
}

export function BarsChart({ items, labelWidth = 185 }: { items: BarItem[]; labelWidth?: number }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-3 text-xs">
          <span className="shrink-0 truncate text-right text-fg-secondary" style={{ width: labelWidth }} title={item.label}>
            {item.label}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-canvas">
            <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${(item.value / max) * 100}%`, background: vizColor(i) }} />
          </div>
          <span className="w-5 shrink-0 text-right font-bold text-fg">{item.value}</span>
        </li>
      ))}
    </ul>
  );
}
