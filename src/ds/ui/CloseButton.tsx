export function CloseButton({ onClick, label = 'Cerrar' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex h-ds-7 w-ds-7 shrink-0 items-center justify-center rounded-ds-sm text-fg-muted transition-colors hover:bg-canvas">
      <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6z" />
      </svg>
    </button>
  );
}
