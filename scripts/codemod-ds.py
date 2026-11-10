#!/usr/bin/env python3
"""Migra las clases Tailwind de ds/ y screens/ a los tokens estrictos `ds-*` (ver tailwind-preset.cjs)."""
import re, sys, glob, collections

SCALE = [4, 8, 12, 16, 20, 24, 32, 48, 56, 64]
KEY = {px: f'ds-{i+1}' for i, px in enumerate(SCALE)}
RADII = {4: 'ds-sm', 6: 'ds-md', 8: 'ds-lg', 12: 'ds-xl', 16: 'ds-chip', 30: 'ds-sidebar'}
LH = {16: 'ds-caption', 20: 'ds-body', 28: 'ds-subtitle', 32: 'ds-title'}
NAMED = {248: 'ds-sidebar-open', 360: 'ds-drawer', 520: 'ds-modal', 600: 'ds-modal-wide', 448: 'ds-readable', 168: 'ds-menu',
         210: 'ds-popover', 240: 'ds-list', 224: 'ds-settings-nav', 98: 'ds-slot', 100: 'ds-slot'}
Z = {1: 'ds-base', 2: 'ds-raised', 5: 'ds-float', 10: 'ds-sticky', 20: 'ds-nav', 30: 'ds-dropdown', 50: 'ds-overlay', 160: 'ds-fab', 299: 'ds-drawer', 400: 'ds-toast', 9999: 'ds-menu'}
FS = {'3xs': 'ds-caption', '2xs': 'ds-caption', 'xs': 'ds-caption', 'sm': 'ds-body-s', 'base': 'ds-body-s', 'lg': 'ds-body-l', 'xl': 'ds-body-l', '2xl': 'ds-subtitle', '3xl': 'ds-subtitle', '4xl': 'ds-section'}
FS_PX = [(12, 'ds-caption'), (14, 'ds-body-s'), (16, 'ds-body-l'), (22, 'ds-subtitle'), (24, 'ds-section'), (26, 'ds-title')]
SIZE_U = {'w', 'h', 'min-w', 'min-h', 'max-w', 'max-h', 'size'}
SP_U = {'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'gap', 'gap-x', 'gap-y', 'space-x', 'space-y',
        'top', 'left', 'right', 'bottom', 'inset', 'inset-x', 'inset-y', 'translate-x', 'translate-y', 'basis'} | SIZE_U
RAD_U = ['rounded-tl', 'rounded-tr', 'rounded-bl', 'rounded-br', 'rounded-t', 'rounded-b', 'rounded-l', 'rounded-r', 'rounded']
KEEP = {'full', 'auto', 'screen', 'fit', 'min', 'max', 'px', '0', 'none', 'prose'}
leftovers = collections.Counter()

def snap(px, table):
    return min(table, key=lambda k: (abs(k - px), -k))

def px_of(v):
    m = re.fullmatch(r'\[(\d+(?:\.\d+)?)px\]', v)
    if m: return float(m.group(1))
    if re.fullmatch(r'\d+(?:\.\d+)?', v): return float(v) * 4
    return None

def conv_space(util, v):
    if v in KEEP or re.fullmatch(r'\d+/\d+', v): return v
    if v == '[90%]': return 'full'
    if util == 'max-w' and v == 'md': return 'ds-readable'
    px = px_of(v)
    if px is None:
        if v == '[calc(100vh-52px)]' and util in ('h', 'min-h', 'max-h'): return 'ds-main'
        if v == '[calc(100vw-32px)]': return 'ds-viewport-inset'
        return None
    if px == 0: return '0'
    if px == 1: return 'px'
    px = int(px)
    if util in SIZE_U:
        if px in NAMED: return NAMED[px]
        if px == 52: return 'ds-topbar' if util.startswith(('h', 'min-h', 'max-h')) else 'ds-sidebar'
        if px > 64 and px not in NAMED: return KEY[64]
    if px > 64: return KEY[64]
    return KEY[snap(px, SCALE)] if px not in KEY else KEY[px]

def conv(variants, neg, util, v, ctx):
    pre = variants + neg
    if util in SP_U:
        r = conv_space(util, v)
        if r is None: leftovers[f'{util}-{v}'] += 1; return None
        return f'{pre}{util}-{r}'
    if util in RAD_U:
        if v == '': px = 4
        elif v == 'none': return None
        elif v == 'full': return f'{pre}{util}-ds-pill'
        else:
            named = {'sm': 4, 'md': 6, 'lg': 8, 'xl': 12, '2xl': 16}
            if v in named: px = named[v]
            else:
                m = re.fullmatch(r'\[(\d+)px\]', v)
                if not m: leftovers[f'{util}-{v}'] += 1; return None
                px = int(m.group(1))
                if util == 'rounded-tl' and px == 20: return f'{pre}rounded-ds-slot'
        return f'{pre}{util}-{RADII[snap(px, list(RADII))]}'
    if util == 'leading':
        if v == 'none': return f'{pre}leading-none'
        px = None
        if re.fullmatch(r'\d+', v): px = int(v) * 4
        elif (m := re.fullmatch(r'\[(\d+)px\]', v)): px = int(m.group(1))
        elif v in ('snug', 'tight', 'normal', 'relaxed') or v == '[1.45]': px = 16 if re.search(r'text-(?:3xs|2xs|xs)\b', ctx) else 20
        if px is None: leftovers[f'leading-{v}'] += 1; return None
        return f'{pre}leading-{LH[snap(px, list(LH))]}'
    if util == 'text':
        if v in FS: return f'{pre}text-{FS[v]}'
        m = re.fullmatch(r'\[(\d+)px\]', v)
        if m: return f'{pre}text-{FS_PX[min(range(len(FS_PX)), key=lambda i: (abs(FS_PX[i][0]-int(m.group(1))), -FS_PX[i][0]))][1]}'
        if v == 'white': return f'{pre}text-fg-inverse'
        return None
    if util == 'tracking':
        if v == 'tight': return f'{pre}tracking-ds-title'
        if v in ('wide', 'wider', 'widest'): return f'{pre}tracking-ds-label'
        return None
    if util == 'z':
        n = int(re.sub(r'[\[\]]', '', v)) if re.fullmatch(r'\[?\d+\]?', v) else None
        if n is None: return None
        if n == 0: return f'{pre}z-0'
        if n in Z: return f'{pre}z-{Z[n]}'
        leftovers[f'z-{v}'] += 1; return None
    if util == 'duration':
        n = re.sub(r'\D', '', v)
        return f'{pre}duration-{"ds-fast" if int(n) <= 200 else "ds-base"}' if n else None
    if util == 'opacity':
        if v in ('0', '100'): return None
        return f'{pre}opacity-{"ds-muted" if int(v) >= 70 else "ds-disabled"}' if v.isdigit() else None
    if util == 'ease' and v.startswith('[cubic'): return f'{pre}ease-in-out'
    if util == 'transition' and v.startswith('['): return f'{pre}transition-all'
    if util in ('border-l', 'border-r', 'border-t', 'border-b', 'border') and re.fullmatch(r'\[\d+px\]', v): return f'{pre}{util}-ds-accent'
    if util == 'bg' and v == 'white': return f'{pre}bg-surface'
    return None

UTILS = sorted(set(SP_U) | set(RAD_U) | {'leading', 'text', 'tracking', 'z', 'duration', 'opacity', 'ease', 'transition', 'border-l', 'border-r', 'border-t', 'border-b', 'border', 'bg'}, key=len, reverse=True)
VAL = r'(?:\[[^\]\s]*\]|[A-Za-z0-9./%]+)'
TOKEN = re.compile(r'(?<![\w\[:/.-])((?:[a-z0-9-]+(?:\[[^\]\s]*\])?:)*)(-?)(' + '|'.join(re.escape(u) for u in UTILS) + r')(?:-(' + VAL + r'))?(?![\w\[-])')

def run(path, write):
    s = open(path).read()
    def line_ctx(m):
        a = s.rfind('"', 0, m.start()); b = s.find('"', m.end())
        return s[max(a, 0): b if b > 0 else m.end()]
    def rep(m):
        variants, neg, util, v = m.group(1), m.group(2), m.group(3), m.group(4) or ''
        variants = variants.replace('min-[901px]:', 'ds-wide:')
        if util in ('rounded', 'rounded-t', 'rounded-b', 'rounded-l', 'rounded-r', 'rounded-tl', 'rounded-tr', 'rounded-bl', 'rounded-br') or v:
            out = conv(variants, neg, util, v, line_ctx(m))
            return out if out else m.group(0).replace('min-[901px]:', 'ds-wide:')
        return m.group(0).replace('min-[901px]:', 'ds-wide:')
    n = TOKEN.sub(rep, s)
    n = n.replace('min-[901px]:', 'ds-wide:')
    # blancos translúcidos y transiciones/animaciones arbitrarias
    for a, b in [('bg-white/95', 'bg-scrim-opaque'), ('bg-white/90', 'bg-scrim-strong'), ('bg-white/30', 'bg-scrim-soft'), ('bg-white/10', 'bg-nav-hover'), ('border-white/20', 'border-nav-line'), ('bg-white', 'bg-surface')]:
        n = n.replace(a, b)
    if write and n != s: open(path, 'w').write(n)
    return n != s

if __name__ == '__main__':
    write = '--write' in sys.argv
    files = [f for g in ('ds/**/*.tsx', 'screens/**/*.tsx') for f in glob.glob(f'src/{g}', recursive=True)]
    ch = [f for f in files if run(f, write)]
    print('changed:', len(ch), '/', len(files)); print('leftovers:', dict(leftovers))
