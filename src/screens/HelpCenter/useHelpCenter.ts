import { useCallback, useMemo, useState } from 'react';
import { useToast, type QuizQuestion } from '@/ds';
import { INITIAL_CATALOG, type Level, type Tutorial } from './catalog';
import { NEW_FEATURE, ONBOARDING, SECTION, tutorialQuiz } from './data';

export type View =
  | { kind: 'home' }
  | { kind: 'article'; id: string }
  | { kind: 'catalog' }
  | { kind: 'tutorial'; id: string }
  | { kind: 'tut-article'; id: string; idx: number };

export interface QuizConfig {
  title: string;
  questions: QuizQuestion[];
  done: { title: string; text: string; action: string };
  onComplete: () => void;
  after?: () => void;
}

const cloneCatalog = (): Level[] => INITIAL_CATALOG.map((l) => ({ ...l, tuts: l.tuts.map((t) => ({ ...t })) }));

/** Estado y acciones del centro de ayuda: drawer, catálogo de tutoriales, progreso y cuestionarios. */
export function useHelpCenter() {
  const notify = useToast();
  const [catalog, setCatalog] = useState<Level[]>(cloneCatalog);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ kind: 'home' });
  const [videoSeen, setVideoSeen] = useState(false);
  const [sectionDone, setSectionDone] = useState(false);
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  const [announce, setAnnounce] = useState(false);
  const [extraCount, setExtraCount] = useState(0);

  const tutorials = useMemo(() => catalog.flatMap((l) => l.tuts), [catalog]);
  const findTutorial = useCallback((id: string) => tutorials.find((t) => t.id === id), [tutorials]);

  const progress = useMemo(() => {
    const score = tutorials.reduce((s, t) => s + (t.status === 'completado' ? 1 : t.status === 'en-progreso' ? 0.5 : 0), 0);
    return { done: tutorials.filter((t) => t.status === 'completado').length, total: tutorials.length, pct: Math.round((score / tutorials.length) * 100) };
  }, [tutorials]);

  const overallDone = ONBOARDING.doneBase + (sectionDone ? 1 : 0);
  const overall = { done: overallDone, total: ONBOARDING.total, pct: Math.round((overallDone / ONBOARDING.total) * 100) };

  const patchTutorial = (id: string, change: Partial<Tutorial>) =>
    setCatalog((ls) => ls.map((l) => ({ ...l, tuts: l.tuts.map((t) => (t.id === id ? { ...t, ...change } : t)) })));

  /* ── navegación del drawer ── */
  const goTo = (v: View) => {
    setView(v);
    setOpen(true);
  };
  const openHelp = () => goTo({ kind: 'home' });
  const openCatalog = () => goTo({ kind: 'catalog' });
  const openTutorial = (id: string) => goTo({ kind: 'tutorial', id });
  const openArticle = (id: string) => goTo({ kind: 'article', id });
  const openTutorialArticle = (id: string, idx: number) => goTo({ kind: 'tut-article', id, idx });
  const close = () => setOpen(false);

  /** Esc / «volver»: retrocede un nivel y, en la raíz, cierra el panel. */
  const back = () => {
    if (view.kind === 'article') setView({ kind: 'home' });
    else if (view.kind === 'tut-article') setView({ kind: 'tutorial', id: view.id });
    else if (view.kind === 'tutorial') setView({ kind: 'catalog' });
    else close();
  };

  /* ── video ── */
  const markSectionSeen = () => setVideoSeen(true);
  const markTutorialSeen = (id: string) => {
    const t = findTutorial(id);
    if (!t || t.videoSeen) return;
    patchTutorial(id, { videoSeen: true, status: t.status === 'pendiente' ? 'en-progreso' : t.status });
  };

  /* ── cuestionarios ── */
  const startSectionQuiz = () =>
    setQuiz({
      title: 'Pon a prueba lo que aprendiste',
      questions: SECTION.quiz,
      done: {
        title: `¡Completaste la sección ${SECTION.name}!`,
        text: 'Esta sección quedó marcada como aprendida y suma a tu onboarding general. Puedes volver al video desde el Centro de ayuda.',
        action: 'Volver al Centro de ayuda',
      },
      onComplete: () => setSectionDone(true),
      after: () => {
        openHelp();
        notify('success', `Sección ${SECTION.name} completada`);
      },
    });

  const startFeatureQuiz = () =>
    setQuiz({
      title: `Comprobación · ${NEW_FEATURE.name}`,
      questions: NEW_FEATURE.quiz,
      done: { title: `¡Listo! Ya conoces ${NEW_FEATURE.name}`, text: 'Marcamos esta función nueva como aprendida.', action: 'Entendido' },
      onComplete: () => undefined,
      after: () => notify('success', `Función nueva: ${NEW_FEATURE.name} — comprobada`),
    });

  const startTutorialQuiz = (id: string) => {
    const t = findTutorial(id);
    if (!t) return;
    setQuiz({
      title: `Pon a prueba lo que aprendiste · ${t.name}`,
      questions: tutorialQuiz(t),
      done: { title: `¡Completaste ${t.name}!`, text: 'Marcamos este tutorial como completado y suma a tu progreso de capacitaciones.', action: 'Volver al tutorial' },
      onComplete: () => patchTutorial(id, { done: true, videoSeen: true, status: 'completado' }),
      after: () => {
        openTutorial(id);
        notify('success', `Tutorial completado: ${t.name}`);
      },
    });
  };

  const closeQuiz = (completed: boolean) => {
    const after = completed ? quiz?.after : undefined;
    setQuiz(null);
    after?.();
  };

  /** Demo: agrega un tutorial pendiente al nivel 100; el total sube y el % baja. */
  const addTutorial = () => {
    const n = extraCount + 1;
    setExtraCount(n);
    setCatalog((ls) =>
      ls.map((l, i) => {
        if (i !== 0) return l;
        const t: Tutorial = { id: `extra-${n}`, name: `Tutorial nuevo ${n}`, status: 'pendiente', level: l.level };
        const firstApp = l.tuts.findIndex((x) => x.group === 'app');
        const tuts = [...l.tuts];
        tuts.splice(firstApp < 0 ? tuts.length : firstApp, 0, t);
        return { ...l, tuts };
      }),
    );
    notify('success', 'Se agregó un tutorial nuevo a Capacitaciones');
  };

  return {
    catalog, tutorials, findTutorial, progress, overall,
    open, view, close, back, openHelp, openCatalog, openTutorial, openArticle, openTutorialArticle,
    videoSeen, sectionDone, markSectionSeen, markTutorialSeen,
    quiz, startSectionQuiz, startFeatureQuiz, startTutorialQuiz, closeQuiz,
    announce, setAnnounce, addTutorial,
  };
}

export type HelpCenter = ReturnType<typeof useHelpCenter>;
