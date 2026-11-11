/** Preset de Tailwind del DS: expone los tokens como utilidades. Los componentes usan los nombres semánticos. */
const scale = (prefix, steps) => Object.fromEntries(steps.map((n) => [n, `var(--${prefix}${n})`]));
const semantic = (name) => `var(--color-${name})`;

/** Dimensiones nombradas (layout.css) que se suman a la escala `ds-1…ds-10` en width/height/min/max. */
const sizes = () => ({
  ...Object.fromEntries([...Array(10)].map((_, i) => [`ds-${i + 1}`, `var(--space-${i + 1})`])),
  'ds-topbar': 'var(--size-topbar)', 'ds-control': 'var(--size-control)', 'ds-badge': 'var(--size-badge)', 'ds-actions': 'var(--size-actions)', 'ds-col-min': 'var(--size-col-min)', 'ds-cell': 'var(--size-cell)', 'ds-calendar': 'var(--size-calendar)', 'ds-nav-bar': 'var(--size-nav-bar)', 'ds-nav-icon': 'var(--size-nav-icon)', 'ds-logo': 'var(--size-logo)', 'ds-sidebar': 'var(--size-sidebar)', 'ds-sidebar-open': 'var(--size-sidebar-open)', 'ds-slot': 'var(--size-slot)',
  'ds-drawer': 'var(--size-drawer)', 'ds-modal': 'var(--size-modal)', 'ds-modal-wide': 'var(--size-modal-wide)', 'ds-readable': 'var(--size-readable)',
  'ds-menu': 'var(--size-menu)', 'ds-popover': 'var(--size-popover)', 'ds-list': 'var(--size-list)', 'ds-settings-nav': 'var(--size-settings-nav)',
  'ds-main': 'var(--size-main)', 'ds-viewport-inset': 'var(--size-viewport-inset)',
});

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
        nav: { DEFAULT: semantic('nav'), selected: semantic('nav-selected'), hover: semantic('nav-hover'), line: semantic('nav-line') },
        scrim: { dark: semantic('scrim-dark'), soft: semantic('scrim-soft'), strong: semantic('scrim-strong'), opaque: semantic('scrim-opaque') },
      },
      fontFamily: { sans: ['var(--font-sans)'], doc: ['var(--font-doc)'] },
      // Escala tipográfica del DS (reemplaza a la de Tailwind a propósito: el producto trabaja en 11–24 px).
      fontSize: {
        'ds-caption': ['var(--fs-caption)', { lineHeight: 'var(--lh-caption)' }], 'ds-body-s': ['var(--fs-body-s)', { lineHeight: 'var(--lh-body-s)' }],
        'ds-body-l': ['var(--fs-body-l)', { lineHeight: 'var(--lh-body-l)' }], 'ds-subtitle': ['var(--fs-subtitle)', { lineHeight: 'var(--lh-subtitle)' }],
        'ds-section': ['var(--fs-section)', { lineHeight: 'var(--lh-subtitle)' }], 'ds-title': ['var(--fs-title)', { lineHeight: 'var(--lh-title)' }],
        '3xs': '10px', '2xs': '11px', xs: '12px', sm: '13px', base: '14px', lg: '16px', xl: '18px', '2xl': '20px', '3xl': '22px', '4xl': '24px' },
      // ── Escalas estrictas del DS (prefijo `ds-`): las únicas admitidas en ds/ y screens/ (ver scripts/lint-ds.mjs) ──
      spacing: Object.fromEntries([...Array(10)].map((_, i) => [`ds-${i + 1}`, `var(--space-${i + 1})`])),
      borderRadius: {
        'ds-sm': 'var(--radius-sm)', 'ds-md': 'var(--radius-md)', 'ds-lg': 'var(--radius-lg)', 'ds-xl': 'var(--radius-xl)',
        'ds-chip': 'var(--radius-chip)', 'ds-sidebar': 'var(--radius-sidebar)', 'ds-pill': 'var(--radius-pill)', 'ds-slot': 'var(--radius-topbar-slot)', 'ds-nav': 'var(--radius-nav)',
      },
      borderWidth: { 'ds-accent': 'var(--stroke-accent)' },
      lineHeight: { 'ds-caption': 'var(--lh-caption)', 'ds-body': 'var(--lh-body-s)', 'ds-subtitle': 'var(--lh-subtitle)', 'ds-title': 'var(--lh-title)' },
      letterSpacing: { 'ds-label': '.07em', 'ds-title': '-.01em' },
      zIndex: {
        'ds-base': 'var(--z-base)', 'ds-raised': 'var(--z-raised)', 'ds-float': 'var(--z-float)', 'ds-sticky': 'var(--z-sticky)', 'ds-nav': 'var(--z-nav)',
        'ds-dropdown': 'var(--z-dropdown)', 'ds-overlay': 'var(--z-overlay)', 'ds-fab': 'var(--z-fab)', 'ds-drawer': 'var(--z-drawer)', 'ds-toast': 'var(--z-toast)', 'ds-menu': 'var(--z-menu)',
      },
      transitionDuration: { 'ds-chart': 'var(--motion-chart)', 'ds-fast': 'var(--motion-fast)', 'ds-base': 'var(--motion-base)' },
      opacity: { 'ds-disabled': 'var(--opacity-disabled)', 'ds-muted': 'var(--opacity-muted)' },
      screens: { 'ds-wide': '901px' },
      width: sizes(), minWidth: sizes(), maxWidth: sizes(), height: sizes(), minHeight: sizes(), maxHeight: sizes(),
      boxShadow: {
        'ds-xs': 'var(--shadow-xs)', 'ds-sm': 'var(--shadow-sm)', 'ds-md': 'var(--shadow-md)', 'ds-lg': 'var(--shadow-lg)', 'ds-focus': 'var(--shadow-focus)',
        'ds-inset-success': 'inset var(--stroke-accent) 0 0 0 var(--color-success)',
        pop: '0 4px 20px rgba(0,0,0,.16), 0 0 0 1px rgba(0,0,0,.07)',
        pill: '0 1px 2px rgba(19,32,69,.12)',
        float: '0 2px 4px rgba(19,32,69,.08)',
      },
      animation: {
        'ds-toast': 'toast-in var(--motion-fast) ease forwards',
        'ds-rise': 'ds-rise var(--motion-base) ease-out both',
        'ds-bulk': 'bulk-in var(--motion-fast) ease',
        'ds-progress': 'vfprog var(--motion-video) linear forwards',
      },
      backgroundImage: {},
    },
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('ds-strong', '& b');
      addVariant('ds-lead', '& > :first-child');
    },
  ],
};
