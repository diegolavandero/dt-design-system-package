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
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface-subtle py-[3px] pl-1 pr-2.5"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r={R} fill="none" stroke="var(--color-line)" strokeWidth="3" />
        <circle
          cx="12" cy="12" r={R} fill="none" stroke="var(--color-action)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C.toFixed(1)} strokeDashoffset={(C * (1 - pct / 100)).toFixed(1)} transform="rotate(-90 12 12)"
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <span className="whitespace-nowrap text-xs font-bold leading-none text-fg">
        {done}/{total} · {pct}%
      </span>
    </span>
  );
}
