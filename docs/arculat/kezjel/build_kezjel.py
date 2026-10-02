"""Ordo VIII kézjel: két tenyér tető alakban, a 8 nyitott ujj egymásba fűzve, a hüvelykujjak a tenyérbe hajtva.

Stilizált piktogram, elölnézetben. Az ujjak felváltva kerülnek egymás fölé, mint egy szövés.
Használat: python3 build_kezjel.py   →   kezjel-vilagos.svg, kezjel-barna.svg
"""
import math
from pathlib import Path

OUT = Path(__file__).parent
W = 400


def hand(side, ang=44, knuckle=(178, 236), palm_len=200, lanes=(-45, -15, 15, 45), lengths=(118, 132, 124, 98)):
    """Egy kéz geometriája. side = -1 bal (felfelé-jobbra mutat), +1 jobb (tükörkép)."""
    a = math.radians(ang)
    u = (math.cos(a), -math.sin(a))      # az ujjak iránya
    v = (math.sin(a), math.cos(a))       # merőleges: a kéz szélessége
    kx, ky = knuckle
    def m(p):  # tükrözés a jobb kézhez
        return (W - p[0], p[1]) if side > 0 else p
    fingers = []
    for o, L in zip(lanes, lengths):
        s = (kx + o * v[0], ky + o * v[1])
        e = (s[0] + L * u[0], s[1] + L * u[1])
        fingers.append((m(s), m(e)))
    hw, ww = 60, 40   # fél szélesség a bütyköknél és a csuklónál
    def at(dist, off):
        return (kx - dist * u[0] + off * v[0], ky - dist * u[1] + off * v[1])
    # kézhát: a bütyköktől a csuklóig keskenyedik, onnan az alkar a kép széléig fut
    palm = [m(at(0, -hw)), m(at(0, hw)), m(at(105, ww)), m(at(320, ww + 6)), m(at(320, -ww - 6)), m(at(105, -ww))]
    sleeve = [m(at(140, ww + 1)), m(at(320, ww + 8)), m(at(320, -ww - 8)), m(at(140, -ww - 1))]
    return palm, fingers, sleeve


def seg_x(p, q, r, s):
    d = (q[0] - p[0]) * (s[1] - r[1]) - (q[1] - p[1]) * (s[0] - r[0])
    if abs(d) < 1e-9:
        return None
    t = ((r[0] - p[0]) * (s[1] - r[1]) - (r[1] - p[1]) * (s[0] - r[0])) / d
    w = ((r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0])) / d
    return (p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])) if 0 < t < 1 and 0 < w < 1 else None


def build(skin, line, bg, name, cuff):
    L = hand(-1)
    R = hand(+1)
    def finger(f, extra="", cap="round"):
        (x1, y1), (x2, y2) = f
        return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{line}" stroke-width="24" stroke-linecap="{cap}"{extra}/>'
                f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{skin}" stroke-width="17" stroke-linecap="{cap}"{extra}/>')
    def poly(pts):
        return " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    parts, clips = [], []
    # tenyerek (kézhátak) és a behajtott hüvelykujjak körvonala
    for palm, _, sleeve in (L, R):
        parts.append(f'<polygon points="{poly(palm)}" fill="{skin}" stroke="{line}" stroke-width="3.5" stroke-linejoin="round"/>')
        parts.append(f'<polygon points="{poly(sleeve)}" fill="{cuff}" stroke="{line}" stroke-width="3.5" stroke-linejoin="round"/>')
    # ujjak: előbb a jobb kéz, aztán a bal, végül a jobb kéz ujjai ott, ahol szövésben ők vannak felül
    for f in R[1]:
        parts.append(finger(f))
    for f in L[1]:
        parts.append(finger(f))
    n = 0
    for i, lf in enumerate(L[1]):
        for j, rf in enumerate(R[1]):
            x = seg_x(lf[0], lf[1], rf[0], rf[1])
            if x and (i + j) % 2 == 1:
                n += 1
                # a jobb kéz ujjának rövid, egyenes végű darabja a kereszteződés fölött: ott ő van felül
                (ax, ay), (bx, by) = rf
                ln = math.hypot(bx - ax, by - ay)
                ux, uy = (bx - ax) / ln, (by - ay) / ln
                h = 17
                parts.append(finger(((x[0] - h * ux, x[1] - h * uy), (x[0] + h * ux, x[1] + h * uy)), cap="butt"))
    # körömvonalak a hegyeken: apró ívek jelzik, hogy az ujjak nyitottak, kinyújtottak
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 400" width="{W}" height="400">
  <title>Ordo VIII kézjel – tető alakú, egymásba fűzött nyolc ujj</title>
  <rect width="{W}" height="400" fill="{bg}"/>
  <!-- a hüvelykujjak a tenyérbe hajtva, ezért kívülről nem látszanak -->
  {chr(10).join("  " + p for p in parts)}
</svg>
'''
    (OUT / f"kezjel-{name}.svg").write_text(svg, encoding="utf-8")


build("#E4D8BE", "#4E4031", "#F4F2EE", "vilagos", "#6B5843")
build("#E4D8BE", "#3E3226", "#6B5843", "barna", "#4E4031")
print("kész")
