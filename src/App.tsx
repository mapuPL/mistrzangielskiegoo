import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { PlayerProfile, QuestVariant, GradeLevel, AvatarConfig } from './types/game';
import { NPCS_DATA } from './data/curriculum';
import {
  loadSavedProfile,
  saveProfile,
  createNewProfile,
  clearProfile,
  getNextDynamicQuest
} from './services/storage';
import { GameWorld, WorldInteractable } from './game3d/GameWorld';
import { SoundEffects } from './services/audio';

import { StartScreen } from './components/StartScreen';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { QuestHUD } from './components/QuestHUD';
import { DialogModal } from './components/DialogModal';
import { MobileControls } from './components/MobileControls';
import { CinemaDock } from './components/CinemaDock';
import { WorldMapModal } from './components/WorldMapModal';
import { WordBookModal } from './components/WordBookModal';
import { QuestJournalModal } from './components/QuestJournalModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [gameState, setGameState] = useState<'start' | 'customizer' | 'playing'>('start');

  const [activeQuest, setActiveQuest] = useState<QuestVariant | null>(null);
  const [nearInteractable, setNearInteractable] = useState<WorldInteractable | null>(null);

  // Active Modals
  const [activeDialogNPC, setActiveDialogNPC] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showWordBook, setShowWordBook] = useState<boolean>(false);
  const [showJournal, setShowJournal] = useState<boolean>(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Touch device detection
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // 3D Canvas ref and GameWorld instance ref
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const gameWorldRef = useRef<GameWorld | null>(null);
  const profileRef = useRef<PlayerProfile | null>(null);
  profileRef.current = profile;

  // On mount: check device touch & load saved profile
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
    setIsTouchDevice(isTouch);

    const saved = loadSavedProfile();
    if (saved) {
      setProfile(saved);
      // We start at 'start' so returning players see the nice continue button or they can jump right in
    }
  }, []);

  // Initialize or update active quest when profile changes
  useEffect(() => {
    if (profile && !activeQuest) {
      const nextQ = getNextDynamicQuest(profile);
      setActiveQuest(nextQ);
    }
  }, [profile, activeQuest]);

  // Setup 3D world when entering 'playing' state
  useEffect(() => {
    if (gameState !== 'playing' || !canvasMountRef.current || !profile) return;

    if (!gameWorldRef.current) {
      const world = new GameWorld(
        canvasMountRef.current,
        profile.avatar,
        profile.discoveredWordIds
      );

      world.onNearInteractableChange = (item) => {
        setNearInteractable(item);
      };

      world.onCrystalCollected = (crystalId, wordEn, wordPl) => {
        handleCrystalCollected(crystalId, wordEn, wordPl);
      };

      gameWorldRef.current = world;
    }

    return () => {
      if (gameWorldRef.current) {
        gameWorldRef.current.dispose();
        gameWorldRef.current = null;
      }
    };
  }, [gameState]);

  // Handle crystal collection
  const handleCrystalCollected = (crystalId: string, wordEn: string, wordPl: string) => {
    if (!profileRef.current) return;
    SoundEffects.playWordSparkle();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    const current = profileRef.current;
    const wordKey = 'w_' + wordEn.toLowerCase();
    const updatedDiscovered = Array.from(new Set([...current.discoveredWordIds, wordKey]));
    const updatedProfile: PlayerProfile = {
      ...current,
      xp: current.xp + 35,
      coins: current.coins + 10,
      stars: current.stars + 1,
      discoveredWordIds: updatedDiscovered
    };

    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    if (gameWorldRef.current) {
      gameWorldRef.current.collectCrystal(crystalId);
    }
  };

  // Keyboard shortcut listener for 'E' interact and 'Esc'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        if (nearInteractable && gameState === 'playing' && !activeDialogNPC) {
          triggerInteraction();
        }
      }
      if (e.key === 'Escape') {
        setActiveDialogNPC(null);
        setShowMap(false);
        setShowWordBook(false);
        setShowJournal(false);
        setShowAvatarCustomizer(false);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearInteractable, gameState, activeDialogNPC]);

  // Trigger Interaction with NPC or Crystal
  const triggerInteraction = useCallback(() => {
    if (!nearInteractable || !profile) return;

    if (nearInteractable.type === 'npc') {
      SoundEffects.playInteractSound();
      // Ensure quest matches NPC or find a suitable one
      let q = activeQuest;
      if (!q || q.npcId !== nearInteractable.id) {
        q = getNextDynamicQuest(profile, nearInteractable.id);
        setActiveQuest(q);
      }
      setActiveDialogNPC(nearInteractable.id);
    } else if (nearInteractable.type === 'crystal') {
      handleCrystalCollected(nearInteractable.id, nearInteractable.nameEn, nearInteractable.namePl);
    }
  }, [nearInteractable, profile, activeQuest]);

  // Handle Quest Success Completion
  const handleQuestSuccess = (rewardXP: number, rewardStars: number, rewardCoins: number, unlockedWords: string[]) => {
    if (!profile || !activeQuest) return;

    const currentCompleted = Array.from(new Set([...profile.completedQuestIds, activeQuest.id]));
    const currentRecent = [activeQuest.id, ...profile.recentQuestIds.filter(id => id !== activeQuest.id)].slice(0, 6);
    const currentDiscovered = Array.from(new Set([...profile.discoveredWordIds, ...unlockedWords]));

    const updatedProfile: PlayerProfile = {
      ...profile,
      xp: profile.xp + rewardXP,
      stars: profile.stars + rewardStars,
      coins: profile.coins + rewardCoins,
      completedQuestIds: currentCompleted,
      recentQuestIds: currentRecent,
      discoveredWordIds: currentDiscovered
    };

    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    setActiveDialogNPC(null);

    // Pick next dynamic quest automatically
    const nextQ = getNextDynamicQuest(updatedProfile);
    setActiveQuest(nextQ);
  };

  // Profile lifecycle actions
  const handleStartContinue = () => {
    if (profile) {
      setGameState('playing');
    }
  };

  const handleStartNewGame = () => {
    setGameState('customizer');
  };

  const handleSaveAvatar = (name: string, grade: GradeLevel, avatar: AvatarConfig) => {
    const newProf = createNewProfile(name, grade);
    newProf.avatar = avatar;
    setProfile(newProf);
    saveProfile(newProf);

    if (gameWorldRef.current) {
      gameWorldRef.current.updateAvatar(avatar);
    }

    setGameState('playing');
    setShowAvatarCustomizer(false);
  };

  const handleUpdateSettings = (settings: PlayerProfile['settings'], grade: GradeLevel) => {
    if (!profile) return;
    const updated: PlayerProfile = {
      ...profile,
      settings,
      gradeLevel: grade
    };
    setProfile(updated);
    saveProfile(updated);

    // If grade changed, refresh dynamic quest
    if (grade !== profile.gradeLevel) {
      const nextQ = getNextDynamicQuest(updated);
      setActiveQuest(nextQ);
    }
  };

  const handleResetProfile = () => {
    clearProfile();
    setProfile(null);
    setActiveQuest(null);
    setShowSettings(false);
    setGameState('start');
  };

  const currentNpcData = activeDialogNPC ? NPCS_DATA.find(n => n.id === activeDialogNPC) : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-900 font-fredoka">
      
      {/* Dedicated 3D Canvas Mount Container (isolated from React re-renders) */}
      <div 
        ref={canvasMountRef} 
        className="absolute inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Start Screen */}
      {gameState === 'start' && (
        <StartScreen
          savedProfile={profile}
          onContinue={handleStartContinue}
          onNewGame={handleStartNewGame}
          onSelectGrade={(g) => {
            if (profile) {
              const updated = { ...profile, gradeLevel: g };
              setProfile(updated);
              saveProfile(updated);
            }
          }}
        />
      )}

      {/* Character Customizer Screen */}
      {gameState === 'customizer' && (
        <AvatarCustomizer
          initialName={profile?.playerName || 'Odkrywca'}
          initialGrade={profile?.gradeLevel || 'grade3'}
          initialAvatar={profile?.avatar}
          onSave={handleSaveAvatar}
          onCancel={profile ? () => setGameState('playing') : undefined}
        />
      )}

      {/* In-Game HUD & Overlay Controls */}
      {gameState === 'playing' && profile && activeQuest && (
        <>
          {/* Top Quest & Stats HUD */}
          <QuestHUD
            profile={profile}
            activeQuest={activeQuest}
            nearInteractable={nearInteractable}
            onInteract={triggerInteraction}
            onToggleJournal={() => setShowJournal(true)}
          />

          {/* Ergonomic Collapsible Bottom Dock (Three.js skill compliant) */}
          <CinemaDock
            soundEnabled={profile.settings.soundEnabled}
            onToggleSound={() => {
              const next = !profile.settings.soundEnabled;
              handleUpdateSettings({ ...profile.settings, soundEnabled: next }, profile.gradeLevel);
            }}
            onOpenMap={() => setShowMap(true)}
            onOpenWordBook={() => setShowWordBook(true)}
            onOpenJournal={() => setShowJournal(true)}
            onOpenAvatar={() => setShowAvatarCustomizer(true)}
            onOpenSettings={() => setShowSettings(true)}
          />

          {/* Virtual Mobile Joystick & Action Buttons */}
          {(isTouchDevice || profile.settings.touchControls) && (
            <MobileControls
              gameWorld={gameWorldRef.current}
              onInteract={triggerInteraction}
              canInteract={!!nearInteractable}
            />
          )}

          {/* Dialog Modal for NPC Quests */}
          {activeDialogNPC && currentNpcData && activeQuest && (
            <DialogModal
              quest={activeQuest}
              npc={currentNpcData}
              onSuccess={handleQuestSuccess}
              onClose={() => setActiveDialogNPC(null)}
            />
          )}

          {/* World Map Modal */}
          {showMap && (
            <WorldMapModal
              playerPos={{
                x: gameWorldRef.current?.playerPos.x || 0,
                z: gameWorldRef.current?.playerPos.z || 0
              }}
              unlockedAreas={profile.unlockedAreas}
              onClose={() => setShowMap(false)}
            />
          )}

          {/* Word Book Dictionary Modal */}
          {showWordBook && (
            <WordBookModal
              discoveredWordIds={profile.discoveredWordIds}
              onClose={() => setShowWordBook(false)}
            />
          )}

          {/* Quest Journal Modal */}
          {showJournal && (
            <QuestJournalModal
              profile={profile}
              activeQuest={activeQuest}
              onClose={() => setShowJournal(false)}
            />
          )}

          {/* Quick Avatar Change from Bottom Dock */}
          {showAvatarCustomizer && (
            <AvatarCustomizer
              initialName={profile.playerName}
              initialGrade={profile.gradeLevel}
              initialAvatar={profile.avatar}
              onSave={handleSaveAvatar}
              onCancel={() => setShowAvatarCustomizer(false)}
            />
          )}

          {/* Settings Modal */}
          {showSettings && (
            <SettingsModal
              profile={profile}
              onUpdateSettings={handleUpdateSettings}
              onResetProfile={handleResetProfile}
              onClose={() => setShowSettings(false)}
            />
          )}
        </>
      )}

    </div>
  );
}
