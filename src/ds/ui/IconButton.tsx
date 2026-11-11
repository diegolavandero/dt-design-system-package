import { Icon, type IconName } from '@/ds/icons/Icon';

interface IconButtonProps {
  icon: IconName;
  label: string;
  onClick: () => void;
}

/** Botón de solo ícono en color de acción; el texto va como tooltip y aria-label. */
export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button type="button" onClick={onClick} title={label} aria-label={label} className="inline-flex shrink-0 text-action transition-opacity hover:opacity-ds-muted">
      <Icon name={icon} size={18} />
    </button>
  );
}
