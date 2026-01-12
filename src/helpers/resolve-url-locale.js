import _ from 'lodash';

export default function resolveInternalLinks(link, locale) {
  if (_.isNil(locale) || _.isEmpty(link)) return;

  const pattern = '/en/';
  const prefix = `/${locale}/`;

  const url = _.defaultTo(_.get(link, 'url', '') || _.get(link, 'route.path', ''), pattern);
  _.set(link, 'url', _.replace(url, pattern, prefix));

  const path = _.defaultTo(_.get(link, 'route.path'), '');
  if (path) _.set(link, 'route.path', _.replace(path, pattern, prefix));
}
