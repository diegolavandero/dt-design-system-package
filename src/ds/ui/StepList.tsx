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
    <span aria-hidden="true" className="inline-block h-3.5 w-3.5 rounded-full border-2 border-line-strong" />
  );
}

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ul className="mb-3 flex flex-col gap-2">
      {steps.map((s) => (
        <li key={s.label} className={cn('flex items-center gap-2 text-sm font-medium', s.done ? 'text-fg' : 'text-fg-secondary')}>
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center"><StepIcon done={s.done} /></span>
          {s.label}
          {s.done && <span className="sr-only"> (completado)</span>}
        </li>
      ))}
    </ul>
  );
}
