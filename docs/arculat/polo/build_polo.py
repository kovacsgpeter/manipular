"""Ordo VIII mellkasi pólólogó – nyomdakész SVG-k (görbésített felirattal).

Használat: python3 build_polo.py <Cinzel változó betűfájl (.ttf/.woff2)>
Kell hozzá: pip install fonttools brotli
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

OUT = Path(__file__).parent
BARNA = "#6B5843"   # a 15M póló barnájának közelítése (csak a próbanézethez) – minta alapján pontosítandó
HOMOK = "#E4D8BE"   # világos homok: a gyűrűk és a felirat
ARANY = "#C9A54C"   # kiemelő szín: a hal-metszet

font = instantiateVariableFont(TTFont(sys.argv[1]), {"wght": 600})
glyphs, cmap = font.getGlyphSet(), font.getBestCmap()


def text_path(text, tracking=0.16):
    """A felirat körvonalai egy sorban, em = 1000 egységben; visszaad (d, szélesség, magasság)."""
    parts, x, upm = [], 0.0, font["head"].unitsPerEm
    for i, ch in enumerate(text):
        g = glyphs[cmap[ord(ch)]]
        if ch != " ":
            pen = SVGPathPen(glyphs)
            g.draw(pen)
            parts.append(f'<path transform="translate({x:.1f} 0) scale(1 -1)" d="{pen.getCommands()}"/>')
        x += g.width + (tracking * upm if i < len(text) - 1 else 0)
    bp = BoundsPen(glyphs)
    glyphs[cmap[ord("O")]].draw(bp)
    return "".join(parts), x, bp.bounds[3]


def mark(ring, fish):
    """Két összefonódó gyűrű (a 8-as). A belső ívek és a jobb oldali kereszteződésen túli
    folytatásuk kiadják a halat (ichthys), ahogy az autók hátulján: ez kapja a kiemelő színt.
    A színváltásoknál 5°-os rés fut, így a két szín nem ér össze (szitán, hímzésen is tiszta)."""
    return f'''
  <path d="M175.79 152.88 A56 56 0 1 1 69.25 124.33" fill="none" stroke="{ring}" stroke-width="12"/>
  <path d="M69.25 115.67 A56 56 0 1 1 175.79 87.12" fill="none" stroke="{ring}" stroke-width="12"/>
  <path d="M176 92 A56 56 0 0 1 71.5 120 A56 56 0 0 1 176 148" fill="none" stroke="{fish}" stroke-width="12" stroke-linejoin="miter"/>'''


def mark_v3(main, accent):
    """V + III: a római nyolcas rendfokozat-jelzésként. Fent az arany V (csúcsával lefelé,
    mint a vállapi csillagsáv), alatta három szár: a Triplex, a három társ."""
    return f'''
  <path d="M56 52 L120 104 L184 52" fill="none" stroke="{accent}" stroke-width="20" stroke-linejoin="miter"/>
  <rect x="74" y="128" width="20" height="78" fill="{main}"/>
  <rect x="110" y="128" width="20" height="78" fill="{main}"/>
  <rect x="146" y="128" width="20" height="78" fill="{main}"/>'''


def svg(name, ring, lens, with_text, width_mm=80, kind="lanc"):
    if kind == "v3":
        # A jel befoglalója: x 49,7–190,3, y 44,2–206 (a V hegyes illesztésével együtt).
        body, w, top, h, bottom, tscale = mark_v3(ring, lens), 141, 44, 162, 206, 1.0
    else:
        # A jel befoglalója: x 58–182, y 30–210 (gyűrűk a vonalvastagsággal együtt).
        body, w, top, h, bottom, tscale = mark(ring, lens), 124, 30, 180, 210, 1.25
    if with_text:
        d, tw, cap = text_path("ORDO VIII")
        scale = w * tscale / tw
        ty = bottom + 22 + cap * scale    # 22 egység térköz a jel alatt
        tx = 120 - tw * scale / 2
        body += f'\n  <g fill="{ring}" transform="translate({tx:.2f} {ty:.2f}) scale({scale:.5f})">{d}</g>'
        w, h = max(w, w * tscale), ty - top
    x0 = 120 - w / 2
    pad = 6
    vb = f"{x0 - pad:.2f} {top - pad:.2f} {w + 2 * pad:.2f} {h + 2 * pad:.2f}"
    height_mm = width_mm * (h + 2 * pad) / (w + 2 * pad)
    out = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{width_mm}mm" height="{height_mm:.1f}mm">
  <title>Ordo VIII – mellkasi pólólogó ({name})</title>
{body}
</svg>
'''
    (OUT / f"ordo-viii-polo-{name}.svg").write_text(out, encoding="utf-8")


# 2 szín: homok gyűrűk és felirat, arany hal (ichthys)
svg("2szin-felirattal", HOMOK, ARANY, True)
svg("2szin-jel", HOMOK, ARANY, False, width_mm=60)
# 1 szín: minden homok, a halat a színváltások helyén futó rések rajzolják ki
svg("1szin-felirattal", HOMOK, HOMOK, True)
svg("1szin-jel", HOMOK, HOMOK, False, width_mm=60)
print("kész")

# V + III változat (pólóra javasolt): arany V, homok szárak és felirat; 1 színben minden homok
svg("v3-2szin-felirattal", HOMOK, ARANY, True, kind="v3")
svg("v3-2szin-jel", HOMOK, ARANY, False, width_mm=60, kind="v3")
svg("v3-1szin-felirattal", HOMOK, HOMOK, True, kind="v3")
svg("v3-1szin-jel", HOMOK, HOMOK, False, width_mm=60, kind="v3")
