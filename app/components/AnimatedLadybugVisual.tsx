'use client';

import { motion } from 'framer-motion';

export default function AnimatedLadybugVisual() {
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Wing covers (red) */}
        <ellipse cx="120" cy="150" rx="65" ry="95" fill="#E63946" />
        <ellipse cx="280" cy="150" rx="65" ry="95" fill="#E63946" />

        {/* Center line (black) */}
        <line x1="200" y1="80" x2="200" y2="280" stroke="#1A1A1A" strokeWidth="8" />

        {/* Head (black) */}
        <circle cx="200" cy="100" r="35" fill="#1A1A1A" />

        {/* Eyes (white) */}
        <circle cx="185" cy="90" r="8" fill="white" />
        <circle cx="215" cy="90" r="8" fill="white" />

        {/* Antennae (black) */}
        <path d="M 185 70 Q 180 50 175 35" stroke="#1A1A1A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 215 70 Q 220 50 225 35" stroke="#1A1A1A" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Spots on left wing */}
        <circle cx="100" cy="120" r="12" fill="#1A1A1A" />
        <circle cx="120" cy="150" r="12" fill="#1A1A1A" />
        <circle cx="110" cy="190" r="12" fill="#1A1A1A" />
        <circle cx="130" cy="240" r="12" fill="#1A1A1A" />

        {/* Spots on right wing */}
        <circle cx="300" cy="120" r="12" fill="#1A1A1A" />
        <circle cx="280" cy="150" r="12" fill="#1A1A1A" />
        <circle cx="290" cy="190" r="12" fill="#1A1A1A" />
        <circle cx="270" cy="240" r="12" fill="#1A1A1A" />

        {/* Legs */}
        <line x1="180" y1="240" x2="160" y2="280" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
        <line x1="200" y1="250" x2="200" y2="300" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
        <line x1="220" y1="240" x2="240" y2="280" stroke="#1A1A1A" strokeWidth="6" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}
