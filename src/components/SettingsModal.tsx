import React from 'react';
import { X, Volume2, Mic, Eye, Sparkles, RotateCcw, Sliders } from 'lucide-react';
import { SettingsState } from '../types/game';
import { SoundFx } from '../services/audio';

interface SettingsModalProps {
  settings: SettingsState;
  onUpdateSettings: (newSettings: Partial<SettingsState>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl p-6 text-white space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-slate-800 text-slate-300 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">Ustawienia & Dostępność</h2>
              <p className="text-xs text-slate-400">Dostosuj dźwięk, tempo lektora i kontrast ekranu</p>
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

        {/* Options Stack */}
        <div className="space-y-4">
          {/* Volume Slider */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-sm font-bold">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Głośność efektów dźwiękowych</span>
              </div>
              <span className="text-emerald-400">{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                SoundFx.setVolume(vol);
                onUpdateSettings({ sfxVolume: vol });
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Slow TTS Pronunciation */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Wolne tempo lektora angielskiego (TTS)</h4>
              <p className="text-xs text-slate-400">Ułatwia zrozumienie wymowy dla uczniów klas 3–4</p>
            </div>
            <button
              onClick={() => {
                SoundFx.playClick();
                onUpdateSettings({ ttsSlow: !settings.ttsSlow });
              }}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                settings.ttsSlow ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.ttsSlow ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Show Polish Subtitles */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Tłumaczenia i podpowiedzi po polsku</h4>
              <p className="text-xs text-slate-400">Wyświetlaj polskie napisy i wskazówki pod słowami</p>
            </div>
            <button
              onClick={() => {
                SoundFx.playClick();
                onUpdateSettings({ showPolishSubtitles: !settings.showPolishSubtitles });
              }}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                settings.showPolishSubtitles ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.showPolishSubtitles ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Tryb wysokiego kontrastu (High Contrast)</h4>
              <p className="text-xs text-slate-400">Mocniejsze ramki i wysoki kontrast dla czytelności</p>
            </div>
            <button
              onClick={() => {
                SoundFx.playClick();
                onUpdateSettings({ highContrast: !settings.highContrast });
              }}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                settings.highContrast ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.highContrast ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Speech Recognition Toggle */}
          <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Przycisk mikrofonu (Wymowa)</h4>
              <p className="text-xs text-slate-400">Rozpoznawanie głosu przez Web Speech Recognition</p>
            </div>
            <button
              onClick={() => {
                SoundFx.playClick();
                onUpdateSettings({ enableSpeechRec: !settings.enableSpeechRec });
              }}
              className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                settings.enableSpeechRec ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                  settings.enableSpeechRec ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset progress */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={() => {
              if (window.confirm('Czy na pewno chcesz zresetować zapisany stan gry?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Resetuj zapis gry</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Gotowe
          </button>
        </div>
      </div>
    </div>
  );
};
