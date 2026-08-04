'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FeedContainer } from '@/components/FeedContainer';
import { FloatingCamera } from '@/components/FloatingCamera';
import { CameraModal } from '@/components/CameraModal';
import { CommentsDrawer } from '@/components/CommentsDrawer';
import { ShareModal } from '@/components/ShareModal';
import { LocationModal } from '@/components/LocationModal';
import { PotholePost } from '@/types';
import { INITIAL_POSTS } from '@/lib/mockData';
import { subscribeToFirestorePosts } from '@/lib/firebaseClient';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('trending');
  const [posts, setPosts] = useState<PotholePost[]>(INITIAL_POSTS);

  // Modals state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<PotholePost | null>(null);
  const [activeSharePost, setActiveSharePost] = useState<PotholePost | null>(null);

  // Load state from localStorage on client mount & listen to Firebase Firestore
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pothole_kasba_posts');
      if (saved) {
        setPosts(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load local storage posts', e);
    }

    // Real-time Firestore snapshot listener
    const unsubscribe = subscribeToFirestorePosts((remotePosts) => {
      setPosts((prev) => {
        // Merge remote posts prioritizing new ones
        const existingIds = new Set(remotePosts.map((p) => p.id));
        const localOnly = prev.filter((p) => !existingIds.has(p.id));
        return [...remotePosts, ...localOnly];
      });
    });

    return () => unsubscribe();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pothole_kasba_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed to save to local storage', e);
    }
  }, [posts]);

  const handlePostCreated = (newPost: PotholePost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      user: 'Kasba_Citizen',
      text: commentText,
      time: 'Just now',
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const updatedComments = [newComment, ...post.comments];
        return {
          ...post,
          comments: updatedComments,
          commentCount: updatedComments.length,
        };
      })
    );

    // Update active comment modal post
    if (activeCommentPost && activeCommentPost.id === postId) {
      setActiveCommentPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [newComment, ...prev.comments],
              commentCount: prev.commentCount + 1,
            }
          : null
      );
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#090a0f] flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      {/* Main Reels Snap Feed */}
      <FeedContainer
        activeTab={activeTab}
        onOpenComments={(post) => setActiveCommentPost(post)}
        onShare={(post) => setActiveSharePost(post)}
        posts={posts}
        setPosts={setPosts}
      />

      {/* Bottom Center Floating Camera Trigger */}
      <FloatingCamera onOpenCamera={() => setIsCameraOpen(true)} />

      {/* Modals & Drawers */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <CommentsDrawer
        isOpen={!!activeCommentPost}
        post={activeCommentPost}
        onClose={() => setActiveCommentPost(null)}
        onAddComment={handleAddComment}
      />

      <ShareModal
        isOpen={!!activeSharePost}
        post={activeSharePost}
        onClose={() => setActiveSharePost(null)}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </div>
  );
}
