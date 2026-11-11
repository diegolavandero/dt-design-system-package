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
        'inline-flex h-ds-badge items-center whitespace-nowrap rounded-ds-sm border px-ds-2 text-ds-caption font-semibold leading-none',
        VARIANTS[variant],
      )}
    >
      {children}
    </span>
  );
}
