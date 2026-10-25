/**
 * Web Speech API wrapper for Text-To-Speech (pronunciation)
 * and optional Speech Recognition with safe fallback
 */

export class TTSService {
  private static englishVoice: SpeechSynthesisVoice | null = null;
  private static voicesLoaded = false;

  private static initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const update = () => {
      const voices = window.speechSynthesis.getVoices();
      TTSService.englishVoice = 
        voices.find(v => v.lang.startsWith('en-') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
        voices.find(v => v.lang.startsWith('en')) ||
        null;
      TTSService.voicesLoaded = true;
    };

    update();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = update;
    }
  }

  public static speak(text: string, isSlow: boolean = false) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    if (!TTSService.voicesLoaded) {
      TTSService.initVoices();
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = isSlow ? 0.72 : 0.95;
    utterance.pitch = 1.05;

    if (TTSService.englishVoice) {
      utterance.voice = TTSService.englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export type SpeechRecCallback = (recognizedText: string, isFinal: boolean) => void;
export type SpeechRecErrorCallback = (errorMessage: string) => void;

interface IWindowSpeechRec {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechRecService {
  private static recognitionInstance: any = null;
  private static isListening: boolean = false;

  public static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindowSpeechRec;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public static startListening(
    onResult: SpeechRecCallback,
    onError: SpeechRecErrorCallback,
    onEnd?: () => void
  ): boolean {
    if (!SpeechRecService.isSupported()) {
      onError('Twoja przeglądarka nie obsługuje rozpoznawania mowy. Użyj przycisku klawiatury!');
      return false;
    }

    try {
      const win = window as unknown as IWindowSpeechRec;
      const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      const rec = new SpeechClass();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 3;

      rec.onstart = () => {
        SpeechRecService.isListening = true;
      };

      rec.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript.trim().toLowerCase();
        const isFinal = event.results[resultIndex].isFinal;
        onResult(transcript, isFinal);
      };

      rec.onerror = (event: any) => {
        SpeechRecService.isListening = false;
        let errDesc = 'Nie udało się rozpoznać mowy.';
        if (event.error === 'not-allowed') {
          errDesc = 'Dostęp do mikrofonu został zablokowany. Zezwól w przeglądarce.';
        } else if (event.error === 'no-speech') {
          errDesc = 'Nie usłyszeliśmy głosu. Spróbuj jeszcze raz!';
        }
        onError(errDesc);
      };

      rec.onend = () => {
        SpeechRecService.isListening = false;
        if (onEnd) onEnd();
      };

      rec.start();
      SpeechRecService.recognitionInstance = rec;
      return true;
    } catch (e: any) {
      onError('Błąd uruchomienia mikrofonu: ' + (e.message || ''));
      return false;
    }
  }

  public static stopListening() {
    if (SpeechRecService.recognitionInstance && SpeechRecService.isListening) {
      try {
        SpeechRecService.recognitionInstance.stop();
      } catch {
        // ignore
      }
      SpeechRecService.isListening = false;
    }
  }
}
