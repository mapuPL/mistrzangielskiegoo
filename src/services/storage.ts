import { PlayerProfile, DifficultyLevel, IslandId, LeitnerCard, WordItem } from '../types/game';
import { ISLANDS_DATA, BADGES_DATA } from '../data/curriculum';

const SAVE_STORAGE_KEY = 'word_quest_shifting_islands_save_v3';

export const DEFAULT_PROFILE: PlayerProfile = {
  version: 3,
  coins: 10,
  score: 0,
  difficulty: 'easy',
  activeIslandId: 'zoo',
  equippedHat: 'none',
  equippedWings: 'none',
  equippedTrail: 'none',
  unlockedIslands: ['zoo', 'kitchen', 'school', 'house', 'colors_numbers'],
  ownedItems: ['hat_cap'],
  discoveredWordIds: [],
  difficultWordIds: [],
  leitnerCards: {},
  badges: [],
  streakDays: 1,
  lastLoginDate: new Date().toISOString().slice(0, 10),
  dailyQuestDone: false,
  streakRecord: 1,
  consecutiveCorrect: 0,
  totalQuestsCompleted: 0,
  settings: {
    sfxVolume: 0.8,
    ttsSlow: false,
    showPolishSubtitles: true,
    highContrast: false,
    enableSpeechRec: true
  }
};

/**
 * Safely load saved profile from localStorage with fallback and version migration
 */
export function loadSavedProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) {
      return initializeStreak({ ...DEFAULT_PROFILE });
    }
    const parsed = JSON.parse(raw);
    const merged: PlayerProfile = {
      ...DEFAULT_PROFILE,
      ...parsed,
      settings: {
        ...DEFAULT_PROFILE.settings,
        ...(parsed.settings || {})
      },
      unlockedIslands: Array.isArray(parsed.unlockedIslands) && parsed.unlockedIslands.length > 0 
        ? parsed.unlockedIslands 
        : DEFAULT_PROFILE.unlockedIslands,
      leitnerCards: parsed.leitnerCards || {},
      badges: parsed.badges || []
    };
    return initializeStreak(merged);
  } catch (err) {
    console.warn('Failed to load profile from localStorage:', err);
    return { ...DEFAULT_PROFILE };
  }
}

/**
 * Check and advance daily streak
 */
function initializeStreak(profile: PlayerProfile): PlayerProfile {
  const today = new Date().toISOString().slice(0, 10);
  if (!profile.lastLoginDate) {
    profile.lastLoginDate = today;
    profile.streakDays = 1;
    profile.streakRecord = Math.max(profile.streakRecord || 1, 1);
    return profile;
  }

  if (profile.lastLoginDate === today) {
    // Same day, keep current streak
    return profile;
  }

  const last = new Date(profile.lastLoginDate);
  const now = new Date(today);
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day login!
    profile.streakDays = (profile.streakDays || 1) + 1;
    profile.streakRecord = Math.max(profile.streakRecord || 1, profile.streakDays);
    profile.dailyQuestDone = false;
  } else if (diffDays > 1) {
    // Missed a day
    profile.streakDays = 1;
    profile.dailyQuestDone = false;
  }

  profile.lastLoginDate = today;
  return profile;
}

/**
 * Safely save player profile
 */
export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Unable to persist profile to localStorage:', err);
  }
}

/**
 * Mark a word as difficult and insert or demote in Leitner system
 */
export function markWordDifficult(profile: PlayerProfile, wordId: string): PlayerProfile {
  const difficultSet = new Set(profile.difficultWordIds);
  difficultSet.add(wordId);

  const existingCard = profile.leitnerCards[wordId] || {
    wordId,
    box: 1,
    nextReviewDate: new Date().toISOString().slice(0, 10),
    timesReviewed: 0,
    timesWrong: 0
  };

  existingCard.box = 1; // back to box 1
  existingCard.timesWrong += 1;
  existingCard.timesReviewed += 1;

  const updated: PlayerProfile = {
    ...profile,
    consecutiveCorrect: 0,
    difficultWordIds: Array.from(difficultSet),
    leitnerCards: {
      ...profile.leitnerCards,
      [wordId]: existingCard
    }
  };

  saveProfile(updated);
  return updated;
}

/**
 * Promote word in Leitner spaced repetition system
 */
export function promoteLeitnerWord(profile: PlayerProfile, wordId: string): PlayerProfile {
  const card = profile.leitnerCards[wordId] || {
    wordId,
    box: 1,
    nextReviewDate: new Date().toISOString().slice(0, 10),
    timesReviewed: 0,
    timesWrong: 0
  };

  card.timesReviewed += 1;
  if (card.box < 3) {
    card.box = (card.box + 1) as 1 | 2 | 3;
  }

  // If reached box 3, remove from difficult words list
  let difficultWordIds = profile.difficultWordIds;
  if (card.box >= 3) {
    difficultWordIds = difficultWordIds.filter(id => id !== wordId);
  }

  const updated: PlayerProfile = {
    ...profile,
    difficultWordIds,
    leitnerCards: {
      ...profile.leitnerCards,
      [wordId]: card
    }
  };

  saveProfile(updated);
  return updated;
}

/**
 * Check and award badges based on current game state
 */
export function checkBadges(profile: PlayerProfile): { updatedProfile: PlayerProfile; newBadge: string | null } {
  const currentBadges = new Set(profile.badges);
  let newlyUnlocked: string | null = null;

  function award(badgeId: string) {
    if (!currentBadges.has(badgeId)) {
      currentBadges.add(badgeId);
      newlyUnlocked = badgeId;
    }
  }

  if (profile.totalQuestsCompleted >= 1) award('first_quest');
  if (profile.discoveredWordIds.length >= 5) award('word_collector_5');
  if (profile.consecutiveCorrect >= 10) award('perfect_10');
  if (profile.unlockedIslands.length > 5) award('island_explorer');
  if (profile.ownedItems.length >= 2) award('fashion_star');
  if (profile.streakDays >= 3) award('streak_3');

  if (newlyUnlocked) {
    const updated = {
      ...profile,
      badges: Array.from(currentBadges)
    };
    saveProfile(updated);
    return { updatedProfile: updated, newBadge: newlyUnlocked };
  }

  return { updatedProfile: profile, newBadge: null };
}

/**
 * Reset all saved progress
 */
export function resetSavedProgress(): PlayerProfile {
  try {
    localStorage.removeItem(SAVE_STORAGE_KEY);
  } catch (err) {
    console.warn('Storage clear error:', err);
  }
  return { ...DEFAULT_PROFILE };
}
