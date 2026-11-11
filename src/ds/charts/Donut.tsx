import { useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { AnimatedNumber } from '@/ds/lib/AnimatedNumber';
import { useProgress } from '@/ds/lib/useAnimatedNumber';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  segments: DonutSegment[];
  centerValue: number | string;
  centerLabel: string;
  size?: number;
}

const STROKE = 18;

/**
 * Donut del DS. Al montar (y al cambiar los datos) el anillo se rellena en sentido horario mientras los
 * números cuentan hasta su valor. Al pasar el cursor por un segmento o su fila de leyenda, el centro muestra ese dato.
 */
export function Donut({ segments, centerValue, centerLabel, size = 132 }: DonutProps) {
  const [active, setActive] = useState<string | null>(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const sweep = useProgress(segments.map((s) => s.value).join('|')) * c; // longitud de arco ya dibujada
  const current = segments.find((s) => s.label === active);

  let offset = 0;
  return (
    <div className="flex items-center justify-center gap-ds-7 py-ds-1">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
          {total > 0 &&
            segments.map((s) => {
              if (s.value === 0) return null;
              const full = (s.value / total) * c * (total > 0 ? 1 : 0);
              const start = offset;
              offset += full;
              const len = Math.max(0, Math.min(full, sweep - start));
              if (len <= 0) return null;
              return (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-start}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  className={cn('cursor-pointer transition-opacity duration-ds-fast', active && active !== s.label && 'opacity-ds-disabled')}
                  onMouseEnter={() => setActive(s.label)}
                  onMouseLeave={() => setActive(null)}
                />
              );
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-ds-subtitle font-bold leading-none text-fg">
            {typeof (current ? current.value : centerValue) === 'number' ? <AnimatedNumber value={(current ? current.value : centerValue) as number} /> : centerValue}
          </span>
          <span className="mt-ds-1 text-ds-caption font-semibold uppercase tracking-ds-label text-fg-muted">{current ? current.label : centerLabel}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-ds-2">
        {segments.map((s) => (
          <li
            key={s.label}
            onMouseEnter={() => setActive(s.label)}
            onMouseLeave={() => setActive(null)}
            className={cn('flex cursor-default items-center gap-ds-2 text-ds-caption text-fg-secondary transition-opacity duration-ds-fast', active && active !== s.label && 'opacity-ds-disabled')}
          >
            <span className="h-ds-3 w-ds-3 shrink-0 rounded-ds-sm" style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className="ml-ds-3 min-w-ds-4 text-right font-bold text-fg">
              <AnimatedNumber value={s.value} />
            </span>
            <span className="w-ds-7 text-right text-fg-muted">
              <AnimatedNumber value={total ? Math.round((s.value / total) * 100) : 0} suffix="%" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
