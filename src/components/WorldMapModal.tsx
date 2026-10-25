import React from 'react';
import { X, Lock, Check, MapPin, Sparkles, Navigation, Shuffle, Coins } from 'lucide-react';
import { IslandConfig, IslandId, DifficultyLevel, PlayerProfile } from '../types/game';
import { ISLANDS_DATA } from '../data/curriculum';
import { SoundFx } from '../services/audio';

interface WorldMapModalProps {
  profile: PlayerProfile;
  activeIslands: IslandConfig[];
  currentIslandId: IslandId;
  onSelectIsland: (id: IslandId | 'hub') => void;
  onUnlockIsland: (id: IslandId, cost: number) => void;
  onChangeDifficulty: (lvl: DifficultyLevel) => void;
  onNewRandomGame: () => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  profile,
  activeIslands,
  currentIslandId,
  onSelectIsland,
  onUnlockIsland,
  onChangeDifficulty,
  onNewRandomGame,
  onClose
}) => {
  const activeIds = activeIslands.map(i => i.id);

  const handleTeleport = (id: IslandId | 'hub') => {
    SoundFx.playClick();
    onSelectIsland(id);
    onClose();
  };

  const handleUnlock = (isl: IslandConfig) => {
    if (profile.coins >= isl.unlockCostCoins) {
      SoundFx.playSuccess();
      onUnlockIsland(isl.id, isl.unlockCostCoins);
    } else {
      SoundFx.playFail();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-emerald-500 rounded-3xl shadow-2xl p-5 md:p-7 text-white space-y-6 my-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <Navigation className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-emerald-400">Mapa Ruchomych Wysp (Worldland)</h2>
              <p className="text-xs md:text-sm text-slate-400">Wybierz wyspę do eksploracji lub odblokuj nową krainę</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij (Esc)"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Selector Bar */}
        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-amber-400">Poziom Trudności:</span>
            <div className="flex items-center gap-1.5">
              {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(lvl => {
                const label = lvl === 'easy' ? 'Łatwy' : lvl === 'medium' ? 'Średni' : 'Trudny';
                const isSelected = profile.difficulty === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      SoundFx.playClick();
                      onChangeDifficulty(lvl);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Random Game Shuffle Button */}
          <button
            onClick={() => {
              SoundFx.playClick();
              onNewRandomGame();
              onClose();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-xl text-xs font-black text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Shuffle className="w-4 h-4" />
            <span>Nowe Losowanie 3 Wysp</span>
          </button>
        </div>

        {/* Central Hub Button */}
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sky-400">
              🏛️
            </div>
            <div>
              <h4 className="font-extrabold text-sm md:text-base text-white">Rynek Główny Wordland (PCD Polska Hub)</h4>
              <p className="text-xs text-slate-400">Kultowy Fiat 126p Maluch, przystanek PKS i tablice do Szczecina</p>
            </div>
          </div>
          <button
            onClick={() => handleTeleport('hub')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl text-xs font-extrabold text-white transition-all active:scale-95 cursor-pointer shadow-md"
          >
            Teleportuj do Hubu
          </button>
        </div>

        {/* 7 Islands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          {ISLANDS_DATA.map(isl => {
            const isUnlocked = profile.unlockedIslands.includes(isl.id);
            const isActive = activeIds.includes(isl.id);
            const isCurrent = currentIslandId === isl.id;

            return (
              <div
                key={isl.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 transition-all ${
                  isActive
                    ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                    : isUnlocked
                      ? 'bg-slate-900/60 border-slate-700 opacity-80'
                      : 'bg-slate-950/80 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span 
                      className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-950"
                      style={{ backgroundColor: isl.themeColor }}
                    >
                      {isActive ? 'Aktywna w grze' : isUnlocked ? 'W zasobach' : 'Zablokowana'}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <MapPin className="w-3.5 h-3.5" /> Tu jesteś
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-base text-white">{isl.namePl}</h3>
                  <p className="text-xs text-amber-300 font-bold">{isl.nameEn}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{isl.descriptionPl}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Słów w puli: {isl.words.length} • Pora: {isl.timeOfDay}</p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  {isUnlocked ? (
                    isActive ? (
                      <button
                        onClick={() => handleTeleport(isl.id)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl text-xs font-black text-white shadow-md transition-all cursor-pointer"
                      >
                        Przejdź na wyspę
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Wylosuj w następnej grze</span>
                    )
                  ) : (
                    <button
                      onClick={() => handleUnlock(isl)}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 active:scale-95 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Odblokuj za {isl.unlockCostCoins}</span>
                      <Coins className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
