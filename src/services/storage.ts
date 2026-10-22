import { PlayerProfile, QuestVariant, GradeLevel } from '../types/game';
import { QUESTS_DATABASE, DAILY_CHALLENGES } from '../data/curriculum';

const SAVE_KEY = 'english_quest_wordland_save_v1';

export const DEFAULT_AVATAR = {
  skinColor: '#fcd34d',
  hairStyle: 'spiky' as const,
  hairColor: '#b45309',
  outfitColor: '#3b82f6',
  pantsColor: '#1e3a8a',
  accessory: 'explorer_hat' as const,
  backpackColor: '#10b981'
};

export function createNewProfile(name: string, gradeLevel: GradeLevel): PlayerProfile {
  const todayStr = new Date().toISOString().split('T')[0];
  return {
    version: 1,
    id: 'player_' + Math.random().toString(36).substring(2, 9),
    playerName: name.trim() || 'Odkrywca',
    gradeLevel,
    avatar: { ...DEFAULT_AVATAR },
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    totalPlayTimeSeconds: 0,
    
    xp: 0,
    stars: 3,
    coins: 20,
    level: 1,
    
    unlockedAreas: ['wordland_town', 'magic_forest'],
    completedQuestIds: [],
    recentQuestIds: [],
    dailyChallengeCompleted: false,
    dailyChallengeDate: todayStr,
    
    discoveredWordIds: ['w_hello', 'w_blue', 'w_apple', 'w_pencil', 'w_fox'],
    inventory: [
      { id: 'inv_compass', nameEn: 'Explorer Compass', namePl: 'Kompas Odkrywcy', count: 1, icon: '🧭' },
      { id: 'inv_apple', nameEn: 'Magic Apple', namePl: 'Magiczne Jabłko', count: 2, icon: '🍎' }
    ],
    badges: ['badge_first_step'],
    
    playerPosition: { x: 0, y: 0, z: 0, rotationY: 0 },
    settings: {
      speechRate: 0.9,
      soundEnabled: true,
      ttsVoice: 'en-GB',
      showPolishHints: true,
      touchControls: false
    }
  };
}

export function loadSavedProfile(): PlayerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
    
    // Integrity check
    if (!parsed.playerName || !parsed.avatar) {
      console.warn('Corrupted save data, returning null');
      return null;
    }
    
    // Ensure all required arrays and settings exist (version migration safety)
    const todayStr = new Date().toISOString().split('T')[0];
    const profile: PlayerProfile = {
      version: 1,
      id: parsed.id || 'player_' + Date.now(),
      playerName: parsed.playerName || 'Odkrywca',
      gradeLevel: parsed.gradeLevel === 'grade4' ? 'grade4' : 'grade3',
      avatar: { ...DEFAULT_AVATAR, ...(parsed.avatar || {}) },
      createdAt: parsed.createdAt || Date.now(),
      lastPlayedAt: Date.now(),
      totalPlayTimeSeconds: parsed.totalPlayTimeSeconds || 0,
      
      xp: parsed.xp || 0,
      stars: parsed.stars ?? 3,
      coins: parsed.coins ?? 20,
      level: Math.max(1, Math.floor((parsed.xp || 0) / 100) + 1),
      
      unlockedAreas: parsed.unlockedAreas && parsed.unlockedAreas.length > 0 ? parsed.unlockedAreas : ['wordland_town', 'magic_forest'],
      completedQuestIds: parsed.completedQuestIds || [],
      recentQuestIds: parsed.recentQuestIds || [],
      dailyChallengeCompleted: parsed.dailyChallengeDate === todayStr ? !!parsed.dailyChallengeCompleted : false,
      dailyChallengeDate: todayStr,
      
      discoveredWordIds: parsed.discoveredWordIds || ['w_hello', 'w_blue'],
      inventory: parsed.inventory || [],
      badges: parsed.badges || ['badge_first_step'],
      
      playerPosition: parsed.playerPosition || { x: 0, y: 0, z: 0, rotationY: 0 },
      settings: {
        speechRate: parsed.settings?.speechRate ?? 0.9,
        soundEnabled: parsed.settings?.soundEnabled ?? true,
        ttsVoice: parsed.settings?.ttsVoice || 'en-GB',
        showPolishHints: parsed.settings?.showPolishHints ?? true,
        touchControls: parsed.settings?.touchControls ?? false
      }
    };

    return profile;
  } catch (err) {
    console.error('Failed to load profile:', err);
    return null;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.lastPlayedAt = Date.now();
    profile.level = Math.max(1, Math.floor(profile.xp / 100) + 1);
    localStorage.setItem(SAVE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.error('Failed to clear profile:', err);
  }
}

/**
 * Key requirement: Dynamic, non-repetitive quest selection.
 * Selects an appropriate quest based on:
 * - Current Grade level (Klasa 3 vs Klasa 4)
 * - Excludes recently played quests (last 5)
 * - Prefers uncompleted quests, but can draw from pool with refreshed seed
 */
export function getNextDynamicQuest(profile: PlayerProfile, targetNpcId?: string): QuestVariant {
  const eligibleQuests = QUESTS_DATABASE.filter(q => {
    if (q.gradeLevel !== profile.gradeLevel) return false;
    if (targetNpcId && q.npcId !== targetNpcId) return false;
    return true;
  });

  if (eligibleQuests.length === 0) {
    // Fallback to any quest for this grade
    return QUESTS_DATABASE.find(q => q.gradeLevel === profile.gradeLevel) || QUESTS_DATABASE[0];
  }

  // Filter out recent quests to avoid repeats
  const notRecent = eligibleQuests.filter(q => !profile.recentQuestIds.includes(q.id));
  const pool = notRecent.length > 0 ? notRecent : eligibleQuests;

  // Prefer uncompleted quests first
  const uncompleted = pool.filter(q => !profile.completedQuestIds.includes(q.id));
  const finalCandidates = uncompleted.length > 0 ? uncompleted : pool;

  // Pick random candidate
  const randomIndex = Math.floor(Math.random() * finalCandidates.length);
  return finalCandidates[randomIndex];
}

export function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}
