'use client';

import React from 'react';
import { MapPin, Search, Sparkles } from 'lucide-react';
import { User } from '@/types';

interface HeaderProps {
  selectedNeighborhood: string;
  onSelectNeighborhood: (neighborhood: string) => void;
  currentUser: User;
  onOpenAuth: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const NEIGHBORHOODS = ['All', 'Alwarpet', 'Nungambakkam', 'Mylapore', 'T. Nagar', 'Besant Nagar', 'Anna Nagar', 'ECR'];

export const Header: React.FC<HeaderProps> = ({
  selectedNeighborhood,
  onSelectNeighborhood,
  currentUser,
  onOpenAuth,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur-xl border-b border-white/[0.07] px-4 pt-3.5 pb-3 space-y-3">
      {/* Top row: Brand & Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 border border-white/20">
            <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">ZEST</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                CHENNAI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium -mt-0.5">Friends&apos; Taste Graph</p>
          </div>
        </div>

        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all active:scale-95 shadow-sm"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-6 h-6 rounded-full object-cover ring-2 ring-orange-500/60"
          />
          <span className="text-xs font-semibold text-gray-200 hidden sm:inline">
            {currentUser.name.split(' ')[0]}
          </span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Central Chennai spots or dishes (e.g. Benne Dosa, Gin)..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/70 focus:bg-white/[0.07] transition-all"
        />
      </div>

      {/* Neighborhood Zone Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-semibold pl-0.5 pr-1 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>Zone:</span>
        </div>
        {NEIGHBORHOODS.map((nh) => {
          const isActive = selectedNeighborhood === nh;
          return (
            <button
              key={nh}
              onClick={() => onSelectNeighborhood(nh)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30 border border-amber-400/30'
                  : 'bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] border border-white/[0.06]'
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
