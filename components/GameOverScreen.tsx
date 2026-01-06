
import React, { useEffect } from 'react';
import { GameStats } from '../types';

interface Props {
  stats: GameStats;
  message: string;
  onRestart: () => void;
  onTitle: () => void;
}

const GameOverScreen: React.FC<Props> = ({ stats, message, onRestart, onTitle }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'Enter') onRestart();
      if (e.key === 'Escape') onTitle();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRestart, onTitle]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
      <div className="relative mb-6">
        <h2 className="text-7xl font-serif font-bold text-[#ff0000] tracking-tighter italic" style={{ textShadow: '0 0 15px #ff0000' }}>
            LOST IN THE VOID
        </h2>
      </div>
      
      <div className="w-[500px] text-center mb-8 px-6 py-8 border-2 border-red-900 bg-[#0a0000] shadow-[0_0_30px_rgba(255,0,0,0.2)]">
        <p className="text-2xl text-[#00ffff] mb-6 font-mono tracking-tight animate-pulse uppercase">
           "{message}"
        </p>
        <div className="flex justify-around items-center border-t border-red-900/30 pt-4">
          <div>
            <p className="text-xs text-red-500 uppercase tracking-widest">Score</p>
            <p className="text-3xl text-white font-serif">{stats.score}</p>
          </div>
          <div className="h-8 w-px bg-red-900/30"></div>
          <div>
            <p className="text-xs text-red-500 uppercase tracking-widest">High Score</p>
            <p className="text-3xl text-white font-serif">{stats.highScore}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <button 
          onClick={onRestart}
          className="px-10 py-3 bg-[#ff0000] text-black text-xl font-bold hover:bg-white transition-all transform hover:scale-105 pixel-borders"
        >
          RE-ENTER RIFT [R]
        </button>
        <button 
          onClick={onTitle}
          className="text-red-900 hover:text-red-500 transition-colors uppercase tracking-[0.2em] text-sm font-bold"
        >
          Return to 1984 [ESC]
        </button>
      </div>

      <div className="absolute bottom-6 text-[10px] text-red-900/50 uppercase tracking-[0.4em] animate-pulse">
        System Override... Mind Flayer detected...
      </div>
    </div>
  );
};

export default GameOverScreen;
