import { useEffect, useState } from 'react';
import { cn } from '@/ds/lib/cn';
import { Icon } from '@/ds/icons/Icon';
import { Button } from './Button';
import { Modal } from './Modal';

export interface QuizQuestion {
  q: string;
  opts: string[];
  correct: number;
}

interface QuizProps {
  open: boolean;
  title: string;
  questions: QuizQuestion[];
  /** Texto de la pantalla final. */
  done: { title: string; text: string; action: string };
  /** Se dispara al responder bien la última pregunta. */
  onComplete: () => void;
  /** Se dispara al pulsar el botón de la pantalla final. */
  onClose: (completed: boolean) => void;
}

type Phase = 'answering' | 'checked' | 'done';

/** Cuestionario de opción única: verifica cada respuesta, permite reintentar y termina con una pantalla de logro. */
export function Quiz({ open, title, questions, done, onComplete, onClose }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');

  useEffect(() => {
    if (open) {
      setIndex(0);
      setPicked(null);
      setPhase('answering');
    }
  }, [open]);

  if (!questions.length) return null;
  const item = questions[Math.min(index, questions.length - 1)];
  const last = index === questions.length - 1;
  const correct = picked === item.correct;
  const completed = phase === 'done';

  const verify = () => setPhase('checked');
  const next = () => {
    if (last) {
      setPhase('done');
      onComplete();
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setPhase('answering');
    }
  };
  const retry = () => {
    setPicked(null);
    setPhase('answering');
  };

  return (
    <Modal open={open} onClose={() => onClose(completed)} title={completed ? 'Completado' : title}>
      {completed ? (
        <div className="px-ds-2 pb-ds-2 pt-ds-4 text-center">
          <div className="mx-auto mb-ds-4 flex h-ds-10 w-ds-10 items-center justify-center rounded-ds-pill bg-success-bg">
            <Icon name="checkmark-filled" size={32} color="var(--color-success)" />
          </div>
          <h3 className="mb-ds-2 text-ds-subtitle font-bold leading-ds-subtitle text-fg">{done.title}</h3>
          <p className="mb-ds-5 text-ds-body-s text-fg-muted">{done.text}</p>
          <Button variant="primary" className="mx-auto" onClick={() => onClose(true)}>{done.action}</Button>
        </div>
      ) : (
        <>
          <div className="mb-ds-4 flex items-center justify-between">
            <span className="whitespace-nowrap text-ds-caption font-semibold text-fg-muted">Pregunta {index + 1} de {questions.length}</span>
            <span className="ml-ds-4 h-ds-1 flex-1 overflow-hidden rounded-ds-sm bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((index / questions.length) * 100)}>
              <i className="block h-full bg-action transition-all duration-ds-fast" style={{ width: `${(index / questions.length) * 100}%` }} />
            </span>
          </div>
          <h3 className="mb-ds-4 text-ds-body-l font-bold leading-ds-body text-fg">{item.q}</h3>
          <div role="radiogroup" aria-label={item.q} className="flex flex-col gap-ds-2">
            {item.opts.map((o, i) => {
              const state = phase === 'checked' ? (i === item.correct ? 'correct' : i === picked ? 'wrong' : 'idle') : i === picked ? 'selected' : 'idle';
              return (
                <button
                  key={o}
                  type="button"
                  role="radio"
                  aria-checked={i === picked}
                  disabled={phase === 'checked'}
                  onClick={() => setPicked(i)}
                  className={cn(
                    'flex items-center gap-ds-3 rounded-ds-lg border px-ds-4 py-ds-3 text-left text-ds-body-s text-fg transition-colors',
                    state === 'idle' && 'border-line hover:border-focus hover:bg-action-soft',
                    state === 'selected' && 'border-action bg-action-soft',
                    state === 'correct' && 'border-success bg-success-bg',
                    state === 'wrong' && 'border-danger-fg bg-danger-bg',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-ds-5 w-ds-5 shrink-0 items-center justify-center rounded-ds-pill border-2',
                      state === 'idle' && 'border-line-strong',
                      state === 'selected' && 'border-action',
                      state === 'correct' && 'border-success',
                      state === 'wrong' && 'border-danger-fg',
                    )}
                  >
                    {state === 'selected' && <i className="h-ds-2 w-ds-2 rounded-ds-pill bg-action" />}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
          <p role="status" className={cn('mb-ds-1 mt-ds-2 min-h-ds-5 text-ds-body-s font-semibold', correct ? 'text-success' : 'text-danger-fg')}>
            {phase === 'checked' ? (correct ? '¡Correcto!' : 'No exactamente. Repasa este punto.') : ''}
          </p>
          <div className="mt-ds-3 flex justify-end">
            {phase === 'checked' ? (
              correct ? <Button variant="primary" onClick={next}>{last ? 'Finalizar' : 'Siguiente'}</Button> : <Button variant="primary" onClick={retry}>Intentar de nuevo</Button>
            ) : (
              <Button variant="primary" disabled={picked === null} onClick={verify} className="disabled:pointer-events-none disabled:opacity-ds-disabled">Verificar respuesta</Button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
