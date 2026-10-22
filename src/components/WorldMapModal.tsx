import React from 'react';
import { NPCS_DATA } from '../data/curriculum';
import { MapPin, X, Compass, Sparkles } from 'lucide-react';
import { SoundEffects } from '../services/audio';

interface WorldMapModalProps {
  playerPos: { x: number; z: number };
  unlockedAreas: string[];
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  playerPos,
  unlockedAreas,
  onClose
}) => {
  // Convert world coordinates (-50..50) into SVG map percentages (10%..90%)
  const worldToMap = (x: number, z: number) => {
    const left = ((x + 35) / 70) * 100;
    const top = ((z + 35) / 70) * 100;
    return {
      left: `${Math.max(8, Math.min(92, left))}%`,
      top: `${Math.max(8, Math.min(92, top))}%`
    };
  };

  const pMap = worldToMap(playerPos.x, playerPos.z);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-fredoka overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-amber-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-slate-800 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-950">
                Mapa Krainy Wordland
              </h2>
              <p className="text-xs text-amber-800 font-medium">
                Poznawaj krainy, odnajduj mieszkańców i rozwiązuj tajemnice Burzy Słów
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parchment Styled Map Canvas */}
        <div className="relative w-full aspect-[4/3] max-h-[460px] bg-gradient-to-br from-emerald-100 via-amber-100 to-sky-100 rounded-2xl border-4 border-amber-300 shadow-inner overflow-hidden">
          
          {/* Stylized Regions */}
          {/* River */}
          <div className="absolute top-[68%] left-0 right-0 h-10 bg-sky-300/80 border-y-2 border-sky-400 -rotate-1 flex items-center justify-center text-[10px] font-bold text-sky-800 tracking-widest">
            RZEKA SŁÓW (WORD RIVER)
          </div>

          {/* Wooden Bridge */}
          <div className="absolute top-[65%] left-[45%] w-10 h-16 bg-amber-700 rounded border-2 border-amber-900 z-10 flex items-center justify-center text-[9px] font-bold text-white -rotate-1 shadow">
            MOST
          </div>

          {/* Region 1: Wordland Town */}
          <div className="absolute top-[28%] left-[30%] p-3 rounded-2xl bg-white/70 border-2 border-amber-400 text-center shadow-sm">
            <span className="text-xl">🏛️</span>
            <div className="text-xs font-bold text-slate-800">Wordland Town</div>
            <div className="text-[10px] text-slate-500 font-medium">Rynek i Fontanna</div>
          </div>

          {/* Region 2: Grand Library */}
          <div className="absolute top-[20%] left-[10%] p-2.5 rounded-2xl bg-purple-100/80 border-2 border-purple-400 text-center shadow-sm">
            <span className="text-xl">📚</span>
            <div className="text-[11px] font-bold text-purple-900">Biblioteka</div>
            <div className="text-[9px] text-purple-700">Prof. Owl</div>
          </div>

          {/* Region 3: Sunny Bakery */}
          <div className="absolute top-[16%] right-[16%] p-2.5 rounded-2xl bg-rose-100/80 border-2 border-rose-400 text-center shadow-sm">
            <span className="text-xl">🥐</span>
            <div className="text-[11px] font-bold text-rose-900">Piekarnia</div>
            <div className="text-[9px] text-rose-700">Chef Pierre</div>
          </div>

          {/* Region 4: Market Island */}
          <div className="absolute top-[48%] right-[10%] p-2.5 rounded-2xl bg-orange-100/80 border-2 border-orange-400 text-center shadow-sm">
            <span className="text-xl">🏪</span>
            <div className="text-[11px] font-bold text-orange-900">Ryneczek</div>
            <div className="text-[9px] text-orange-700">Foxy Market</div>
          </div>

          {/* Region 5: Adventure Station */}
          <div className="absolute bottom-[8%] left-[38%] p-2.5 rounded-2xl bg-teal-100/80 border-2 border-teal-400 text-center shadow-sm">
            <span className="text-xl">🚂</span>
            <div className="text-[11px] font-bold text-teal-900">Stacja Kolejowa</div>
            <div className="text-[9px] text-teal-700">Zawiadowca Leo</div>
          </div>

          {/* Region 6: Mystery Zone Portal */}
          <div className="absolute top-[5%] left-[45%] p-2 rounded-2xl bg-indigo-200/80 border-2 border-indigo-500 text-center shadow-sm">
            <span className="text-lg">🔮</span>
            <div className="text-[10px] font-bold text-indigo-950">Mystery Portal</div>
          </div>

          {/* NPC Markers */}
          {NPCS_DATA.map(npc => {
            const pos = worldToMap(npc.position.x, npc.position.z);
            return (
              <div
                key={npc.id}
                style={{ left: pos.left, top: pos.top }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                title={`${npc.name} (${npc.rolePl})`}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm transition-transform group-hover:scale-125"
                  style={{ backgroundColor: npc.color }}
                >
                  {npc.icon}
                </div>
                <div className="hidden group-hover:block absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap shadow-md z-30">
                  {npc.name}
                </div>
              </div>
            );
          })}

          {/* Current Player Cursor Marker */}
          <div 
            style={{ left: pMap.left, top: pMap.top }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/30 border-2 border-blue-600 animate-ping absolute" />
              <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                Ty
              </div>
            </div>
          </div>

        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 font-bold bg-amber-100/80 p-3 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600 border border-white" />
            <span>Twoja pozycja</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🧭</span>
            <span>Mieszkańcy i Zadania</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">💎</span>
            <span>Kryształy Słów do zebrania</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🔮</span>
            <span>Tajemnicza Strefa</span>
          </div>
        </div>

      </div>
    </div>
  );
};
