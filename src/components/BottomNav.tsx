'use client';

import React from 'react';
import { Home, Map, Plus, Users, BookmarkCheck } from 'lucide-react';

export type TabType = 'feed' | 'map' | 'decider' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickLog: () => void;
  wishlistCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickLog,
  wishlistCount,
}) => {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto">
      <div className="bg-[#10141f]/90 backdrop-blur-2xl border border-white/10 rounded-3xl px-5 py-2.5 shadow-2xl shadow-black/80 flex items-center justify-between">
        {/* Feed Tab */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'feed'
              ? 'text-orange-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Feed</span>
        </button>

        {/* Map Tab */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'map'
              ? 'text-orange-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Map className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Map</span>
        </button>

        {/* Center Floating Log Action */}
        <button
          onClick={onOpenQuickLog}
          className="relative -top-3 w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white shadow-xl shadow-orange-600/40 border-2 border-[#10141f] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Log Restaurant Visit"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
          <span className="absolute -inset-1 rounded-2xl bg-orange-500/20 animate-ping -z-10" />
        </button>

        {/* Decider Tab */}
        <button
          onClick={() => onSelectTab('decider')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
            currentTab === 'decider'
              ? 'text-orange-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Users className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Decider</span>
        </button>

        {/* Profile / Saved Tab */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 relative ${
            currentTab === 'profile'
              ? 'text-orange-400 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookmarkCheck className="w-5 h-5 stroke-[2.2]" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[9px] font-mono font-black rounded-full flex items-center justify-center shadow-sm">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] tracking-tight">Saved</span>
        </button>
      </div>
    </nav>
  );
};
