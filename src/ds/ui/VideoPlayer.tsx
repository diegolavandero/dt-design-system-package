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
  <svg viewBox="0 0 24 24" className="ml-ds-1 h-ds-6 w-ds-6 fill-action" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
);
const Pause = () => (
  <svg viewBox="0 0 24 24" className="h-ds-6 w-ds-6 fill-action" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" /></svg>
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
      className={cn('group relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-nav to-action', className)}
    >
      <span className="absolute left-ds-3 top-ds-3 rounded-ds-md bg-scrim-strong px-ds-2 py-ds-1 text-ds-caption font-bold uppercase leading-none tracking-ds-label text-action-strong">{tag}</span>
      <span
        className={cn(
          'flex h-ds-topbar w-ds-sidebar items-center justify-center rounded-ds-pill bg-scrim-opaque shadow-ds-md transition-opacity duration-ds-fast',
          state === 'playing' && 'opacity-0 group-hover:opacity-100',
        )}
      >
        {state === 'playing' ? <Pause /> : <Play />}
      </span>
      <span className="absolute bottom-ds-3 right-ds-3 rounded-ds-sm bg-indigo/80 px-ds-2 py-ds-1 text-ds-caption font-medium leading-none text-fg-inverse">{duration}</span>
      {state !== 'idle' && (
        <span className="absolute inset-x-0 bottom-0 h-ds-1 bg-scrim-soft">
          <i
            className="block h-full w-0 bg-surface animate-ds-progress"
            style={{ animationPlayState: state === 'paused' ? 'paused' : 'running' }}
          />
        </span>
      )}
    </button>
  );
}
