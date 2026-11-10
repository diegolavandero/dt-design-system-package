import { ICON_PATHS, type IconName } from './paths';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

/** Ícono Carbon del design system (viewBox 32). `color` acepta cualquier valor CSS, incluidas variables. */
export function Icon({ name, size = 16, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={color}
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}

export type { IconName };
