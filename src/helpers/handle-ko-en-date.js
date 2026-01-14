import _ from 'lodash';

function handleKoEnDate(givenDate, lang = 'en', op = null) {
  const date = new Date(givenDate);
  
  // Ensure the date is valid
  if (isNaN(date.getTime())) return '';

  if (lang === 'ko') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  }

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(lang, op || options).format(date);
}

export default handleKoEnDate;