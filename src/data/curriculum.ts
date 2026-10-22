import { QuestVariant, WordItem, NPCData } from '../types/game';

export const NPCS_DATA: NPCData[] = [
  {
    id: 'alex',
    name: 'Alex',
    rolePl: 'Przewodnik i Odkrywca',
    roleEn: 'Explorer Guide',
    dialogueIntroEn: "Hello, explorer! Ready to solve the mystery of the Word Storm?",
    dialogueIntroPl: "Cześć, odkrywco! Gotowy na rozwiązanie tajemnicy Burzy Słów?",
    color: '#3b82f6',
    icon: '🧭',
    position: { x: 0, y: 0, z: -5 }
  },
  {
    id: 'beep',
    name: 'BEEP',
    rolePl: 'Robot Językowy i Asystent Wymowy',
    roleEn: 'Language Assistant Robot',
    dialogueIntroEn: "BEEP-BOOP! Language circuits online! Let's practice English words!",
    dialogueIntroPl: "PIK-PIK! Obwody językowe sprawne! Poćwiczmy angielskie słówka!",
    color: '#06b6d4',
    icon: '🤖',
    position: { x: 8, y: 0, z: -10 }
  },
  {
    id: 'foxy',
    name: 'Foxy',
    rolePl: 'Sprytny Kupiec z Ryneczku',
    roleEn: 'Market Shopkeeper',
    dialogueIntroEn: "Welcome to my market stall! Fresh fruits and good deals today!",
    dialogueIntroPl: "Witaj na moim stoisku! Świeże owoce i świetne okazje!",
    color: '#f97316',
    icon: '🦊',
    position: { x: 18, y: 0, z: 2 }
  },
  {
    id: 'professor_owl',
    name: 'Professor Owl',
    rolePl: 'Mędrzec z Biblioteki',
    roleEn: 'Wise Librarian Owl',
    dialogueIntroEn: "Greetings, young scholar! Knowledge is the greatest magic of Wordland.",
    dialogueIntroPl: "Witaj, młody uczniu! Wiedza to największa magia w Wordland.",
    color: '#8b5cf6',
    icon: '🦉',
    position: { x: -16, y: 0, z: -12 }
  },
  {
    id: 'daisy',
    name: 'Daisy',
    rolePl: 'Ogrodniczka z Magicznego Parku',
    roleEn: 'Park Gardener',
    dialogueIntroEn: "Oh, look at the lovely flowers! Can you help me water them?",
    dialogueIntroPl: "Och, spójrz na te urocze kwiaty! Pomożesz mi je podlać?",
    color: '#10b981',
    icon: '🌸',
    position: { x: -12, y: 0, z: 12 }
  },
  {
    id: 'pierre',
    name: 'Chef Pierre',
    rolePl: 'Mistrz Piekarni i Cukierni',
    roleEn: 'Master Baker',
    dialogueIntroEn: "Bonjour! The fresh croissants and warm breads smell delicious!",
    dialogueIntroPl: "Bonjour! Świeże rogaliki i ciepły chleb pachną wyśmienicie!",
    color: '#ec4899',
    icon: '🥐',
    position: { x: 14, y: 0, z: -16 }
  },
  {
    id: 'leo',
    name: 'Stationmaster Leo',
    rolePl: 'Zawiadowca Stacji Podróży',
    roleEn: 'Stationmaster',
    dialogueIntroEn: "All aboard! The Wordland Express travels across the islands!",
    dialogueIntroPl: "Wszyscy na pokład! Ekspres Wordland podróżuje między wyspami!",
    color: '#eab308',
    icon: '🚂',
    position: { x: -2, y: 0, z: 22 }
  }
];

export const VOCABULARY_DATABASE: WordItem[] = [
  // Greetings & Feelings
  { id: 'w_hello', english: 'Hello', polish: 'Cześć / Witaj', category: 'greetings', emoji: '👋', exampleEn: 'Hello, my friend!', examplePl: 'Cześć, mój przyjacielu!', discovered: true },
  { id: 'w_goodbye', english: 'Goodbye', polish: 'Do widzenia', category: 'greetings', emoji: '👋', exampleEn: 'Goodbye, see you soon!', examplePl: 'Do widzenia, do zobaczenia wkrótce!', discovered: false },
  { id: 'w_happy', english: 'Happy', polish: 'Szczęśliwy / Wesoły', category: 'greetings', emoji: '😊', exampleEn: 'I am very happy today.', examplePl: 'Jestem dziś bardzo szczęśliwy.', discovered: false },
  { id: 'w_tired', english: 'Tired', polish: 'Zmęczony', category: 'greetings', emoji: '🥱', exampleEn: 'The explorer is tired after walking.', examplePl: 'Odkrywca jest zmęczony po spacerze.', discovered: false },
  
  // School Supplies
  { id: 'w_pencil', english: 'Pencil', polish: 'Ołówek', category: 'school_supplies', emoji: '✏️', exampleEn: 'I write with a yellow pencil.', examplePl: 'Piszę żółtym ołówkiem.', discovered: true },
  { id: 'w_book', english: 'Book', polish: 'Książka', category: 'school_supplies', emoji: '📖', exampleEn: 'Open your English book.', examplePl: 'Otwórz swoją książkę do angielskiego.', discovered: true },
  { id: 'w_ruler', english: 'Ruler', polish: 'Linijka', category: 'school_supplies', emoji: '📏', exampleEn: 'I measure lines with a ruler.', examplePl: 'Mierzę linie linijką.', discovered: false },
  { id: 'w_schoolbag', english: 'Schoolbag', polish: 'Plecak szkolny', category: 'school_supplies', emoji: '🎒', exampleEn: 'Put the notebook in your schoolbag.', examplePl: 'Włóż zeszyt do plecaka.', discovered: false },
  { id: 'w_eraser', english: 'Eraser', polish: 'Gumka do ścierania', category: 'school_supplies', emoji: '🧼', exampleEn: 'Can I borrow your eraser?', examplePl: 'Mogę pożyczyć twoją gumkę?', discovered: false },

  // Colors & Numbers
  { id: 'w_red', english: 'Red', polish: 'Czerwony', category: 'colors_numbers', emoji: '🔴', exampleEn: 'The apple is bright red.', examplePl: 'Jabłko jest jaskrawoczerwone.', discovered: true },
  { id: 'w_blue', english: 'Blue', polish: 'Niebieski', category: 'colors_numbers', emoji: '🔵', exampleEn: 'The sky and river are blue.', examplePl: 'Niebo i rzeka są niebieskie.', discovered: true },
  { id: 'w_green', english: 'Green', polish: 'Zielony', category: 'colors_numbers', emoji: '🟢', exampleEn: 'The grass in the park is green.', examplePl: 'Trawa w parku jest zielona.', discovered: true },
  { id: 'w_yellow', english: 'Yellow', polish: 'Żółty', category: 'colors_numbers', emoji: '🟡', exampleEn: 'The sun shines yellow and warm.', examplePl: 'Słońce świeci na żółto i ciepło.', discovered: false },
  { id: 'w_five', english: 'Five', polish: 'Pięć (5)', category: 'colors_numbers', emoji: '🖐️', exampleEn: 'I have five shiny stars.', examplePl: 'Mam pięć lśniących gwiazdek.', discovered: false },
  { id: 'w_ten', english: 'Ten', polish: 'Dziesięć (10)', category: 'colors_numbers', emoji: '🔟', exampleEn: 'Count to ten with BEEP.', examplePl: 'Policz do dziesięciu z BEEP-em.', discovered: false },

  // Animals & Nature
  { id: 'w_fox', english: 'Fox', polish: 'Lis', category: 'animals_nature', emoji: '🦊', exampleEn: 'The clever fox has an orange tail.', examplePl: 'Sprytny lis ma pomarańczowy ogon.', discovered: true },
  { id: 'w_owl', english: 'Owl', polish: 'Sowa', category: 'animals_nature', emoji: '🦉', exampleEn: 'The wise owl reads in the library.', examplePl: 'Mądra sowa czyta w bibliotece.', discovered: true },
  { id: 'w_rabbit', english: 'Rabbit', polish: 'Królik', category: 'animals_nature', emoji: '🐰', exampleEn: 'The little rabbit hops in the meadow.', examplePl: 'Mały królik kica po łące.', discovered: false },
  { id: 'w_dog', english: 'Dog', polish: 'Pies', category: 'animals_nature', emoji: '🐶', exampleEn: 'Sparky is a friendly dog.', examplePl: 'Sparky jest przyjaznym psem.', discovered: false },
  { id: 'w_butterfly', english: 'Butterfly', polish: 'Motyl', category: 'animals_nature', emoji: '🦋', exampleEn: 'A colorful butterfly flies over flowers.', examplePl: 'Kolorowy motyl lata nad kwiatami.', discovered: false },
  { id: 'w_tree', english: 'Tree', polish: 'Drzewo', category: 'animals_nature', emoji: '🌳', exampleEn: 'Magic apples grow on this tree.', examplePl: 'Magiczne jabłka rosną na tym drzewie.', discovered: false },

  // Food & Drinks
  { id: 'w_apple', english: 'Apple', polish: 'Jabłko', category: 'food_drinks', emoji: '🍎', exampleEn: 'An apple a day keeps the doctor away.', examplePl: 'Jedno jabłko dziennie to samo zdrowie.', discovered: true },
  { id: 'w_bread', english: 'Bread', polish: 'Chleb', category: 'food_drinks', emoji: '🍞', exampleEn: 'Pierre bakes warm bread every morning.', examplePl: 'Pierre piecze ciepły chleb każdego ranka.', discovered: false },
  { id: 'w_milk', english: 'Milk', polish: 'Mleko', category: 'food_drinks', emoji: '🥛', exampleEn: 'I like a glass of cold milk.', examplePl: 'Lubię szklankę zimnego mleka.', discovered: false },
  { id: 'w_banana', english: 'Banana', polish: 'Banan', category: 'food_drinks', emoji: '🍌', exampleEn: 'Monkeys love sweet bananas.', examplePl: 'Małpy uwielbiają słodkie banany.', discovered: false },
  { id: 'w_water', english: 'Water', polish: 'Woda', category: 'food_drinks', emoji: '💧', exampleEn: 'Drink fresh water when playing.', examplePl: 'Pij świeżą wodę podczas zabawy.', discovered: false },
  { id: 'w_cheese', english: 'Cheese', polish: 'Ser', category: 'food_drinks', emoji: '🧀', exampleEn: 'Yellow cheese is on the plate.', examplePl: 'Żółty ser leży na talerzu.', discovered: false },

  // Clothes & Weather
  { id: 'w_jacket', english: 'Jacket', polish: 'Kurtka', category: 'clothes_weather', emoji: '🧥', exampleEn: 'Put on your warm jacket, it is cold.', examplePl: 'Załóż ciepłą kurtkę, jest zimno.', discovered: false },
  { id: 'w_hat', english: 'Hat', polish: 'Czapka / Kapelusz', category: 'clothes_weather', emoji: '👒', exampleEn: 'The explorer wears a green hat.', examplePl: 'Odkrywca nosi zielony kapelusz.', discovered: true },
  { id: 'w_shoes', english: 'Shoes', polish: 'Buty', category: 'clothes_weather', emoji: '👟', exampleEn: 'Tie your running shoes.', examplePl: 'Zawiąż swoje buty do biegania.', discovered: false },
  { id: 'w_rainy', english: 'Rainy', polish: 'Deszczowo', category: 'clothes_weather', emoji: '🌧️', exampleEn: 'Take an umbrella, it is rainy today.', examplePl: 'Weź parasol, dzisiaj jest deszczowo.', discovered: false },
  { id: 'w_sunny', english: 'Sunny', polish: 'Słonecznie', category: 'clothes_weather', emoji: '☀️', exampleEn: 'It is a sunny morning in Wordland.', examplePl: 'To słoneczny poranek w Wordland.', discovered: true },

  // City & Transport
  { id: 'w_train', english: 'Train', polish: 'Pociąg', category: 'city_transport', emoji: '🚆', exampleEn: 'The train arrives at platform two.', examplePl: 'Pociąg przyjeżdża na peron drugi.', discovered: false },
  { id: 'w_bridge', english: 'Bridge', polish: 'Most', category: 'city_transport', emoji: '🌉', exampleEn: 'Walk across the wooden bridge.', examplePl: 'Przejdź przez drewniany most.', discovered: false },
  { id: 'w_library', english: 'Library', polish: 'Biblioteka', category: 'city_transport', emoji: '📚', exampleEn: 'Be quiet in the town library.', examplePl: 'Bądź cicho w miejskiej bibliotece.', discovered: false },
  { id: 'w_market', english: 'Market', polish: 'Rynek / Targ', category: 'city_transport', emoji: '🏪', exampleEn: 'Buy apples at the market stall.', examplePl: 'Kup jabłka na stoisku targowym.', discovered: false },

  // Sports & Hobbies
  { id: 'w_football', english: 'Football', polish: 'Piłka nożna', category: 'sports_hobbies', emoji: '⚽', exampleEn: 'I like playing football after school.', examplePl: 'Lubię grać w piłkę nożną po szkole.', discovered: false },
  { id: 'w_guitar', english: 'Guitar', polish: 'Gitara', category: 'sports_hobbies', emoji: '🎸', exampleEn: 'Alex plays cheerful songs on guitar.', examplePl: 'Alex gra wesołe piosenki na gitarze.', discovered: false },
  { id: 'w_swimming', english: 'Swimming', polish: 'Pływanie', category: 'sports_hobbies', emoji: '🏊', exampleEn: 'Swimming is my favourite sport.', examplePl: 'Pływanie to mój ulubiony sport.', discovered: false }
];

export const QUESTS_DATABASE: QuestVariant[] = [
  // --- GRADE 3 MISSIONS (Klasa III: foundation, vocabulary, listening, simple reactions) ---
  {
    id: 'g3_greetings_alex',
    titlePl: 'Powitanie z Alexem',
    titleEn: 'Meet Explorer Alex',
    category: 'greetings',
    gradeLevel: 'grade3',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek Wordland', nameEn: 'Wordland Square' },
    questType: 'dialogue',
    storyContextPl: 'Alex wita nowego odkrywcę w Wordland i pyta, jak się masz.',
    instructionEn: 'Listen to Alex and answer his friendly question.',
    instructionPl: 'Posłuchaj Alexa i wybierz odpowiedź na jego pytanie.',
    audioPhraseEn: 'Hello! What is your name and how are you today?',
    options: [
      { textEn: 'Hello! I am happy to be here.', textPl: 'Cześć! Cieszę się, że tu jestem.', isCorrect: true, feedbackPl: 'Świetna odpowiedź! Alex cieszy się, że Cię poznał.' },
      { textEn: 'Goodbye, see you tomorrow.', textPl: 'Do widzenia, do jutra.', isCorrect: false, feedbackPl: 'To pożegnanie, a Alex dopiero się z Tobą wita!' },
      { textEn: 'I like yellow bananas.', textPl: 'Lubię żółte banany.', isCorrect: false, feedbackPl: 'Banany są pyszne, ale odpowiedz na powitanie!' }
    ],
    hintPl: 'Wybierz zdanie, które zaczyna się od "Hello" i pasuje do powitania.',
    reward: { xp: 50, stars: 3, coins: 15, wordsToUnlock: ['w_hello', 'w_happy'] }
  },

  {
    id: 'g3_beep_colors',
    titlePl: 'Zgubione kolory robota BEEP',
    titleEn: 'BEEP Lost Colors',
    category: 'colors_numbers',
    gradeLevel: 'grade3',
    npcId: 'beep',
    targetLocation: { x: 8, z: -10, namePl: 'Stacja Diagnostyczna BEEP', nameEn: 'BEEP Tech Pod' },
    questType: 'dialogue',
    storyContextPl: 'Burza Słów namieszała w kolorowych czujnikach robota BEEP! Pomóż mu zidentyfikować kolor nieba.',
    instructionEn: 'What color is the sky in Wordland?',
    instructionPl: 'Jakiego koloru jest niebo w Wordland?',
    audioPhraseEn: 'BEEP! What color is the bright sky today?',
    options: [
      { textEn: 'The sky is blue.', textPl: 'Niebo jest niebieskie.', isCorrect: true, feedbackPl: 'Prawidłowo! Blue to niebieski!' },
      { textEn: 'The sky is red.', textPl: 'Niebo jest czerwone.', isCorrect: false, feedbackPl: 'Red oznacza czerwony. Spójrz w górę — niebo jest błękitne!' },
      { textEn: 'The sky is green.', textPl: 'Niebo jest zielone.', isCorrect: false, feedbackPl: 'Green to zielony (jak trawa).' }
    ],
    hintPl: 'Pamiętasz: "blue" to błękit, a "red" to czerwień.',
    reward: { xp: 40, stars: 2, coins: 10, wordsToUnlock: ['w_blue', 'w_red'] }
  },

  {
    id: 'g3_foxy_apples',
    titlePl: 'Kosz świeżych jabłek u Foxiego',
    titleEn: 'Apples for Foxy',
    category: 'food_drinks',
    gradeLevel: 'grade3',
    npcId: 'foxy',
    targetLocation: { x: 18, z: 2, namePl: 'Stoisko Targowe Foxiego', nameEn: 'Market Island Stall' },
    questType: 'shopping',
    storyContextPl: 'Foxy uzupełnia zapasy na straganie. Potrzebuje trzech soczystych czerwonych jabłek.',
    instructionEn: 'Buy three red apples for the shop.',
    instructionPl: 'Wybierz właściwy owoc: Foxy prosi o „three red apples”.',
    audioPhraseEn: 'Can I have three red apples, please?',
    shopItems: [
      { nameEn: 'Red Apples', namePl: 'Czerwone jabłka', price: 5, icon: '🍎', isCorrect: true },
      { nameEn: 'Yellow Bananas', namePl: 'Żółte banany', price: 6, icon: '🍌', isCorrect: false },
      { nameEn: 'Fresh Bread', namePl: 'Świeży chleb', price: 4, icon: '🍞', isCorrect: false },
      { nameEn: 'Glass of Milk', namePl: 'Szklanka mleka', price: 3, icon: '🥛', isCorrect: false }
    ],
    hintPl: 'Szukasz owocu o nazwie "Apple" w kolorze czerwonym.',
    reward: { xp: 60, stars: 3, coins: 20, wordsToUnlock: ['w_apple', 'w_fox'] }
  },

  {
    id: 'g3_owl_school_supplies',
    titlePl: 'Zagadka w bibliotece Profesora',
    titleEn: 'School Supplies Riddle',
    category: 'school_supplies',
    gradeLevel: 'grade3',
    npcId: 'professor_owl',
    targetLocation: { x: -16, z: -12, namePl: 'Wielka Biblioteka Wordland', nameEn: 'Grand Library' },
    questType: 'riddle',
    storyContextPl: 'Profesor Sowa zgubił przedmiot, którym pisze notatki w swoich księgach.',
    instructionEn: 'Solve the riddle: "I am long and yellow. You use me to draw and write. What am I?"',
    instructionPl: 'Rozwiąż zagadkę Profesora: Czym pisze się i rysuje?',
    audioPhraseEn: 'I am long and yellow. You use me to write and draw. What am I?',
    options: [
      { textEn: 'A pencil', textPl: 'Ołówek', isCorrect: true, feedbackPl: 'Brawo! Pencil to ołówek.' },
      { textEn: 'A schoolbag', textPl: 'Plecak', isCorrect: false, feedbackPl: 'Schoolbag to plecak, w nim nosimy przybory.' },
      { textEn: 'An eraser', textPl: 'Gumka do ścierania', isCorrect: false, feedbackPl: 'Eraser służy do ścierania, nie do pisania.' }
    ],
    hintPl: 'Słowo zaczyna się na literę P: pencil.',
    reward: { xp: 55, stars: 3, coins: 15, wordsToUnlock: ['w_pencil', 'w_book'] }
  },

  {
    id: 'g3_daisy_animals',
    titlePl: 'Przyjaciele z Magicznego Lasu',
    titleEn: 'Forest Animal Friends',
    category: 'animals_nature',
    gradeLevel: 'grade3',
    npcId: 'daisy',
    targetLocation: { x: -12, z: 12, namePl: 'Ogród Kwiatowy Daisy', nameEn: 'Flower Meadow' },
    questType: 'dialogue',
    storyContextPl: 'Daisy zauważyła małe zwierzątko kicające obok krzaków malin.',
    instructionEn: 'Listen to Daisy: "Look, a cute animal is jumping! It is a..."',
    instructionPl: 'Które zwierzątko kica po trawie?',
    audioPhraseEn: 'Look at the grass! A small rabbit is jumping happily!',
    options: [
      { textEn: 'Rabbit', textPl: 'Królik', isCorrect: true, feedbackPl: 'Wspaniale! Rabbit oznacza królika.' },
      { textEn: 'Fox', textPl: 'Lis', isCorrect: false, feedbackPl: 'Fox to lis — Foxy czeka na rynku!' },
      { textEn: 'Owl', textPl: 'Sowa', isCorrect: false, feedbackPl: 'Owl to sowa siedząca na gałęzi lub w bibliotece.' }
    ],
    hintPl: 'Królik po angielsku to "rabbit".',
    reward: { xp: 45, stars: 2, coins: 12, wordsToUnlock: ['w_rabbit', 'w_tree'] }
  },

  {
    id: 'g3_pierre_bakery',
    titlePl: 'Śniadanie u Piekarza Pierre',
    titleEn: 'Pierre Bakery Morning',
    category: 'food_drinks',
    gradeLevel: 'grade3',
    npcId: 'pierre',
    targetLocation: { x: 14, z: -16, namePl: 'Piekarnia i Kawiarnia', nameEn: 'Sunny Bakery' },
    questType: 'shopping',
    storyContextPl: 'Pierre wyjmuje z pieca pachnący chleb i pyta, czego się napijesz.',
    instructionEn: 'Pierre asks: "Would you like milk or water?" Choose milk.',
    instructionPl: 'Wybierz mleko do ciepłego chleba: „milk”.',
    audioPhraseEn: 'Here is warm bread! Would you like cold milk to drink?',
    shopItems: [
      { nameEn: 'Fresh Milk', namePl: 'Świeże mleko', price: 4, icon: '🥛', isCorrect: true },
      { nameEn: 'Green Apple', namePl: 'Zielone jabłko', price: 3, icon: '🍏', isCorrect: false },
      { nameEn: 'Hot Tea', namePl: 'Gorąca herbata', price: 5, icon: '☕', isCorrect: false }
    ],
    hintPl: 'Mleko po angielsku to "milk".',
    reward: { xp: 50, stars: 2, coins: 15, wordsToUnlock: ['w_bread', 'w_milk'] }
  },

  {
    id: 'g3_leo_ticket',
    titlePl: 'Bilet na stacji kolejowej',
    titleEn: 'Stationmaster Ticket',
    category: 'city_transport',
    gradeLevel: 'grade3',
    npcId: 'leo',
    targetLocation: { x: -2, z: 22, namePl: 'Stacja Wordland Express', nameEn: 'Adventure Station' },
    questType: 'dialogue',
    storyContextPl: 'Zawiadowca Leo sprawdza bilety na pociąg ekspresowy.',
    instructionEn: 'Leo asks: "Where are you going?" Choose the station response.',
    instructionPl: 'Odpowiedz zawiadowcy, że jedziesz pociągiem.',
    audioPhraseEn: 'Welcome to the station! Do you want to take the train?',
    options: [
      { textEn: 'Yes, I want to take the train, please.', textPl: 'Tak, poproszę o podróż pociągiem.', isCorrect: true, feedbackPl: 'Doskonale! Pociąg rusza!' },
      { textEn: 'No, I am swimming.', textPl: 'Nie, ja pływam.', isCorrect: false, feedbackPl: 'Pływanie na torach? To chyba pomyłka!' },
      { textEn: 'I have three books.', textPl: 'Mam trzy książki.', isCorrect: false, feedbackPl: 'To nie odpowiada na pytanie o podróż.' }
    ],
    hintPl: 'Wybierz zdanie zawierające słowo "train" (pociąg).',
    reward: { xp: 55, stars: 3, coins: 18, wordsToUnlock: ['w_train', 'w_bridge'] }
  },

  {
    id: 'g3_beep_sentence_pet',
    titlePl: 'BEEP układa zdanie o pupilu',
    titleEn: 'BEEP Dog Sentence',
    category: 'animals_nature',
    gradeLevel: 'grade3',
    npcId: 'beep',
    targetLocation: { x: 8, z: -10, namePl: 'Stacja BEEP', nameEn: 'BEEP Tech Pod' },
    questType: 'sentence_builder',
    storyContextPl: 'BEEP chce powiedzieć, że lubi małego pieska Sparky, ale jego pamięć RAM pomieszała słowa.',
    instructionEn: 'Arrange the words to make a correct sentence: "I like the dog"',
    instructionPl: 'Ułóż słowa w poprawnej kolejności: „I like the dog”.',
    audioPhraseEn: 'I like the dog.',
    sentenceWords: ['the', 'I', 'dog', 'like'],
    correctSentence: 'I like the dog',
    hintPl: 'Zacznij od "I" (ja), potem "like" (lubię)...',
    reward: { xp: 65, stars: 3, coins: 20, wordsToUnlock: ['w_dog'] }
  },

  {
    id: 'g3_weather_clothes',
    titlePl: 'Słoneczny dzień w parku',
    titleEn: 'Sunny Day Clothes',
    category: 'clothes_weather',
    gradeLevel: 'grade3',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek Wordland', nameEn: 'Wordland Square' },
    questType: 'dialogue',
    storyContextPl: 'Świeci mocne słońce. Alex radzi założyć coś na głowę przed wyruszeniem na szlak.',
    instructionEn: 'What should you wear on your head when it is sunny?',
    instructionPl: 'Co zakładasz na głowę, gdy jest słonecznie?',
    audioPhraseEn: 'It is very sunny today! Put on your...',
    options: [
      { textEn: 'Hat', textPl: 'Czapka / Kapelusz', isCorrect: true, feedbackPl: 'Świetnie! Hat ochroni Cię przed słońcem.' },
      { textEn: 'Jacket', textPl: 'Kurtka', isCorrect: false, feedbackPl: 'Jacket to kurtka na chłodniejsze dni.' },
      { textEn: 'Shoes', textPl: 'Buty', isCorrect: false, feedbackPl: 'Buty nosimy na stopach!' }
    ],
    hintPl: 'Nakrycie głowy to po angielsku "hat".',
    reward: { xp: 45, stars: 2, coins: 12, wordsToUnlock: ['w_sunny', 'w_hat'] }
  },

  {
    id: 'g3_counting_stars',
    titlePl: 'Liczenie gwiazdek z Profesorem',
    titleEn: 'Counting Magic Stars',
    category: 'colors_numbers',
    gradeLevel: 'grade3',
    npcId: 'professor_owl',
    targetLocation: { x: -16, z: -12, namePl: 'Wielka Biblioteka', nameEn: 'Grand Library' },
    questType: 'dialogue',
    storyContextPl: 'Profesor Sowa policzył błyszczące punkty na nocnym niebie: 1, 2, 3, 4, ... co jest dalej?',
    instructionEn: 'Count in English: One, two, three, four, ... ?',
    instructionPl: 'Uzupełnij brakującą liczbę po angielsku: 1, 2, 3, 4, ... ?',
    audioPhraseEn: 'One, two, three, four, and what number comes next?',
    options: [
      { textEn: 'Five', textPl: 'Pięć (5)', isCorrect: true, feedbackPl: 'Znakomicie! Five to 5.' },
      { textEn: 'Ten', textPl: 'Dziesięć (10)', isCorrect: false, feedbackPl: 'Ten to 10 — za daleko!' },
      { textEn: 'Two', textPl: 'Dwa (2)', isCorrect: false, feedbackPl: 'Two już minęliśmy.' }
    ],
    hintPl: 'Po czwórce (four) następuje piątka: "five".',
    reward: { xp: 50, stars: 3, coins: 15, wordsToUnlock: ['w_five', 'w_ten'] }
  },

  // --- GRADE 4 MISSIONS (Klasa IV: sentence construction, rich dialogues, shopping calculation, routines, sports) ---
  {
    id: 'g4_hobby_sentence',
    titlePl: 'Ulubiony sport Alexa',
    titleEn: 'Alex Favourite Sport',
    category: 'sports_hobbies',
    gradeLevel: 'grade4',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek Wordland', nameEn: 'Wordland Square' },
    questType: 'sentence_builder',
    storyContextPl: 'Alex trenuje na boisku miejskim i opowiada o swojej ulubionej dyscyplinie.',
    instructionEn: 'Build the sentence: "I like playing football"',
    instructionPl: 'Ułóż zdanie: „I like playing football”.',
    audioPhraseEn: 'I like playing football with my school friends.',
    sentenceWords: ['playing', 'I', 'football', 'like'],
    correctSentence: 'I like playing football',
    hintPl: 'I -> like -> playing -> football.',
    reward: { xp: 70, stars: 3, coins: 25, wordsToUnlock: ['w_football', 'w_swimming'] }
  },

  {
    id: 'g4_market_math',
    titlePl: 'Zakupy u Foxiego z rachunkiem',
    titleEn: 'Smart Market Shopping',
    category: 'food_drinks',
    gradeLevel: 'grade4',
    npcId: 'foxy',
    targetLocation: { x: 18, z: 2, namePl: 'Stragan Foxiego', nameEn: 'Market Island Stall' },
    questType: 'dialogue',
    storyContextPl: 'Foxy proponuje żółty ser za 5 monet i banany za 6 monet. Ile to razem?',
    instructionEn: 'Foxy says: "The cheese is five coins and the bananas are six coins. How much is that?"',
    instructionPl: 'Oblicz i wybierz poprawną kwotę po angielsku: 5 + 6 = ?',
    audioPhraseEn: 'Five coins plus six coins. How much is the total?',
    options: [
      { textEn: 'It is eleven coins.', textPl: 'To 11 monet.', isCorrect: true, feedbackPl: 'Idealnie! 5 + 6 to eleven (11).' },
      { textEn: 'It is ten coins.', textPl: 'To 10 monet.', isCorrect: false, feedbackPl: '5 + 6 = 11, a nie 10.' },
      { textEn: 'It is twelve coins.', textPl: 'To 12 monet.', isCorrect: false, feedbackPl: '12 to twelve — trochę za dużo!' }
    ],
    hintPl: '11 po angielsku to "eleven".',
    reward: { xp: 75, stars: 3, coins: 25, wordsToUnlock: ['w_cheese', 'w_banana'] }
  },

  {
    id: 'g4_owl_directions',
    titlePl: 'Droga do biblioteki',
    titleEn: 'Directions to the Library',
    category: 'city_transport',
    gradeLevel: 'grade4',
    npcId: 'professor_owl',
    targetLocation: { x: -16, z: -12, namePl: 'Wielka Biblioteka', nameEn: 'Grand Library' },
    questType: 'dialogue',
    storyContextPl: 'Nowy uczeń pyta Profesora, jak dojść ze stacji kolejowej do biblioteki.',
    instructionEn: 'Listen to the directions: "Turn left at the fountain and go straight."',
    instructionPl: 'Co oznaczają wskazówki Profesora: „Turn left and go straight”?',
    audioPhraseEn: 'Turn left at the fountain and go straight to the library door.',
    options: [
      { textEn: 'Skręć w lewo i idź prosto.', textPl: 'Turn left and go straight.', isCorrect: true, feedbackPl: 'Wzorowo! "Left" to w lewo, "straight" to prosto.' },
      { textEn: 'Skręć w prawo i zawróć.', textPl: 'Turn right and turn back.', isCorrect: false, feedbackPl: '"Right" to w prawo, ale Profesor powiedział "left"!' },
      { textEn: 'Zatrzymaj się i poczekaj.', textPl: 'Stop and wait.', isCorrect: false, feedbackPl: 'Profesor zachęca do marszu: go straight.' }
    ],
    hintPl: '"Left" = w lewo, "straight" = prosto.',
    reward: { xp: 80, stars: 3, coins: 30, wordsToUnlock: ['w_library', 'w_bridge'] }
  },

  {
    id: 'g4_beep_daily_routine',
    titlePl: 'Plan dnia robota BEEP',
    titleEn: 'BEEP Daily Routine',
    category: 'daily_routine',
    gradeLevel: 'grade4',
    npcId: 'beep',
    targetLocation: { x: 8, z: -10, namePl: 'Stacja BEEP', nameEn: 'BEEP Tech Pod' },
    questType: 'sentence_builder',
    storyContextPl: 'BEEP ustawia swój budzik na godzinę 7:00 rano.',
    instructionEn: 'Build the routine sentence: "I wake up at seven"',
    instructionPl: 'Ułóż zdanie o porannym wstawaniu: „I wake up at seven”.',
    audioPhraseEn: 'Every morning, I wake up at seven o clock.',
    sentenceWords: ['wake', 'at', 'I', 'seven', 'up'],
    correctSentence: 'I wake up at seven',
    hintPl: 'I -> wake -> up -> at -> seven.',
    reward: { xp: 75, stars: 3, coins: 25, wordsToUnlock: ['w_tired'] }
  },

  {
    id: 'g4_rainy_jacket',
    titlePl: 'Zmiana pogody nad Wordland',
    titleEn: 'Rainy Weather Gear',
    category: 'clothes_weather',
    gradeLevel: 'grade4',
    npcId: 'daisy',
    targetLocation: { x: -12, z: 12, namePl: 'Ogród Daisy', nameEn: 'Flower Meadow' },
    questType: 'dialogue',
    storyContextPl: 'Na niebie pojawiły się ciemne chmury i zaczyna kropić deszcz.',
    instructionEn: 'Daisy says: "It is rainy and windy! What should you wear?"',
    instructionPl: 'Co należy założyć, gdy jest deszczowo i wietrznie?',
    audioPhraseEn: 'It is rainy and cold outside. Put on your warm jacket!',
    options: [
      { textEn: 'A warm jacket and an umbrella', textPl: 'Ciepłą kurtkę i parasol', isCorrect: true, feedbackPl: 'Bardzo dobrze! Jacket i umbrella ochronią przed deszczem.' },
      { textEn: 'Sunglasses and swimming shorts', textPl: 'Okulary przeciwsłoneczne i kąpielówki', isCorrect: false, feedbackPl: 'W deszczu zmarzniesz w kąpielówkach!' },
      { textEn: 'Only a t-shirt', textPl: 'Tylko koszulkę', isCorrect: false, feedbackPl: 'Lepiej założyć coś cieplejszego na deszcz.' }
    ],
    hintPl: '"Rainy" to deszczowo, a "jacket" to kurtka.',
    reward: { xp: 70, stars: 3, coins: 20, wordsToUnlock: ['w_rainy', 'w_jacket', 'w_shoes'] }
  },

  {
    id: 'g4_family_friends',
    titlePl: 'Rodzina i przyjaciele w Wordland',
    titleEn: 'Family and Friends Dialogue',
    category: 'family_friends',
    gradeLevel: 'grade4',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek Wordland', nameEn: 'Wordland Square' },
    questType: 'dialogue',
    storyContextPl: 'Alex opowiada o swojej siostrze, która uwielbia grać na gitarze.',
    instructionEn: 'Alex says: "My sister has got a brown guitar. She loves music!"',
    instructionPl: 'Kto w opowieści Alexa ma gitarę?',
    audioPhraseEn: 'My sister has got a guitar and my brother likes football.',
    options: [
      { textEn: 'His sister', textPl: 'Jego siostra', isCorrect: true, feedbackPl: 'Świetnie! "Sister" to siostra.' },
      { textEn: 'His brother', textPl: 'Jego brat', isCorrect: false, feedbackPl: 'Brat (brother) lubi piłkę nożną.' },
      { textEn: 'His grandfather', textPl: 'Jego dziadek', isCorrect: false, feedbackPl: 'Grandfather to dziadek.' }
    ],
    hintPl: '"Sister" oznacza siostrę.',
    reward: { xp: 65, stars: 3, coins: 20, wordsToUnlock: ['w_guitar'] }
  },

  {
    id: 'g4_pierre_recipe',
    titlePl: 'Sekretny przepis Pierre na ciasto',
    titleEn: 'Pierre Cake Recipe',
    category: 'food_drinks',
    gradeLevel: 'grade4',
    npcId: 'pierre',
    targetLocation: { x: 14, z: -16, namePl: 'Piekarnia', nameEn: 'Sunny Bakery' },
    questType: 'sentence_builder',
    storyContextPl: 'Pierre piecze szarlotkę i prosi o przeczytanie pierwszego kroku przepisu.',
    instructionEn: 'Build the cooking instruction: "Cut three red apples"',
    instructionPl: 'Ułóż polecenie kuchenne: „Cut three red apples”.',
    audioPhraseEn: 'First step: cut three red apples into small pieces.',
    sentenceWords: ['apples', 'red', 'Cut', 'three'],
    correctSentence: 'Cut three red apples',
    hintPl: 'Cut -> three -> red -> apples.',
    reward: { xp: 80, stars: 3, coins: 25, wordsToUnlock: ['w_bread', 'w_apple'] }
  },

  {
    id: 'g4_leo_departure',
    titlePl: 'Godzina odjazdu ekspresu',
    titleEn: 'Train Departure Time',
    category: 'city_transport',
    gradeLevel: 'grade4',
    npcId: 'leo',
    targetLocation: { x: -2, z: 22, namePl: 'Dworzec Kolejowy', nameEn: 'Adventure Station' },
    questType: 'dialogue',
    storyContextPl: 'Tablica odjazdów informuje: The train leaves at four o clock.',
    instructionEn: 'What time does the train leave according to the announcement?',
    instructionPl: 'O której godzinie odjeżdża pociąg?',
    audioPhraseEn: 'Attention travelers! The train to Market Island leaves at four o clock!',
    options: [
      { textEn: 'At 4:00', textPl: 'O godzinie 4:00', isCorrect: true, feedbackPl: 'Znakomicie! "Four o clock" to godzina 4:00.' },
      { textEn: 'At 2:00', textPl: 'O godzinie 2:00', isCorrect: false, feedbackPl: '2:00 to two o clock.' },
      { textEn: 'At 8:00', textPl: 'O godzinie 8:00', isCorrect: false, feedbackPl: '8:00 to eight o clock.' }
    ],
    hintPl: '"Four" oznacza liczbę 4.',
    reward: { xp: 75, stars: 3, coins: 25, wordsToUnlock: ['w_train'] }
  },

  {
    id: 'g4_nature_butterfly_riddle',
    titlePl: 'Tajemniczy gość w ogrodzie',
    titleEn: 'Garden Nature Riddle',
    category: 'animals_nature',
    gradeLevel: 'grade4',
    npcId: 'daisy',
    targetLocation: { x: -12, z: 12, namePl: 'Ogród Daisy', nameEn: 'Flower Meadow' },
    questType: 'riddle',
    storyContextPl: 'Daisy zauważyła owada z pięknymi kolorowymi skrzydłami.',
    instructionEn: 'Solve the riddle: "I have colorful wings. I fly from flower to flower. I am not a bird."',
    instructionPl: 'Kto lata z kwiatka na kwiatek i ma kolorowe skrzydła?',
    audioPhraseEn: 'I have got colorful wings. I love sweet flowers. What am I?',
    options: [
      { textEn: 'A butterfly', textPl: 'Motyl', isCorrect: true, feedbackPl: 'Wspaniale! Butterfly to motyl.' },
      { textEn: 'A dog', textPl: 'Pies', isCorrect: false, feedbackPl: 'Pies nie potrafi latać na skrzydłach!' },
      { textEn: 'A pencil', textPl: 'Ołówek', isCorrect: false, feedbackPl: 'Ołówek to przybór szkolny.' }
    ],
    hintPl: 'Słowo to "butterfly".',
    reward: { xp: 70, stars: 3, coins: 20, wordsToUnlock: ['w_butterfly'] }
  },

  {
    id: 'g4_school_classroom',
    titlePl: 'Porządek w klasie u Profesora',
    titleEn: 'Classroom Supplies Check',
    category: 'school_supplies',
    gradeLevel: 'grade4',
    npcId: 'professor_owl',
    targetLocation: { x: -16, z: -12, namePl: 'Biblioteka', nameEn: 'Grand Library' },
    questType: 'dialogue',
    storyContextPl: 'Profesor prosi uczniów o przygotowanie podręcznika i linijki.',
    instructionEn: 'Professor says: "Please open your book and take out your ruler."',
    instructionPl: 'Co należy otworzyć i wyjąć zgodnie z poleceniem Profesora?',
    audioPhraseEn: 'Please open your English book and take out your blue ruler.',
    options: [
      { textEn: 'Otwórz książkę i wyjmij linijkę.', textPl: 'Open book and take ruler.', isCorrect: true, feedbackPl: 'Dokładnie tak! Book = książka, ruler = linijka.' },
      { textEn: 'Zamknij plecak i schowaj gumkę.', textPl: 'Close bag and hide eraser.', isCorrect: false, feedbackPl: 'Profesor prosił o otwarcie ("open") książki.' },
      { textEn: 'Namaluj jabłko w zeszycie.', textPl: 'Draw an apple.', isCorrect: false, feedbackPl: 'To inne zadanie plastyczne.' }
    ],
    hintPl: '"Book" to książka, a "ruler" to linijka.',
    reward: { xp: 80, stars: 3, coins: 25, wordsToUnlock: ['w_ruler', 'w_schoolbag', 'w_eraser'] }
  },

  // --- ADDITIONAL RICH VARIANTS TO REACH 30+ UNIQUE MISSIONS ---
  {
    id: 'g3_var_foxy_water',
    titlePl: 'Woda dla zmęczonego odkrywcy',
    titleEn: 'Water for Explorer',
    category: 'food_drinks',
    gradeLevel: 'grade3',
    npcId: 'foxy',
    targetLocation: { x: 18, z: 2, namePl: 'Rynek', nameEn: 'Market Stall' },
    questType: 'shopping',
    storyContextPl: 'Po długim biegu przez Wordland czas na orzeźwienie.',
    instructionEn: 'Buy a bottle of fresh water: "water".',
    instructionPl: 'Kup butelkę świeżej wody: „water”.',
    audioPhraseEn: 'Here is cold, fresh water for your adventure.',
    shopItems: [
      { nameEn: 'Fresh Water', namePl: 'Świeża woda', price: 2, icon: '💧', isCorrect: true },
      { nameEn: 'Sweet Cake', namePl: 'Słodkie ciastko', price: 6, icon: '🍰', isCorrect: false },
      { nameEn: 'Yellow Banana', namePl: 'Żółty banan', price: 4, icon: '🍌', isCorrect: false }
    ],
    hintPl: '"Water" to woda.',
    reward: { xp: 45, stars: 2, coins: 10, wordsToUnlock: ['w_water'] }
  },

  {
    id: 'g3_var_daisy_trees',
    titlePl: 'Zielone drzewa w parku',
    titleEn: 'Green Trees in Park',
    category: 'animals_nature',
    gradeLevel: 'grade3',
    npcId: 'daisy',
    targetLocation: { x: -12, z: 12, namePl: 'Park Miejski', nameEn: 'Park' },
    questType: 'dialogue',
    storyContextPl: 'Daisy pyta, jakiego koloru są liście na magicznych drzewach.',
    instructionEn: 'What color are the tree leaves in spring?',
    instructionPl: 'Jakiego koloru są liście na drzewie?',
    audioPhraseEn: 'Look at the tall tree! The leaves are green.',
    options: [
      { textEn: 'Green', textPl: 'Zielone', isCorrect: true, feedbackPl: 'Świetnie! Green oznacza zielony.' },
      { textEn: 'Red', textPl: 'Czerwone', isCorrect: false, feedbackPl: 'Red to czerwony.' },
      { textEn: 'Yellow', textPl: 'Żółte', isCorrect: false, feedbackPl: 'Żółte liście bywają jesienią, ale teraz są zielone!' }
    ],
    hintPl: 'Zielony to "green".',
    reward: { xp: 40, stars: 2, coins: 10, wordsToUnlock: ['w_green'] }
  },

  {
    id: 'g3_var_alex_goodbye',
    titlePl: 'Kulturalne pożegnanie',
    titleEn: 'Polite Goodbye',
    category: 'greetings',
    gradeLevel: 'grade3',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek', nameEn: 'Town Square' },
    questType: 'dialogue',
    storyContextPl: 'Alex kończy pierwszą trasę i żegna się na koniec dnia.',
    instructionEn: 'Alex says: "Goodbye, my friend! See you soon!" How do you reply?',
    instructionPl: 'Jak odpowiesz na pożegnanie Alexa?',
    audioPhraseEn: 'Goodbye, my friend! See you soon!',
    options: [
      { textEn: 'Goodbye! See you soon!', textPl: 'Do widzenia! Do zobaczenia wkrótce!', isCorrect: true, feedbackPl: 'Bardzo kulturalnie! Brawo!' },
      { textEn: 'Hello, what is your name?', textPl: 'Cześć, jak się nazywasz?', isCorrect: false, feedbackPl: 'To powitanie, a Alex właśnie się żegna.' },
      { textEn: 'I want three apples.', textPl: 'Chcę trzy jabłka.', isCorrect: false, feedbackPl: 'To zdanie ze sklepu!' }
    ],
    hintPl: '"Goodbye" to do widzenia.',
    reward: { xp: 50, stars: 2, coins: 15, wordsToUnlock: ['w_goodbye'] }
  },

  {
    id: 'g4_var_sports_swimming',
    titlePl: 'Letnie pływanie w jeziorze',
    titleEn: 'Summer Swimming Fun',
    category: 'sports_hobbies',
    gradeLevel: 'grade4',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek', nameEn: 'Town Square' },
    questType: 'sentence_builder',
    storyContextPl: 'Alex uwielbia sporty wodne w ciepłe dni.',
    instructionEn: 'Build the sentence: "I love swimming in summer"',
    instructionPl: 'Ułóż zdanie o pływaniu latem.',
    audioPhraseEn: 'When the weather is hot, I love swimming in the lake.',
    sentenceWords: ['in', 'love', 'swimming', 'I', 'summer'],
    correctSentence: 'I love swimming in summer',
    hintPl: 'I -> love -> swimming -> in -> summer.',
    reward: { xp: 85, stars: 3, coins: 30, wordsToUnlock: ['w_swimming'] }
  },

  {
    id: 'g4_var_beep_music_sentence',
    titlePl: 'BEEP uczy się grać melodię',
    titleEn: 'BEEP Plays Guitar',
    category: 'sports_hobbies',
    gradeLevel: 'grade4',
    npcId: 'beep',
    targetLocation: { x: 8, z: -10, namePl: 'Stacja BEEP', nameEn: 'BEEP Pod' },
    questType: 'sentence_builder',
    storyContextPl: 'Robot BEEP próbuje zagrać na gitarze elektrycznej.',
    instructionEn: 'Build the sentence: "She can play the guitar"',
    instructionPl: 'Ułóż zdanie: „She can play the guitar”.',
    audioPhraseEn: 'She can play the guitar very well.',
    sentenceWords: ['play', 'guitar', 'She', 'can', 'the'],
    correctSentence: 'She can play the guitar',
    hintPl: 'She -> can -> play -> the -> guitar.',
    reward: { xp: 85, stars: 3, coins: 30, wordsToUnlock: ['w_guitar'] }
  },

  {
    id: 'g3_var_schoolbag_check',
    titlePl: 'Pakowanie plecaka do szkoły',
    titleEn: 'Pack the Schoolbag',
    category: 'school_supplies',
    gradeLevel: 'grade3',
    npcId: 'professor_owl',
    targetLocation: { x: -16, z: -12, namePl: 'Biblioteka', nameEn: 'Grand Library' },
    questType: 'dialogue',
    storyContextPl: 'Profesor przypomina o spakowaniu podręcznika i piórnika do plecaka.',
    instructionEn: 'What is the English word for "plecak"?',
    instructionPl: 'Jak po angielsku powiesz „plecak”?',
    audioPhraseEn: 'Put your book into your blue schoolbag.',
    options: [
      { textEn: 'Schoolbag', textPl: 'Plecak szkolny', isCorrect: true, feedbackPl: 'Wspaniale! Schoolbag to plecak.' },
      { textEn: 'Ruler', textPl: 'Linijka', isCorrect: false, feedbackPl: 'Ruler to linijka.' },
      { textEn: 'Pencil', textPl: 'Ołówek', isCorrect: false, feedbackPl: 'Pencil to ołówek.' }
    ],
    hintPl: '"School" (szkoła) + "bag" (torba) = schoolbag.',
    reward: { xp: 50, stars: 2, coins: 15, wordsToUnlock: ['w_schoolbag'] }
  },

  {
    id: 'g3_var_numbers_ten',
    titlePl: 'Dziesięć kroków do mostu',
    titleEn: 'Ten Steps to the Bridge',
    category: 'colors_numbers',
    gradeLevel: 'grade3',
    npcId: 'leo',
    targetLocation: { x: -2, z: 22, namePl: 'Stacja', nameEn: 'Station' },
    questType: 'dialogue',
    storyContextPl: 'Zawiadowca Leo odmierza 10 kroków do wejścia na peron.',
    instructionEn: 'How do you say the number 10 in English?',
    instructionPl: 'Jak brzmi liczba 10 po angielsku?',
    audioPhraseEn: 'Take ten steps forward to reach the platform.',
    options: [
      { textEn: 'Ten', textPl: 'Dziesięć (10)', isCorrect: true, feedbackPl: 'Dokładnie! Ten to 10.' },
      { textEn: 'Two', textPl: 'Dwa (2)', isCorrect: false, feedbackPl: 'Two to 2.' },
      { textEn: 'Three', textPl: 'Trzy (3)', isCorrect: false, feedbackPl: 'Three to 3.' }
    ],
    hintPl: '10 = ten.',
    reward: { xp: 45, stars: 2, coins: 12, wordsToUnlock: ['w_ten'] }
  },

  {
    id: 'g4_var_routine_breakfast',
    titlePl: 'Śniadanie przed wyprawą',
    titleEn: 'Explorer Breakfast Routine',
    category: 'daily_routine',
    gradeLevel: 'grade4',
    npcId: 'pierre',
    targetLocation: { x: 14, z: -16, namePl: 'Piekarnia', nameEn: 'Bakery' },
    questType: 'dialogue',
    storyContextPl: 'Pierre pyta, co zwykle jesz na śniadanie.',
    instructionEn: 'Choose the sentence describing breakfast routine:',
    instructionPl: 'Wybierz zdanie opisujące jedzenie śniadania:',
    audioPhraseEn: 'I eat bread and cheese for breakfast every morning.',
    options: [
      { textEn: 'I eat bread and cheese for breakfast.', textPl: 'Jem chleb i ser na śniadanie.', isCorrect: true, feedbackPl: 'Pyszne i zdrowe śniadanie!' },
      { textEn: 'I sleep in the park at night.', textPl: 'Śpię w parku w nocy.', isCorrect: false, feedbackPl: 'To nie jest śniadanie!' },
      { textEn: 'The train has four wheels.', textPl: 'Pociąg ma cztery koła.', isCorrect: false, feedbackPl: 'To zdanie o pociągu.' }
    ],
    hintPl: '"Eat bread and cheese for breakfast" to jedzenie śniadania.',
    reward: { xp: 75, stars: 3, coins: 25, wordsToUnlock: ['w_bread', 'w_cheese'] }
  },

  {
    id: 'g3_var_happy_puppy',
    titlePl: 'Wesoły piesek w parku',
    titleEn: 'Happy Puppy in Park',
    category: 'animals_nature',
    gradeLevel: 'grade3',
    npcId: 'daisy',
    targetLocation: { x: -12, z: 12, namePl: 'Park', nameEn: 'Park' },
    questType: 'dialogue',
    storyContextPl: 'Sparky macha ogonem i skacze z radości.',
    instructionEn: 'Sparky is wagging his tail. He feels...',
    instructionPl: 'Sparky macha ogonem. Jak się czuje?',
    audioPhraseEn: 'Look at the little dog! He is very happy today!',
    options: [
      { textEn: 'Happy', textPl: 'Szczęśliwy / Wesoły', isCorrect: true, feedbackPl: 'Brawo! Happy to radosny.' },
      { textEn: 'Tired', textPl: 'Zmęczony', isCorrect: false, feedbackPl: 'Tired oznacza zmęczony.' },
      { textEn: 'Blue', textPl: 'Niebieski', isCorrect: false, feedbackPl: 'Blue to kolor!' }
    ],
    hintPl: '"Happy" oznacza szczęśliwy.',
    reward: { xp: 50, stars: 3, coins: 15, wordsToUnlock: ['w_happy', 'w_dog'] }
  },

  {
    id: 'g4_var_mystery_bridge',
    titlePl: 'Most tajemnic do Mystery Zone',
    titleEn: 'Bridge to Mystery Zone',
    category: 'city_transport',
    gradeLevel: 'grade4',
    npcId: 'alex',
    targetLocation: { x: 0, z: -5, namePl: 'Rynek', nameEn: 'Town Square' },
    questType: 'dialogue',
    storyContextPl: 'Alex odkrywa stary drogowskaz wskazujący most nad rzeką.',
    instructionEn: 'Read the sign: "Cross the wooden bridge to reach the ancient stones."',
    instructionPl: 'Co należy przejść, aby dotrzeć do starożytnych kamieni?',
    audioPhraseEn: 'Cross the wooden bridge to discover the hidden secret!',
    options: [
      { textEn: 'A wooden bridge', textPl: 'Drewniany most', isCorrect: true, feedbackPl: 'Wspaniale! Bridge to most, wooden to drewniany.' },
      { textEn: 'A big airport', textPl: 'Wielkie lotnisko', isCorrect: false, feedbackPl: 'Airport to lotnisko.' },
      { textEn: 'A yellow pencil', textPl: 'Żółty ołówek', isCorrect: false, feedbackPl: 'Ołówek nie nadaje się do przejścia przez rzekę!' }
    ],
    hintPl: '"Bridge" to most.',
    reward: { xp: 80, stars: 3, coins: 30, wordsToUnlock: ['w_bridge'] }
  }
];

export const DAILY_CHALLENGES = [
  {
    id: 'daily_colors_spree',
    titlePl: 'Dziś: Festiwal Kolorów!',
    titleEn: 'Daily Color Fest',
    targetType: 'colors_numbers' as const,
    descriptionPl: 'Odnajdź 3 kryształy słów w kolorach: Red, Blue i Green w Wordland!',
    rewardCoins: 50,
    rewardXP: 100
  },
  {
    id: 'daily_market_day',
    titlePl: 'Dziś: Dzień Targowy!',
    titleEn: 'Daily Market Bonanza',
    targetType: 'food_drinks' as const,
    descriptionPl: 'Pomóż Foxiemu i Pierre w zakupach owoców i chleba!',
    rewardCoins: 60,
    rewardXP: 120
  },
  {
    id: 'daily_forest_friends',
    titlePl: 'Dziś: Tropem Zwierząt!',
    titleEn: 'Daily Wildlife Safari',
    targetType: 'animals_nature' as const,
    descriptionPl: 'Odwiedź Daisy w ogrodzie i porozmawiaj o zwierzętach!',
    rewardCoins: 55,
    rewardXP: 110
  }
];
