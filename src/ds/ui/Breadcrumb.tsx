import { Fragment } from 'react';

export interface Crumb {
  label: string;
  /** Si se define, la miga es un enlace de retroceso. */
  onSelect?: () => void;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      {items.map((c, i) => (
        <Fragment key={`${c.label}-${i}`}>
          {i > 0 && <span aria-hidden="true" className="mx-1 text-line-strong">›</span>}
          {c.onSelect ? (
            <button type="button" onClick={c.onSelect} className="text-action hover:text-action-strong hover:underline">{c.label}</button>
          ) : (
            <span aria-current={i === items.length - 1 ? 'page' : undefined}>{c.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
