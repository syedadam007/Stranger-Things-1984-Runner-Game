
import { Character } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const GROUND_Y = 380;
export const INITIAL_SPEED = 3.8; // Reduced from 4.8 for an even slower start
export const MAX_SPEED = 20;      
export const SPEED_INCREMENT = 0.0002; // Reverted to 0.0002 for slower difficulty scaling

export const CHARACTERS: Character[] = [
  {
    id: 'dustin',
    name: 'DUSTIN',
    description: 'The Bard. "I am on a curiosity voyage!"',
    color: '#3b82f6',
    stats: {
      speed: 1.6,
      jumpPower: -15,
      gravity: 0.7,
    },
  },
  {
    id: 'el',
    name: 'EL',
    description: 'The Mage. "Friends don\'t lie."',
    color: '#ec4899',
    stats: {
      speed: 1.6,
      jumpPower: -13,
      gravity: 0.4,
    },
  },
  {
    id: 'max',
    name: 'MAX',
    description: 'The Zoomer. "Totally tubular."',
    color: '#f97316',
    stats: {
      speed: 1.6,
      jumpPower: -14,
      gravity: 0.8,
    },
  },
  {
    id: 'lucas',
    name: 'LUCAS',
    description: 'The Ranger. "Stay on the path."',
    color: '#10b981',
    stats: {
      speed: 1.6,
      jumpPower: -17,
      gravity: 1.0,
    },
  },
  {
    id: 'mike',
    name: 'MIKE',
    description: 'The Paladin. "Something is coming."',
    color: '#6366f1',
    stats: {
      speed: 1.6,
      jumpPower: -15,
      gravity: 0.75,
    },
  },
];
