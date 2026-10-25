import React, { useState, useEffect } from 'react';
import { Volume2, Mic, MicOff, Check, X, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { WordItem, NPCData, PlayerProfile } from '../types/game';
import { TTSService, SpeechRecService } from '../services/tts';
import { SoundFx } from '../services/audio';

interface NPCDialogModalProps {
  npc: NPCData;
  word: WordItem;
  profile: PlayerProfile;
  onSuccess: () => void;
  onFail: () => void;
  onClose: () => void;
}

export const NPCDialogModal: React.FC<NPCDialogModalProps> = ({
  npc,
  word,
  profile,
  onSuccess,
  onFail,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [micStatusMsg, setMicStatusMsg] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  // Generate plausible multiple-choice options (Target word + 2-3 distractors)
  useEffect(() => {
    const list = [word.english, ...word.distractors];
    // Shuffle options
    setOptions(list.sort(() => 0.5 - Math.random()));
    // Speak intro / target
    TTSService.speak(word.english, profile.settings.ttsSlow);
  }, [word, profile.settings.ttsSlow]);

  // Keyboard navigation: Esc closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelectOption = (opt: string) => {
    if (feedbackState === 'correct') return;
    setSelectedOption(opt);

    if (opt.toLowerCase() === word.english.toLowerCase()) {
      setFeedbackState('correct');
      SoundFx.playSuccess();
      setTimeout(() => {
        onSuccess();
      }, 1400);
    } else {
      setFeedbackState('wrong');
      SoundFx.playFail();
      onFail();
    }
  };

  const handlePlayTTS = () => {
    TTSService.speak(word.english, profile.settings.ttsSlow);
  };

  const handleToggleMic = () => {
    if (isListening) {
      SpeechRecService.stopListening();
      setIsListening(false);
      setMicStatusMsg(null);
      return;
    }

    if (!SpeechRecService.isSupported()) {
      setMicStatusMsg('Mikrofon nie jest obsługiwany w tej przeglądarce. Wybierz odpowiedź z listy poniżej!');
      return;
    }

    setIsListening(true);
    setMicStatusMsg('Słucham... Wymów słowo po angielsku do mikrofonu!');

    SpeechRecService.startListening(
      (transcript, isFinal) => {
        setMicStatusMsg(`Usłyszano: "${transcript}"`);
        if (transcript.toLowerCase().includes(word.english.toLowerCase())) {
          setIsListening(false);
          setFeedbackState('correct');
          SoundFx.playSuccess();
          setTimeout(() => {
            onSuccess();
          }, 1400);
        } else if (isFinal) {
          setIsListening(false);
          setFeedbackState('wrong');
          SoundFx.playFail();
          onFail();
        }
      },
      (errorMsg) => {
        setIsListening(false);
        setMicStatusMsg(errorMsg);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500 rounded-3xl shadow-2xl p-5 md:p-7 text-white space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header: NPC Persona */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md"
              style={{ backgroundColor: npc.color }}
            >
              🧭
            </div>
            <div>
              <h2 id="dialog-title" className="text-lg md:text-xl font-extrabold text-emerald-400">{npc.name}</h2>
              <p className="text-xs text-slate-400">{npc.rolePl}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij okno dialogowe (Esc)"
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NPC Riddle & Task Box */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Zagadka językowa</span>
            <div className="flex items-center gap-2">
              {/* Audio Pronunciation Button */}
              <button
                onClick={handlePlayTTS}
                title="Posłuchaj wymowy (TTS)"
                aria-label="Odsłuchaj słowo"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-transform active:scale-95 cursor-pointer min-h-[36px]"
              >
                <Volume2 className="w-4 h-4" />
                <span>Odsłuchaj</span>
              </button>

              {/* Speech Recognition Challenge */}
              {profile.settings.enableSpeechRec && (
                <button
                  onClick={handleToggleMic}
                  title="Wypowiedz słowo do mikrofonu"
                  aria-label="Wypowiedz słowo"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[36px] ${
                    isListening ? 'bg-rose-600 animate-pulse text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isListening ? 'Mów...' : 'Wymów'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Presentation */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{word.emoji}</span>
            <div>
              <p className="font-bold text-slate-200 text-sm md:text-base">
                Jak powiesz po angielsku: <span className="text-amber-300 font-extrabold underline">{word.polish}</span>?
              </p>
              {profile.settings.showPolishSubtitles && (
                <p className="text-xs text-slate-400 mt-0.5">Podpowiedź: {word.hintPl}</p>
              )}
            </div>
          </div>

          {/* Mic Status feedback */}
          {micStatusMsg && (
            <p className="text-xs text-sky-400 bg-sky-950/60 p-2 rounded-xl border border-sky-800">
              {micStatusMsg}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-2">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Wybierz poprawne słowo:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white';
              if (isSelected && feedbackState === 'correct') {
                btnStyle = 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
              } else if (isSelected && feedbackState === 'wrong') {
                btnStyle = 'bg-rose-600 border-rose-400 text-white';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={feedbackState === 'correct'}
                  className={`min-h-[48px] p-3 rounded-2xl border-2 font-extrabold text-sm md:text-base flex items-center justify-between transition-all active:scale-95 cursor-pointer ${btnStyle}`}
                >
                  <span className="capitalize">{opt}</span>
                  {isSelected && feedbackState === 'correct' && <Check className="w-5 h-5 text-white" />}
                  {isSelected && feedbackState === 'wrong' && <X className="w-5 h-5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Bottom Banner */}
        {feedbackState === 'correct' && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl flex items-center gap-2 text-emerald-300 text-sm font-bold animate-in fade-in">
            <Check className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>Brawo! Doskonale! Zdobywasz monety i punkty!</span>
          </div>
        )}

        {feedbackState === 'wrong' && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-2xl space-y-1 text-rose-300 text-xs md:text-sm animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <RotateCcw className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>Ups! Nie martw się, to słowo zapisaliśmy do powtórki.</span>
            </div>
            <p className="text-slate-300 pl-6">
              Wskazówka: {word.hintPl} (Poprawne słowo to <span className="font-bold text-amber-300">{word.english}</span>).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
