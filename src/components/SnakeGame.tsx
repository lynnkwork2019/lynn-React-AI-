import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<{
    snake: Point[];
    food: Point;
    direction: Direction;
    score: number;
    isGameOver: boolean;
    highScore: number;
  }>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  });

  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: generateFood([{ x: 10, y: 10 }]),
      direction: 'RIGHT',
      score: 0,
      isGameOver: false,
      highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    });
    directionRef.current = 'RIGHT';
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState.isGameOver) return;

    const moveSnake = () => {
      setGameState(prev => {
        const head = { ...prev.snake[0] };
        const currentDirection = directionRef.current;

        switch (currentDirection) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          const newHighScore = Math.max(prev.highScore, prev.score);
          localStorage.setItem('snakeHighScore', newHighScore.toString());
          return { ...prev, isGameOver: true, highScore: newHighScore };
        }

        // Check self collision
        if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          const newHighScore = Math.max(prev.highScore, prev.score);
          localStorage.setItem('snakeHighScore', newHighScore.toString());
          return { ...prev, isGameOver: true, highScore: newHighScore };
        }

        const newSnake = [head, ...prev.snake];
        let newScore = prev.score;
        let newFood = prev.food;

        // Check food collision
        if (head.x === prev.food.x && head.y === prev.food.y) {
          newScore += 10;
          newFood = generateFood(newSnake);
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
          direction: currentDirection
        };
      });
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [gameState.isGameOver, speed, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const cellSize = canvas.width / GRID_SIZE;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines (raw/visible)
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
      }

      // Draw food (Hyper-White)
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#00ffff';
      ctx.fillRect(
        gameState.food.x * cellSize + 2,
        gameState.food.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );
      ctx.shadowBlur = 0;

      // Draw snake (Magenta Head / Cyan Body)
      gameState.snake.forEach((segment, index) => {
        const isHead = index === 0;
        const isTail = index > 0 && index >= gameState.snake.length - 2; 
        
        const pulse = isTail ? (0.3 + 0.7 * Math.abs(Math.sin(Date.now() / 50))) : 1;
        
        ctx.fillStyle = isHead ? '#ff00ff' : `rgba(0, 255, 255, ${pulse})`;
        ctx.shadowBlur = isHead ? 25 : (isTail ? 20 * pulse : 0);
        ctx.shadowColor = isHead ? '#ff00ff' : '#00ffff';
        
        const p = isHead ? 0 : 1;
        ctx.fillRect(
          segment.x * cellSize + p,
          segment.y * cellSize + p,
          cellSize - p * 2,
          cellSize - p * 2
        );
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };


    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState.snake, gameState.food]);


  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4 font-mono">
        <div className="flex flex-col items-start border-l-2 border-accent-lime pl-3 bg-accent-lime/5">
          <span className="text-[10px] uppercase text-accent-lime tracking-widest opacity-70">VAL_SCORE_DATA</span>
          <span className="text-5xl font-bold font-digital text-accent-lime tracking-tighter drop-shadow-[0_0_15px_#00ff00] glitch-tear">
            {gameState.score.toString().padStart(6, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end text-right border-r-2 border-accent-magenta pr-3 bg-accent-magenta/5">
          <span className="text-[10px] uppercase text-accent-magenta tracking-widest opacity-70">MAX_RECORD_BUFF</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-accent-magenta italic font-mono">
              LOG_V2.4_PROB<br/>
              <span className="font-digital text-2xl">{gameState.highScore.toString().padStart(6, '0')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative group p-1 bg-accent-magenta/20 border-2 border-accent-magenta/40">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black block shadow-[0_0_30px_rgba(0,255,255,0.2)]"
        />
        
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0, skewX: 20 }}
              animate={{ opacity: 1, skewX: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm border-4 border-accent-magenta p-6 overflow-hidden"
            >
              <div className="absolute inset-0 noise opacity-20" />
              <h2 className="text-6xl font-bold text-accent-magenta mb-2 font-digital tracking-tighter glitch-tear">FATAL_ERROR</h2>
              <p className="text-accent-cyan text-sm mb-8 font-mono tracking-widest bg-accent-cyan/10 px-4 py-1 uppercase">CORE_DUMP: {gameState.score}</p>
              <button
                onClick={resetGame}
                className="px-10 py-4 bg-accent-cyan text-black font-bold uppercase tracking-[0.2em] transform transition-all hover:scale-110 hover:bg-accent-magenta hover:text-white active:scale-95 border-b-8 border-r-8 border-black/40"
              >
                REBOOT_SYSTEM
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-accent-cyan/30 text-[10px] uppercase tracking-[0.5em] font-mono mt-2 animate-pulse">
        INPUT_KEY_VECTOR_ACTIVE
      </div>
    </div>
  );

};

export default SnakeGame;
