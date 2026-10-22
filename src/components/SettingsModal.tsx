import React, { useState } from 'react';
import { PlayerProfile, GradeLevel } from '../types/game';
import { Settings, Volume2, VolumeX, RotateCcw, X, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { SoundEffects } from '../services/audio';

interface SettingsModalProps {
  profile: PlayerProfile;
  onUpdateSettings: (settings: PlayerProfile['settings'], grade: GradeLevel) => void;
  onResetProfile: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onUpdateSettings,
  onResetProfile,
  onClose
}) => {
  const [grade, setGrade] = useState<GradeLevel>(profile.gradeLevel);
  const [settings, setSettings] = useState({ ...profile.settings });
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSave = () => {
    SoundEffects.playInteractSound();
    onUpdateSettings(settings, grade);
    onClose();
  };

  const handleConfirmReset = () => {
    SoundEffects.playGentleOops();
    onResetProfile();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-300 text-slate-800 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-2xl shadow-md">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Ustawienia Gry i Nauki
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Dostosuj poziom trudności, dźwięk i sterowanie dla ucznia
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

        {/* Settings Form */}
        <div className="space-y-5">
          
          {/* Grade Level Selector */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              Poziom nauczania (Wymagania szkolne):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGrade('grade3')}
                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  grade === 'grade3'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Klasa III (8–9 lat)
              </button>
              <button
                type="button"
                onClick={() => setGrade('grade4')}
                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  grade === 'grade4'
                    ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Klasa IV (10–11 lat)
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2">
              Klasa III: pojedyncze słówka i proste reakcje. Klasa IV: budowanie zdań i bogatsze dialogi.
            </p>
          </div>

          {/* Speech Rate (Audio) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Szybkość wymowy lektora (TTS):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, speechRate: 0.8 })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                  settings.speechRate <= 0.85
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                🐢 Wolno (dla początkujących)
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, speechRate: 1.0 })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                  settings.speechRate > 0.85
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                🐇 Normalne tempo
              </button>
            </div>
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <span className="text-xs font-bold text-slate-800">Efekty dźwiękowe (chimes & jumps)</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded text-blue-600 cursor-pointer"
            />
          </div>

          {/* Polish Hints Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">Podpowiedzi po polsku w zadaniach</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showPolishHints}
              onChange={(e) => setSettings({ ...settings, showPolishHints: e.target.checked })}
              className="w-5 h-5 rounded text-amber-600 cursor-pointer"
            />
          </div>

          {/* Mobile Touch Controls Force Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-base">📱</span>
              <span className="text-xs font-bold text-slate-800">Wirtualny joystick i przyciski dotykowe</span>
            </div>
            <input
              type="checkbox"
              checked={settings.touchControls}
              onChange={(e) => setSettings({ ...settings, touchControls: e.target.checked })}
              className="w-5 h-5 rounded text-emerald-600 cursor-pointer"
            />
          </div>

          {/* Reset Game Section */}
          <div className="pt-2">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Zresetuj postępy i stwórz nowy profil</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-300 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Czy na pewno chcesz wyczyścić wszystkie postępy?</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow"
                  >
                    Tak, zresetuj profil
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
          >
            Zapisz zmiany
          </button>
        </div>

      </div>
    </div>
  );
};
