'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, Twitter, Download } from 'lucide-react';
import { PotholePost } from '@/types';

interface ShareModalProps {
  post: PotholePost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const shareText = `🚨 Kasba (854330) Pothole Roast:\n"${post.memeCaption}"\n📍 ${post.location.name}\nCheck on PotholeHofile PWA!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://potholehofile.vercel.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PotholeHofile Kasba (854330)',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Share cancelled or unavailable');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-orange-500/30 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-white text-base">Share Kasba Roast</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview snippet */}
        <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs text-gray-200">
          <p className="font-bold text-orange-400 mb-1">📍 {post.location.name}</p>
          <p className="italic">"{post.memeCaption}"</p>
        </div>

        {/* Share Action Grid */}
        <div className="grid grid-cols-3 gap-3 my-1">
          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition-all active:scale-95"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs font-bold">WhatsApp</span>
          </button>

          <button
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-orange-950/60 border border-orange-500/40 text-orange-400 hover:bg-orange-900/60 transition-all active:scale-95"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-xs font-bold">System Share</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-900/60 transition-all active:scale-95"
          >
            {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
            <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
