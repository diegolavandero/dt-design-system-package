import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: IconName;
  children: ReactNode;
}

/** Botones píldora del DS: primario relleno y secundario outline. */
export function Button({ variant = 'secondary', icon, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-ds-7 shrink-0 items-center gap-ds-2 whitespace-nowrap rounded-ds-pill px-ds-4 text-ds-body-s font-bold leading-none transition-colors',
        variant === 'primary' ? 'bg-action text-fg-inverse hover:bg-action-hover' : 'border border-action bg-surface text-action-text hover:bg-action-soft',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}
