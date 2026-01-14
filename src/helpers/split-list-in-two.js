import _ from 'lodash';

export default function splitListInTwo(items) {
  if (_.isEmpty(items)) return [items, []];
  const midIndex = Math.ceil(items.length / 2);
  return [_.take(items, midIndex), _.drop(items, midIndex)];
}
