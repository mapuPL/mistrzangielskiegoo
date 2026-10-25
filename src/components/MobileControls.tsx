import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowBigUp } from 'lucide-react';

interface MobileControlsProps {
  onMoveChange: (x: number, z: number) => void;
  onJump: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onMoveChange, onJump }) => {
  const [activeDirections, setActiveDirections] = React.useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  const updateMove = (dirs: typeof activeDirections) => {
    let x = 0;
    let z = 0;
    if (dirs.up) z += 1;
    if (dirs.down) z -= 1;
    if (dirs.left) x -= 1;
    if (dirs.right) x += 1;
    onMoveChange(x, z);
  };

  const handleTouchStart = (dir: keyof typeof activeDirections) => {
    const updated = { ...activeDirections, [dir]: true };
    setActiveDirections(updated);
    updateMove(updated);
  };

  const handleTouchEnd = (dir: keyof typeof activeDirections) => {
    const updated = { ...activeDirections, [dir]: false };
    setActiveDirections(updated);
    updateMove(updated);
  };

  return (
    <div className="absolute inset-x-0 bottom-4 z-30 pointer-events-none px-4 flex items-end justify-between select-none">
      {/* Directional D-Pad (Touch targets min 48px) */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5 p-2 bg-slate-900/80 backdrop-blur-md rounded-3xl border-2 border-slate-700 shadow-2xl">
        <div />
        <button
          onTouchStart={() => handleTouchStart('up')}
          onTouchEnd={() => handleTouchEnd('up')}
          onMouseDown={() => handleTouchStart('up')}
          onMouseUp={() => handleTouchEnd('up')}
          aria-label="Ruch do przodu"
          className="w-13 h-13 rounded-2xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer border border-slate-600 transition-colors"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          onTouchStart={() => handleTouchStart('left')}
          onTouchEnd={() => handleTouchEnd('left')}
          onMouseDown={() => handleTouchStart('left')}
          onMouseUp={() => handleTouchEnd('left')}
          aria-label="Ruch w lewo"
          className="w-13 h-13 rounded-2xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer border border-slate-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onTouchStart={() => handleTouchStart('down')}
          onTouchEnd={() => handleTouchEnd('down')}
          onMouseDown={() => handleTouchStart('down')}
          onMouseUp={() => handleTouchEnd('down')}
          aria-label="Ruch do tyłu"
          className="w-13 h-13 rounded-2xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer border border-slate-600 transition-colors"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        <button
          onTouchStart={() => handleTouchStart('right')}
          onTouchEnd={() => handleTouchEnd('right')}
          onMouseDown={() => handleTouchStart('right')}
          onMouseUp={() => handleTouchEnd('right')}
          aria-label="Ruch w prawo"
          className="w-13 h-13 rounded-2xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md cursor-pointer border border-slate-600 transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Jump Button (Touch target min 60px) */}
      <div className="pointer-events-auto">
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            onJump();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onJump();
          }}
          aria-label="Skok (Spacja)"
          className="w-16 h-16 rounded-3xl bg-amber-500 active:bg-amber-400 active:scale-95 text-slate-950 font-black shadow-2xl flex flex-col items-center justify-center border-2 border-amber-300 transition-all cursor-pointer"
        >
          <ArrowBigUp className="w-7 h-7" />
          <span className="text-[10px] uppercase font-black tracking-wider">SKOK</span>
        </button>
      </div>
    </div>
  );
};
