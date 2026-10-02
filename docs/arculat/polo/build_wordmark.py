"""ORDO szóvédjegy: az első O arany nyolcszög, a többi betű egységes – nyomdakész SVG-k (görbésítve).

Használat: python3 build_wordmark.py <Cinzel változó betűfájl (.ttf/.woff2)>
Kell hozzá: pip install fonttools brotli
"""
import math
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen

OUT = Path(__file__).parent
HOMOK = "#E4D8BE"
ARANY = "#C9A54C"
TRACK = 0.16  # betűköz em-ben, ugyanannyi, mint a többi feliratnál

font = instantiateVariableFont(TTFont(sys.argv[1]), {"wght": 600})
gs, cmap = font.getGlyphSet(), font.getBestCmap()
UPM = font["head"].unitsPerEm


def bounds(ch):
    bp = BoundsPen(gs)
    gs[cmap[ord(ch)]].draw(bp)
    return bp.bounds  # xMin, yMin, xMax, yMax


O_X0, O_Y0, O_X1, O_Y1 = bounds("O")
_, _, _, CAP = bounds("H")
STEM = CAP * 0.125  # a Cinzel félkövér szárvastagságának közelítése: ehhez igazodik a nyolcszög vonala


def octagon_ring(x, h, stroke):
    """Szabályos nyolcszög-gyűrű, lapjával felfelé, a betűtalpvonalon állva (y lefelé nő)."""
    def pts(size, inset):
        r = size / 2 / math.cos(math.pi / 8)  # a csúcsok sugara, ha a lapok távolsága = size
        cx, cy = x + h / 2, -h / 2
        return [(cx + r * math.cos(math.radians(22.5 + 45 * k)), cy + r * math.sin(math.radians(22.5 + 45 * k))) for k in range(8)]
    outer, inner = pts(h, 0), pts(h - 2 * stroke, stroke)
    d = "M" + " L".join(f"{px:.1f} {py:.1f}" for px, py in outer) + " Z "
    d += "M" + " L".join(f"{px:.1f} {py:.1f}" for px, py in reversed(inner)) + " Z"
    return d


def word(text, oct_color, color, x=0.0, size=1.0):
    """A szöveg útvonalai; minden O helyett nyolcszög. Visszaad (svg-elemek, végső x)."""
    parts = []
    h = (O_Y1 - O_Y0) * size          # az O magassága (a túllógással együtt)
    for i, ch in enumerate(text):
        if ch == "O" and i == 0:
            w = h
            parts.append(f'<path fill="{oct_color}" fill-rule="evenodd" d="{octagon_ring(x, h, STEM * 1.05 * size)}" transform="translate(0 {-O_Y0 * size:.1f})"/>')
            adv = w + (gs[cmap[ord("O")]].width - (O_X1 - O_X0)) * size
        elif ch == " ":
            adv = gs[cmap[32]].width * size
        else:
            pen = SVGPathPen(gs)
            gs[cmap[ord(ch)]].draw(pen)
            parts.append(f'<path fill="{color}" transform="translate({x:.1f} 0) scale({size} {-size})" d="{pen.getCommands()}"/>')
            adv = gs[cmap[ord(ch)]].width * size
        x += adv + (TRACK * UPM * size if i < len(text) - 1 else 0)
    return parts, x


def write(name, text, oct_color, color, width_mm):
    parts, w = word(text, oct_color, color)
    top = -(O_Y1) - 20
    h = O_Y1 - O_Y0 + 40
    out = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 {top:.0f} {w + 40:.0f} {h:.0f}" width="{width_mm}mm" height="{width_mm * h / (w + 40):.1f}mm">
  <title>ORDO szóvédjegy nyolcszögletű O-val ({name})</title>
  {chr(10).join("  " + p for p in parts)}
</svg>
'''
    (OUT / f"ordo-szovedjegy-{name}.svg").write_text(out, encoding="utf-8")


# Csak az első O nyolcszög (arany); a többi betű egységesen nagy (ORDO) vagy kiskapitális (Ordo).
write("2szin", "ORDO", ARANY, HOMOK, 80)
write("2szin-viii", "ORDO VIII", ARANY, HOMOK, 100)
write("1szin", "ORDO", HOMOK, HOMOK, 80)
write("kis-2szin", "Ordo", ARANY, HOMOK, 80)
write("kis-2szin-viii", "Ordo VIII", ARANY, HOMOK, 100)
write("kis-1szin", "Ordo", HOMOK, HOMOK, 80)
print("kész")
