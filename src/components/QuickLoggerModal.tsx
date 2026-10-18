'use client';

import React, { useState } from 'react';
import { X, Flame, ThumbsUp, ThumbsDown, Check, Sparkles, Utensils } from 'lucide-react';
import { Restaurant, Sentiment } from '@/types';

interface QuickLoggerModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveVisit: (visitData: {
    restaurantId: string;
    sentiment: Sentiment;
    topDishes: string[];
    vibeTags: string[];
    note: string;
  }) => void;
}

const COMMON_VIBES = [
  '☕ Coffee & Work',
  '🍷 Date Night',
  '🎉 Weekend Gang',
  '🌿 Pure Veg',
  '🐶 Pet Friendly',
  '🌙 Late Night',
];

export const QuickLoggerModal: React.FC<QuickLoggerModalProps> = ({
  restaurant,
  isOpen,
  onClose,
  onSaveVisit,
}) => {
  const [sentiment, setSentiment] = useState<Sentiment>('LOVED_REPEAT');
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [customDish, setCustomDish] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [note, setNote] = useState('');

  if (!isOpen || !restaurant) return null;

  const toggleDish = (dish: string) => {
    setSelectedDishes((prev) =>
      prev.includes(dish) ? prev.filter((d) => d !== dish) : [...prev, dish]
    );
  };

  const handleAddCustomDish = () => {
    if (customDish.trim() && !selectedDishes.includes(customDish.trim())) {
      setSelectedDishes((prev) => [...prev, customDish.trim()]);
      setCustomDish('');
    }
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveVisit({
      restaurantId: restaurant.id,
      sentiment,
      topDishes: selectedDishes.length > 0 ? selectedDishes : [restaurant.popularDishes[0]],
      vibeTags: selectedVibes,
      note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#151922] w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-gray-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-orange-400 uppercase">
              10-Second Micro Log
            </span>
            <h2 className="text-lg font-black text-white">{restaurant.name}</h2>
            <p className="text-xs text-gray-400">{restaurant.neighborhood}, Chennai</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Would you return? */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              1. Would you return to {restaurant.name.split(' ')[0]}?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSentiment('LOVED_REPEAT')}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 border text-xs font-bold transition ${
                  sentiment === 'LOVED_REPEAT'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md'
                    : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <Flame className="w-5 h-5 text-orange-500" />
                <span>Loved &amp; Repeat</span>
              </button>

              <button
                type="button"
                onClick={() => setSentiment('GOOD_ONCE')}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 border text-xs font-bold transition ${
                  sentiment === 'GOOD_ONCE'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-md'
                    : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <ThumbsUp className="w-5 h-5 text-blue-400" />
                <span>Good Once</span>
              </button>

              <button
                type="button"
                onClick={() => setSentiment('SKIP')}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 border text-xs font-bold transition ${
                  sentiment === 'SKIP'
                    ? 'bg-red-500/20 border-red-500 text-red-400 shadow-md'
                    : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:bg-gray-800'
                }`}
              >
                <ThumbsDown className="w-5 h-5 text-red-400" />
                <span>Skip / Overrated</span>
              </button>
            </div>
          </div>

          {/* Step 2: Must Order Dish */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              2. What should your friends definitely order here?
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {restaurant.popularDishes.map((dish) => {
                const isSelected = selectedDishes.includes(dish);
                return (
                  <button
                    key={dish}
                    type="button"
                    onClick={() => toggleDish(dish)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {dish}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDish}
                onChange={(e) => setCustomDish(e.target.value)}
                placeholder="Or add another dish..."
                className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddCustomDish}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Step 3: Vibe Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              3. Vibe Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_VIBES.map((vibe) => {
                const isSelected = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                        : 'bg-gray-800/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: 1-line note */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              4. One-line advice for your friends (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Go before 9 AM on Sunday, parking is tight..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Publish to Friends&apos; Map</span>
          </button>
        </form>
      </div>
    </div>
  );
};
