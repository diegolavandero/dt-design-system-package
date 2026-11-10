import { useState, type ReactNode } from 'react';
import { Avatar } from './Avatar';
import { Icon } from '@/ds/icons/Icon';

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ol'; items: string[] }
  | { type: 'ul'; items: { dot: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; text: string }[] }
  | { type: 'shot'; cap: string };

const DOT = { success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger-fg', info: 'bg-action', neutral: 'bg-line-strong' } as const;

/** Texto con <b> admitido (contenido propio del DS, no entrada de usuarios). */
const Rich = ({ html }: { html: string }) => <span dangerouslySetInnerHTML={{ __html: html }} />;

function Shot({ caption }: { caption: string }) {
  return (
    <figure className="my-ds-1 mb-ds-4 overflow-hidden rounded-ds-lg border border-line bg-surface">
      <div className="flex h-ds-6 items-center gap-ds-1 border-b border-line bg-surface-subtle px-ds-3" aria-hidden="true">
        {[0, 1, 2].map((i) => <i key={i} className="h-ds-2 w-ds-2 rounded-ds-pill bg-line-strong" />)}
      </div>
      <div className="flex aspect-video flex-col items-center justify-center gap-ds-2 bg-gradient-to-br from-surface-subtle to-canvas text-fg-subtle">
        <Icon name="document-text" size={28} className="opacity-ds-muted" />
        <figcaption className="max-w-full px-ds-4 text-center text-ds-caption font-medium leading-ds-caption text-fg-muted">{caption}</figcaption>
      </div>
    </figure>
  );
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p': return <p key={i} className="mb-ds-3 text-ds-body-s leading-ds-body text-fg-secondary ds-strong:font-bold ds-strong:text-fg"><Rich html={b.text} /></p>;
          case 'h': return <h4 key={i} className="mb-ds-3 mt-ds-6 text-ds-body-l font-bold leading-ds-body text-fg">{b.text}</h4>;
          case 'ol': return <ol key={i} className="mb-ds-3 list-decimal pl-ds-5">{b.items.map((it) => <li key={it} className="mb-ds-2 text-ds-body-s leading-ds-body text-fg-secondary ds-strong:text-fg"><Rich html={it} /></li>)}</ol>;
          case 'ul': return (
            <ul key={i} className="mb-ds-3 flex flex-col gap-ds-2">
              {b.items.map((it) => (
                <li key={it.text} className="flex items-start gap-ds-2 text-ds-body-s leading-ds-body text-fg-secondary ds-strong:text-fg">
                  <span aria-hidden="true" className={`mt-ds-2 h-ds-2 w-ds-2 shrink-0 rounded-ds-pill ${DOT[it.dot]}`} />
                  <Rich html={it.text} />
                </li>
              ))}
            </ul>
          );
          case 'shot': return <Shot key={i} caption={b.cap} />;
        }
      })}
    </>
  );
}

interface ArticleHeaderProps {
  title: string;
  subtitle: string;
  author: string;
  authorColor: string;
  date: string;
}

export function ArticleHeader({ title, subtitle, author, authorColor, date }: ArticleHeaderProps) {
  return (
    <>
      <h2 className="mb-ds-2 text-ds-subtitle font-bold leading-ds-subtitle text-fg">{title}</h2>
      <p className="mb-ds-4 text-ds-body-s leading-ds-body text-fg-muted">{subtitle}</p>
      <div className="mb-ds-5 flex items-center gap-ds-3 border-b border-line pb-ds-5">
        <Avatar name={author} color={authorColor} size={32} />
        <div>
          <div className="text-ds-body-s font-bold leading-ds-body text-fg">{author}</div>
          <div className="mt-ds-1 text-ds-caption text-fg-muted">{date}</div>
        </div>
      </div>
    </>
  );
}

export function RelatedList({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-ds-6 border-t border-line pt-ds-5">
      <h3 className="mb-ds-3 text-ds-body-l font-bold leading-none text-fg">{title}</h3>
      <ul>{children}</ul>
    </section>
  );
}

export function RelatedItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li className="border-b border-canvas last:border-b-0">
      <button type="button" onClick={onClick} className="group flex w-full items-center justify-between gap-ds-3 px-ds-1 py-ds-3 text-left text-fg hover:text-action-strong">
        <span className="text-ds-body-s leading-ds-body">{label}</span>
        <span className="flex shrink-0 text-fg-subtle group-hover:text-action"><Icon name="chevron--right" size={16} /></span>
      </button>
    </li>
  );
}

const FACES = [{ e: '😞', l: 'No resolvió mi duda' }, { e: '😐', l: 'Resolvió en parte' }, { e: '😃', l: 'Resolvió mi duda' }];

/** Pie de feedback: tres caras y mensaje de agradecimiento. */
export function ArticleFeedback() {
  const [picked, setPicked] = useState<number | null>(null);
  const [thanks, setThanks] = useState(false);

  const pick = (i: number) => {
    setPicked(i);
    setTimeout(() => setThanks(true), 280);
  };

  return (
    <div className="mt-ds-6 rounded-ds-xl border border-line bg-surface-subtle px-ds-4 py-ds-5 text-center">
      {thanks ? (
        <p role="status" className="flex items-center justify-center gap-ds-2 text-ds-body-s font-semibold text-success">
          <Icon name="checkmark-filled" size={16} color="var(--color-success)" /> ¡Gracias por tu respuesta!
        </p>
      ) : (
        <>
          <p className="mb-ds-3 text-ds-body-s font-bold leading-ds-body text-fg">¿Esta respuesta resolvió tu duda?</p>
          <div className="flex items-center justify-center gap-ds-4">
            {FACES.map((f, i) => (
              <button
                key={f.e}
                type="button"
                aria-label={f.l}
                aria-pressed={picked === i}
                onClick={() => pick(i)}
                className={`flex h-ds-control w-ds-control items-center justify-center rounded-ds-pill border text-ds-subtitle leading-none transition hover:scale-110 hover:border-focus hover:bg-action-soft ${picked === i ? 'scale-110 border-action bg-action-soft' : 'border-line bg-surface'}`}
              >
                {f.e}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
