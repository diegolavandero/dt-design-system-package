/** Preset de Tailwind del DS: expone los tokens como utilidades. Los componentes usan los nombres semánticos. */
const scale = (prefix, steps) => Object.fromEntries(steps.map((n) => [n, `var(--${prefix}${n})`]));
const semantic = (name) => `var(--color-${name})`;

module.exports = {
  theme: {
    extend: {
      colors: {
        // Primitivos: solo para documentación y casos sin equivalente semántico (p. ej. visualización de datos).
        n: { ...scale('n', [1, 2, 3, 4, 5, 6, 7]), 45: 'var(--n4-5)', 8: 'var(--n8)' },
        b: scale('b', [1, 2, 3, 4, 5, 6, 7]),
        g: scale('g', [1, 2, 3, 4, 5, 6, 7]),
        r: scale('r', [1, 2, 3, 4, 5, 6, 7]),
        o: scale('o', [1, 2, 3, 4, 5, 6, 7]),
        t: scale('t', [1, 2, 3, 4, 5, 6, 7]),
        p: scale('p', [1, 2, 3, 4, 5, 6, 7]),
        indigo: 'var(--indigo)',
        // Semánticos
        fg: { DEFAULT: semantic('fg'), secondary: semantic('fg-secondary'), muted: semantic('fg-muted'), subtle: semantic('fg-subtle'), inverse: semantic('fg-inverse') },
        canvas: semantic('canvas'),
        surface: { DEFAULT: semantic('surface'), subtle: semantic('surface-subtle'), header: semantic('surface-header') },
        line: { DEFAULT: semantic('line'), strong: semantic('line-strong') },
        action: {
          DEFAULT: semantic('action'), hover: semantic('action-hover'), text: semantic('action-text'), strong: semantic('action-strong'),
          soft: semantic('action-soft'), 'soft-hover': semantic('action-soft-hover'), 'border-soft': semantic('action-border-soft'),
          selected: semantic('action-selected'), 'hover-soft': semantic('action-hover-soft'),
        },
        focus: semantic('focus'),
        success: { DEFAULT: semantic('success'), bg: semantic('success-bg'), border: semantic('success-border'), fg: semantic('success-fg') },
        danger: { DEFAULT: semantic('danger'), bg: semantic('danger-bg'), border: semantic('danger-border'), fg: semantic('danger-fg') },
        warning: { DEFAULT: semantic('warning'), bg: semantic('warning-bg'), border: semantic('warning-border'), fg: semantic('warning-fg') },
        info: { DEFAULT: semantic('info'), bg: semantic('info-bg'), border: semantic('info-border'), fg: semantic('info-fg') },
        nav: { DEFAULT: semantic('nav'), selected: semantic('nav-selected') },
      },
      fontFamily: { sans: ['var(--font-sans)'], doc: ['var(--font-doc)'] },
      // Escala tipográfica del DS (reemplaza a la de Tailwind a propósito: el producto trabaja en 11–24 px).
      fontSize: { '3xs': '10px', '2xs': '11px', xs: '12px', sm: '13px', base: '14px', lg: '16px', xl: '18px', '2xl': '20px', '3xl': '22px', '4xl': '24px' },
      boxShadow: {
        pop: '0 4px 20px rgba(0,0,0,.16), 0 0 0 1px rgba(0,0,0,.07)',
        pill: '0 1px 2px rgba(19,32,69,.12)',
        float: '0 2px 4px rgba(19,32,69,.08)',
      },
    },
  },
};
