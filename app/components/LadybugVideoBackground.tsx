'use client';

import { useEffect, useRef } from 'react';

export default function LadybugVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 7.58) {
        video.pause();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden"
      style={{
        backgroundColor: '#E8E8E8',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover opacity-35"
        style={{
          pointerEvents: 'none',
        }}
      >
        <source src="/videos/animation1.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
