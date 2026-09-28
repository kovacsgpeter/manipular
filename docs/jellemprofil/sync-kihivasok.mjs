// Kihíváskatalógus (Google Sheet) → kihivasbank.json.
// Futtatás: node docs/jellemprofil/sync-kihivasok.mjs [letöltött.csv] && node docs/jellemprofil/build.mjs
// CSV nélkül a Sheetből tölti le (a táblázatnak linkkel olvashatónak kell lennie).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SHEET_CSV = 'https://docs.google.com/spreadsheets/d/1xJG-GlccBAzx7I3SdjSKSA5h-AJvgSJ1GUOEYQ8_IpM/export?format=csv&gid=2100000104';
const TYPES = { Napi: 'daily', Heti: 'weekly' };
const GENDERS = { Koedukált: 'any', Női: 'female', Férfi: 'male' };
const dir = dirname(fileURLToPath(import.meta.url));

function fail(msg) {
  console.error(`Szinkron hiba: ${msg}`);
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; } else if (ch === '"') quoted = false; else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

async function load() {
  if (process.argv[2]) return readFileSync(process.argv[2], 'utf8');
  const res = await fetch(SHEET_CSV);
  if (!res.ok) fail(`a Sheet letöltése nem sikerült (HTTP ${res.status})`);
  return res.text();
}

const rows = parseCsv(await load());
const headAt = rows.findIndex((r) => r[0]?.trim() === 'Kihívás');
if (headAt < 0) fail('nem találom a „Kihívás” fejlécsort');
const head = rows[headAt].map((h) => h.trim());
const col = (name) => {
  const i = head.indexOf(name);
  if (i < 0) fail(`hiányzó oszlop: ${name}`);
  return i;
};
const COLS = Object.fromEntries(['Kihívás', 'Leírás', 'Időtartam', 'Típus', 'Célcsoport', 'Irány', 'Érett célvonás', 'Korrigált torzulás', 'Dimenzió', 'Aktív', 'Forrássor', 'Érvényes?'].map((n) => [n, col(n)]));

const challenges = [];
for (const r of rows.slice(headAt + 1)) {
  const get = (name) => (r[COLS[name]] ?? '').replace(/\s+/g, ' ').trim();
  if (!get('Kihívás') || get('Aktív') !== 'TRUE' || get('Érvényes?') !== 'OK') continue;
  const src = get('Forrássor');
  challenges.push({
    id: /^\d+$/.test(src) ? `K${src.padStart(3, '0')}` : src,
    type: TYPES[get('Típus')] || get('Típus'),
    direction: get('Irány'),
    title: get('Kihívás'),
    mature: get('Érett célvonás'),
    distorted: get('Korrigált torzulás'),
    description: get('Leírás'),
    gender: GENDERS[get('Célcsoport')] || get('Célcsoport'),
    dimension: get('Dimenzió'),
    days: Number(get('Időtartam')) || null,
  });
}
if (!challenges.length) fail('nincs aktív, érvényes sor');

const out = {
  schema: 'manipular-kihivasbank/1',
  version: new Date().toISOString().slice(0, 10) + '-katalogus',
  note: 'A Kihíváskatalógus – 4 irány fül aktív, érvényes sorai. Ne kézzel szerkeszd: a Sheetben módosíts, majd futtasd a sync-kihivasok.mjs és a build.mjs szkriptet.',
  challenges,
};
writeFileSync(join(dir, 'kihivasbank.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`Kész: ${challenges.length} kihívás → kihivasbank.json (${out.version})`);
