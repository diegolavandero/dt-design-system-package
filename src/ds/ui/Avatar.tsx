interface AvatarProps {
  name: string;
  /** Color CSS (idealmente una variable de token). */
  color: string;
  size?: number;
}

export const initials = (name: string, max = 2) =>
  name.split(' ').map((p) => p[0]).slice(0, max).join('').toUpperCase();

export function Avatar({ name, color, size = 28 }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-bold leading-none text-fg-inverse"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
