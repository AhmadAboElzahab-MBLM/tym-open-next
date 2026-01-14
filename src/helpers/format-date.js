import _ from 'lodash';

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export default function formatDate(inputDate) {
  const date = new Date(inputDate);
  if (_.isNaN(date.getTime())) return '';

  const day = _.padStart(String(date.getDate()), 2, '0');
  const month = _.nth(months, date.getMonth());
  const year = date.getFullYear();

  // The epoch start time is 'Thu, 01 Jan 1970 00:00:00 GMT'
  const hasYear = year !== 1970 || date.getTime() === 0;
  const hasMonth = month !== 'january' || hasYear;
  const hasDay = day !== '01' || hasMonth;

  switch (true) {
    case hasDay:
      return `${day} ${month} ${year}`;
    case hasMonth:
      return `${month} ${year}`;
    case hasYear:
      return `${year}`;
    default:
      return '';
  }
}
export function dateToNumber(date) {
  const dateObj = new Date(date);
  const year = new Date(date).getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}
