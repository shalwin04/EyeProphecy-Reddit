import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OracleCharacter } from './components/OracleCharacter';
import { FlyComponent } from './components/FlyComponent';
import { ProphecyDisplay } from './components/ProphecyDisplay';
import { GameInstructions } from './components/GameInstructions';
import { NetCursor } from './components/NetCursor';

type GameStage =
  | 'sleeping'
  | 'awakening'
  | 'fly-hunting'
  | 'fly-caught'
  | 'feeding'
  | 'prophecy-brewing'
  | 'prophecy-reveal';

interface FlyPosition {
  x: number;
  y: number;
}

export const Game: React.FC = () => {
  const [gameStage, setGameStage] = useState<GameStage>('sleeping');
  const [rubCount, setRubCount] = useState(0);
  const [flyPosition, setFlyPosition] = useState<FlyPosition>({ x: 200, y: 150 });
  const [flyCaught, setFlyCaught] = useState(false);
  const [prophecy, setProphecy] = useState('');
  const [isRubbing, setIsRubbing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const prophecies = [
    'Your USB cable will always be upside down on the first try. Forever.',
    'The person in front of you will walk exactly 0.5 mph slower than your natural pace.',
    'Your phone battery will die at 23% for the rest of your life.',
    'Every shopping cart you touch will have exactly one wobbly wheel.',
    'Your socks will develop holes in the exact spot where your big toe lives.',
    'The socks know everything. Especially your secrets.',
    "Your reflection has been practicing faces when you're not looking.",
    'Somewhere, a rubber duck is plotting your downfall.',
    "The last slice of pizza holds the meaning of life, but you'll never eat it.",
  ];
  const [showNetCursor, setShowNetCursor] = useState(false);
  const [draggedFly, setDraggedFly] = useState(false);
  const [oracleAwake, setOracleAwake] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [mouthPosition, setMouthPosition] = useState({ x: 250, y: 200 });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const flyIntervalRef = useRef<NodeJS.Timeout>();

  // Move fly randomly
  useEffect(() => {
    if (gameStage === 'fly-hunting' && !flyCaught) {
      flyIntervalRef.current = setInterval(() => {
        setFlyPosition({
          x: Math.random() * 400 + 50,
          y: Math.random() * 300 + 100,
        });
      }, 2000);
    }
    return () => {
      if (flyIntervalRef.current) {
        clearInterval(flyIntervalRef.current);
      }
    };
  }, [gameStage, flyCaught]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEyeRub = useCallback(() => {
    if (gameStage !== 'sleeping') return;

    setIsRubbing(true);
    setRubCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 6) {
        setTimeout(() => {
          setGameStage('awakening');
          setOracleAwake(true);
          setTimeout(() => {
            setGameStage('fly-hunting');
            setShowNetCursor(true);
          }, 3000);
        }, 500);
      }
      return newCount;
    });

    setTimeout(() => setIsRubbing(false), 200);
  }, [gameStage]);

  const handleFlyCatch = useCallback(() => {
    if (gameStage !== 'fly-hunting' || flyCaught) return;

    setFlyCaught(true);
    setShowNetCursor(false);

    // Generate prophecy immediately
    const randomProphecy = prophecies[Math.floor(Math.random() * prophecies.length)];
    setProphecy(randomProphecy);

    // Transition to prophecy brewing
    setGameStage('prophecy-brewing');

    // Add a delay for the brewing animation before revealing
    setTimeout(() => {
      setGameStage('prophecy-reveal');
    }, 2000); // 2 seconds for the brewing animation
  }, [gameStage, flyCaught, prophecies]);

  const handleFlyFeed = useCallback(() => {
    // No-op since we're removing the feeding stage
    return;
  }, []);

  const resetGame = useCallback(() => {
    setGameStage('sleeping');
    setRubCount(0);
    setFlyCaught(false);
    setProphecy('');
    setOracleAwake(false);
    setMouthOpen(false);
    setDraggedFly(false);
    setShowNetCursor(false);
    setFlyPosition({ x: 200, y: 150 });
  }, []);

  const getCurrentInstruction = () => {
    switch (gameStage) {
      case 'sleeping':
        return 'Click His Eyes to Wake Him';
      case 'awakening':
        return 'The Oracle Has Awakened...';
      case 'fly-hunting':
        return 'Catch the Fly With Your Net!';
      case 'fly-caught':
        return 'The Oracle Hungers...';
      case 'prophecy-brewing':
        return 'Prophecy Brewing...';
      case 'prophecy-reveal':
        return 'Your Fate is Revealed!';
      default:
        return '';
    }
  };

  return (
    <div
      ref={gameAreaRef}
      className="relative w-full h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black overflow-hidden"
      style={{
        cursor: showNetCursor ? 'none' : 'default',
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {/* CRT Static Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
      </div>

      {/* Pixel Grid Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #fff 1px, transparent 1px),
            linear-gradient(180deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: '4px 4px',
        }}
      ></div>

      {/* Game Instructions */}
      <GameInstructions instruction={getCurrentInstruction()} />

      {/* Oracle Character */}
      <OracleCharacter
        isAwake={oracleAwake}
        isRubbing={isRubbing}
        mouthOpen={mouthOpen}
        onEyeRub={handleEyeRub}
        gameStage={gameStage}
        setMouthPosition={setMouthPosition}
      />

      {/* Fly Component */}
      <AnimatePresence>
        {gameStage === 'fly-hunting' && !flyCaught && (
          <FlyComponent
            position={flyPosition}
            caught={flyCaught}
            onCatch={handleFlyCatch}
            onFeed={handleFlyFeed}
            gameStage={gameStage}
          />
        )}
      </AnimatePresence>

      {/* Dragged Fly */}
      <AnimatePresence>
        {draggedFly && (
          <motion.div
            className="fixed pointer-events-none z-50"
            style={{
              left: mousePosition.x - 10,
              top: mousePosition.y - 10,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, rotate: { repeat: Infinity, duration: 0.5 } }}
          >
            <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-green-300 shadow-lg">
              <div className="w-1 h-1 bg-red-500 rounded-full mx-auto mt-1"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Net Cursor */}
      {showNetCursor && <NetCursor position={mousePosition} />}

      {/* Prophecy Brewing */}
      <AnimatePresence>
        {gameStage === 'prophecy-brewing' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="text-green-400 text-lg mb-4"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                [CHEWING FLY...]
              </motion.div>
              <motion.div
                className="text-yellow-400 text-lg"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              >
                [PROPHECY BREWING...]
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prophecy Reveal */}
      <ProphecyDisplay
        prophecy={prophecy}
        visible={gameStage === 'prophecy-reveal'}
        onReset={resetGame}
        gameStage={gameStage}
      />

      {/* Debug Info */}
      <div className="absolute top-4 left-4 text-xs text-white opacity-50">
        Stage: {gameStage} | Pokes: {rubCount}
      </div>
    </div>
  );
};
