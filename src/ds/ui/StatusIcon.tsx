import { Icon } from '@/ds/icons/Icon';
import { StepIcon } from './StepList';

export type StatusIconState = 'pending' | 'progress' | 'done';

/** Indicador de estado de un ítem de lista: pendiente (círculo), en progreso (anillo medio) o completado. */
export function StatusIcon({ state }: { state: StatusIconState }) {
  if (state === 'done') return <Icon name="checkmark-filled" size={18} color="var(--color-success)" />;
  if (state === 'progress') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-line)" strokeWidth="2" />
        <circle cx="8" cy="8" r="6" fill="none" stroke="var(--color-action)" strokeWidth="2" strokeLinecap="round" strokeDasharray="37.7" strokeDashoffset="18.85" transform="rotate(-90 8 8)" />
      </svg>
    );
  }
  return <StepIcon done={false} />;
}
