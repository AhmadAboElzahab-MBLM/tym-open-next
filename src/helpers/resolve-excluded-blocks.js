import _ from 'lodash';

export default function resolveExcludedBlocks(page, region) {
  const items = _.get(page, 'properties.body.items', []);

  const filteredItems = _.filter(items, (item) => {
    const excludedRegions = _.get(item, 'content.properties.excludedRegions', []);
    return !_.includes(excludedRegions, region);
  });

  _.set(page, 'properties.body.items', filteredItems);
}
