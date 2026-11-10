interface ProgressRingProps {
  done: number;
  total: number;
  /** 0–100. Si se omite se calcula como done / total. */
  percent?: number;
}

const R = 10;
const C = 2 * Math.PI * R;

/** Contador circular de progreso con texto «done/total · pct%». */
export function ProgressRing({ done, total, percent }: ProgressRingProps) {
  const pct = percent ?? (total ? Math.round((done / total) * 100) : 0);
  return (
    <span
      title={`${done} de ${total} tutoriales completados`}
      className="inline-flex shrink-0 items-center gap-ds-2 rounded-ds-pill border border-line bg-surface-subtle py-ds-1 pl-ds-1 pr-ds-3"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r={R} fill="none" stroke="var(--color-line)" strokeWidth="3" />
        <circle
          cx="12" cy="12" r={R} fill="none" stroke="var(--color-action)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C.toFixed(1)} strokeDashoffset={(C * (1 - pct / 100)).toFixed(1)} transform="rotate(-90 12 12)"
          className="transition-all duration-ds-base"
        />
      </svg>
      <span className="whitespace-nowrap text-ds-caption font-bold leading-none text-fg">
        {done}/{total} · {pct}%
      </span>
    </span>
  );
}
