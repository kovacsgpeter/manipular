function noiKihivasokBeirasa() {
  const URL = 'https://raw.githubusercontent.com/kovacsgpeter/manipular/claude/elegant-mccarthy-9ndgkv/docs/jellemprofil/noi-kihivasok/noi-kihivasok.tsv';
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets().find((s) => s.getSheetId() === 2100000104);
  if (!sh) throw new Error('Nem találom a kihíváskatalógus fület.');
  if (sh.getRange(3, 13).getDisplayValue().trim() !== 'Forrássor') throw new Error('Váratlan fejléc a 3. sorban.');
  const lines = UrlFetchApp.fetch(URL).getContentText('UTF-8').trim().split('\n').slice(1);
  const rows = lines.map((l) => l.split('\t')).map((r) => [r[0], r[1], r[2], Number(r[3]), r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11] === 'TRUE', r[12]]);
  const ours = new Set(rows.map((r) => r[0]));
  const n = Math.max(sh.getLastRow() - 3, 1);
  const existing = sh.getRange(4, 1, n, 13).getDisplayValues();
  const sources = new Set(existing.map((r) => r[12].trim()));
  let last = 3;
  // Egy korábbi, félbeszakadt futás sorait (saját cím, üres Forrássor) felülírja.
  existing.forEach((r, i) => { if (r[0].trim() && !(ours.has(r[0].trim()) && !r[12].trim())) last = 4 + i; });
  const todo = rows.filter((r) => !sources.has(r[12]));
  if (!todo.length) return SpreadsheetApp.getUi().alert('Már mind bent van.');
  const start = last + 1, end = start + todo.length - 1, len = todo.length;
  if (end > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), end - sh.getMaxRows());
  // A 174. sortól elcsúszott érvényesítés javítása: J = dimenzió lista, K (Szerző) szabad szöveg.
  sh.getRange(start, 10, len, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Fizikai', 'Szellemi', 'Lelki'], true).build());
  sh.getRange(start, 11, len, 1).clearDataValidations();
  sh.getRange(start, 12, len, 1).insertCheckboxes();
  sh.getRange(start, 1, len, 13).setValues(todo);
  sh.getRange(start, 5, len, 1).setFormulaR1C1('=IF(R[0]C[-1]="","",IF(R[0]C[-1]=1,"Napi","Heti"))');
  const f = sh.getRange(4, 14).getFormulaR1C1();
  if (f) sh.getRange(start, 14, len, 1).setFormulaR1C1(f);
  SpreadsheetApp.getUi().alert(len + ' sor beírva: ' + start + '–' + end + '. sor.');
}
