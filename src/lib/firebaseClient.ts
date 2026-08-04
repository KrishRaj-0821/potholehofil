import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { geohashForLocation } from 'geofire-common';
import { PotholePost } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'placeholder-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'potholehofil.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'potholehofil',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'potholehofil.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:abcdef',
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);

/**
 * Upload Base64 Image to Firebase Storage and return Public Download URL
 */
export async function uploadImageToFirebaseStorage(
  imageBase64: string,
  fileName: string = `potholes/${Date.now()}.jpg`
): Promise<string> {
  try {
    // Standardize data URL if necessary
    const formattedDataUrl = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const storageRef = ref(storage, fileName);
    await uploadString(storageRef, formattedDataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (err) {
    console.warn('Firebase Storage upload warning (using base64 fallback):', err);
    return imageBase64;
  }
}

/**
 * Sync Pothole Post to Cloud Firestore with Geohash location indexing
 */
export async function syncPostToFirestore(post: PotholePost): Promise<boolean> {
  try {
    const lat = post.location.lat || 25.8452;
    const lng = post.location.lng || 87.5341;
    const geoHash = geohashForLocation([lat, lng]);

    // Optional Storage Upload if image is inline Base64
    let finalImageUrl = post.imageUrl;
    if (post.imageUrl.startsWith('data:image')) {
      finalImageUrl = await uploadImageToFirebaseStorage(post.imageUrl, `potholes/${post.id}.jpg`);
    }

    const postDocRef = doc(db, 'pothole_posts', post.id);
    await setDoc(postDocRef, {
      ...post,
      imageUrl: finalImageUrl,
      geoHash,
      coordinates: { lat, lng },
      createdAtServer: serverTimestamp(),
      upvotes: post.upvotes || 1,
      downvotes: post.downvotes || 0,
    });

    console.log('Post synced successfully to Firestore:', post.id);
    return true;
  } catch (err) {
    console.error('Error syncing post to Firestore:', err);
    return false;
  }
}

/**
 * Real-time subscription listener for main Pothole Reel Feed
 */
export function subscribeToFirestorePosts(
  onPostsUpdate: (posts: PotholePost[]) => void
) {
  try {
    const postsQuery = query(
      collection(db, 'pothole_posts'),
      orderBy('createdAtServer', 'desc'),
      limit(20)
    );

    return onSnapshot(
      postsQuery,
      (snapshot) => {
        const fetchedPosts: PotholePost[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            author: data.author || {
              name: 'Kasba Resident',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
              handle: '@kasba_reporter',
            },
            location: data.location || {
              name: 'Kasba Road, Ward 2',
              pin: '854330',
              distance: '0.5 km away',
              verified: true,
              lat: 25.8452,
              lng: 87.5341,
            },
            imageUrl: data.imageUrl,
            memeCaption: data.memeCaption,
            memeSubtext: data.memeSubtext,
            severity: data.severity || 'HIGH',
            metrics: data.metrics || { depthCm: 15, areaSqM: 0.4, count: 1 },
            upvotes: data.upvotes || 1,
            downvotes: data.downvotes || 0,
            commentCount: data.commentCount || 0,
            createdAt: 'Recently',
            tags: data.tags || ['Kasba854330', 'AI_Verified'],
            userVote: data.userVote,
            comments: data.comments || [],
          };
        });

        if (fetchedPosts.length > 0) {
          onPostsUpdate(fetchedPosts);
        }
      },
      (error) => {
        console.warn('Firestore subscription notice (using active state):', error);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore listener:', err);
    return () => {};
  }
}

/**
 * Handle Upvote / Downvote transactions in Firestore
 */
export async function votePotholeInFirestore(
  postId: string,
  voteType: 'up' | 'down'
): Promise<boolean> {
  try {
    const postRef = doc(db, 'pothole_posts', postId);
    await updateDoc(postRef, {
      [voteType === 'up' ? 'upvotes' : 'downvotes']: increment(1),
    });
    return true;
  } catch (err) {
    console.error('Firestore vote update error:', err);
    return false;
  }
}
