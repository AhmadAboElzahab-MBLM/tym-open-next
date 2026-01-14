import React from 'react';
import { get, isEmpty, join } from 'lodash';
import {
  getByContentType,
  getByPath,
  getByContentTypeSpecificData,
} from '@/services/umbraco';
import BasicPage from '@/components/page-structures/basic-page';
import ProductsPage from '@/components/page-structures/products-page';
import DetailsHowToPage from '@/components/page-structures/details-how-to-page';
import DetailsSuccessStories from '@/components/page-structures/details-success-stories';
import DetailsPage from '@/components/page-structures/details-page';
import { fetchHeaderProducts } from '@/services/fetch-header-products';
import handleSpecificData from '@/helpers/handle-specific-data';

async function getContentByParams(params) {
  try {
    const regions = {
      en: 'International',
      ko: '한국',
      'en-ko': 'South Korea',
      'en-us': 'North America',
    };

    const lang = get(params, 'slug[0]', '');
    const region = regions[lang];
    const locale = lang === 'ko' ? 'ko' : 'en-us';
    const path = join(params.slug, '/');

    const [data, settings, translations] = await Promise.all([
      getByPath(path, region),
      getByContentType('settings', region, locale, lang).then((_settings) => _settings[0]),
      getByContentType('translations', region, locale, lang).then(
        (_translations) => _translations[0],
      ),
    ]);

    if (isEmpty(data)) throw new Error('No data fetched from Umbraco.');

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


// Only pre-build home pages, other pages will be generated on-demand and cached in R2
export const dynamicParams = true;
export const revalidate = false; // Cache indefinitely, only revalidate on-demand

export async function generateStaticParams() {
  // Only pre-build home pages for each region
  return [
    { slug: ['en'] },
    { slug: ['en-us'] },
    { slug: ['en-ko'] },
    { slug: ['ko'] },
  ];
}

export default async function Page({ params }) {
  const resolvedParams = await params;

  const { data, settings, translationItems, region, lang, locale } =
    await getContentByParams(resolvedParams);
  const { product, customerStory, promotion, mediaItem, howTo } = await handleSpecificData(
    data,
    region,
    locale,
    lang,
  );

  const navigationProducts = await fetchHeaderProducts(lang);

  // Fetch all pre-owned products array (similar to how products are fetched)
  const allPreOwnedProducts = await getByContentTypeSpecificData('preOwned', region, locale, lang);

  const translations = get(translationItems, 'properties.translationItems.items', []);
  const blocks = get(data, 'properties.body.items', []);
  const contentType = get(data, 'contentType', '');
  const bodyData = get(data, 'properties', []);
  const mainClass = 'min-h-full';

  // Common props
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

  switch (contentType) {
    case 'page':
    case 'home':
    case 'preOwned':
    case 'media':
      return <BasicPage data={blocks} {...commonProps} preOwnedProducts={allPreOwnedProducts} />;
    case 'product':
      return <ProductsPage data={data} {...commonProps} />;

    case 'howTo':
      return <DetailsHowToPage data={data} {...commonProps} />;
    case 'customerStory':
      return <DetailsSuccessStories data={data} {...commonProps} isSuccessStories />;
    case 'mediaItem':
      return <DetailsPage data={data} {...commonProps} />;
    default:
      return contentType;
  }
}
