
import { Character, Obstacle, Player, BiomeType } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_Y, INITIAL_SPEED, MAX_SPEED, SPEED_INCREMENT } from '../constants';
import { getDeathMessage } from '../services/gemini';
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  character: Character;
  onGameOver: (score: number) => void;
  onDeathMessage: (msg: string) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const BIOMES: BiomeType[] = ['ABYSS', 'HAWKINS', 'LAB', 'UPSIDE_DOWN'];

const GameEngine: React.FC<Props> = ({ character, onGameOver, onDeathMessage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [currentBiome, setCurrentBiome] = useState<BiomeType>('ABYSS');
  
  const gameRef = useRef({
    score: 0,
    speed: INITIAL_SPEED,
    isGameOver: false,
    distance: 0,
    biomeIndex: 0,
    player: {
      x: 120,
      y: GROUND_Y - 52,
      width: 32,
      height: 52,
      vy: 0,
      isGrounded: false,
      color: character.color
    } as Player,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    lastSpawn: 0,
    frameCount: 0,
    flicker: 0,
    // Max specific trance states
    isLevitating: false,
    levitationStartTime: 0,
    isTranceStartup: false,
    tranceStartupDuration: 120, // 2 seconds at 60fps
    keys: { up: false, down: false }
  });

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.isLevitating) return; // Controls handled in update loop during levitation
    if (g.player.isGrounded) {
      g.player.vy = character.stats.jumpPower;
      g.player.isGrounded = false;
    }
  }, [character]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        g.keys.up = true;
        jump();
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        g.keys.down = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') g.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's') g.keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Initialize ambient particles
    for(let i=0; i<100; i++) {
        gameRef.current.particles.push({
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
            vx: -0.5 - Math.random() * 2,
            vy: (Math.random() - 0.5) * 0.5,
            size: 0.5 + Math.random() * 2
        });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump]);

  const drawDemogorgon = (ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) => {
    const s = 1.5; 
    const hover = Math.sin(frame * 0.1) * 10;
    const dy = y + hover;

    const dp = (px: number, py: number, color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(x + px * s, dy + py * s, s, s);
    };

    const petalColor = '#cc0000';
    const teethColor = '#fffbe6';
    const edgeColor = '#333';

    for(let i=10; i<20; i++) for(let j=0; j<8; j++) if(Math.abs(15-i) < j) dp(i, j, petalColor);
    for(let i=0; i<10; i++) for(let j=8; j<20; j++) if(Math.abs(14-j) < 10-i) dp(i, j, petalColor);
    for(let i=20; i<30; i++) for(let j=8; j<20; j++) if(Math.abs(14-j) < i-20) dp(i, j, petalColor);
    for(let i=5; i<15; i++) for(let j=20; j<28; j++) if(Math.abs(10-i) < 28-j) dp(i, j, petalColor);
    for(let i=15; i<25; i++) for(let j=20; j<28; j++) if(Math.abs(20-i) < 28-j) dp(i, j, petalColor);

    ctx.fillStyle = teethColor;
    ctx.beginPath(); ctx.arc(x + 15*s, dy + 15*s, 4*s, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(x + 15*s, dy + 15*s, 2.5*s, 0, Math.PI*2); ctx.fill();

    const bodyColor = '#444';
    for(let i=11; i<19; i++) for(let j=20; j<35; j++) dp(i, j, bodyColor); 
    for(let i=7; i<11; i++) for(let j=22; j<30; j++) dp(i, j, bodyColor); 
    for(let i=19; i<23; i++) for(let j=22; j<30; j++) dp(i, j, bodyColor);
    dp(6, 30, edgeColor); dp(7, 31, edgeColor);
    dp(23, 30, edgeColor); dp(22, 31, edgeColor);
    for(let i=9; i<13; i++) for(let j=35; j<45; j++) dp(i, j, bodyColor);
    for(let i=17; i<21; i++) for(let j=35; j<45; j++) dp(i, j, bodyColor);
  };

  const drawPlayerSprite = (ctx: CanvasRenderingContext2D, p: Player, charId: string, frame: number) => {
    const g = gameRef.current;
    const x = p.x;
    const y = p.y + (p.isGrounded && !g.isLevitating ? Math.sin(frame * 0.2) * 2 : 0);
    const s = 4;

    const isFlashingRed = g.isTranceStartup && Math.floor(frame / 5) % 2 === 0;

    const drawPixel = (px: number, py: number, color: string) => {
        ctx.fillStyle = isFlashingRed ? '#ff0000' : color;
        ctx.fillRect(x + px * s, y + py * s, s, s);
    };

    if (charId === 'dustin') {
        for(let i=1; i<7; i++) drawPixel(i, 0, '#0a3596');
        drawPixel(1, 1, '#fff'); drawPixel(2, 1, '#fff'); drawPixel(3, 1, '#fff');
        drawPixel(0, 1, '#ff0000'); 
        for(let i=0; i<8; i++) for(let j=2; j<5; j++) drawPixel(i, j, '#4d3020');
        for(let i=2; i<6; i++) for(let j=4; j<8; j++) drawPixel(i, j, '#ffccaa');
        drawPixel(3, 5, '#000'); drawPixel(5, 5, '#000');
        for(let i=1; i<7; i++) for(let j=8; j<11; j++) drawPixel(i, j, '#cc0000');
        for(let j=8; j<11; j++) drawPixel(3.5, j, '#ffdd00');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#0a3596');
    } else if (charId === 'el') {
        for(let i=1; i<7; i++) for(let j=0; j<3; j++) drawPixel(i, j, '#6d4c35');
        for(let i=1; i<7; i++) for(let j=3; j<7; j++) drawPixel(i, j, '#ffccaa');
        drawPixel(2, 4, '#000'); drawPixel(5, 4, '#000');
        drawPixel(3.5, 5.5, '#aa0000');
        for(let i=0; i<8; i++) for(let j=7; j<10; j++) drawPixel(i, j, '#1e40af');
        for(let i=2; i<6; i++) for(let j=7; j<12; j++) drawPixel(i, j, '#f472b6');
        drawPixel(2, 12, '#fff'); drawPixel(5, 12, '#fff');
    } else if (charId === 'max') {
        if (g.isLevitating) {
          for(let i=0; i<8; i++) for(let j=0; j<7; j++) drawPixel(i, j, '#f97316'); 
          for(let i=2; i<6; i++) for(let j=2; j<7; j++) drawPixel(i, j, '#ffccaa'); 
          drawPixel(3, 4, '#000'); drawPixel(5, 4, '#000');
          for(let i=-1; i<9; i++) for(let j=7; j<10; j++) drawPixel(i, j, '#166534'); 
          for(let i=2; i<4; i++) for(let j=10; j<15; j++) drawPixel(i, j, '#3b82f6');
          for(let i=5; i<7; i++) for(let j=10; j<15; j++) drawPixel(i, j, '#3b82f6');
        } else {
          for(let i=0; i<8; i++) for(let j=0; j<7; j++) drawPixel(i, j, '#f97316');
          for(let i=2; i<6; i++) for(let j=2; j<7; j++) drawPixel(i, j, '#ffccaa');
          for(let i=1; i<7; i++) for(let j=7; j<11; j++) drawPixel(i, j, '#166534');
          drawPixel(3.5, 8, '#fde047'); drawPixel(3.5, 9, '#f97316');
          for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#3b82f6');
        }
    } else if (charId === 'lucas') {
        for(let i=1; i<7; i++) drawPixel(i, 0, '#14532d');
        for(let i=1; i<7; i++) drawPixel(i, 1, '#365314');
        for(let i=1; i<7; i++) for(let j=2; j<7; j++) drawPixel(i, j, '#422006');
        drawPixel(2, 4, '#000'); drawPixel(5, 4, '#000');
        for(let i=0; i<8; i++) for(let j=7; j<11; j++) drawPixel(i, j, '#ea580c');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#991b1b');
    } else if (charId === 'mike') {
        for(let i=1; i<7; i++) for(let j=0; j<4; j++) drawPixel(i, j, '#020617');
        for(let i=1; i<7; i++) for(let j=3; j<7; j++) drawPixel(i, j, '#ffccaa');
        drawPixel(2, 4, '#000'); drawPixel(5, 4, '#000');
        for(let i=1; i<7; i++) for(let j=7; j<11; j++) drawPixel(i, j, '#1e3a8a');
        drawPixel(3.5, 8, '#fff'); drawPixel(3.5, 9, '#ef4444');
        for(let i=2; i<6; i++) for(let j=11; j<14; j++) drawPixel(i, j, '#713f12');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const spawnObstacle = () => {
      const g = gameRef.current;
      const effectiveSpeed = g.speed * character.stats.speed;
      const type: Obstacle['type'] = Math.random() > 0.85 ? 'floating' : 'spike';
      const newObs: Obstacle = {
        x: GAME_WIDTH + 100,
        y: type === 'floating' ? GROUND_Y - 140 - Math.random() * 40 : GROUND_Y - 35,
        width: 35,
        height: 35,
        type,
        speed: effectiveSpeed
      };
      g.obstacles.push(newObs);
    };

    const drawBackground = (biome: BiomeType, dist: number) => {
        const g = gameRef.current;
        if (biome === 'ABYSS') {
            const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
            grad.addColorStop(0, '#3d1a0a');
            grad.addColorStop(1, '#8b5e34');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            
            ctx.fillStyle = '#4d2a15';
            for(let i=0; i<5; i++) {
                const x = (i * 250 - dist * 0.05) % (GAME_WIDTH + 250);
                ctx.beginPath();
                ctx.moveTo(x, GROUND_Y);
                ctx.lineTo(x + 50, GROUND_Y - 120);
                ctx.lineTo(x + 100, GROUND_Y - 80);
                ctx.lineTo(x + 150, GROUND_Y - 150);
                ctx.lineTo(x + 250, GROUND_Y);
                ctx.fill();
            }
        } 
        else if (biome === 'HAWKINS') {
            ctx.fillStyle = '#050a14';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            const bX = (600 - dist * 0.1) % (GAME_WIDTH + 800);
            ctx.fillStyle = '#05080c';
            ctx.fillRect(bX, GROUND_Y - 200, 300, 200);
            const antennaX = bX + 150;
            const antennaTopY = GROUND_Y - 240;
            ctx.strokeStyle = '#05080c';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(antennaX, GROUND_Y - 200);
            ctx.lineTo(antennaX, antennaTopY);
            ctx.stroke();
            const isFlash = Math.floor(g.frameCount / 25) % 2 === 0;
            if (isFlash) {
              ctx.fillStyle = '#ff0000';
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#ff0000';
              ctx.beginPath();
              ctx.arc(antennaX, antennaTopY, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0; 
            }
            ctx.fillStyle = '#0f1621';
            for(let i=0; i<15; i++) {
                const x = (i * 80 - dist * 0.25) % (GAME_WIDTH + 80);
                ctx.beginPath(); ctx.moveTo(x, GROUND_Y); ctx.lineTo(x + 20, GROUND_Y - 60); ctx.lineTo(x + 40, GROUND_Y); ctx.fill();
            }
        } 
        else if (biome === 'LAB') {
            ctx.fillStyle = '#0d1a1a';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            ctx.strokeStyle = '#0a2a2a';
            const gridX = -(dist % 40);
            for(let i=0; i<GAME_WIDTH + 80; i+=40) { ctx.beginPath(); ctx.moveTo(i + gridX, 0); ctx.lineTo(i + gridX, GROUND_Y); ctx.stroke(); }
            for(let i=0; i<GROUND_Y; i+=40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(GAME_WIDTH, i); ctx.stroke(); }
        } 
        else if (biome === 'UPSIDE_DOWN') {
            ctx.fillStyle = '#020707';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            ctx.fillStyle = '#000000';
            for(let i=0; i<8; i++) {
                const x = (i * 180 - dist * 0.2) % (GAME_WIDTH + 180);
                ctx.beginPath();
                ctx.ellipse(x + 25, GROUND_Y / 2, 30, GROUND_Y / 2 + 50, 0.1 * Math.sin(g.frameCount * 0.02), 0, Math.PI * 2);
                ctx.fill();
            }
            if (Math.random() > 0.995) g.flicker = 10;
            if (g.flicker > 0) {
                ctx.fillStyle = `rgba(255, 0, 0, ${g.flicker / 20})`;
                ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                g.flicker--;
            }
        }

        ctx.strokeStyle = biome === 'UPSIDE_DOWN' ? '#4a0808' : '#111';
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(0, GROUND_Y + 5); ctx.lineTo(GAME_WIDTH, GROUND_Y + 5); ctx.stroke();
    };

    const update = () => {
      const g = gameRef.current;
      if (g.isGameOver) return;

      g.frameCount++;
      // Increment base speed
      g.speed = Math.min(MAX_SPEED, g.speed + SPEED_INCREMENT);
      
      // Calculate effective movement speed using character multiplier
      const effectiveSpeed = g.speed * character.stats.speed;
      
      g.distance += effectiveSpeed;
      const prevScore = g.score;
      g.score = Math.floor(g.distance / 10);
      setScore(g.score);

      // Trigger Max's Levitation Trance at 1000 score
      if (character.id === 'max' && g.score >= 1000 && prevScore < 1000 && !g.isLevitating) {
        g.isLevitating = true;
        g.isTranceStartup = true;
        g.levitationStartTime = g.frameCount;
      }

      // Physics/Logic for Trance phases
      if (g.isLevitating) {
        const tranceElapsed = g.frameCount - g.levitationStartTime;
        
        if (g.isTranceStartup) {
          // Phase 1: Automatic slow float up
          g.player.y -= 1.5; 
          if (tranceElapsed >= g.tranceStartupDuration) {
            g.isTranceStartup = false; // Transition to player control
          }
        } else {
          // Phase 2: Player control
          const moveSpeed = 4;
          if (g.keys.up) g.player.y -= moveSpeed;
          else if (g.keys.down) g.player.y += moveSpeed;
          else {
             g.player.y += 0.5; // Gentle sink
          }
          
          // Trance timer end - 15s total at 60fps
          if (tranceElapsed > 900) { 
            g.isLevitating = false;
            g.player.vy = 0;
          }
        }

        // Common Trance bounds
        if (g.player.y < 40) g.player.y = 40;
        if (g.player.y > GROUND_Y - g.player.height) g.player.y = GROUND_Y - g.player.height;
      } else {
        // Standard Physics
        g.player.vy += character.stats.gravity;
        g.player.y += g.player.vy;

        if (g.player.y > GROUND_Y - g.player.height) {
          g.player.y = GROUND_Y - g.player.height;
          g.player.vy = 0;
          g.player.isGrounded = true;
        }
      }

      const newBiomeIndex = Math.floor(g.distance / 3000) % BIOMES.length;
      if (newBiomeIndex !== g.biomeIndex) {
          g.biomeIndex = newBiomeIndex;
          setCurrentBiome(BIOMES[newBiomeIndex]);
      }

      g.particles.forEach(p => {
          p.x += p.vx * (effectiveSpeed / 4);
          p.y += p.vy;
          if (p.x < 0) p.x = GAME_WIDTH;
          if (p.y > GAME_HEIGHT) p.y = 0;
      });

      const spawnRate = Math.max(15, 80 - effectiveSpeed * 3);
      if (g.frameCount - g.lastSpawn > spawnRate) {
        spawnObstacle();
        g.lastSpawn = g.frameCount;
      }

      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const obs = g.obstacles[i];
        obs.x -= effectiveSpeed;
        
        // COLLISION CHECK
        const px = g.player.x + 10;
        const py = g.player.y + 10;
        const pw = g.player.width - 20;
        const ph = g.player.height - 20;

        if (px < obs.x + obs.width && px + pw > obs.x && py < obs.y + obs.height && py + ph > obs.y) {
          if (!g.isTranceStartup) {
             endGame();
          }
        }
        if (obs.x < -100) g.obstacles.splice(i, 1);
      }
    };

    const endGame = () => {
      const g = gameRef.current;
      g.isGameOver = true;
      cancelAnimationFrame(animationId);
      onGameOver(g.score);
      getDeathMessage(g.score).then(msg => {
          onDeathMessage(msg);
      });
    };

    const draw = () => {
      const g = gameRef.current;
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      drawBackground(BIOMES[g.biomeIndex], g.distance);

      const effectiveSpeed = g.speed * character.stats.speed;
      ctx.fillStyle = (g.isLevitating || BIOMES[g.biomeIndex] === 'UPSIDE_DOWN') ? 'rgba(255,100,100,0.8)' : 'rgba(255,255,255,0.15)';
      g.particles.forEach(p => ctx.fillRect(p.x, p.y, p.size, p.size));

      if (g.isLevitating) {
        const pulse = Math.sin(g.frameCount * 0.1) * 0.2;
        ctx.fillStyle = `rgba(255, 0, 0, ${0.1 + pulse})`;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        const grad = ctx.createRadialGradient(GAME_WIDTH/2, GAME_HEIGHT/2, 100, GAME_WIDTH/2, GAME_HEIGHT/2, 400);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(150,0,0,0.4)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      }

      g.obstacles.forEach(obs => {
        if (obs.type === 'spike') {
          ctx.fillStyle = '#2a0505';
          ctx.beginPath(); ctx.moveTo(obs.x, obs.y + obs.height); ctx.lineTo(obs.x + obs.width / 2, obs.y); ctx.lineTo(obs.x + obs.width, obs.y + obs.height); ctx.fill();
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(obs.x + obs.width / 2 - 2, obs.y + 5, 4, 4);
        } else {
          drawDemogorgon(ctx, obs.x, obs.y, g.frameCount);
        }
      });

      drawPlayerSprite(ctx, g.player, character.id, g.frameCount);

      if (!g.isGameOver) {
        update();
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [character, onGameOver, onDeathMessage]);

  const locationDisplay = gameRef.current.isLevitating ? (gameRef.current.isTranceStartup ? "AWAKENING" : "TRANCE") : currentBiome.replace('_', ' ');

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="w-full h-full" />
      <div className="absolute top-8 right-10 text-right">
        <div 
          className={`flex items-center gap-4 text-[#ff0000] font-mono leading-none transition-all duration-300 ${gameRef.current.isLevitating ? 'scale-110' : ''}`} 
          style={{ textShadow: gameRef.current.isLevitating ? '0 0 20px #ff0000' : '0 0 10px rgba(255,0,0,1)' }}
        >
            <span className={`text-4xl tracking-[0.1em] font-bold uppercase ${gameRef.current.isLevitating ? 'animate-pulse' : ''}`}>{locationDisplay}</span>
            <span className="text-4xl font-bold opacity-30">/</span>
            <span className="text-4xl tracking-[0.05em] font-bold">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="h-[4px] w-full bg-[#ff0000] mt-2 opacity-80 shadow-[0_0_8px_#ff0000]"></div>
      </div>
      
      {gameRef.current.isTranceStartup && (
        <div className="absolute inset-x-0 bottom-20 flex justify-center pointer-events-none">
          <div className="text-[#ff0000] font-mono text-xl animate-bounce tracking-[0.5em] uppercase" style={{ textShadow: '0 0 10px #f00' }}>
            [ ASCENDING ]
          </div>
        </div>
      )}
    </div>
  );
};

export default GameEngine;
