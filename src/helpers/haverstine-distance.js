import _ from 'lodash';

export default function haversineDistance(coordsString, coords2) {
  if (_.isNull(coordsString)) return null;

  const coords1 = {
    latitude: _.split(coordsString, ',')[0],
    longitude: _.split(coordsString, ',')[1],
  };

  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371;
  const dLat = toRadians(_.subtract(_.get(coords2, 'latitude'), _.get(coords1, 'latitude')));
  const dLng = toRadians(_.subtract(_.get(coords2, 'longitude'), _.get(coords1, 'longitude')));
  const a = _.add(
    _.multiply(Math.sin(dLat / 2), Math.sin(dLat / 2)),
    _.multiply(
      _.multiply(
        Math.cos(toRadians(_.get(coords1, 'latitude'))),
        Math.cos(toRadians(_.get(coords2, 'latitude'))),
      ),
      _.multiply(Math.sin(dLng / 2), Math.sin(dLng / 2)),
    ),
  );
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = _.multiply(R, c);
  return _.multiply(distance, 0.621371);
}
