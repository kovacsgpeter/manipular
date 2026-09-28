// Kérdésbank → Testudo HTML és dokumentáció. Futtatás: node docs/jellemprofil/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const bank = JSON.parse(readFileSync(join(dir, 'kerdesbank.json'), 'utf8'));
const chBank = JSON.parse(readFileSync(join(dir, 'kihivasbank.json'), 'utf8'));

function fail(msg) {
  console.error(`Hibás bank: ${msg}`);
  process.exit(1);
}

const CONTEXTS = ['általános', 'otthon', 'munka', 'közösség', 'hitgyakorlat', 'vezetés'];
const AXIS_ORDER = ['ELO', 'HAT', 'OLD', 'IST', 'ELH', 'FEL'];

function validate() {
  if (bank.schema !== 'manipular-kerdesbank/2') fail('ismeretlen séma');
  if (bank.axes.map((a) => a.id).join() !== AXIS_ORDER.join()) fail('a tengelyek sorrendje ELO, HAT, OLD, IST, ELH, FEL kell legyen');
  if ([...bank.radarOrder].sort().join() !== [...AXIS_ORDER].sort().join()) fail('radarOrder ≠ axes');
  if (bank.traits.length !== 60) fail('60 jellemző kell');
  const itemIds = new Set();
  bank.traits.forEach((t, i) => {
    const pair = String(Math.floor(i / 2) + 1).padStart(2, '0');
    const kind = i % 2 === 0 ? 'E' : 'T';
    if (t.id !== `${pair}${kind}` || t.pair !== pair || t.kind !== kind) fail(`rossz sorrend vagy azonosító: ${t.id}`);
    if (t.axis !== AXIS_ORDER[Math.floor(i / 10)]) fail(`rossz terület: ${t.id}`);
    if (!t.name || !t.definition || !t.direction || !t.sub) fail(`hiányos jellemző: ${t.id}`);
    if (t.items.filter((q) => q.base).length !== 2) fail(`${t.id}: pontosan 2 alaptétel (base) kell`);
    for (const q of t.items) {
      if (!new RegExp(`^${t.id}[1-9]$`).test(q.id) || itemIds.has(q.id)) fail(`rossz vagy ismétlődő tételazonosító: ${q.id}`);
      itemIds.add(q.id);
      if (!q.text) fail(`üres tétel: ${q.id}`);
      if (!q.base && (!q.aspect || !CONTEXTS.includes(q.context) || !Number.isInteger(q.priority))) fail(`hiányos pool-mező: ${q.id}`);
    }
  });
  if (bank.pairs.length !== 30) fail('30 pár kell');
  bank.pairs.forEach((p, i) => {
    const id = String(i + 1).padStart(2, '0');
    if (p.id !== id || p.mature !== `${id}E` || p.distorted !== `${id}T` || p.axis !== AXIS_ORDER[Math.floor(i / 5)]) fail(`rossz pár: ${p.id}`);
    const iv = p.interview;
    if (!iv?.main || !iv.stress || !iv.others || !iv.signsE?.length || !iv.signsT?.length) fail(`hiányos interjú: ${p.id}`);
    if (p.sjt?.length !== 3 || p.sjt.some((s) => !s.stem || !s.E || !s.T || !s.H)) fail(`3 teljes szituáció kell: ${p.id}`);
  });
  for (const k of ['0', '1', '2', '3', '4']) if (!bank.interview.anchorsE[k] || !bank.interview.anchorsT[k]) fail(`hiányzó pontozási horgony: ${k}`);
}

const traitById = Object.fromEntries(bank.traits.map((t) => [t.id, t]));
const cell = (s) => String(s).replace(/\|/g, '\\|');
const GENERATED = '<!-- Generált fájl: a kerdesbank.json szerkesztése után futtasd: node docs/jellemprofil/build.mjs -->';
const pairTitle = (p) => `${traitById[p.mature].name} / ${traitById[p.distorted].name}`;
const axisHead = (a) => (a.name === a.direction ? a.name : `${a.name} (${a.direction})`);
const byAxis = () => bank.axes.map((a) => ({ axis: a, pairs: bank.pairs.filter((p) => p.axis === a.id) }));

function bankDoc() {
  const out = [
    '# Közös kérdésbank',
    '',
    GENERATED,
    '',
    `> Norma: ${bank.norm.window}, 0–4 gyakorisági skála (${Object.entries(bank.norm.scale).map(([k, v]) => `${k} ${v}`).join(', ')}), hiányválaszok: ${Object.entries(bank.norm.missing).map(([k, v]) => `${k} = ${v}`).join(', ')}. Harmadik személyű, konkrét viselkedést leíró állítások; önértékelés és verifikátor azonos szöveggel.`,
    '> Kitöltés és szakértői ellenőrzés: [testudo.html](testudo.html).',
    '',
    'Vonásonként 3 tétel: az 1–2. a Testudo 0.1 pilot tétele (ez az aktív alapinterjú, a korábbi 0.1-es mentések ezzel kompatibilisek), a 3. a manipular jellemprofil állítása Testudo-normára átírva, más részjelenséget lefedve. Minden tétel a Testudo poolban ellenőrzésre vár; a rögzített interjú vonásonként 2 (120 tétel) vagy 3 (180 tétel) jóváhagyott tétellel véglegesíthető.',
    '',
  ];
  for (const { axis, pairs } of byAxis()) {
    out.push(`## ${axisHead(axis)} – ${axis.meaning}`, '');
    for (const p of pairs) {
      out.push(`### ${p.id} · ${pairTitle(p)}`, '');
      for (const tid of [p.mature, p.distorted]) {
        const t = traitById[tid];
        out.push(`**${t.id} · ${t.name}** (${t.kind === 'E' ? 'érett' : 'torzult'}) – ${t.definition}`, '');
        out.push('| Kód | Állítás | Forrás |', '|---|---|---|');
        for (const q of t.items) {
          const extra = q.base ? '' : `<br>*Részjelenség:* ${q.aspect} · *Helyzet:* ${q.context}${q.evidence ? ` · *Megfigyelés:* ${q.evidence}` : ''}`;
          out.push(`| ${q.id} | ${cell(q.text)}${cell(extra)} | ${q.base ? 'Testudo 0.1' : 'manipular (átírt)'} |`);
        }
        out.push('');
      }
    }
  }
  return out.join('\n');
}

function interviewDoc() {
  const iv = bank.interview;
  const out = [
    '# Mélyfúrás – páronkénti élő interjú',
    '',
    GENERATED,
    '',
    `> Célcsoport: ${bank.audience}. Időigény: ${iv.duration}. A Testudo „Mélyfúrás” menüjében a kiemelt 6–8 párra; a kérdező ott látja a kérdéseket és ott rögzíti a benyomását.`,
    '> Az interjús benyomás külön mérés (0–4), a kérdőíves pontokkal nem vonódik össze, és azokat nem írja felül.',
    '',
    '## Felépítés',
    '',
    '1. **Nyitás** (3–5 perc)',
    '2. **Páronként** (4–5 perc): nyitó történet → rákérdezések → stresszhelyzet → „mások szemével” → benyomás rögzítése',
    '3. **Zárás** (5 perc)',
    '',
    '### Nyitás',
    '',
    ...iv.intro.map((s) => `- ${s}`),
    '',
    '### Általános rákérdezések',
    '',
    ...iv.probes.map((s) => `- „${s}”`),
    '',
    '### Zárás',
    '',
    ...iv.closing.map((s) => `- ${s}`),
    '',
    '## Benyomás rögzítése (0–4)',
    '',
    '| Pont | Érett vonás | Torzult vonás |',
    '|---|---|---|',
    ...['0', '1', '2', '3', '4'].map((k) => `| ${k} | ${cell(iv.anchorsE[k])} | ${cell(iv.anchorsT[k])} |`),
    '',
    ...iv.rules.map((s) => `- ${s}`),
    '',
    `> **Biztonság:** ${iv.safety}`,
    '',
    '## Kérdések páronként',
    '',
  ];
  for (const { axis, pairs } of byAxis()) {
    out.push(`### ${axisHead(axis)}`, '');
    for (const p of pairs) {
      const q = p.interview;
      out.push(
        `#### ${p.id} · ${pairTitle(p)}`,
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
    '# Mélyfúrás – szituációs kérdőív',
    '',
    GENERATED,
    '',
    `> Célcsoport: ${bank.audience}. Az önértékelő tölti ki a Testudo „Mélyfúrás” menüjében, a kiemelt 6–8 párra: páronként 3 helyzet, összesen 18–24, kb. 15–20 perc.`,
    '',
    '## Formátum',
    '',
    `> ${bank.sjt.instructions}`,
    '',
    '- Minden helyzethez három reakció tartozik, verziónként rögzített sorrendben:',
    '  - **É** – az érett vonás reakciója;',
    '  - **T** – a torzult vonás reakciója, érthető, nem ellenszenves megfogalmazásban;',
    '  - **H** – a vonás hiánya vagy alulhasználata (a helyzet elkerülése vagy az ellenkező végletbe csúszás).',
    '- A kitöltő a **legvalószínűbb** és a **legkevésbé valószínű** reakciót jelöli; a harmadik középre kerül.',
    '- A kitöltő nem látja, melyik párt méri a helyzet, és a betűjeleket sem.',
    '',
    '## Pontozás',
    '',
    bank.sjt.scoring,
    '',
    '**Korlát:** a rangsorolás miatt egy helyzeten belül az érett és a torzult reakció nem lehet egyszerre első, ezért a szituációs érték a két réteg egymáshoz viszonyított súlyát méri, nem a független gyakoriságukat. A kérdőíves pontokkal együtt, de külön értelmezzük.',
    '',
    '## Szituációk páronként',
    '',
  ];
  for (const { axis, pairs } of byAxis()) {
    out.push(`### ${axisHead(axis)}`, '');
    for (const p of pairs) {
      out.push(`#### ${p.id} · ${pairTitle(p)}`, '');
      p.sjt.forEach((s, i) => out.push(`${i + 1}. ${s.stem}`, `   - **É:** ${s.E}`, `   - **T:** ${s.T}`, `   - **H:** ${s.H}`));
      out.push('');
    }
  }
  return out.join('\n');
}

const CH_TYPES = { weekly: 'Heti', daily: 'Napi' };
const CH_DIRS = ['Előre', 'Hátra', 'Oldalra', 'Felfelé'];

function resolveChallenges() {
  if (chBank.schema !== 'manipular-kihivasbank/1') fail('kihivasbank.json: ismeretlen séma');
  const byName = Object.fromEntries(bank.traits.map((t) => [t.name, t]));
  const ids = new Set();
  const out = chBank.challenges.map((c) => {
    const where = `kihívás ${c.id || '?'}`;
    if (!c.id || ids.has(c.id)) fail(`${where}: hiányzó vagy ismétlődő azonosító`);
    ids.add(c.id);
    if (!CH_TYPES[c.type]) fail(`${where}: a type "weekly" vagy "daily" lehet`);
    if (!c.title || !c.description) fail(`${where}: hiányzó cím vagy leírás`);
    let pair = null;
    if (c.mature) {
      const t = byName[c.mature];
      if (!t || t.kind !== 'E') fail(`${where}: ismeretlen érett jellem: ${c.mature}`);
      pair = t.pair;
      if (c.distorted && traitById[bank.pairs.find((p) => p.id === pair).distorted].name !== c.distorted) fail(`${where}: a(z) ${c.distorted} nem a(z) ${c.mature} párja`);
    } else if (c.distorted) fail(`${where}: torzulás csak érett jellemmel együtt adható meg`);
    const pairDir = pair && bank.axes.find((a) => a.id === bank.pairs.find((p) => p.id === pair).axis).direction;
    const direction = c.direction || pairDir;
    if (!CH_DIRS.includes(direction)) fail(`${where}: az irány ${CH_DIRS.join(', ')} lehet`);
    return { id: c.id, type: c.type, direction, pair, title: c.title, description: c.description };
  });
  for (const type of Object.keys(CH_TYPES)) if (!out.some((c) => c.type === type)) fail(`kihivasbank.json: legalább egy ${CH_TYPES[type].toLowerCase()} kihívás kell`);
  if (out.filter((c) => c.type === 'daily').length < 5) fail('kihivasbank.json: legalább 5 napi kihívás kell');
  return { schema: chBank.schema, version: chBank.version, challenges: out };
}

function challengeDoc(resolved) {
  const out = [
    '# Kihívásbank',
    '',
    GENERATED.replace('kerdesbank.json', 'kihivasbank.json'),
    '',
    '> A Testudo „Kihívások” menüje ebből a bankból állít össze egy heti és öt napi kihívást a kész profil alapján: alapból azokat a párokat részesíti előnyben, ahol a torzult működés gyakoribb vagy az érett ritkább. A súlyozás, a nézőpont, az irányfókusz és az erősségekre jutó napi kihívások száma a Kérdésműhely › Kihívás-beállítások fülön állítható. A kihívás a megadott érett jellemre és annak torzult párjára céloz; ha nincs megadva jellem, csak az iránya számít.',
    '',
  ];
  for (const type of Object.keys(CH_TYPES)) {
    out.push(`## ${CH_TYPES[type]} kihívások`, '', '| Kód | Irány | Cím | Célpár | Leírás |', '|---|---|---|---|---|');
    for (const c of resolved.challenges.filter((x) => x.type === type)) {
      const p = c.pair && bank.pairs.find((x) => x.id === c.pair);
      out.push(`| ${c.id} | ${c.direction} | ${cell(c.title)} | ${p ? `${p.id} · ${cell(pairTitle(p))}` : '—'} | ${cell(c.description)} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

function injectIntoHtml(resolved) {
  const file = join(dir, 'testudo.html');
  let html = readFileSync(file, 'utf8');
  for (const [id, data] of [['kerdesbank', bank], ['kihivasbank', resolved]]) {
    const json = JSON.stringify(data).replace(/</g, '\\u003c');
    const re = new RegExp(`(<script id="${id}" type="application\\/json">)[\\s\\S]*?(<\\/script>)`);
    if (!re.test(html)) fail(`testudo.html: hiányzik a(z) ${id} script blokk`);
    html = html.replace(re, (_, a, b) => a + json + b);
  }
  writeFileSync(file, html);
}

validate();
const challenges = resolveChallenges();
writeFileSync(join(dir, '01-kerdesbank.md'), bankDoc());
writeFileSync(join(dir, '02-melyfuro-interju.md'), interviewDoc());
writeFileSync(join(dir, '03-szituacios-kerdoiv.md'), sjtDoc());
writeFileSync(join(dir, '04-kihivasbank.md'), challengeDoc(challenges));
injectIntoHtml(challenges);
console.log('Kész: 01-kerdesbank.md, 02-melyfuro-interju.md, 03-szituacios-kerdoiv.md, 04-kihivasbank.md, testudo.html');
