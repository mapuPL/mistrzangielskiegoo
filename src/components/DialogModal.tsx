import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuestVariant, NPCData } from '../types/game';
import { Volume2, HelpCircle, CheckCircle2, RotateCcw, Award, ArrowRight, X } from 'lucide-react';
import { SpeechService, SoundEffects } from '../services/audio';

interface DialogModalProps {
  quest: QuestVariant;
  npc: NPCData;
  onSuccess: (rewardXP: number, rewardStars: number, rewardCoins: number, unlockedWords: string[]) => void;
  onClose: () => void;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  quest,
  npc,
  onSuccess,
  onClose
}) => {
  const [showPolishHint, setShowPolishHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ textPl: string; isCorrect: boolean } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // State for sentence builder
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(
    quest.sentenceWords ? [...quest.sentenceWords] : []
  );

  // Play audio on mount or when user clicks
  const playAudio = (text: string) => {
    setIsSpeaking(true);
    SpeechService.speakEnglish(text, 0.85, () => setIsSpeaking(false));
  };

  React.useEffect(() => {
    playAudio(quest.audioPhraseEn);
    return () => SpeechService.stop();
  }, [quest.id]);

  // Handle Dialogue option selection
  const handleSelectOption = (isCorrect: boolean, feedbackPl?: string) => {
    if (isCompleted) return;

    if (isCorrect) {
      triggerSuccess();
      setFeedback({
        textPl: feedbackPl || 'Wspaniale! Świetna odpowiedź!',
        isCorrect: true
      });
    } else {
      SoundEffects.playGentleOops();
      setFeedback({
        textPl: feedbackPl || quest.hintPl || 'Spróbuj jeszcze raz!',
        isCorrect: false
      });
    }
  };

  // Handle Shopping item selection
  const handleSelectShopItem = (isCorrect: boolean, namePl: string) => {
    if (isCompleted) return;

    if (isCorrect) {
      triggerSuccess();
      setFeedback({
        textPl: `Super! Wybrałeś: ${namePl}. Zgadzają się wszystkie szczegóły!`,
        isCorrect: true
      });
    } else {
      SoundEffects.playGentleOops();
      setFeedback({
        textPl: `${namePl} to nie ten produkt. ${quest.hintPl}`,
        isCorrect: false
      });
    }
  };

  // Sentence Builder logic
  const handleAddWord = (word: string, index: number) => {
    SoundEffects.playInteractSound();
    setSelectedWords([...selectedWords, word]);
    const updated = [...availableWords];
    updated.splice(index, 1);
    setAvailableWords(updated);
  };

  const handleRemoveWord = (word: string, index: number) => {
    SoundEffects.playInteractSound();
    const updatedSelected = [...selectedWords];
    updatedSelected.splice(index, 1);
    setSelectedWords(updatedSelected);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheckSentence = () => {
    const constructed = selectedWords.join(' ');
    if (constructed.trim().toLowerCase() === quest.correctSentence?.trim().toLowerCase()) {
      triggerSuccess();
      setFeedback({
        textPl: `Brawo! Poprawne zdanie: "${quest.correctSentence}"!`,
        isCorrect: true
      });
    } else {
      SoundEffects.playGentleOops();
      setFeedback({
        textPl: `Jeszcze nie do końca tak. Podpowiedź: ${quest.hintPl}`,
        isCorrect: false
      });
    }
  };

  const triggerSuccess = () => {
    setIsCompleted(true);
    SoundEffects.playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleFinishQuest = () => {
    onSuccess(
      quest.reward.xp,
      quest.reward.stars,
      quest.reward.coins,
      quest.reward.wordsToUnlock
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-400 text-slate-800 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          title="Zamknij"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NPC Profile Header */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white"
            style={{ backgroundColor: npc.color }}
          >
            {npc.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">{npc.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: npc.color }}>
                {npc.rolePl}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{quest.storyContextPl}</p>
          </div>
        </div>

        {/* Spoken English Dialogue Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 mb-5 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Rozmowa po angielsku:
                </span>
                {isSpeaking && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                    Odtwarzanie dźwięku...
                  </span>
                )}
              </div>
              <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                "{quest.audioPhraseEn}"
              </p>
              
              {showPolishHint && (
                <p className="text-sm text-slate-600 font-medium mt-2 pt-2 border-t border-sky-200 italic">
                  PL: {quest.instructionPl}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => playAudio(quest.audioPhraseEn)}
                className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-transform hover:scale-105 flex items-center justify-center"
                title="Posłuchaj wymowy (TTS)"
              >
                <Volume2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setShowPolishHint(!showPolishHint)}
                className={`p-3 rounded-2xl border transition-colors flex items-center justify-center ${
                  showPolishHint ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Włącz/Wyłącz tłumaczenie"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mission Type Interactive Area */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Twoje zadanie: {quest.instructionPl}
          </div>

          {/* 1. Multiple Choice / Riddle Options */}
          {(quest.questType === 'dialogue' || quest.questType === 'riddle') && quest.options && (
            <div className="space-y-2.5">
              {quest.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={isCompleted}
                  onClick={() => handleSelectOption(opt.isCorrect, opt.feedbackPl)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 shadow-sm transition-all flex items-center justify-between group disabled:opacity-80"
                >
                  <div>
                    <div className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-700">
                      {opt.textEn}
                    </div>
                    {showPolishHint && (
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {opt.textPl}
                      </div>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-xl border border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-600 font-bold text-xs">
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 2. Shopping Items Grid */}
          {quest.questType === 'shopping' && quest.shopItems && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quest.shopItems.map((item, i) => (
                <button
                  key={i}
                  disabled={isCompleted}
                  onClick={() => handleSelectShopItem(item.isCorrect, item.namePl)}
                  className="p-3.5 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50 shadow-sm transition-all text-center group disabled:opacity-80"
                >
                  <div className="text-4xl mb-1">{item.icon}</div>
                  <div className="font-bold text-slate-800 text-sm group-hover:text-emerald-700">
                    {item.nameEn}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {item.namePl}
                  </div>
                  <div className="mt-2 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg py-1">
                    🪙 {item.price} coins
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 3. Sentence Builder */}
          {quest.questType === 'sentence_builder' && (
            <div className="space-y-4">
              {/* Target Drop Zone */}
              <div className="min-h-[64px] p-3 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-wrap items-center gap-2">
                {selectedWords.length === 0 ? (
                  <span className="text-sm text-slate-400 font-medium px-2">
                    Klikaj kafelki poniżej, aby ułożyć zdanie...
                  </span>
                ) : (
                  selectedWords.map((word, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isCompleted}
                      onClick={() => handleRemoveWord(word, idx)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-transform hover:scale-105"
                    >
                      {word} ✕
                    </button>
                  ))
                )}
              </div>

              {/* Source Word Tiles */}
              <div className="flex flex-wrap gap-2">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isCompleted}
                    onClick={() => handleAddWord(word, idx)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-800 font-bold text-sm shadow-sm transition-transform hover:-translate-y-0.5"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {!isCompleted && selectedWords.length > 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCheckSentence}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sprawdź ułożone zdanie</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvailableWords(quest.sentenceWords ? [...quest.sentenceWords] : []);
                      setSelectedWords([]);
                    }}
                    className="p-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700"
                    title="Zresetuj kafelki"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`p-4 rounded-2xl mb-4 text-sm font-bold flex items-center gap-3 ${
            feedback.isCorrect ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
          }`}>
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>{feedback.textPl}</span>
          </div>
        )}

        {/* Completion & Rewards CTA */}
        {isCompleted ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-around p-3.5 rounded-2xl bg-yellow-50 border border-yellow-200">
              <div className="text-center">
                <div className="text-xs text-slate-500 font-medium">Doświadczenie</div>
                <div className="text-lg font-bold text-blue-700">+{quest.reward.xp} XP</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 font-medium">Gwiazdki</div>
                <div className="text-lg font-bold text-amber-600">+{quest.reward.stars} ⭐</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-500 font-medium">Monety</div>
                <div className="text-lg font-bold text-yellow-600">+{quest.reward.coins} 🪙</div>
              </div>
            </div>

            <button
              onClick={handleFinishQuest}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-6 h-6" />
              <span>Odbierz nagrodę i kontynuuj!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
            <span>Nagroda: +{quest.reward.xp} XP, +{quest.reward.coins} monet</span>
            <span>Wordland Quest 3D</span>
          </div>
        )}

      </div>
    </div>
  );
};
