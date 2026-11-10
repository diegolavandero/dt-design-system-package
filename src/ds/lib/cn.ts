/** Une clases condicionales (reemplaza a clsx para no sumar una dependencia). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
