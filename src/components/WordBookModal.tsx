import React, { useState } from 'react';
import { VOCABULARY_DATABASE } from '../data/curriculum';
import { QuestCategory, WordItem } from '../types/game';
import { Volume2, BookOpen, X, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { SpeechService, SoundEffects } from '../services/audio';

interface WordBookModalProps {
  discoveredWordIds: string[];
  onClose: () => void;
}

const CATEGORIES: { id: QuestCategory | 'all'; labelPl: string; icon: string }[] = [
  { id: 'all', labelPl: 'Wszystkie', icon: '🌟' },
  { id: 'greetings', labelPl: 'Powitania i Emocje', icon: '👋' },
  { id: 'school_supplies', labelPl: 'Przybory Szkolne', icon: '✏️' },
  { id: 'colors_numbers', labelPl: 'Kolory i Liczby', icon: '🎨' },
  { id: 'animals_nature', labelPl: 'Zwierzęta i Przyroda', icon: '🦊' },
  { id: 'food_drinks', labelPl: 'Jedzenie i Napoje', icon: '🍎' },
  { id: 'clothes_weather', labelPl: 'Ubrania i Pogoda', icon: '🧥' },
  { id: 'city_transport', labelPl: 'Miasto i Podróże', icon: '🚂' },
  { id: 'sports_hobbies', labelPl: 'Sport i Hobby', icon: '⚽' },
  { id: 'daily_routine', labelPl: 'Dzień i Rutyna', icon: '⏰' }
];

export const WordBookModal: React.FC<WordBookModalProps> = ({
  discoveredWordIds,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<QuestCategory | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const discoveredSet = new Set(discoveredWordIds);

  const filteredWords = VOCABULARY_DATABASE.filter(w => {
    if (activeCategory === 'all') return true;
    return w.category === activeCategory;
  });

  const discoveredCount = VOCABULARY_DATABASE.filter(w => discoveredSet.has(w.id)).length;

  const handlePlayWord = (word: WordItem) => {
    setPlayingId(word.id);
    SoundEffects.playInteractSound();
    SpeechService.speakEnglish(`${word.english}. ${word.exampleEn}`, 0.85, () => {
      setPlayingId(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-400 text-slate-800 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Słowniczek Odkrywcy
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {discoveredCount} / {VOCABULARY_DATABASE.length} odkrytych
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Kliknij głośniczek, aby usłyszeć poprawną angielską wymowę i przykładowe zdanie
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 shrink-0 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.labelPl}</span>
            </button>
          ))}
        </div>

        {/* Words Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredWords.map(word => {
            const isDiscovered = discoveredSet.has(word.id);
            const isCurrentPlaying = playingId === word.id;

            return (
              <div
                key={word.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isDiscovered
                    ? 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xl">{word.emoji}</span>
                    {isDiscovered ? (
                      <button
                        onClick={() => handlePlayWord(word)}
                        className={`p-2 rounded-xl transition-transform hover:scale-110 ${
                          isCurrentPlaying ? 'bg-emerald-500 text-white animate-bounce' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title="Odsłuchaj wymowę"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <div className="text-lg font-bold text-slate-900">
                    {word.english}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mb-2">
                    {word.polish}
                  </div>

                  <div className="text-[11px] text-slate-600 font-medium bg-slate-50 p-2 rounded-xl border border-slate-100">
                    "{word.exampleEn}"
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>{word.category}</span>
                  {isDiscovered ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Odkryte
                    </span>
                  ) : (
                    <span>Do odkrycia w misji</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
          <span>Odkrywaj słowa rozmawiając z mieszkańcami i zbierając Kryształy Słów!</span>
          <span className="font-bold text-emerald-700">English Quest 3D</span>
        </div>

      </div>
    </div>
  );
};
