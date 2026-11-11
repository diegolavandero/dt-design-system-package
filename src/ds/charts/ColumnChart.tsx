import { vizColor } from '@/ds/lib/vizPalette';
import { AnimatedNumber } from '@/ds/lib/AnimatedNumber';
import { useEntered } from '@/ds/lib/useAnimatedNumber';
import type { BarItem } from './BarsChart';

const PLOT_HEIGHT = 150;
const STAGGER = 80; // = --motion-stagger

/** Columnas que crecen desde la base al entrar, escalonadas, con el valor contando hacia arriba. */
export function ColumnChart({ items, suffix = '' }: { items: BarItem[]; suffix?: string }) {
  const entered = useEntered();
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex justify-center gap-ds-8 px-ds-4">
      {items.map((item, i) => (
        <div key={item.label} className="group flex w-ds-9 flex-col items-center">
          <div className="flex flex-col items-center justify-end border-b border-line" style={{ height: PLOT_HEIGHT + 22 }}>
            <span className="mb-ds-1 text-ds-caption font-bold text-fg">
              <AnimatedNumber value={item.value} suffix={suffix} delay={i * STAGGER} />
            </span>
            <div
              className="w-ds-9 rounded-t-ds-sm transition-all duration-ds-chart ease-out group-hover:opacity-ds-muted"
              style={{ height: entered ? (item.value / max) * PLOT_HEIGHT : 0, background: vizColor(i), transitionDelay: `${i * STAGGER}ms` }}
            />
          </div>
          <span className="mt-ds-2 whitespace-nowrap text-ds-caption text-fg-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
