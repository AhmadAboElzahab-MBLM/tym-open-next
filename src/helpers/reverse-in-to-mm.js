import _ from 'lodash';

export default function reverseInToMm(inputString) {
  if (_.isNil(inputString)) return '';
  const parts = _.split(inputString, ' / ');

  const reversedParts = _.map(parts, (section) => {
    const labelEndIndex = section.indexOf(')') + 1;
    const label = section.substring(0, labelEndIndex);
    const measurements = section.substring(labelEndIndex).trim();

    const reversedMeasurements = _.reverse(measurements.split(' | '));
    return `${label} ${reversedMeasurements.join(' | ')}`;
  });

  return reversedParts.join(' / ');
}
