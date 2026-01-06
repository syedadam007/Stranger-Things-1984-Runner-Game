
export enum GameState {
  TITLE = 'TITLE',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
}

// Added BiomeType to define the different game environments
export type BiomeType = 'ABYSS' | 'HAWKINS' | 'LAB' | 'UPSIDE_DOWN';

export interface Character {
  id: string;
  name: string;
  description: string;
  color: string;
  stats: {
    speed: number;
    jumpPower: number;
    gravity: number;
  };
}

export interface GameStats {
  score: number;
  distance: number;
  deaths: number;
  highScore: number;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player extends GameObject {
  vy: number;
  isGrounded: boolean;
  color: string;
}

export interface Obstacle extends GameObject {
  type: 'spike' | 'pit' | 'floating';
  speed: number;
}