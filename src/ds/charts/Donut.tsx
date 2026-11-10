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

export function Donut({ segments, centerValue, centerLabel, size = 132 }: DonutProps) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - STROKE) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center justify-center gap-8 py-1">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={STROKE} />
          {total > 0 &&
            segments.map((s) => {
              if (s.value === 0) return null;
              const len = (s.value / total) * c;
              const el = (
                <circle
                  key={s.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              );
              offset += len;
              return el;
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold leading-none text-fg">{centerValue}</span>
          <span className="mt-1 text-3xs font-semibold uppercase tracking-wider text-fg-muted">{centerLabel}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs text-fg-secondary">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
            <span>{s.label}</span>
            <span className="ml-3 min-w-4 text-right font-bold text-fg">{s.value}</span>
            <span className="w-9 text-right text-fg-muted">{total ? Math.round((s.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
