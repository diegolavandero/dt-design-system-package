import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/ds/icons/Icon';

export interface RowMenuItem {
  label: string;
  onSelect: () => void;
}

const MENU_WIDTH = 200;

/** Menú «⋮» por fila. Se dibuja en un portal con posición fija para no quedar recortado por el scroll de la tabla. */
export function RowMenu({ items, label }: { items: RowMenuItem[]; label: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const close = () => setPos(null);

  useEffect(() => {
    if (!pos) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return close();
    const r = btnRef.current!.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: Math.max(8, r.right - MENU_WIDTH) });
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={!!pos}
        title="Más acciones"
        onClick={toggle}
        className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-canvas"
      >
        <Icon name="overflow-menu-vertical" size={16} color="var(--color-fg-muted)" />
      </button>
      {pos &&
        createPortal(
          <div ref={menuRef} role="menu" style={{ top: pos.top, left: pos.left, minWidth: MENU_WIDTH }} className="fixed z-[9999] rounded-lg bg-surface py-1 shadow-[0_4px_20px_rgba(0,0,0,.16),0_0_0_1px_rgba(0,0,0,.07)]">
            {items.map((it) => (
              <button
                key={it.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  it.onSelect();
                }}
                className="flex h-10 w-full items-center whitespace-nowrap px-3.5 text-left text-sm text-fg transition-colors hover:bg-action-soft hover:text-action-strong"
              >
                {it.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
