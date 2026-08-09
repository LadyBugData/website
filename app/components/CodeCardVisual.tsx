'use client';

import { motion } from 'framer-motion';

export default function CodeCardVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: -60 }}
      transition={{ 
        duration: 0.8, 
        delay: 8.5
      }}
      className="w-full max-w-md bg-ladybug-dark text-white rounded-2xl overflow-hidden shadow-2xl will-change-transform scale-75 origin-top-right ml-auto"
    >
      {/* Window Header */}
      <div className="bg-gradient-to-r from-ladybug-dark to-slate-800 px-6 py-3 flex items-center gap-3 border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-slate-400 font-mono ml-3">LadybugData.tsx</span>
      </div>

      {/* Code Content */}
      <div className="p-5 font-mono text-xs leading-relaxed">
        <div className="text-slate-400">
          <span className="text-pink-400">const</span> {' '}
          <span className="text-blue-400">solution</span> = {'{'}
        </div>
        
        <div className="text-slate-400 ml-3">
          <span className="text-purple-400">intelligence</span>: <span className="text-green-400">'AI-powered'</span>,
        </div>

        <div className="text-slate-400 ml-3">
          <span className="text-purple-400">speed</span>: <span className="text-green-400">'lightning-fast'</span>,
        </div>

        <div className="text-slate-400 ml-3">
          <span className="text-purple-400">reliability</span>: <span className="text-green-400">'enterprise-grade'</span>,
        </div>

        <div className="text-slate-400">
          {'}'};
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="text-slate-400">
            <span className="text-pink-400">export</span> {' '}
            <span className="text-blue-400">LadybugData</span>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-ladybug-crimson via-pink-500 to-transparent"></div>
    </motion.div>
  );
}
