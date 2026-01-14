import _ from 'lodash';

export default function removeLastSegment(url) {
  const segments = _.split(url, '/');
  return _.join(_.initial(segments), '/');
}
