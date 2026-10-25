import React, { useState, useEffect } from 'react';
import { X, Volume2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { WordItem, PlayerProfile } from '../types/game';
import { TTSService } from '../services/tts';
import { SoundFx } from '../services/audio';

interface WordScrambleModalProps {
  word: WordItem;
  profile: PlayerProfile;
  onSuccess: () => void;
  onClose: () => void;
}

export const WordScrambleModal: React.FC<WordScrambleModalProps> = ({
  word,
  profile,
  onSuccess,
  onClose
}) => {
  const targetChars = word.english.toUpperCase().split('');
  const [scrambledPool, setScrambledPool] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [selectedChars, setSelectedChars] = useState<{ id: string; char: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  useEffect(() => {
    // Generate scrambled pool
    const letters = targetChars.map((char, index) => ({
      id: `${char}_${index}_${Math.random()}`,
      char,
      used: false
    }));
    // Shuffle ensuring it's not solved by default
    setScrambledPool(letters.sort(() => 0.5 - Math.random()));
    setSelectedChars([]);
    setIsCompleted(false);
    setIsWrong(false);
    TTSService.speak(word.english, profile.settings.ttsSlow);
  }, [word]);

  const handlePickLetter = (item: { id: string; char: string; used: boolean }) => {
    if (item.used || isCompleted) return;

    SoundFx.playClick();
    const newSelected = [...selectedChars, { id: item.id, char: item.char }];
    setSelectedChars(newSelected);

    // Mark as used in pool
    setScrambledPool(prev => prev.map(p => p.id === item.id ? { ...p, used: true } : p));

    // Check if full word formed
    if (newSelected.length === targetChars.length) {
      const formedWord = newSelected.map(s => s.char).join('');
      if (formedWord === word.english.toUpperCase()) {
        setIsCompleted(true);
        setIsWrong(false);
        SoundFx.playSuccess();
        setTimeout(() => {
          onSuccess();
        }, 1300);
      } else {
        setIsWrong(true);
        SoundFx.playFail();
      }
    }
  };

  const handleRemoveLetter = (indexToRemove: number) => {
    if (isCompleted) return;
    const removedItem = selectedChars[indexToRemove];
    setSelectedChars(prev => prev.filter((_, i) => i !== indexToRemove));
    setScrambledPool(prev => prev.map(p => p.id === removedItem.id ? { ...p, used: false } : p));
    setIsWrong(false);
  };

  const handleReset = () => {
    setSelectedChars([]);
    setScrambledPool(prev => prev.map(p => ({ ...p, used: false })));
    setIsWrong(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500 rounded-3xl shadow-2xl p-6 text-white space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-amber-400">Ułóż słowo z liter!</h2>
              <p className="text-xs text-slate-400">Dotknij liter we właściwej kolejności</p>
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

        {/* Word Clue Box */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{word.emoji}</span>
            <div>
              <p className="text-sm font-bold text-slate-200">
                Szukane słowo: <span className="text-amber-300 font-extrabold">{word.polish}</span>
              </p>
              {profile.settings.showPolishSubtitles && (
                <p className="text-xs text-slate-400">{word.hintPl}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => TTSService.speak(word.english, profile.settings.ttsSlow)}
            aria-label="Odsłuchaj wymowę"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer min-h-[36px]"
          >
            <Volume2 className="w-4 h-4" />
            <span>Wymowa</span>
          </button>
        </div>

        {/* Target Slots Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[64px] p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
          {targetChars.map((_, idx) => {
            const letter = selectedChars[idx];
            return (
              <button
                key={idx}
                onClick={() => letter && handleRemoveLetter(idx)}
                aria-label={letter ? `Usuń literę ${letter.char}` : 'Puste miejsce na literę'}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all cursor-pointer ${
                  letter
                    ? isWrong 
                      ? 'bg-rose-600 border-rose-400 text-white animate-shake' 
                      : isCompleted
                        ? 'bg-emerald-600 border-emerald-400 text-white'
                        : 'bg-amber-500 border-amber-300 text-slate-950 shadow-md'
                    : 'border-dashed border-slate-700 bg-slate-900/50 text-slate-600'
                }`}
              >
                {letter ? letter.char : ''}
              </button>
            );
          })}
        </div>

        {/* Scrambled Available Letter Pool */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Dostępne litery:</span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetuj</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {scrambledPool.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePickLetter(item)}
                disabled={item.used || isCompleted}
                aria-label={`Wybierz literę ${item.char}`}
                className={`w-12 h-14 rounded-xl font-black text-xl border-2 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  item.used
                    ? 'opacity-25 border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white shadow-lg'
                }`}
              >
                {item.char}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {isCompleted && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl flex items-center gap-2 text-emerald-300 text-sm font-bold animate-in fade-in">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>Świetnie! Poprawnie ułożyłeś słowo {word.english.toUpperCase()}!</span>
          </div>
        )}
      </div>
    </div>
  );
};
