import { Icon, type IconName } from '@/ds/icons/Icon';
import { AnimatedNumber } from '@/ds/lib/AnimatedNumber';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<Tone, string> = {
  info: 'text-info-fg bg-info-bg',
  success: 'text-success bg-success-bg',
  warning: 'text-warning-fg bg-warning-bg',
  danger: 'text-danger-fg bg-danger-bg',
};

interface KpiCardProps {
  icon: IconName;
  tone: Tone;
  label: string;
  value: number;
  /** Posición en una fila de tarjetas: escalona la entrada. */
  index?: number;
}

export function KpiCard({ icon, tone, label, value, index = 0 }: KpiCardProps) {
  const delay = index * 80; // = --motion-stagger
  return (
    <div style={{ animationDelay: `${delay}ms` }} className="animate-ds-rise flex items-center gap-ds-3 rounded-ds-lg border border-line bg-surface px-ds-4 py-ds-4">
      <span className={`flex h-ds-6 w-ds-6 shrink-0 items-center justify-center rounded-ds-lg ${TONES[tone]}`}>
        <Icon name={icon} size={14} />
      </span>
      <span className="min-w-0 flex-1 text-ds-caption font-semibold uppercase leading-ds-caption tracking-ds-label text-fg-secondary">{label}</span>
      <span className="shrink-0 text-ds-subtitle font-bold leading-none text-fg"><AnimatedNumber value={value} delay={delay} /></span>
    </div>
  );
}
