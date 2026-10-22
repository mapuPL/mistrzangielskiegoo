import React, { useState } from 'react';
import { PlayerProfile, GradeLevel } from '../types/game';
import { Compass, Sparkles, BookOpen, Star, Coins, UserCheck, Play } from 'lucide-react';
import { SoundEffects } from '../services/audio';

interface StartScreenProps {
  savedProfile: PlayerProfile | null;
  onContinue: () => void;
  onNewGame: () => void;
  onSelectGrade: (grade: GradeLevel) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  savedProfile,
  onContinue,
  onNewGame,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(savedProfile?.gradeLevel || 'grade3');

  const handleStartContinue = () => {
    SoundEffects.playInteractSound();
    onContinue();
  };

  const handleStartNew = () => {
    SoundEffects.playInteractSound();
    onNewGame();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-sky-400 via-emerald-400 to-teal-700 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-300 text-slate-800">
        
        {/* Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm mb-2 shadow-sm border border-yellow-300">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kraina Wordland czeka na Ciebie!</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-700 drop-shadow-sm tracking-wide">
            ENGLISH QUEST
          </h1>
          <p className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">
            ✨ The Lost Words — Tajemnica Burzy Słów ✨
          </p>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Interaktywna gra przygodowa 3D do nauki angielskiego dla dzieci w wieku 8–11 lat
          </p>
        </div>

        {/* Saved Profile Card if available */}
        {savedProfile && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white"
                  style={{ backgroundColor: savedProfile.avatar.outfitColor }}
                >
                  🧭
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-800">{savedProfile.playerName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold">
                      {savedProfile.gradeLevel === 'grade4' ? 'Klasa IV' : 'Klasa III'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Poziom {savedProfile.level} • {savedProfile.discoveredWordIds.length} odkrytych słówek
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-100 px-3 py-1 rounded-xl text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{savedProfile.stars}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-700 font-bold bg-yellow-100 px-3 py-1 rounded-xl text-sm">
                  <Coins className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span>{savedProfile.coins}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartContinue}
              className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-white" />
              <span>Wznów przygodę w Wordland!</span>
            </button>
          </div>
        )}

        {/* Grade Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Wybierz poziom edukacyjny:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedGrade('grade3')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                selectedGrade === 'grade3'
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-700 text-base">Klasa III (8–9 lat)</span>
                {selectedGrade === 'grade3' && <UserCheck className="w-5 h-5 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Podstawowe słówka, kolory, liczby, zwierzęta, słuchanie poleceń i wesołe dialogi.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGrade('grade4')}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                selectedGrade === 'grade4'
                  ? 'border-purple-500 bg-purple-50 shadow-md ring-2 ring-purple-300'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-700 text-base">Klasa IV (10–11 lat)</span>
                {selectedGrade === 'grade4' && <UserCheck className="w-5 h-5 text-purple-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Układanie zdań, zakupy w sklepiku, plan dnia, hobby, kierunki i zagadki.
              </p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStartNew}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${
              savedProfile
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>{savedProfile ? 'Stwórz nową postać / Zresetuj' : 'Rozpocznij nową przygodę!'}</span>
          </button>
        </div>

        {/* Safe for Kids Notice */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span>Bezpieczna gra edukacyjna • Bez reklam i mikropłatności • Zapis lokalny na urządzeniu</span>
        </div>

      </div>
    </div>
  );
};
