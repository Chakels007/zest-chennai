'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Phone, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { User } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone'>('google');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        id: 'user_google_live',
        name: 'Ganesh Raman',
        handle: '@ganesh_eats',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Filter coffee snob in Alwarpet, Chennai',
        tasteBio: 'South Indian Tiffin & Specialty Cafes',
        favoriteNeighborhood: 'Alwarpet',
        isCurrentUser: true,
      });
      onClose();
    }, 600);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        id: 'user_phone_live',
        name: 'Verified Chennai Diner',
        handle: `@chennai_${phoneNumber.slice(-4)}`,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: `Dining via +91 ${phoneNumber}`,
        tasteBio: 'Central Chennai Foodie',
        favoriteNeighborhood: 'Central Chennai',
        isCurrentUser: true,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#151922] w-full max-w-sm rounded-3xl border border-gray-800 p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Sign In to Zest</h2>
              <p className="text-[11px] text-gray-400">Join your friends&apos; dining circle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-gray-900 rounded-xl border border-gray-800">
          <button
            onClick={() => setAuthMethod('google')}
            className={`py-1.5 text-xs font-bold rounded-lg transition ${
              authMethod === 'google'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`py-1.5 text-xs font-bold rounded-lg transition ${
              authMethod === 'phone'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            WhatsApp / SMS OTP
          </button>
        </div>

        {authMethod === 'google' ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-gray-300 leading-relaxed text-center">
              Sign in with your Google Account to automatically discover friends already using Zest in Chennai.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isVerifying}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isVerifying ? 'Signing in...' : 'Continue with Google'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Enter Mobile Number (India)
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-400 flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="flex-1 px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={phoneNumber.length < 10}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send OTP via WhatsApp</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
                  OTP sent to +91 {phoneNumber} (Dev code: <strong>1234</strong>)
                </div>

                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  maxLength={4}
                  className="w-full text-center tracking-widest text-lg font-bold px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />

                <button
                  type="submit"
                  disabled={otpCode.length < 4 || isVerifying}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
