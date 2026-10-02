"""Ordo VIII póló- és pulóverkollekció – nyomdakész SVG-k (görbésített betűkkel).

Kimenet (a kollekcio/ könyvtárba):
  - hat-viii-<fokozat>.svg        hátminta: főtiszti feliratos VIII + PARATE VIAM DOMINI
  - felvarro-<rendfokozat>.svg    ék alakú ujjfelvarró a 16 rendfokozat bármelyikével

Használat: python3 build_kollekcio.py <Cinzel változó betűfájl (.ttf/.woff2)>
Kell hozzá: pip install fonttools brotli
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

OUT = Path(__file__).parent / "kollekcio"
OUT.mkdir(exist_ok=True)
EZUST = "#ECEBE6"   # ezüst (fehér)
ARANY = "#C9A54C"
HOMOK = "#E4D8BE"
FOLT = "#5A4A37"    # a felvarró alapja: a 15M barnánál egy árnyalattal sötétebb

font = instantiateVariableFont(TTFont(sys.argv[1]), {"wght": 700})
gs, cmap = font.getGlyphSet(), font.getBestCmap()
UPM = font["head"].unitsPerEm


def glyph(ch):
    pen = SVGPathPen(gs)
    gs[cmap[ord(ch)]].draw(pen)
    bp = BoundsPen(gs)
    gs[cmap[ord(ch)]].draw(bp)
    return pen.getCommands(), gs[cmap[ord(ch)]].width, bp.bounds


def text_paths(text, colors, size, x, baseline, tracking=0.12):
    """Görbésített szöveg; colors betűnként (vagy egy szín). Visszaad (elemek, szélesség)."""
    parts, cx = [], x
    for i, ch in enumerate(text):
        col = colors[i] if isinstance(colors, list) else colors
        d, adv, _ = glyph(ch) if ch != " " else ("", gs[cmap[32]].width, None)
        if d:
            parts.append(f'<path fill="{col}" transform="translate({cx:.1f} {baseline:.1f}) scale({size / UPM:.5f} {-size / UPM:.5f})" d="{d}"/>')
        cx += (adv + (tracking * UPM if i < len(text) - 1 else 0)) * size / UPM
    return parts, cx - x


def width_of(text, size, tracking=0.12):
    return text_paths(text, "#000", size, 0, 0, tracking)[1]


# ---------------------------------------------------------------- rendfokozatok (240×240-es rács)

def bars(n_fill, xs=(74, 110, 146), tall_middle=False):
    out = ""
    for i, x in enumerate(xs):
        y, h = (118, 88) if (tall_middle and i == 1) else (128, 78)
        if i < n_fill:
            out += f'<rect x="{x}" y="{y}" width="20" height="{h}" fill="{EZUST}"/>'
        else:
            out += f'<rect x="{x + 2.5}" y="{y + 2.5}" width="15" height="{h - 5}" fill="none" stroke="{EZUST}" stroke-width="5"/>'
    return out


def vee(color):
    return f'<path d="M56 52 L120 104 L184 52" fill="none" stroke="{color}" stroke-width="20"/>'


def roman_viii(n_gold, size=104, x_center=120, baseline=164, line_y=(70, 182), span=(22, 218), line_h=7):
    cols = [ARANY] + [ARANY if i < n_gold else EZUST for i in range(3)]
    line = ARANY if n_gold == 3 else EZUST
    w = width_of("VIII", size, 0.02)
    parts, _ = text_paths("VIII", cols, size, x_center - w / 2, baseline, 0.02)
    return (f'<rect x="{span[0]}" y="{line_y[0]}" width="{span[1] - span[0]}" height="{line_h}" fill="{line}"/>'
            + "".join(parts)
            + f'<rect x="{span[0]}" y="{line_y[1]}" width="{span[1] - span[0]}" height="{line_h}" fill="{line}"/>')


RANKS = {
    # legénység: ezüst V
    "kozlegeny": vee(EZUST) + bars(0), "orvezeto": vee(EZUST) + bars(1),
    "tizedes": vee(EZUST) + bars(2), "szakaszvezeto": vee(EZUST) + bars(3),
    # altisztek: arany V
    "ormester": vee(ARANY) + bars(0), "torzsormester": vee(ARANY) + bars(1),
    "fotorzsormester": vee(ARANY) + bars(2), "zaszlos": vee(ARANY) + bars(3),
}
for k in range(4):
    # tisztek: arany V, a középső oszlop kereszt
    RANKS[f"tiszt-{k + 1}"] = (vee(ARANY) + bars(k, xs=(62, 110, 158), tall_middle=True)
                               + f'<rect x="92" y="138" width="56" height="12" fill="{ARANY}"/>')
    # főtisztek: feliratos VIII, az oszlopok fokozatosan aranyak
    RANKS[f"fotiszt-{k + 1}"] = roman_viii(k)


def patch(rank):
    """Ék alakú ujjfelvarró (kb. 55 × 75 mm): sötétebb barna alap, homok szegély, felül a jelzés."""
    shape = "M6 6 H174 V176 L90 234 L6 176 Z"
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 240" width="55mm" height="73.3mm">
  <title>Ordo VIII ujjfelvarró – {rank}</title>
  <path d="{shape}" fill="{FOLT}" stroke="{HOMOK}" stroke-width="8" stroke-linejoin="round"/>
  <path d="M18 18 H162 V170 L90 220 L18 170 Z" fill="none" stroke="{HOMOK}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
  <g transform="translate(22 30) scale(0.567)">{RANKS[rank]}</g>
</svg>
'''


for name in RANKS:
    (OUT / f"felvarro-{name}.svg").write_text(patch(name), encoding="utf-8")

# ---------------------------------------------------------------- hátminta: VIII + mottó

MOTTO = "PARATE VIAM DOMINI"   # „Készítsétek az Úr útját” (Iz 40,3, Vulgata)
for k in range(4):
    mw = width_of(MOTTO, 26, 0.22)
    motto, _ = text_paths(MOTTO, HOMOK, 26, 120 - mw / 2, 236, 0.22)
    w = max(240, mw + 8)
    x0 = 120 - w / 2
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} 50 {w:.1f} 200" width="280mm" height="{280 * 200 / w:.0f}mm">
  <title>Ordo VIII hátminta – főtiszt {k + 1}. fokozat, PARATE VIAM DOMINI</title>
  {roman_viii(k)}
  {"".join(motto)}
</svg>
'''
    (OUT / f"hat-viii-{k + 1}.svg").write_text(svg, encoding="utf-8")
print("kész")
