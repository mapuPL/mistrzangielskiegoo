import React, { useState } from 'react';
import { Map, BookOpen, Scroll, User, Settings, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { SoundEffects } from '../services/audio';

interface CinemaDockProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMap: () => void;
  onOpenWordBook: () => void;
  onOpenJournal: () => void;
  onOpenAvatar: () => void;
  onOpenSettings: () => void;
}

export const CinemaDock: React.FC<CinemaDockProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenMap,
  onOpenWordBook,
  onOpenJournal,
  onOpenAvatar,
  onOpenSettings
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (fn: () => void) => {
    SoundEffects.playInteractSound();
    fn();
  };

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94vw] max-w-[720px] font-fredoka pointer-events-auto transition-transform duration-300">
      
      {/* Collapse Toggle Handle */}
      <div className="flex justify-center -mb-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="px-3 py-1 rounded-t-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-t-2 border-x-2 border-slate-700/80 text-[11px] font-bold shadow-md flex items-center gap-1 transition-all"
        >
          {collapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Pokaż Menu</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Ukryj Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic/Solid Bar (no backdrop-filter over WebGL to avoid software GL stalls) */}
      {!collapsed && (
        <div className="bg-slate-900/95 border-2 border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-1 sm:gap-2">
          
          <button
            onClick={() => handleClick(onOpenMap)}
            className="flex-1 py-2 px-1 sm:px-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white transition-all flex flex-col items-center gap-1 group"
          >
            <Map className="w-4 h-4 text-amber-400 group-hover:text-white" />
            <span className="text-[10px] sm:text-xs font-bold">Mapa</span>
          </button>

          <button
            onClick={() => handleClick(onOpenWordBook)}
            className="flex-1 py-2 px-1 sm:px-2 rounded-xl bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white transition-all flex flex-col items-center gap-1 group"
          >
            <BookOpen className="w-4 h-4 text-emerald-400 group-hover:text-white" />
            <span className="text-[10px] sm:text-xs font-bold">Słowniczek</span>
          </button>

          <button
            onClick={() => handleClick(onOpenJournal)}
            className="flex-1 py-2 px-1 sm:px-2 rounded-xl bg-slate-800/80 hover:bg-amber-600 text-slate-200 hover:text-white transition-all flex flex-col items-center gap-1 group"
          >
            <Scroll className="w-4 h-4 text-amber-400 group-hover:text-white" />
            <span className="text-[10px] sm:text-xs font-bold">Dziennik</span>
          </button>

          <button
            onClick={() => handleClick(onOpenAvatar)}
            className="flex-1 py-2 px-1 sm:px-2 rounded-xl bg-slate-800/80 hover:bg-purple-600 text-slate-200 hover:text-white transition-all flex flex-col items-center gap-1 group"
          >
            <User className="w-4 h-4 text-purple-400 group-hover:text-white" />
            <span className="text-[10px] sm:text-xs font-bold">Awatar</span>
          </button>

          <button
            onClick={() => handleClick(onOpenSettings)}
            className="flex-1 py-2 px-1 sm:px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-all flex flex-col items-center gap-1 group"
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-white" />
            <span className="text-[10px] sm:text-xs font-bold">Opcje</span>
          </button>

          <button
            onClick={() => handleClick(onToggleSound)}
            className={`p-2 sm:px-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
              soundEnabled ? 'bg-blue-600/40 text-blue-300 hover:bg-blue-600 hover:text-white' : 'bg-red-900/40 text-red-300 hover:bg-red-600 hover:text-white'
            }`}
            title="Dźwięk"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[9px] sm:text-[10px] font-bold">{soundEnabled ? 'Dźwięk' : 'Wycisz'}</span>
          </button>

        </div>
      )}

    </div>
  );
};
