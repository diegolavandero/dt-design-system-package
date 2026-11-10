import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import dict from './content/i18n.json';

export type Lang = 'es' | 'en';
const STRINGS = dict.strings as Record<string, { es: string; en: string }>;
const KEY = 'dt-ds-lang';

interface I18n { lang: Lang; setLang: (l: Lang) => void; t: (key: string | undefined, fallback: string) => string }
const Ctx = createContext<I18n>({ lang: 'es', setLang: () => undefined, t: (_k, f) => f });
export const useI18n = () => useContext(Ctx);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(() => {
    try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'es'; } catch { return 'es'; }
  });
  const setLang = useCallback((l: Lang) => {
    set(l);
    try { localStorage.setItem(KEY, l); } catch { /* sin storage */ }
    document.documentElement.lang = l;
  }, []);
  const t = useCallback((key: string | undefined, fallback: string) => (key && STRINGS[key]?.[lang]) || fallback, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
