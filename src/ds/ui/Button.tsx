import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '@/ds/icons/Icon';
import { cn } from '@/ds/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  icon?: IconName;
  /** Nodo al inicio / al final (p. ej. un ícono fuera del catálogo del DS). Mismo hueco de 8 px que `icon`. */
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}

/**
 * Botones píldora del DS (32 px): primario relleno y secundario outline.
 * Estados: hover, deshabilitado y presionado (`aria-pressed`, p. ej. modo lazo activo). El foco visible viene de base.css.
 */
export function Button({ variant = 'secondary', icon, leading, trailing, children, className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-ds-7 shrink-0 items-center gap-ds-2 whitespace-nowrap rounded-ds-pill px-ds-4 text-ds-body-s font-bold leading-none transition-colors disabled:cursor-not-allowed',
        variant === 'primary'
          ? 'bg-action text-fg-inverse enabled:hover:bg-action-hover disabled:bg-surface-header disabled:text-fg-subtle'
          : 'border border-action bg-surface text-action-text enabled:hover:bg-action-soft enabled:hover:text-action-strong aria-pressed:bg-action-soft aria-pressed:text-action-strong disabled:border-line-strong disabled:text-fg-subtle',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={14} />}
      {leading}
      {children}
      {trailing}
    </button>
  );
}
