import React from 'react';
import { PlayerProfile, QuestVariant } from '../types/game';
import { QUESTS_DATABASE } from '../data/curriculum';
import { getTodayChallenge } from '../services/storage';
import { Scroll, CheckCircle2, Award, Star, X, Calendar, Compass } from 'lucide-react';

interface QuestJournalModalProps {
  profile: PlayerProfile;
  activeQuest: QuestVariant;
  onClose: () => void;
}

export const QuestJournalModal: React.FC<QuestJournalModalProps> = ({
  profile,
  activeQuest,
  onClose
}) => {
  const todayChallenge = getTodayChallenge();
  const completedSet = new Set(profile.completedQuestIds);

  const completedQuests = QUESTS_DATABASE.filter(q => completedSet.has(q.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-slate-800 my-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
              <Scroll className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dziennik Przygód
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Twoje aktualne misje, codzienne wyzwania i zdobyte odznaki odkrywcy
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

        {/* Content Tabs / Scrollable Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          
          {/* Active Quest Card */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Aktywna Misja</span>
            </h3>

            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{activeQuest.titlePl}</h4>
                  <p className="text-xs text-slate-600 font-medium">{activeQuest.storyContextPl}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-200 text-amber-900 text-xs font-bold whitespace-nowrap">
                  +{activeQuest.reward.xp} XP
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-amber-200 mt-3">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                  Angielskie polecenie:
                </div>
                <div className="text-base font-bold text-slate-900">
                  "{activeQuest.audioPhraseEn}"
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  PL: {activeQuest.instructionPl}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-3">
                <span>Miejsce docelowe: {activeQuest.targetLocation.namePl}</span>
                <span className="font-bold text-amber-700">Nagroda: {activeQuest.reward.coins} monet, {activeQuest.reward.stars} ⭐</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Wyzwanie Dnia</span>
            </h3>

            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-blue-900">{todayChallenge.titlePl}</div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">{todayChallenge.descriptionPl}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs">
                  +{todayChallenge.rewardXP} XP
                </span>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Twoje Odznaki Odkrywcy</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 text-center">
                <div className="text-3xl mb-1">🧭</div>
                <div className="text-xs font-bold text-emerald-900">Pierwszy Krok</div>
                <div className="text-[10px] text-emerald-700">Witaj w Wordland!</div>
              </div>

              <div className={`p-3 rounded-2xl border-2 text-center ${
                profile.discoveredWordIds.length >= 5
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-slate-200 bg-slate-50 opacity-50'
              }`}>
                <div className="text-3xl mb-1">📖</div>
                <div className="text-xs font-bold text-slate-900">Kolekcjoner Słów</div>
                <div className="text-[10px] text-slate-500">Odkryj 5 słówek</div>
              </div>

              <div className={`p-3 rounded-2xl border-2 text-center ${
                completedQuests.length >= 3
                  ? 'border-amber-300 bg-amber-50'
                  : 'border-slate-200 bg-slate-50 opacity-50'
              }`}>
                <div className="text-3xl mb-1">⭐</div>
                <div className="text-xs font-bold text-slate-900">Pomocna Dłoń</div>
                <div className="text-[10px] text-slate-500">Ukończ 3 misje</div>
              </div>

              <div className={`p-3 rounded-2xl border-2 text-center ${
                profile.coins >= 50
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-slate-200 bg-slate-50 opacity-50'
              }`}>
                <div className="text-3xl mb-1">🪙</div>
                <div className="text-xs font-bold text-slate-900">Kupiec Wordland</div>
                <div className="text-[10px] text-slate-500">Zdobądź 50 monet</div>
              </div>
            </div>
          </div>

          {/* Completed Quests List */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ukończone Misje ({completedQuests.length})</span>
            </h3>

            {completedQuests.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-400 font-medium">
                Jeszcze nie ukończyłeś żadnej misji. Porozmawiaj z Alexem lub robotem BEEP!
              </div>
            ) : (
              <div className="space-y-2">
                {completedQuests.map(q => (
                  <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">{q.titlePl}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      +{q.reward.xp} XP • {q.reward.stars} ⭐
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
