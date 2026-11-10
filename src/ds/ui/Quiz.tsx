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
        <div className="px-2 pb-2 pt-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
            <Icon name="checkmark-filled" size={32} color="var(--color-success)" />
          </div>
          <h3 className="mb-1.5 text-2xl font-bold leading-[26px] text-fg">{done.title}</h3>
          <p className="mb-5 text-base text-fg-muted">{done.text}</p>
          <Button variant="primary" className="mx-auto" onClick={() => onClose(true)}>{done.action}</Button>
        </div>
      ) : (
        <>
          <div className="mb-3.5 flex items-center justify-between">
            <span className="whitespace-nowrap text-xs font-semibold text-fg-muted">Pregunta {index + 1} de {questions.length}</span>
            <span className="ml-3.5 h-1 flex-1 overflow-hidden rounded-sm bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((index / questions.length) * 100)}>
              <i className="block h-full bg-action transition-[width] duration-200" style={{ width: `${(index / questions.length) * 100}%` }} />
            </span>
          </div>
          <h3 className="mb-3.5 text-lg font-bold leading-[22px] text-fg">{item.q}</h3>
          <div role="radiogroup" aria-label={item.q} className="flex flex-col gap-2">
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
                    'flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-base text-fg transition-colors',
                    state === 'idle' && 'border-line hover:border-focus hover:bg-action-soft',
                    state === 'selected' && 'border-action bg-action-soft',
                    state === 'correct' && 'border-success bg-success-bg',
                    state === 'wrong' && 'border-danger-fg bg-danger-bg',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2',
                      state === 'idle' && 'border-line-strong',
                      state === 'selected' && 'border-action',
                      state === 'correct' && 'border-success',
                      state === 'wrong' && 'border-danger-fg',
                    )}
                  >
                    {state === 'selected' && <i className="h-[9px] w-[9px] rounded-full bg-action" />}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
          <p role="status" className={cn('mb-1 mt-1.5 min-h-[18px] text-sm font-semibold', correct ? 'text-success' : 'text-danger-fg')}>
            {phase === 'checked' ? (correct ? '¡Correcto!' : 'No exactamente. Repasa este punto.') : ''}
          </p>
          <div className="mt-3 flex justify-end">
            {phase === 'checked' ? (
              correct ? <Button variant="primary" onClick={next}>{last ? 'Finalizar' : 'Siguiente'}</Button> : <Button variant="primary" onClick={retry}>Intentar de nuevo</Button>
            ) : (
              <Button variant="primary" disabled={picked === null} onClick={verify} className="disabled:pointer-events-none disabled:opacity-50">Verificar respuesta</Button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
