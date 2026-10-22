import React from 'react';
import { QuestVariant, PlayerProfile } from '../types/game';
import { WorldInteractable } from '../game3d/GameWorld';
import { Volume2, Star, Coins, Sparkles, MessageCircle, Eye } from 'lucide-react';
import { SpeechService } from '../services/audio';

interface QuestHUDProps {
  profile: PlayerProfile;
  activeQuest: QuestVariant;
  nearInteractable: WorldInteractable | null;
  onInteract: () => void;
  onToggleJournal: () => void;
}

export const QuestHUD: React.FC<QuestHUDProps> = ({
  profile,
  activeQuest,
  nearInteractable,
  onInteract,
  onToggleJournal
}) => {
  const [showPlSub, setShowPlSub] = React.useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    SpeechService.speakEnglish(activeQuest.audioPhraseEn, 0.85);
  };

  const currentLevelXP = profile.xp % 100;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 font-fredoka flex flex-col justify-between p-3 sm:p-5">
      
      {/* Top Bar: Quest Objective & Player Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        
        {/* Active Quest Card */}
        <div 
          onClick={onToggleJournal}
          className="pointer-events-auto cursor-pointer max-w-md w-full bg-slate-900/85 backdrop-blur-none border-2 border-amber-400 rounded-2xl p-3 sm:p-4 text-white shadow-xl transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-none" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                Misja: {activeQuest.titlePl}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 font-bold">
              {profile.gradeLevel === 'grade4' ? 'Klasa IV' : 'Klasa III'}
            </span>
          </div>

          <div className="text-sm sm:text-base font-bold text-white leading-snug">
            "{activeQuest.audioPhraseEn}"
          </div>

          {showPlSub && (
            <div className="text-xs text-amber-200 mt-1 italic font-medium">
              PL: {activeQuest.instructionPl}
            </div>
          )}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/80 text-xs">
            <span className="text-slate-300 font-medium">
              Cel: {activeQuest.targetLocation.namePl}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSpeak}
                className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center gap-1"
                title="Posłuchaj zadania"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Posłuchaj</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPlSub(!showPlSub);
                }}
                className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] flex items-center gap-1"
                title="Przetłumacz"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Player Stats Badges */}
        <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto bg-slate-900/85 border-2 border-slate-700 rounded-2xl px-3.5 py-2 text-white shadow-xl">
          {/* Level & XP */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
              Lvl {profile.level}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-300 font-bold">{profile.playerName}</span>
              <div className="w-16 h-2 rounded-full bg-slate-700 overflow-hidden mt-0.5">
                <div 
                  className="h-full bg-emerald-400 rounded-full" 
                  style={{ width: `${currentLevelXP}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 text-amber-300 font-bold text-sm px-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{profile.stars}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 text-yellow-300 font-bold text-sm px-1.5">
            <Coins className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{profile.coins}</span>
          </div>
        </div>

      </div>

      {/* Proximity Interaction Prompt Banner */}
      {nearInteractable && (
        <div className="pointer-events-auto mx-auto mb-20 sm:mb-24 animate-bounce">
          <button
            onClick={onInteract}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-900 font-extrabold text-base sm:text-lg shadow-2xl border-4 border-white flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            {nearInteractable.type === 'npc' ? (
              <MessageCircle className="w-6 h-6 text-slate-900" />
            ) : (
              <Sparkles className="w-6 h-6 text-slate-900" />
            )}
            <span>
              [E] lub Kliknij: {nearInteractable.namePl}
            </span>
          </button>
        </div>
      )}

    </div>
  );
};
