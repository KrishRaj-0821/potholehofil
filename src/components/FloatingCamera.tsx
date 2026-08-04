'use client';

import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface FloatingCameraProps {
  onOpenCamera: () => void;
}

export const FloatingCamera: React.FC<FloatingCameraProps> = ({ onOpenCamera }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
      <button
        onClick={onOpenCamera}
        className="group relative flex items-center justify-center p-1.5 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 shadow-2xl shadow-orange-500/60 transition-transform active:scale-90 hover:scale-105 animate-pulse-glow"
        title="Open Live Camera & AR Scanner"
      >
        {/* Outer Ring Animation */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-300 opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></span>

        {/* Inner Button Content */}
        <div className="relative w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center border-2 border-amber-400/80">
          <Camera className="w-7 h-7 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
          <Sparkles className="w-3.5 h-3.5 text-orange-400 absolute top-2 right-2 animate-ping" />
        </div>
      </button>

      {/* Floating Tagline */}
      <span className="mt-1 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-orange-500/40 text-[10px] font-extrabold text-orange-300 tracking-wider shadow-lg flex items-center gap-1">
        <span>📸 ROAST POTHOLE</span>
      </span>
    </div>
  );
};
