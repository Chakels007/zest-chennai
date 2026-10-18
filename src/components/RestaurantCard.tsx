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
    <div className="bg-[#151922] border border-gray-800/90 rounded-2xl overflow-hidden shadow-lg transition hover:border-gray-700/80">
      {/* Cover Image & Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-900">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover brightness-90 hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151922] via-transparent to-black/30" />

        {/* Neighborhood Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
            {restaurant.neighborhood}
          </span>
          <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-amber-400 border border-white/10">
            {'₹'.repeat(restaurant.priceLevel)}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(restaurant.id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
            restaurant.isWishlistedByCurrentUser
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-black/50 text-white/80 hover:bg-black/70'
          }`}
          aria-label="Wishlist"
        >
          <Bookmark
            className={`w-4 h-4 ${
              restaurant.isWishlistedByCurrentUser ? 'fill-white' : ''
            }`}
          />
        </button>

        {/* Repeat Index Floating Badge */}
        {hasRepeat && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600/90 backdrop-blur-md border border-orange-400/30 text-white shadow-md">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="text-[11px] font-bold tracking-tight">
              {restaurant.repeatScore}% Friend Return Rate
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 space-y-3">
        {/* Title & Distance */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-white leading-snug">
              {restaurant.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {restaurant.cuisine.join(' · ')}
            </p>
          </div>
          {restaurant.distanceKm !== undefined && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-gray-800/60 px-2 py-0.5 rounded-md shrink-0">
              <Navigation className="w-3 h-3 text-orange-400" />
              <span>{restaurant.distanceKm} km</span>
            </div>
          )}
        </div>

        {/* Friends Activity Section */}
        {restaurant.friendVisits.length > 0 ? (
          <div className="bg-[#1c2230] p-2.5 rounded-xl border border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center -space-x-1.5 overflow-hidden">
                {restaurant.friendVisits.slice(0, 3).map((fv) => (
                  <img
                    key={fv.user.id}
                    src={fv.user.avatar}
                    alt={fv.user.name}
                    title={fv.user.name}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-[#151922] object-cover"
                  />
                ))}
              </div>
              <div className="text-[11px] font-medium text-gray-300">
                <span className="text-orange-400 font-semibold">
                  {restaurant.friendVisits.map((fv) => fv.user.name.split(' ')[0]).join(', ')}
                </span>
                {restaurant.friendVisits.length > 2 && ' & others'} ate here
              </div>
            </div>

            {/* Friend Quote / Note */}
            {recentNoteVisit && (
              <div className="text-xs text-gray-300 italic bg-black/20 p-2 rounded-lg border-l-2 border-orange-500">
                &ldquo;{recentNoteVisit.note}&rdquo;
                <span className="block not-italic text-[10px] text-gray-400 mt-0.5 font-medium">
                  — {recentNoteVisit.user.name} ({recentNoteVisit.visitCount} visits)
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-[11px] text-gray-500 italic bg-gray-800/30 p-2 rounded-lg">
            No friends have logged a visit here yet. Be the first!
          </div>
        )}

        {/* Must-Order Dish Highlight */}
        {restaurant.topFriendDish && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-xl">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-gray-400">Must Order:</span>
            <span className="font-bold text-amber-300 truncate">
              {restaurant.topFriendDish}
            </span>
          </div>
        )}

        {/* Quick Action Footer */}
        <div className="pt-1 flex items-center gap-2 border-t border-gray-800/80">
          <button
            onClick={() => onOpenQuickLog(restaurant)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-orange-600/90 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Visit</span>
          </button>

          <button
            onClick={() => onShareWhatsApp(restaurant)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
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
