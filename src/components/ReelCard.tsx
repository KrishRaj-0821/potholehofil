'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  AlertOctagon,
  Maximize2,
  ShieldCheck,
  Flame,
  Heart,
  Ruler,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PotholePost } from '@/types';

interface ReelCardProps {
  post: PotholePost;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onOpenComments: (post: PotholePost) => void;
  onShare: (post: PotholePost) => void;
  onToggleBookmark: (postId: string) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({
  post,
  onVote,
  onOpenComments,
  onShare,
  onToggleBookmark,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [animPos, setAnimPos] = useState({ x: 0, y: 0 });
  const lastTapRef = useRef<number>(0);

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Trigger double tap
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      setAnimPos({ x: clientX, y: clientY });
      setShowHeartAnim(true);
      if (post.userVote !== 'up') {
        onVote(post.id, 'up');
      }

      setTimeout(() => {
        setShowHeartAnim(false);
      }, 900);
    }
    lastTapRef.current = now;
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-600/90 text-white border-red-500 shadow-red-900/50';
      case 'HIGH':
        return 'bg-orange-600/90 text-white border-orange-500 shadow-orange-900/50';
      default:
        return 'bg-amber-600/90 text-white border-amber-500 shadow-amber-900/50';
    }
  };

  return (
    <div
      className="reel-slide relative w-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none"
      onClick={handleDoubleTap}
    >
      {/* Background Image with Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <Image
          src={post.imageUrl}
          alt={post.memeCaption}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 450px"
          className="object-cover object-center"
        />
        {/* Top Vignette */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-950 via-slate-950/60 to-transparent z-10 pointer-events-none" />
        {/* Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Floating Double-Tap Heart Animation */}
      {showHeartAnim && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-pop"
          style={{ left: `${animPos.x}px`, top: `${animPos.y}px` }}
        >
          <div className="p-4 rounded-full bg-orange-600/90 border-2 border-amber-300 shadow-2xl shadow-orange-500/80 flex items-center justify-center">
            <Flame className="w-16 h-16 text-amber-300 animate-bounce fill-amber-300" />
          </div>
        </div>
      )}

      {/* Top Overlay Spatial Metrics Bar */}
      <div className="relative z-20 pt-24 px-4 max-w-md mx-auto w-full flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Severity Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider border shadow-md ${getSeverityBadgeColor(
              post.severity
            )}`}
          >
            <AlertOctagon className="w-4 h-4 animate-pulse" />
            <span>{post.severity} ROAD DEFECT</span>
          </div>

          {/* Location Verification Tag */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{post.location.pin} Verified</span>
          </div>
        </div>

        {/* Spatial Stats Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs text-gray-200">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 font-semibold">
            <Ruler className="w-3.5 h-3.5 text-orange-400" />
            <span>Depth: <strong className="text-amber-300">{post.metrics.depthCm}cm</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 font-semibold">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Area: <strong className="text-cyan-300">{post.metrics.areaSqM}m²</strong></span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 font-semibold">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Count: <strong className="text-rose-300">{post.metrics.count}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Author + Meme Caption + Right Action Bar */}
      <div className="relative z-20 pb-20 px-4 max-w-md mx-auto w-full flex items-end justify-between gap-3">
        {/* Left Info Column */}
        <div className="flex-1 flex flex-col gap-2.5">
          {/* Author Header */}
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 rounded-full border-2 border-orange-500 overflow-hidden shadow-md">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm text-white drop-shadow">
                  {post.author.name}
                </span>
                <span className="text-[11px] text-gray-300 font-medium">
                  {post.author.handle}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-orange-300 font-medium">
                <MapPin className="w-3 h-3 text-orange-400" />
                <span>{post.location.name}</span>
                <span className="text-gray-400">• {post.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Kasba Meme Roast Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-black/80 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Kasba AI Meme Roast</span>
            </div>
            <p className="text-base font-extrabold text-white leading-snug tracking-tight drop-shadow">
              "{post.memeCaption}"
            </p>
            {post.memeSubtext && (
              <p className="text-xs text-gray-300 font-medium italic leading-relaxed">
                {post.memeSubtext}
              </p>
            )}
          </div>

          {/* Hashtags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold text-orange-400/90 bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Vertical Action Buttons */}
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Upvote Button */}
          <button
            onClick={() => onVote(post.id, 'up')}
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                post.userVote === 'up'
                  ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/50 scale-110'
                  : 'bg-slate-900/80 backdrop-blur-md text-gray-200 border border-white/10 hover:bg-slate-800'
              }`}
            >
              <Flame
                className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                  post.userVote === 'up' ? 'fill-white text-white' : 'text-orange-400'
                }`}
              />
            </div>
            <span
              className={`text-xs font-extrabold ${
                post.userVote === 'up' ? 'text-amber-400' : 'text-gray-300'
              }`}
            >
              {post.upvotes}
            </span>
          </button>

          {/* Downvote Button */}
          <button
            onClick={() => onVote(post.id, 'down')}
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                post.userVote === 'down'
                  ? 'bg-red-700 text-white shadow-lg shadow-red-700/50 scale-110'
                  : 'bg-slate-900/80 backdrop-blur-md text-gray-300 border border-white/10 hover:bg-slate-800'
              }`}
            >
              <ThumbsDown
                className={`w-5 h-5 ${
                  post.userVote === 'down' ? 'fill-white text-white' : 'text-gray-400'
                }`}
              />
            </div>
            <span
              className={`text-xs font-bold ${
                post.userVote === 'down' ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              {post.downvotes}
            </span>
          </button>

          {/* Comment Drawer Button */}
          <button
            onClick={() => onOpenComments(post)}
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md text-gray-200 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors">
              <MessageCircle className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-bold text-gray-300">
              {post.commentCount}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(post)}
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900/80 backdrop-blur-md text-gray-200 border border-white/10 flex items-center justify-center hover:bg-slate-800 transition-colors">
              <Share2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-bold text-gray-300">Share</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(post.id)}
            className="group flex flex-col items-center gap-1 active:scale-90 transition-transform"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                post.isBookmarked
                  ? 'bg-amber-500 text-slate-950 font-bold scale-105'
                  : 'bg-slate-900/80 backdrop-blur-md text-gray-400 border border-white/10 hover:bg-slate-800'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${
                  post.isBookmarked ? 'fill-slate-950 text-slate-950' : 'text-gray-300'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
