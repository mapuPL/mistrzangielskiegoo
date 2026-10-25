import React, { useState } from 'react';
import { 
  Coins, 
  Trophy, 
  Flame, 
  Map as MapIcon, 
  ShoppingBag, 
  BookA, 
  Award, 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  BookOpenCheck,
  Compass,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PlayerProfile, ActiveQuest, IslandConfig } from '../types/game';

interface HUDProps {
  profile: PlayerProfile;
  activeQuest: ActiveQuest | null;
  activeIsland: IslandConfig | null;
  onOpenMap: () => void;
  onOpenShop: () => void;
  onOpenWordBook: () => void;
  onOpenBadges: () => void;
  onOpenSettings: () => void;
  onOpenFlashcards: () => void;
  onToggleSound: () => void;
  onOpenNewGamePrompt: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  profile,
  activeQuest,
  activeIsland,
  onOpenMap,
  onOpenShop,
  onOpenWordBook,
  onOpenBadges,
  onOpenSettings,
  onOpenFlashcards,
  onToggleSound,
  onOpenNewGamePrompt
}) => {
  const [questCollapsed, setQuestCollapsed] = useState<boolean>(false);
  const difficultCount = profile.difficultWordIds.length;

  return (
    <header className="absolute inset-x-0 top-0 z-30 pointer-events-none p-3 md:p-5 flex flex-col gap-3 font-sans select-none">
      {/* Top Main Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-2">
        {/* Left Stats Capsule */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border-2 border-emerald-500/50 shadow-xl text-white">
          {/* Coins */}
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-sm md:text-base">
            <Coins className="w-5 h-5 drop-shadow" />
            <span>{profile.coins}</span>
          </div>

          <div className="w-[1px] h-5 bg-slate-700 mx-1" />

          {/* Score */}
          <div className="flex items-center gap-1.5 text-sky-400 font-extrabold text-sm md:text-base">
            <Trophy className="w-5 h-5 drop-shadow" />
            <span>{profile.score}</span>
          </div>

          <div className="w-[1px] h-5 bg-slate-700 mx-1" />

          {/* Daily Streak */}
          <div className="flex items-center gap-1 text-orange-400 font-extrabold text-sm md:text-base" title="Seria dni">
            <Flame className="w-5 h-5 animate-pulse drop-shadow" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Difficult words alert */}
          {difficultCount > 0 && (
            <>
              <div className="w-[1px] h-5 bg-slate-700 mx-1" />
              <button
                onClick={onOpenFlashcards}
                aria-label="Powtórz trudne słowa"
                className="flex items-center gap-1 text-rose-400 font-bold text-xs md:text-sm bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer min-h-[32px]"
              >
                <BookOpenCheck className="w-4 h-4" />
                <span>Powtórka ({difficultCount})</span>
              </button>
            </>
          )}
        </div>

        {/* Right Navigation Controls */}
        <nav aria-label="Główne menu gry" className="pointer-events-auto flex items-center gap-1.5 md:gap-2">
          {/* World Map Button */}
          <button
            onClick={onOpenMap}
            title="Mapa Świata i Wybór Wysp (Klawisz M / ESC)"
            aria-label="Mapa Świata"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold shadow-lg border-2 border-emerald-400 transition-all cursor-pointer"
          >
            <MapIcon className="w-5 h-5" />
            <span className="hidden lg:inline ml-1.5 text-xs">Mapa</span>
          </button>

          {/* Flashcards / Review Mode */}
          <button
            onClick={onOpenFlashcards}
            title="Tryb Powtórka (Fiszki Leitnera)"
            aria-label="Tryb Powtórka"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold shadow-lg border-2 border-purple-400 transition-all cursor-pointer"
          >
            <BookOpenCheck className="w-5 h-5" />
            <span className="hidden lg:inline ml-1.5 text-xs">Fiszki</span>
          </button>

          {/* Avatar Shop */}
          <button
            onClick={onOpenShop}
            title="Sklep Avatara i Odblokowanie Wysp"
            aria-label="Sklep Avatara"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold shadow-lg border-2 border-amber-400 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden lg:inline ml-1.5 text-xs">Sklep</span>
          </button>

          {/* Word Book / Dictionary */}
          <button
            onClick={onOpenWordBook}
            title="Słowniczek Odkrytych Słów"
            aria-label="Słowniczek"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold shadow-lg border-2 border-sky-400 transition-all cursor-pointer"
          >
            <BookA className="w-5 h-5" />
          </button>

          {/* Badges / Achievements */}
          <button
            onClick={onOpenBadges}
            title="Osiągnięcia i Odznaki"
            aria-label="Osiągnięcia"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold shadow-lg border-2 border-indigo-400 transition-all cursor-pointer"
          >
            <Award className="w-5 h-5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={profile.settings.sfxVolume > 0 ? 'Wycisz dźwięki' : 'Włącz dźwięki'}
            aria-label="Przełącz dźwięki"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white shadow-lg border-2 border-slate-600 transition-all cursor-pointer"
          >
            {profile.settings.sfxVolume > 0 ? (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-rose-400" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Ustawienia gry i dostępność"
            aria-label="Ustawienia"
            className="flex items-center justify-center min-w-[48px] min-h-[48px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white shadow-lg border-2 border-slate-600 transition-all cursor-pointer"
          >
            <SettingsIcon className="w-5 h-5 text-slate-300" />
          </button>
        </nav>
      </div>

      {/* Active Quest Drawer (Collapsible on Mobile) */}
      {activeQuest && (
        <section aria-label="Aktywna misja" className="pointer-events-auto self-start max-w-sm md:max-w-md w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-amber-500/60 shadow-2xl text-white overflow-hidden transition-all duration-300">
          {/* Header row with toggle button */}
          <div 
            onClick={() => setQuestCollapsed(!questCollapsed)}
            className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/80 cursor-pointer select-none hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">MISJA</span>
              <span className="font-extrabold text-sm text-amber-300 truncate">{activeQuest.titlePl}</span>
            </div>
            <button 
              aria-label={questCollapsed ? "Rozwiń opis misji" : "Zwiń opis misji"}
              className="p-1 text-slate-400 hover:text-white"
            >
              {questCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
          </div>

          {/* Collapsible Content */}
          {!questCollapsed && (
            <div className="p-3.5 space-y-2.5 text-xs md:text-sm">
              <p className="text-slate-300 leading-relaxed">{activeQuest.instructionPl}</p>
              
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeQuest.targetWord.emoji}</span>
                  <div>
                    <div className="font-bold text-white text-sm uppercase tracking-wide">
                      {activeQuest.targetWord.english}
                    </div>
                    {profile.settings.showPolishSubtitles && (
                      <div className="text-slate-400 text-xs">
                        ({activeQuest.targetWord.polish})
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-amber-400 font-bold block">Nagroda</span>
                  <span className="text-xs text-white font-black">+{activeQuest.rewardCoins} monet</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-medium">
                  <span>Postęp zadania</span>
                  <span className="font-bold text-emerald-400">{activeQuest.currentCount} / {activeQuest.requiredCount}</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (activeQuest.currentCount / activeQuest.requiredCount) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </header>
  );
};
