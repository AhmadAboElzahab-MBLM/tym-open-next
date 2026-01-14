import _ from 'lodash';

export default function hasContentTypeBlock(data, contentType) {
  const blocks = _.get(data, 'properties.body.items', []);
  return _.some(blocks, (block) => _.get(block, 'content.contentType') === contentType);
}
