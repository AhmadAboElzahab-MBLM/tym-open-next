import _ from 'lodash';

export default function resolveInternalLinks(obj, lang, visited = new WeakSet()) {
  if (!obj || typeof obj !== 'object') return;
  if (visited.has(obj)) return;
  visited.add(obj);

  _.forEach(obj, (val, key) => {
    if (key === 'link' && _.isArray(val)) {
      _.forEach(val, (link, index) => {
        const url = _.get(link, 'url', null);
        const route = _.get(link, 'route.path', null);
        if (url) _.set(obj, `[${key}][${index}].url`, url);
        else if (route) _.set(obj, `[${key}][${index}].url`, route);
      });
    } else if (_.isObject(val) || _.isArray(val)) {
      resolveInternalLinks(val, lang, visited);
    }
  });
}
