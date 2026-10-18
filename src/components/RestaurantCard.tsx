'use client';

import React from 'react';
import {
  Bookmark,
  Coffee,
  Flame,
  Heart,
  MessageCircle,
  Navigation,
  PlusCircle,
  Repeat,
  Share2,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from 'lucide-react';
import { RestaurantWithFriendInsights } from '@/types';

interface RestaurantCardProps {
  restaurant: RestaurantWithFriendInsights;
  onToggleWishlist: (restaurantId: string) => void;
  onShareWhatsApp: (restaurant: RestaurantWithFriendInsights) => void;
  onOpenQuickLog: (restaurant: RestaurantWithFriendInsights) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onToggleWishlist,
  onShareWhatsApp,
  onOpenQuickLog,
}) => {
  const hasRepeat = restaurant.repeatFriendCount > 0;
  const recentNoteVisit = restaurant.friendVisits.find((fv) => fv.note && fv.note.length > 0);

  return (
    <div className="group relative bg-[#121622]/90 border border-white/[0.08] hover:border-orange-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-orange-500/5">
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-950">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover brightness-[0.88] group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-transparent to-black/40" />

        {/* Top Badges: Neighborhood, Price, Dietary Icons */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-tight bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
            {restaurant.neighborhood}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-white/15 shadow-sm">
            {'₹'.repeat(restaurant.priceLevel)}
          </span>

          {restaurant.attributes.isPureVeg && (
            <span
              className="w-6 h-6 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 flex items-center justify-center shadow-sm"
              title="100% Pure Veg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
          )}

          {restaurant.attributes.hasFilterCoffee && (
            <span
              className="w-6 h-6 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-500/40 flex items-center justify-center shadow-sm"
              title="Iconic Filter Coffee"
            >
              <Coffee className="w-3 h-3 text-amber-300" />
            </span>
          )}

          {restaurant.attributes.servesAlcohol && (
            <span
              className="w-6 h-6 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-500/40 flex items-center justify-center shadow-sm"
              title="Craft Cocktails & Drinks"
            >
              <Wine className="w-3 h-3 text-purple-300" />
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(restaurant.id)}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
            restaurant.isWishlistedByCurrentUser
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40'
              : 'bg-black/50 text-white/80 hover:bg-black/70 border border-white/10'
          }`}
          aria-label="Wishlist"
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              restaurant.isWishlistedByCurrentUser ? 'fill-white stroke-white' : ''
            }`}
          />
        </button>

        {/* Repeat Index Floating Badge */}
        {hasRepeat && (
          <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 backdrop-blur-md border border-amber-400/30 text-white shadow-lg shadow-orange-600/30">
            <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200 animate-pulse" />
            <span className="text-[11px] font-black tracking-tight">
              {restaurant.repeatScore}% Friend Return Rate
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 space-y-3.5">
        {/* Title & Distance */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
              {restaurant.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 font-medium">
              {restaurant.cuisine.join(' · ')}
            </p>
          </div>
          {restaurant.distanceKm !== undefined && (
            <div className="flex items-center gap-1 text-[11px] font-mono font-medium text-gray-300 bg-white/[0.06] border border-white/5 px-2.5 py-1 rounded-lg shrink-0">
              <Navigation className="w-3 h-3 text-orange-400" />
              <span>{restaurant.distanceKm} km</span>
            </div>
          )}
        </div>

        {/* Friends Activity Section */}
        {restaurant.friendVisits.length > 0 ? (
          <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-2 overflow-hidden">
                {restaurant.friendVisits.slice(0, 3).map((fv) => (
                  <img
                    key={fv.user.id}
                    src={fv.user.avatar}
                    alt={fv.user.name}
                    title={fv.user.name}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#121622] object-cover"
                  />
                ))}
              </div>
              <div className="text-[11px] font-medium text-gray-300">
                <span className="text-orange-400 font-bold">
                  {restaurant.friendVisits.map((fv) => fv.user.name.split(' ')[0]).join(', ')}
                </span>
                {restaurant.friendVisits.length > 2 && ' & others'} ate here
              </div>
            </div>

            {/* Friend Quote / Note */}
            {recentNoteVisit && (
              <div className="text-xs text-gray-200/90 italic bg-black/25 p-2.5 rounded-xl border-l-2 border-orange-500">
                &ldquo;{recentNoteVisit.note}&rdquo;
                <span className="block not-italic text-[10px] text-gray-400 mt-1 font-semibold font-mono">
                  — {recentNoteVisit.user.name} ({recentNoteVisit.visitCount} visits)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-gray-500 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
            No friends have logged a visit here yet. Be the first!
          </div>
        )}

        {/* Must-Order Dish Highlight */}
        {restaurant.topFriendDish && (
          <div className="flex items-center gap-2 text-xs text-amber-200 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-gray-400">Must Order:</span>
            <span className="font-bold text-amber-300 truncate">
              {restaurant.topFriendDish}
            </span>
          </div>
        )}

        {/* Quick Action Footer */}
        <div className="pt-1 flex items-center gap-2 border-t border-white/[0.06]">
          <button
            onClick={() => onOpenQuickLog(restaurant)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Visit</span>
          </button>

          <button
            onClick={() => onShareWhatsApp(restaurant)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-[0.98] text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
            title="Share with friends on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
