import { Icon, type IconName } from '@/ds/icons/Icon';

interface ProgressChipProps {
  icon?: IconName;
  label: string;
  title?: string;
  onClick: () => void;
}

/** Chip de la barra superior (sobre fondo nav): ícono + texto, píldora translúcida. */
export function ProgressChip({ icon = 'education', label, title, onClick }: ProgressChipProps) {
  return (
    <button type="button" onClick={onClick} title={title} className="inline-flex h-ds-7 shrink-0 items-center gap-ds-2 rounded-ds-pill border border-nav-line bg-nav-hover px-ds-3 text-ds-caption font-bold leading-none text-fg-inverse transition-colors hover:bg-surface/20">
      <Icon name={icon} size={16} color="var(--color-fg-inverse)" />
      <span>{label}</span>
    </button>
  );
}
