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
    <div className="flex justify-center pb-4 pt-2">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-4 text-center">
        {tag && <span className="inline-flex items-center gap-1.5 rounded-full bg-action-soft px-3 py-1.5 text-2xs font-bold uppercase leading-none tracking-wide text-action">{tag}</span>}
        <h2 className="text-3xl font-bold leading-7 text-fg">{title}</h2>
        <p className="max-w-[520px] text-base leading-[21px] text-fg-muted">{description}</p>
        {children}
        {actions && <div className="mt-1 flex flex-wrap justify-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
