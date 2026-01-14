import { find, isEmpty, get, toLower } from 'lodash';

export function getTranslationByKey(translationKey = '', translations = [], lang = 'en') {
  const isKorean = lang === 'ko';

  if (isEmpty(translations)) return translationKey;

  const filteredItem = find(
    translations,
    ({ content }) => toLower(get(content, 'properties.translationKey')) === toLower(translationKey),
  );

  if (!filteredItem || isEmpty(get(filteredItem, 'content.properties'))) return translationKey;

  const translationValue = get(filteredItem, 'content.properties.translationValue');

  return isKorean ? translationValue : translationKey;
}
