import React, { useState, useEffect } from 'react';
import { X, Volume2, Check, RotateCcw, Ear } from 'lucide-react';
import { WordItem, PlayerProfile } from '../types/game';
import { ISLANDS_DATA } from '../data/curriculum';
import { TTSService } from '../services/tts';
import { SoundFx } from '../services/audio';

interface ListenAndChooseModalProps {
  targetWord: WordItem;
  profile: PlayerProfile;
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
}

export const ListenAndChooseModal: React.FC<ListenAndChooseModalProps> = ({
  targetWord,
  profile,
  onSuccess,
  onFail,
  onClose
}) => {
  const [choices, setChoices] = useState<WordItem[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    // Collect 3 distractors with emojis from the same island
    const currentIsland = ISLANDS_DATA.find(i => i.id === targetWord.category);
    let pool: WordItem[] = [];
    if (currentIsland) {
      pool = currentIsland.words.filter(w => w.id !== targetWord.id);
    }
    // Shuffle and pick 3
    const shuffledPool = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [targetWord, ...shuffledPool].sort(() => 0.5 - Math.random());
    setChoices(allOptions);
    setSelectedWordId(null);
    setIsAnswered(false);

    // Auto-play audio on open
    setTimeout(() => {
      TTSService.speak(targetWord.english, profile.settings.ttsSlow);
    }, 250);
  }, [targetWord]);

  const handlePlayAudio = () => {
    TTSService.speak(targetWord.english, profile.settings.ttsSlow);
  };

  const handleSelect = (word: WordItem) => {
    if (isAnswered) return;
    setSelectedWordId(word.id);
    setIsAnswered(true);

    if (word.id === targetWord.id) {
      setIsCorrect(true);
      SoundFx.playSuccess();
      setTimeout(() => {
        onSuccess();
      }, 1400);
    } else {
      setIsCorrect(false);
      SoundFx.playFail();
      onFail();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-sky-500 rounded-3xl shadow-2xl p-6 text-white space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <Ear className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-sky-400">Posłuchaj i Wybierz!</h2>
              <p className="text-xs text-slate-400">Odsłuchaj nagranie i wskaż odpowiedni obrazek</p>
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

        {/* Big Audio Play Button */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800">
          <button
            onClick={handlePlayAudio}
            aria-label="Odtwórz dźwięk słowa"
            className="w-20 h-20 rounded-full bg-sky-500 hover:bg-sky-400 active:scale-95 shadow-xl shadow-sky-500/30 flex items-center justify-center text-white transition-all cursor-pointer animate-pulse"
          >
            <Volume2 className="w-10 h-10" />
          </button>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Dotknij głośnika, aby posłuchać ponownie
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {choices.map((item) => {
            const isSelected = selectedWordId === item.id;
            let cardClass = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white';
            if (isSelected && isCorrect) {
              cardClass = 'bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-500/30 scale-[1.02]';
            } else if (isSelected && !isCorrect) {
              cardClass = 'bg-rose-600 border-rose-400 text-white';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                disabled={isAnswered && isCorrect}
                className={`min-h-[100px] p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${cardClass}`}
              >
                <span className="text-4xl">{item.emoji}</span>
                <span className="text-xs font-bold text-slate-300">
                  {profile.settings.showPolishSubtitles ? `(${item.polish})` : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback info */}
        {isAnswered && !isCorrect && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-2xl flex items-center gap-2 text-rose-300 text-xs font-bold animate-in fade-in">
            <RotateCcw className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>To nie ten obrazek! Posłuchaj jeszcze raz i spróbuj ponownie.</span>
          </div>
        )}

        {isAnswered && isCorrect && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl flex items-center gap-2 text-emerald-300 text-xs font-bold animate-in fade-in">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>Znakomicie! Rozpoznałeś słowo ze słuchu!</span>
          </div>
        )}
      </div>
    </div>
  );
};
