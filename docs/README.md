# Projekt-dokumentáció

Ebben a könyvtárban található a koncepcióalkotás minden jelenlegi eredménye:

- [Eredeti ötlet](00-eredeti-otlet.md)
- [Rendezett koncepció](01-rendezett-koncepcio.md)
- [Induló megvalósítási terv](02-indulo-terv.md)
- [Tervezett funkciók](planned-feature-list.md)
- [Kattintható felületek és szerkeszthető forrásaik](visualizations/README.md)
- [Név és arculat: Cohors és Ordo VIII névtér, logóvázlatok](arculat/README.md)
- Jellemprofil – Testudo (30 érett jellemvonás és torzult párja, önértékelés + verifikátor, 6 területes radar):
  - [Testudo felmérés és kérdésműhely (HTML)](jellemprofil/testudo.html)
  - [Testudo kitöltői változat, Kérdésműhely nélkül (HTML)](../interju/index.html) – ezt kapják a kitöltők (a landing oldal „Kezdjük el” gombja ide visz); a build generálja, ne kézzel szerkeszd
  - [Közös kérdésbank: 180 tétel](jellemprofil/01-kerdesbank.md)
  - [Mélyfúrás: páronkénti élő interjú](jellemprofil/02-melyfuro-interju.md)
  - [Mélyfúrás: szituációs kérdőív](jellemprofil/03-szituacios-kerdoiv.md)
  - [Kihívásbank: heti és napi kihívások a profil alapján](jellemprofil/04-kihivasbank.md)
  - Minden szöveg forrása a [kerdesbank.json](jellemprofil/kerdesbank.json) és a [kihivasbank.json](jellemprofil/kihivasbank.json); szerkesztés után: `node docs/jellemprofil/build.mjs` (ez írja a `testudo.html`-t, az `../admin/index.html`-t és az `../interju/index.html`-t is)
  - A kihivasbank.json a Google Sheet kihíváskatalógusából jön; a Sheet módosítása után: `node docs/jellemprofil/sync-kihivasok.mjs && node docs/jellemprofil/build.mjs`

A `visualizations` könyvtár önállóan megnyitható HTML-fájlokat is tartalmaz, ezért a wireframe-ek a Codex vizualizációs tárhelyétől függetlenül megmaradnak a repóban.
