import React, { useState, useEffect } from 'react';
import { X, Volume2, RotateCcw, Check, Sparkles, BookOpenCheck, ChevronRight } from 'lucide-react';
import { WordItem, PlayerProfile } from '../types/game';
import { ISLANDS_DATA } from '../data/curriculum';
import { TTSService } from '../services/tts';
import { SoundFx } from '../services/audio';

interface FlashcardReviewModalProps {
  profile: PlayerProfile;
  onPromoteWord: (wordId: string) => void;
  onDemoteWord: (wordId: string) => void;
  onClose: () => void;
}

export const FlashcardReviewModal: React.FC<FlashcardReviewModalProps> = ({
  profile,
  onPromoteWord,
  onDemoteWord,
  onClose
}) => {
  const [cards, setCards] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    // Gather all vocabulary
    const allWords: WordItem[] = [];
    ISLANDS_DATA.forEach(isl => allWords.push(...isl.words));

    // Priority 1: Difficult words list
    const diffWords = allWords.filter(w => profile.difficultWordIds.includes(w.id));
    // Priority 2: Other discovered words
    const otherWords = allWords.filter(w => !profile.difficultWordIds.includes(w.id));

    const queue = [...diffWords, ...otherWords.slice(0, 10)];
    setCards(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [profile.difficultWordIds]);

  const currentWord = cards[currentIndex];

  const handleFlip = () => {
    SoundFx.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleRemembered = () => {
    if (!currentWord) return;
    SoundFx.playSuccess();
    onPromoteWord(currentWord.id);
    nextCard();
  };

  const handleStillDifficult = () => {
    if (!currentWord) return;
    SoundFx.playFail();
    onDemoteWord(currentWord.id);
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Reached end of review deck
      onClose();
    }
  };

  if (!currentWord) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
        <div className="w-full max-w-md bg-slate-900 border-2 border-purple-500 rounded-3xl p-6 text-center space-y-4">
          <BookOpenCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Brak słów do powtórki!</h2>
          <p className="text-sm text-slate-300">Wszystkie poznane słówka masz opanowane na medal!</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white"
          >
            Wróć do gry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-purple-500 rounded-3xl shadow-2xl p-6 text-white space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
              <BookOpenCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-purple-400">Powtórka z Fiszkami (Leitner)</h2>
              <p className="text-xs text-slate-400">
                Karta {currentIndex + 1} z {cards.length} {profile.difficultWordIds.includes(currentWord.id) && '(Trudne słowo!)'}
              </p>
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

        {/* Flip Card Container */}
        <div 
          onClick={handleFlip}
          className="relative min-h-[220px] p-6 rounded-3xl bg-slate-800/90 border-2 border-slate-700 hover:border-purple-400 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-300 shadow-xl"
        >
          {!isFlipped ? (
            /* FRONT: English word */
            <div className="space-y-3">
              <span className="text-5xl">{currentWord.emoji}</span>
              <h3 className="text-3xl font-black text-amber-300 uppercase tracking-wider">{currentWord.english}</h3>
              {currentWord.phoneticTip && (
                <p className="text-xs text-slate-400 font-mono">{currentWord.phoneticTip}</p>
              )}
              <span className="inline-block text-xs text-purple-400 font-bold bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                Dotknij karty, aby sprawdzić znaczenie PL
              </span>
            </div>
          ) : (
            /* BACK: Polish meaning & hint */
            <div className="space-y-3 animate-in fade-in">
              <h3 className="text-3xl font-black text-emerald-400 capitalize">{currentWord.polish}</h3>
              <p className="text-sm text-slate-300 max-w-xs">{currentWord.hintPl}</p>
              {currentWord.exampleEn && (
                <p className="text-xs text-slate-400 italic">"{currentWord.exampleEn}"</p>
              )}
            </div>
          )}

          {/* Quick audio button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              TTSService.speak(currentWord.english, profile.settings.ttsSlow);
            }}
            title="Odsłuchaj wymowę"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-700 hover:bg-slate-600 text-white shadow-md active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: "Jeszcze ćwiczę" vs "Pamiętam!" */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleStillDifficult}
            className="min-h-[48px] py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-rose-500/60 text-rose-300 font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 text-rose-400" />
            <span>Jeszcze ćwiczę</span>
          </button>

          <button
            onClick={handleRemembered}
            className="min-h-[48px] py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-400 text-white font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>Już pamiętam!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
