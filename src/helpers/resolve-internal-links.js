import _ from 'lodash';

export default function resolveInternalLinks(obj, lang) {
  // console.log(obj?.link);
  _.forEach(obj, (val, key) => {
    if (key === 'link' && _.isArray(val)) {
      _.forEach(val, (link, index) => {
        const url = _.get(link, 'url', null);
        const route = _.get(link, 'route.path', null);
        if (url) _.set(obj, `[${key}][${index}].url`, url);
        else if (route) _.set(obj, `[${key}][${index}].url`, route);
      });
    } else if (_.isObject(val) || _.isArray(val)) {
      resolveInternalLinks(val, lang);
    }
  });
}
