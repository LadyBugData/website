'use client';

import { motion } from 'framer-motion';

export default function AnimationVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="lg:block hidden rounded-2xl overflow-hidden border-2 border-primary-200 shadow-lg"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-96 object-cover"
      >
        <source src="/videos/animation.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
}
