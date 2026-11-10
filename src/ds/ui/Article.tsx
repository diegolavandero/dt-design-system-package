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
    <figure className="my-1 mb-4 overflow-hidden rounded-lg border border-line bg-surface">
      <div className="flex h-[26px] items-center gap-[5px] border-b border-line bg-surface-subtle px-2.5" aria-hidden="true">
        {[0, 1, 2].map((i) => <i key={i} className="h-2 w-2 rounded-full bg-line-strong" />)}
      </div>
      <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-subtle to-canvas text-fg-subtle">
        <Icon name="document-text" size={28} className="opacity-70" />
        <figcaption className="max-w-[90%] px-4 text-center text-2xs font-medium leading-snug text-fg-muted">{caption}</figcaption>
      </div>
    </figure>
  );
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p': return <p key={i} className="mb-3 text-base leading-[22px] text-fg-secondary [&_b]:font-bold [&_b]:text-fg"><Rich html={b.text} /></p>;
          case 'h': return <h4 key={i} className="mb-2.5 mt-[22px] text-lg font-bold leading-[22px] text-fg">{b.text}</h4>;
          case 'ol': return <ol key={i} className="mb-3 list-decimal pl-5">{b.items.map((it) => <li key={it} className="mb-2 text-base leading-[22px] text-fg-secondary [&_b]:text-fg"><Rich html={it} /></li>)}</ol>;
          case 'ul': return (
            <ul key={i} className="mb-3 flex flex-col gap-2">
              {b.items.map((it) => (
                <li key={it.text} className="flex items-start gap-[9px] text-base leading-[22px] text-fg-secondary [&_b]:text-fg">
                  <span aria-hidden="true" className={`mt-[7px] h-[9px] w-[9px] shrink-0 rounded-full ${DOT[it.dot]}`} />
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
      <h2 className="mb-2 text-3xl font-bold leading-7 text-fg">{title}</h2>
      <p className="mb-4 text-base leading-[21px] text-fg-muted">{subtitle}</p>
      <div className="mb-[18px] flex items-center gap-2.5 border-b border-line pb-[18px]">
        <Avatar name={author} color={authorColor} size={32} />
        <div>
          <div className="text-sm font-bold leading-snug text-fg">{author}</div>
          <div className="mt-0.5 text-xs text-fg-muted">{date}</div>
        </div>
      </div>
    </>
  );
}

export function RelatedList({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 border-t border-line pt-[18px]">
      <h3 className="mb-2.5 text-[15px] font-bold leading-none text-fg">{title}</h3>
      <ul>{children}</ul>
    </section>
  );
}

export function RelatedItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <li className="border-b border-canvas last:border-b-0">
      <button type="button" onClick={onClick} className="group flex w-full items-center justify-between gap-2.5 px-1 py-[11px] text-left text-fg hover:text-action-strong">
        <span className="text-sm leading-[18px]">{label}</span>
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
    <div className="mt-[22px] rounded-[10px] border border-line bg-surface-subtle px-4 py-[18px] text-center">
      {thanks ? (
        <p role="status" className="flex items-center justify-center gap-[7px] text-sm font-semibold text-success">
          <Icon name="checkmark-filled" size={16} color="var(--color-success)" /> ¡Gracias por tu respuesta!
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm font-bold leading-[18px] text-fg">¿Esta respuesta resolvió tu duda?</p>
          <div className="flex items-center justify-center gap-3.5">
            {FACES.map((f, i) => (
              <button
                key={f.e}
                type="button"
                aria-label={f.l}
                aria-pressed={picked === i}
                onClick={() => pick(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-[20px] leading-none transition hover:scale-110 hover:border-focus hover:bg-action-soft ${picked === i ? 'scale-110 border-action bg-action-soft' : 'border-line bg-surface'}`}
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
