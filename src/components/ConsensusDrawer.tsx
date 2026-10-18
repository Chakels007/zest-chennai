'use client';

import React, { useState } from 'react';
import { Sparkles, Users, Check, X, ArrowRight, Copy, Share2 } from 'lucide-react';
import { User, RestaurantWithFriendInsights, Wishlist, GroupConsensusPick } from '@/types';
import { computeGroupConsensus } from '@/lib/recommendation';

interface ConsensusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  friends: User[];
  allRestaurants: RestaurantWithFriendInsights[];
  wishlists: Wishlist[];
  initialNeighborhood?: string;
}

export const ConsensusDrawer: React.FC<ConsensusDrawerProps> = ({
  isOpen,
  onClose,
  friends,
  allRestaurants,
  wishlists,
  initialNeighborhood = 'All',
}) => {
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>(
    friends.slice(0, 3).map((f) => f.id)
  );
  const [targetNeighborhood, setTargetNeighborhood] = useState(initialNeighborhood);
  const [results, setResults] = useState<GroupConsensusPick[] | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleFriend = (id: string) => {
    setSelectedFriendIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleRunConsensus = () => {
    // Include current user + selected friends
    const userIds = ['user_me', ...selectedFriendIds];
    const picks = computeGroupConsensus(
      userIds,
      allRestaurants,
      wishlists,
      targetNeighborhood
    );
    setResults(picks);
  };

  const generateWhatsAppMessage = () => {
    if (!results || results.length === 0) return '';
    const names = friends
      .filter((f) => selectedFriendIds.includes(f.id))
      .map((f) => f.name.split(' ')[0])
      .join(', ');

    let msg = `🍽️ *Friday Night Decider (Chennai)* for ${names} & Me:\n\n`;
    results.forEach((pick, index) => {
      msg += `${index + 1}. *${pick.restaurant.name}* (${pick.restaurant.neighborhood})\n`;
      msg += `   🍴 Must Order: ${pick.restaurant.topFriendDish}\n`;
      msg += `   ✨ Why: ${pick.reasons[0] || 'High group match'}\n\n`;
    });
    msg += `Decided via Zest Chennai! Where are we heading?`;
    return msg;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#151922] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-gray-800 p-5 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Friday Night Decider</h2>
              <p className="text-[11px] text-gray-400">Zero group-chat debates. 100% consensus.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Friend Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Who is dining out tonight?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {friends.map((friend) => {
              const isSelected = selectedFriendIds.includes(friend.id);
              return (
                <button
                  key={friend.id}
                  type="button"
                  onClick={() => toggleFriend(friend.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition ${
                    isSelected
                      ? 'bg-orange-500/20 border-orange-500/80 text-white shadow-md'
                      : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold leading-tight">{friend.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-gray-400 truncate">{friend.favoriteNeighborhood}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Neighborhood Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Target Neighborhood
          </label>
          <select
            value={targetNeighborhood}
            onChange={(e) => setTargetNeighborhood(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
          >
            <option value="All">Any Central Chennai zone</option>
            <option value="Alwarpet">Alwarpet &amp; Poes Garden</option>
            <option value="Nungambakkam">Nungambakkam &amp; KNK</option>
            <option value="Mylapore">Mylapore</option>
            <option value="T. Nagar">T. Nagar</option>
          </select>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunConsensus}
          className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Calculate Group Matches</span>
        </button>

        {/* Results */}
        {results && (
          <div className="pt-2 border-t border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Top 3 Optimal Picks
              </span>
              <button
                onClick={handleCopyWhatsApp}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to WhatsApp'}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {results.map((pick, i) => (
                <div
                  key={pick.restaurant.id}
                  className="p-3 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 font-black text-xs flex items-center justify-center">
                        {i + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {pick.restaurant.name}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-400">
                      {pick.restaurant.neighborhood}
                    </span>
                  </div>

                  <p className="text-xs text-amber-300/90 font-medium">
                    🍴 Must Order: {pick.restaurant.topFriendDish}
                  </p>

                  <div className="space-y-0.5">
                    {pick.reasons.map((r, ri) => (
                      <p key={ri} className="text-[11px] text-gray-300">
                        • {r}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
