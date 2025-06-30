import React from 'react';
import { motion } from 'framer-motion';

interface GameInstructionsProps {
  instruction: string;
}

export const GameInstructions: React.FC<GameInstructionsProps> = ({ instruction }) => {
  return (
    <motion.div
      className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40"
      key={instruction}
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ type: "spring", damping: 15 }}
    >
      <motion.div
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg border-4 border-yellow-600 shadow-lg"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 255, 0, 0.5)',
            '0 0 30px rgba(255, 255, 0, 0.8)',
            '0 0 20px rgba(255, 255, 0, 0.5)'
          ]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <motion.h2
          className="text-sm font-bold text-center tracking-wider"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {instruction}
        </motion.h2>
      </motion.div>
      
      {/* Neon Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur-md opacity-30 -z-10"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.div>
  );
};