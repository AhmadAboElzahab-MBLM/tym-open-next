import _ from 'lodash';

export function extractPropertyValues(groupedObjects, properties) {
  const propertyValues = {};

  _.forEach(groupedObjects, (group) => {
    _.forEach(group.values, (_product) => {
      _.forEach(properties, (property) => {
        const value = _.get(_product, `properties.${property}`, null);

        if (!propertyValues[property]) propertyValues[property] = [];

        if (!_.isNil(value) && !propertyValues[property].includes(value)) {
          propertyValues[property].push(value);
        }
      });
    });
  });

  _.forEach(properties, (property) => {
    if (propertyValues[property]) {
      propertyValues[property] = _.uniq(_.flatten(propertyValues[property]));
    }
  });

  return propertyValues;
}
