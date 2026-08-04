/**
 * Geolocation & Geofencing utilities for Kasba (PIN: 854330)
 * Kasba, Purnea, Bihar Center: Lat 25.8452 N, Lng 87.5341 E
 */

export const KASBA_CENTER = {
  lat: 25.8452,
  lng: 87.5341,
  pin: '854330',
  maxRadiusKm: 6.0, // 6 km geofence boundary radius
};

/**
 * Calculates distance between two coordinates using the Haversine formula (in kilometers)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

/**
 * Verifies if user GPS location is within Kasba 854330 geofence boundary
 */
export function verifyKasbaGeofence(userLat: number, userLng: number): {
  isWithinBoundary: boolean;
  distanceKm: number;
  message: string;
} {
  const distance = calculateHaversineDistance(
    userLat,
    userLng,
    KASBA_CENTER.lat,
    KASBA_CENTER.lng
  );

  const isWithinBoundary = distance <= KASBA_CENTER.maxRadiusKm;

  return {
    isWithinBoundary,
    distanceKm: parseFloat(distance.toFixed(2)),
    message: isWithinBoundary
      ? `Verified in Kasba (854330) zone (${distance.toFixed(1)} km from center)`
      : `Outside Kasba (854330) boundary (${distance.toFixed(1)} km away). Out-of-bounds report blocked.`,
  };
}

/**
 * Fetch live GPS coordinates via HTML5 Geolocation API
 */
export function getLiveGpsCoordinates(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
