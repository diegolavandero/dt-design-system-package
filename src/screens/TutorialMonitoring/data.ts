export type Classification = 'Completado' | 'En progreso' | 'Sin iniciar';
export type OnboardingStatus = 'Activo' | 'Bloqueado';

export interface MonitorUser {
  id: string;
  name: string;
  email: string;
  estado: OnboardingStatus;
  role: string;
  /** true = inscrito en capacitación (aparece en la tabla) */
  cap: boolean;
  reg: number;
  comp: number;
  exam: number;
  prom: number;
  avance: number;
  cumpl: number;
  aprob: number;
  clas: Classification;
}

export interface TutorialStat {
  name: string;
  level: '100' | '200' | '300';
  comp: number;
  prog: number;
  tasa: number;
  avance: number;
}

const u = (
  id: string, name: string, email: string, estado: OnboardingStatus, role: string, cap: boolean,
  reg: number, comp: number, exam: number, prom: number, avance: number, cumpl: number, aprob: number, clas: Classification,
): MonitorUser => ({ id, name, email, estado, role, cap, reg, comp, exam, prom, avance, cumpl, aprob, clas });

export const USERS: MonitorUser[] = [
  u('u1', 'Maya Jonson', 'maya.jonson@dispatchtrack.com', 'Activo', 'Admin Master', true, 8, 6, 5, 88, 75, 60, 5, 'En progreso'),
  u('u3', 'Liam Smith', 'liam.smith@dispatchtrack.com', 'Activo', 'Admin 2', true, 12, 12, 10, 94, 100, 100, 10, 'Completado'),
  u('u5', 'Tommy Nguyen', 'tommy.nguyen@metricstudio.cl', 'Activo', 'Planificador', true, 5, 2, 2, 71, 40, 25, 2, 'En progreso'),
  u('u2', 'Lucas Martinez', 'lucas.martinez@dispatchtrack.com', 'Bloqueado', 'Personalizado', true, 3, 1, 1, 65, 20, 10, 1, 'En progreso'),
  u('u7', 'Rajesh Kumar', 'rajesh.kumar@metricstudio.cl', 'Activo', 'Planificador', true, 0, 0, 0, 0, 0, 0, 0, 'Sin iniciar'),
  u('u6', 'Clara Lopez', 'clara.lopez@metricstudio.cl', 'Activo', 'QC', true, 0, 0, 0, 0, 0, 0, 0, 'Sin iniciar'),
  u('u4', 'Aisha Patel', 'aisha.patel@dispatchtrack.com', 'Bloqueado', 'QC', false, 0, 0, 0, 0, 0, 0, 0, 'Sin iniciar'),
  u('u8', 'Sofia Garcia', 'sofia.garcia@dispatchtrack.com', 'Bloqueado', 'QC', false, 0, 0, 0, 0, 0, 0, 0, 'Sin iniciar'),
  u('u9', 'Kevin Brown', 'kevin.brown@metricstudio.cl', 'Activo', 'Planificador', false, 0, 0, 0, 0, 0, 0, 0, 'Sin iniciar'),
];

export const ENROLLED_USERS = USERS.filter((x) => x.cap);

export const TUTORIAL_STATS: TutorialStat[] = [
  { name: 'Intro: Qué es DT y LM', level: '100', comp: 6, prog: 0, tasa: 100, avance: 100 },
  { name: 'Usuarios web', level: '100', comp: 5, prog: 1, tasa: 92, avance: 88 },
  { name: 'Notificaciones', level: '100', comp: 4, prog: 2, tasa: 85, avance: 72 },
  { name: 'Vehículos', level: '100', comp: 3, prog: 1, tasa: 80, avance: 55 },
  { name: 'Copiloto', level: '200', comp: 2, prog: 2, tasa: 70, avance: 40 },
  { name: 'Módulos monitoreo: Órdenes', level: '100', comp: 2, prog: 3, tasa: 66, avance: 38 },
  { name: 'Reportería', level: '300', comp: 1, prog: 1, tasa: 60, avance: 18 },
];

export const tutorialStatus = (t: TutorialStat): Classification =>
  t.avance >= 100 ? 'Completado' : t.avance > 0 ? 'En progreso' : 'Sin iniciar';

/** Color de avatar estable por nombre, tomado de tokens del DS (sin hex). */
const AVATAR_TOKENS = ['--b6', '--p5', '--t5', '--g6', '--o7', '--r6', '--p7'] as const;
export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return `var(${AVATAR_TOKENS[h % AVATAR_TOKENS.length]})`;
}
