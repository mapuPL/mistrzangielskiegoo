import React from 'react';
import { X, Award, Check, Lock, Sparkles } from 'lucide-react';
import { BADGES_DATA } from '../data/curriculum';
import { PlayerProfile } from '../types/game';

interface BadgesModalProps {
  profile: PlayerProfile;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ profile, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-indigo-500 rounded-3xl shadow-2xl p-6 text-white space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl">
              <Award className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-indigo-400">Osiągnięcia & Odznaki Wordland</h2>
              <p className="text-xs text-slate-400">
                Zdobyto: {profile.badges.length} z {BADGES_DATA.length} odznak
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

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = profile.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isUnlocked ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm text-white">{badge.namePl}</h4>
                    {isUnlocked && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{badge.descriptionPl}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
