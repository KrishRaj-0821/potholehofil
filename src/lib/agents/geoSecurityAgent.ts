import { verifyKasbaGeofence } from '@/lib/geoUtils';
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

export async function syncPostToFirebase(post: PotholePost): Promise<boolean> {
  return await syncPostToFirestore(post);
}

export async function syncPostToDatabase(post: PotholePost): Promise<boolean> {
  // Sync to Firebase Cloud Firestore & Storage
  return await syncPostToFirebase(post);
}
