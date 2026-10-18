'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  CURRENT_USER,
  MOCK_FRIENDS,
  CHENNAI_RESTAURANTS,
  SEED_VISITS,
  INITIAL_WISHLISTS,
} from '@/data/centralChennaiSeed';
import { enrichRestaurantsWithInsights } from '@/lib/recommendation';
import { RestaurantWithFriendInsights, Sentiment, User, Visit, Wishlist } from '@/types';
import { Header } from '@/components/Header';
import { RestaurantCard } from '@/components/RestaurantCard';
import { BottomNav, TabType } from '@/components/BottomNav';
import { QuickLoggerModal } from '@/components/QuickLoggerModal';
import { ConsensusDrawer } from '@/components/ConsensusDrawer';
import { AuthModal } from '@/components/AuthModal';
import { WhatsAppShareModal } from '@/components/WhatsAppShareModal';
import {
  Flame,
  Sparkles,
  Users,
  Compass,
  Bookmark,
  Share2,
  Coffee,
  Leaf,
  Wine,
  Filter,
} from 'lucide-react';

// Dynamic import for Leaflet map to disable SSR
const MapView = dynamic(
  () => import('@/components/MapView').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[65vh] rounded-2xl bg-gray-900 flex items-center justify-center text-gray-500 text-xs">
        Loading Chennai interactive map...
      </div>
    ),
  }
);

type FilterVibe = 'ALL' | 'REPEAT' | 'COFFEE' | 'PURE_VEG' | 'BAR';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [activeVibe, setActiveVibe] = useState<FilterVibe>('ALL');

  // App state
  const [visits, setVisits] = useState<Visit[]>(SEED_VISITS);
  const [wishlists, setWishlists] = useState<Wishlist[]>(INITIAL_WISHLISTS);

  // Modals state
  const [quickLogTarget, setQuickLogTarget] = useState<RestaurantWithFriendInsights | null>(null);
  const [shareTarget, setShareTarget] = useState<RestaurantWithFriendInsights | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDeciderOpen, setIsDeciderOpen] = useState(false);

  // Enriched restaurants
  const enrichedRestaurants = useMemo(() => {
    return enrichRestaurantsWithInsights(
      CHENNAI_RESTAURANTS,
      visits,
      [...MOCK_FRIENDS, currentUser],
      wishlists,
      currentUser.id
    );
  }, [visits, wishlists, currentUser]);

  // Filtered restaurants for Feed & Map
  const filteredRestaurants = useMemo(() => {
    return enrichedRestaurants.filter((r) => {
      // Neighborhood filter
      if (selectedNeighborhood !== 'All' && r.neighborhood !== selectedNeighborhood) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(query);
        const matchesCuisine = r.cuisine.some((c) => c.toLowerCase().includes(query));
        const matchesDish =
          r.popularDishes.some((d) => d.toLowerCase().includes(query)) ||
          (r.topFriendDish && r.topFriendDish.toLowerCase().includes(query));
        if (!matchesName && !matchesCuisine && !matchesDish) return false;
      }

      // Vibe filter
      if (activeVibe === 'REPEAT' && r.repeatFriendCount === 0) return false;
      if (activeVibe === 'COFFEE' && !r.attributes.hasSpecialtyCoffee && !r.attributes.hasFilterCoffee) return false;
      if (activeVibe === 'PURE_VEG' && !r.attributes.isPureVeg) return false;
      if (activeVibe === 'BAR' && !r.attributes.servesAlcohol) return false;

      return true;
    });
  }, [enrichedRestaurants, selectedNeighborhood, searchQuery, activeVibe]);

  // Wishlisted restaurants
  const savedRestaurants = useMemo(() => {
    return enrichedRestaurants.filter((r) => r.isWishlistedByCurrentUser);
  }, [enrichedRestaurants]);

  // Handlers
  const handleToggleWishlist = (restaurantId: string) => {
    setWishlists((prev) => {
      const exists = prev.some(
        (w) => w.userId === currentUser.id && w.restaurantId === restaurantId
      );
      if (exists) {
        return prev.filter(
          (w) => !(w.userId === currentUser.id && w.restaurantId === restaurantId)
        );
      } else {
        return [
          ...prev,
          {
            userId: currentUser.id,
            restaurantId,
            createdAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const handleSaveVisit = (data: {
    restaurantId: string;
    sentiment: Sentiment;
    topDishes: string[];
    vibeTags: string[];
    note: string;
  }) => {
    const newVisit: Visit = {
      id: `visit_${Date.now()}`,
      userId: currentUser.id,
      restaurantId: data.restaurantId,
      sentiment: data.sentiment,
      visitCount: data.sentiment === 'LOVED_REPEAT' ? 2 : 1,
      topDishes: data.topDishes,
      vibeTags: data.vibeTags,
      note: data.note,
      createdAt: new Date().toISOString(),
    };
    setVisits((prev) => [newVisit, ...prev]);
  };

  const handleOpenQuickLog = (target?: RestaurantWithFriendInsights) => {
    if (target) {
      setQuickLogTarget(target);
    } else {
      // Pick first restaurant as default if none supplied
      setQuickLogTarget(filteredRestaurants[0] || enrichedRestaurants[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex justify-center pb-28 select-none">
      {/* Mobile Screen Shell (Constrained for clean mobile-first view) */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#090a0f] shadow-2xl relative border-x border-white/[0.06]">
        {/* Header */}
        <Header
          selectedNeighborhood={selectedNeighborhood}
          onSelectNeighborhood={setSelectedNeighborhood}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Subheader Filter Bar */}
        <div className="px-4 py-2 border-b border-gray-800/60 bg-[#0d0f12]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveVibe('ALL')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition ${
              activeVibe === 'ALL'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setActiveVibe('REPEAT')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition ${
              activeVibe === 'REPEAT'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>High Repeat</span>
          </button>
          <button
            onClick={() => setActiveVibe('COFFEE')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition ${
              activeVibe === 'COFFEE'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Coffee className="w-3 h-3 text-amber-400" />
            <span>Coffee &amp; Cafes</span>
          </button>
          <button
            onClick={() => setActiveVibe('PURE_VEG')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition ${
              activeVibe === 'PURE_VEG'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span>Pure Veg</span>
          </button>
          <button
            onClick={() => setActiveVibe('BAR')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition ${
              activeVibe === 'BAR'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Wine className="w-3 h-3 text-purple-400" />
            <span>Bars</span>
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4">
          {/* TAB 1: FEED */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              {/* Social Insight Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-gray-900 to-gray-900 border border-orange-500/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Chennai Inner Circle</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {MOCK_FRIENDS.length} friends logged {visits.length} verified dining visits
                  </p>
                </div>
                <button
                  onClick={() => setIsDeciderOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold border border-orange-500/30 transition flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Decider</span>
                </button>
              </div>

              {/* Restaurant List */}
              {filteredRestaurants.length > 0 ? (
                <div className="space-y-4">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onToggleWishlist={handleToggleWishlist}
                      onShareWhatsApp={(r) => setShareTarget(r)}
                      onOpenQuickLog={(r) => handleOpenQuickLog(r)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 space-y-2">
                  <p className="text-sm font-semibold text-gray-400">No restaurants match your filter.</p>
                  <p className="text-xs text-gray-500">Try changing the neighborhood or search query.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MAP */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              <MapView
                restaurants={filteredRestaurants}
                selectedNeighborhood={selectedNeighborhood}
                onSelectRestaurant={(r) => handleOpenQuickLog(r)}
              />
              <p className="text-[11px] text-gray-400 text-center">
                Tap on any pin (🔥 indicates places friends repeatedly return to)
              </p>
            </div>
          )}

          {/* TAB 3: DECIDER */}
          {activeTab === 'decider' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-white">Friday Night Consensus Engine</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Overlaps your friends&apos; wishlists, repeat visit histories, and vetoes to pick where you should eat tonight.
                </p>
              </div>
              <button
                onClick={() => setIsDeciderOpen(true)}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 hover:brightness-110 transition"
              >
                Launch Decider Wizard
              </button>
            </div>
          )}

          {/* TAB 4: SAVED / PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* User Bio Header */}
              <div className="p-4 rounded-2xl bg-[#151922] border border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-500/40"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{currentUser.name}</h3>
                    <p className="text-xs text-gray-400">{currentUser.handle} · {currentUser.favoriteNeighborhood}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 italic">&ldquo;{currentUser.bio}&rdquo;</p>
                <div className="flex items-center gap-4 pt-2 border-t border-gray-800 text-xs">
                  <div>
                    <span className="font-bold text-white">{savedRestaurants.length}</span>
                    <span className="text-gray-400 ml-1">Saved</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">
                      {visits.filter((v) => v.userId === currentUser.id).length}
                    </span>
                    <span className="text-gray-400 ml-1">Logged Visits</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">{MOCK_FRIENDS.length}</span>
                    <span className="text-gray-400 ml-1">Friends</span>
                  </div>
                </div>
              </div>

              {/* Saved Wishlist Spots */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                  My Chennai Wishlist ({savedRestaurants.length})
                </h4>
                {savedRestaurants.length > 0 ? (
                  <div className="space-y-3">
                    {savedRestaurants.map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        onToggleWishlist={handleToggleWishlist}
                        onShareWhatsApp={(r) => setShareTarget(r)}
                        onOpenQuickLog={(r) => handleOpenQuickLog(r)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 text-center space-y-1">
                    <Bookmark className="w-6 h-6 text-gray-600 mx-auto" />
                    <p className="text-xs text-gray-400">No saved spots yet.</p>
                    <p className="text-[11px] text-gray-500">Tap the bookmark icon on any restaurant to save it.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Fixed Mobile Bottom Dock */}
        <BottomNav
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenQuickLog={() => handleOpenQuickLog()}
          wishlistCount={savedRestaurants.length}
        />

        {/* Modals */}
        <QuickLoggerModal
          restaurant={quickLogTarget}
          isOpen={!!quickLogTarget}
          onClose={() => setQuickLogTarget(null)}
          onSaveVisit={handleSaveVisit}
        />

        <WhatsAppShareModal
          restaurant={shareTarget}
          isOpen={!!shareTarget}
          onClose={() => setShareTarget(null)}
        />

        <ConsensusDrawer
          isOpen={isDeciderOpen}
          onClose={() => setIsDeciderOpen(false)}
          friends={MOCK_FRIENDS}
          allRestaurants={enrichedRestaurants}
          wishlists={wishlists}
          initialNeighborhood={selectedNeighborhood}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={currentUser}
          onLoginSuccess={(u) => setCurrentUser(u)}
        />
      </div>
    </div>
  );
}
