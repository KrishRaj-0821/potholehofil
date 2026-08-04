'use client';

import React, { useState, useEffect } from 'react';
import { ReelCard } from './ReelCard';
import { PotholePost } from '@/types';
import { INITIAL_POSTS } from '@/lib/mockData';

interface FeedContainerProps {
  activeTab: string;
  onOpenComments: (post: PotholePost) => void;
  onShare: (post: PotholePost) => void;
  posts: PotholePost[];
  setPosts: React.Dispatch<React.SetStateAction<PotholePost[]>>;
}

export const FeedContainer: React.FC<FeedContainerProps> = ({
  activeTab,
  onOpenComments,
  onShare,
  posts,
  setPosts,
}) => {

  // Zero-login vote handler with localStorage persist
  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newVote: 'up' | 'down' | null = voteType;

        if (post.userVote === voteType) {
          // Toggle off
          newVote = null;
          if (voteType === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (voteType === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          // Switching or first time
          if (post.userVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
          if (post.userVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);

          if (voteType === 'up') newUpvotes += 1;
          if (voteType === 'down') newDownvotes += 1;
        }

        return {
          ...post,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newVote,
        };
      })
    );
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
    );
  };

  // Filter posts based on activeTab
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'critical') return post.severity === 'CRITICAL';
    if (activeTab === 'recent') return true;
    return true; // default trending
  });

  return (
    <main className="reel-container w-full max-w-md mx-auto relative bg-slate-950 no-scrollbar">
      {filteredPosts.length === 0 ? (
        <div className="h-[100dvh] flex flex-col items-center justify-center p-6 text-center text-gray-400">
          <p className="text-base font-bold text-white mb-1">No posts found in this filter.</p>
          <p className="text-xs">Switch filters or use the camera below to submit a Kasba road report!</p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <ReelCard
            key={post.id}
            post={post}
            onVote={handleVote}
            onOpenComments={onOpenComments}
            onShare={onShare}
            onToggleBookmark={handleToggleBookmark}
          />
        ))
      )}
    </main>
  );
};
