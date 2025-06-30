import React from 'react';
import { motion } from 'framer-motion';

interface FlyComponentProps {
  position: { x: number; y: number };
  caught: boolean;
  onCatch: () => void;
  onFeed: () => void;
  gameStage: string;
}

export const FlyComponent: React.FC<FlyComponentProps> = ({
  position,
  caught,
  onCatch,
  onFeed,
  gameStage
}) => {
  const handleClick = () => {
    if (gameStage === 'fly-hunting' && !caught) {
      onCatch();
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer z-30"
      style={{
        left: position.x,
        top: position.y,
        transform: gameStage === 'feeding' ? 'translate(-50%, -50%)' : 'none'
      }}
      animate={{
        x: caught ? 0 : [0, 10, -10, 5, -5, 0],
        y: caught ? 0 : [0, -5, 5, -3, 3, 0],
        scale: caught ? 1.2 : [1, 1.1, 0.9, 1.05, 0.95, 1],
      }}
      transition={{
        duration: caught ? 0.3 : 1.5,
        repeat: caught ? 0 : Infinity,
        ease: "easeInOut",
        when: "beforeChildren"
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
      drag={false}
      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
    >
      {/* Fly Body */}
      <div className="relative w-6 h-4 bg-gradient-to-b from-green-400 to-green-600 rounded-full border-2 border-green-300 shadow-lg">
        {/* Fly Eyes */}
        <div className="absolute -top-1 left-0 w-2 h-2 bg-red-500 rounded-full border border-red-400"></div>
        <div className="absolute -top-1 right-0 w-2 h-2 bg-red-500 rounded-full border border-red-400"></div>
        
        {/* Wings */}
        <motion.div
          className="absolute -top-1 left-1 w-3 h-2 bg-white bg-opacity-70 rounded-full border border-gray-300"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 0.1 }}
        />
        <motion.div
          className="absolute -top-1 right-1 w-3 h-2 bg-white bg-opacity-70 rounded-full border border-gray-300"
          animate={{ rotate: [0, -15, 15, 0] }}
          transition={{ repeat: Infinity, duration: 0.1 }}
        />

        {/* Buzz Effect */}
        {!caught && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-yellow-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        )}
      </div>

      {/* Buzz Sound Visualization */}
      {!caught && (
        <motion.div
          className="absolute -right-8 top-0 text-xs text-yellow-400 font-bold"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 0.3 }}
        >
          bzz
        </motion.div>
      )}

      {/* Caught Effect */}
      {caught && (
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-400 opacity-50"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 2, 0] }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.div>
  );
};