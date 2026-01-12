import _ from 'lodash';

export default function resolveExcludedContentType(data, region) {
  const items = _.get(data, 'items', []);

  const filteredItems = _.filter(items, (item) => {
    const excludedRegions = _.get(item, 'properties.excludedRegions', []);
    return !_.includes(excludedRegions, region);
  });

  _.set(data, 'properties.body.items', filteredItems);
}
