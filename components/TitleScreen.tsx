
import React, { useEffect, useState } from 'react';

interface Props {
  onStart: () => void;
}

const TitleScreen: React.FC<Props> = ({ onStart }) => {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 600);
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') onStart();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onStart]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
      <div className="flex flex-col items-center z-10">
        <h1 className="text-9xl font-serif font-bold text-[#ff0000] tracking-tight italic leading-[0.75]" style={{ textShadow: '0 0 30px rgba(255,0,0,0.9)' }}>
          STRANGER
        </h1>
        <h1 className="text-8xl font-serif font-bold text-[#ff0000] tracking-[-0.05em] leading-[0.75] mt-2 ml-[0.1em]" style={{ textShadow: '0 0 25px rgba(255,0,0,0.8)' }}>
          RUN
        </h1>
      </div>
      
      <div className="h-0.5 w-64 bg-[#ff0000] my-8 opacity-40 shadow-[0_0_10px_#ff0000]"></div>
      
      <h2 className="text-2xl text-[#880000] mb-12 tracking-[0.5em] uppercase font-bold opacity-70">HAWKINS • 1984</h2>
      
      <div className="flex flex-col items-center gap-4">
        <p className={`text-xl text-white font-mono tracking-[0.3em] transition-opacity duration-150 ${blink ? 'opacity-100' : 'opacity-0'}`}>
          PRESS [SPACE] TO START
        </p>
      </div>

      {/* Decorative ambiance */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_#ff0000_0%,_transparent_70%)]"></div>
    </div>
  );
};

export default TitleScreen;
