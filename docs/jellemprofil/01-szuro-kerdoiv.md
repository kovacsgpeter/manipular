# Jellemprofil – 1. kör: szűrő kérdőív

> Célcsoport: hívő kitöltők. Időigény: 12–15 perc. 66 állítás (60 mérő + 6 kontroll).
> Az eredmény egy 6 tengelyes, kétrétegű (érett / torzult) radar, valamint a 2. körbe (mélyfúrás) kerülő 6–8 pár kijelölése.

## 1. A mért szerkezet

A 30 érett jellemvonás mindegyikét és torzult párját külön mérjük: a torzult forma az érett vonás túlhajtott vagy sérült változata, nem a hiánya. Valakiben mindkettő lehet erős vagy gyenge.

| Tengely | Kód | Irány | Értelmezés | Párok (1–5) |
|---|---|---|---|---|
| Előre | ELO | Előre | Elindít, vállal, áttör és teret nyer. | 1 Kezdeményezés / Impulzivitás · 2 Bátorság / Vakmerőség · 3 Hódítás / Agresszió vagy uralkodás · 4 Határozottság / Erőszakosság · 5 Ambíció / Törtetés |
| Hátra | HAT | Hátra | Megtart, véd, kitart és uralkodik önmagán. | 1 Kitartás / Makacsság · 2 Védelem / Kontrollálás · 3 Türelem / Passzivitás · 4 Önuralom / Elfojtás · 5 Hűség / Változásképtelenség |
| Oldalra | OLD | Oldalra | Új nézőpontot, kapcsolatot vagy kerülőutat talál. | 1 Rugalmasság / Megalkuvás · 2 Kreativitás / Szabálykerülés · 3 Bölcs kerülőút / Menekülés · 4 Diplomácia / Manipuláció · 5 Alkalmazkodás / Elvtelenség |
| Istenhez igazodás | IST | Felfelé | Hit, ima és engedelmesség. | 1 Engedelmesség / Vak engedelmesség vagy legalizmus · 2 Hit / Valóságtagadás · 3 Imádság / Passzív várakozás · 4 Istenfélelem / Emberektől vagy büntetéstől való félelem · 5 Alázat / Önleértékelés |
| Elhívás | ELH | Felfelé | Magasabb cél, jövőkép és elhívás felismerése. | 1 Jövőkép / Nagyzolás · 2 Elhívástudat / Messiáskomplexus · 3 Reménység / Ábrándozás · 4 Céltudatosság / Megszállottság · 5 Küldetéstudat / Önigazolás |
| Mások felemelése | FEL | Felfelé | Mások felemelése, vezetése és felhatalmazása. | 1 Bátorítás / Hízelgés · 2 Szolgáló vezetés / Atyáskodó kontroll · 3 Inspirálás / Érzelmi manipuláció · 4 Tanítás / Kioktatás · 5 Felhatalmazás / Felelősség áthárítása |

A radaron a Felfelé irány három szomszédos tengelyként (IST, ELH, FEL), egy színcsaládban jelenik meg.

**Itemkódok:** `TENGELY-párÉ` az érett, `TENGELY-párT` a torzult állítás (pl. `HAT-4T` = Elfojtás). `K1–K6` a kontrollállítások.

### Egymáshoz közeli torzulások

Ezeket az állítások tudatosan különválasztják, hogy a tengelyek ne mosódjanak össze:

- **Manipuláció (OLD-4T) ↔ Érzelmi manipuláció (FEL-3T):** információ elhallgatása/kiszínezése tárgyalásban ↔ érzelmek (bűntudat, félelem) keltése.
- **Kontrollálás (HAT-2T) ↔ Atyáskodó kontroll (FEL-2T):** aggodalomból mindent a kézben tartani ↔ a rábízott ember helyett dönteni.
- **Agresszió vagy uralkodás (ELO-3T) ↔ Erőszakosság (ELO-4T):** teret szerezni mások rovására ↔ a döntést másokra kényszeríteni.
- **Passzivitás (HAT-3T) ↔ Passzív várakozás (IST-3T):** halogatás ↔ lelki indoklású tétlenség.

## 2. Kitöltési útmutató (a kitöltőnek)

> Az alábbi állítások a mindennapi viselkedésedről szólnak. Nincs jó vagy rossz válasz, és senki sem tökéletes: a kérdőív akkor segít, ha őszintén azt jelölöd, ami **az elmúlt fél évben** jellemző volt rád, nem azt, amilyen szeretnél lenni. Ne gondolkodj sokat egy-egy állításon, az első benyomás a legpontosabb.
>
> **1** – egyáltalán nem jellemző rám · **2** – kevéssé jellemző · **3** – részben jellemző · **4** – nagyrészt jellemző · **5** – teljesen jellemző rám

## 3. A kérdőív (a megjelenítés sorrendjében)

A sorrend szándékos: a tengelyek váltakoznak, érett és torzult állítás felváltva jön, egy pár két állítása között pedig kb. 30 tétel van. Megjelenítéskor az itemkód nem látszik.

Kitöltés: [kitolto.html](kitolto.html). Az alábbi táblázat a [kerdesbank.json](kerdesbank.json) fájlból generálódik (`node docs/jellemprofil/build.mjs`), ezért a szövegeket ott kell szerkeszteni.

<!-- BEGIN generated: round1-table -->
| # | Kód | Állítás |
|---|---|---|
| 1 | ELO-1É | Ha látom, hogy valamit el kellene kezdeni, nem várok másra, hanem elindítom. |
| 2 | HAT-1T | Nehezen engedek el egy elképzelést akkor is, ha a körülmények vagy mások érvei már egyértelműen mást mutatnak. |
| 3 | OLD-1É | Ha egy terv nem működik, gyorsan át tudok állni egy másik megoldásra. |
| 4 | IST-1T | Ha egy lelki vezető vagy egyházi szabály valamit előír, akkor is követem, ha a lelkiismeretem vagy a józan eszem mást mond. |
| 5 | ELH-1É | Világos képem van arról, merre szeretnék haladni az életemben a következő években. |
| 6 | FEL-1T | Előfordul, hogy azért dicsérek meg valakit, hogy jó benyomást keltsek, vagy elérjek nála valamit. |
| 7 | ELO-2É | Kiállok egy fontos ügy mellett akkor is, ha ez kényelmetlenséggel vagy kockázattal jár számomra. |
| 8 | HAT-2T | Amikor aggódom valami miatt, igyekszem mindent és mindenkit a saját kezemben tartani. |
| 9 | OLD-2É | Elakadt helyzetben gyakran találok új, szokatlan megoldást. |
| 10 | IST-2T | Előfordul, hogy egy nyilvánvaló problémával (egészség, pénz, kapcsolat) azért nem foglalkozom, mert „Isten majd megoldja”. |
| 11 | ELH-2É | Tudom, mire hívott el Isten, és ez irányt ad a döntéseimnek. |
| 12 | FEL-2T | Ha valakiért felelős vagyok, nehezen hagyom, hogy maga döntsön, mert úgy érzem, én jobban tudom, mi jó neki. |
| 13 | K1 | Soha nem voltam még irigy senkire. |
| 14 | ELO-3É | Szívesen lépek be új területre (munkában, kapcsolatokban, szolgálatban), és ott teret nyerek. |
| 15 | HAT-3T | Előfordul, hogy nálam a „türelem” valójában azt jelenti, hogy halogatom a szükséges lépést. |
| 16 | OLD-3É | Felismerem, ha egy akadályon nem átmenni kell, hanem okosan megkerülni. |
| 17 | IST-3T | Előfordul, hogy imádkozom valamiért, de a rám eső lépést nem teszem meg, mert várom, hogy magától rendeződjön. |
| 18 | ELH-3É | Nehéz időszakban is reménnyel nézek előre, és ez segít cselekedni. |
| 19 | FEL-3T | Ha el akarok érni valamit, előfordul, hogy bűntudatot, félelmet vagy túlzott lelkesedést keltek másokban. |
| 20 | ELO-4É | Ha meghoztam egy döntést, egyértelműen képviselem, és nem inogok meg minden ellenvetésnél. |
| 21 | HAT-4T | A negatív érzéseimet (harag, szomorúság, csalódás) inkább magamba fojtom, mint hogy kimondjam vagy feldolgozzam. |
| 22 | OLD-4É | Ellentétes felek között is meg tudom találni azt a hangot és megoldást, amelyet mindenki elfogad. |
| 23 | IST-4T | A hitéletemet gyakran inkább a büntetéstől vagy mások ítéletétől való félelem mozgatja, mint a szeretet. |
| 24 | ELH-4É | A céljaim felé haladva tudatosan választom meg, mire mondok igent és mire nemet. |
| 25 | FEL-4T | Előfordul, hogy akkor is magyarázni kezdek, amikor senki sem kérdezte, vagy a másik már érti. |
| 26 | ELO-5É | Vannak nagy céljaim, és kész vagyok sokat dolgozni az elérésükért. |
| 27 | HAT-5T | Akkor is ragaszkodom a megszokott formákhoz, szerepekhez, amikor már láthatóan változtatni kellene. |
| 28 | OLD-5É | Új közegben gyorsan megértem a szokásokat, és úgy illeszkedem be, hogy közben önmagam maradok. |
| 29 | IST-5T | Gyakran érzem úgy, hogy amit csinálok, az nem ér sokat, és mások jobbak nálam. |
| 30 | ELH-5É | Érzem, hogy az életemnek küldetése van, és ez értelmet ad a hétköznapi munkámnak is. |
| 31 | FEL-5T | Ha valami rosszul sül el, hajlamos vagyok a felelősséget arra hárítani, akire a feladatot bíztam. |
| 32 | K2 | Amit megígérek, azt kivétel nélkül mindig betartom. |
| 33 | ELO-1T | Amikor lelkes vagyok valamiért, gyakran belevágok, mielőtt végiggondolnám a következményeket. |
| 34 | HAT-1É | Ha elkezdtem valamit, akkor is végigviszem, amikor már nehéz, és elfogyott a lelkesedés. |
| 35 | OLD-1T | Nyomás alatt könnyen engedek olyan dolgokban is, amelyekben pedig ki kellene tartanom. |
| 36 | IST-1É | Ha felismerem, mit kér tőlem Isten, akkor is megteszem, ha nem értem teljesen, vagy nehéz. |
| 37 | ELH-1T | Szívesen beszélek a nagy terveimről akkor is, ha a mostani lépéseim ezt még nem igazán támasztják alá. |
| 38 | FEL-1É | Észreveszem mások erősségeit, és konkrétan ki is mondom nekik. |
| 39 | ELO-2T | Előfordul, hogy olyan kockázatot vállalok, amelyről utólag belátom, hogy felelőtlen volt. |
| 40 | HAT-2É | Tudatosan őrzöm, ami rám van bízva (család, közösség, értékek, erőforrások). |
| 41 | OLD-2T | Ha egy szabály akadályoz, inkább megkeresem a kiskaput, mint hogy betartsam. |
| 42 | IST-2É | Nehéz helyzetben is számítok Isten munkájára, és ez erőt ad a cselekvéshez. |
| 43 | ELH-2T | Előfordul, hogy úgy érzem: ha én nem teszem meg, senki sem fogja, és nélkülem a dolgok összeomlanának. |
| 44 | FEL-2É | Vezetőként abban látom a feladatomat, hogy a rám bízottak növekedését szolgáljam. |
| 45 | K3 | A negatív érzéseimet ki tudom mondani, és fel tudom dolgozni. |
| 46 | ELO-3T | Ha teret akarok nyerni egy helyzetben, előfordul, hogy mások rovására teszem, vagy leszorítom őket. |
| 47 | HAT-3É | Tudok várni a gyümölcsre anélkül, hogy feladnám vagy siettetném a dolgokat. |
| 48 | OLD-3T | Ha egy helyzet konfliktussal vagy kellemetlenséggel jár, inkább kitérek előle, mint hogy szembenézzek vele. |
| 49 | IST-3É | Rendszeresen imádkozom, és a fontos döntéseimet imádságban is végiggondolom. |
| 50 | ELH-3T | Sokat képzelgek arról, milyen lesz majd egyszer, közben a mai lépések elmaradnak. |
| 51 | FEL-3É | Képes vagyok lelkesedést ébreszteni másokban egy közös cél iránt. |
| 52 | K4 | Még soha nem mondtam olyat, amit utólag megbántam. |
| 53 | ELO-4T | Ha sietni kell, vagy nem értenek egyet velem, hajlamos vagyok rákényszeríteni másokra a döntésemet. |
| 54 | HAT-4É | Erős érzelmi helyzetben is meg tudom választani, hogyan reagálok. |
| 55 | OLD-4T | Tárgyaláskor előfordul, hogy elhallgatok vagy kiszínezek információkat, hogy a nekem kedvező eredmény jöjjön ki. |
| 56 | IST-4É | A döntéseimben fontosabb számomra, mit gondol Isten, mint az, hogy mit szólnak az emberek. |
| 57 | ELH-4T | Ha egy cél megfog, képes vagyok mindent (pihenést, kapcsolatokat, egészséget) alárendelni neki. |
| 58 | FEL-4É | Szívesen és érthetően adom át, amit tudok, úgy, hogy a másik a saját útján fejlődjön. |
| 59 | ELO-5T | Ha a céljaimról van szó, előfordul, hogy átlépek emberek érzésein vagy érdekein. |
| 60 | HAT-5É | Nehéz időszakokban is kitartok az emberek, közösségek és vállalások mellett. |
| 61 | OLD-5T | Előfordul, hogy különböző társaságokban egymásnak ellentmondó véleményt képviselek, hogy elfogadjanak. |
| 62 | IST-5É | Könnyen elismerem, ha tévedtem, és szívesen tanulok másoktól. |
| 63 | ELH-5T | Ha kritikát kapok, hajlamos vagyok azzal védekezni, hogy én egy fontos küldetést végzek. |
| 64 | FEL-5É | Szívesen adok át felelősséget és döntési jogot másoknak, és közben mellettük maradok. |
| 65 | K5 | A kellemetlen beszélgetéseket akkor is felvállalom, ha legszívesebben elkerülném őket. |
| 66 | K6 | Inkább megvárom, hogy valaki más kezdje el a dolgokat. |
<!-- END generated: round1-table -->

## 4. Pontozási kulcs

### 4.1 Tengelyértékek (radar)

1. Minden tengelyhez két réteg tartozik: **érett** = az 5 db `É` állítás, **torzult** = az 5 db `T` állítás.
2. Rétegérték = az 5 válasz átlaga, 0–100-as skálára váltva: `(átlag − 1) / 4 × 100`, egészre kerekítve.
3. A radaron a 6 tengelyen két sokszög jelenik meg (érett, torzult).
4. **Jelzés:** ha egy tengelyen bármelyik `T` állítás értéke **≥ 4**, a tengelyen jelölő jelenik meg, akkor is, ha a torzult átlag alacsony (az átlag elrejtené az egyetlen kiugró torzulást).

A részletes, tengelyenkénti nézet 5 tengelyes radar (a tengely 5 párja), ugyanígy két réteggel; itt az egyes állítások értéke közvetlenül `(érték − 1) / 4 × 100`.

### 4.2 Párminták

Egy pár értelmezése (magas = 4–5, alacsony = 1–2):

| Érett | Torzult | Minta | Jelentés |
|---|---|---|---|
| magas | alacsony | **Érett erősség** | a vonás egészségesen működik |
| magas | magas | **Túlhajtott erősség** | a vonás erős, de nyomás alatt átcsúszik a torzult formába |
| alacsony | magas | **Torzulás dominál** | a vonás főleg torzult formában jelenik meg |
| alacsony | alacsony | **Fejletlen terület** | a vonás kevéssé használt |

A 3-as válasz „részben”: az ilyen pár nem kap mintacímkét.

### 4.3 Kontrollállítások

- **Túl kedvező önkép:** `K1`, `K2`, `K4` átlaga **≥ 4** → az eredménylapon jelezzük, hogy a torzult réteg valószínűleg alulbecsült, a 2. körben pedig több közvetett kérdést használunk.
- **Konzisztencia:** a fordított állításokat az eredetijükkel vetjük össze. Eltérés, ha `|eredeti − (6 − kontroll)| ≥ 3`.
  - `K3` ↔ `HAT-4T` (Elfojtás)
  - `K5` ↔ `OLD-3T` (Menekülés)
  - `K6` ↔ `ELO-1É` (Kezdeményezés)
- **Kettő vagy több eltérés** → a kitöltés megbízhatósága alacsony; az eredményt személyes beszélgetésben kell átnézni, vagy a kérdőívet újra kitölteni.
- A kontrollállítások nem számítanak bele a tengelyértékekbe.

### 4.4 Egyensúly az ellentétes irányok között

Ha az **Előre** és a **Hátra** érett rétegének különbsége **≥ 30 pont**, az eredménylap külön kiemeli (pl. „erős az áttörés, de kevés, ami megtartsa” vagy fordítva).

## 5. A 2. körbe kerülő párok kiválasztása

Legfeljebb 8 pár, az alábbi sorrendben töltve fel:

1. minden **túlhajtott erősség** (érett ≥ 4 és torzult ≥ 4);
2. a további **torzult ≥ 4** párok, a legmagasabb torzult értéktől kezdve;
3. a 2 legerősebb **érett erősség** (érett = 5, torzult ≤ 2), megerősítésre;
4. ha még van hely: a **fejletlen** párok (érett ≤ 2), a legalacsonyabb érett értéktől kezdve.

Egyenlőségnél az a pár nyer, amelynek a tengelyéről még kevesebb pár került be, hogy a mélyfúrás lehetőleg több tengelyt érintsen. Ha 6-nál kevesebb pár jön ki, a 2. kör rövidebb lesz. A kiválasztás kézzel módosítható (legfeljebb 8 pár), például ha a kérdező vagy a kitöltő egy konkrét területet szeretne mélyebben megnézni.

A 2. kör két formában készülhet, akár mindkettőben: [élő interjú](02-melyfuro-interju.md) vagy [szituációs kérdőív az alkalmazásban](03-szituacios-kerdoiv.md). Az eredmények összevonásának szabálya a [szituációs kérdőív leírásában](03-szituacios-kerdoiv.md#3-összevonás-az-1-körrel) szerepel.

## 6. Keretezés és adatkezelés

- A kérdőív **önismereti és lelkigondozói eszköz, nem pszichológiai diagnózis.** Az eredmények közlése fejlődési irányként történjen („hol vagy most, merre növekedhetsz”), ne minősítésként.
- A torzult rétegre vonatkozó eredményt lehetőleg személyes beszélgetésben, bizalmi közegben érdemes átbeszélni.
- A válaszok **vallási meggyőződésre vonatkozó adatot** tartalmaznak, ami a GDPR szerint különleges adatkategória: kifejezett hozzájárulás kell a kitöltés előtt, és az adatokat csak a kitöltő és az általa kijelölt személy láthatja.
