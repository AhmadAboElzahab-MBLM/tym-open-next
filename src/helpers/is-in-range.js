import _ from 'lodash';

export default function isInRange(value, range) {
  if (_.isArray(range) && !_.isEmpty(range)) {
    if (range.length === 1) return _.gte(value, range[0]);
    return _.inRange(value, range[0], range[1] + 1);
  }
  return false;
}
