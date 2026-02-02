import { find, isEmpty, get, toLower } from 'lodash';

export function getTranslationByKey(translationKey = '', translations = [], lang = 'en') {
  const currLang = lang === 'en' || lang === 'en-us' ? 'en-US' : lang;
  if (isEmpty(translations)) return translationKey;

  const filteredItem = find(translations, ({ key }) => key === translationKey);
  if (!filteredItem || isEmpty(get(filteredItem, 'translations'))) return translationKey;

  const translation = find(get(filteredItem, 'translations'), ({ iso }) => iso === currLang);
  if (!translation) return translationKey;
  
  const translationValue = get(translation, 'value');
  return translationValue;
}
