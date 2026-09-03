# Tervezett funkciók

> Élő backlog azokról az irányokról, amelyeket tudatosan nem építünk be az első MVP-be. Egy elem itteni szereplése nem jelent automatikus vállalást; a próbakampány tapasztalatai alapján kerülhet be a roadmapbe.

## Státuszok

- **Következő:** az MVP után várhatóan hasznos, már körvonalazott fejlesztés.
- **Később:** értékes lehet, de előbb használati tapasztalat vagy más komponens szükséges.
- **Kutatandó:** az előnye, költsége vagy pontos felhasználási esete még bizonytalan.

## Feladat- és curriculumrendszer

### További `taskType` értékek

- **Státusz:** Következő
- **Lényege:** az MVP tíz típusán túl új, konkrét viselkedési minták felvétele a zárt enumba.
- **Első készlet:** `one_off`, `quantity`, `duration`, `checklist`, `evidence`, `habit`, `team_challenge`, `battle_action`, `timed_challenge`, `recovery_task`.
- **Felvételi szabály:** új típus csak valós curriculum-igény és dokumentált életciklus alapján kerüljön a motorba.

### Többtengelyes feladatmodell

- **Státusz:** Később
- **Lényege:** az MVP egyetlen `taskType` enumját külön `inputKind`, `schedule`, `scope`, `assignmentMode`, `activationPolicy`, `completionPolicy`, `visibility` és `onFailure` tengelyekre bontani.
- **Miért:** új kombinációk készülhetnének új, összetett enumérték hozzáadása nélkül.
- **Belépési feltétel:** az MVP-ben legalább két olyan új feladattípus-igény jelenik meg, amely főként meglévő viselkedések új kombinációja.

### Többszintű vagy többszülős policy-öröklés

- **Státusz:** Kutatandó
- **Lényege:** az MVP egyszintű, egyetlen szülőt engedő policy-modelljének bővítése hosszabb láncokra vagy több szülő összeolvasztására.
- **Belépési feltétel:** a valós policy-k között ismétlődő, két szinten már nem kifejezhető szerkezet jelenik meg.
- **Kockázat:** nehezebben követhető felülírási sorrend és rejtett konfigurációs hibák.

### Bővíthető megjelenítőmodulok

- **Státusz:** Kutatandó
- **Lényege:** a beépített öt adatbeviteli megjelenítő mellé regisztrálható új renderer.
- **Miért:** speciális feladatok megjelenítése a motor magjának módosítása nélkül.
- **Kockázat:** a futtatható bővítmények rontják a YAML-alapú tartalom biztonságát és hordozhatóságát.

### Vizuális curriculum-szerkesztő

- **Státusz:** Később
- **Lényege:** űrlapos felület a feladathierarchia, szabálycsomagok és heti történet szerkesztéséhez.
- **Előfeltétel:** a kézzel szerkesztett YAML sémája stabilizálódjon több valódi tartalomfájl után.

### További bizonyítéktípusok

- **Státusz:** Később
- **Lehetőségek:** fájl- vagy képfeltöltés, külső szolgáltatásból érkező aktivitás, strukturált mérési adat.
- **Korlát:** érzékeny vagy nagy méretű bizonyíték ne kerüljön közvetlenül a Git-re.

## Szinkron és platform

### Motor- és kampányrepo szétválasztása

- **Státusz:** Következő
- **Lényege:** a jelenlegi egyetlen privát MVP-repó helyett a motor külön, akár nyilvános repóba, a személyes kampányadat pedig privát repóba kerül.
- **Előfeltétel:** az alkalmazás és a kampányfájlok közötti verziókompatibilitás stabil kezelése.

### Linux-csomag és további platformok

- **Státusz:** Később
- **Lényege:** a macOS- és Windows-MVP után Electron-csomag és integrációs tesztek Linuxra.
- **Előfeltétel:** tényleges játékosi igény és a rendszer-Git integráció platformtesztje.

### Beépített Git-megoldás

- **Státusz:** Kutatandó
- **Lényege:** a rendszer-Git előfeltételének kiváltása JavaScript Git-könyvtárral vagy csomagolt Git binárissal.
- **Belépési feltétel:** a Git telepítése vagy hitelesítése akadályozza az MVP játékosait.

### Aláírt csomagok és beépített frissítő

- **Státusz:** Következő
- **Lényege:** macOS-notarizáció, Windows-kódaláírás, valamint jóváhagyás után letöltő és telepítő Electron updater.
- **MVP-helyzet:** az első három játékos aláíratlan privát GitHub Releases csomagot tölt le és kézzel telepít; az alkalmazás csak értesít és megnyitja a kiadási oldalt.
- **Belépési feltétel:** a próba túlmutat a három megbízható játékoson, vagy a kézi frissítés rendszeres hibát okoz.

### Játékosonkénti Git-ág

- **Státusz:** Következő
- **Lényege:** minden játékos saját ágra pushol, egy automatizált workflow ellenőrzi és összesíti az eseményeket.
- **Miért:** tovább csökkenti a közös ág push-versenyeit.
- **Belépési feltétel:** a közös ág és külön játékosfájlok a próbakampányban rendszeres konfliktust okoznak.

### Központi szinkronszolgáltatás

- **Státusz:** Később
- **Lényege:** a kliensek helyett egy kis szolgáltatás kezeli az írást, összesítést és GitHub-szinkront.
- **Miért:** egyszerűbb mobilhasználat és közel valós idejű közös állapot.
- **Költség:** hosztolás, hitelesítés és üzemeltetés jelenik meg.

### Automatikus, csoportosított szinkron

- **Státusz:** Később
- **Lényege:** a helyi mentések kézi gomb nélkül, biztonságos kötegekben szinkronizálódnak.
- **Előfeltétel:** kiforrott konfliktuskezelés és egyértelmű hálózati hibajelzés.

### Teljes mobilos működés

- **Státusz:** Később
- **Lényege:** napi feladatok, jóváhagyás és szinkron teljes használata mobilról.
- **Előfeltétel:** központi szinkronszolgáltatás vagy más, mobilról is használható perzisztencia.

## Verifikáció és értesítés

### Automatikus e-mail-verifikáció

- **Státusz:** MVP-be átkerült a hetedik interjúban
- **Lényege:** az `allowedEmail` címről pontosan egy külső címzettnek küldött, verifier-CC-t tartalmazó levélre érkező Reply All válasz; 128 bites Base32 token, normalizált címösszevetés és a megbízhatóan leválasztott új válaszrészben keresett kötelező curriculum-kifejezések.
- **Korlát:** a levéltörzs és melléklet nem kerülhet a repóba.
- **MVP-megvalósítás:** requestId-val elnevezett immutable request, attempt és verification-event fájlok; a nyers token csak a privát requestben, az eseményekben csak a hash. Az útvonalszűrt GitHub Actions futásonként legfeljebb háromszor próbálkozik, dedikált Gmail-fiókot és IMAP app passwordöt használ. A kliens 90 másodpercig figyel, majd az aktuális játékos lejáratlan kéréseit legkorábban öt perc után új attempttel ellenőrizheti ismét.
- **Későbbi alternatíva:** saját domain beszerzése után Cloudflare Email Worker.
- **Megjegyzés:** már nem backlogelem; itt a döntés eredetének nyomon követése miatt marad meg.

### OAuth-alapú verifier-postafiók

- **Státusz:** Következő
- **Lényege:** az MVP Gmail app password hozzáférésének lecserélése OAuth-alapú, visszavonható és szűkebb jogosultságú postafiók-hozzáférésre.
- **Belépési feltétel:** a háromfős próba után is megmarad az e-mail-verifier, vagy a titokkezelés kockázata indokolja a bővítést.

## Megjelenítés és hozzáférhetőség

### Hozzáférhetőségi alapcsomag

- **Státusz:** Következő
- **Lényege:** teljes billentyűzetes használat, látható fókusz, reduced-motion mód, némítás és célzott hozzáférhetőségi tesztek.
- **Megjegyzés:** a kilencedik interjú alapján ez nem MVP-kilépési feltétel.

### Játékon kívüli értesítések

- **Státusz:** Kutatandó
- **Lehetőségek:** e-mail, böngészőértesítés vagy más üzenetküldő csatorna új vállalásról, ellenőrzési kérésről és közelgő csatáról.
- **Kérdés:** valóban növeli-e a részvételt, vagy csak zajt teremt.

## Csaták és kooperáció

### Rugalmas csatafázisok és csatasablonok

- **Státusz:** Később
- **Lényege:** a fix eligazítás–manőverek–kiértékelés szerkezet helyett tetszőleges fázislista vagy névvel ellátott csatasablonok.
- **Belépési feltétel:** legalább két olyan csatadizájn készül, amelyet a fix háromrészes szerkezet érdemben akadályoz.

### Valós idejű, többgépes csata

- **Státusz:** Később
- **Lényege:** mindhárom játékos ugyanabban a pillanatban látja a csata állapotát és ad parancsot.
- **Előfeltétel:** központi szolgáltatás vagy valós idejű kommunikációs réteg.

### További csatafeladat-családok

- **Státusz:** Következő
- **Példák:** fizikai kihívás, memóriafeladat, gyors közös döntés, kreatív vagy kommunikációs manőver.
- **Cél:** a csata ne csak sportos játékosoknak legyen élvezhető.

### Összetettebb kockázat–jutalom rendszer

- **Státusz:** Kutatandó
- **Lényege:** dinamikus nehézség, részleges siker, egymásra épülő hadmozdulatok és felderítésből származó információelőny.
- **Belépési feltétel:** az egyszerű kihívási szintek már stabilan működnek és érthetők.

## Kampányidőzítés

### Hibrid heti előrehaladás

- **Státusz:** Később
- **Lényege:** a `calendar` és `completion_gate` mellett türelmi időt és korlátozott felzárkózást kombináló policy.
- **Belépési feltétel:** a próbakampányban egyik MVP-policy sem kezeli jól a csapat tényleges ritmusát.

## Karbantartási szabály

Minden új ötletnél rögzíteni kell a felhasználói értéket, az előfeltételt, a fő kockázatot és azt, hogy mi alapján léptethető előrébb. Az MVP hatókörébe csak külön döntéssel kerülhet át elem.
