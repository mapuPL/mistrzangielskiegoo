import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  PlayerProfile, 
  IslandConfig, 
  IslandId, 
  WordItem, 
  ActiveQuest, 
  DifficultyLevel, 
  ShopItem,
  MiniGameType 
} from './types/game';
import { ISLANDS_DATA, BADGES_DATA } from './data/curriculum';
import { 
  loadSavedProfile, 
  saveProfile, 
  markWordDifficult, 
  promoteLeitnerWord, 
  checkBadges, 
  resetSavedProgress 
} from './services/storage';
import { SoundFx } from './services/audio';
import { TTSService } from './services/tts';
import { GameWorld } from './game3d/GameWorld';

// Components
import { HUD } from './components/HUD';
import { MobileControls } from './components/MobileControls';
import { NPCDialogModal } from './components/NPCDialogModal';
import { WordScrambleModal } from './components/WordScrambleModal';
import { ListenAndChooseModal } from './components/ListenAndChooseModal';
import { WordMatchModal } from './components/WordMatchModal';
import { FlashcardReviewModal } from './components/FlashcardReviewModal';
import { WorldMapModal } from './components/WorldMapModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { BadgesModal } from './components/BadgesModal';
import { WordBookModal } from './components/WordBookModal';

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameWorldRef = useRef<GameWorld | null>(null);

  // Core State
  const [profile, setProfile] = useState<PlayerProfile>(() => loadSavedProfile());
  const [activeIslands, setActiveIslands] = useState<IslandConfig[]>([]);
  const [currentIslandId, setCurrentIslandId] = useState<IslandId>('zoo');
  const [activeQuest, setActiveQuest] = useState<ActiveQuest | null>(null);

  // Proximity & Interaction Triggers
  const [nearNPC, setNearNPC] = useState<{ npcId: string; islandId: IslandId } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals Visibility
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isWordBookOpen, setIsWordBookOpen] = useState<boolean>(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState<boolean>(false);
  
  // Educational Game Modals
  const [isNPCDialogOpen, setIsNPCDialogOpen] = useState<boolean>(false);
  const [isScrambleOpen, setIsScrambleOpen] = useState<boolean>(false);
  const [isListenOpen, setIsListenOpen] = useState<boolean>(false);
  const [isMatchOpen, setIsMatchOpen] = useState<boolean>(false);

  // Initialize Audio volume from profile
  useEffect(() => {
    SoundFx.setVolume(profile.settings.sfxVolume);
  }, []);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3200);
  };

  /* ==========================================================================
     RANDOM 3 ISLANDS & WORDS GENERATOR
     ========================================================================== */

  const generateSession = useCallback((customProfile?: PlayerProfile) => {
    const p = customProfile || profile;
    
    // 1. Pick 3 islands from available pool (preferring unlocked ones)
    const available = ISLANDS_DATA.filter(i => p.unlockedIslands.includes(i.id));
    const fallback = ISLANDS_DATA;
    const pool = available.length >= 3 ? available : fallback;

    const shuffledIslands = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    setActiveIslands(shuffledIslands);

    // 2. Select initial island and quest word
    const startIsland = shuffledIslands[0];
    setCurrentIslandId(startIsland.id);

    // 3. Pick 3-4 words for the session
    const wordsPool = [...startIsland.words].sort(() => 0.5 - Math.random());
    const initialWord = wordsPool[0];

    // 4. Determine random mini-game type
    const gameTypes: MiniGameType[] = ['collector', 'npc_riddle', 'word_scramble', 'listen_and_choose', 'word_match'];
    const selectedType = gameTypes[Math.floor(Math.random() * gameTypes.length)];

    const quest: ActiveQuest = {
      id: `quest_${Date.now()}`,
      islandId: startIsland.id,
      targetWord: initialWord,
      gameType: selectedType,
      titlePl: `Misja: ${initialWord.polish.toUpperCase()}`,
      titleEn: `Quest: ${initialWord.english.toUpperCase()}`,
      instructionPl: selectedType === 'collector' 
        ? `Zbierz świecące litery na wyspie, aby ułożyć słowo: ${initialWord.english.toUpperCase()} (${initialWord.polish})!`
        : selectedType === 'word_scramble'
          ? `Ułóż litery w poprawnej kolejności dla słowa: ${initialWord.polish}!`
          : selectedType === 'listen_and_choose'
            ? `Posłuchaj wymowy lektora i wskaż odpowiedni obrazek!`
            : `Porozmawiaj z mieszkańcem wyspy i rozwiąż zagadkę słowną!`,
      instructionEn: `Discover the word ${initialWord.english.toUpperCase()}!`,
      requiredCount: selectedType === 'collector' ? initialWord.english.length : 1,
      currentCount: 0,
      completed: false,
      rewardCoins: 5,
      rewardScore: 50
    };

    setActiveQuest(quest);

    // 5. Load into 3D world if ready
    if (gameWorldRef.current) {
      gameWorldRef.current.loadIslands(shuffledIslands, initialWord, startIsland.id);
      gameWorldRef.current.updateEquippedCosmetics(p.equippedHat, p.equippedWings, p.equippedTrail);
    }

    showToast(`Wylosowano 3 wyspy: ${shuffledIslands.map(i => i.namePl).join(', ')}!`);
  }, [profile]);

  /* ==========================================================================
     INIT THREE.JS ENGINE ON MOUNT
     ========================================================================== */

  useEffect(() => {
    if (!containerRef.current) return;

    const callbacks = {
      onCollectLetter: (letter: string, fullWord: string, isWordComplete: boolean) => {
        setActiveQuest(prev => {
          if (!prev) return null;
          const nextCount = prev.currentCount + 1;
          if (isWordComplete || nextCount >= prev.requiredCount) {
            handleCompleteQuest(prev);
          }
          return { ...prev, currentCount: nextCount };
        });
      },
      onNearNPC: (npcId: string, islandId: IslandId) => {
        setNearNPC({ npcId, islandId });
      },
      onLeaveNPC: () => {
        setNearNPC(null);
      },
      onEnterGate: (gateCategory: string) => {
        handleGateEnter(gateCategory);
      },
      onFallIntoAbyss: () => {
        showToast('Spadłeś w przepaść! Teleportowano bezpiecznie na Rynek Główny.');
      }
    };

    const world = new GameWorld(containerRef.current, callbacks);
    gameWorldRef.current = world;

    // Start initial session
    generateSession();

    return () => {
      world.destroy();
      gameWorldRef.current = null;
    };
  }, []);

  /* ==========================================================================
     QUEST COMPLETION & REWARDS
     ========================================================================== */

  const handleCompleteQuest = (quest: ActiveQuest) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    SoundFx.playFanfare();

    setProfile(prev => {
      const newCoins = prev.coins + quest.rewardCoins;
      const newScore = prev.score + quest.rewardScore;
      const newDiscovered = Array.from(new Set([...prev.discoveredWordIds, quest.targetWord.id]));
      const newQuestsCount = prev.totalQuestsCompleted + 1;
      const newConsecutive = prev.consecutiveCorrect + 1;

      const updated: PlayerProfile = {
        ...prev,
        coins: newCoins,
        score: newScore,
        discoveredWordIds: newDiscovered,
        totalQuestsCompleted: newQuestsCount,
        consecutiveCorrect: newConsecutive,
        dailyQuestDone: true
      };

      const { updatedProfile, newBadge } = checkBadges(updated);
      saveProfile(updatedProfile);

      if (newBadge) {
        const badgeMeta = BADGES_DATA.find(b => b.id === newBadge);
        showToast(`🎉 Nowa Odznaka: ${badgeMeta ? badgeMeta.namePl : newBadge}!`);
      } else {
        showToast(`Brawo! Misja ukończona! +${quest.rewardCoins} monet, +${quest.rewardScore} pkt.`);
      }

      return updatedProfile;
    });

    // Advance to next quest or word
    setTimeout(() => {
      advanceNextQuest();
    }, 2000);
  };

  const advanceNextQuest = () => {
    if (!activeIslands.length) return;
    const currentIsland = activeIslands.find(i => i.id === currentIslandId) || activeIslands[0];
    const unusedWords = currentIsland.words.filter(w => !profile.discoveredWordIds.includes(w.id));
    const nextWord = unusedWords.length > 0 
      ? unusedWords[Math.floor(Math.random() * unusedWords.length)]
      : currentIsland.words[Math.floor(Math.random() * currentIsland.words.length)];

    const gameTypes: MiniGameType[] = ['collector', 'npc_riddle', 'word_scramble', 'listen_and_choose', 'word_match'];
    const selectedType = gameTypes[Math.floor(Math.random() * gameTypes.length)];

    const quest: ActiveQuest = {
      id: `quest_${Date.now()}`,
      islandId: currentIsland.id,
      targetWord: nextWord,
      gameType: selectedType,
      titlePl: `Misja: ${nextWord.polish.toUpperCase()}`,
      titleEn: `Quest: ${nextWord.english.toUpperCase()}`,
      instructionPl: selectedType === 'collector' 
        ? `Zbierz litery dla słowa: ${nextWord.english.toUpperCase()} (${nextWord.polish})!`
        : `Rozwiąż wyzwanie dla słowa: ${nextWord.polish}!`,
      instructionEn: `Discover ${nextWord.english.toUpperCase()}!`,
      requiredCount: selectedType === 'collector' ? nextWord.english.length : 1,
      currentCount: 0,
      completed: false,
      rewardCoins: 5,
      rewardScore: 50
    };

    setActiveQuest(quest);

    if (gameWorldRef.current) {
      gameWorldRef.current.spawnLettersForWord(nextWord);
    }
  };

  /* ==========================================================================
     GATE INTERACTION (SORTING GATES)
     ========================================================================== */

  const handleGateEnter = (gateCategory: string) => {
    if (!activeQuest) return;
    const currentIsland = activeIslands.find(i => i.id === currentIslandId);
    const gateInfo = currentIsland?.gateCategories.find(g => g.id === gateCategory);

    if (gateInfo && gateInfo.isCorrect) {
      handleCompleteQuest(activeQuest);
    } else {
      SoundFx.playFail();
      showToast('To niewłaściwa brama! Spróbuj dopasować poprawną kategorię.');
      setProfile(prev => markWordDifficult(prev, activeQuest.targetWord.id));
    }
  };

  /* ==========================================================================
     KEYBOARD CONTROLS (WASD, ARROWS, SPACE, M, ESC, E)
     ========================================================================== */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameWorldRef.current) return;

      // Modal open disables 3D character keyboard input
      const anyModalOpen = 
        isMapOpen || isShopOpen || isWordBookOpen || isBadgesOpen || 
        isSettingsOpen || isFlashcardsOpen || isNPCDialogOpen || 
        isScrambleOpen || isListenOpen || isMatchOpen;

      if (e.key === 'Escape') {
        if (anyModalOpen) {
          setIsMapOpen(false);
          setIsShopOpen(false);
          setIsWordBookOpen(false);
          setIsBadgesOpen(false);
          setIsSettingsOpen(false);
          setIsFlashcardsOpen(false);
          setIsNPCDialogOpen(false);
          setIsScrambleOpen(false);
          setIsListenOpen(false);
          setIsMatchOpen(false);
        } else {
          setIsMapOpen(true);
        }
        return;
      }

      if (e.key.toLowerCase() === 'm' && !anyModalOpen) {
        setIsMapOpen(true);
        return;
      }

      if (e.key.toLowerCase() === 'e' && nearNPC && !anyModalOpen) {
        triggerNPCInteraction();
        return;
      }

      if (anyModalOpen) return;

      // 3D Movement
      const move = gameWorldRef.current.moveInput;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') move.z = 1;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') move.z = -1;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') move.x = -1;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') move.x = 1;

      // Jump
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        gameWorldRef.current.jumpRequested = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!gameWorldRef.current) return;
      const move = gameWorldRef.current.moveInput;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') if (move.z > 0) move.z = 0;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') if (move.z < 0) move.z = 0;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') if (move.x < 0) move.x = 0;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') if (move.x > 0) move.x = 0;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearNPC, isMapOpen, isShopOpen, isWordBookOpen, isBadgesOpen, isSettingsOpen, isFlashcardsOpen, isNPCDialogOpen, isScrambleOpen, isListenOpen, isMatchOpen]);

  /* ==========================================================================
     NPC INTERACTION ROUTER
     ========================================================================== */

  const triggerNPCInteraction = () => {
    if (!activeQuest) return;

    if (activeQuest.gameType === 'word_scramble') {
      setIsScrambleOpen(true);
    } else if (activeQuest.gameType === 'listen_and_choose') {
      setIsListenOpen(true);
    } else if (activeQuest.gameType === 'word_match') {
      setIsMatchOpen(true);
    } else {
      setIsNPCDialogOpen(true);
    }
  };

  /* ==========================================================================
     RENDER COMPONENT
     ========================================================================== */

  const currentIslandConfig = activeIslands.find(i => i.id === currentIslandId) || null;
  const currentNPCData = currentIslandConfig?.npc || null;

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none ${profile.settings.highContrast ? 'contrast-125 saturate-150' : ''}`}>
      {/* 3D Canvas WebGL Host */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Top HUD Layer */}
      <HUD
        profile={profile}
        activeQuest={activeQuest}
        activeIsland={currentIslandConfig}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenWordBook={() => setIsWordBookOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFlashcards={() => setIsFlashcardsOpen(true)}
        onToggleSound={() => {
          const nextVol = profile.settings.sfxVolume > 0 ? 0 : 0.8;
          SoundFx.setVolume(nextVol);
          setProfile(p => {
            const up = { ...p, settings: { ...p.settings, sfxVolume: nextVol } };
            saveProfile(up);
            return up;
          });
        }}
        onOpenNewGamePrompt={() => generateSession()}
      />

      {/* Near NPC Interaction Action Prompt */}
      {nearNPC && (
        <div className="absolute bottom-24 inset-x-0 flex justify-center pointer-events-none z-30 animate-bounce">
          <button
            onClick={triggerNPCInteraction}
            className="pointer-events-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-base rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>💬</span>
            <span>Porozmawiaj z {nearNPC.npcId} (Naciśnij E / Dotknij)</span>
          </button>
        </div>
      )}

      {/* Mobile Touch Controls */}
      <MobileControls
        onMoveChange={(x, z) => {
          if (gameWorldRef.current) {
            gameWorldRef.current.moveInput.x = x;
            gameWorldRef.current.moveInput.z = z;
          }
        }}
        onJump={() => {
          if (gameWorldRef.current) {
            gameWorldRef.current.jumpRequested = true;
          }
        }}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="absolute top-20 inset-x-0 flex justify-center pointer-events-none z-40 px-4">
          <div className="bg-slate-900/95 border-2 border-emerald-400 text-white px-5 py-2.5 rounded-2xl shadow-2xl text-xs md:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODALS
          ========================================================================== */}

      {/* 1. World Map Modal */}
      {isMapOpen && (
        <WorldMapModal
          profile={profile}
          activeIslands={activeIslands}
          currentIslandId={currentIslandId}
          onSelectIsland={(id) => {
            if (gameWorldRef.current) {
              gameWorldRef.current.teleportToIsland(id);
              if (id !== 'hub') {
                setCurrentIslandId(id);
              }
            }
          }}
          onUnlockIsland={(id, cost) => {
            setProfile(prev => {
              const updated: PlayerProfile = {
                ...prev,
                coins: prev.coins - cost,
                unlockedIslands: [...prev.unlockedIslands, id]
              };
              saveProfile(updated);
              showToast('Odblokowano nową wyspę!');
              return updated;
            });
          }}
          onChangeDifficulty={(lvl) => {
            setProfile(prev => {
              const updated = { ...prev, difficulty: lvl };
              saveProfile(updated);
              return updated;
            });
          }}
          onNewRandomGame={() => generateSession()}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {/* 2. Shop Modal */}
      {isShopOpen && (
        <ShopModal
          profile={profile}
          onBuyItem={(item: ShopItem) => {
            setProfile(prev => {
              const updated: PlayerProfile = {
                ...prev,
                coins: prev.coins - item.cost,
                ownedItems: [...prev.ownedItems, item.id],
                unlockedIslands: item.islandId ? [...prev.unlockedIslands, item.islandId] : prev.unlockedIslands
              };
              saveProfile(updated);
              showToast(`Zakupiono: ${item.namePl}!`);
              return updated;
            });
          }}
          onEquipItem={(category, id) => {
            setProfile(prev => {
              const updated: PlayerProfile = {
                ...prev,
                equippedHat: category === 'hat' ? id : prev.equippedHat,
                equippedWings: category === 'wings' ? id : prev.equippedWings,
                equippedTrail: category === 'trail' ? id : prev.equippedTrail
              };
              saveProfile(updated);
              if (gameWorldRef.current) {
                gameWorldRef.current.updateEquippedCosmetics(updated.equippedHat, updated.equippedWings, updated.equippedTrail);
              }
              return updated;
            });
          }}
          onClose={() => setIsShopOpen(false)}
        />
      )}

      {/* 3. Word Book Modal */}
      {isWordBookOpen && (
        <WordBookModal
          profile={profile}
          onClose={() => setIsWordBookOpen(false)}
        />
      )}

      {/* 4. Badges Modal */}
      {isBadgesOpen && (
        <BadgesModal
          profile={profile}
          onClose={() => setIsBadgesOpen(false)}
        />
      )}

      {/* 5. Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={profile.settings}
          onUpdateSettings={(newSettings) => {
            setProfile(prev => {
              const updated = { ...prev, settings: { ...prev.settings, ...newSettings } };
              saveProfile(updated);
              return updated;
            });
          }}
          onResetProgress={() => {
            const fresh = resetSavedProgress();
            setProfile(fresh);
            generateSession(fresh);
            showToast('Zresetowano postęp gry!');
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* 6. Flashcard Review Modal (Leitner) */}
      {isFlashcardsOpen && (
        <FlashcardReviewModal
          profile={profile}
          onPromoteWord={(wordId) => {
            setProfile(prev => promoteLeitnerWord(prev, wordId));
          }}
          onDemoteWord={(wordId) => {
            setProfile(prev => markWordDifficult(prev, wordId));
          }}
          onClose={() => setIsFlashcardsOpen(false)}
        />
      )}

      {/* 7. NPC Riddle Dialog Modal */}
      {isNPCDialogOpen && currentNPCData && activeQuest && (
        <NPCDialogModal
          npc={currentNPCData}
          word={activeQuest.targetWord}
          profile={profile}
          onSuccess={() => {
            setIsNPCDialogOpen(false);
            handleCompleteQuest(activeQuest);
          }}
          onFail={() => {
            setProfile(prev => markWordDifficult(prev, activeQuest.targetWord.id));
          }}
          onClose={() => setIsNPCDialogOpen(false)}
        />
      )}

      {/* 8. Word Scramble Modal */}
      {isScrambleOpen && activeQuest && (
        <WordScrambleModal
          word={activeQuest.targetWord}
          profile={profile}
          onSuccess={() => {
            setIsScrambleOpen(false);
            handleCompleteQuest(activeQuest);
          }}
          onClose={() => setIsScrambleOpen(false)}
        />
      )}

      {/* 9. Listen and Choose Modal */}
      {isListenOpen && activeQuest && (
        <ListenAndChooseModal
          targetWord={activeQuest.targetWord}
          profile={profile}
          onSuccess={() => {
            setIsListenOpen(false);
            handleCompleteQuest(activeQuest);
          }}
          onFail={() => {
            setProfile(prev => markWordDifficult(prev, activeQuest.targetWord.id));
          }}
          onClose={() => setIsListenOpen(false)}
        />
      )}

      {/* 10. Word Match Modal */}
      {isMatchOpen && currentIslandConfig && (
        <WordMatchModal
          categoryWords={currentIslandConfig.words}
          profile={profile}
          onSuccess={() => {
            setIsMatchOpen(false);
            if (activeQuest) handleCompleteQuest(activeQuest);
          }}
          onClose={() => setIsMatchOpen(false)}
        />
      )}
    </div>
  );
}
