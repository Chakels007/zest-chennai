// Central Chennai coordinates (Alwarpet landmark)
export const CHENNAI_DEFAULT_COORDS = {
  lat: 13.0336,
  lng: 80.2524,
};

export const NEIGHBORHOOD_CENTERS: Record<string, { lat: number; lng: number }> = {
  All: CHENNAI_DEFAULT_COORDS,
  Alwarpet: { lat: 13.0336, lng: 80.2524 },
  Nungambakkam: { lat: 13.0617, lng: 80.2452 },
  Mylapore: { lat: 13.0339, lng: 80.2698 },
  'T. Nagar': { lat: 13.0418, lng: 80.2392 },
};

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
