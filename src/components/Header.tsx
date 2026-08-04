'use client';

import React from 'react';
import { MapPin, Flame, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenLocation,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-2 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-red-500 to-amber-400 p-[2px] shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                P
              </span>
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-none tracking-tight text-white flex items-center gap-1">
              Pothole<span className="text-orange-500">Hofile</span>
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            </h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
              Kasba Road Roast PWA
            </p>
          </div>
        </div>

        {/* Location Badge (Kasba - 854330) */}
        <button
          onClick={onOpenLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/40 text-orange-400 hover:text-orange-300 transition-all hover:scale-105 shadow-md shadow-orange-950/40 active:scale-95"
          title="Click to check Kasba geofence status"
        >
          <MapPin className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
          <span className="text-xs font-bold tracking-wide">Kasba - 854330</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-md mx-auto mt-2.5 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'trending'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20 font-bold scale-105'
              : 'bg-slate-900/70 text-gray-300 border border-gray-800 hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>🔥 Viral Roasts</span>
        </button>

        <button
          onClick={() => setActiveTab('critical')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'critical'
              ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-600/30 font-bold scale-105'
              : 'bg-slate-900/70 text-gray-300 border border-gray-800 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>⚠️ Critical (20cm+)</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'recent'
              ? 'bg-slate-100 text-slate-950 shadow-md font-bold scale-105'
              : 'bg-slate-900/70 text-gray-300 border border-gray-800 hover:bg-slate-800'
          }`}
        >
          <span>⏱️ Fresh Reports</span>
        </button>
      </div>
    </header>
  );
};
