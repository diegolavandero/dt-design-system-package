/** Paleta de visualización de datos. Fuente: DS_VIZ_PALETTE en renderers.js del design system. */
export const VIZ_PALETTE = [
  '#6E8DDE', '#FFCC65', '#57C2D6', '#7EEABC', '#FF8F76', '#A59ADD',
  '#5EBE95', '#DED95D', '#8DBCE7', '#BF7B83', '#DFA2F4',
] as const;

/** Colores semánticos de estado usados en los gráficos de dona. */
export const VIZ_STATE = {
  positive: '#5EBE95',
  negative: '#FF8F76',
  progress: '#6E8DDE',
  idle: '#C5D2E7',
} as const;

export const vizColor = (index: number): string => VIZ_PALETTE[index % VIZ_PALETTE.length];
