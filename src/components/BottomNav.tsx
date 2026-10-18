'use client';

import React from 'react';
import { Home, Map, Plus, Users, Compass, BookmarkCheck } from 'lucide-react';

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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f12]/95 backdrop-blur-xl border-t border-gray-800/80 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Feed Tab */}
        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'feed' ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Feed</span>
        </button>

        {/* Map Tab */}
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'map' ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Map</span>
        </button>

        {/* Center Log Button */}
        <button
          onClick={onOpenQuickLog}
          className="relative -top-4 w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-xl shadow-orange-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition"
          aria-label="Log Restaurant Visit"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Decider Tab */}
        <button
          onClick={() => onSelectTab('decider')}
          className={`flex flex-col items-center gap-1 transition ${
            currentTab === 'decider' ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Decider</span>
        </button>

        {/* Profile / Circles Tab */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 transition relative ${
            currentTab === 'profile' ? 'text-orange-400' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-semibold">Saved</span>
        </button>
      </div>
    </nav>
  );
};
