'use client';

import React from 'react';
import { MapPin, Search, Sparkles, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface HeaderProps {
  selectedNeighborhood: string;
  onSelectNeighborhood: (neighborhood: string) => void;
  currentUser: User;
  onOpenAuth: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const NEIGHBORHOODS = ['All', 'Alwarpet', 'Nungambakkam', 'Mylapore', 'T. Nagar'];

export const Header: React.FC<HeaderProps> = ({
  selectedNeighborhood,
  onSelectNeighborhood,
  currentUser,
  onOpenAuth,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0d0f12]/90 backdrop-blur-md border-b border-gray-800/80 px-4 py-3">
      {/* Top row: Brand & Profile */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white">ZEST</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                CHENNAI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 -mt-0.5">Friends&apos; Taste Graph</p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-gray-800/70 border border-gray-700/60 hover:border-gray-600 transition"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-orange-500/50"
          />
          <span className="text-xs font-medium text-gray-200 hidden sm:inline">
            {currentUser.name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-2.5">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Central Chennai spots or dishes (e.g. Benne Dosa, Gin)..."
          className="w-full pl-9 pr-4 py-2 bg-gray-900/90 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition"
        />
      </div>

      {/* Neighborhood Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium pl-0.5 pr-1 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>Zone:</span>
        </div>
        {NEIGHBORHOODS.map((nh) => {
          const isActive = selectedNeighborhood === nh;
          return (
            <button
              key={nh}
              onClick={() => onSelectNeighborhood(nh)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {nh}
            </button>
          );
        })}
      </div>
    </header>
  );
};
