import { useCallback, useEffect, useState } from 'react';

export interface Draft { name: string; description: string; preview?: string; status: 'pending' | 'approved'; addedTo?: string }
const KEY = 'dt-ds-drafts-v1';
const EVT = 'dt-drafts-change';

export const loadDrafts = (): Draft[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const saveDrafts = (d: Draft[]) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch { /* sin storage */ } window.dispatchEvent(new Event(EVT)); };

export function useDrafts() {
  const [drafts, set] = useState<Draft[]>(loadDrafts);
  useEffect(() => { const h = () => set(loadDrafts()); window.addEventListener(EVT, h); return () => window.removeEventListener(EVT, h); }, []);
  const update = useCallback((fn: (d: Draft[]) => Draft[]) => saveDrafts(fn(loadDrafts())), []);
  return { drafts, update };
}
