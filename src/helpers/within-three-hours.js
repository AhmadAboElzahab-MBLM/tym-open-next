import _ from 'lodash';

export default function withinThreeHours(key) {
  const TYM_TOKEN = localStorage.getItem(key);
  const FIFTEEN_MINUTES = 10800000;

  if (_.isEmpty(TYM_TOKEN)) return false;

  const now = _.now();
  const diff = now - Number(TYM_TOKEN);

  return _.lte(diff, FIFTEEN_MINUTES);
}
