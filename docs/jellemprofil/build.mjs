// Kérdésbank → dokumentáció és kitöltő HTML. Futtatás: node docs/jellemprofil/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const bank = JSON.parse(readFileSync(join(dir, 'kerdesbank.json'), 'utf8'));

function fail(msg) {
  console.error(`Hibás kérdésbank: ${msg}`);
  process.exit(1);
}

function validate() {
  const axisIds = bank.axes.map((a) => a.id);
  if (axisIds.length !== 6) fail('6 tengely kell');
  if ([...bank.radarOrder].sort().join() !== [...axisIds].sort().join()) fail('radarOrder ≠ axes');
  if (bank.pairs.length !== 30) fail('30 pár kell');
  const ids = new Set();
  for (const p of bank.pairs) {
    if (ids.has(p.id)) fail(`ismétlődő pár: ${p.id}`);
    ids.add(p.id);
    if (!axisIds.includes(p.axis) || !p.id.startsWith(`${p.axis}-`)) fail(`rossz tengely: ${p.id}`);
    if (!p.r1?.E || !p.r1?.T) fail(`hiányzó 1. köri állítás: ${p.id}`);
    const iv = p.interview;
    if (!iv?.main || !iv.stress || !iv.others || !iv.signsE?.length || !iv.signsT?.length) fail(`hiányos interjú: ${p.id}`);
    if (p.sjt?.length !== 3) fail(`3 szituáció kell: ${p.id}`);
    for (const s of p.sjt) if (!s.stem || !s.E || !s.T || !s.H) fail(`hiányos szituáció: ${p.id}`);
  }
  for (const a of axisIds) {
    if (bank.pairs.filter((p) => p.axis === a).length !== 5) fail(`5 pár kell a(z) ${a} tengelyen`);
  }
  const itemCodes = bank.pairs.flatMap((p) => [`${p.id}É`, `${p.id}T`]);
  const controlIds = bank.round1.controls.map((c) => c.id);
  const expected = [...itemCodes, ...controlIds].sort();
  if ([...bank.round1.order].sort().join() !== expected.join()) fail('round1.order nem pontosan a 60 itemet és a kontrollokat tartalmazza');
  for (const c of bank.round1.controls) {
    if (c.type === 'consistency' && !itemCodes.includes(c.reverseOf)) fail(`ismeretlen reverseOf: ${c.id}`);
  }
}

const pairById = Object.fromEntries(bank.pairs.map((p) => [p.id, p]));
const axisById = Object.fromEntries(bank.axes.map((a) => [a.id, a]));
const controlById = Object.fromEntries(bank.round1.controls.map((c) => [c.id, c]));

function itemText(code) {
  if (controlById[code]) return controlById[code].text;
  return pairById[code.slice(0, -1)].r1[code.endsWith('É') ? 'E' : 'T'];
}

const cell = (s) => String(s).replace(/\|/g, '\\|');
const GENERATED = '<!-- A fájl generált: a kerdesbank.json szerkesztése után futtasd: node docs/jellemprofil/build.mjs -->';

function round1Table() {
  const rows = bank.round1.order.map((code, i) => `| ${i + 1} | ${code} | ${cell(itemText(code))} |`);
  return ['| # | Kód | Állítás |', '|---|---|---|', ...rows].join('\n');
}

function replaceBetween(text, begin, end, content, file) {
  const a = text.indexOf(begin);
  const b = text.indexOf(end);
  if (a < 0 || b < a) fail(`hiányzó jelölő: ${file}`);
  return text.slice(0, a + begin.length) + '\n' + content + '\n' + text.slice(b);
}

function pairsByAxis() {
  return bank.axes.map((a) => ({ axis: a, pairs: bank.pairs.filter((p) => p.axis === a.id) }));
}

function interviewDoc() {
  const iv = bank.interview;
  const out = [
    '# Jellemprofil – 2. kör: élő mélyfúró interjú',
    '',
    GENERATED,
    '',
    `> Célcsoport: ${bank.audience}. Időigény: ${iv.duration}. Az interjú a szűrő kérdőív alapján kiválasztott 6–8 párra megy rá (lásd [1. kör, 5. fejezet](01-szuro-kerdoiv.md#5-a-2-körbe-kerülő-párok-kiválasztása)).`,
    '> A kérdező a [kitöltő HTML](kitolto.html) „Élő interjú” módjában látja a kiválasztott párok kérdéseit, és ott rögzíti a pontszámokat.',
    '',
    '## 1. Felépítés',
    '',
    '1. **Nyitás** (3–5 perc)',
    '2. **Páronként** (4–5 perc): nyitó történet → rákérdezések → stresszhelyzetes kérdés → „mások szemével” kérdés → pontozás',
    '3. **Zárás** (5 perc)',
    '',
    '### Nyitás',
    '',
    ...iv.intro.map((s) => `- ${s}`),
    '',
    '### Általános rákérdezések',
    '',
    'Minden történetnél használhatók, amíg a válasz konkrét viselkedést nem ír le:',
    '',
    ...iv.probes.map((s) => `- „${s}”`),
    '',
    '### Zárás',
    '',
    ...iv.closing.map((s) => `- ${s}`),
    '',
    '## 2. Pontozás',
    '',
    'Minden kiválasztott párnál két pontszám születik, 1–5 skálán: egy az érett, egy a torzult vonásra.',
    '',
    '| Pont | Érett vonás | Torzult vonás |',
    '|---|---|---|',
    ...['1', '2', '3', '4', '5'].map((k) => `| ${k} | ${cell(iv.anchorsE[k])} | ${cell(iv.anchorsT[k])} |`),
    '',
    ...iv.rules.map((s) => `- ${s}`),
    '',
    `> **Biztonság:** ${iv.safety}`,
    '',
    '## 3. Kérdésbank páronként',
    '',
  ];
  for (const { axis, pairs } of pairsByAxis()) {
    out.push(`### ${axis.name} (${axis.direction}) – ${axis.meaning}`, '');
    for (const p of pairs) {
      const q = p.interview;
      out.push(
        `#### ${p.id} · ${p.mature} / ${p.distorted}`,
        '',
        `- **Nyitó történet:** ${q.main}`,
        `- **Stresszhelyzet:** ${q.stress}`,
        `- **Mások szemével:** ${q.others}`,
        `- **Érett jelek:** ${q.signsE.join(' · ')}`,
        `- **Torzult jelek:** ${q.signsT.join(' · ')}`,
        '',
      );
    }
  }
  return out.join('\n');
}

function sjtDoc() {
  const out = [
    '# Jellemprofil – 2. kör: szituációs kérdőív (alkalmazásban)',
    '',
    GENERATED,
    '',
    `> Célcsoport: ${bank.audience}. A kitöltő csak a szűrő kérdőív alapján kiválasztott 6–8 pár szituációit kapja: páronként 3 helyzet, összesen 18–24, kb. 15–20 perc.`,
    '> Kitöltés: [kitolto.html](kitolto.html), „2. kör az alkalmazásban”.',
    '',
    '## 1. Formátum',
    '',
    `> ${bank.sjt.instructions}`,
    '',
    '- Minden helyzethez három reakció tartozik, a kitöltő számára véletlen, de kitöltésenként állandó sorrendben:',
    '  - **É** – az érett vonás reakciója;',
    '  - **T** – a torzult vonás reakciója, érthető, nem ellenszenves megfogalmazásban;',
    '  - **H** – a vonás hiánya vagy alulhasználata (a helyzet elkerülése vagy az ellenkező végletbe csúszás).',
    '- A kitöltő két dolgot jelöl: a **legvalószínűbb** és a **legkevésbé valószínű** reakciót. A harmadik ezzel középre kerül.',
    '- A kitöltő nem látja, melyik párt vagy tengelyt méri a helyzet, és a betűjeleket sem.',
    '',
    '## 2. Pontozás',
    '',
    '1. Helyzetenként: legvalószínűbb = 2 pont, középső = 1 pont, legkevésbé valószínű = 0 pont.',
    '2. Páronként (3 helyzet): érett érték = az É reakciók pontjainak összege / 6 × 100; torzult érték = a T reakciók pontjainak összege / 6 × 100.',
    '3. A H reakció pontjai nem kerülnek a radarra, de az eredménylapon „fejletlen terület” jelzésként megjelennek, ha a H átlaga magasabb az É-nél és a T-nél is.',
    '',
    '**Korlát:** a rangsorolás miatt egy helyzeten belül az érett és a torzult érték nem független (ha az egyik első, a másik nem lehet az). Ezért a szituációs eredmény a pár két rétegének egymáshoz viszonyított súlyát méri jól; a független mérést az 1. kör adja, a kettőt együtt értelmezzük.',
    '',
    '## 3. Összevonás az 1. körrel',
    '',
    'Minden kiválasztott párnál rétegenként:',
    '',
    '- **2. köri érték** = a szituációs és az élő interjús érték átlaga (ha csak az egyik készült el, akkor az);',
    '  az interjús 1–5 pont átváltása: `(pont − 1) / 4 × 100`;',
    '- **végső érték** = `(1. köri érték + 2 × 2. köri érték) / 3`, egészre kerekítve;',
    '- a nem kiválasztott párok végső értéke az 1. köri érték.',
    '',
    'A tengelyértékek a végső párértékek átlagai. A torzult jelölő akkor jelenik meg egy tengelyen, ha bármelyik párjának végső torzult értéke ≥ 75.',
    '',
    '## 4. Szituációk páronként',
    '',
  ];
  for (const { axis, pairs } of pairsByAxis()) {
    out.push(`### ${axis.name} (${axis.direction})`, '');
    for (const p of pairs) {
      out.push(`#### ${p.id} · ${p.mature} / ${p.distorted}`, '');
      p.sjt.forEach((s, i) => {
        out.push(`${i + 1}. ${s.stem}`, `   - **É:** ${s.E}`, `   - **T:** ${s.T}`, `   - **H:** ${s.H}`);
      });
      out.push('');
    }
  }
  return out.join('\n');
}

function injectIntoHtml() {
  const file = join(dir, 'kitolto.html');
  const html = readFileSync(file, 'utf8');
  const json = JSON.stringify(bank).replace(/</g, '\\u003c');
  const re = /(<script id="kerdesbank" type="application\/json">)[\s\S]*?(<\/script>)/;
  if (!re.test(html)) fail('kitolto.html: hiányzik a kerdesbank script blokk');
  writeFileSync(file, html.replace(re, (_, a, b) => a + json + b));
}

validate();

const r1File = join(dir, '01-szuro-kerdoiv.md');
writeFileSync(
  r1File,
  replaceBetween(
    readFileSync(r1File, 'utf8'),
    '<!-- BEGIN generated: round1-table -->',
    '<!-- END generated: round1-table -->',
    round1Table(),
    r1File,
  ),
);
writeFileSync(join(dir, '02-melyfuro-interju.md'), interviewDoc());
writeFileSync(join(dir, '03-szituacios-kerdoiv.md'), sjtDoc());
injectIntoHtml();
console.log('Kész: 01-szuro-kerdoiv.md (táblázat), 02-melyfuro-interju.md, 03-szituacios-kerdoiv.md, kitolto.html');
