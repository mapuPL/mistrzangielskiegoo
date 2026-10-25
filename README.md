# The Shifting Islands: Word Quest 🌴📖

Edukacyjna gra przygodowa 3D w stylu low-poly inspirowana Roblox / PCD Polska, stworzona z myślą o uczniach klas 3–4 szkoły podstawowej do nauki języka angielskiego.

---

## 🌟 Główne Funkcje

1. **Proceduralny Świat 3D (Three.js v0.186+)**:
   - Centralny Hub inspirowany PCD Polska (kultowy Fiat 126p Maluch, biały sedan, wiata przystanku PKS z ławeczką, zielone polskie drogowskazy „SZCZECIN” i „CENTRUM”, maszty z flagami i tuje).
   - Dynamicznie generowane wyspy tematyczne połączone mostami z realistyczną fizyką otchłani (spadek i automatyczny bezpieczny respawn).
   - Oświetlenie `HemisphereLight` + `DirectionalLight` z miękkimi cieniami (`PCFSoftShadowMap`), mgłą i mapowaniem tonów `ACESFilmicToneMapping`.
   - Postać z pulsującą błękitną sferą aury ochronnej (Roblox Shield) oraz animacjami chodu, bezczynności i wyskoku.

2. **7 Bogatych Krain Tematycznych (110+ Słów, min. 15 na wyspę)**:
   - **ZOO Safari Island** (Zwierzęta dzikie i domowe)
   - **Tasty Kitchen Island** (Kuchnia, jedzenie i owoce)
   - **Magic Academy Island** (Przybory szkolne i klasa)
   - **Cozy House Island** (Pokoje i meble domowe)
   - **Rainbow Spectrum Island** (Kolory i cyfry)
   - **Fashion & Body Island** (NOWA: Ciało i ubrania)
   - **Sky & Seasons Island** (NOWA: Pogoda i 4 pory roku)

3. **Mechaniki Nauki i Typy Zadań**:
   - **Word Collector**: Zbieranie obracających się, lewitujących liter 3D z cząsteczkami i dźwiękiem.
   - **Bramy Segregacji (Sorting Gates)**: Kategoryzacja słów przez fizyczne portale bramowe z wiarygodnymi dystraktorami.
   - **Zagadki NPC (Riddle Challenge)**: Rozmowy z postaciami niezależnymi z wymową lektora (TTS) i opcjonalnym mikrofonem (Web Speech Recognition).
   - **Ułóż słowo z liter (Word Scramble)**: Układanie kafli literowych w poprawnej kolejności.
   - **Posłuchaj i wybierz (Listen & Choose)**: Odsłuchiwanie wymowy TTS i dopasowywanie obrazka/emoji.
   - **Dopasuj słowo do obrazka (Word Match)**: Łączenie par słowo-znaczenie.
   - **Fiszki Leitnera (Tryb Powtórka)**: Spaced repetition z priorytetem dla słów oznaczonych jako trudne.

4. **Progresja i Motywacja**:
   - Bezpieczny zapis w `localStorage` (monety, wynik, odznaki, seria dni, odblokowane wyspy).
   - Sklep Avatara: nakrycia głowy (bejsbolówka, czapka czarodzieja, korona), skrzydła 3D, efekty ścieżki i odblokowywanie wysp za monety.
   - 12 Odznak Osiągnięć z powiadomieniami toast.

5. **Dostępność i UI/UX**:
   - Ikony wektorowe SVG (`lucide-react`) w interfejsie i nawigacji (emoji zarezerwowane wyłącznie dla treści edukacyjnych).
   - Zwijana karta misji na telefonach i tabletach.
   - Cele dotykowe min. 48 px.
   - Ustawienia: suwak głośności, wolne tempo TTS, przełącznik napisów PL, tryb wysokiego kontrastu.
   - Pełna obsługa klawiatury (WASD, Strzałki, Spacja, E, M, Esc, Tab, Enter).

---

## 🛠️ Jak dodać nowe słówka?

Wszystkie słowniki znajdują się w pliku: `src/data/curriculum.ts`.

Aby dodać nowe słówko do wybranej wyspy, dodaj obiekt do tablicy `words` w danej wyspie:

```typescript
{
  id: 'zoo_custom_1',
  english: 'fox',                    // Słowo po angielsku
  polish: 'lis',                     // Tłumaczenie polskie
  category: 'zoo',                   // ID wyspy (np. zoo, kitchen, school...)
  level: 1,                          // Poziom trudności (1 = łatwy, 2 = średni, 3 = trudny)
  distractors: ['wolf', 'bear', 'dog'], // 2-3 wiarygodne błędne odpowiedzi z tej samej kategorii
  emoji: '🦊',                       // Obrazek / ikona edukacyjna
  hintPl: 'Rudy sprytny zwierzak z puszystym ogonem.', // Mnemotechniczna podpowiedź po polsku
  exampleEn: 'The quick brown fox jumps.',             // Przykładowe zdanie EN
  examplePl: 'Szybki brązowy lis skacze.',              // Tłumaczenie zdania PL
  phoneticTip: '[fɒks]'              // Uproszczony zapis fonetyczny
}
```

---

## 🏝️ Jak dodać nową wyspę?

1. W pliku `src/types/game.ts` rozszerz typ `IslandId`:
   ```typescript
   export type IslandId = ... | 'nowa_wyspa';
   ```

2. W pliku `src/data/curriculum.ts` dodaj nową konfigurację wyspy do tablicy `ISLANDS_DATA`:
   ```typescript
   {
     id: 'nowa_wyspa',
     nameEn: 'Music Island',
     namePl: 'Wyspa Muzyki i Dźwięków',
     descriptionPl: 'Odkrywaj instrumenty i melodie!',
     themeColor: '#a855f7',
     skyColor: '#f3e8ff',
     fogColor: '#faf5ff',
     groundColor: '#7e22ce',
     accentColor: '#c084fc',
     timeOfDay: 'sunset',
     unlockedByDefault: false,
     unlockCostCoins: 25,
     npc: {
       id: 'maestro_mozart',
       name: 'Maestro Jan',
       rolePl: 'Dyrygent Orkiestry',
       roleEn: 'Conductor',
       dialogueIntroEn: "Let's play some music!",
       dialogueIntroPl: "Zagrajmy razem muzykę!",
       color: '#a855f7',
       islandId: 'nowa_wyspa',
       position: { x: 0, y: 0.5, z: 32 }
     },
     gateCategories: [
       { id: 'cat_music', nameEn: 'Music', namePl: 'Muzyka', isCorrect: true },
       { id: 'cat_animals', nameEn: 'Animals', namePl: 'Zwierzęta', isCorrect: false },
       ...
     ],
     words: [ ... min. 15 słówek ... ]
   }
   ```

3. W silniku 3D (`src/game3d/GameWorld.ts`) w metodzie `buildIslandMesh` możesz dodać unikalne rekwizyty proceduralne 3D (np. fortepian, bęben, mikrofon).
