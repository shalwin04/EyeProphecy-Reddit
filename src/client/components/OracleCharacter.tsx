import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OracleCharacterProps {
  isAwake: boolean;
  isRubbing: boolean;
  mouthOpen: boolean;
  onEyeRub: () => void;
  gameStage: string;
  setMouthPosition: (position: { x: number; y: number }) => void;
}

export const OracleCharacter: React.FC<OracleCharacterProps> = ({
  isAwake,
  isRubbing,
  mouthOpen,
  onEyeRub,
  gameStage,
  setMouthPosition
}) => {
  const mouthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mouthRef.current) {
      const rect = mouthRef.current.getBoundingClientRect();
      const parentRect = mouthRef.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        const x = rect.left - parentRect.left + rect.width / 2;
        const y = rect.top - parentRect.top + rect.height / 2;
        setMouthPosition({ x, y });
      }
    }
  }, [mouthOpen, setMouthPosition]);

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {/* Oracle Head */}
      <motion.div
        className="relative w-48 h-48 bg-gradient-to-b from-pink-300 to-pink-400 rounded-full border-4 border-pink-600"
        animate={{
          scale: isRubbing ? 1.05 : 1,
          y: gameStage === 'sleeping' ? [0, -2, 0] : 0,
        }}
        transition={{
          scale: { duration: 0.1 },
          y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
        }}
      >
        {/* Eyes */}
        <div className="absolute top-16 left-8 right-8 flex justify-between">
          {/* Left Eye */}
          <motion.div
            className={`w-8 h-6 ${isAwake ? 'bg-white' : 'bg-pink-500'} rounded-full border-2 border-gray-800 cursor-pointer relative overflow-hidden`}
            onClick={onEyeRub}
            whileHover={{ scale: 1.1 }}
            animate={{
              scaleY: isAwake ? 1 : 0.3,
              backgroundColor: isRubbing ? '#ff6b6b' : undefined,
            }}
          >
            {isAwake && (
              <motion.div
                className="w-3 h-3 bg-black rounded-full absolute top-1 left-2"
                animate={{
                  x: mouthOpen ? [0, 2, -2, 0] : 0,
                  y: mouthOpen ? [0, -1, 1, 0] : 0,
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            {!isAwake && gameStage === 'sleeping' && (
              <motion.div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-white"
                animate={{ y: [-5, -10, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Z
              </motion.div>
            )}
          </motion.div>

          {/* Right Eye */}
          <motion.div
            className={`w-8 h-6 ${isAwake ? 'bg-white' : 'bg-pink-500'} rounded-full border-2 border-gray-800 cursor-pointer relative overflow-hidden`}
            onClick={onEyeRub}
            whileHover={{ scale: 1.1 }}
            animate={{
              scaleY: isAwake ? 1 : 0.3,
              backgroundColor: isRubbing ? '#ff6b6b' : undefined,
            }}
          >
            {isAwake && (
              <motion.div
                className="w-3 h-3 bg-black rounded-full absolute top-1 left-2"
                animate={{
                  x: mouthOpen ? [0, -2, 2, 0] : 0,
                  y: mouthOpen ? [0, 1, -1, 0] : 0,
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
            {!isAwake && gameStage === 'sleeping' && (
              <motion.div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-white"
                animate={{ y: [-5, -10, -5] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              >
                z
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Nose */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-pink-600 rounded-full border border-pink-700"></div>

        {/* Mouth */}
        <motion.div
          className={`absolute top-32 left-1/2 transform -translate-x-1/2 ${
            mouthOpen ? 'w-12 h-8 bg-black' : 'w-8 h-2 bg-pink-600'
          } rounded-full border-2 border-gray-800 transition-all duration-300`}
          animate={{
            scale: mouthOpen ? [1, 1.1, 1] : 1,
            boxShadow: mouthOpen
              ? [
                  '0 0 0 rgba(255,255,0,0)',
                  '0 0 20px rgba(255,255,0,0.8)',
                  '0 0 0 rgba(255,255,0,0)',
                ]
              : 'none',
          }}
          transition={{
            scale: { repeat: Infinity, duration: 1 },
            boxShadow: { repeat: Infinity, duration: 2 },
          }}
          ref={mouthRef}
        >
          {mouthOpen && (
            <motion.div
              className="absolute inset-1 bg-gradient-to-b from-red-600 to-red-800 rounded-full"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </motion.div>

        {/* Beard/Hair */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-gray-600 rounded-b-full border-2 border-gray-800"></div>

        {/* Oracle Speech */}
        {mouthOpen && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-green-400 px-4 py-2 rounded-lg border-2 border-green-400 text-xs whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            FEED ME, INSECT!
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-400"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Throne/Chair */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-56 h-32 bg-gradient-to-b from-purple-800 to-purple-900 rounded-lg border-4 border-purple-600">
        <div className="absolute top-2 left-2 right-2 h-4 bg-purple-700 rounded border border-purple-500"></div>
        <div className="absolute bottom-2 left-4 right-4 h-6 bg-purple-700 rounded border border-purple-500"></div>
      </div>
    </div>
  );
};
