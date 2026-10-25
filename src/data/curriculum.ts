import { IslandConfig, WordItem, NPCData, BadgeItem, ShopItem } from '../types/game';

/* ==========================================================================
   1. ISLADS & 110+ VOCABULARY WORDS FOR GRADES 3-4 (MIN 15 PER ISLAND)
   ========================================================================== */

export const ISLANDS_DATA: IslandConfig[] = [
  {
    id: 'zoo',
    nameEn: 'ZOO Safari Island',
    namePl: 'Wyspa ZOO i Zwierząt',
    descriptionPl: 'Odkrywaj dzikie i domowe zwierzęta, naśladuj ich odgłosy i pomóż przewodnikowi!',
    themeColor: '#10b981',
    skyColor: '#6ee7b7',
    fogColor: '#a7f3d0',
    groundColor: '#059669',
    accentColor: '#34d399',
    timeOfDay: 'noon',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    npc: {
      id: 'ranger_leo',
      name: 'Ranger Leo',
      rolePl: 'Strażnik Parku Safari',
      roleEn: 'Safari Park Ranger',
      dialogueIntroEn: "Welcome to Safari Island! The animals need our help with their lost name tags!",
      dialogueIntroPl: "Witaj na Wyspie Safari! Zwierzęta potrzebują pomocy z zagubionymi tabliczkami imion!",
      color: '#059669',
      islandId: 'zoo',
      position: { x: 32, y: 0.5, z: 0 }
    },
    gateCategories: [
      { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: true },
      { id: 'cat_food', nameEn: 'Food', namePl: 'Jedzenie', isCorrect: false },
      { id: 'cat_clothes', nameEn: 'Clothes', namePl: 'Ubrania', isCorrect: false },
      { id: 'cat_school', nameEn: 'School', namePl: 'Szkoła', isCorrect: false }
    ],
    words: [
      { id: 'zoo_1', english: 'cat', polish: 'kot', category: 'zoo', level: 1, distractors: ['dog', 'lion', 'rabbit'], emoji: '🐱', hintPl: 'Robi miau i uwielbia mleko.', exampleEn: 'I have got a little cat.', examplePl: 'Mam małego kota.', phoneticTip: '[kæt]' },
      { id: 'zoo_2', english: 'dog', polish: 'pies', category: 'zoo', level: 1, distractors: ['cat', 'bear', 'tiger'], emoji: '🐶', hintPl: 'Szczeka hał-hał i macha ogonem.', exampleEn: 'The dog is barking happily.', examplePl: 'Pies radośnie szczeka.', phoneticTip: '[dɒɡ]' },
      { id: 'zoo_3', english: 'elephant', polish: 'słoń', category: 'zoo', level: 2, distractors: ['giraffe', 'zebra', 'bear'], emoji: '🐘', hintPl: 'Wielki zwierz z długą trąbą i uszami.', exampleEn: 'The elephant is very big.', examplePl: 'Słoń jest bardzo duży.', phoneticTip: '[ˈel.ɪ.fənt]' },
      { id: 'zoo_4', english: 'lion', polish: 'lew', category: 'zoo', level: 1, distractors: ['tiger', 'cat', 'monkey'], emoji: '🦁', hintPl: 'Król zwierząt z bujną grzywą.', exampleEn: 'The lion can roar loud!', examplePl: 'Lew potrafi głośno ryczeć!', phoneticTip: '[ˈlaɪ.ən]' },
      { id: 'zoo_5', english: 'monkey', polish: 'małpa', category: 'zoo', level: 1, distractors: ['parrot', 'rabbit', 'zebra'], emoji: '🐒', hintPl: 'Uwielbia banany i skacze po gałęziach.', exampleEn: 'The monkey climbs trees.', examplePl: 'Małpa wspina się po drzewach.', phoneticTip: '[ˈmʌŋ.ki]' },
      { id: 'zoo_6', english: 'giraffe', polish: 'żyrafa', category: 'zoo', level: 2, distractors: ['elephant', 'zebra', 'snake'], emoji: '🦒', hintPl: 'Najwyższe zwierzę z bardzo długą szyją.', exampleEn: 'The giraffe eats leaves.', examplePl: 'Żyrafa je liście.', phoneticTip: '[dʒɪˈrɑːf]' },
      { id: 'zoo_7', english: 'zebra', polish: 'zebra', category: 'zoo', level: 1, distractors: ['tiger', 'dog', 'horse'], emoji: '🦓', hintPl: 'Biało-czarne pasy na całym ciele.', exampleEn: 'A zebra has black and white stripes.', examplePl: 'Zebra ma czarno-białe paski.', phoneticTip: '[ˈzeb.rə]' },
      { id: 'zoo_8', english: 'parrot', polish: 'papuga', category: 'zoo', level: 2, distractors: ['penguin', 'cat', 'snake'], emoji: '🦜', hintPl: 'Kolorowy ptak potrafiący powtarzać słowa.', exampleEn: 'The parrot is very colorful.', examplePl: 'Papuga jest bardzo kolorowa.', phoneticTip: '[ˈpær.ət]' },
      { id: 'zoo_9', english: 'tiger', polish: 'tygrys', category: 'zoo', level: 2, distractors: ['lion', 'bear', 'crocodile'], emoji: '🐅', hintPl: 'Dzikie cętkowane i pasiaste zwierzę drapieżne.', exampleEn: 'A tiger is fast and strong.', examplePl: 'Tygrys jest szybki i silny.', phoneticTip: '[ˈtaɪ.ɡər]' },
      { id: 'zoo_10', english: 'bear', polish: 'niedźwiedź', category: 'zoo', level: 2, distractors: ['lion', 'rabbit', 'dog'], emoji: '🐻', hintPl: 'Lubi słodki miód i zimowy sen.', exampleEn: 'The brown bear loves honey.', examplePl: 'Brązowy niedźwiedź uwielbia miód.', phoneticTip: '[beər]' },
      { id: 'zoo_11', english: 'rabbit', polish: 'królik', category: 'zoo', level: 1, distractors: ['cat', 'monkey', 'snake'], emoji: '🐰', hintPl: 'Ma długie uszy i chrupie marchewki.', exampleEn: 'The rabbit has long soft ears.', examplePl: 'Królik ma długie miękkie uszy.', phoneticTip: '[ˈræb.ɪt]' },
      { id: 'zoo_12', english: 'snake', polish: 'wąż', category: 'zoo', level: 2, distractors: ['crocodile', 'fish', 'tiger'], emoji: '🐍', hintPl: 'Długi, pełza bez nóg i syczy.', exampleEn: 'Watch out, green snake!', examplePl: 'Uważaj, zielony wąż!', phoneticTip: '[sneɪk]' },
      { id: 'zoo_13', english: 'penguin', polish: 'pingwin', category: 'zoo', level: 2, distractors: ['parrot', 'dolphin', 'bear'], emoji: '🐧', hintPl: 'Nielot we fraku, świetnie pływa w lodowatej wodzie.', exampleEn: 'The penguin waddles on ice.', examplePl: 'Pingwin człapie po lodzie.', phoneticTip: '[ˈpeŋ.ɡwɪn]' },
      { id: 'zoo_14', english: 'kangaroo', polish: 'kangur', category: 'zoo', level: 3, distractors: ['rabbit', 'monkey', 'giraffe'], emoji: '🦘', hintPl: 'Skacze daleko i nosi malucha w torbie.', exampleEn: 'The kangaroo can jump high.', examplePl: 'Kangur potrafi wysoko skakać.', phoneticTip: '[ˌkæŋ.ɡərˈuː]' },
      { id: 'zoo_15', english: 'dolphin', polish: 'delfin', category: 'zoo', level: 3, distractors: ['fish', 'crocodile', 'penguin'], emoji: '🐬', hintPl: 'Inteligentny morski ssak wyskakujący ponad fale.', exampleEn: 'The dolphin swims with a smile.', examplePl: 'Delfin pływa z uśmiechem.', phoneticTip: '[ˈdɒl.fɪn]' },
      { id: 'zoo_16', english: 'crocodile', polish: 'krokodyl', category: 'zoo', level: 3, distractors: ['snake', 'lion', 'elephant'], emoji: '🐊', hintPl: 'Mieszka w rzece i ma ostre zęby.', exampleEn: 'Crocodile rests in the river.', examplePl: 'Krokodyl odpoczywa w rzece.', phoneticTip: '[ˈkrɒk.ə.daɪl]' }
    ]
  },
  {
    id: 'kitchen',
    nameEn: 'Tasty Kitchen Island',
    namePl: 'Pyszna Kuchnia i Targ',
    descriptionPl: 'Odkryj zdrowe owoce, warzywa i przysmaki z angielskiego menu!',
    themeColor: '#f59e0b',
    skyColor: '#fed7aa',
    fogColor: '#ffedd5',
    groundColor: '#d97706',
    accentColor: '#fbbf24',
    timeOfDay: 'morning',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    npc: {
      id: 'chef_pierre',
      name: 'Chef Pierre',
      rolePl: 'Szef Kuchni z Ryneczku',
      roleEn: 'Master Pastry Chef',
      dialogueIntroEn: "Bonjour! My kitchen has delicious recipes, but my ingredient cards were scattered!",
      dialogueIntroPl: "Bonjour! W mojej kuchni pachnie pysznościami, ale karty ze składnikami się rozsypały!",
      color: '#f97316',
      islandId: 'kitchen',
      position: { x: 0, y: 0.5, z: 32 }
    },
    gateCategories: [
      { id: 'cat_food', nameEn: 'Food & Drinks', namePl: 'Jedzenie i Napoje', isCorrect: true },
      { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: false },
      { id: 'cat_furniture', nameEn: 'Furniture', namePl: 'Meble', isCorrect: false },
      { id: 'cat_weather', nameEn: 'Weather', namePl: 'Pogoda', isCorrect: false }
    ],
    words: [
      { id: 'kit_1', english: 'apple', polish: 'jabłko', category: 'kitchen', level: 1, distractors: ['banana', 'orange', 'tomato'], emoji: '🍎', hintPl: 'Okrągły czerwony owoc z sadu.', exampleEn: 'I like eating a red apple.', examplePl: 'Lubię jeść czerwone jabłko.', phoneticTip: '[ˈæp.əl]' },
      { id: 'kit_2', english: 'banana', polish: 'banan', category: 'kitchen', level: 1, distractors: ['apple', 'carrot', 'juice'], emoji: '🍌', hintPl: 'Żółty podłużny owoc uwielbiany przez małpki.', exampleEn: 'A yellow banana is sweet.', examplePl: 'Żółty banan jest słodki.', phoneticTip: '[bəˈnɑː.nə]' },
      { id: 'kit_3', english: 'milk', polish: 'mleko', category: 'kitchen', level: 1, distractors: ['juice', 'tea', 'water'], emoji: '🥛', hintPl: 'Biały zdrowy napój od krówki.', exampleEn: 'A glass of cold milk.', examplePl: 'Szklanka zimnego mleka.', phoneticTip: '[mɪlk]' },
      { id: 'kit_4', english: 'bread', polish: 'chleb', category: 'kitchen', level: 1, distractors: ['cheese', 'cake', 'egg'], emoji: '🍞', hintPl: 'Pieczywo do porannej kanapki z piekarni.', exampleEn: 'Fresh bread smells amazing.', examplePl: 'Świeży chleb pachnie niesamowicie.', phoneticTip: '[bred]' },
      { id: 'kit_5', english: 'cheese', polish: 'ser', category: 'kitchen', level: 1, distractors: ['milk', 'bread', 'pizza'], emoji: '🧀', hintPl: 'Żółty, czasem z dziurami, przysmak myszek.', exampleEn: 'Melted yellow cheese on bread.', examplePl: 'Roztopiony żółty ser na chlebie.', phoneticTip: '[tʃiːz]' },
      { id: 'kit_6', english: 'egg', polish: 'jajko', category: 'kitchen', level: 1, distractors: ['bread', 'soup', 'tomato'], emoji: '🥚', hintPl: 'Z kurnika, idealne na jajecznicę.', exampleEn: 'One boiled egg for breakfast.', examplePl: 'Jedno gotowane jajko na śniadanie.', phoneticTip: '[eɡ]' },
      { id: 'kit_7', english: 'orange', polish: 'pomarańcza', category: 'kitchen', level: 1, distractors: ['apple', 'banana', 'carrot'], emoji: '🍊', hintPl: 'Soczysty cytrus o takim samym kolorze jak nazwa.', exampleEn: 'Sweet juicy orange.', examplePl: 'Słodka soczysta pomarańcza.', phoneticTip: '[ˈɒr.ɪndʒ]' },
      { id: 'kit_8', english: 'sandwich', polish: 'kanapka', category: 'kitchen', level: 2, distractors: ['pizza', 'bread', 'soup'], emoji: '🥪', hintPl: 'Dwie kromki chleba ze świeżymi warzywami.', exampleEn: 'Cheese and tomato sandwich.', examplePl: 'Kanapka z serem i pomidorem.', phoneticTip: '[ˈsæn.wɪdʒ]' },
      { id: 'kit_9', english: 'pizza', polish: 'pizza', category: 'kitchen', level: 1, distractors: ['sandwich', 'cake', 'soup'], emoji: '🍕', hintPl: 'Włoski placek z sosem i serem podzielony na trójkąty.', exampleEn: 'I love delicious warm pizza.', examplePl: 'Uwielbiam pyszną ciepłą pizzę.', phoneticTip: '[ˈpiːt.sə]' },
      { id: 'kit_10', english: 'tomato', polish: 'pomidor', category: 'kitchen', level: 2, distractors: ['carrot', 'apple', 'orange'], emoji: '🍅', hintPl: 'Czerwone warzywo do sałatki lub sosu.', exampleEn: 'Red tomato from the garden.', examplePl: 'Czerwony pomidor z ogrodu.', phoneticTip: '[təˈmɑː.təʊ]' },
      { id: 'kit_11', english: 'juice', polish: 'sok', category: 'kitchen', level: 1, distractors: ['milk', 'tea', 'soup'], emoji: '🧃', hintPl: 'Wyciśnięty z owoców słodki napój w kartoniku.', exampleEn: 'Orange juice is very refreshing.', examplePl: 'Sok pomarańczowy jest bardzo orzeźwiający.', phoneticTip: '[dʒuːs]' },
      { id: 'kit_12', english: 'cake', polish: 'ciasto / tort', category: 'kitchen', level: 2, distractors: ['bread', 'sandwich', 'pizza'], emoji: '🎂', hintPl: 'Urodzinowy słodki wypiek ze świeczkami.', exampleEn: 'Birthday chocolate cake.', examplePl: 'Urodzinowe ciasto czekoladowe.', phoneticTip: '[keɪk]' },
      { id: 'kit_13', english: 'tea', polish: 'herbata', category: 'kitchen', level: 2, distractors: ['milk', 'juice', 'water'], emoji: '🍵', hintPl: 'Ciepły napój z cytryną w filiżance.', exampleEn: 'A cup of warm lemon tea.', examplePl: 'Filiżanka ciepłej herbaty z cytryną.', phoneticTip: '[tiː]' },
      { id: 'kit_14', english: 'carrot', polish: 'marchewka', category: 'kitchen', level: 2, distractors: ['tomato', 'banana', 'apple'], emoji: '🥕', hintPl: 'Pomarańczowe chrupiące warzywo.', exampleEn: 'Rabbits love fresh carrot.', examplePl: 'Króliki uwielbiają świeżą marchewkę.', phoneticTip: '[ˈkær.ət]' },
      { id: 'kit_15', english: 'soup', polish: 'zupa', category: 'kitchen', level: 2, distractors: ['tea', 'milk', 'bread'], emoji: '🥣', hintPl: 'Gorąca potrawa w miseczce jedzona łyżką.', exampleEn: 'Hot vegetable soup.', examplePl: 'Gorąca zupa warzywna.', phoneticTip: '[suːp]' },
      { id: 'kit_16', english: 'fish', polish: 'ryba (danie)', category: 'kitchen', level: 2, distractors: ['cheese', 'egg', 'sandwich'], emoji: '🐟', hintPl: 'Smaczna porcja z cytryną i frytkami.', exampleEn: 'Grilled fish with lemon.', examplePl: 'Grillowana ryba z cytryną.', phoneticTip: '[fɪʃ]' }
    ]
  },
  {
    id: 'school',
    nameEn: 'Magic Academy Island',
    namePl: 'Magiczna Szkoła i Przybory',
    descriptionPl: 'Poznaj przybory ze szkolnego piórnika i tajemnice magicznej klasy!',
    themeColor: '#3b82f6',
    skyColor: '#93c5fd',
    fogColor: '#dbeafe',
    groundColor: '#1d4ed8',
    accentColor: '#60a5fa',
    timeOfDay: 'morning',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    npc: {
      id: 'professor_owl',
      name: 'Professor Owl',
      rolePl: 'Mądry Nauczyciel Sowa',
      roleEn: 'Academy Headmaster',
      dialogueIntroEn: "Greetings young pupil! Check your pencil case and let's review school words!",
      dialogueIntroPl: "Witaj młody uczniu! Sprawdź swój piórnik i przypomnijmy sobie szkolne słówka!",
      color: '#3b82f6',
      islandId: 'school',
      position: { x: -32, y: 0.5, z: 0 }
    },
    gateCategories: [
      { id: 'cat_school', nameEn: 'School Supplies', namePl: 'Przybory Szkolne', isCorrect: true },
      { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: false },
      { id: 'cat_food', nameEn: 'Food', namePl: 'Jedzenie', isCorrect: false },
      { id: 'cat_colors', nameEn: 'Colors', namePl: 'Kolory', isCorrect: false }
    ],
    words: [
      { id: 'sch_1', english: 'pen', polish: 'długopis', category: 'school', level: 1, distractors: ['pencil', 'ruler', 'eraser'], emoji: '🖊️', hintPl: 'Pisze atramentem, nie da się go zmazać gumką.', exampleEn: 'Can I borrow your blue pen?', examplePl: 'Czy mogę pożyczyć twój niebieski długopis?', phoneticTip: '[pen]' },
      { id: 'sch_2', english: 'pencil', polish: 'ołówek', category: 'school', level: 1, distractors: ['pen', 'crayon', 'ruler'], emoji: '✏️', hintPl: 'Grafitowy, możesz go zatemperować i zetrzeć.', exampleEn: 'Draw a circle with a pencil.', examplePl: 'Narysuj kółko ołówkiem.', phoneticTip: '[ˈpen.səl]' },
      { id: 'sch_3', english: 'book', polish: 'książka', category: 'school', level: 1, distractors: ['notebook', 'pencil case', 'bag'], emoji: '📖', hintPl: 'Pełna ciekawych historii i stron do czytania.', exampleEn: 'Open your English book.', examplePl: 'Otwórz swoją książkę do angielskiego.', phoneticTip: '[bʊk]' },
      { id: 'sch_4', english: 'ruler', polish: 'linijka', category: 'school', level: 1, distractors: ['eraser', 'pencil', 'scissors'], emoji: '📏', hintPl: 'Z podziałką w centymetrach do prostych linii.', exampleEn: 'Measure the line with a ruler.', examplePl: 'Zmierz linię linijką.', phoneticTip: '[ˈruː.lər]' },
      { id: 'sch_5', english: 'eraser', polish: 'gumka do ścierania', category: 'school', level: 1, distractors: ['ruler', 'pen', 'pencil'], emoji: '🧼', hintPl: 'Zmazuje błędy narysowane ołówkiem.', exampleEn: 'Use an eraser to fix mistakes.', examplePl: 'Użyj gumki, aby poprawić błędy.', phoneticTip: '[ɪˈreɪ.zər]' },
      { id: 'sch_6', english: 'bag', polish: 'plecak / torba', category: 'school', level: 1, distractors: ['pencil case', 'desk', 'book'], emoji: '🎒', hintPl: 'Nosisz w nim wszystkie książki i zeszyty do szkoły.', exampleEn: 'Put the books in your bag.', examplePl: 'Włóż książki do plecaka.', phoneticTip: '[bæɡ]' },
      { id: 'sch_7', english: 'desk', polish: 'biurko / ławka', category: 'school', level: 2, distractors: ['chair', 'board', 'door'], emoji: '🪑', hintPl: 'Siedzisz przy nim na lekcji.', exampleEn: 'Sit at your desk, please.', examplePl: 'Usiądź przy biurku, proszę.', phoneticTip: '[desk]' },
      { id: 'sch_8', english: 'notebook', polish: 'zeszyt', category: 'school', level: 2, distractors: ['book', 'pen', 'pencil case'], emoji: '📓', hintPl: 'W kratkę lub linie do notowania ćwiczeń.', exampleEn: 'Write notes in your notebook.', examplePl: 'Pisz notatki w swoim zeszycie.', phoneticTip: '[ˈnəʊt.bʊk]' },
      { id: 'sch_9', english: 'scissors', polish: 'nożyczki', category: 'school', level: 2, distractors: ['crayon', 'ruler', 'sharpener'], emoji: '✂️', hintPl: 'Bezpieczne narzędzie do wycinania papieru.', exampleEn: 'Cut the paper with scissors.', examplePl: 'Wytnij papier nożyczkami.', phoneticTip: '[ˈsɪz.əz]' },
      { id: 'sch_10', english: 'crayon', polish: 'kredka', category: 'school', level: 1, distractors: ['pencil', 'pen', 'sharpener'], emoji: '🖍️', hintPl: 'Kolorowa, służy do kolorowania rysunków.', exampleEn: 'Color the sun with a yellow crayon.', examplePl: 'Pokoloruj słońce żółtą kredką.', phoneticTip: '[ˈkreɪ.ɒn]' },
      { id: 'sch_11', english: 'sharpener', polish: 'temperówka', category: 'school', level: 2, distractors: ['eraser', 'pencil', 'scissors'], emoji: '✏️', hintPl: 'Ostrzy złamane ołówki i kredki.', exampleEn: 'My sharpener makes pencils sharp.', examplePl: 'Moja temperówka ostrzy ołówki.', phoneticTip: '[ˈʃɑːp.nər]' },
      { id: 'sch_12', english: 'board', polish: 'tablica', category: 'school', level: 2, distractors: ['desk', 'window', 'book'], emoji: '📋', hintPl: 'Wisi na ścianie w klasie, pisze się na niej kredą.', exampleEn: 'Look at the board!', examplePl: 'Spójrzcie na tablicę!', phoneticTip: '[bɔːd]' },
      { id: 'sch_13', english: 'chair', polish: 'krzesło', category: 'school', level: 1, distractors: ['desk', 'table', 'bed'], emoji: '🪑', hintPl: 'Do siedzenia przy biurku.', exampleEn: 'Pull up a comfortable chair.', examplePl: 'Przysuń wygodne krzesło.', phoneticTip: '[tʃeər]' },
      { id: 'sch_14', english: 'computer', polish: 'komputer', category: 'school', level: 2, distractors: ['book', 'pencil case', 'board'], emoji: '💻', hintPl: 'Do nauki informatyki i gier.', exampleEn: 'We learn on a computer.', examplePl: 'Uczymy się na komputerze.', phoneticTip: '[kəmˈpjuː.tər]' },
      { id: 'sch_15', english: 'pencil case', polish: 'piórnik', category: 'school', level: 2, distractors: ['bag', 'notebook', 'desk'], emoji: '👝', hintPl: 'Etui z suwakiem na wszystkie przybory.', exampleEn: 'Put pencils inside the pencil case.', examplePl: 'Włóż ołówki do piórnika.', phoneticTip: '[ˈpen.səl keɪs]' }
    ]
  },
  {
    id: 'house',
    nameEn: 'Cozy House Island',
    namePl: 'Przytulny Dom i Pokoje',
    descriptionPl: 'Zajrzyj do przytulnego domku, poznaj meble i nazwy pomieszczeń!',
    themeColor: '#8b5cf6',
    skyColor: '#c4b5fd',
    fogColor: '#ede9fe',
    groundColor: '#6d28d9',
    accentColor: '#a78bfa',
    timeOfDay: 'sunset',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    npc: {
      id: 'alex_home',
      name: 'Alex Explorer',
      rolePl: 'Przyjazny Gospodarz',
      roleEn: 'House Builder',
      dialogueIntroEn: "Welcome to my home! Help me label all the furniture in every room!",
      dialogueIntroPl: "Witaj w moim domu! Pomóż mi podpisać wszystkie meble w pokojach!",
      color: '#8b5cf6',
      islandId: 'house',
      position: { x: 0, y: 0.5, z: -32 }
    },
    gateCategories: [
      { id: 'cat_house', nameEn: 'House & Furniture', namePl: 'Dom i Meble', isCorrect: true },
      { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: false },
      { id: 'cat_weather', nameEn: 'Weather', namePl: 'Pogoda', isCorrect: false },
      { id: 'cat_clothes', nameEn: 'Clothes', namePl: 'Ubrania', isCorrect: false }
    ],
    words: [
      { id: 'hou_1', english: 'bed', polish: 'łóżko', category: 'house', level: 1, distractors: ['sofa', 'table', 'chair'], emoji: '🛏️', hintPl: 'Z miękką poduszką do spania w nocy.', exampleEn: 'Time to go to bed.', examplePl: 'Czas iść do łóżka.', phoneticTip: '[bed]' },
      { id: 'hou_2', english: 'table', polish: 'stół', category: 'house', level: 1, distractors: ['desk', 'chair', 'bed'], emoji: '🪵', hintPl: 'Duży, przy którym cała rodzina je obiad.', exampleEn: 'Put the plates on the table.', examplePl: 'Połóż talerze na stole.', phoneticTip: '[ˈteɪ.bəl]' },
      { id: 'hou_3', english: 'sofa', polish: 'kanapa / sofa', category: 'house', level: 1, distractors: ['chair', 'bed', 'carpet'], emoji: '🛋️', hintPl: 'Wygodna w salonie do oglądania filmów.', exampleEn: 'Sit on the soft sofa.', examplePl: 'Usiądź na miękkiej sofie.', phoneticTip: '[ˈsəʊ.fə]' },
      { id: 'hou_4', english: 'lamp', polish: 'lampa', category: 'house', level: 1, distractors: ['clock', 'mirror', 'window'], emoji: '💡', hintPl: 'Daje jasne światło po zmroku.', exampleEn: 'Turn on the desk lamp.', examplePl: 'Włącz lampkę biurkową.', phoneticTip: '[læmp]' },
      { id: 'hou_5', english: 'door', polish: 'drzwi', category: 'house', level: 1, distractors: ['window', 'table', 'wall'], emoji: '🚪', hintPl: 'Otwierasz je klamką, by wejść do pokoju.', exampleEn: 'Please close the front door.', examplePl: 'Proszę zamknij drzwi wejściowe.', phoneticTip: '[dɔːr]' },
      { id: 'hou_6', english: 'window', polish: 'okno', category: 'house', level: 1, distractors: ['door', 'mirror', 'lamp'], emoji: '🪟', hintPl: 'Szklane, wpada przez nie słońce.', exampleEn: 'Look out the big window.', examplePl: 'Wyjrzyj przez duże okno.', phoneticTip: '[ˈwɪn.dəʊ]' },
      { id: 'hou_7', english: 'kitchen', polish: 'kuchnia (pomieszczenie)', category: 'house', level: 2, distractors: ['bedroom', 'bathroom', 'hall'], emoji: '🍳', hintPl: 'Pokój, gdzie gotujemy pyszne posiłki.', exampleEn: 'Mom is cooking in the kitchen.', examplePl: 'Mama gotuje w kuchni.', phoneticTip: '[ˈkɪtʃ.ɪn]' },
      { id: 'hou_8', english: 'bedroom', polish: 'sypialnia', category: 'house', level: 2, distractors: ['kitchen', 'bathroom', 'garden'], emoji: '🛌', hintPl: 'Pokój, w którym stoi łóżko i śpimy.', exampleEn: 'My bedroom is cozy.', examplePl: 'Moja sypialnia jest przytulna.', phoneticTip: '[ˈbed.ruːm]' },
      { id: 'hou_9', english: 'clock', polish: 'zegar', category: 'house', level: 1, distractors: ['lamp', 'mirror', 'picture'], emoji: '⏰', hintPl: 'Wskazuje godziny i minuty na ścianie.', exampleEn: 'The clock shows seven o’clock.', examplePl: 'Zegar wskazuje godzinę siódmą.', phoneticTip: '[klɒk]' },
      { id: 'hou_10', english: 'mirror', polish: 'lustro', category: 'house', level: 2, distractors: ['window', 'picture', 'door'], emoji: '🪞', hintPl: 'Widzisz w nim swoje odbicie.', exampleEn: 'Look in the bathroom mirror.', examplePl: 'Spójrz w lustro łazienkowe.', phoneticTip: '[ˈmɪr.ər]' },
      { id: 'hou_11', english: 'carpet', polish: 'dywan', category: 'house', level: 2, distractors: ['sofa', 'table', 'bed'], emoji: '🧶', hintPl: 'Miękkie pokrycie na podłodze.', exampleEn: 'A colorful carpet on the floor.', examplePl: 'Kolorowy dywan na podłodze.', phoneticTip: '[ˈkɑː.pɪt]' },
      { id: 'hou_12', english: 'wardrobe', polish: 'szafa', category: 'house', level: 2, distractors: ['bed', 'desk', 'sofa'], emoji: '🚪', hintPl: 'Wieszasz w niej swoje ubrania i kurtki.', exampleEn: 'Hang your coat in the wardrobe.', examplePl: 'Powieś płaszcz w szafie.', phoneticTip: '[ˈwɔː.drəʊb]' },
      { id: 'hou_13', english: 'bath', polish: 'wanna', category: 'house', level: 2, distractors: ['bed', 'table', 'chair'], emoji: '🛁', hintPl: 'Napełniasz ją ciepłą wodą i pianą.', exampleEn: 'Take a warm bubble bath.', examplePl: 'Weź ciepłą kąpiel z pianą.', phoneticTip: '[bɑːθ]' },
      { id: 'hou_14', english: 'garden', polish: 'ogród', category: 'house', level: 2, distractors: ['kitchen', 'bedroom', 'door'], emoji: '🏡', hintPl: 'Trawa, kwiaty i drzewa za domem.', exampleEn: 'We play games in the garden.', examplePl: 'Bawimy się w ogrodzie.', phoneticTip: '[ˈɡɑː.dən]' },
      { id: 'hou_15', english: 'television', polish: 'telewizor', category: 'house', level: 2, distractors: ['computer', 'clock', 'lamp'], emoji: '📺', hintPl: 'Ekran w salonie do oglądania bajek.', exampleEn: 'Watch cartoons on television.', examplePl: 'Oglądaj bajki w telewizji.', phoneticTip: '[ˈtel.ɪ.vɪʒ.ən]' }
    ]
  },
  {
    id: 'colors_numbers',
    nameEn: 'Rainbow Spectrum Island',
    namePl: 'Tęczowa Wyspa Barw i Liczb',
    descriptionPl: 'Kolorowe kryształy i magiczne cyfry czekają na ułożenie!',
    themeColor: '#ec4899',
    skyColor: '#fbcfe8',
    fogColor: '#fce7f3',
    groundColor: '#db2777',
    accentColor: '#f472b6',
    timeOfDay: 'dawn',
    unlockedByDefault: true,
    unlockCostCoins: 0,
    npc: {
      id: 'prism_bot',
      name: 'Prism BEEP',
      rolePl: 'Kolorowy Robot Liczący',
      roleEn: 'Rainbow Arithmetic Bot',
      dialogueIntroEn: "BEEP! Rainbow beams calibrated! Count the steps and name the colors!",
      dialogueIntroPl: "PIK! Tęczowe wiązki skalibrowane! Policz kroki i nazwij barwy!",
      color: '#ec4899',
      islandId: 'colors_numbers',
      position: { x: 23, y: 0.5, z: 23 }
    },
    gateCategories: [
      { id: 'cat_colors', nameEn: 'Colors & Numbers', namePl: 'Kolory i Liczby', isCorrect: true },
      { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: false },
      { id: 'cat_school', nameEn: 'School', namePl: 'Szkoła', isCorrect: false },
      { id: 'cat_food', nameEn: 'Food', namePl: 'Jedzenie', isCorrect: false }
    ],
    words: [
      { id: 'col_1', english: 'red', polish: 'czerwony', category: 'colors_numbers', level: 1, distractors: ['blue', 'green', 'yellow'], emoji: '🔴', hintPl: 'Kolor truskawki, pomidora i serduszka.', exampleEn: 'A bright red balloon.', examplePl: 'Jasnoczerwony balonik.', phoneticTip: '[red]' },
      { id: 'col_2', english: 'blue', polish: 'niebieski', category: 'colors_numbers', level: 1, distractors: ['red', 'green', 'pink'], emoji: '🔵', hintPl: 'Kolor bezchmurnego nieba i morza.', exampleEn: 'The sea is deep blue.', examplePl: 'Morze jest ciemnoniebieskie.', phoneticTip: '[bluː]' },
      { id: 'col_3', english: 'green', polish: 'zielony', category: 'colors_numbers', level: 1, distractors: ['yellow', 'brown', 'black'], emoji: '🟢', hintPl: 'Kolor trawy, żabki i liści na drzewie.', exampleEn: 'Frogs are jumpy and green.', examplePl: 'Żabki są skoczne i zielone.', phoneticTip: '[ɡriːn]' },
      { id: 'col_4', english: 'yellow', polish: 'żółty', category: 'colors_numbers', level: 1, distractors: ['orange', 'white', 'red'], emoji: '🟡', hintPl: 'Kolor słońca i dojrzałego banana.', exampleEn: 'The warm yellow sun.', examplePl: 'Ciepłe żółte słońce.', phoneticTip: '[ˈjel.əʊ]' },
      { id: 'col_5', english: 'orange', polish: 'pomarańczowy', category: 'colors_numbers', level: 1, distractors: ['red', 'yellow', 'brown'], emoji: '🟠', hintPl: 'Mieszanka czerwonego i żółtego, kolor marchewki.', exampleEn: 'An orange butterfly.', examplePl: 'Pomarańczowy motyl.', phoneticTip: '[ˈɒr.ɪndʒ]' },
      { id: 'col_6', english: 'purple', polish: 'fioletowy', category: 'colors_numbers', level: 2, distractors: ['pink', 'blue', 'black'], emoji: '🟣', hintPl: 'Królewski kolor borówek i śliwek.', exampleEn: 'Sweet purple plums.', examplePl: 'Słodkie fioletowe śliwki.', phoneticTip: '[ˈpɜː.pəl]' },
      { id: 'col_7', english: 'pink', polish: 'różowy', category: 'colors_numbers', level: 1, distractors: ['red', 'purple', 'white'], emoji: '🌸', hintPl: 'Delikatny kolor waty cukrowej i flaminga.', exampleEn: 'Pink flowers in spring.', examplePl: 'Różowe kwiaty na wiosnę.', phoneticTip: '[pɪŋk]' },
      { id: 'col_8', english: 'black', polish: 'czarny', category: 'colors_numbers', level: 1, distractors: ['white', 'brown', 'blue'], emoji: '⚫', hintPl: 'Ciemny jak nocne niebo bez gwiazd.', exampleEn: 'A cute black kitten.', examplePl: 'Uroczy czarny kotek.', phoneticTip: '[blæk]' },
      { id: 'col_9', english: 'white', polish: 'biały', category: 'colors_numbers', level: 1, distractors: ['black', 'yellow', 'grey'], emoji: '⚪', hintPl: 'Jasny jak śnieg i puszysta chmurka.', exampleEn: 'White snow in winter.', examplePl: 'Biały śnieg zimą.', phoneticTip: '[waɪt]' },
      { id: 'col_10', english: 'brown', polish: 'brązowy', category: 'colors_numbers', level: 1, distractors: ['green', 'black', 'red'], emoji: '🟤', hintPl: 'Kolor kory drzewa i czekolady.', exampleEn: 'A friendly brown dog.', examplePl: 'Przyjazny brązowy pies.', phoneticTip: '[braʊn]' },
      { id: 'col_11', english: 'one', polish: 'jeden (1)', category: 'colors_numbers', level: 1, distractors: ['two', 'three', 'four'], emoji: '1️⃣', hintPl: 'Pierwsza liczba, masz jeden nos.', exampleEn: 'I have got one nose.', examplePl: 'Mam jeden nos.', phoneticTip: '[wʌn]' },
      { id: 'col_12', english: 'two', polish: 'dwa (2)', category: 'colors_numbers', level: 1, distractors: ['one', 'three', 'five'], emoji: '2️⃣', hintPl: 'Tyle masz oczu i uszu.', exampleEn: 'Two eyes to see the world.', examplePl: 'Dwoje oczu, by widzieć świat.', phoneticTip: '[tuː]' },
      { id: 'col_13', english: 'three', polish: 'trzy (3)', category: 'colors_numbers', level: 1, distractors: ['four', 'five', 'two'], emoji: '3️⃣', hintPl: 'Liczba kątów w trójkącie.', exampleEn: 'Three little kittens.', examplePl: 'Trzy małe kotki.', phoneticTip: '[θriː]' },
      { id: 'col_14', english: 'four', polish: 'cztery (4)', category: 'colors_numbers', level: 1, distractors: ['five', 'three', 'ten'], emoji: '4️⃣', hintPl: 'Tyle nóg ma pies, stół i krzesło.', exampleEn: 'A chair has four legs.', examplePl: 'Krzesło ma cztery nogi.', phoneticTip: '[fɔːr]' },
      { id: 'col_15', english: 'five', polish: 'pięć (5)', category: 'colors_numbers', level: 1, distractors: ['four', 'ten', 'six'], emoji: '5️⃣', hintPl: 'Tyle palców masz u jednej dłoni.', exampleEn: 'High five, explorer!', examplePl: 'Przybita piątka, odkrywco!', phoneticTip: '[faɪv]' },
      { id: 'col_16', english: 'ten', polish: 'dziesięć (10)', category: 'colors_numbers', level: 2, distractors: ['five', 'eight', 'seven'], emoji: '🔟', hintPl: 'Tyle palców masz u obu dłoni razem.', exampleEn: 'Count from one to ten.', examplePl: 'Policz od jednego do dziesięciu.', phoneticTip: '[ten]' }
    ]
  },
  {
    id: 'body_clothes',
    nameEn: 'Fashion & Body Island',
    namePl: 'Wyspa Mody i Ciała',
    descriptionPl: 'Poznaj części ciała, super ciuchy, buty i akcesoria na każdą pogodę!',
    themeColor: '#06b6d4',
    skyColor: '#a5f3fc',
    fogColor: '#cffafe',
    groundColor: '#0891b2',
    accentColor: '#22d3ee',
    timeOfDay: 'noon',
    unlockedByDefault: false,
    unlockCostCoins: 15,
    npc: {
      id: 'stylist_maya',
      name: 'Maya Fashion',
      rolePl: 'Projektantka Mody',
      roleEn: 'Wardrobe Stylist',
      dialogueIntroEn: "Hi! Dressing up is an adventure! Touch your head and let's name parts of the body!",
      dialogueIntroPl: "Cześć! Ubieranie się to przygoda! Dotknij głowy i nazwijmy części ciała i ubrań!",
      color: '#06b6d4',
      islandId: 'body_clothes',
      position: { x: -23, y: 0.5, z: 23 }
    },
    gateCategories: [
      { id: 'cat_clothes', nameEn: 'Body & Clothes', namePl: 'Ciało i Ubrania', isCorrect: true },
      { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: false },
      { id: 'cat_food', nameEn: 'Food', namePl: 'Jedzenie', isCorrect: false },
      { id: 'cat_weather', nameEn: 'Weather', namePl: 'Pogoda', isCorrect: false }
    ],
    words: [
      { id: 'bod_1', english: 'head', polish: 'głowa', category: 'body_clothes', level: 1, distractors: ['hand', 'leg', 'eye'], emoji: '🗣️', hintPl: 'Nosisz na niej czapkę i w niej myślisz.', exampleEn: 'Nod your head yes.', examplePl: 'Skinij głową na tak.', phoneticTip: '[hed]' },
      { id: 'bod_2', english: 'hand', polish: 'dłoń / ręka', category: 'body_clothes', level: 1, distractors: ['head', 'leg', 'foot'], emoji: '✋', hintPl: 'Macha na powitanie i trzyma długopis.', exampleEn: 'Clap your hands together!', examplePl: 'Zklaśnij w dłonie!', phoneticTip: '[hænd]' },
      { id: 'bod_3', english: 'leg', polish: 'noga', category: 'body_clothes', level: 1, distractors: ['hand', 'head', 'nose'], emoji: '🦵', hintPl: 'Biegasz i skaczesz dzięki niej.', exampleEn: 'Stand on one leg.', examplePl: 'Stań na jednej nodze.', phoneticTip: '[leɡ]' },
      { id: 'bod_4', english: 'eye', polish: 'oko', category: 'body_clothes', level: 1, distractors: ['ear', 'nose', 'mouth'], emoji: '👁️', hintPl: 'Służy do patrzenia na świat.', exampleEn: 'I see with my eyes.', examplePl: 'Widzę moimi oczami.', phoneticTip: '[aɪ]' },
      { id: 'bod_5', english: 'ear', polish: 'ucho', category: 'body_clothes', level: 1, distractors: ['eye', 'nose', 'mouth'], emoji: '👂', hintPl: 'Słuchasz nim muzyki i słówek.', exampleEn: 'Listen with your ears.', examplePl: 'Słuchaj swoimi uszami.', phoneticTip: '[ɪər]' },
      { id: 'bod_6', english: 'nose', polish: 'nos', category: 'body_clothes', level: 1, distractors: ['mouth', 'eye', 'ear'], emoji: '👃', hintPl: 'Czujesz nim zapachy kwiatów i obiadu.', exampleEn: 'Touch your nose gently.', examplePl: 'Dotknij delikatnie nosa.', phoneticTip: '[nəʊz]' },
      { id: 'bod_7', english: 'mouth', polish: 'usta', category: 'body_clothes', level: 1, distractors: ['nose', 'eye', 'head'], emoji: '👄', hintPl: 'Uśmiechasz się nimi i mówisz po angielsku.', exampleEn: 'A big happy mouth smile.', examplePl: 'Wielki wesoły uśmiech ust.', phoneticTip: '[maʊθ]' },
      { id: 'bod_8', english: 't-shirt', polish: 'koszulka z krótkim rękawkiem', category: 'body_clothes', level: 1, distractors: ['jacket', 'dress', 'trousers'], emoji: '👕', hintPl: 'Wygodna koszulka na lato.', exampleEn: 'A blue cotton t-shirt.', examplePl: 'Niebieska bawełniana koszulka.', phoneticTip: '[ˈtiː.ʃɜːt]' },
      { id: 'bod_9', english: 'trousers', polish: 'spodnie', category: 'body_clothes', level: 2, distractors: ['skirt', 't-shirt', 'jacket'], emoji: '👖', hintPl: 'Mają dwie nogawki i kieszenie.', exampleEn: 'Put on warm trousers.', examplePl: 'Załóż ciepłe spodnie.', phoneticTip: '[ˈtraʊ.zəz]' },
      { id: 'bod_10', english: 'shoes', polish: 'buty', category: 'body_clothes', level: 1, distractors: ['socks', 'boots', 'hat'], emoji: '👟', hintPl: 'Wkładasz je na stopy przed wyjściem na spacer.', exampleEn: 'Tie your sports shoes.', examplePl: 'Zawiąż swoje buty sportowe.', phoneticTip: '[ʃuːz]' },
      { id: 'bod_11', english: 'jacket', polish: 'kurtka', category: 'body_clothes', level: 2, distractors: ['t-shirt', 'dress', 'shoes'], emoji: '🧥', hintPl: 'Ciepłe okrycie z zamkiem na chłodne dni.', exampleEn: 'Zip up your warm jacket.', examplePl: 'Zasuwaj ciepłą kurtkę.', phoneticTip: '[ˈdʒæk.ɪt]' },
      { id: 'bod_12', english: 'dress', polish: 'sukienka', category: 'body_clothes', level: 1, distractors: ['skirt', 't-shirt', 'trousers'], emoji: '👗', hintPl: 'Eleganckie kobiece ubranie na przyjęcie.', exampleEn: 'A pretty yellow dress.', examplePl: 'Ładna żółta sukienka.', phoneticTip: '[dres]' },
      { id: 'bod_13', english: 'socks', polish: 'skarpetki', category: 'body_clothes', level: 1, distractors: ['shoes', 'boots', 'trousers'], emoji: '🧦', hintPl: 'Wkładasz je na stopy przed butami.', exampleEn: 'Clean striped socks.', examplePl: 'Czyste skarpetki w paski.', phoneticTip: '[sɒks]' },
      { id: 'bod_14', english: 'hat', polish: 'czapka / kapelusz', category: 'body_clothes', level: 1, distractors: ['jacket', 'shoes', 'socks'], emoji: '🧢', hintPl: 'Chroni głowę przed słońcem lub chłodem.', exampleEn: 'Wear a cap on sunny days.', examplePl: 'Noś czapkę w słoneczne dni.', phoneticTip: '[hæt]' },
      { id: 'bod_15', english: 'skirt', polish: 'spódniczka', category: 'body_clothes', level: 2, distractors: ['dress', 'trousers', 'jacket'], emoji: '🩳', hintPl: 'Krótsza od sukienki, noszona od pasa.', exampleEn: 'A twirling pleated skirt.', examplePl: 'Wirująca plisowana spódniczka.', phoneticTip: '[skɜːt]' },
      { id: 'bod_16', english: 'boots', polish: 'kozaki / botki zimowe', category: 'body_clothes', level: 2, distractors: ['shoes', 'socks', 'trousers'], emoji: '👢', hintPl: 'Wysokie buty na śnieg i kałuże.', exampleEn: 'Warm winter boots for snow.', examplePl: 'Ciepłe zimowe buty na śnieg.', phoneticTip: '[buːts]' }
    ]
  },
  {
    id: 'weather_seasons',
    nameEn: 'Sky & Seasons Island',
    namePl: 'Wyspa Pogody i Pór Roku',
    descriptionPl: 'Odkryj słońce, deszcz, tęczę i cztery pory roku w dynamicznym klimacie!',
    themeColor: '#0ea5e9',
    skyColor: '#bae6fd',
    fogColor: '#e0f2fe',
    groundColor: '#0284c7',
    accentColor: '#38bdf8',
    timeOfDay: 'night',
    unlockedByDefault: false,
    unlockCostCoins: 20,
    npc: {
      id: 'storm_watcher',
      name: 'Sky Pilot Stormy',
      rolePl: 'Obserwator Pogody',
      roleEn: 'Meteorologist & Pilot',
      dialogueIntroEn: "Greetings! The weather changes every hour here. Look at the sky and tell me what you see!",
      dialogueIntroPl: "Witaj! Pogoda zmienia się tu co godzinę. Spójrz w niebo i powiedz, co widzisz!",
      color: '#0ea5e9',
      islandId: 'weather_seasons',
      position: { x: -23, y: 0.5, z: -23 }
    },
    gateCategories: [
      { id: 'cat_weather', nameEn: 'Weather & Seasons', namePl: 'Pogoda i Pory Roku', isCorrect: true },
      { id: 'cat_clothes', nameEn: 'Clothes', namePl: 'Ubrania', isCorrect: false },
      { id: 'cat_food', nameEn: 'Food', namePl: 'Jedzenie', isCorrect: false },
      { id: 'cat_school', nameEn: 'School', namePl: 'Szkoła', isCorrect: false }
    ],
    words: [
      { id: 'wea_1', english: 'sunny', polish: 'słonecznie', category: 'weather_seasons', level: 1, distractors: ['rainy', 'cloudy', 'snowy'], emoji: '☀️', hintPl: 'Świeci jasne słonko i nie ma chmur.', exampleEn: 'It is a sunny summer day.', examplePl: 'Jest słoneczny letni dzień.', phoneticTip: '[ˈsʌn.i]' },
      { id: 'wea_2', english: 'rainy', polish: 'deszczowo', category: 'weather_seasons', level: 1, distractors: ['sunny', 'windy', 'snowy'], emoji: '🌧️', hintPl: 'Kropelki wody spadają z chmur, potrzebujesz parasola.', exampleEn: 'Take an umbrella, it is rainy.', examplePl: 'Weź parasol, pada deszcz.', phoneticTip: '[ˈreɪ.ni]' },
      { id: 'wea_3', english: 'windy', polish: 'wietrznie', category: 'weather_seasons', level: 1, distractors: ['sunny', 'cloudy', 'cold'], emoji: '💨', hintPl: 'Wiatr porusza gałęziami i puszcza latawce.', exampleEn: 'Flying a kite on a windy hill.', examplePl: 'Puszczanie latawca na wietrznym wzgórzu.', phoneticTip: '[ˈwɪn.di]' },
      { id: 'wea_4', english: 'snowy', polish: 'śnieżnie', category: 'weather_seasons', level: 1, distractors: ['rainy', 'warm', 'sunny'], emoji: '❄️', hintPl: 'Lecą białe płatki śniegu i lepimy bałwana.', exampleEn: 'Snowy day is fun for snowman.', examplePl: 'Śnieżny dzień jest super na bałwana.', phoneticTip: '[ˈsnəʊ.i]' },
      { id: 'wea_5', english: 'cloudy', polish: 'pochmurno', category: 'weather_seasons', level: 1, distractors: ['sunny', 'windy', 'warm'], emoji: '☁️', hintPl: 'Szare chmury zasłaniają błękitne niebo.', exampleEn: 'The sky is gray and cloudy.', examplePl: 'Niebo jest szare i pochmurne.', phoneticTip: '[ˈklaʊ.di]' },
      { id: 'wea_6', english: 'warm', polish: 'ciepło', category: 'weather_seasons', level: 1, distractors: ['cold', 'rainy', 'snowy'], emoji: '🌡️', hintPl: 'Przyjemna temperatura, nie potrzebujesz kurtki.', exampleEn: 'Warm spring afternoon.', examplePl: 'Ciepłe wiosenne popołudnie.', phoneticTip: '[wɔːm]' },
      { id: 'wea_7', english: 'cold', polish: 'zimno', category: 'weather_seasons', level: 1, distractors: ['warm', 'sunny', 'summer'], emoji: '🥶', hintPl: 'Brr! Niska temperatura, trzeba ubrać czapkę i szalik.', exampleEn: 'It is very cold outside.', examplePl: 'Na zewnątrz jest bardzo zimno.', phoneticTip: '[kəʊld]' },
      { id: 'wea_8', english: 'summer', polish: 'lato', category: 'weather_seasons', level: 2, distractors: ['winter', 'spring', 'autumn'], emoji: '🏖️', hintPl: 'Najcieplejsza pora roku i wakacje nad wodą.', exampleEn: 'Summer holiday at the beach.', examplePl: 'Letnie wakacje na plaży.', phoneticTip: '[ˈsʌm.ər]' },
      { id: 'wea_9', english: 'winter', polish: 'zima', category: 'weather_seasons', level: 2, distractors: ['summer', 'autumn', 'spring'], emoji: '⛄', hintPl: 'Pora roku ze śniegiem, mrozem i jazdą na sankach.', exampleEn: 'Winter brings ice and snow.', examplePl: 'Zima przynosi lód i śnieg.', phoneticTip: '[ˈwɪn.tər]' },
      { id: 'wea_10', english: 'spring', polish: 'wiosna', category: 'weather_seasons', level: 2, distractors: ['autumn', 'winter', 'summer'], emoji: '🌱', hintPl: 'Budzi się przyroda i kwitną pierwsze kwiaty.', exampleEn: 'Green leaves sprout in spring.', examplePl: 'Zielone liście kiełkują na wiosnę.', phoneticTip: '[sprɪŋ]' },
      { id: 'wea_11', english: 'autumn', polish: 'jesień', category: 'weather_seasons', level: 2, distractors: ['spring', 'summer', 'winter'], emoji: '🍂', hintPl: 'Kolorowe liście spadają z drzew, kasztany w parku.', exampleEn: 'Golden leaves fall in autumn.', examplePl: 'Złote liście opadają jesienią.', phoneticTip: '[ˈɔː.təm]' },
      { id: 'wea_12', english: 'rainbow', polish: 'tęcza', category: 'weather_seasons', level: 2, distractors: ['cloud', 'storm', 'sun'], emoji: '🌈', hintPl: 'Siedem barw na niebie po deszczu w słońcu.', exampleEn: 'Look, a magical rainbow!', examplePl: 'Spójrz, magiczna tęcza!', phoneticTip: '[ˈreɪn.bəʊ]' },
      { id: 'wea_13', english: 'storm', polish: 'burza', category: 'weather_seasons', level: 3, distractors: ['sunny', 'warm', 'rainbow'], emoji: '⛈️', hintPl: 'Błyskawice, grzmoty i ulewny deszcz.', exampleEn: 'Thunder roars in the storm.', examplePl: 'Grzmot ryczy w czasie burzy.', phoneticTip: '[stɔːm]' },
      { id: 'wea_14', english: 'sky', polish: 'niebo', category: 'weather_seasons', level: 1, distractors: ['sun', 'cloud', 'storm'], emoji: '🌌', hintPl: 'Niebieska przestrzeń nad naszymi głowami.', exampleEn: 'Stars twinkle in the night sky.', examplePl: 'Gwiazdy migoczą na nocnym niebie.', phoneticTip: '[skaɪ]' },
      { id: 'wea_15', english: 'sun', polish: 'słońce', category: 'weather_seasons', level: 1, distractors: ['cloud', 'sky', 'rain'], emoji: '🌞', hintPl: 'Wielka żółta gwiazda dająca ciepło i światło.', exampleEn: 'The golden sun rises.', examplePl: 'Wschodzi złote słońce.', phoneticTip: '[sʌn]' },
      { id: 'wea_16', english: 'cloud', polish: 'chmura', category: 'weather_seasons', level: 1, distractors: ['sky', 'sun', 'rainbow'], emoji: '⛅', hintPl: 'Biały kłębek na błękitnym niebie.', exampleEn: 'Fluffy white cloud floats by.', examplePl: 'Puszysta biała chmurka przepływa obok.', phoneticTip: '[klaʊd]' }
    ]
  }
];

/* ==========================================================================
   2. BADGES & ACHIEVEMENTS (SYSTEM ODZNAK)
   ========================================================================== */

export const BADGES_DATA: BadgeItem[] = [
  { id: 'first_quest', namePl: 'Pierwsza Misja', descriptionPl: 'Ukończono pierwszą misję edukacyjną w Wordland.', iconName: 'Compass' },
  { id: 'word_collector_5', namePl: 'Zbieracz Liter', descriptionPl: 'Zebrano 5 słów w mini-grze Word Collector.', iconName: 'Layers' },
  { id: 'gate_master', namePl: 'Mistrz Bram', descriptionPl: 'Poprawnie posegregowano 5 kategorii w bramach logicznych.', iconName: 'DoorOpen' },
  { id: 'riddle_sage', namePl: 'Mędrzec Zagadek', descriptionPl: 'Udzielono 5 poprawnych odpowiedzi w zagadkach NPC.', iconName: 'HelpCircle' },
  { id: 'scramble_champ', namePl: 'Mistrz Ortografii', descriptionPl: 'Ułożono 5 słów w poprawnej kolejności z liter.', iconName: 'Sparkles' },
  { id: 'listen_expert', namePl: 'Sokole Ucho', descriptionPl: 'Rozpoznano 5 słów wyłącznie ze słuchu (TTS).', iconName: 'Ear' },
  { id: 'perfect_10', namePl: 'Bezbłędny Uczeń (10)', descriptionPl: 'Odpowiedziano poprawnie na 10 pytań z rzędu bez błędu.', iconName: 'Target' },
  { id: 'island_explorer', namePl: 'Odkrywca Nowych Ziem', descriptionPl: 'Odblokowano nową wyspę za monety.', iconName: 'MapPin' },
  { id: 'fashion_star', namePl: 'Ikona Stylu', descriptionPl: 'Kupiono pierwsze nakrycie głowy lub skrzydła w sklepie.', iconName: 'Crown' },
  { id: 'streak_3', namePl: 'Codzienny Uczeń', descriptionPl: 'Odwiedzono Wordland 3 dni z rzędu (seria dni).', iconName: 'Flame' },
  { id: 'leitner_pro', namePl: 'Pogromca Trudnych Słów', descriptionPl: 'Powtórzono i zapamiętano 5 trudnych słów w Fiszkach.', iconName: 'RotateCcw' },
  { id: 'voice_hero', namePl: 'Mówca Wordland', descriptionPl: 'Wypowiedziano angielskie słówko do mikrofonu.', iconName: 'Mic' }
];

/* ==========================================================================
   3. AVATAR SHOP ITEMS & UPGRADES
   ========================================================================== */

export const SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: 'hat_cap', namePl: 'Czapka z daszkiem', category: 'hat', cost: 10, color: '#ef4444', descriptionPl: 'Klasyczna czerwona bejsbolówka.' },
  { id: 'hat_wizard', namePl: 'Czapka Czarodzieja', category: 'hat', cost: 25, color: '#8b5cf6', descriptionPl: 'Magiczny kapelusz z gwiazdami.' },
  { id: 'hat_crown', namePl: 'Złota Korona', category: 'hat', cost: 40, color: '#fbbf24', descriptionPl: 'Królewska korona z błyszczącymi klejnotami.' },
  { id: 'hat_explorer', namePl: 'Kask Odkrywcy', category: 'hat', cost: 15, color: '#10b981', descriptionPl: 'Kask safari z latarką.' },

  // Wings
  { id: 'wings_angel', namePl: 'Skrzydła Anioła', category: 'wings', cost: 30, color: '#ffffff', descriptionPl: 'Piórowe białe skrzydła unoszące w powietrzu.' },
  { id: 'wings_cyber', namePl: 'Skrzydła Cyber-Neon', category: 'wings', cost: 35, color: '#06b6d4', descriptionPl: 'Świetlne neonowe skrzydła robota.' },
  { id: 'wings_dragon', namePl: 'Smocze Skrzydła', category: 'wings', cost: 45, color: '#dc2626', descriptionPl: 'Ogniste skrzydła legendarnego smoka.' },

  // Trail Effects
  { id: 'trail_sparkles', namePl: 'Iskrzący Ślad', category: 'trail', cost: 15, color: '#fef08a', descriptionPl: 'Złote iskry sypiące się pod stopami.' },
  { id: 'trail_rainbow', namePl: 'Tęczowa Ścieżka', category: 'trail', cost: 25, color: '#ec4899', descriptionPl: 'Kalejdoskop barw w biegu.' },
  { id: 'trail_ice', namePl: 'Lodowe Kryształki', category: 'trail', cost: 20, color: '#38bdf8', descriptionPl: 'Mróz i płatki śniegu za postacią.' },

  // Island Unlocks
  { id: 'unlock_clothes', namePl: 'Odblokuj: Wyspa Ciała i Mody', category: 'island', cost: 15, islandId: 'body_clothes', descriptionPl: 'Otwórz bramę na 6. wyspę z ubraniami i częściami ciała!' },
  { id: 'unlock_weather', namePl: 'Odblokuj: Wyspa Pogody i Nieba', category: 'island', cost: 20, islandId: 'weather_seasons', descriptionPl: 'Otwórz bramę na 7. wyspę z klimatem i 4 porami roku!' }
];
