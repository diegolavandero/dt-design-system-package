import { useEffect, useState } from 'react';

/** Ruta basada en hash (`#/usuarios`). Funciona en hosting estático y dentro de un iframe sin configuración del servidor. */
export function useHashRoute(fallback: string): string {
  const read = () => window.location.hash.replace(/^#\/?/, '') || fallback;
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
