import _ from 'lodash';

function replaceUrlPrefix(url, prefix) {
  if (!url || !prefix) return url;

  const segments = _.split(url, '/');

  if (segments.length > 1 && segments[0] === '') segments[1] = prefix;

  return _.join(segments, '/');
}

export default function modifyDataPaths(data, region) {
  _.forEach(data, (val) => {
    if (_.isArray(val)) {
      _.forEach(val, (_val) => {
        const currPath = _.get(_val, 'route.path', null);
        if (currPath) {
          const newPath = replaceUrlPrefix(currPath, region);
          _.set(_val, 'route.path', newPath);
        }
      });
    }
  });
}
