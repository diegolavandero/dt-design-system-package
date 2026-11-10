import { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * Acceso abierto: la documentación se muestra sin login.
 * Se mantiene el contexto (`useAuth`) para no romper consumidores; email vacío y sin presencia online.
 * Si se quiere proteger el sitio, hacerlo en el borde (Vercel Password Protection), no en el cliente.
 */
interface AuthCtx { email: string; online: number | null; signOut: () => void }
const Ctx = createContext<AuthCtx>({ email: '', online: null, signOut: () => undefined });
export const useAuth = () => useContext(Ctx);

export function AuthGate({ children }: { children: ReactNode }) {
  const value = useMemo<AuthCtx>(() => ({ email: '', online: null, signOut: () => undefined }), []);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
