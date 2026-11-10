import paths from './content/icon-paths.json';

const P = paths as Record<string, string>;

/** Réplica de iconSvg() del original: iconos IBM Carbon (viewBox 32, fill). */
export function Icon({ name, size = 16, color = 'currentColor', className, style }: { name: string; size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  const inner = P[name] ?? P['apps'];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} aria-label={name} className={className} style={style} dangerouslySetInnerHTML={{ __html: `<title>${name}</title>${inner}` }} />
  );
}
