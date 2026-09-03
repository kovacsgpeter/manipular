# Rendezett koncepció

## Röviden

Egy háromfős, kooperatív, helyben futó, webes technológiával készülő és saját indítóval csomagolt asztali minijáték készülne, amely valós feladatok teljesítésére ösztönöz. A játékosok egy fájlból betöltött curriculum feladataival, valamint annak keretei között tett saját vállalásaikkal erősítik közös római seregüket. A kerettörténet lazán a künoszkephalai csatából (Battle of Cynoscephalae) és annak előzményeiből merít, de arcade jellegű alternatív történetet mesél, nem történelmi szimulációt.

## Alapélmény

A játék egy cserélhető curriculumot kapcsol össze a játékosok konkrét vállalásaival, majd ezekhez ad élvezetes keretet. Egy héthetes hadjárat során a csapat Thesszálián halad előre. A heti kihívások teljesítésével készleteket, felderítési információkat, morált és katonai erőt gyűjtenek. Ezek állapota határozza meg a köztes összecsapások, végül pedig a nagy csata esélyeit és lefolyását.

A három játékos ugyanazon hadjáratban vesz részt, de mindenki saját feladatlistával és saját mentési fájllal rendelkezik. Az egyéni teljesítmény láthatóan hozzájárul a közös eredményhez. Az ellenfél a játék által vezérelt makedón sereg; nincs játékosok közötti verseny vagy PvP.

## Képernyők

### Thesszália térképe

Ez a fő képernyő és egyben a hadjárat vizuális útvonala. Egy stilizált, régi arcade játékokat idéző térképen jelennek meg:

- sematikus hegyek, folyók, utak és városok;
- a hadjárat útvonala és aktuális állomása;
- heti küldetések és mérföldkő-események;
- a közelgő és már lezárt helyszínek;
- a csapat előrehaladása és az ellenség fenyegetése.

Az interaktív elemek rámutatáskor kivilágosodnak. Aktiválásukkal feladatok, események, történetrészletek vagy státuszpanelek nyílnak meg.

### Római tábor

A tábor a csapat irányító- és visszajelző felülete. Épületei és tárgyai egy-egy funkciót képviselnek, például:

- **parancsnoki sátor:** heti helyzetkép, közös célok és döntések;
- **principia vagy térképasztal:** hadjárat- és történetstátusz;
- **raktár:** készletek, megszerzett erőforrások;
- **gyakorlótér:** egyéni feladatok és sorozatok;
- **felderítőállomás:** bónuszfeladatok, közelgő veszélyek;
- **futár vagy írnok:** igazolásra váró és már ellenőrzött teljesítések;
- **legénységi körlet:** a három játékos hozzájárulása és a közös morál.

Itt is vizuális objektumokon keresztül történik az interakció, nem hagyományos adminisztrációs menükből áll az egész felület.

## Újrahasznosítható motor és cserélhető curriculum

A motor, a felület és a játékszabályok általános keretet alkotnak; az első fejlesztési szakaszban nem egy konkrét próbahét tartalmára, hanem ennek a keretnek az újrahasznosíthatóságára koncentrálunk. A kampány tartalma külső, verziókezelt fájlokból töltődik be.

A curriculum hierarchikus feladatlistát tartalmaz. Az első verzió egyetlen, motor által ismert, tízelemű `taskType` felsorolással indul: `one_off`, `quantity`, `duration`, `checklist`, `evidence`, `habit`, `team_challenge`, `battle_action`, `timed_challenge` és `recovery_task`. A típus a feladat működését rögzíti, és az öt beépített adatbeviteli megjelenítő egyikét használja: egyszeri készre jelölés, számláló, időtartam, ellenőrzőlista, illetve rövid szöveges vagy URL-es bizonyíték. A későbbi típusok és összetettebb modellezési lehetőségek a tervezett funkciók külön listájára kerülnek.

Az összetett típusok – például csatamanőverek, időzített kihívások és pótfeladatok – kétféleképpen kaphatnak belső feladatot: a rövid, csak ott használt feladat beágyazható, az újrahasznált feladat pedig sablonazonosítóval hivatkozható. A hivatkozott sablon JSON Schema-szerű részhalmazzal deklarálja kötelező paramétereit: szöveg, egész vagy tört szám, logikai érték, időtartam, enum, URL, objektum és tömb. Az alapkorlátok mellett használható `minLength`, `maxLength`, `pattern`, valamint minimális és maximális tömbelem-szám. A tömbök egymásba ágyazott tömböt és objektumot is tartalmazhatnak. Az objektumok mezőit előre deklarálni kell, ismeretlen mező nem fogadható el. A validátor motoroldali plafonja öt beágyazási szint, tömbönként száz elem és szövegenként tízezer karakter. A használat helye kizárólag a deklarált paramétereket adhatja át; más sablonmezőt nem írhat felül. Egy összetett példányban pontosan a beágyazott vagy a hivatkozott forma egyike használható.

A curriculum kétféle feladatot adhat:

- **konkrét feladat:** a teljesítési feltételt teljes egészében a curriculum írja elő;
- **feladatkeret:** a curriculum adja a szabályokat, de a játékos indulás előtt megnevezi a saját konkrét vállalását.

A játékos által konkretizált vállalást be kell jelenteni. Erről a két csapattárs értesítést kap, a teljesítés után pedig a curriculum szabályai szerint ellenőrzik, hogy a vállalás megvalósult-e. A motor nem egyetlen jóváhagyási folyamatot kényszerít rá minden feladatra: konfigurációból olvassa be az aktiválás, az elfogadás és a láthatóság szabályait.

A konfiguráció deklaratív: a YAML csak a motor által támogatott szabálytípusokat és paramétereket kombinálhatja, nem futtathat saját programkódot. A `taskType` rögzíti a működést, míg a `policyRef` kizárólag az igazolást és a láthatóságot szabályozza. Egy policy legfeljebb egy közvetlen, tovább már nem öröklő szülőből származhat. A feladat az igazolási és láthatósági névtéren belül bármely örökölt mezőt felülírhat. Így a működés rugalmas marad, de továbbra is validálható és kiszámítható.

Minden héten új történetfájl kerül a repóba. Egy heti történet- vagy curriculumfájl meghatározhatja:

- az időszak címét, történeti bevezetőjét és időhatárát;
- a térképen elérhető állomásokat és eseményeket;
- a játékosok vagy a csapat feladatait;
- a jutalmakat, büntetéseket és feloldási feltételeket;
- a köztes összecsapás szabályait;
- a választható történeti döntéseket és következményeket.

Így a curriculum később cserélhető és bővíthető, ugyanaz a motor pedig más történettel, térképpel és vizuális témával is használható lehet.

## Feladatok és igazolás

A feladatok többféle bizonyítási szintet kaphatnak, és ezt feladatonként a curriculum határozza meg:

1. **Becsület alapú:** a játékos késznek jelöli.
2. **Mennyiségi adat:** például ismétlésszámot, időt vagy eredményt rögzít.
3. **Csapattársi jóváhagyás:** a konfigurációban előírt számú csapattárs elfogadja a teljesítést.
4. **Automatikus külső igazolás:** a játékos pontosan egy külső címzettnek küldött levelére érkező Reply All válasz alapján; a válaszban egyszer használható tokennek és a curriculum által megadott szövegmintának is szerepelnie kell.

Nem minden feladathoz érdemes erős ellenőrzést használni. A rendszer vegyes igazolást támogat; e-mailes ellenőrzés csak különleges, arra alkalmas feladatoknál jelenik meg. Az igazolás módját a curriculum adja meg, a jutalom mértéke pedig figyelembe veheti a bizonyítás erősségét.

Egy kihagyott vállaláshoz több következmény egyszerre is tartozhat: elmaradhat a jutalom, történhet fix erőforrás-levonás vagy más szankció, és megnyílhat pótfeladat. Ezek egymással kombinálható, curriculumból vezérelt szabályok; a motor a lehetséges következménytípusokat és azok végrehajtását biztosítja.

A csapatnézetnek mindhárom információs szintet kezelnie kell: összesített seregállapot, játékosonkénti hozzájárulás, illetve konkrét feladat és eredmény. Azt, hogy melyik adat mikor és kinek látható, konfigurálható láthatósági szabály határozza meg.

## Erőforrások, pontok és táborfejlesztés

A sereg erőforrásait nem a motor égeti be: a `campaign.yaml` adja meg az azonosítójukat, megjelenítési adataikat, megengedett negatív tartományukat és opcionális felső korlátjukat. Az erőforrás egy `policyRef` mezővel névvel ellátott, újrahasznosítható határkezelési policy-re hivatkozik. A policy mondja meg, hogy a határ elérésekor az érték megálljon, a többlet más értékké alakuljon, vagy külön overflow-esemény induljon, valamint tartalmazza az ehhez szükséges részleteket.

Egy hétköznapi feladat külön `personalPoints` és `teamPoints` mezővel adhat személyes, illetve közös pontot, emellett közvetlen erőforrás-jutalmat is oszthat. A személyes pontot a tulajdonosa önállóan költheti el. A közös pont elköltéséhez 2/3-os szavazás kell, amely két egyező szavazatnál lezárul. Mindkét pontfajta táborfejlesztésekre és csata előtti bónuszokra költhető. A csatabónuszra felhasznált pont először csak zárolódik; ha a csata elmarad, automatikusan visszakerül, és csak a csata elindulásakor válik végleges költéssé.

A tábor fejlődése ezt vizuálisan is megmutatja, miközben a curriculum által konfigurált fejlesztések mechanikai bónuszokat adhatnak a feladatokhoz, erőforrásokhoz vagy csatákhoz. Egy fejlesztés lehet tartós vagy időszakos; lejárata dátummal, hét-, csata- vagy felhasználásszámmal fejezhető ki. Halmozódási szabálya fejlesztésenként `additive`, `strongest_only` vagy `non_stackable`.

## Heti és teljes kampányív

Minden hét egy rövid ciklus:

1. új helyzet és kihívások megnyitása;
2. vállalások kiválasztása vagy kiosztása;
3. feladatok végrehajtása és igazolása;
4. közös erőforrások frissítése;
5. heti esemény vagy kisebb összecsapás feloldása;
6. eredmény és következő történetszakasz megnyitása.

A heti továbblépés két beépített működés közül választhat: `calendar` vagy `completion_gate`. A kampány hét hétig tart, és a végén a künoszkephalai csata zárja a játékot. A történet útvonalát a csapat teljesítési állapota és 2/3-os többséggel meghozott közös döntései együtt alakítják; a szavazás azonnal lezárul, amikor két azonos szavazat beérkezett.

A csaták kiemelt, lehetőség szerint közös foglalkozásként megélt események. Minden csata három rögzített részből áll: **eligazítás**, **manőverek**, **kiértékelés**. A manőverek között szinkron és aszinkron feladatok egyaránt lehetnek. Szinkron fázisban egy host gép mutatja és rögzíti a csatát, a többiek fizikailag vesznek részt. A host által felvett eredmény csak akkor végleges, amikor minden érintett játékos külön megerősítette a saját teljesítését; külön megfigyelői jóváhagyás nem kell.

A játék hadmozdulatot jelez, a csapat pedig a curriculum által előre megírt három nehézségi fokozat – **biztos**, **merész** vagy **vakmerő** – közül választ. A curriculum mindhárom fokozathoz konkrét feladatot ír, a `campaign.yaml` pedig az egész kampányra egyszer definiálja a három egységes fokozatszorzót. A sémának csak azt kell ellenőriznie, hogy mindhárom érték szám; sorrendet vagy előjelet nem kényszerít. Részleges siker esetén a hadászati hatás képlete: teljesítési arány × fokozatszorzó × alapérték, majd az eredményt a legközelebbi egészre kerekítjük. Kisebb vállalás biztonságosabb, de kevesebbet érhet a győzelemhez; nagyobb vállalás többet hozhat, de a kudarc kockázata is nagyobb.

A curriculum manőverenként határozza meg, hogy egy kijelölt parancsnok vagy az egész csapat hajtja-e végre a kihívást. Ugyanígy a curriculum dönti el, hogy az eredmény bináris vagy részleges teljesítést is elfogad. Fizikai kihívásnál kötelező megadni a `low`, `moderate` vagy `high` intenzitást, az eszközigényt és egy rövid biztonsági figyelmeztetést; kímélő vagy nem fizikai alternatíva csak akkor kötelező, ha a curriculum szerzője előírja. A társak ellenőrzik a végrehajtást. Időben igazolt siker esetén a sikeres hadmozdulat és történeti ág jelenik meg; lejárat vagy sikertelenség esetén a csata kedvezőtlenebb irányba fordul. A vereség nem állítja meg a kampányt: a történet kedvezőtlenebb ágon folytatódik.

A fő történeti élményt a térképi előrehaladás adja; ennek alkotóelemei a táborfejlesztés, a gyűjtés és a szakaszzáró csaták.

## Első verzió technikai kerete

- A forráskód, a heti történetfájlok és a játékosonként elkülönített mentések az MVP-ben egyetlen privát GitHub-repóban vannak.
- Mindhárom játékos klónozza a kampány repóját. A külön telepített alkalmazás induláskor ezt a helyi mappát nyitja meg.
- A csomagolt asztali alkalmazás Electronra épül, és Electron Forge használatával készül. Kezelőfelülete React + TypeScript + Vite alapú, az alkalmazásállapotot Redux Toolkit kezeli, a futtatókörnyezetét pedig a csomagba épített Chromium és Node.js biztosítja. A forrás az első naptól, külön orchestrator nélküli `pnpm` workspace-monorepo: `apps/desktop`, valamint `core`, `contracts`, `persistence`, `git-sync` és `email-verifier` package-ek alkotják.
- Az MVP macOS- és Windows-csomagot kap, és csak a beépített aktuális Chromium motoron teszteljük hivatalosan.
- Az Electron háttérfolyamata kezeli a fájlműveleteket és a Git-parancsokat; ezek nem kerülnek közvetlenül a megjelenítő webes rétegbe. A renderer Node-hozzáférés nélkül, `contextIsolation` mellett fut, és csak a `selectCampaignRepo`, `runPreflight`, `loadCampaign`, `appendPlayerEvent`, `previewSync` és `openReleasePage` műveleteket tartalmazó allowlistes preload IPC-felületen kérhet engedélyezett műveleteket. Az IPC- és adatszerződéseket TypeBox írja le, Ajv validálja. A közös válaszforma `{ ok: true, data }`, illetve `{ ok: false, error: { code, message, details, recoverable } }`, stabil gépi hibakóddal. Az alkalmazás a gépen már telepített és működően hitelesített rendszer-Gitet használja.
- A térkép és a tábor első változata SVG-elemekből és HTML/CSS felületi rétegből épül. Ez adja a legegyszerűbb utat a kattintható hotspotokhoz és a reszponzív elrendezéshez; a csataminijáték később külön canvas réteget kaphat.
- Az aláíratlan MVP-csomagok privát GitHub Releases kiadásokként jelennek meg. Az aktuális Semver alkalmazásverziót, a release URL-jét és a támogatott `campaignSchema`-tartományt a kampányrepó verziókezelt `content/app-release.yaml` fájlja közli. Az alkalmazás csak a konfigurált repositoryhoz tartozó HTTPS GitHub Releases URL-t nyithatja meg. Új verziónál a kliens értesítést mutat és megnyitja a letöltési oldalt; a letöltés és telepítés kézzel történik.
- Az MVP-hez nem tartozik külön akadálymentességi elfogadási követelmény; a részletes billentyűzetes, reduced-motion és hangkezelési munka későbbi fejlesztés.
- Szinkronizáláskor az alkalmazás ellenőrzi a helyben mentett játékosállomány formátumát, majd célzott commitot és push-t kezdeményez.
- Minden változás azonnal helyben mentődik, a Git-commitot és push-t pedig külön, jól látható **Szinkronizálás** gomb indítja.
- A szinkronizálás csak a játék engedélyezett adatfájljait stage-eli és commitolja; minden más munkakönyvtári változást érintetlenül hagy.
- Ha közben másik játékos pusholt, a szinkronizálás automatikusan újrapróbálkozik, amíg sikerrel nem jár. Ez háttérben, várakozással történik, nem blokkoló, erőforrást terhelő ciklusban. Csak az átmeneti versenyhelyzet próbálható korlátlanul újra; hitelesítési, jogosultsági vagy validációs hibánál a folyamat megáll és egyértelműen jelez.
- Az MVP-ben minden játékos ugyanazt az ágat használja, de játékosonként és hetenként külön JSONL-eseményfájlba ír. A későbbi szinkronizációs változatok a tervezett funkciók listáján szerepelnek.
- Az append-only eseménynapló az igazságforrás; mellette újragenerálható állapot-pillanatkép gyorsítja a betöltést. A közös állapot az egyéni naplókból determinisztikusan újraszámítható.
- A helyi alkalmazás a Git felhasználónév vagy e-mail alapján azonosítja a játékost; a `campaign.yaml` explicit módon rendeli ezt egy stabil `playerId` értékhez.
- A `campaign.yaml` minden játékoshoz olvasható `allowedEmail` listát rendel. Ez azonosítja, melyik játékos indította az e-mailes feladatot; a bizonyító válasz feladója viszont a külső címzett.
- Az alkalmazás a legutóbbi kampányrepo útvonalát a titkot nem tartalmazó `userData/settings.json` fájlban, temporális fájl és atomi csere segítségével jegyzi meg; induláskor újraellenőrzi, és menüből engedi lecserélni. Hiányzó Git vagy repo, hibás tartalomséma, illetve nem azonosítható játékos esetén read-only módban nyílik meg: az adatok olvashatók, de a mentés és a Szinkronizálás nem használható. A remote/auth ellenőrzés indulás után aszinkron, majd minden Sync előtt megismétlődik. Hibája csak a Szinkronizálást blokkolja, a helyi mentést nem. A diagnosztika megmutatja a Git verzióját, a repo útvonalát, a remote és hitelesítés állapotát, a sémahibát és a javasolt javítási lépést.
- A napi használat célzott hossza 3–5 perc; a legfontosabb műveleteknek ebbe bele kell férniük.
- A curriculum kezdetben kézzel szerkesztett, sémával ellenőrzött YAML-fájl.
- Egy heti tartalomverzió az első rá hivatkozó esemény után változtathatatlan. Olvasható verzióazonosító és automatikus tartalomhash együtt azonosítja; javítás csak új verzióazonosítóval készülhet.
- Határidőnél a helyi esemény időpontja számít, amelyet a curriculum `verificationDeadline` értékén belül érkező későbbi verifikáció erősít meg.
- Az automatikus e-mail-verifikáció a háromfős MVP része, nem későbbi kiegészítés. A játékos pontosan egy külső címzett mellett CC-be teszi a dedikált Gmail verifier-postafiókot, a címzett pedig Reply All-lal válaszol. Ha ezt elmulasztja, a teljesítés függőben marad, és a felület új Reply All választ kér. Az e-mail-címekből a tényleges címet nyerjük ki, majd trim és kisbetűsítés után hasonlítjuk össze őket; Gmail-aliasokat nem írunk át. A normalizált válaszadó címének egyeznie kell az eredeti `To` címzettel.

  A token 128 bites véletlen érték, csoportosított Base32 megjelenítéssel. A tárgyban vagy a teljes szöveges válaszban, az idézett résszel együtt kereshető. A curriculum minden kötelező kifejezésének részsztringként kell szerepelnie a csak új válaszrészt tartalmazó, Unicode-normalizált, összevont whitespace-ú és kisbetűsített szövegben. Az új részt HTML `blockquote` és ismert idézetjelölők alapján választjuk le; bizonytalan leválasztásnál nem születik végleges elutasítás, hanem `parse_error` jelzésű függő állapot és egyszerűbb új válaszra szóló kérés jelenik meg.

  A request, az ellenőrzési kísérletek és a verification-event fájlok külön, változtathatatlan rekordok; az aktuális státusz ezekből képzett vetület. A fájlnevek a tokentől független `requestId` értéket használnak. A nyers token csak a privát requestben szerepel, az eredmények és audit-események csak a hashét tárolják. A token a feladat `verificationDeadline` értékéig él, és `parse_error` után ugyanazzal a tokennel érkező későbbi érvényes válasz még igazolhat. Csak a visszavonás vagy az eredménytelen határidő-lejárat eredményez végleges `rejected` állapotot; a `verified` a másik végleges állapot.

  Egy feldolgozott levelet elsődlegesen a `Message-ID`, ennek hiányában a normalizált tartalom lenyomata azonosít, így több workflow-futás sem számolhatja el többször. Új token kiadásakor a régi visszavonódik, és új request, valamint audit-esemény készül. A GitHub Actions verifier IMAP-on, külön app passworddel olvassa a kizárólag erre létrehozott Gmail-fiókot. Egy workflow átmeneti hibánál legfeljebb háromszor próbálkozik. Kézi Szinkronizáláskor az aktuális játékos minden lejáratlan, nem végleges kéréséhez új attempt készülhet, de kérésenként legalább öt percnek kell eltelnie, és az előző kísérletnek le kell zárulnia vagy időtúllépésbe kell futnia. A kliens kísérletenként legfeljebb 90 másodpercig figyeli az eredményt, utána függő állapotot mutat. A Gmail app password GitHub Actions Secretsben marad.

- A Redux store csak session- és UI-állapotot, valamint a fájlokból újraképzett normalizált vetületet tart; nem perzisztens igazságforrás.
- Minden esemény UUID v4 azonosítót, ISO 8601 UTC `occurredAt` időt és külön `timezoneOffsetMinutes` értéket kap. A kötelező boríték ezenfelül az esemény típusát, a játékost, kampányt, hetet, tartalomverziót, tartalomhash-t és a verziózott payloadot tartalmazza. Az írást az Electron main folyamat validálja és sorosítja; egy UTF-8 JSON-sor appendje és `fsync` után jelez sikert. A párhuzamos írást Electron single-instance lock és a `userData` könyvtárban tartott repónkénti lock akadályozza meg.
- Sync előtt idegen, követett Git-módosításnál a helyi mentés aktív marad, de a Sync megáll; az alkalmazás nem stash-el és nem módosít idegen fájlt. Push-versenynél megszakítható, 1–2–4 másodperces, legfeljebb 30 másodpercig növekvő visszavárás működik; permanens hibánál azonnal leáll.
- Az első fejleszthető függőleges szelet egy kampányrepo kiválasztását, preflight ellenőrzését, egy térképi hotspotot, egy becsület alapú `one_off` feladatot kis erőforrás-jutalommal, egy helyi esemény rögzítését és egy Sync dry-runt tartalmaz. Az esemény a `taskId` és a tartalom verzió/hash alapján azonosítja a teljesítést, a jutalmat a motor képezi le. A dry-run megmutatja az engedélyezett fájlokat, validációt, fetch/rebase szükségességét, commitüzenetet, push-célt és blokkolókat, de nem módosítja a Git állapotát. Kötelező ellenőrzései: Vitest motor- és séma-unit tesztek, ideiglenes Git fixture-rel futó integrációs teszt és Playwright Electron smoke teszt. A unit- és Git-tesztek minden pushnál, a macOS/Windows Electron smoke tesztek a `main` ágon és release előtt futnak.

## A koncepció célja

Az élmény akkor sikeres, ha a játékosok nem egy produktivitási adminfelületet látnak római díszlettel, hanem egy könnyen használható, hangulatos közös hadjáratot, amelyben a valódi vállalások rendszeresen érdekes játékbeli következménnyé válnak.
