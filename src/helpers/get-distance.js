import _ from 'lodash';

export default function getDistance(startCoordinates, endCoordinates) {
  if (_.isEmpty(startCoordinates)) return null;

  const startLat = Number(_.get(startCoordinates, 'latitude', ''));
  const startLng = Number(_.get(startCoordinates, 'longitude', ''));
  const endLat = Number(_.get(endCoordinates, 'latitude', ''));
  const endLng = Number(_.get(endCoordinates, 'longitude', ''));

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const EARTH_RADIUS_KM = 6371;

  const latDiffRadians = toRadians(endLat - startLat);
  const lngDiffRadians = toRadians(endLng - startLng);

  const a =
    Math.sin(latDiffRadians / 2) * Math.sin(latDiffRadians / 2) +
    Math.cos(toRadians(startLat)) *
      Math.cos(toRadians(endLat)) *
      Math.sin(lngDiffRadians / 2) *
      Math.sin(lngDiffRadians / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = EARTH_RADIUS_KM * c;
  const distanceMiles = distanceKm * 0.621371;

  // Round to 2 decimal places
  return {
    km: Math.round(distanceKm * 100) / 100,
    miles: Math.round(distanceMiles * 100) / 100,
  };
}
export function parseGoogleMapsLocation(locationStr) {
  if (!locationStr) {
    return { latitude: 0, longitude: 0 };
  }

  const [latStr, lngStr] = locationStr.split(',');
  return {
    latitude: parseFloat(latStr.trim()),
    longitude: parseFloat(lngStr.trim()),
  };
}
