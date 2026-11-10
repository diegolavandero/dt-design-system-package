import { Icon } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

export interface Step {
  label: string;
  done: boolean;
}

export function StepIcon({ done }: { done: boolean }) {
  return done ? (
    <Icon name="checkmark-filled" size={18} color="var(--color-success)" />
  ) : (
    <span aria-hidden="true" className="inline-block h-ds-4 w-ds-4 rounded-ds-pill border-2 border-line-strong" />
  );
}

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ul className="mb-ds-3 flex flex-col gap-ds-2">
      {steps.map((s) => (
        <li key={s.label} className={cn('flex items-center gap-ds-2 text-ds-body-s font-medium', s.done ? 'text-fg' : 'text-fg-secondary')}>
          <span className="flex h-ds-5 w-ds-5 shrink-0 items-center justify-center"><StepIcon done={s.done} /></span>
          {s.label}
          {s.done && <span className="sr-only"> (completado)</span>}
        </li>
      ))}
    </ul>
  );
}
