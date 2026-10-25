import React, { useState } from 'react';
import { X, Search, Volume2, BookA, Star, AlertCircle } from 'lucide-react';
import { WordItem, PlayerProfile, IslandId } from '../types/game';
import { ISLANDS_DATA } from '../data/curriculum';
import { TTSService } from '../services/tts';
import { SoundFx } from '../services/audio';

interface WordBookModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

export const WordBookModal: React.FC<WordBookModalProps> = ({ profile, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Gather all words
  const allWords: WordItem[] = [];
  ISLANDS_DATA.forEach(isl => allWords.push(...isl.words));

  const filteredWords = allWords.filter(w => {
    const matchesSearch = 
      w.english.toLowerCase().includes(searchTerm.toLowerCase()) || 
      w.polish.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const discoveredCount = allWords.filter(w => profile.discoveredWordIds.includes(w.id)).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-sky-500 rounded-3xl shadow-2xl p-5 md:p-6 text-white space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-500/20 text-sky-400 rounded-2xl">
              <BookA className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-sky-400">Słowniczek Odkrytych Słów</h2>
              <p className="text-xs text-slate-400">
                Odkryto: {discoveredCount} z {allWords.length} słów programu klas 3–4
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

        {/* Filter Bar: Search + Category Tabs */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Szukaj słówka po angielsku lub polsku..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">Wszystkie kategorie</option>
            {ISLANDS_DATA.map(i => (
              <option key={i.id} value={i.id}>{i.namePl}</option>
            ))}
          </select>
        </div>

        {/* Words Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredWords.map((word) => {
            const isDiscovered = profile.discoveredWordIds.includes(word.id);
            const isDifficult = profile.difficultWordIds.includes(word.id);

            return (
              <div
                key={word.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                  isDiscovered
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{word.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm md:text-base text-white capitalize">{word.english}</h4>
                      {isDifficult && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/40 font-bold">
                          Do powtórki
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300 font-medium">({word.polish})</p>
                    {word.phoneticTip && (
                      <p className="text-[10px] text-slate-400 font-mono">{word.phoneticTip}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    SoundFx.playClick();
                    TTSService.speak(word.english, profile.settings.ttsSlow);
                  }}
                  title="Posłuchaj wymowy"
                  className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-sky-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
