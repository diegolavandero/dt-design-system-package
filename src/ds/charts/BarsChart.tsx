import { vizColor } from '@/ds/lib/vizPalette';
import { AnimatedNumber } from '@/ds/lib/AnimatedNumber';
import { useEntered } from '@/ds/lib/useAnimatedNumber';

export interface BarItem {
  label: string;
  value: number;
}

const STAGGER = 80; // = --motion-stagger

/** Barras horizontales que se extienden de izquierda a derecha, escalonadas, con el valor contando. */
export function BarsChart({ items, labelWidth = 185 }: { items: BarItem[]; labelWidth?: number }) {
  const entered = useEntered();
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="flex flex-col gap-ds-3">
      {items.map((item, i) => (
        <li key={item.label} className="group flex items-center gap-ds-3 text-ds-caption">
          <span className="shrink-0 truncate text-right text-fg-secondary" style={{ width: labelWidth }} title={item.label}>
            {item.label}
          </span>
          <div className="h-ds-3 flex-1 overflow-hidden rounded-ds-pill bg-canvas">
            <div
              className="h-full rounded-ds-pill transition-all duration-ds-chart ease-out group-hover:opacity-ds-muted"
              style={{ width: entered ? `${(item.value / max) * 100}%` : '0%', background: vizColor(i), transitionDelay: `${i * STAGGER}ms` }}
            />
          </div>
          <span className="w-ds-5 shrink-0 text-right font-bold text-fg">
            <AnimatedNumber value={item.value} delay={i * STAGGER} />
          </span>
        </li>
      ))}
    </ul>
  );
}
