import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, Sparkles } from 'lucide-react';
import { WordItem, PlayerProfile } from '../types/game';
import { ISLANDS_DATA } from '../data/curriculum';
import { SoundFx } from '../services/audio';

interface WordMatchModalProps {
  categoryWords: WordItem[];
  profile: PlayerProfile;
  onSuccess: () => void;
  onClose: () => void;
}

export const WordMatchModal: React.FC<WordMatchModalProps> = ({
  categoryWords,
  profile,
  onSuccess,
  onClose
}) => {
  // Pick 3 words to match
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wordsList, setWordsList] = useState<{ id: string; text: string; wordId: string }[]>([]);
  const [emojisList, setEmojisList] = useState<{ id: string; emoji: string; wordId: string; polish: string }[]>([]);

  useEffect(() => {
    const subset = categoryWords.slice(0, 3);
    const words = subset.map(w => ({ id: `w_${w.id}`, text: w.english, wordId: w.id })).sort(() => 0.5 - Math.random());
    const emojis = subset.map(w => ({ id: `e_${w.id}`, emoji: w.emoji, wordId: w.id, polish: w.polish })).sort(() => 0.5 - Math.random());
    setWordsList(words);
    setEmojisList(emojis);
    setMatchedIds([]);
    setSelectedWord(null);
    setSelectedEmoji(null);
  }, [categoryWords]);

  const handleWordClick = (wordId: string) => {
    if (matchedIds.includes(wordId)) return;
    SoundFx.playClick();
    setSelectedWord(wordId);

    if (selectedEmoji) {
      checkMatch(wordId, selectedEmoji);
    }
  };

  const handleEmojiClick = (wordId: string) => {
    if (matchedIds.includes(wordId)) return;
    SoundFx.playClick();
    setSelectedEmoji(wordId);

    if (selectedWord) {
      checkMatch(selectedWord, wordId);
    }
  };

  const checkMatch = (wId: string, eId: string) => {
    if (wId === eId) {
      // Match found!
      const newMatched = [...matchedIds, wId];
      setMatchedIds(newMatched);
      setSelectedWord(null);
      setSelectedEmoji(null);
      SoundFx.playSuccess();

      if (newMatched.length === 3) {
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } else {
      // Mismatch
      SoundFx.playFail();
      setSelectedWord(null);
      setSelectedEmoji(null);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-3xl shadow-2xl p-6 text-white space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-emerald-400">Dopasuj słowo do obrazka!</h2>
              <p className="text-xs text-slate-400">Wybierz parę: angielskie słowo i właściwy symbol</p>
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

        {/* Two Columns Grid: Words on Left, Emojis on Right */}
        <div className="grid grid-cols-2 gap-4">
          {/* Words Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Słowa (EN)</p>
            {wordsList.map(item => {
              const isMatched = matchedIds.includes(item.wordId);
              const isSelected = selectedWord === item.wordId;
              return (
                <button
                  key={item.id}
                  onClick={() => handleWordClick(item.wordId)}
                  disabled={isMatched}
                  className={`w-full min-h-[56px] p-3 rounded-2xl border-2 font-black text-sm md:text-base capitalize transition-all active:scale-95 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-600/40 border-emerald-500 text-emerald-300 opacity-60'
                      : isSelected
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>

          {/* Emojis Column */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Obrazki</p>
            {emojisList.map(item => {
              const isMatched = matchedIds.includes(item.wordId);
              const isSelected = selectedEmoji === item.wordId;
              return (
                <button
                  key={item.id}
                  onClick={() => handleEmojiClick(item.wordId)}
                  disabled={isMatched}
                  className={`w-full min-h-[56px] p-2 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-600/40 border-emerald-500 text-emerald-300 opacity-60'
                      : isSelected
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  {profile.settings.showPolishSubtitles && (
                    <span className="text-xs font-bold">({item.polish})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Notice */}
        {matchedIds.length === 3 && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl flex items-center gap-2 text-emerald-300 text-sm font-bold animate-in fade-in">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>Wszystkie pary połączone prawidłowo! Gratulacje!</span>
          </div>
        )}
      </div>
    </div>
  );
};
