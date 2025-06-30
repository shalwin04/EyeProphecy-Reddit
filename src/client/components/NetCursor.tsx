import React from 'react';
import { motion } from 'framer-motion';

interface NetCursorProps {
  position: { x: number; y: number };
}

export const NetCursor: React.FC<NetCursorProps> = ({ position }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x - 25,
        top: position.y - 25,
      }}
      animate={{
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        rotate: { repeat: Infinity, duration: 2 },
        scale: { repeat: Infinity, duration: 1 }
      }}
    >
      {/* Net Handle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full border border-amber-900"></div>
      
      {/* Net Rim */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-gray-600 rounded-full bg-transparent">
        {/* Net Mesh */}
        <div className="absolute inset-1 grid grid-cols-4 grid-rows-4 gap-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-400 opacity-60"
              style={{ borderWidth: '0.5px' }}
            />
          ))}
        </div>
      </div>
      
      {/* Net Shadow */}
      <motion.div
        className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-black opacity-20 rounded-full blur-sm"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
    </motion.div>
  );
};