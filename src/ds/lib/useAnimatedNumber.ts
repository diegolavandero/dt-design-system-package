import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Duración de la animación de gráficos: lee el token `--motion-chart` para no duplicar el valor. */
export function chartDuration(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--motion-chart').trim();
  const ms = raw.endsWith('ms') ? parseFloat(raw) : raw.endsWith('s') ? parseFloat(raw) * 1000 : NaN;
  return Number.isFinite(ms) ? ms : 0;
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Progreso 0 → 1 con easing. Se reinicia cuando cambia `signature` (p. ej. al cambiar los datos).
 * Con `prefers-reduced-motion` salta directo a 1.
 */
export function useProgress(signature: string, delay = 0): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return setP(1);
    const duration = chartDuration();
    let raf = 0;
    let start = 0;
    setP(0);
    const tick = (now: number) => {
      start ||= now;
      const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
      setP(easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [signature, delay]);
  return p;
}

/** Número que cuenta hasta `target` (desde 0 al montar y desde el valor visible cuando cambia). */
export function useAnimatedNumber(target: number, delay = 0): number {
  const [value, setValue] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      from.current = target;
      return setValue(target);
    }
    const duration = chartDuration();
    const origin = from.current;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      start ||= now;
      const t = Math.min(1, Math.max(0, (now - start - delay) / duration));
      const v = origin + (target - origin) * easeOutCubic(t);
      from.current = v;
      setValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, delay]);
  return value;
}

/** `false` en el primer render y `true` justo después: permite transiciones CSS de entrada. */
export function useEntered(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return on;
}
