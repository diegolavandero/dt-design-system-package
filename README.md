# DispatchTrack Design System · React + Tailwind

Librería de componentes React tipados sobre Tailwind CSS, con tokens en dos capas.

```
src/ds/
  tokens/primitives.css   Copia fiel de colors_and_type.css (--n1…n7, --b1…b7, tipografía, espaciado)
  tokens/semantic.css     Capa semántica: --color-fg, --color-line, --color-action, --color-success-bg…
  tailwind-preset.cjs     Expone ambas capas como utilidades (text-fg, bg-action, border-line…)
  ui/ layout/ charts/     Componentes
  index.ts                API pública: las pantallas importan SOLO desde '@/ds'
src/screens/              Pantallas armadas exclusivamente con componentes del DS
```

## Reglas

1. **Los componentes consumen tokens semánticos**, nunca primitivos ni hex. Excepción documentada: la paleta de visualización de datos (`lib/vizPalette.ts`).
2. **Sin estilos inline** salvo valores dinámicos (anchos de barras, posición de menús).
3. **Estados con CSS** (`hover:`, `focus-visible:`, `aria-*`), nunca con handlers de mouse.
4. **Accesibilidad por defecto**: roles ARIA, foco visible, Esc para cerrar capas, `prefers-reduced-motion`.
5. **Las pantallas no definen estilos de componente**: si falta algo, se agrega al DS.

## Comandos

```bash
npm install
npm run dev        # galería y pantallas en http://localhost:5173
npm run typecheck
npm run build
```

Rutas (hash): `#<seccion>` (documentación del DS, p.ej. `#colors`) · `#/monitoreo` · `#/usuarios` · `#/ayuda` (prototipos)

Ver `AUDIT.md` para el diagnóstico del DS vanilla anterior y el backlog de migración.
