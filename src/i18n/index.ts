import { EN, translateString } from './en';

/**
 * Capa de idioma de los prototipos de pantalla.
 * `index.html?lang=en` traduce el texto visible (nodos de texto y atributos accesibles) con el
 * diccionario de `en.ts`. El código fuente de las pantallas se mantiene en español; la lógica
 * (filtros, orden, estados) usa siempre el valor fuente, así que el idioma no altera el comportamiento.
 */
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'] as const;

const fixText = (n: Node) => {
  const v = n.nodeValue;
  if (!v || !v.trim()) return;
  const m = v.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!m) return;
  const t = translateString(m[2]);
  if (t !== null && t !== m[2]) n.nodeValue = m[1] + t + m[3];
};

const fixAttrs = (el: Element) => {
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (!v) continue;
    const t = translateString(v);
    if (t !== null && t !== v) el.setAttribute(a, t);
  }
};

/** Elementos con texto + <b>: se traducen completos para no partir la oración. */
const fixRich = (el: Element) => {
  if (!el.children.length) return;
  const html = el.innerHTML.trim();
  if (!html.includes('<b>')) return;
  const t = translateString(html);
  if (t !== null && t !== html) el.innerHTML = t;
};

function process(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return fixText(root);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  const all = [el, ...Array.from(el.querySelectorAll('*'))];
  all.forEach(fixRich);
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) fixText(walker.currentNode);
  all.forEach((e) => {
    fixAttrs(e);
    const key = e.getAttribute('data-i18n');
    if (key && EN[key] !== undefined && e.textContent !== EN[key]) e.textContent = EN[key];
  });
}

export function installLocale() {
  if (new URLSearchParams(location.search).get('lang') !== 'en') return;
  document.documentElement.lang = 'en';
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'childList') r.addedNodes.forEach(process);
      else if (r.type === 'characterData') fixText(r.target);
      else if (r.type === 'attributes' && r.target.nodeType === Node.ELEMENT_NODE) fixAttrs(r.target as Element);
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...ATTRS] });
  process(document.body);
}
