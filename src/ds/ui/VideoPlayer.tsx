import { useState } from 'react';
import { cn } from '@/ds/lib/cn';

interface VideoPlayerProps {
  /** Etiqueta en la esquina superior (nombre de la sección o función). */
  tag: string;
  duration: string;
  /** Se llama la primera vez que se reproduce. */
  onFirstPlay?: () => void;
  /** URL de embed real. Si se define, reemplaza la simulación por un iframe. */
  embedUrl?: string;
  className?: string;
}

const Play = () => (
  <svg viewBox="0 0 24 24" className="ml-[3px] h-[22px] w-[22px] fill-action" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
const Pause = () => (
  <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-action" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" /></svg>
);

/** Reproductor de video con estados idle / reproduciendo / pausado. Simula el avance mientras no haya un video real. */
export function VideoPlayer({ tag, duration, onFirstPlay, embedUrl, className }: VideoPlayerProps) {
  const [state, setState] = useState<'idle' | 'playing' | 'paused'>('idle');

  const toggle = () => {
    if (state === 'idle') {
      setState('playing');
      onFirstPlay?.();
    } else setState((s) => (s === 'playing' ? 'paused' : 'playing'));
  };

  if (embedUrl && state !== 'idle') {
    return (
      <div className={cn('relative aspect-video bg-indigo', className)}>
        <iframe src={embedUrl} title={tag} allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={state === 'playing' ? `Pausar video: ${tag}` : `Reproducir video: ${tag}`}
      className={cn('group relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-[#1B2C5C] to-action', className)}
    >
      <span className="absolute left-2.5 top-2.5 rounded-md bg-white/90 px-[9px] py-[5px] text-3xs font-bold uppercase leading-none tracking-wide text-action-strong">{tag}</span>
      <span
        className={cn(
          'flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/95 shadow-[0_4px_14px_rgba(0,0,0,.25)] transition-opacity duration-200',
          state === 'playing' && 'opacity-0 group-hover:opacity-100',
        )}
      >
        {state === 'playing' ? <Pause /> : <Play />}
      </span>
      <span className="absolute bottom-2.5 right-2.5 rounded bg-indigo/80 px-[7px] py-1 text-2xs font-medium leading-none text-fg-inverse">{duration}</span>
      {state !== 'idle' && (
        <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
          <i
            className="block h-full w-0 bg-white [animation:vfprog_14s_linear_forwards]"
            style={{ animationPlayState: state === 'paused' ? 'paused' : 'running' }}
          />
        </span>
      )}
    </button>
  );
}
