import React, { useRef, useState, useEffect } from 'react';
import { ArrowUp, Zap, MessageCircle } from 'lucide-react';
import { GameWorld } from '../game3d/GameWorld';
import { SoundEffects } from '../services/audio';

interface MobileControlsProps {
  gameWorld: GameWorld | null;
  onInteract: () => void;
  canInteract: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  gameWorld,
  onInteract,
  canInteract
}) => {
  const [stickActive, setStickActive] = useState(false);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [sprintActive, setSprintActive] = useState(false);

  const stickBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setStickActive(true);
    updateStick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateStick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setStickActive(false);
        setStickPos({ x: 0, y: 0 });
        if (gameWorld) {
          gameWorld.virtualStick = { x: 0, y: 0 };
        }
        break;
      }
    }
  };

  const updateStick = (clientX: number, clientY: number) => {
    if (!stickBaseRef.current || !gameWorld) return;
    const rect = stickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = rect.width / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    setStickPos({ x: dx, y: dy });
    gameWorld.virtualStick = {
      x: dx / maxRadius,
      y: dy / maxRadius
    };
  };

  const handleJump = () => {
    if (gameWorld) {
      gameWorld.virtualJump = true;
      SoundEffects.playJumpSound();
      setTimeout(() => {
        if (gameWorld) gameWorld.virtualJump = false;
      }, 150);
    }
  };

  const toggleSprint = () => {
    const next = !sprintActive;
    setSprintActive(next);
    if (gameWorld) {
      gameWorld.virtualSprint = next;
    }
  };

  // Safe cleanup
  useEffect(() => {
    return () => {
      if (gameWorld) {
        gameWorld.virtualStick = { x: 0, y: 0 };
        gameWorld.virtualJump = false;
        gameWorld.virtualSprint = false;
      }
    };
  }, [gameWorld]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 pb-6 flex items-end justify-between font-fredoka select-none">
      
      {/* Virtual Analog Joystick (Bottom Left) */}
      <div 
        ref={stickBaseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto relative w-32 h-32 rounded-full bg-slate-900/60 border-4 border-white/40 flex items-center justify-center touch-none backdrop-blur-none shadow-xl"
      >
        <div 
          className="w-14 h-14 rounded-full bg-blue-500 border-2 border-white shadow-lg pointer-events-none transition-transform duration-75"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
          }}
        />
        <span className="absolute bottom-1 text-[10px] font-bold text-white/70">
          Ruch (WASD)
        </span>
      </div>

      {/* Action Buttons (Bottom Right) */}
      <div className="pointer-events-auto flex flex-col items-end gap-3 touch-none">
        
        {/* Interact Button (Large if near an NPC/Crystal) */}
        {canInteract && (
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onInteract();
            }}
            onClick={onInteract}
            className="w-16 h-16 rounded-2xl bg-amber-400 active:bg-amber-500 text-slate-900 font-black text-xl shadow-2xl border-4 border-white flex flex-col items-center justify-center animate-bounce"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px]">E: Akcja</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          {/* Sprint Toggle */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              toggleSprint();
            }}
            onClick={toggleSprint}
            className={`w-14 h-14 rounded-2xl border-2 border-white/80 shadow-lg flex flex-col items-center justify-center font-bold text-xs transition-colors ${
              sprintActive ? 'bg-orange-500 text-white' : 'bg-slate-800/80 text-slate-200'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-[9px]">Bieg</span>
          </button>

          {/* Jump Button */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleJump();
            }}
            onClick={handleJump}
            className="w-16 h-16 rounded-2xl bg-emerald-500 active:bg-emerald-600 text-white font-black shadow-xl border-2 border-white flex flex-col items-center justify-center"
          >
            <ArrowUp className="w-6 h-6 stroke-[3]" />
            <span className="text-[10px]">Skok</span>
          </button>
        </div>
      </div>

    </div>
  );
};
