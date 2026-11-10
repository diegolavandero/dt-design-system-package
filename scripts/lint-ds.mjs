#!/usr/bin/env node
// Falla si ds/ o screens/ usan valores fuera de los tokens del Design System.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const ROOTS = ['src/ds', 'src/screens'];
const FAM = 'p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|top|left|right|bottom|inset|inset-x|inset-y|w|h|min-w|min-h|max-w|max-h|size|rounded(?:-[trbl]{1,2})?|leading|z|duration|opacity|tracking|translate-x|translate-y|basis';
const rules = [
  [/(?<![\w-])[a-z0-9:-]*\[[^\]\s]+\]:?/g, 'valor/variante arbitraria [..]', (m, line) => /^\s*(import|\/\/)/.test(line) || /^[A-Z_]+\[|\w\[(?:it|item|tone|i)\b/.test(m) ? false : /-\[|\[&|\[\w+:/.test(m)],
  [/#[0-9a-fA-F]{3,8}\b/g, 'hex hardcodeado'],
  [/(?<![\w-])(?:text|bg|border|from|to|via|ring|fill|stroke)-(?:white|black)\b/g, 'white/black fuera de tokens'],
  [/(?<![\w-])(?:text|bg|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g, 'color de paleta Tailwind por defecto'],
  [new RegExp(`(?<![\\w-])(?:[a-z-]+:)*-?(?:${FAM})-(?!ds-|full\\b|auto\\b|screen\\b|px\\b|0\\b|none\\b|fit\\b|min\\b|max\\b|\\d+/\\d+)\\d+(?:\\.\\d+)?(?![\\w/-])`, 'g'), 'escala numérica de Tailwind (usa ds-*)'],
  [/(?<![\w-])text-(?:3xs|2xs|xs|sm|base|lg|xl|[2-9]xl)\b/g, 'font-size por defecto (usa text-ds-*)'],
  [/(?<![\w-])shadow-(?:sm|md|lg|xl|2xl|inner)\b|(?<![\w-])shadow(?=[\s"'`])/g, 'shadow por defecto (usa shadow-ds-*)'],
  [/(?<![\w-])rounded(?:-[trbl]{1,2})?(?:-(?:none|sm|md|lg|xl|2xl|3xl))?(?=[\s"'`])/g, 'radius por defecto (usa rounded-ds-*)'],
];
let bad = 0;
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.tsx') ? [p] : []; });
for (const f of ROOTS.flatMap(walk)) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(import|\/\/)/.test(line)) return;
    for (const [re, msg, extra] of rules) {
      for (const m of line.matchAll(re)) {
        if (extra && !extra(m[0], line)) continue;
        if (/(?:^|:)opacity-(?:0|100)$/.test(m[0])) continue;
        if (msg.startsWith('radius') && /rounded-(?:t|b|l|r)?-?ds/.test(m[0])) continue;
        console.log(`${f}:${i + 1}  ${msg}  →  ${m[0]}`); bad++;
      }
    }
  });
}
console.log(bad ? `\n✖ ${bad} violaciones del Design System` : '✔ ds/ y screens/ solo usan tokens del Design System');
process.exit(bad ? 1 : 0);
