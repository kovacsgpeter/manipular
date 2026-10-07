"""A halas 8-as jel (pólólogó) bíbor jelvényként, a PDF-csomag színeivel: kör és nyolcszög alakban.

Használat: python3 build_jelveny8.py   →   jelveny8-<forma>-<szinezes>.svg
"""
import math
from pathlib import Path

OUT = Path(__file__).parent
BIBOR, ARANY, VILAGOS = "#5E1631", "#C9A54C", "#F3E6C0"


def mark(ring, fish):
    # ugyanaz a geometria, mint a pólón: két gyűrű, a hal (ichthys) a belső ívekből és a farokból
    return f'''<g transform="translate(30 30)">
    <path d="M175.79 152.88 A56 56 0 1 1 69.25 124.33" fill="none" stroke="{ring}" stroke-width="12"/>
    <path d="M69.25 115.67 A56 56 0 1 1 175.79 87.12" fill="none" stroke="{ring}" stroke-width="12"/>
    <path d="M176 92 A56 56 0 0 1 71.5 120 A56 56 0 0 1 176 148" fill="none" stroke="{fish}" stroke-width="12" stroke-linejoin="miter"/>
  </g>'''


def octagon(flat):
    r = flat / 2 / math.cos(math.pi / 8)
    return " ".join(f"{150 + r * math.cos(math.radians(22.5 + 45 * k)):.2f},{150 + r * math.sin(math.radians(22.5 + 45 * k)):.2f}" for k in range(8))


def shape(kind):
    if kind == "kor":
        return (f'<circle cx="150" cy="150" r="146" fill="{BIBOR}" stroke="{ARANY}" stroke-width="5"/>'
                f'<circle cx="150" cy="150" r="134" fill="none" stroke="{ARANY}" stroke-width="1.5"/>')
    return (f'<polygon points="{octagon(286)}" fill="{BIBOR}" stroke="{ARANY}" stroke-width="5" stroke-linejoin="round"/>'
            f'<polygon points="{octagon(262)}" fill="none" stroke="{ARANY}" stroke-width="1.5" stroke-linejoin="round"/>')


for kind in ("kor", "nyolcszog"):
    for name, ring, fish in (("arany-gyuru", ARANY, VILAGOS), ("arany-hal", VILAGOS, ARANY)):
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="80mm" height="80mm">
  <title>Ordo VIII – halas 8-as jelvény ({kind}, {name})</title>
  {shape(kind)}
  {mark(ring, fish)}
</svg>
'''
        (OUT / f"jelveny8-{kind}-{name}.svg").write_text(svg, encoding="utf-8")
print("kész")
