import type { ReactNode } from 'react';

interface EmptyStateProps {
  tag?: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ tag, title, description, children, actions }: EmptyStateProps) {
  return (
    <div className="flex justify-center pb-ds-4 pt-ds-2">
      <div className="flex w-full max-w-ds-modal-wide flex-col items-center gap-ds-4 text-center">
        {tag && <span className="inline-flex items-center gap-ds-2 rounded-ds-pill bg-action-soft px-ds-3 py-ds-2 text-ds-caption font-bold uppercase leading-none tracking-ds-label text-action">{tag}</span>}
        <h2 className="text-ds-subtitle font-bold leading-ds-subtitle text-fg">{title}</h2>
        <p className="max-w-ds-modal text-ds-body-s leading-ds-body text-fg-muted">{description}</p>
        {children}
        {actions && <div className="mt-ds-1 flex flex-wrap justify-center gap-ds-3">{actions}</div>}
      </div>
    </div>
  );
}
