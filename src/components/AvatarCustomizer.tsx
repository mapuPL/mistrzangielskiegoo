import React, { useState } from 'react';
import { AvatarConfig, GradeLevel } from '../types/game';
import { DEFAULT_AVATAR } from '../services/storage';
import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { SoundEffects } from '../services/audio';

interface AvatarCustomizerProps {
  initialName?: string;
  initialGrade?: GradeLevel;
  initialAvatar?: AvatarConfig;
  onSave: (name: string, grade: GradeLevel, avatar: AvatarConfig) => void;
  onCancel?: () => void;
}

const SKIN_COLORS = ['#fcd34d', '#fbcfe8', '#fed7aa', '#fde047', '#d97706', '#92400e'];
const HAIR_COLORS = ['#b45309', '#eab308', '#1e293b', '#ef4444', '#7c3aed', '#059669'];
const OUTFIT_COLORS = ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#f97316', '#06b6d4'];
const PANTS_COLORS = ['#1e3a8a', '#1e293b', '#065f46', '#7f1d1d', '#4c1d95'];
const BACKPACK_COLORS = ['#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  initialName = 'Młody Odkrywca',
  initialGrade = 'grade3',
  initialAvatar = DEFAULT_AVATAR,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(initialName);
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);
  const [avatar, setAvatar] = useState<AvatarConfig>({ ...initialAvatar });

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    SoundEffects.playSuccessChime();
    onSave(name.trim() || 'Odkrywca', grade, avatar);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-400 text-slate-800 my-auto">
        
        {/* Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kreator Postaci Odkrywcy</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800">
            Stwórz swojego bohatera Wordland
          </h2>
        </div>

        <form onSubmit={handleFinish} className="space-y-6">
          
          {/* Avatar Preview Card */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-2 border-emerald-200">
            {/* Visual avatar badge */}
            <div className="relative w-28 h-28 rounded-3xl flex flex-col items-center justify-center shadow-lg border-4 border-white" style={{ backgroundColor: avatar.outfitColor }}>
              <div className="text-4xl">
                {avatar.accessory === 'explorer_hat' ? '🤠' : avatar.accessory === 'headphones' ? '🎧' : '🧭'}
              </div>
              <div className="mt-1 px-2 py-0.5 rounded-full bg-black/30 text-white text-[10px] font-bold">
                {avatar.hairStyle}
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Imię lub pseudonim odkrywcy:
                </label>
                <input
                  type="text"
                  maxLength={18}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="np. Tomek, Zuzia, Explorer"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Poziom szkolny:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setGrade('grade3')}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      grade === 'grade3'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Klasa III (8–9 lat)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGrade('grade4')}
                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      grade === 'grade4'
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    Klasa IV (10–11 lat)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palettes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Outfit Color */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Kolor bluzy / stroju:
              </label>
              <div className="flex gap-2 flex-wrap">
                {OUTFIT_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, outfitColor: c })}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {avatar.outfitColor === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pants Color */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Kolor spodni:
              </label>
              <div className="flex gap-2 flex-wrap">
                {PANTS_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, pantsColor: c })}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {avatar.pantsColor === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Kolor włosów:
              </label>
              <div className="flex gap-2 flex-wrap">
                {HAIR_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, hairColor: c })}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {avatar.hairColor === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Backpack Color */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Kolor plecaka podróżnika:
              </label>
              <div className="flex gap-2 flex-wrap">
                {BACKPACK_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, backpackColor: c })}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {avatar.backpackColor === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Accessory choice */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Akcesoria i nakrycie głowy:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAvatar({ ...avatar, accessory: 'explorer_hat' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  avatar.accessory === 'explorer_hat'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-300'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>🤠 Kapelusz</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatar({ ...avatar, accessory: 'headphones' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  avatar.accessory === 'headphones'
                    ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-300'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>🎧 Słuchawki</span>
              </button>
              <button
                type="button"
                onClick={() => setAvatar({ ...avatar, accessory: 'none' })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  avatar.accessory === 'none'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>🎒 Sam plecak</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm"
              >
                Anuluj
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Wkraczam do Wordland!</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
