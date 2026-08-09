'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LadybugVideoAnimation() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Video plays for ~4 seconds then hides
    const timer = setTimeout(() => setIsVisible(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 will-change-transform"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <video
        autoPlay
        muted
        playsInline
        className="w-screen h-screen object-cover"
        style={{
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
        onEnded={() => setIsVisible(false)}
      >
        <source src="/videos/animation1.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
}
