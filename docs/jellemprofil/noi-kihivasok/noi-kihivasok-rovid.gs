function noiKihivasokBeirasa() {
  const URL = 'https://raw.githubusercontent.com/kovacsgpeter/manipular/claude/elegant-mccarthy-9ndgkv/docs/jellemprofil/noi-kihivasok/noi-kihivasok.tsv';
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets().find((s) => s.getSheetId() === 2100000104);
  if (!sh) throw new Error('Nem találom a kihíváskatalógus fület.');
  if (sh.getRange(3, 13).getDisplayValue().trim() !== 'Forrássor') throw new Error('Váratlan fejléc a 3. sorban.');
  const lines = UrlFetchApp.fetch(URL).getContentText('UTF-8').trim().split('\n').slice(1);
  const rows = lines.map((l) => l.split('\t')).map((r) => [r[0], r[1], r[2], Number(r[3]), r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11] === 'TRUE', r[12]]);
  const n = Math.max(sh.getLastRow() - 3, 1);
  const titles = sh.getRange(4, 1, n, 1).getDisplayValues();
  const sources = new Set(sh.getRange(4, 13, n, 1).getDisplayValues().map((r) => r[0].trim()));
  let last = 3;
  titles.forEach((r, i) => { if (r[0].trim()) last = 4 + i; });
  const todo = rows.filter((r) => !sources.has(r[12]));
  if (!todo.length) return SpreadsheetApp.getUi().alert('Már mind bent van.');
  const start = last + 1, end = start + todo.length - 1;
  if (end > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), end - sh.getMaxRows());
  sh.getRange(start, 12, todo.length, 1).insertCheckboxes();
  sh.getRange(start, 1, todo.length, 13).setValues(todo);
  const f = sh.getRange(4, 14).getFormulaR1C1();
  if (f) sh.getRange(start, 14, todo.length, 1).setFormulaR1C1(f);
  SpreadsheetApp.getUi().alert(todo.length + ' sor beírva: ' + start + '–' + end + '. sor.');
}
