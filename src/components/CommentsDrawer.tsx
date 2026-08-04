'use client';

import React, { useState } from 'react';
import { X, Send, MessageCircle, User } from 'lucide-react';
import { PotholePost, Comment } from '@/types';

interface CommentsDrawerProps {
  post: PotholePost | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  post,
  isOpen,
  onClose,
  onAddComment,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(post.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Content */}
      <div className="w-full max-w-md mx-auto h-[65vh] bg-slate-900 rounded-t-3xl border-t border-orange-500/30 flex flex-col shadow-2xl overflow-hidden animate-slideUp">
        {/* Sheet Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-white text-base">
              Comments ({post.comments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meme Roast Summary Header */}
        <div className="p-3 bg-slate-950/70 border-b border-gray-800 text-xs text-orange-300 font-semibold italic">
          "{post.memeCaption}"
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {post.comments.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <MessageCircle className="w-10 h-10 text-gray-600 mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-400">No comments yet.</p>
              <p className="text-xs text-gray-500 mt-1">Be the first Kasba resident to comment on this road defect!</p>
            </div>
          ) : (
            post.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-full bg-orange-950 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{c.user}</span>
                    <span className="text-[10px] text-gray-500">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-200 mt-1 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Form (Zero Login) */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-gray-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a Kasba civic comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900 border border-gray-700 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 disabled:opacity-40 font-bold active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
