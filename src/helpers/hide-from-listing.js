import _ from 'lodash';

export default function hideFromListing(data) {
  const items = _.get(data, 'items', []);
  const filteredItems = _.filter(
    items,
    (item) => !_.get(item, 'properties.hideFromListing', false),
  );
  _.set(data, 'items', filteredItems);
}
