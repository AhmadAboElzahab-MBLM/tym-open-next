import React from 'react';
import { get } from 'lodash';
import { getByContentType, getByPath, getByContentTypeSpecificData } from '@/services/umbraco';
import BasicPage from '@/components/page-structures/basic-page';
import { fetchHeaderProducts } from '@/services/fetch-header-products';
import handleSpecificData from '@/helpers/handle-specific-data';

const regions = {
  en: 'International',
  ko: '한국',
  de: 'Deutschland',
  'en-ko': 'South Korea',
  'en-us': 'North America',
};

async function getHomeContent() {
  try {
    const lang = process.env.NEXT_PUBLIC_LANG;
    const region = regions[lang];
    const locale = lang === 'ko' ? 'ko' : lang === 'de' ? 'de' : 'en-us';
    const path = lang; // Homepage path is just the lang prefix

    const [data, settings, translations] = await Promise.all([
      getByPath(path, region),
      getByContentType('settings', region, locale, lang).then((_settings) => _settings[0]),
      getByContentType('translations', region, locale, lang).then(
        (_translations) => _translations[0],
      ),
    ]);

    if (!data) throw new Error('No data fetched from Umbraco.');

    return { data, settings, translationItems: translations, region, lang, locale };
  } catch (error) {
    return {
      data: null,
      settings: null,
      translationItems: null,
      region: null,
      lang: null,
      locale: null,
    };
  }
}

export default async function Page() {
  const { data, settings, translationItems, region, lang, locale } = await getHomeContent();
  const { product, customerStory, promotion, mediaItem, howTo } = await handleSpecificData(
    data,
    region,
    locale,
    lang,
  );

  const navigationProducts = await fetchHeaderProducts(lang);
  const allPreOwnedProducts = await getByContentTypeSpecificData('preOwned', region, locale, lang);

  const translations = get(translationItems, 'properties.translationItems.items', []);
  const blocks = get(data, 'properties.body.items', []);
  const bodyData = get(data, 'properties', []);
  const mainClass = 'min-h-full';

  const commonProps = {
    locale,
    region,
    lang,
    settings,
    mainClass,
    translations,
    navigationProducts,
    products: product,
    customerStory,
    promotion,
    mediaItem,
    howTo,
    bodyData,
  };

  return <BasicPage data={blocks} {...commonProps} preOwnedProducts={allPreOwnedProducts} />;
}
