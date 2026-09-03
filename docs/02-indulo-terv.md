# Induló játék- és megvalósítási terv

> Állapot: **v0.14 – a tizenharmadik koncepcióinterjúval frissítve**. Ez még nem végleges specifikáció. A `Nyitott` jelölésű részeket a következő beszélgetésekben kell eldönteni. A tudatosan későbbre tett lehetőségeket a [`planned-feature-list.md`](planned-feature-list.md) tartja nyilván.

## 1. Termékcél

Három ismerős közös, időben behatárolt hadjáratban rendszeresen teljesíti a saját valódi vállalásait. A játék:

- tegye egyértelművé, hogy ma és ezen a héten mi a következő lépés;
- adjon azonnali, hangulatos visszajelzést minden teljesítésre;
- mutassa meg az egyéni tett közös következményét;
- teremtsen enyhe, pozitív csapatfelelősséget szégyenítés nélkül;
- legyen hetente új tartalommal frissíthető programozás nélkül.

### Első sikerkritériumok

- A három játékos végig tud vinni egy héthetes próbakampányt.
- Egy feladat rögzítése legfeljebb néhány kattintás.
- A napi belépés, helyzetfelmérés és teljesítésrögzítés 3–5 percbe belefér.
- A heti állapot Git-konfliktus nélkül szinkronizálható.
- A történet készítője kódmódosítás nélkül össze tud állítani egy új hetet.
- Minden pontszám és csataeredmény ugyanabból a mentésből újraszámítható.

## 2. Tervezési alapelvek

1. **Kooperáció, nem rangsor:** a közös siker a cél; az egyéni hozzájárulás informatív, nem megszégyenítő.
2. **A valós tett az első:** a játék ne ösztönözzön értelmetlen pontfarmolásra.
3. **Kicsi adminisztráció:** a feladat felvétele és lezárása legyen gyors.
4. **Következmény, nem csak pont:** a teljesítés változtasson a térképen, táboron vagy történeten.
5. **Átlátható szabályok:** a játékos értse, miből származott egy jutalom vagy csataeredmény.
6. **Megbocsátó rendszer:** egy rossz hét gyengítse a sereget, de ne tegye értelmetlenné a kampány folytatását.
7. **Adatminimalizálás:** a repóba ne kerüljön levéltartalom vagy érzékeny személyes adat.
8. **Tartalomvezérelt működés:** a motor ne tartalmazza egy konkrét curriculum, hét vagy történet feladatait.
9. **Komponálható szabályok:** igazolás, láthatóság és sikertelenségi következmény feladatonként konfigurálható legyen.
10. **Deklaratív konfiguráció:** a YAML kizárólag a motor által ismert típusokat és műveleteket paraméterezi; nem tartalmaz futtatható kódot.

## 3. Elsőként javasolt játékstruktúra

### Kampány

- **Döntés:** 7 hetes hadjárat.
- Minden héten új történetfájl kerül a GitHub-repóba, és ezzel válik elérhetővé az új térképszakasz.
- A heti előrehaladás a két beépített policy egyikét használja: `calendar` vagy `completion_gate`.
- A hadjárat közben szakaszzáró vagy mérföldkő-összecsapások történnek; pontos helyük még nyitott.
- A 7. hét végén következik a künoszkephalai döntő csata.
- A finálé után összegzés készül a fontos döntésekről és a csapat fejlődéséről.

### Heti ritmus

- **Eligazítás:** rövid történeti jelenet, heti fenyegetés és csapatcél.
- **Vállalás:** minden játékos kiválaszt vagy rögzít néhány feladatot.
- **Végrehajtás:** a teljesítések erőforrásokat adnak és eseményeket oldanak fel.
- **Döntés:** a csapat egy erőforrás-elköltési vagy útvonalválasztási kérdésben szavaz.
- **Összecsapás:** a rendszer kiértékeli az adott heti helyzetet.
- **Táborverés:** rövid eredmény, regeneráció és előretekintés.

A játékot várhatóan naponta nyitják meg 3–5 percre. A heti ritmus ezért rövid napi ciklusokra bomlik: helyzetfelmérés, esetleges új vállalás, teljesítés bejelentése, csapattársi ellenőrzés és azonnali játékbeli visszajelzés.

### Konfigurálható erőforrások és pontok

A motor nem tartalmaz rögzített erőforráslistát. A `campaign.yaml` definiálja az erőforrások stabil azonosítóját, nevét, megjelenítési adatait, alsó és felső korlátját. A minimum lehet negatív, a maximum pedig opcionális. Minden erőforrás `overflowPolicyRef` mezővel hivatkozik egy névvel ellátott, újrahasznosítható policy-re. Ez választja ki a `clamp`, `convert` vagy `overflow_event` működést, és ez tartalmazza a konverziós célt, arányt vagy a kiváltandó eseményt. A következő készlet a künoszkephalai kampány egy lehetséges konfigurációja:

| Erőforrás | Mit fejez ki? | Példa valós feladatokra | Lehetséges csatahatás |
|---|---|---|---|
| `virtus` – harci erő | fizikai és nehéz vállalások | sport, edzés, rég halogatott feladat | frontális műveletek ereje |
| `disciplina` – fegyelem | rendszeresség és tanulás | szövegtanulás, napi gyakorlás | alakzat és reakció megbízhatósága |
| `exploratio` – felderítés | tudás és kapcsolatépítés | kutatás, beszélgetés, új kapcsolat | veszélyek és opciók előzetes felfedése |
| `auctoritas` – befolyás | alkotás és kommunikáció | poszt, publikálás, megkeresés | szövetségesek, morál vagy alternatív út |
| `commeatus` – készlet | általános végrehajtás, csapatbónusz | heti vállalások összessége | veszteségcsökkentés és regeneráció |

Egy feladat egyszerre adhat közvetlenül egy vagy több kampányerőforrást, személyes pontot és közös csapatpontot. A curriculum feladatonként külön `personalPoints` és `teamPoints` értéket ad meg; nincs globális szétosztási arány. A személyes pontot a tulajdonosa önállóan költheti el. Közös pont elköltéséhez 2/3-os szavazás kell, amely két egyező szavazatnál lezárul. Mindkét pontfajta táborfejlesztésekre és csata előtti bónuszokra költhető. A csatabónusz pontjai foglaláskor zárolódnak, a csata indulásakor végleg levonódnak, törlés esetén pedig automatikusan visszajárnak.

A tábor fejlesztése egyszerre vizuális és mechanikai. A curriculum definiálja a fejlesztés költségét, látványállapotát és a feladatokra, erőforrásokra vagy csatákra adott bónuszát. A hatás fejlesztésenként lehet tartós vagy időszakos; lejárata abszolút dátummal, hét-, csata- vagy felhasználásszámmal adható meg. Halmozódási módja `additive`, `strongest_only` vagy `non_stackable`.

### Curriculum, feladattípusok és példányosítás

A curriculum külön fájlból betöltött, hierarchikus feladatlista. Nem egyetlen kampányhoz égetjük a motorba: később cserélhető és bővíthető.

A „feladattípus” több, egymástól független tulajdonságot takarhat. Ha mindent egyetlen enumba zsúfolunk, idővel olyan kombinált típusok jelenhetnek meg, mint a „heti, csapatos, időtartamos, társ által ellenőrzött feladat”. Ennek ellenére az első verzió tudatosan az egyszerűbb megoldással indul: egyetlen zárt `taskType` enum írja le a feladat viselkedési mintáját. A többtengelyes modell későbbi fejlesztési lehetőség.

Az MVP pontos `taskType` enumja:

| Típus | Szerep | Alapértelmezett vagy megengedett megjelenítő |
|---|---|---|
| `one_off` | egyszeri, bináris feladat | `check` |
| `quantity` | számszerű cél | `counter` |
| `duration` | időben mért cél | `duration` |
| `checklist` | több megnevezett részlépés | `checklist` |
| `evidence` | bizonyíték beküldése | `evidence` |
| `habit` | ismétlődő teljesítések gyűjtése | `check` vagy `counter` alapú naplózás |
| `team_challenge` | több játékos közös teljesítése | a curriculum által engedett öt megjelenítő egyike |
| `battle_action` | nehézségi fokozatból választott hadmozdulat | a kiválasztott fokozat feladatának megjelenítője |
| `timed_challenge` | lejáró, időablakos kihívás | a kihívás méréséhez választott megjelenítő |
| `recovery_task` | korábbi kudarc után megnyíló pótfeladat | a pótlás méréséhez választott megjelenítő |

Az öt beépített adatbeviteli megjelenítő:

- `check`: egyszeri igen/nem teljesítés, egy „Kész” művelettel;
- `counter`: számszerű érték vagy fokozatosan növelt darabszám;
- `duration`: percben vagy órában mért teljesítés;
- `checklist`: több, megnevezett részlépésből álló feladat;
- `evidence`: rövid szöveg vagy hivatkozás beküldése bizonyítékként.

A `taskType` rögzíti a működést és az adott típus számára érvényes konfigurációs sémát. A `renderer` kizárólag az öt beépített adatbeviteli felület közül választ. Az `evidence` az MVP-ben rövid szöveget vagy URL-t fogad el; fájlt és képet nem.

Az összetett `battle_action`, `timed_challenge` és `recovery_task` belső feladatát két, egymást kizáró formában adhatja meg:

- `embeddedTask`: rövid, csak az adott összetett feladatban használt beágyazott definíció;
- `taskRef`: a curriculum másutt definiált, paraméterezhető feladatsablonjának azonosítója, a sablon által kötelezőnek jelölt `params` értékekkel.

A séma pontosan az egyik mezőt követeli meg.

A sablonparaméterek támogatott JSON Schema-részhalmaza: `string`, `integer`, `number`, `boolean`, `duration`, `enum`, `url`, `object` és rekurzív `array`. Az alap `required`, `default`, `minimum`, `maximum` és `enum` korlátok mellett támogatott a `minLength`, `maxLength`, `pattern`, `minItems` és `maxItems`. Egy tömb eleme újabb tömb vagy objektum is lehet. Az objektum `properties` mezőit deklarálni kell, az ismeretlen mezőket a validátor elutasítja. A motor a curriculumban megadott korlátoktól függetlenül legfeljebb öt beágyazási szintet, tömbönként száz elemet és szövegenként tízezer karaktert fogad el. A hivatkozás helye kizárólag a sablon által deklarált `params` mezőket adhatja át; címet, jutalmat, policy-t vagy más task-mezőt nem írhat felül.

A későbbi többtengelyes modellben külön válna a `schedule`, `scope`, `assignmentMode`, `activationPolicy`, `completionPolicy`, `visibility` és `onFailure`; ezt most nem építjük meg.

Az `assignmentMode` az azt engedélyező `taskType` sémájának paramétere:

- `fixed`: a curriculum a konkrét feladatot is meghatározza;
- `player_defined`: a curriculum csak keretet ad, a konkrét vállalást a játékos jelenti be.

A játékos által meghatározott vállalás tervezett életciklusa:

```text
elérhető -> bejelentett -> aktív -> teljesítésre beküldött
         -> csapattársi ellenőrzés alatt -> igazolt / elutasított / lejárt
```

A bejelentésről mindkét társ értesül. A `taskType` rögzíti a feladat működését. A `policyRef` kizárólag az igazolás és láthatóság szabályait adja egy névvel ellátott, újrahasznosítható csomagból. Egy policy legfeljebb egy közvetlen szülőt jelölhet, a szülő pedig már nem örökölhet tovább. A feladat az igazolási és láthatósági névtéren belül bármely örökölt mezőt felülírhat. Az értelmezési sorrend: közvetlen szülő → policy → feladat `policyOverrides`. A `taskType` működési mezői ezen az úton nem írhatók felül.

Minden feladatnak legyen egyértelmű teljesítési feltétele, határideje, jutalma, igazolási módja, láthatósága és sikertelenségi szabálya. A nehézség lehet előre rögzített vagy a játékos által vállalt, de az önkényes, teljesítés utáni átértékelést kerülni kell.

Egy sikertelen feladat a curriculumban több, együtt alkalmazható következményt is kaphat:

- a jutalom elmarad;
- fix erőforrás-levonás, játékbeli hátrány vagy más szankció keletkezik;
- egy megadott pótfeladat megnyílik.

A konkrét kombinációt a curriculum határozza meg, nem egyetlen globális szabály. A motor ehhez sémával validálható következmény-enumot és paraméterezett végrehajtókat biztosít.

## 4. Játékbeli visszacsatolás

Egy feladat teljesítésekor legalább három szinten jelenjen meg hatás:

1. **Azonnal:** rövid animáció, hang és a szerzett erőforrás.
2. **A táborban:** egy látható változás, például telő raktár, rendezettebb alakzat vagy magasabb tábortűz.
3. **A hadjáratban:** új útvonalszakasz, információ, esemény vagy jobb csatahelyzet.

A fő történeti visszacsatolás a térképen és az eseménysoron látszik. A táborfejlesztés, gyűjtés és szakaszzáró csaták ennek egymást erősítő részei, nem egymástól független aljátékok.

A szakaszzáró és végső csaták ütemezett, közösségi kihívássorozatok arcade megjelenítéssel. Minden csata fixen három részből áll: **eligazítás**, **manőverek**, **kiértékelés**. A manőverek listáján belül szinkron és aszinkron fázisok egyaránt szerepelhetnek. Szinkron fázisban egy host gép jeleníti meg és rögzíti a csata állapotát; a másik két játékos a közös, fizikai esemény résztvevője. A host által rögzített eredmény akkor végleges, amikor minden érintett játékos saját teljesítését külön megerősítette. Külön megfigyelői jóváhagyás nem szükséges.

A csatában a játék hadmozdulatot kínál fel, a curriculum pedig három előre megírt fokozatot ad: **biztos**, **merész** és **vakmerő**. A curriculum mindháromhoz saját feladatot ír, a `campaign.yaml` pedig egyszer, az egész kampányra definiálja a három egységes fokozatszorzót. A séma csak azt követeli meg, hogy mindhárom érték szám legyen; nem kényszerít sorrendet vagy előjelet.

Részleges eredménynél:

```text
hadászati hatás = round(teljesítési arány × fokozatszorzó × alapérték)
```

A legközelebbi egészre kerekítünk. A teljesítési arány kiszámítása feladattípusonként még nyitott.

Példák:

- egy kijelölt „seregtestparancsnok” 50 fekvőtámaszt vállal, miközben a társak ellenőrzik;
- mindhárom játékos két percig plankel, és egymás teljesítését igazolják;
- egy aszinkron hadmozdulatot a megadott időablakon belül külön-külön hajtanak végre.

A curriculum manőverenként választ az egyéni végrehajtás és a csapatkihívás között. Szintén a curriculum mondja meg, hogy az eredmény bináris vagy részleges lehet. Fizikai kihívásnál kötelező a `low`, `moderate` vagy `high` intenzitás, az eszközigény és egy rövid figyelmeztetés megadása. Alternatív kihívás csak akkor kötelező, ha a curriculum készítője azt megadja.

A kisebb kihívás nagyobb eséllyel sikerül, de kevesebb hadászati hatást adhat; a nagyobb vállalás többet érhet, de a lejárat vagy sikertelenség kedvezőtlen történeti ágat indít. Sikeres, időben ellenőrzött feladatnál a hadmozdulat sikeres animációja és ága jelenik meg. Sikertelenségnél a csata állapota romlik. A történet vereség után is mindig folytatódik egy kedvezőtlenebb ágon.

## 5. Felületi koncepció

### Térkép

- fix vagy enyhén görgethető, régi arcade/16 bites ihletésű Thesszália;
- jól elkülönülő, kattintható állomások;
- animált csapatjelző a bejárt útvonalon;
- köd vagy elsötétítés a még ismeretlen területeken;
- rámutatási állapot minden interaktív objektumhoz;
- oldalsó vagy alsó információs panel az állomás aktiválásakor;
- elsődlegesen egérrel kezelhető interakció.

Az első verzió saját indítóval rendelkező, Electronba csomagolt asztali alkalmazás. A felület webes technológiával készül, és a csomagba épített aktuális Chromium motoron teszteljük. macOS és Windows a hivatalos MVP-platform. A felület reszponzív marad, de az első verzióban nem vállalunk teljes mobilos használati és Git-szinkronfolyamatot.

### Tábor

- egyetlen illusztrált táborjelenet, funkcionális hotspotokkal;
- az épületek állapota tükrözi a készleteket és morált;
- a curriculum fejlesztésenként meghatározza a költséget, a látványváltozatot és a mechanikai bónuszt;
- a legfontosabb napi művelet legfeljebb két interakcióra legyen;
- szükség esetén a jelenet fölött nyíló hagyományos panelek adják az olvasható részleteket.

A legegyszerűbb első megvalósításban a térkép és a tábor jelenete SVG, az információs panelek és vezérlők pedig HTML/CSS elemek. Így a hotspotok közvetlenül kattinthatók és reszponzívan méretezhetők. Canvas csak a későbbi arcade csataminijátékhoz szükséges, ha az animációk ezt indokolják.

Az MVP-hez nem tartozik külön akadálymentességi elfogadási csomag. Ez nem tiltja a natív HTML-vezérlők és ésszerű szemantika használatát, de a teljes billentyűzetes kezelés, a reduced-motion mód, a némítás és a formális hozzáférhetőségi tesztelés nem MVP-kilépési feltétel.

### Vizuális irány

- **Feltételezés:** pixel artot idéző, de modern felbontáson éles, korlátozott színpaletta;
- topográfiai részletek helyett először olvasható játéktér;
- a római és makedón oldal színnel és sziluettel is megkülönböztethető;
- a történet lazán támaszkodik a történelmi korszakra és helyszínre, de tudatosan arcade jellegű alternatív történet lehet.

## 6. Curriculum- és történetformátum

A curriculum kezdetben kézzel szerkesztett YAML, amely induláskor sémával validálódik. A curriculum hierarchiája, a névvel ellátott szabálycsomagok és a heti történet külön fájlban tárolható, így a célrendszer más kampánnyal párosítható. Egy curriculumrészlet vázlata:

```yaml
schemaVersion: 1
id: core-curriculum
groups:
  - id: disciplina
    title: Fegyelem
    tasks:
      - id: weekly-practice
        taskType: habit
        renderer: counter
        assignmentMode: player_defined
        target: 3
        prompt: Nevezd meg, mit gyakorolsz ezen a héten.
        policyRef: announced-peer-verified
        policyOverrides:
          verification:
            requiredApprovals: 2
        onFailure:
          - type: forfeit_reward
          - type: resource_penalty
            resource: disciplina
            amount: 1
          - type: unlock_recovery_task
            taskRef: weekly-practice-recovery
        rewards:
          disciplina: 2
```

Az ehhez kapcsolódó heti történetfájl vázlata:

```yaml
schemaVersion: 1
id: week-01
title: A hágók felé
availableFrom: 2026-09-07
availableUntil: 2026-09-13
curriculumRefs: [weekly-practice]
map:
  nodeId: larisa-road
  unlocks: [scout-ridge]
encounter:
  id: ridge-skirmish
  requiredTeamScore: 12
```

A tényleges szövegek külön lokalizációs fájlban is lehetnek, de az MVP-ben az egyszerűség kedvéért közvetlenül a YAML-ban maradhatnak. A történet- és konfigurációs fájl nem tartalmazhat futtatható JavaScriptet. Minden héten új `weeks/week-NN.yaml` fájl kerül a repóba.

Paraméterezett sablon és hivatkozása:

```yaml
taskTemplates:
  - id: repetition-set
    requiredParams:
      repetitions:
        type: integer
        minimum: 1
    task:
      taskType: quantity
      renderer: counter
      targetParam: repetitions

embeddedTask:
  taskType: one_off
  renderer: check
  title: Bemelegítés

taskRef: repetition-set
params:
  repetitions: 50
```

Az `embeddedTask` és `taskRef` ugyanazon összetett feladatban kölcsönösen kizárja egymást; a fenti blokkok két külön használati példát mutatnak.

Egy szabálycsomag vázlata:

```yaml
id: announced-peer-verified
extends: visible-to-team
verification:
  mode: peer_approval
  requiredApprovals: 1
visibility:
  mode: team_detail
```

## 7. Mentési és szinkronizációs modell

### Javasolt fájlszerkezet

```text
content/
  app-release.yaml
  campaign.yaml
  curriculum.yaml
  policies.yaml
  weeks/week-01.yaml
data/
  events/alex/week-01.jsonl
  events/bea/week-01.jsonl
  events/csaba/week-01.jsonl
  verification-requests/<playerId>/<requestId>.json
  verification-attempts/<playerId>/<requestId>/<attemptId>.json
  verification-events/<requestId>/<eventId>.json
cache/
  projections/*.json
schemas/
  story.schema.json
  player-save.schema.json
```

Az azonosítók példák; valódi neveket csak később kell rögzíteni.

### Konfliktusok elkerülése

- Az MVP-ben minden játékos ugyanazt a Git-ágat használja.
- Egy játékos kizárólag a saját, aktuális héthez tartozó `data/events/<playerId>/<weekId>.jsonl` fájlját módosítja.
- E-mailes ellenőrzés indításakor a játékos saját, változtathatatlan `data/verification-requests/<playerId>/<requestId>.json` fájlt hoz létre. A fájlnév nem tartalmaz tokent. A nyers token csak ebben a privát requestben szerepel; a verifier eseményei csak a hashét tárolják. Az erre az útvonalra szűrt push indítja az első workflow-t.
- A JSONL-fájl append-only eseménynapló, és a játékos soha nem írja újra más játékos állapotát.
- Minden művelet azonnal helyben mentődik. A külön **Szinkronizálás** gomb először dry-run tervet készít: engedélyezett fájllista, validációs eredmény, fetch/rebase szükségessége, commitüzenet, push-cél és blokkolók. A későbbi végrehajtás ugyanebből a tervből készít célzott commitot és push-t.
- Verifier-kérés push-a után a Szinkronizálás legfeljebb 90 másodpercig háttérben figyeli a `data/verification-events/<requestId>/` alatt megjelenő új eseményeket. Ha addig nincs végleges eredmény, a művelet befejeződik, a feladat pedig függőben marad.
- Egy későbbi kézi Szinkronizálás az aktuális játékos minden lejáratlan, nem végleges requestjéhez új, változtathatatlan `data/verification-attempts/<playerId>/<requestId>/<attemptId>.json` fájlt készít. Kérésenként legalább öt percnek kell eltelnie, és az előző attemptnek le kell zárulnia vagy a 90 másodperces figyelési időből ki kell futnia. Az attempt push-a az eredeti request módosítása nélkül indít új workflow-t.
- A request, az attempt és a verifier által írt `verification-event` külön, változtathatatlan fájl. Az aktuális verification státusz ezek időrendjéből képzett vetület. Ugyanazon levél elsődleges idempotenciakulcsa a `Message-ID`, ennek hiányában a normalizált tartalom lenyomata. Többszöri feldolgozás nem írhat felül rekordot és nem duplikálhat eredményt.
- Másik játékos közbeeső push-a esetén a kliens nem próbál felülírni, hanem háttérben újraszinkronizál, újraszámol és ismét pushol. Az átmeneti versenyhelyzet 1–2–4 másodperces és tovább duplázódó, legfeljebb 30 másodperces várakozással sikerig újrapróbálható, de a játékos megszakíthatja. Hitelesítési, jogosultsági, validációs vagy más nem átmeneti hibánál a folyamat azonnal megáll és egyértelmű hibát jelez. A háttérfolyamat nem blokkolhatja a helyi mentést vagy a felület többi részét.
- Ha a munkafán a játék által nem kezelt, követett módosítás van, a helyi mentés tovább működik, de a Sync megáll. Az alkalmazás nem stash-eli, nem commitolja és nem módosítja ezeket a fájlokat.
- Az eseménynapló az igazságforrás. A játékos- és közös állapot pillanatképei helyi, Git által nem követett gyorsítótárak, ezért bármikor újragenerálhatók és nem kell őket több gépről kézzel összefésülni.

### Eseményboríték és írásbiztonság

Minden generált `requestId`, `attemptId` és `eventId` UUID v4. A játékesemény kötelező borítéka:

```text
schemaVersion, eventId, eventType, occurredAt, timezoneOffsetMinutes,
actorId, campaignId, weekId, contentVersion, contentHash, payload
```

Az `occurredAt` ISO 8601 UTC időpont, mellette külön `timezoneOffsetMinutes` őrzi a rögzítéskori helyi eltolást. Íráskor az Electron main folyamat futásidőben validálja az eseményt, repónként sorba állítja az írásokat, egyetlen UTF-8 JSON-sort appendel, `fsync` után pedig visszaigazolja a műveletet. Az Electron single-instance lock mellett repónként külön, a Git által nem követett lock készül az alkalmazás `userData` könyvtárában.

Az első becsület alapú `one_off` teljesítési esemény payloadja a `taskId` értéket tartalmazza. A kötelező boríték `contentVersion` és `contentHash` mezője rögzíti az alkalmazott változtathatatlan tartalmat; a jutalmat a motor ebből számítja, nem az eseményben tárolt jutalomsnapshotból.

### Fontos technikai korlát

A webes kezelőfelület sandboxa nem futtathat tetszőleges Git-parancsokat. Ezért az első változat egy csomagolt asztali héjban két, biztonságilag elválasztott rétegből álljon:

- Chromiumban futó JavaScript/TypeScript kezelőfelület;
- helyi háttérfolyamat, amely fájlokat validál és ír, valamint szűk, előre meghatározott Git-műveleteket végez.

A webes UI önmagában nem teszi operációsrendszer-függetlenné a teljes terméket: a telepítő, az alkalmazás-aláírás, a fájlrendszeri útvonalak és a Git-integráció minden támogatott rendszeren külön csomagolást és tesztet igényel. Az MVP Electronnal készül, macOS és Windows célrendszerre.

Az Electron ugyanabba a csomagba építi a Chromiumot és a Node.js futtatókörnyezetet. Ez megfelel a Chromium-only döntésnek, de nagyobb telepítőt eredményez. A megjelenítő React + TypeScript + Vite alapú, az alkalmazásállapotot Redux Toolkit kezeli, a csomagolást pedig Electron Forge végzi. A Redux store session- és UI-állapotot, valamint az eseményfájlokból újraképzett normalizált vetületet tart; nem igazságforrás és nem kerül kanonikus állapotként vissza a repóba.

A forrás az első naptól `pnpm` workspace-monorepo, külön build-orchestrator nélkül. Az induló csomagok: `apps/desktop`, valamint `packages/core`, `packages/contracts`, `packages/persistence`, `packages/git-sync` és `packages/email-verifier`. A megosztott futásidejű szerződéseket TypeBox írja le, az ellenőrzést Ajv végzi.

A renderer Node-hozzáférés nélkül, `contextIsolation` mellett fut. A preload kezdeti allowlistje: `selectCampaignRepo`, `runPreflight`, `loadCampaign`, `appendPlayerEvent`, `previewSync` és `openReleasePage`. Minden IPC-kérés és -válasz megosztott futásidejű sémával validálódik. A közös válaszforma siker esetén `{ ok: true, data }`, hiba esetén `{ ok: false, error: { code, message, details, recoverable } }`; a `code` stabil gépi azonosító. A telepített alkalmazás induláskor egy, a felhasználó által kiválasztott helyi kampányrepót nyit meg. A Git-műveletekhez a gépen már telepített és hitelesített rendszer-Gitet hívja; a Git telepítése és működő helyi repo így előfeltétel. [Hivatalos Electron-dokumentáció](https://www.electronjs.org/docs/latest)

Az MVP-ben a motor forrása, a curriculum, a történet és a játékosadatok egyetlen privát GitHub-repóban maradnak. A macOS- és Windows-csomagok aláíratlan privát GitHub Releases kiadások. A verziókezelt `content/app-release.yaml` Semver `appVersion`, `releaseUrl` és támogatott `campaignSchema`-tartomány mezőket ad meg. Az `openReleasePage` kizárólag a konfigurált repositoryhoz tartozó HTTPS GitHub Releases URL-t nyithat meg. Az alkalmazás eltérésnél jelez és megnyitja a letöltési oldalt, de nem tölt le és nem telepít automatikusan; a játékos kézzel végzi a frissítést. Az első három megbízható játékos vállalja az aláíratlan alkalmazásokhoz tartozó operációsrendszer-figyelmeztetések kezelését.

Az Electron hivatalos útmutatója az Electron Forge használatát ajánlja csomagoláshoz, és a valódi automatikus frissítéshez kódaláírást ír elő. Az MVP ezért tudatosan csak verzióértesítést és kézi letöltést ad; a beépített updater és a kódaláírás későbbi fejlesztés. [Electron csomagolási útmutató](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging)

Az alkalmazás a kiválasztott kampányrepo útvonalát titkot nem tartalmazó `userData/settings.json` fájlban jegyzi meg, amelyet temporális fájl és atomi csere segítségével ír. Induláskor újraellenőrzi az útvonalat, és menüből engedi lecserélni. A háttérfolyamat preflight ellenőrzést futtat a Git elérhetőségén, a repository formátumán, a játékosazonosításon és a tartalomsémán. A remote/auth állapotot indulás után aszinkron módon vizsgálja, majd minden Sync előtt frissen ellenőrzi. Hiányzó Git vagy repo, hibás séma, illetve nem azonosítható játékos read-only módot eredményez. A remote vagy hitelesítés hibája csak a Szinkronizálást tiltja; a helyi eseménymentés használható marad. A diagnosztika másolható formában mutatja a Git verzióját, a repo útvonalát, a remote és hitelesítés állapotát, a sémahibát és a javasolt javítási lépést.

### Git-biztonság

- automatikus push csak sikeres validáció és szinkron után;
- nincs `force push`;
- a Szinkronizálás gomb kizárólag az aktuális játékos engedélyezett esemény-, `verification-request` és `verification-attempt` fájljait stage-eli és commitolja; a `data/verification-events/` útvonalra csak a GitHub Actions verifier írhat;
- az alkalmazás a többi követett vagy nem követett munkakönyvtári módosítást érintetlenül hagyja és nem teszi a játékcommit részévé;
- a személyes vagy titkos adatokat `.gitignore` és tartalmi szabályok védik;
- az MVP közös ágat és játékosonként elkülönített naplókat használ; a játékosonkénti ág és a központi szinkronszolgáltatás későbbi lehetőség.

### Tartalomverziók változtathatatlansága

Amint egy esemény hivatkozik egy heti tartalomverzióra, annak szabályai, jutalmai és azonosítói változtathatatlanná válnak. Javítás új, ember számára olvasható verzióazonosítóval készül. Az alkalmazás emellett automatikus tartalomhash-t számít. Az esemény mindkettőt rögzíti, hogy a pillanatkép később is ugyanazzal a szabályrendszerrel legyen újraszámítható.

Határidős feladatnál a helyi esemény `occurredAt` időpontja számít. A későbbi verifikáció ezt az állítást erősíti meg, de legkésőbb a curriculum által megadott `verificationDeadline` időpontig vagy időtartamon belül érkezhet. Audit céljából az esemény a helyi rögzítési időt, a verifikációs esemény pedig saját időpontját is tárolja; a Git commit és push ideje nem írja át a teljesítés időpontját.

### Játékosazonosítás

A `campaign.yaml` explicit Git-név/e-mail → stabil `playerId` megfeleltetést tartalmaz. Induláskor a helyi alkalmazás kiolvassa a Git-konfigurációt, pontos egyezést keres, majd csak az így azonosított játékos heti naplóját engedi módosítani. Minden játékosrekord olvasható `allowedEmail` listát is tartalmaz. Ez azonosítja az e-mailes feladatot kezdeményező játékost és az általa küldött eredeti levelet; a bizonyító válasz feladója a külső címzett. A személyes címek miatt az egyetlen MVP-repó privát, és adatminimalizálást alkalmaz.

## 8. Automatikus e-mailes igazolás

### Javasolt folyamat

1. A játék kriptográfiailag biztonságos véletlenforrásból 128 bites, egyszer használható tokent generál, amelyet csoportosított Base32 alakban mutat meg. A request fájlnevét ettől független `requestId` adja; a nyers token csak a privát request tartalmában szerepel.
2. A curriculum a token mellett kis- és nagybetűt nem érzékelő kötelező kifejezések listáját is megadja. A játékos a `campaign.yaml`-ban engedélyezett egyik saját címéről pontosan egy valódi külső `To` címzettnek küld levelet, a dedikált verifier Gmail-címét pedig látható CC-ként hozzáadja.
3. A bizonyíték a külső címzett Reply All válasza. A megjelenített névből kinyert e-mail-címeket trim és kisbetűsítés után hasonlítjuk össze, Gmail-specifikus pont- vagy pluszalias-átírás nélkül. A normalizált `From` címnek egyeznie kell az eredeti `To` címmel, a verifier címének pedig szerepelnie kell a válasz címzettjei között.
4. A token a válasz tárgyában vagy a teljes dekódolt szöveges tartalomban kereshető, az idézett eredeti levéllel együtt. A kötelező kifejezések ezzel szemben csak az idézett előzménytől elválasztott új válaszrészben számítanak. Az összevetés előtt Unicode-normalizálás, whitespace-összevonás és kisbetűsítés történik; minden kötelező kifejezésnek részsztringként kell szerepelnie.
5. Az új válaszrészt HTML `blockquote` és ismert szöveges idézetjelölők alapján választjuk le. Ha ez nem tehető meg megbízhatóan, a feladat `parse_error` jelzésű, nem végleges függő állapotban marad, a felület pedig egyszerű, idézés nélküli új választ kér. Ugyanaz a token a `verificationDeadline` eléréséig tovább használható, és egy későbbi érvényes válasz igazolhatja a feladatot.
6. Ha a külső címzett nem Reply All-lal válaszol, a verifier nem kap bizonyítékot. A feladat függőben marad, és a felület új Reply All választ kér; továbbítás vagy manuális felülbírálás nem igazol automatikusan.
7. A játékos változtathatatlan `verification-request` fájljának push-a útvonalszűrt GitHub Actions workflow-t indít. A workflow IMAP-on, külön app passworddel olvassa a kizárólag az MVP-hez létrehozott Gmail-postafiókot. Átmeneti hibánál egy futás legfeljebb három automatikus próbálkozást végez.
8. A request, az attempt és a verifier által írt `verification-event` külön változtathatatlan fájl. Csak a `verified` és `rejected` végleges; a `pending` és `parse_error` nem végleges állapot. Az aktuális státusz az időrendbe rendezett rekordokból képzett vetület. Az event a nyers token helyett csak tokenhash-t tárol.
9. A token a feladat `verificationDeadline` értékéig érvényes. Új token kiadásakor a korábbi token visszavonódik, új request és audit-esemény készül. Csak a visszavonás vagy az eredménytelen határidő-lejárat teszi a requestet végleg `rejected` állapotúvá; egy korábban hibás vagy hiányos válasz önmagában nem.
10. Ugyanazt a levelet elsődlegesen a `Message-ID`, ennek hiányában a normalizált tartalom lenyomata azonosítja, így több workflow-futás sem számolhatja el többször.
11. A Szinkronizálás az első request után legfeljebb 90 másodpercig figyeli az eredményt. Ha addig nem érkezik meg, a feladat függőben marad. Egy későbbi kézi Szinkronizálás az aktuális játékos minden lejáratlan, nem végleges requestjéhez új, változtathatatlan `verification-attempt` fájlt hoz létre. Az attempt csak akkor készülhet el, ha az előző lezárult vagy timeoutos, és az előző kísérlet óta legalább öt perc eltelt.

### MVP-megoldási lehetőségek

**Választott irány: GitHub Actions + dedikált ellenőrző postafiók**

- Nincs saját domain, ezért a Cloudflare Email Routing az MVP-ben nem használható új domain beszerzése nélkül.
- A verifierhez külön Gmail-fiók készül; kétlépcsős azonosítás mellett létrehozott, külön app passworddel éri el IMAP-on. Az app password GitHub Actions Secretsben marad.
- A workflow a beépített, futásonként létrejövő és az adott repóra korlátozott `GITHUB_TOKEN`-nel ír igazolási rekordot; kizárólag `contents: write` jogosultságot kap.
- A workflow a `data/verification-requests/**` vagy `data/verification-attempts/**` útvonalat érintő push-ra indul; nincs sűrű, üres időzített lekérdezés. Eredményét új `data/verification-events/<requestId>/<eventId>.json` fájlban írja, amely a tokenből csak hash-t tartalmaz.
- A GitHub Free jelenleg havi 2000 standard Actions-percet tartalmaz privát repókhoz; az MVP várható terhelése ennek kis része, de használati korlátként kezelni kell. [Hivatalos GitHub-dokumentáció](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
- A `GITHUB_TOKEN` az adott repóra korlátozott, és jogosultsága workflow-szinten szűkíthető. [Hivatalos GitHub-dokumentáció](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)
- Az IMAP app password csak bekapcsolt kétlépcsős azonosítással használható, és a Google az OAuth-alapú „Sign in with Google” megoldást tekinti biztonságosabbnak. Az MVP az egyszerűbb app password irányt vállalja, de kizárólag külön erre létrehozott, más célra nem használt postafiókkal. [Gmail app password](https://support.google.com/mail/answer/185833)

**Elvetett MVP-irány: Cloudflare Email Routing + Email Worker**

- A bejövő levelezés a Workers Free csomagban elérhető, tehát maga a szolgáltatás lehetne ingyenes.
- Használatához azonban saját, Cloudflare DNS-en kezelt domain kell; ilyen most nincs. Emiatt ez csak későbbi alternatíva. [Árazás](https://developers.cloudflare.com/email-service/platform/pricing/) · [Beállítás](https://developers.cloudflare.com/email-service/get-started/route-emails/)

**Elvetett MVP-irány: helyi ellenőrzés**

- A postafiók titkát minden játékos gépén kezelni kellene, a feldolgozás többször futhatna, és a központi audit nehezebb lenne.

**Döntés:** a rendszer vegyes igazolási módokkal indul. Az automatikus e-mail-integráció a háromfős MVP kötelező része, és pontosan egy külső címzett Reply All válaszlevelét igazolja. Saját domain hiányában a verifier GitHub Actionsben fut, egy dedikált Gmail-postafiókot olvas IMAP app passworddel. A request, attempt és verification-event külön immutable fájl; státuszuk vetület. Az eredményt a Szinkronizálás legfeljebb 90 másodpercig várja, majd függő állapotot mutat; a következő kézi Szinkronizálás az ötperces korlátot betartva új attempttel ismételheti meg az ellenőrzést.

### Biztonsági és adatvédelmi szabályok

- A levél törzse és melléklete soha ne kerüljön a Git-re.
- Az igazolási rekord csak a külső válasz feladó-azonosítójának hashét, a feladat- és tokenazonosítót, időpontot, illeszkedési eredményt és szükséges audit-metaadatot tároljon.
- Egy kód csak egyszer legyen beváltható, és járjon le.
- Ugyanaz a levél ne igazolhasson több teljesítést.
- A postafiók- és GitHub-hozzáférési titkok ne kerüljenek a megjelenítő folyamatba, a kampányrepóba vagy a curriculumba.
- A levéltörzs és mellékletek nem kerülhetnek workflow-logba; a tartalmi minta eredménye csak igaz/hamis értékként marad meg.
- Mivel a három játékos írhatja a közös privát repó workflow-fájljait, a csapat minden tagját megbízható üzemeltetőnek tekintjük. A postafiók-jogosultságot ettől függetlenül a lehető legszűkebbre kell venni.

## 9. Javasolt technikai felépítés

```text
Electron Forge asztali alkalmazás (macOS + Windows)
  -> React + TypeScript + Vite felület Chromiumban
      -> Redux Toolkit session/UI + újraképzett vetület
      -> Node-hozzáférés nélküli renderer
      -> allowlistes preload IPC
  -> helyi, korlátozott jogosultságú háttérfolyamat
      -> story loader + sémaellenőrzés
      -> játékszabály-motor
      -> játékos-eseménynapló
      -> rendszer-Gitet hívó szinkronizáló adapter

Workspace-monorepo egyetlen privát GitHub-repóban
  -> külön alkalmazás- és megosztott csomagok
  -> heti tartalom
  -> játékosonkénti állapot
  -> ellenőrzési rekordok
  -> GitHub Actions e-mail-verifier
      -> dedikált Gmail IMAP + app password
      -> külső címzett CC-be érkező Reply All válaszának ellenőrzése
```

Induló workspace:

```text
apps/desktop                 Electron Forge main + preload + React renderer
packages/core                tiszta játékszabályok és vetületek
packages/contracts           TypeBox sémák, TypeScript-típusok, IPC-hibakódok
packages/persistence         JSONL-események, app-beállítások és lockkezelés
packages/git-sync            preflight, dry-run és későbbi commit/push
packages/email-verifier      Gmail/IMAP feldolgozó és verification-event képzés
```

Javasolt modulhatárok:

- `content`: kampány- és heti fájlok betöltése;
- `curriculum`: feladathierarchia, típusséma és feladatpéldányosítás;
- `policies`: örökölhető igazolási és láthatósági szabálycsomagok;
- `engine`: pontozás, feloldások és csatakiértékelés tiszta függvényekkel;
- `persistence`: események olvasása/írása és migrációja;
- `projection`: újragenerálható játékos- és csapatpillanatképek képzése az eseménynaplókból;
- `sync`: kizárólag engedélyezett Git-műveletek;
- `verification`: cserélhető `self`, `peer`, `email` adapterek;
- `store`: Redux Toolkit session- és UI-slice-ok, valamint a fájlokból újraképzett normalizált vetület; nem perzisztens igazságforrás;
- `ui-map` és `ui-camp`: megjelenítés és interakció;
- `desktop-shell`: Electron Forge, Chromium, izolált preload IPC, helyi háttérfolyamat, macOS/Windows csomagolás, `content/app-release.yaml` alapú verziójelzés és kézi frissítés;
- `admin/authoring`: későbbi történetszerkesztő, nem szükséges az első MVP-hez.

## 10. Megvalósítási szakaszok

### 0. Koncepciópróba – papíron vagy kattintható vázlatban

- egyhetes mintatörténet;
- 8–12 valós feladat;
- egy térképi és egy tábori vázlat;
- kézzel számolt heti összecsapás;
- a három játékossal 30–45 perces közös próba.

**Kilépési feltétel:** érthető, hogy a valós feladat miként változtatja meg a játékot, és ezt a játékosok motiválónak érzik.

### 1. Függőleges prototípus

- Az első fejleszthető szelet sorrendben: kampányrepo kiválasztása → preflight → egy térképi hotspot → egy becsület alapú `one_off` feladat megnyitása és teljesítése → kis erőforrás-jutalmat rögzítő helyi append-only esemény → Sync dry-run.
- A renderer React + TypeScript + Vite és Redux Toolkit alapú, Node-hozzáférés nélkül fut; a repo- és fájlműveleteket allowlistes preload IPC-n kéri az Electron háttérfolyamattól.
- A preload allowlistje ebben a szeletben: `selectCampaignRepo`, `runPreflight`, `loadCampaign`, `appendPlayerEvent`, `previewSync` és `openReleasePage`; minden request és response futásidőben validált.
- A read-only diagnosztika már ebben a szeletben megmutatja a Git verzióját, a repo útvonalát, a remote/auth állapotot, a sémahibát és a javítási útmutatót. A remote/auth hiba csak a Syncet tiltja, a helyi mentést nem.
- A Sync dry-run megmutatja a stage-elendő fájlokat és a tervezett lépéseket, de nem módosítja a Git állapotát. A tényleges commit/push a következő inkrementum feladata.
- Kötelező tesztek: Vitest motor- és séma-unit tesztek, ideiglenes Git fixture-rel futó integrációs teszt, valamint Playwright Electron smoke teszt. A fejlesztői operációs rendszeren minden változásnál lefutnak; a macOS- és Windows-kapu a háromfős MVP kiadása előtt kötelező.
- A CI minden pushnál futtatja a unit- és Git-integrációs teszteket. A Playwright Electron smoke teszt macOS- és Windows-környezetben a `main` ágon és minden release előtt fut.
- A további prototípus egy hétre, egy játékosra, néhány feladatra, minimális térképi és tábori interakcióra, mérföldkő-eseményre és egyszerű arcade csatára bővíti ezt a szeletet.

**Az első szelet kilépési feltétele:** érvényes mintarepóval a hotspot–feladat–esemény út végigjárható, hibás repóval read-only diagnosztika jelenik meg, és mindhárom kötelező tesztréteg lefut.

**A prototípus szakasz kilépési feltétele:** a teljes kör végigjátszható az eligazítástól az eredményig.

### 2. Háromfős kooperatív MVP

- játékosonkénti mentés;
- közös állapot összesítése;
- React + TypeScript + Vite és Redux Toolkit felület, Electron Forge csomagban macOS és Windows rendszerre;
- külön telepített alkalmazás, amely helyi kampányrepót nyit meg és rendszer-Gitet használ;
- read-only diagnosztikai mód hibás Git- vagy repoállapotnál;
- biztonságos commit/push folyamat;
- heti tartalomcsere;
- csapattársi igazolás;
- GitHub Actions + Gmail IMAP alapú automatikus Reply All válaszlevél-verifikáció különleges feladatokhoz;
- játékos által konkretizálható és bejelenthető feladatkeret;
- napi 3–5 perces asztali és mobilbarát műveleti útvonal;
- szakaszzáró arcade csaták taktikai döntéssel és egy finálé;
- szinkron és aszinkron, valós teljesítésre épülő csatamanőverek;
- privát GitHub Releases kiadás jelzése és a kézi letöltési oldal megnyitása.

**Kilépési feltétel:** a három játékos egy teljes próbakampányt végig tud vinni elvesző adat és kézi Git-javítás nélkül.

### 3. Verifikációbővítés és kifinomítás

- további külső verifikációs adapterek;
- animációk, hang, hozzáférhetőség;
- jobb hibakezelés és mentés-visszaállítás;
- kampányeredmény és visszajátszható összefoglaló;
- tartalomkészítői ellenőrző eszköz.

## 11. Legfontosabb kockázatok

| Kockázat | Hatás | Korai ellenszer |
|---|---|---|
| A Git használata látható hibákat és konfliktust okoz | adatvesztés, lemorzsolódás | fájltulajdon, eseménynapló, automatikus validálás, visszaállítás |
| A pontozás kijátszható vagy igazságtalan | elvesző motiváció | világos rubrika, plafonok, csapatcélok, próbakampány |
| A gyengébben teljesítő játékos bűntudatot érez | csapatfeszültség | nincs rangsor, részvételbónusz, felzárkóztató események |
| A történet csak dekoráció | érdektelenség | valódi elágazások és erőforrás-specifikus következmények |
| Az e-mail nem bizonyítja a valódi teljesítést | hamis biztonság | feladatonként megfelelő verifikáció, egyszer használható kód |
| A külső címzett nem Reply All-lal válaszol | a valódi teljesítés függőben marad | egyértelmű levélsablon, státuszüzenet és új válasz kérése |
| A levelezőből nem választható le biztosan az új válaszrész | téves elfogadás vagy indokolatlan elutasítás | nem végleges `parse_error`, egyszerű új válasz kérése és auditálható kísérletek |
| A Gmail app password kiszivárog | a verifier-postafiók kompromittálódik | kizárólag erre használt fiók, 2FA, Actions Secret és naplóadat-minimalizálás |
| Az aláíratlan Electron-csomagot az OS gyanúsnak jelzi | telepítési bizonytalanság | csak három megbízható tesztelő, pontos telepítési útmutató, később kódaláírás |
| A workspace-monorepo túl sok csomaggal indul | lassabb első szelet, körkörös függőségek | kevés, egyirányú függésű csomag és közös futásidejű szerződések |
| Túl sok rendszer készül a játékélmény tesztje előtt | lassú indulás | egyhetes függőleges prototípus az infrastruktúra előtt |

## 12. Első interjú – rögzített döntések és értelmezések

1. A feladatok külső, hierarchikus curriculumból érkeznek.
2. A motor rögzített feladattípusokat ismer, amelyek a megjelenítést vezérlik.
3. Egyes curriculum-elemek feladatkeretek; ezeket a játékos konkretizálja és bejelenti.
4. A két csapattárs értesül az ilyen vállalásról, majd részt vesz a teljesítés ellenőrzésében.
5. Most az újrahasznosítható motor készül; konkrét próbahét-curriculumot később adunk hozzá.
6. A játék célzott napi használata 3–5 perc.
7. A sikertelenségi hatások feladatonként kombinálhatók: jutalomvesztés, hátrány és pótlás egyszerre is megjelenhet.
8. A fő élmény a térképi történet. A táborfejlesztés, gyűjtés és szakaszcsaták ezt építik fel.
9. Az első kampány 7 hetes.
10. Az elsődleges platform asztali böngésző, mobilbarát felülettel.
11. A felület mindhárom részletességi szintet támogatja: csapatösszegzés, játékos-hozzájárulás és konkrét feladatok. Az alapértelmezett láthatósági szabály még nyitott.
12. Az igazolás vegyes; e-mail csak különleges feladatokhoz kell.

## 13. Második interjú – rögzített döntések és értelmezések

1. A vállalás aktiválási és végső elfogadási szabálya konfigurációból töltődik be.
2. A feladattípusok pontos modelljét részletesebb magyarázat után újra eldöntjük.
3. A sikertelenségi következményeket a curriculum vezérli; a motor támogatja a pótfeladatot, fix levonást és más, előre definiált szankciókat.
4. A láthatóság konfigurálható.
5. Az első verzió reszponzív, de ténylegesen asztali használatra készül.
6. A curriculumot kezdetben kézzel szerkesztett YAML-fájl adja.
7. A történet elágazásait a teljesítési állapot és a közös döntések együtt vezérlik.
8. A szakaszzáró csata rövid arcade minijáték taktikai döntésekkel.
9. A kampány lazán ihletett, arcade jellegű alternatív történet.
10. Minden héten új tartalomfájl kerül a repóba.

## 14. Harmadik interjú – rögzített döntések és értelmezések

1. Az MVP egyetlen `taskType` enummal indul; a többtengelyes és bővíthető modellek a tervezett funkciók listájára kerülnek.
2. Öt adatbeviteli megjelenítő készül: készre jelölés, számláló, időtartam, ellenőrzőlista, valamint szöveges vagy linkes bizonyíték.
3. A feladatok névvel ellátott, újrahasznosítható szabálycsomagokra hivatkoznak.
4. A csaták közös foglalkozások: valós, időzített feladatok hajtják végre a képernyőn jelzett hadmozdulatokat.
5. A csapat a várható teljesíthetőség és a szükséges hadászati érték között választ kihívási szintet.
6. Szinkron és aszinkron csatafeladatok egyaránt lehetnek.
7. A közös történeti döntéseket 2/3-os többség hozza meg.
8. A heti előrehaladás naptári vagy teljesítésalapú működése konfigurálható.
9. A mentés azonnal helyben történik, a Git-műveleteket külön **Szinkronizálás** gomb indítja.
10. Az MVP közös Git-ágat és játékosonként elkülönített fájlokat használ.
11. Az append-only eseménynapló az igazságforrás; a pillanatkép újragenerálható.
12. A helyi játékost a Git felhasználónév vagy e-mail alapján azonosítjuk.

## 15. Negyedik interjú – rögzített döntések és értelmezések

1. Az MVP mind a tíz tervezett `taskType` értékkel indul.
2. A `taskType` rögzíti a működést; a `policyRef` csak az igazolást és láthatóságot adja.
3. Az `evidence` rövid szöveget vagy URL-t fogad el.
4. A policy örökölhető, és a feladat az igazolási/láthatósági névtéren belül felülírhatja az örökölt mezőket.
5. Egy csata szinkron és aszinkron fázisokat is tartalmazhat.
6. A curriculum három nehézséget ír: biztos, merész és vakmerő.
7. A curriculum manőverenként egyéni vagy csapatos végrehajtást választ.
8. A curriculum manőverenként bináris vagy részleges eredményt választ.
9. Fizikai alternatíva csak akkor kötelező, ha a curriculum készítője előírja.
10. A 2/3-os szavazás két egyező szavazatnál azonnal lezárul.
11. A `campaign.yaml` explicit Git-identitás → `playerId` megfeleltetést tartalmaz.
12. Az eseménynaplók játékosonként és hetenként külön JSONL-fájlok.

## 16. Ötödik interjú – rögzített döntések és értelmezések

1. Az összetett feladat rövid belső feladatot beágyazhat, újrahasznált feladatra pedig ID-val hivatkozhat.
2. A policy-öröklés egyszintű: egy policy legfeljebb egy, tovább már nem öröklő közvetlen szülőt jelölhet.
3. A szinkron csatafázist egy host gép mutatja és rögzíti; a társak fizikailag vesznek részt.
4. A csata fix részei: eligazítás, manőverek és kiértékelés.
5. A curriculum fokozatonként megírja a feladatot, a motor egységes nehézségszorzót alkalmaz.
6. Fizikai kihívásnál kötelező az intenzitás, eszközigény és rövid figyelmeztetés.
7. A `campaign.yaml` definiálja az erőforrásokat és megjelenítésüket.
8. A hétköznapi feladat közvetlen erőforrást és elkölthető általános pontot is adhat.
9. A táborfejlesztés vizuális változást és curriculumvezérelt mechanikai bónuszt is ad.
10. A történet elvesztett csata után is továbbhalad egy kedvezőtlenebb ágon.
11. A Szinkronizálás csak engedélyezett játékfájlokat commitol; más változást érintetlenül hagy.
12. Használatba vett heti fájl változtathatatlan; javítása új verzióazonosítót kap.
13. Két heti előrehaladási policy készül: `calendar` és `completion_gate`.

## 17. Hatodik interjú – rögzített döntések és értelmezések

1. A `taskRef` paraméterezett sablonra mutat, amely kötelező bemeneteket deklarál.
2. A host rögzíti a csataeredményt; minden érintett játékos külön megerősíti a saját teljesítését.
3. A három fokozatszorzót a `campaign.yaml` egyszer definiálja az egész kampányra.
4. Részleges csatasiker: teljesítési arány × fokozatszorzó × alapérték.
5. Személyes és közös pontkészlet egyaránt létezik.
6. Pont táborfejlesztésre és csata előtti bónuszra költhető.
7. Az erőforrás negatív minimuma és felső korlátja szabadon konfigurálható.
8. A táborfejlesztés hatása lehet tartós vagy időszakos.
9. A fejlesztés halmozódása `additive`, `strongest_only` vagy `non_stackable`.
10. A fizikai intenzitás enumja `low`, `moderate`, `high`.
11. A tartalomverziót olvasható ID és automatikus hash együtt azonosítja.
12. Határidőnél a később verifikált helyi eseményidő számít.
13. Másik játékos közbeeső push-a esetén a szinkronizálás háttérben addig próbálkozik újra, amíg sikerül.

## 18. Hetedik interjú – rögzített döntések és értelmezések

1. A sablonparaméterek JSON Schema-részhalmaza primitíveket, időtartamot, enumot, URL-t és tömböt támogat.
2. A `taskRef` használati helye csak deklarált `params` értékeket adhat át.
3. A csatában a résztvevők önmegerősítése elegendő; külön megfigyelői jóváhagyás nem kell.
4. A fokozatszorzókra csak szám típusú sémafeltétel vonatkozik.
5. A részleges hadászati hatást a legközelebbi egészre kerekítjük.
6. Minden feladat külön `personalPoints` és `teamPoints` mezőt ad meg.
7. Közös pont elköltéséhez 2/3-os szavazás kell.
8. A csatabónusz pontjai foglaláskor zárolódnak és törléskor automatikusan visszajárnak.
9. Erőforrásonként `clamp`, `convert` vagy `overflow_event` határkezelés választható.
10. Időszakos fejlesztés dátum, hét, csata vagy felhasználásszám alapján járhat le.
11. A curriculum külön `verificationDeadline` értéket adhat.
12. Csak az átmeneti Git-versenyhelyzet próbálható korlátlanul újra; tartós hibánál a szinkron megáll és jelez.
13. Az automatikus e-mail-verifikáció a háromfős MVP része.

## 19. Nyolcadik interjú – rögzített döntések és értelmezések

1. A sablonparaméterek az alapkorlátokon túl `minLength`, `maxLength`, `pattern`, `minItems` és `maxItems` korlátot támogatnak.
2. A tömbparaméter rekurzívan egymásba ágyazott tömböt és objektumot is tartalmazhat.
3. A személyes pontot a tulajdonosa önállóan költheti el.
4. A `campaign.yaml` az erőforrás határkezelési részletei helyett újrahasznosítható `overflowPolicyRef` értéket ad.
5. **Ekkori munkahipotézis, később felülírva:** az e-mailes igazolás a verifierhez beérkező levél engedélyezett feladóját és tokenjét ellenőrzi. A kilencedik körben a külső címzett válaszlevele lett a bizonyíték.
6. Az egyszer használható token a tárgyban vagy a levéltörzsben szerepelhet.
7. A `campaign.yaml` játékosrekordja külön `allowedEmail` listát tartalmaz.
8. A verifier futtatási helyének fő követelménye az ingyenesség és az egyszerű üzemeltetés; a konkrét megoldás még nyitott.
9. Elég, ha az e-mailes igazolás eredménye a következő kézi Szinkronizáláskor jelenik meg.
10. Központi futtatás esetén a titok az adott szolgáltatás titokkezelőjébe kerül; helyi tárolás csak helyi verifier választásakor jöhet szóba.
11. A webes UI hordozható, de a csomagolt alkalmazás és a Git-integráció miatt az OS-támogatás nem automatikus; a célrendszereket külön ki kell választani és tesztelni.
12. Az MVP saját indítóval rendelkező, csomagolt asztali alkalmazás.
13. A megjelenítő motort csak az aktuális Chrome/Chromium verzióval teszteljük hivatalosan.
14. A „legegyszerűbb” térkép- és tábor-megoldást SVG + HTML/CSS kombinációként értelmezzük; canvas csak a csatákhoz kerül be, ha szükséges.

## 20. Kilencedik interjú – rögzített döntések és értelmezések

1. Az e-mailes bizonyíték a valódi külső címzett válaszlevele.
2. A verifier az egyszer használható token mellett a curriculum által megadott szövegmintát is ellenőrzi.
3. Nincs használható saját domain.
4. Mind a GitHub Actions, mind a Cloudflare rendelkezik ingyenes lehetőséggel, de saját domain hiányában az MVP a GitHub Actions irányt választja.
5. A verifier repóra korlátozott GitHub-jogosultsággal ír igazolási rekordot.
6. Az MVP motorja, kampánytartalma és személyes játékadatai egyetlen privát repóban maradnak.
7. Az `allowedEmail` lista olvashatóan szerepel a privát `campaign.yaml` fájlban.
8. Az objektumparaméter csak deklarált `properties` mezőket fogad el; ismeretlen mezőt nem.
9. A motor globális plafonja öt beágyazási szint, tömbönként száz elem és szövegenként tízezer karakter.
10. Az asztali alkalmazást Electron csomagolja, beépített Chromiummal.
11. Az MVP-t macOS és Windows rendszerre csomagoljuk és teszteljük.
12. A külön telepített alkalmazás a játékos által kiválasztott helyi kampányrepót nyitja meg.
13. Az alkalmazás a gépen telepített rendszer-Gitet hívja.
14. Az alkalmazás jelzi az új verziót, de csak felhasználói jóváhagyással frissít.
15. Az MVP-hez nem tartozik külön akadálymentességi követelménycsomag.

## 21. Tizedik interjú – rögzített döntések és értelmezések

1. A játékos látható CC-ként hozzáadja a verifiert, a külső címzettnek pedig Reply All-lal kell válaszolnia.
2. Reply All hiányában a feladat függőben marad, és a felület új Reply All választ kér.
3. A válasz `From` címe pontosan egyezik az eredeti `To` címmel.
4. A token a tárgyban vagy a teljes szöveges válaszban, az idézett előzménnyel együtt kereshető.
5. A curriculum szövegmintája csak a normalizált új válaszrészben vizsgálható.
6. A szövegminta kis- és nagybetűt nem érzékelő kötelező kifejezések listája.
7. A verifier külön erre létrehozott Gmail-fiókot használ.
8. A GitHub Actions IMAP-on, külön Gmail app passworddel fér hozzá ehhez a fiókhoz.
9. A verifier workflow-t `verification-request` fájl útvonalszűrt push-a indítja.
10. A Szinkronizálás legfeljebb 90 másodpercig figyeli az eredményt, majd függő állapotot mutat.
11. Minden automatikus igazolás tokenenként külön, változtathatatlan JSON-fájl.
12. A webes felület React + TypeScript + Vite alapú.
13. Az Electron-csomagolást Electron Forge végzi.
14. Az MVP csak jelzi az új verziót és megnyitja a letöltést; a telepítés kézi.
15. Az első macOS- és Windows-csomagok aláíratlan privát GitHub Releases kiadások.
16. Hibás vagy hiányzó Git/repo esetén az alkalmazás read-only módban megnyílik, de a mentést és a Szinkronizálást blokkolja.

## 22. Tizenegyedik interjú – rögzített döntések és értelmezések

1. Az e-mail-címekből a tényleges címet nyerjük ki, majd trim és kisbetűsítés után hasonlítjuk össze; aliasátírás nincs.
2. Egy igazolható feladatnak pontosan egy külső `To` címzettje lehet.
3. Bizonytalan válaszleválasztásnál a feladat nem véglegesen utasítódik el, hanem `parse_error` jelzésű függő állapotba kerül, és egyszerű új választ kér.
4. Az új válaszrészt HTML `blockquote` és ismert idézetjelölők alapján választjuk le; bizonytalan esetben `parse_error` keletkezik.
5. Minden kötelező kifejezésnek részsztringként kell szerepelnie Unicode-normalizálás és whitespace-összevonás után; az összevetés nem kis- és nagybetűérzékeny.
6. Az egyszer használható token 128 bites véletlen érték, csoportosított Base32 megjelenítéssel.
7. Új token kiadásakor a régi visszavonódik, új request és audit-esemény készül.
8. A verification request, eredmény és esemény változtathatatlan; az aktuális státusz ezekből képzett vetület.
9. Csak a `verified` és `rejected` végleges állapot; a `pending` és `parse_error` nem végleges.
10. Egy workflow átmeneti hibánál legfeljebb három automatikus próbálkozást végez, majd megáll.
11. Függő kérésnél minden későbbi Szinkronizálás új, változtathatatlan `verification-attempt` fájllal indít új ellenőrzést.
12. Az alkalmazásverzió és a release URL verziókezelt `content/app-release.yaml` fájlból olvasható.
13. A React alkalmazás állapotkezelője Redux Toolkit.
14. Az Electron renderer `contextIsolation` mellett, Node-hozzáférés nélkül fut, és csak allowlistes preload IPC-t használ.
15. A read-only diagnosztika Git-verziót, repoútvonalat, remote/auth állapotot, sémahibát és javítási útmutatót mutat.
16. Az első fejleszthető függőleges szelet: repo kiválasztás, preflight, egy hotspot, egy feladat, helyi esemény és Sync stub.
17. Az első szelet kötelező tesztjei: motor- és séma-unit tesztek, Git-integrációs teszt és Electron smoke teszt.

## 23. Tizenkettedik interjú – rögzített döntések és értelmezések

1. A verification-életciklust külön immutable request, attempt és verification-event fájlok tárolják; az aktuális státusz vetület.
2. A fájlnév `requestId` értéket használ. A nyers token csak a privát requestben, az eredményekben és eseményekben csak hashként szerepel.
3. Az e-mail-token a feladat `verificationDeadline` értékéig érvényes.
4. A request csak token-visszavonáskor vagy a határidő eredménytelen lejártakor válik végleg `rejected` állapotúvá.
5. `parse_error` után ugyanaz a token a határidőig tovább használható; egy későbbi érvényes válasz igazolhat.
6. A feldolgozott levél idempotenciakulcsa a `Message-ID`, ennek hiányában a normalizált tartalom lenyomata.
7. Szinkronizáláskor az aktuális játékos minden lejáratlan, nem végleges requestjéhez készülhet új attempt.
8. Két attempt között kérésenként legalább öt perc telik el, és az előzőnek le kell zárulnia vagy timeoutosnak kell lennie.
9. A `content/app-release.yaml` Semver `appVersion`, `releaseUrl` és támogatott `campaignSchema`-tartomány mezőket tartalmaz.
10. A Redux store session- és UI-állapotot, valamint a fájlokból újraképzett normalizált vetületet tart; nem igazságforrás.
11. A forrás az első naptól workspace-monorepo, külön package-ekkel.
12. Az első preload IPC allowlist: `selectCampaignRepo`, `runPreflight`, `loadCampaign`, `appendPlayerEvent`, `previewSync`, `openReleasePage`.
13. Az IPC request és response oldalát megosztott futásidejű sémák validálják, stabil hibakódokkal.
14. Hiányzó Git vagy repo, hibás séma és nem azonosítható játékos read-only módot okoz; remote/auth hiba csak a Syncet tiltja.
15. Az alkalmazás helyi beállításban megjegyzi a kampányrepo útvonalát, induláskor ellenőrzi, és menüből engedi váltani.
16. A Sync stub dry-run: megmutatja a stage-elendő fájlokat és tervezett lépéseket, de nem módosít Git-állapotot.
17. Az első hotspot egy becsület alapú `one_off` „Kész” feladatot nyit meg, kis erőforrás-jutalommal.
18. Az első szelet teszteszközei Vitest, ideiglenes Git fixture és Playwright Electron; a fejlesztői OS-en minden változásnál, macOS-en és Windowson az MVP-kapu előtt futnak.

## 24. Tizenharmadik interjú – rögzített döntések és értelmezések

1. A monorepo `pnpm` workspaces megoldást használ, külön orchestrator nélkül.
2. Az induló workspace: `apps/desktop`, `packages/core`, `packages/contracts`, `packages/persistence`, `packages/git-sync` és `packages/email-verifier`.
3. A megosztott futásidejű sémákat TypeBox írja le, Ajv validálja.
4. Az IPC-válasz `{ ok: true, data }` vagy `{ ok: false, error: { code, message, details, recoverable } }` formájú.
5. Minden generált `requestId`, `attemptId` és `eventId` UUID v4.
6. Az esemény időpontja ISO 8601 UTC `occurredAt`, külön `timezoneOffsetMinutes` értékkel.
7. A játékesemény kötelező borítéka: `schemaVersion`, `eventId`, `eventType`, `occurredAt`, `timezoneOffsetMinutes`, `actorId`, `campaignId`, `weekId`, `contentVersion`, `contentHash`, `payload`.
8. A JSONL-írás menete: validálás, folyamaton belüli sor, egy UTF-8 sor appendje, `fsync`, majd visszaigazolás.
9. A párhuzamos helyi írást Electron single-instance lock és az app `userData` könyvtárában tartott repónkénti lock akadályozza meg.
10. Idegen, követett Git-módosításnál a helyi mentés aktív marad, de a Sync megáll; az alkalmazás nem stash-el és nem módosít idegen fájlt.
11. Push-versenynél megszakítható, exponenciális 1–2–4 másodperces visszavárás működik, legfeljebb 30 másodperces várakozással; permanens hibánál stop.
12. A Sync dry-run engedélyezett fájllistát, validációt, fetch/rebase szükségességet, commitüzenetet, push-célt és blokkolókat ad vissza.
13. A remote/auth ellenőrzés indulás után aszinkron, majd minden Sync előtt megismétlődik.
14. Az `openReleasePage` csak a konfigurált repository HTTPS GitHub Releases URL-jét nyithatja meg.
15. Az app-beállítások a titokmentes `userData/settings.json` fájlban vannak, temporális fájllal és atomi cserével írva.
16. Az első `one_off` esemény `taskId` és `contentVersion`/`contentHash` alapján azonosítja a teljesítést; a jutalmat a motor képezi le.
17. A unit- és Git-integrációs tesztek minden pushnál futnak; a macOS/Windows Electron smoke tesztek a `main` ágon és release előtt.
18. A következő lépés egy kattintható játékfelület-wireframe, nem még a workspace scaffold.

## 25. A kattintható játékfelület-wireframe célja

A repóban tárolt, önállóan megnyitható változat: [cynoscephalae-game-wireframe.html](visualizations/cynoscephalae-game-wireframe.html). A szerkeszthető fragmentum és az interjúfelület a [vizualizációs indexből](visualizations/README.md) érhető el.

A wireframe a technikai implementáció előtt a legfontosabb játékosi útvonalat teszi kipróbálhatóvá:

1. térképi és tábori főnézet közötti váltás;
2. rámutatásra és aktiválásra reagáló hotspotok;
3. egy becsület alapú `one_off` feladat megnyitása és készre jelölése;
4. az erőforrás-jutalom azonnali visszajelzése;
5. tábori státusz- és csapathozzájárulás-nézet;
6. Sync dry-run megnyitása a tervezett fájlokkal, Git-lépésekkel és blokkolókkal.

A wireframe nem végleges grafika és nem ír valódi fájlt vagy Git-állapotot. Elsődleges kérdése, hogy a térkép–feladat–jutalom–tábor–Sync útvonal érthető-e, és valóban beleférhet-e a napi 3–5 perces használatba.
