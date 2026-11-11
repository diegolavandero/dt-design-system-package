import {
  ArticleBody, ArticleCard, ArticleFeedback, ArticleHeader, Badge, Breadcrumb, Button, Drawer, LinkList, ListRow,
  ProgressRing, RelatedItem, RelatedList, StatusIcon, StepList, VideoPlayer, type Crumb, type StatusIconState,
} from '@/ds';
import type { Tutorial, TutorialStatus } from './catalog';
import { ARTICLES, SECTION, authorColor, tutorialArticleBlocks, tutorialArticles, tutorialDescription } from './data';
import type { HelpCenter } from './useHelpCenter';

const SUPPORT_LINKS = [
  { icon: 'document-text', label: 'Visita nuestro centro de soporte' },
  { icon: 'help', label: 'Preguntas frecuentes' },
  { icon: 'data-base', label: 'Documentación API' },
  { icon: 'message', label: 'Chatea con alguien' },
] as const;

const Label = ({ children, first }: { children: string; first?: boolean }) => (
  <h3 className={`mb-ds-3 text-ds-caption font-bold uppercase leading-none tracking-ds-label text-fg-muted ${first ? 'mt-0' : 'mt-ds-6'}`}>{children}</h3>
);

const TutorialBadge = ({ t }: { t: Tutorial }) =>
  t.status === 'completado' || t.done ? <Badge variant="success">Completado</Badge> : t.status === 'en-progreso' || t.videoSeen ? <Badge variant="info">En progreso</Badge> : <Badge variant="neutral">Pendiente</Badge>;

const STATE: Record<TutorialStatus, StatusIconState> = { pendiente: 'pending', 'en-progreso': 'progress', completado: 'done' };
const StatusIndicator = ({ status }: { status: TutorialStatus }) => <StatusIcon state={STATE[status]} />;

/** Bloque «video + progreso + cuestionario» compartido por la ayuda de sección y los tutoriales. */
function LearningBlock(props: {
  videoLabel: string; tag: string; duration: string; title: string; chip: React.ReactNode; description: string;
  seen: boolean; done: boolean; stepVideo: string; footDone: string; footTodo: string;
  onPlay: () => void; onQuiz: () => void; embedUrl?: string;
}) {
  return (
    <>
      <Label first>{props.videoLabel}</Label>
      <div className="overflow-hidden rounded-ds-xl border border-line transition-shadow hover:border-line-strong hover:shadow-ds-sm">
        <VideoPlayer tag={props.tag} duration={props.duration} onFirstPlay={props.onPlay} embedUrl={props.embedUrl} />
        <div className="px-ds-4 pb-ds-4 pt-ds-3">
          <div className="flex items-center justify-between gap-ds-2 text-ds-body-l font-bold leading-ds-body text-fg"><span>{props.title}</span>{props.chip}</div>
          <p className="mt-ds-3 text-ds-body-s leading-ds-body text-fg-secondary">{props.description}</p>
        </div>
      </div>
      <div className="mt-ds-4 rounded-ds-xl border border-line bg-surface-subtle p-ds-4">
        <StepList steps={[{ label: props.stepVideo, done: props.seen }, { label: 'Responder el cuestionario (3 preguntas)', done: props.done }]} />
        {props.done ? (
          <p className="mt-ds-3 text-ds-caption font-semibold leading-ds-caption text-success">✓ {props.footDone}</p>
        ) : (
          <>
            <Button variant="primary" icon="task-complete" className="w-full justify-center" onClick={props.onQuiz}>Poner a prueba</Button>
            <p className="mt-ds-3 text-ds-caption leading-ds-caption text-fg-muted">{props.footTodo}</p>
          </>
        )}
      </div>
    </>
  );
}

export function HelpDrawer({ hc }: { hc: HelpCenter }) {
  const { view } = hc;
  const ring = view.kind === 'home' || view.kind === 'article' ? hc.overall : hc.progress;
  const tutorial = 'id' in view && view.kind !== 'article' ? hc.findTutorial(view.id) : undefined;
  const article = view.kind === 'article' ? ARTICLES[view.id] : undefined;

  let title = '';
  let crumbs: Crumb[] | undefined;
  if (view.kind === 'home') { title = SECTION.name; crumbs = [{ label: 'Centro de ayuda' }]; }
  else if (view.kind === 'catalog') title = 'Tutoriales';
  else if (view.kind === 'article' && article) {
    title = article.title;
    crumbs = [{ label: 'Centro de ayuda', onSelect: hc.openHelp }, ...article.crumb.map((label) => ({ label }))];
  } else if (view.kind === 'tutorial' && tutorial) {
    title = tutorial.name;
    crumbs = [{ label: 'Tutoriales', onSelect: hc.openCatalog }, { label: `Nivel ${tutorial.level}` }, { label: tutorial.name }];
  } else if (view.kind === 'tut-article' && tutorial) {
    title = tutorialArticles(tutorial)[view.idx].t;
    crumbs = [{ label: 'Tutoriales', onSelect: hc.openCatalog }, { label: tutorial.name, onSelect: () => hc.openTutorial(tutorial.id) }, { label: title }];
  }

  const scrollKey = JSON.stringify(view);

  return (
    <Drawer
      open={hc.open}
      onClose={hc.close}
      onEscape={hc.back}
      scrollKey={scrollKey}
      label="Centro de ayuda"
      title={<><span className="text-ds-body-l font-bold text-fg">{title}</span><ProgressRing {...ring} percent={ring.pct} /></>}
      context={crumbs && <Breadcrumb items={crumbs} />}
    >
      {view.kind === 'home' && (
        <>
          <LearningBlock
            videoLabel="Video de la sección" tag={SECTION.name} duration={SECTION.videoDur} title={SECTION.videoTitle} description={SECTION.desc}
            chip={hc.sectionDone ? <Badge variant="success">Aprobada</Badge> : hc.videoSeen ? <Badge variant="neutral">Visto</Badge> : <Badge variant="info">Nuevo</Badge>}
            seen={hc.videoSeen} done={hc.sectionDone} stepVideo="Ver el video de la sección"
            footDone="Completaste el aprendizaje de esta sección." footTodo="Al aprobar el cuestionario, sumas esta sección a tu onboarding general."
            onPlay={hc.markSectionSeen} onQuiz={hc.startSectionQuiz} embedUrl={SECTION.videoEmbed || undefined}
          />
          <Label>Artículos sobre esta sección</Label>
          {SECTION.articles.map((a) => <ArticleCard key={a.id} title={a.t} description={a.d} onClick={() => hc.openArticle(a.id)} />)}
          <LinkList items={[...SUPPORT_LINKS]} />
        </>
      )}

      {view.kind === 'article' && article && (
        <>
          <ArticleHeader title={article.title} subtitle={article.sub} author={article.author} authorColor={authorColor(article.author)} date={article.date} />
          <ArticleBody blocks={article.blocks} />
          <RelatedList title="Artículos relacionados">
            {article.related.map((id) => <RelatedItem key={id} label={ARTICLES[id].title} onClick={() => hc.openArticle(id)} />)}
          </RelatedList>
          <ArticleFeedback key={view.id} />
        </>
      )}

      {view.kind === 'catalog' && (
        <>
          <p className="mb-ds-2 mt-ds-1 text-ds-body-s leading-ds-body text-fg-secondary">Avanza por los niveles a tu ritmo. Cada tutorial incluye un video corto y un cuestionario para reforzar lo aprendido.</p>
          {hc.catalog.map((lvl) => {
            const web = lvl.tuts.filter((t) => t.group !== 'app');
            const app = lvl.tuts.filter((t) => t.group === 'app');
            const done = lvl.tuts.filter((t) => t.status === 'completado').length;
            const row = (t: Tutorial) => (
              <ListRow key={t.id} onClick={() => hc.openTutorial(t.id)} leading={<StatusIndicator status={t.status} />} trailing={<TutorialBadge t={t} />}>{t.name}</ListRow>
            );
            return (
              <section key={lvl.level} aria-label={lvl.name}>
                <div className="mb-ds-2 mt-ds-6 flex items-center justify-between gap-ds-3 first-of-type:mt-ds-2">
                  <h3 className="text-ds-body-l font-bold leading-none text-fg">{lvl.name}</h3>
                  <span className="shrink-0 whitespace-nowrap text-ds-caption font-semibold leading-none text-fg-muted">{done}/{lvl.tuts.length} completados</span>
                </div>
                {web.map(row)}
                {app.length > 0 && (
                  <>
                    <div className="mb-ds-2 mt-ds-4 flex items-center gap-ds-2 px-ds-1">
                      <span className="whitespace-nowrap text-ds-caption font-bold uppercase leading-none tracking-ds-label text-fg-muted">App móvil</span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                    {app.map(row)}
                  </>
                )}
              </section>
            );
          })}
        </>
      )}

      {view.kind === 'tutorial' && tutorial && (
        <>
          <LearningBlock
            videoLabel="Video del tutorial" tag={tutorial.name} duration="2:30" title={`Cómo trabajar con ${tutorial.name}`} description={tutorialDescription(tutorial)}
            chip={<TutorialBadge t={tutorial} />}
            seen={!!tutorial.videoSeen || tutorial.status === 'completado'} done={!!tutorial.done} stepVideo="Ver el video del tutorial"
            footDone="Completaste este tutorial." footTodo="Al aprobar el cuestionario, este tutorial suma a tu progreso de capacitaciones."
            onPlay={() => hc.markTutorialSeen(tutorial.id)} onQuiz={() => hc.startTutorialQuiz(tutorial.id)}
          />
          <Label>Artículos relacionados</Label>
          {tutorialArticles(tutorial).map((a, i) => <ArticleCard key={a.t} title={a.t} description={a.d} onClick={() => hc.openTutorialArticle(tutorial.id, i)} />)}
          <LinkList items={SUPPORT_LINKS.filter((l) => l.icon !== 'data-base')} />
        </>
      )}

      {view.kind === 'tut-article' && tutorial && (() => {
        const arts = tutorialArticles(tutorial);
        const a = arts[view.idx];
        return (
          <>
            <ArticleHeader title={a.t} subtitle={a.d} author="Equipo DispatchTrack" authorColor={authorColor('Equipo DispatchTrack')} date="Actualizado recientemente" />
            <ArticleBody blocks={tutorialArticleBlocks(tutorial)} />
            <RelatedList title={`Más sobre ${tutorial.name}`}>
              {arts.map((x, i) => (i === view.idx ? null : <RelatedItem key={x.t} label={x.t} onClick={() => hc.openTutorialArticle(tutorial.id, i)} />))}
              <RelatedItem label="Volver al video del tutorial" onClick={() => hc.openTutorial(tutorial.id)} />
            </RelatedList>
            <ArticleFeedback key={`${view.id}-${view.idx}`} />
          </>
        );
      })()}
    </Drawer>
  );
}
