import { Icon, type IconName } from '@/ds/icons/Icon';

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
}

export function KpiCard({ icon, tone, label, value }: KpiCardProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-4 py-3.5">
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] ${TONES[tone]}`}>
        <Icon name={icon} size={14} />
      </span>
      <span className="min-w-0 flex-1 text-2xs font-semibold uppercase leading-snug tracking-wider text-fg-secondary">{label}</span>
      <span className="shrink-0 text-2xl font-bold leading-none text-fg">{value}</span>
    </div>
  );
}
