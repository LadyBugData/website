'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function FlyingLadybug() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show ladybug for 4 seconds, then hide
    const timer = setTimeout(() => setIsVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50"
      initial={{ x: -100, y: 100 }}
      animate={{ x: 'calc(100vw - 120px)', y: 300 }}
      transition={{
        duration: 3.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.5,
      }}
      onAnimationComplete={() => setIsVisible(false)}
    >
      <svg width="100" height="100" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="ladybugGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#E11D48', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#BE123C', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse cx="40" cy="72" rx="22" ry="4" fill="#000" opacity="0.1"/>

        {/* Wing covers (red) */}
        <ellipse cx="25" cy="40" rx="18" ry="28" fill="url(#ladybugGradient)" filter="url(#shadow)"/>
        <ellipse cx="55" cy="40" rx="18" ry="28" fill="url(#ladybugGradient)" filter="url(#shadow)"/>

        {/* Head (black) */}
        <circle cx="40" cy="18" r="12" fill="#1A1A1A" filter="url(#shadow)"/>

        {/* Eyes (white) */}
        <circle cx="35" cy="14" r="2.5" fill="white"/>
        <circle cx="45" cy="14" r="2.5" fill="white"/>

        {/* Antennae */}
        <line x1="37" y1="6" x2="32" y2="-2" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="43" y1="6" x2="48" y2="-2" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>

        {/* Center line (black) */}
        <line x1="40" y1="20" x2="40" y2="65" stroke="#1A1A1A" strokeWidth="3"/>

        {/* Spots left wing */}
        <circle cx="18" cy="28" r="4" fill="#1A1A1A"/>
        <circle cx="25" cy="40" r="4" fill="#1A1A1A"/>
        <circle cx="20" cy="52" r="4" fill="#1A1A1A"/>

        {/* Spots right wing */}
        <circle cx="62" cy="28" r="4" fill="#1A1A1A"/>
        <circle cx="55" cy="40" r="4" fill="#1A1A1A"/>
        <circle cx="60" cy="52" r="4" fill="#1A1A1A"/>

        {/* Legs */}
        <line x1="32" y1="62" x2="22" y2="72" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="40" y1="68" x2="40" y2="78" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
        <line x1="48" y1="62" x2="58" y2="72" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </motion.div>
  );
}
