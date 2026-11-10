# Audit del design system anterior (HTML + JS vanilla)

Repo auditado: `diegolavandero/dt-design-system` (mirror de despliegue en Vercel), versión 2.4.0 del changelog.

| Sev. | Hallazgo | Evidencia | Estado en esta librería |
|---|---|---|---|
| CRÍTICO | Sin capa de componentes: HTML en strings | `renderers.js` 605 KB, 64 funciones, 2.118 `style=""` y 338 handlers inline | Componentes React tipados |
| CRÍTICO | Drift de tokens: hex duplicados y huérfanos | 189 usos de hex que ya son token; 95 usos de 34 colores sin token; dos azules primarios (`--b6 #306EF2` vs `--su4 #1F60ED`) | Componentes solo con tokens; un único azul de acción |
| MAYOR | Sin tokens semánticos | Solo `--n*`, `--b*`… | `semantic.css` + preset Tailwind |
| MAYOR | Accesibilidad | 5 `aria-`, 1 `role`, 0 `alt`, 1 `:focus-visible` en un HTML de 229 KB | Roles, foco, teclado, `aria-sort`, `aria-current` |
| MAYOR | Login solo decorativo | Gate de Supabase en cliente; contenido en repo público | Pendiente: decidir repo privado + auth en el borde |
| MENOR | Sin build, tests ni historial; archivos sueltos | 1 commit, `wrangler.jsonc` legado | Vite + TypeScript estricto |

## Backlog de migración

`renderers.js` tiene 64 funciones; esta librería porta por uso real. Pendiente: `dsAlert` inline, `dtDrop` multiselección,
`buildSettingsSidebar` con grupos colapsables, formularios, stepper, date-range, y el resto de iconos (el DS define 77;
aquí se incluyen los usados).

## Decisiones abiertas

- Logo de LastMile: el asset `sections/assets/logos/lastmile-desktop-white.svg` no existe en el repo; se usa un wordmark de texto.
- Dark mode: la capa semántica lo permite; falta definir los valores.
