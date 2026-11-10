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

## Estado del port de la documentación (docs SPA)

Todas las secciones de las pestañas Desktop y Mobile del sitio original están portadas a React + Tailwind (cada `renderer` del nav tiene componente).
Diferencias deliberadas respecto al original (bugs no replicados): margen `.sec` de 52px que choca con `.btn.sec`, `--font-mono` indefinido,
claves i18n crudas visibles y etiquetas `<strong>` mostradas como texto. Pendientes menores: búsqueda a nivel de bloque (`navigateToBlock`),
`dsAlert` inline y `dtDrop` multiselección fuera de la docs, y la maqueta "Table page" no es responsive (igual que el original).

## Decisiones abiertas

- Logo de LastMile: el asset `sections/assets/logos/lastmile-desktop-white.svg` no existe en el repo; se usa un wordmark de texto.
- Dark mode: la capa semántica lo permite; falta definir los valores.
