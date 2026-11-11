import { useAnimatedNumber } from './useAnimatedNumber';

/** Entero que cuenta hacia `value`. Los lectores de pantalla reciben solo el valor final. */
export function AnimatedNumber({ value, suffix = '', delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const v = useAnimatedNumber(value, delay);
  return (
    <>
      <span className="sr-only">{`${value}${suffix}`}</span>
      <span aria-hidden="true" className="tabular-nums">
        {Math.round(v)}
        {suffix}
      </span>
    </>
  );
}
