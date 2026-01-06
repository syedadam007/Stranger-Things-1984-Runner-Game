
import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types';

interface Props {
  onSelect: (char: Character) => void;
  onBack: () => void;
  characters: Character[];
}

const CharacterSelect: React.FC<Props> = ({ onSelect, onBack, characters }) => {
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setIndex(i => (i > 0 ? i - 1 : characters.length - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setIndex(i => (i < characters.length - 1 ? i + 1 : 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        onSelect(characters[index]);
      } else if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [index, characters, onSelect, onBack]);

  const char = characters[index];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = 8; // Slightly smaller scale to fit
    const x = canvas.width / 2 - (4 * s);
    const y = 10;

    const drawPixel = (px: number, py: number, color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + px * s, y + py * s, s, s);
    };

    if (char.id === 'dustin') {
        for(let i=1; i<7; i++) drawPixel(i, 0, '#0a3596');
        drawPixel(1, 1, '#fff'); drawPixel(2, 1, '#fff'); drawPixel(3, 1, '#fff');
        drawPixel(0, 1, '#ff0000'); 
        for(let i=0; i<8; i++) for(let j=2; j<5; j++) drawPixel(i, j, '#4d3020');
        for(let i=2; i<6; i++) for(let j=4; j<8; j++) drawPixel(i, j, '#ffccaa');
        drawPixel(3, 5, '#000'); drawPixel(5, 5, '#000');
        for(let i=1; i<7; i++) for(let j=8; j<11; j++) drawPixel(i, j, '#cc0000');
        for(let j=8; j<11; j++) drawPixel(3.5, j, '#ffdd00');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#0a3596');
    } else if (char.id === 'el') {
        for(let i=1; i<7; i++) for(let j=0; j<3; j++) drawPixel(i, j, '#6d4c35');
        for(let i=1; i<7; i++) for(let j=3; j<7; j++) drawPixel(i, j, '#ffccaa');
        drawPixel(2, 4, '#000'); drawPixel(5, 4, '#000');
        drawPixel(3.5, 5.5, '#aa0000');
        for(let i=0; i<8; i++) for(let j=7; j<10; j++) drawPixel(i, j, '#1e40af');
        for(let i=2; i<6; i++) for(let j=7; j<12; j++) drawPixel(i, j, '#f472b6');
        drawPixel(2, 12, '#fff'); drawPixel(5, 12, '#fff');
        drawPixel(2, 13, '#166534'); drawPixel(5, 13, '#166534');
    } else if (char.id === 'max') {
        for(let i=0; i<8; i++) for(let j=0; j<7; j++) drawPixel(i, j, '#f97316');
        for(let i=2; i<6; i++) for(let j=2; j<7; j++) drawPixel(i, j, '#ffccaa');
        for(let i=1; i<7; i++) for(let j=7; j<11; j++) drawPixel(i, j, '#166534');
        drawPixel(3.5, 8, '#fde047'); drawPixel(3.5, 9, '#f97316');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#3b82f6');
    } else if (char.id === 'lucas') {
        for(let i=1; i<7; i++) drawPixel(i, 0, '#14532d');
        for(let i=1; i<7; i++) drawPixel(i, 1, '#365314');
        for(let i=1; i<7; i++) for(let j=2; j<7; j++) drawPixel(i, j, '#422006');
        drawPixel(2, 4, '#000'); drawPixel(5, 4, '#000');
        for(let i=0; i<8; i++) for(let j=7; j<11; j++) drawPixel(i, j, '#ea580c');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#991b1b');
    } else if (char.id === 'mike') {
        for(let i=1; i<7; i++) for(let j=0; j<4; j++) drawPixel(i, j, '#020617');
        for(let i=1; i<7; i++) for(let j=3; j<7; j++) drawPixel(i, j, '#ffccaa');
        drawPixel(2, 4, '#000'); drawPixel(5, 4, '#000');
        for(let i=1; i<7; i++) for(let j=7; j<11; j++) drawPixel(i, j, '#1e3a8a');
        drawPixel(3.5, 8, '#fff'); drawPixel(3.5, 9, '#ef4444');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#713f12');
    }
  }, [char]);

  return (
    <div className="w-full h-full p-4 flex flex-col items-center bg-[#050000] justify-between">
      <h2 className="text-4xl font-serif italic text-[#ff0000] mt-4" style={{ textShadow: '0 0 10px #ff0000' }}>
        CHOOSE YOUR VESSEL
      </h2>
      
      <div className="flex items-center gap-8 w-full justify-center">
        <button 
          onClick={() => setIndex(i => (i > 0 ? i - 1 : characters.length - 1))}
          className="text-5xl text-[#ff0000] hover:scale-125 transition-transform font-bold"
        >
          &lt;
        </button>

        <div className="w-72 flex flex-col items-center">
          <div 
            className="w-36 h-48 border-4 border-[#ff0000] p-1 bg-[#0a0000] flex items-center justify-center relative shadow-[0_0_15px_rgba(255,0,0,0.5)] overflow-hidden"
          >
             <canvas ref={canvasRef} width={140} height={180} className="w-full h-full" />
             <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none"></div>
          </div>
          
          <h3 className="text-3xl text-white mt-2 font-serif uppercase tracking-[0.2em]">{char.name}</h3>
          <p className="text-[#886666] text-center mb-4 h-10 italic text-base leading-tight font-mono">
            {char.description}
          </p>
          
          <div className="w-full space-y-2">
            <StatRow label="SPEED" value={char.stats.speed * 6} color="#ff0000" />
            <StatRow label="JUMP" value={Math.abs(char.stats.jumpPower) / 2} color="#ff0000" />
            <StatRow label="POWER" value={(1.5 - char.stats.gravity) * 10} color="#00ffff" />
          </div>
        </div>

        <button 
          onClick={() => setIndex(i => (i < characters.length - 1 ? i + 1 : 0))}
          className="text-5xl text-[#ff0000] hover:scale-125 transition-transform font-bold"
        >
          &gt;
        </button>
      </div>

      <div className="mt-6 mb-4 text-[#ff0000] opacity-75 font-mono animate-pulse tracking-widest uppercase text-xs">
        [ SPACE TO INITIATE ]
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#666]">
        <span>{label}</span>
        <span style={{ color }}>{Math.floor(value * 10)}%</span>
    </div>
    <div className="w-full h-2 bg-[#1a0000] border border-red-950/30">
      <div 
        className="h-full transition-all duration-700" 
        style={{ width: `${Math.min(100, value * 10)}%`, backgroundColor: color, boxShadow: `0 0 5px ${color}` }}
      ></div>
    </div>
  </div>
);

export default CharacterSelect;
