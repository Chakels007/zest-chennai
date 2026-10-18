'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { RestaurantWithFriendInsights } from '@/types';

interface WhatsAppShareModalProps {
  restaurant: RestaurantWithFriendInsights | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  restaurant,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !restaurant) return null;

  const shareText = `🍽️ Check out *${restaurant.name}* in ${restaurant.neighborhood}, Chennai!\n\n` +
    (restaurant.repeatFriendCount > 0
      ? `🔥 *${restaurant.repeatScore}%* of our friends returned here!\n`
      : '') +
    `🍴 Must Order: *${restaurant.topFriendDish || restaurant.popularDishes[0]}*\n` +
    `📍 ${restaurant.address}\n\n` +
    `Discovered on Zest Chennai (Friends' Dining Graph)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#151922] w-full max-w-sm rounded-3xl border border-gray-800 p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Share with Friends</h2>
              <p className="text-[11px] text-gray-400">Share via WhatsApp Group</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Bubble */}
        <div className="bg-[#0b141a] p-3 rounded-2xl border border-emerald-900/40 text-xs text-gray-200 font-sans space-y-2">
          <p className="font-bold text-emerald-400">Preview WhatsApp Message:</p>
          <div className="bg-[#1f2c34] p-3 rounded-xl border border-white/5 space-y-1.5 text-[11px] leading-relaxed">
            <p className="font-bold text-white">
              🍽️ Check out {restaurant.name} in {restaurant.neighborhood}, Chennai!
            </p>
            {restaurant.repeatFriendCount > 0 && (
              <p className="text-amber-400">
                🔥 {restaurant.repeatScore}% of our friends returned here!
              </p>
            )}
            <p className="text-gray-300">
              🍴 Must Order: <span className="font-semibold">{restaurant.topFriendDish}</span>
            </p>
            <p className="text-gray-400 text-[10px]">📍 {restaurant.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Open WhatsApp Chat</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
