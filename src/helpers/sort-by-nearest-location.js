import _ from 'lodash';

function calcHaversineDistance(refLocation, targetLocation) {
  const refLatitude = Number(_.get(refLocation, 'latitude', 0));
  const refLongitude = Number(_.get(refLocation, 'longitude', 0));
  const targetLatitude = Number(_.get(targetLocation, 'latitude', 0));
  const targetLongitude = Number(_.get(targetLocation, 'longitude', 0));

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const EARTH_RADIUS_KM = 6371;

  const deltaLatitude = toRadians(targetLatitude - refLatitude);
  const deltaLongitude = toRadians(targetLongitude - refLongitude);
  const refLatitudeRadians = toRadians(refLatitude);
  const targetLatitudeRadians = toRadians(targetLatitude);

  const ONE = 1;
  const TWO = 2;

  const a =
    Math.sin(deltaLatitude / TWO) * Math.sin(deltaLatitude / TWO) +
    Math.sin(deltaLongitude / TWO) *
      Math.sin(deltaLongitude / TWO) *
      Math.cos(refLatitudeRadians) *
      Math.cos(targetLatitudeRadians);
  const c = TWO * Math.atan2(Math.sqrt(a), Math.sqrt(ONE - a));

  return EARTH_RADIUS_KM * c;
}

export default function sortByNearestLocation(location, locations, maxDistance = null) {
  const filteredLocations = _.chain(locations)
    .map((targetLocation) => ({
      location: targetLocation,
      distance: calcHaversineDistance(location, targetLocation),
    }))
    .filter(({ distance }) => (maxDistance ? distance <= maxDistance : true))
    .sortBy('distance')
    .map('location')
    .value();

  // console.log(filteredLocations);

  return filteredLocations;
}
