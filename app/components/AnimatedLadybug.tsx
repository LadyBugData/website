'use client';

import { motion } from 'framer-motion';

export default function AnimatedLadybug() {
  return (
    <motion.div
      className="fixed top-20 right-10 text-6xl pointer-events-none"
      animate={{
        x: [0, 50, -50, 0],
        y: [0, -30, 30, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      🐞
    </motion.div>
  );
}
