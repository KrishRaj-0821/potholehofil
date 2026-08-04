import { verifyKasbaGeofence } from '@/lib/geoUtils';
import { supabase } from '@/lib/supabaseClient';
import { syncPostToFirestore } from '@/lib/firebaseClient';
import { PotholePost } from '@/types';

// In-Memory IP & Rate Limiting Cache
const ipRateLimitMap = new Map<string, number>();

export interface GeoSecurityResult {
  allowed: boolean;
  rejectReason?: string;
  distanceKm: number;
}

export function enforceGeoSecurityAndRateLimit(
  userLat: number,
  userLng: number,
  ipAddress: string = '127.0.0.1'
): GeoSecurityResult {
  // 1. Geofencing check (Kasba 854330 boundary <= 6.0 km)
  const geofence = verifyKasbaGeofence(userLat, userLng);
  if (!geofence.isWithinBoundary) {
    return {
      allowed: false,
      rejectReason: geofence.message,
      distanceKm: geofence.distanceKm,
    };
  }

  // 2. Zero-login IP Rate Limiting (Max 1 report / 60 seconds per IP)
  const lastReportTime = ipRateLimitMap.get(ipAddress);
  const now = Date.now();
  if (lastReportTime && now - lastReportTime < 60000) {
    const remainingSec = Math.ceil((60000 - (now - lastReportTime)) / 1000);
    return {
      allowed: false,
      rejectReason: `Rate limit active. Please wait ${remainingSec} seconds before submitting another Kasba report.`,
      distanceKm: geofence.distanceKm,
    };
  }

  // Cache rate limit timestamp
  ipRateLimitMap.set(ipAddress, now);

  return {
    allowed: true,
    distanceKm: geofence.distanceKm,
  };
}

export async function syncPostToSupabase(post: PotholePost): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('pothole_posts').insert([
      {
        id: post.id,
        author_name: post.author.name,
        author_handle: post.author.handle,
        author_avatar: post.author.avatar,
        location_name: post.location.name,
        pin: post.location.pin,
        lat: post.location.lat || 25.8452,
        lng: post.location.lng || 87.5341,
        image_url: post.imageUrl,
        meme_caption: post.memeCaption,
        meme_subtext: post.memeSubtext,
        severity: post.severity,
        depth_cm: post.metrics.depthCm,
        area_sqm: post.metrics.areaSqM,
        pothole_count: post.metrics.count,
        upvotes: post.upvotes,
        downvotes: post.downvotes,
      },
    ]);

    if (error) {
      console.warn('Supabase sync notice (using local storage fallback):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase connection fallback:', err);
    return false;
  }
}

export async function syncPostToFirebase(post: PotholePost): Promise<boolean> {
  return await syncPostToFirestore(post);
}

export async function syncPostToDatabase(post: PotholePost): Promise<void> {
  // Sync in parallel to both Firebase and Supabase
  await Promise.allSettled([
    syncPostToFirebase(post),
    syncPostToSupabase(post),
  ]);
}

