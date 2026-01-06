
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Character, GameStats } from './types';
import { CHARACTERS } from './constants';
import TitleScreen from './components/TitleScreen';
import CharacterSelect from './components/CharacterSelect';
import GameEngine from './components/GameEngine';
import GameOverScreen from './components/GameOverScreen';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(GameState.TITLE);
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distance: 0,
    deaths: 0,
    highScore: parseInt(localStorage.getItem('void_high_score') || '0'),
  });
  const [lastDeathMessage, setLastDeathMessage] = useState<string>("WELCOME TO THE ABYSS.");

  const handleGameOver = useCallback((finalScore: number) => {
    setStats(prev => {
      const newHighScore = Math.max(prev.highScore, finalScore);
      localStorage.setItem('void_high_score', newHighScore.toString());
      return {
        ...prev,
        score: finalScore,
        deaths: prev.deaths + 1,
        highScore: newHighScore
      };
    });
    setState(GameState.GAMEOVER);
  }, []);

  const startGame = useCallback((char: Character) => {
    setSelectedChar(char);
    setState(GameState.PLAYING);
  }, []);

  const goToCharSelect = useCallback(() => {
    setState(GameState.CHARACTER_SELECT);
  }, []);

  const goToTitle = useCallback(() => {
    setState(GameState.TITLE);
  }, []);

  return (
    <div className="relative w-[800px] h-[450px] bg-black border-4 border-[#ff0044] overflow-hidden shadow-[0_0_20px_#ff0044]">
      {state === GameState.TITLE && (
        <TitleScreen onStart={goToCharSelect} />
      )}
      
      {state === GameState.CHARACTER_SELECT && (
        <CharacterSelect 
          onSelect={startGame} 
          onBack={goToTitle} 
          characters={CHARACTERS} 
        />
      )}

      {state === GameState.PLAYING && (
        <GameEngine 
          character={selectedChar} 
          onGameOver={handleGameOver} 
          onDeathMessage={setLastDeathMessage}
        />
      )}

      {state === GameState.GAMEOVER && (
        <GameOverScreen 
          stats={stats} 
          message={lastDeathMessage}
          onRestart={goToCharSelect} 
          onTitle={goToTitle} 
        />
      )}
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#ff0044] z-50"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#ff0044] z-50"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#ff0044] z-50"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#ff0044] z-50"></div>
    </div>
  );
};

export default App;
