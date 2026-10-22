export type GradeLevel = 'grade3' | 'grade4';

export type QuestType = 
  | 'follow_instructions' 
  | 'find_item' 
  | 'dialogue' 
  | 'shopping' 
  | 'sentence_builder' 
  | 'riddle' 
  | 'pronunciation_listen';

export type QuestCategory =
  | 'greetings'
  | 'colors_numbers'
  | 'school_supplies'
  | 'animals_nature'
  | 'food_drinks'
  | 'clothes_weather'
  | 'family_friends'
  | 'city_transport'
  | 'daily_routine'
  | 'sports_hobbies';

export interface WordItem {
  id: string;
  english: string;
  polish: string;
  category: QuestCategory;
  emoji: string;
  exampleEn: string;
  examplePl: string;
  phoneticTip?: string;
  discovered: boolean;
}

export interface QuestReward {
  xp: number;
  stars: number;
  coins: number;
  wordsToUnlock: string[]; // word IDs
  badgeId?: string;
}

export interface DialogueOption {
  textEn: string;
  textPl: string;
  isCorrect: boolean;
  feedbackEn?: string;
  feedbackPl?: string;
}

export interface QuestVariant {
  id: string;
  titlePl: string;
  titleEn: string;
  category: QuestCategory;
  gradeLevel: GradeLevel;
  npcId: string;
  targetLocation: { x: number; z: number; namePl: string; nameEn: string };
  questType: QuestType;
  storyContextPl: string;
  instructionEn: string;
  instructionPl: string;
  audioPhraseEn: string;
  
  // Specific data depending on quest type
  options?: DialogueOption[];
  sentenceWords?: string[]; // for sentence_builder
  correctSentence?: string;
  shopItems?: { nameEn: string; namePl: string; price: number; icon: string; isCorrect: boolean }[];
  targetItemsToFind?: { id: string; nameEn: string; namePl: string; x: number; z: number; icon: string }[];
  riddleClues?: string[];
  
  hintPl: string;
  reward: QuestReward;
}

export interface AvatarConfig {
  skinColor: string;
  hairStyle: 'short' | 'spiky' | 'curly' | 'ponytail' | 'cap';
  hairColor: string;
  outfitColor: string;
  pantsColor: string;
  accessory: 'none' | 'glasses' | 'explorer_hat' | 'headphones' | 'badge';
  backpackColor: string;
}

export interface PlayerProfile {
  version: number;
  id: string;
  playerName: string;
  gradeLevel: GradeLevel;
  avatar: AvatarConfig;
  createdAt: number;
  lastPlayedAt: number;
  totalPlayTimeSeconds: number;
  
  xp: number;
  stars: number;
  coins: number;
  level: number;
  
  unlockedAreas: string[];
  completedQuestIds: string[];
  recentQuestIds: string[]; // history buffer to prevent repetition
  dailyChallengeCompleted: boolean;
  dailyChallengeDate: string;
  
  discoveredWordIds: string[];
  inventory: { id: string; nameEn: string; namePl: string; count: number; icon: string }[];
  badges: string[];
  
  playerPosition: { x: number; y: number; z: number; rotationY: number };
  settings: {
    speechRate: number; // 0.8 for slow, 1.0 for normal
    soundEnabled: boolean;
    ttsVoice: 'en-US' | 'en-GB';
    showPolishHints: boolean;
    touchControls: boolean;
  };
}

export interface NPCData {
  id: string;
  name: string;
  rolePl: string;
  roleEn: string;
  dialogueIntroEn: string;
  dialogueIntroPl: string;
  color: string;
  icon: string;
  position: { x: number; y: number; z: number };
}

export interface WorldCollectible {
  id: string;
  wordId: string;
  wordEn: string;
  wordPl: string;
  category: QuestCategory;
  x: number;
  y: number;
  z: number;
  collected: boolean;
}
