import type { ReactNode } from 'react';
import { cn } from '@/ds/lib/cn';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'outline';

const VARIANTS: Record<BadgeVariant, string> = {
  success: 'bg-success-bg border-success-border text-success-fg',
  danger: 'bg-danger-bg border-danger-border text-danger-fg',
  warning: 'bg-warning-bg border-warning-border text-warning-fg',
  info: 'bg-info-bg border-info-border text-info-fg',
  neutral: 'bg-canvas border-line-strong text-fg-secondary',
  outline: 'bg-surface border-line-strong text-fg-secondary',
};

export function Badge({ variant = 'neutral', children }: { variant?: BadgeVariant; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center whitespace-nowrap rounded border px-1.5 py-0.5 text-2xs font-semibold leading-none',
        VARIANTS[variant],
      )}
    >
      {children}
    </span>
  );
}
