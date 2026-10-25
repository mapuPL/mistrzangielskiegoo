export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type IslandId = 
  | 'zoo' 
  | 'kitchen' 
  | 'school' 
  | 'house' 
  | 'colors_numbers' 
  | 'body_clothes' 
  | 'weather_seasons';

export interface WordItem {
  id: string;
  english: string;
  polish: string;
  category: IslandId;
  level: 1 | 2 | 3;
  distractors: string[];
  emoji: string;
  hintPl: string;
  exampleEn?: string;
  examplePl?: string;
  phoneticTip?: string;
}

export interface LeitnerCard {
  wordId: string;
  box: 1 | 2 | 3; // 1 = daily/difficult, 2 = review, 3 = mastered
  nextReviewDate: string;
  timesReviewed: number;
  timesWrong: number;
}

export interface NPCData {
  id: string;
  name: string;
  rolePl: string;
  roleEn: string;
  dialogueIntroEn: string;
  dialogueIntroPl: string;
  color: string;
  islandId: IslandId | 'hub';
  position: { x: number; y: number; z: number };
}

export interface IslandConfig {
  id: IslandId;
  nameEn: string;
  namePl: string;
  descriptionPl: string;
  themeColor: string;
  skyColor: string;
  fogColor: string;
  groundColor: string;
  accentColor: string;
  timeOfDay: 'morning' | 'noon' | 'sunset' | 'night' | 'dawn';
  unlockedByDefault: boolean;
  unlockCostCoins: number;
  words: WordItem[];
  npc: NPCData;
  gateCategories: { id: string; nameEn: string; namePl: string; isCorrect: boolean }[];
}

export type MiniGameType = 
  | 'collector' 
  | 'sorting_gates' 
  | 'npc_riddle' 
  | 'word_scramble' 
  | 'listen_and_choose' 
  | 'word_match' 
  | 'speech_challenge';

export interface ActiveQuest {
  id: string;
  islandId: IslandId;
  targetWord: WordItem;
  gameType: MiniGameType;
  titlePl: string;
  titleEn: string;
  instructionPl: string;
  instructionEn: string;
  requiredCount: number;
  currentCount: number;
  completed: boolean;
  rewardCoins: number;
  rewardScore: number;
}

export interface BadgeItem {
  id: string;
  namePl: string;
  descriptionPl: string;
  iconName: string; // lucide icon identifier
  unlockedAt?: number;
}

export interface ShopItem {
  id: string;
  namePl: string;
  category: 'hat' | 'wings' | 'trail' | 'island';
  cost: number;
  color?: string;
  descriptionPl: string;
  islandId?: IslandId;
}

export interface SettingsState {
  sfxVolume: number; // 0.0 - 1.0
  ttsSlow: boolean;
  showPolishSubtitles: boolean;
  highContrast: boolean;
  enableSpeechRec: boolean;
}

export interface PlayerProfile {
  version: number;
  coins: number;
  score: number;
  difficulty: DifficultyLevel;
  activeIslandId: IslandId;
  equippedHat: string;
  equippedWings: string;
  equippedTrail: string;
  unlockedIslands: IslandId[];
  ownedItems: string[];
  discoveredWordIds: string[];
  difficultWordIds: string[];
  leitnerCards: Record<string, LeitnerCard>;
  badges: string[];
  streakDays: number;
  lastLoginDate: string;
  dailyQuestDone: boolean;
  streakRecord: number;
  consecutiveCorrect: number;
  totalQuestsCompleted: number;
  settings: SettingsState;
}
