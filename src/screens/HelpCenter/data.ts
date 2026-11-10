import type { ArticleBlock, QuizQuestion } from '@/ds';
import type { Tutorial } from './catalog';

/* ───────── Contexto de la sección (esta pantalla = Órdenes/guías) ───────── */

export const SECTION = {
  name: 'Órdenes/guías',
  videoTitle: 'Cómo trabajar con Órdenes/guías',
  videoDur: '2:40',
  /** URL de embed real (p. ej. Drive `/preview`). Vacío = reproductor simulado. */
  videoEmbed: '',
  desc: 'Aprende cómo ingresar al módulo de Órdenes, revisar una orden en detalle y entender su historial paso a paso.',
  articles: [
    { id: 'trazabilidad', t: 'Trazabilidad de la guía', d: 'Conoce el historial de una orden y todas las acciones relacionadas a ella.' },
    { id: 'desasociar', t: '¿Cómo desasociar guías o pedidos de una ruta?', d: 'Pasos para quitar guías no deseadas de una ruta existente.' },
    { id: 'bloqueo', t: 'Bloqueo de guías', d: 'Cuándo y por qué una guía se bloquea, y cómo desbloquearla.' },
  ],
  quiz: [
    { q: '¿Dónde ves el estado actual de una orden en esta sección?', opts: ['En la columna Estado de la tabla', 'En el menú de Ajustes', 'Solo en la app móvil'], correct: 0 },
    { q: '¿Qué indica el subestado "Entrega parcial"?', opts: ['La orden fue anulada', 'Se entregó solo una parte de los productos', 'El vehículo no salió a ruta'], correct: 1 },
    { q: '¿Cómo creas una nueva orden?', opts: ['Solo desde el importador de Excel', 'Escribiendo a soporte', 'Con el botón "Nueva orden", arriba a la derecha'], correct: 2 },
  ] satisfies QuizQuestion[],
};

/** Tutorial al que enlaza el ícono junto al subtítulo de la página. */
export const SECTION_TUTORIAL_ID = 'n1-mon-ordenes';

/** Progreso general del onboarding: la sección actual es una de 8 (2 ya completadas). */
export const ONBOARDING = { total: 8, doneBase: 2 };

export const NEW_FEATURE = {
  name: 'Filtros guardados',
  videoDur: '1:20',
  desc: 'Ahora puedes guardar tus combinaciones de filtros más usadas en Órdenes/guías y volver a aplicarlas con un clic. Crea una vista, ponle nombre y reutilízala sin repetir la búsqueda cada vez.',
  quiz: [
    { q: '¿Para qué sirven los Filtros guardados?', opts: ['Para reutilizar una búsqueda con un clic', 'Para eliminar órdenes en lote', 'Para cambiar el idioma de la app'], correct: 0 },
    { q: '¿Dónde aplicas un filtro guardado?', opts: ['En el menú de Ajustes', 'En la barra de filtros de Órdenes/guías', 'Solo desde la app móvil'], correct: 1 },
  ] satisfies QuizQuestion[],
};

/* ───────── Artículos del centro de ayuda ───────── */

export interface Article {
  crumb: string[];
  title: string;
  sub: string;
  author: string;
  date: string;
  blocks: ArticleBlock[];
  related: string[];
}

export const ARTICLES: Record<string, Article> = {
  trazabilidad: {
    crumb: ['LastMile', 'Órdenes/guías'],
    title: 'Trazabilidad de la guía',
    sub: 'La trazabilidad es el historial completo de una orden: cada acción y cada cambio de estado, con su responsable y su fecha.',
    author: 'Mervin Rodríguez',
    date: '26 de junio de 2024',
    blocks: [
      { type: 'p', text: 'En esta vista puedes revisar todo lo que ocurrió con una orden desde que se creó: cambios de estado, reasignaciones, ediciones y eventos de entrega, registrados por los usuarios web y por la app móvil.' },
      { type: 'h', text: 'Acceder al historial' },
      { type: 'ol', items: ['En la tabla de <b>Órdenes/guías</b>, ubica la orden que quieres revisar.', 'Abre el menú de acciones (⋮) al final de la fila y selecciona <b>Trazabilidad</b>.'] },
      { type: 'shot', cap: 'Tabla de Órdenes/guías → menú de acciones → Trazabilidad' },
      { type: 'h', text: 'Vista del historial' },
      { type: 'p', text: 'El historial se muestra como una línea de tiempo con los colores del semáforo según el tipo de evento:' },
      { type: 'ul', items: [
        { dot: 'success', text: '<b>Verde</b>: la orden avanzó (creada, asignada o entregada).' },
        { dot: 'warning', text: '<b>Amarillo</b>: la orden fue editada (cambio de datos o de vehículo).' },
        { dot: 'danger', text: '<b>Rojo</b>: la orden fue anulada o marcada como no entregada.' },
      ] },
      { type: 'shot', cap: 'Línea de tiempo de la orden con eventos por color' },
      { type: 'h', text: 'Detalle de cada evento' },
      { type: 'p', text: 'Al expandir un evento ves el usuario que lo realizó, la fecha y hora exacta y, cuando aplica, el campo modificado con su valor anterior y el nuevo valor.' },
    ],
    related: ['desasociar', 'bloqueo'],
  },
  desasociar: {
    crumb: ['LastMile', 'Órdenes/guías'],
    title: '¿Cómo desasociar guías o pedidos de una ruta?',
    sub: 'Quita una o varias guías de una ruta ya creada sin tener que rehacerla.',
    author: 'Mervin Rodríguez',
    date: '12 de marzo de 2024',
    blocks: [
      { type: 'p', text: 'Si una guía quedó asignada a la ruta equivocada o ya no debe salir a reparto, puedes desasociarla en pocos pasos.' },
      { type: 'h', text: 'Pasos' },
      { type: 'ol', items: ['Selecciona la ruta y haz clic en <b>Editar</b>.', 'Marca las guías que quieres quitar y abre <b>Acciones</b> → <b>Desasociar</b>.', 'Confirma. Las guías vuelven al estado <b>sin ruta</b> y quedan disponibles para reasignar.'] },
      { type: 'shot', cap: 'Ruta en modo edición → selección de guías → Acciones → Desasociar' },
      { type: 'p', text: 'Luego pide al conductor que <b>refresque o sincronice</b> desde su celular. Si desasociaste todas las guías, la ruta quedará en 0 y podrá cerrarse; si fueron solo algunas, desaparecerán de la ruta que tiene el transportista.' },
    ],
    related: ['trazabilidad', 'bloqueo'],
  },
  bloqueo: {
    crumb: ['LastMile', 'Órdenes/guías'],
    title: 'Bloqueo de guías',
    sub: 'Entiende por qué una guía aparece bloqueada y cómo desbloquearla.',
    author: 'Mervin Rodríguez',
    date: '4 de abril de 2024',
    blocks: [
      { type: 'p', text: 'Una guía bloqueada no puede asignarse a una ruta ni editarse hasta resolver la causa del bloqueo. Es una protección para evitar mover órdenes con información incompleta o en revisión.' },
      { type: 'h', text: 'Motivos más comunes' },
      { type: 'ul', items: [
        { dot: 'warning', text: '<b>Datos incompletos</b>: falta dirección, contacto o producto.' },
        { dot: 'warning', text: '<b>En revisión</b>: la orden está marcada para validación manual.' },
        { dot: 'danger', text: '<b>Bloqueo por regla</b>: una regla de negocio retiene la guía (por ejemplo, pago pendiente).' },
      ] },
      { type: 'shot', cap: 'Guía con indicador de bloqueo en la tabla' },
      { type: 'h', text: 'Cómo desbloquear' },
      { type: 'ol', items: ['Abre la guía y revisa el motivo indicado en el detalle.', 'Completa o corrige la información faltante.', 'Si el bloqueo proviene de una regla, contacta a tu administrador para liberarla.'] },
    ],
    related: ['trazabilidad', 'desasociar'],
  },
};

/** Color de avatar por autor, con tokens del DS. */
const AUTHOR_TOKENS = ['--color-action-text', '--p5', '--t5', '--o5'] as const;
export function authorColor(name: string): string {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return `var(${AUTHOR_TOKENS[h % AUTHOR_TOKENS.length]})`;
}

/* ───────── Contenido genérico de cada tutorial (prototipo) ───────── */

export const tutorialDescription = (t: Tutorial) =>
  `Aprende a usar ${t.name} en DispatchTrack: para qué sirve, cómo se configura y cómo aprovecharlo en tu operación diaria.`;

export const tutorialArticles = (t: Tutorial) => [
  { t: `Cómo configurar ${t.name}`, d: `Pasos para dejar ${t.name} listo para operar.` },
  { t: `Preguntas frecuentes sobre ${t.name}`, d: `Resuelve las dudas más comunes de ${t.name}.` },
];

export const tutorialQuiz = (t: Tutorial): QuizQuestion[] => [
  { q: `¿Dónde encuentras la configuración de ${t.name} en DispatchTrack?`, opts: ['En el menú principal de la plataforma', 'Solo escribiendo a soporte', 'No es configurable'], correct: 0 },
  { q: `¿Quién puede gestionar ${t.name}?`, opts: ['Cualquier visitante anónimo', 'Usuarios con los permisos correspondientes', 'Solo el conductor desde la app'], correct: 1 },
  { q: '¿Qué deberías hacer al terminar este tutorial?', opts: ['Aplicar lo aprendido en tu operación', 'Reiniciar la plataforma', 'Nada, no aplica'], correct: 0 },
];

export const tutorialArticleBlocks = (t: Tutorial): ArticleBlock[] => [
  { type: 'p', text: `En este artículo aprenderás a trabajar con <b>${t.name}</b> dentro de DispatchTrack: para qué sirve, cómo se configura y cómo aprovecharlo en tu operación diaria.` },
  { type: 'h', text: 'Antes de empezar' },
  { type: 'p', text: `Asegúrate de contar con los permisos necesarios y de haber revisado el video del tutorial de <b>${t.name}</b>.` },
  { type: 'h', text: 'Pasos' },
  { type: 'ol', items: ['Ingresa al módulo correspondiente desde el menú principal.', `Ubica la sección de <b>${t.name}</b> y abre su configuración.`, 'Completa los campos requeridos y guarda los cambios.'] },
  { type: 'shot', cap: `Pantalla de ${t.name} en DispatchTrack` },
  { type: 'h', text: 'Recomendaciones' },
  { type: 'p', text: `Revisa periódicamente la configuración de <b>${t.name}</b> para mantenerla alineada con tu operación.` },
];

/* ───────── Tabla de órdenes (datos de demostración) ───────── */

export interface Order {
  id: string;
  code: string;
  estado: { label: string; variant: 'success' | 'danger' | 'warning' | 'neutral' };
  subestado?: { label: string; variant: 'success' | 'danger' | 'warning' | 'neutral' };
  vehiculo: string;
  cliente: string;
  centro: string;
  fecha: string;
}

const o = (id: string, code: string, e: string, ev: Order['estado']['variant'], s: string | undefined, sv: Order['estado']['variant'] | undefined, vehiculo: string, cliente: string, centro: string): Order => ({
  id, code, estado: { label: e, variant: ev }, subestado: s && sv ? { label: s, variant: sv } : undefined, vehiculo, cliente, centro, fecha: '10/08/2022',
});

export const ORDERS: Order[] = [
  o('o1', 'SFAUD3345-236', 'Entregado', 'success', 'Entrega exitosa', 'success', 'AKP789', 'Boxman Ltda', 'Pudahuel'),
  o('o2', 'GSFLJDF-236-23', 'No entregado', 'danger', 'Robo', 'danger', 'HSD767', 'Sodimac', 'Las Condes'),
  o('o3', 'ADDLJDF-236-23', 'Entrega parcial', 'warning', 'Productos dañados', 'warning', 'LCZ162', 'Sodimac', 'Las Condes'),
  o('o4', 'ADDLJDF-236-24', 'En ruta', 'neutral', undefined, undefined, 'VXQ345', 'Boxman', 'Macul'),
  o('o5', 'FDGFGD3345-236', 'Recogido', 'success', 'Recogida exitosa', 'success', 'AKP789', 'Boxman Ltda', 'Pudahuel'),
  o('o6', 'HJKDF-236-23', 'No recogido', 'danger', 'Robo', 'danger', 'HSD767', 'Sodimac', 'Las Condes'),
  o('o7', 'SGDFLJDF-236-23', 'Recogido parcial', 'warning', 'Productos dañados', 'warning', 'LCZ162', 'Sodimac', 'Las Condes'),
  o('o8', 'WQDFD-236-56', 'En ruta', 'neutral', undefined, undefined, 'VXQ345', 'Boxman', 'Macul'),
];
