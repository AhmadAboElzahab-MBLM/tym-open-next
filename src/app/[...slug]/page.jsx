import React from 'react';
import { get, trimStart, isEmpty } from 'lodash';
import {
  getAllSlugs,
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
import { LANG, REGION, LOCALE } from '@/lib/runtime-locale';

async function getContentByParams(params) {
  try {
    const path = params.slug.join('/');

    const [data, settings, translations] = await Promise.all([
      getByPath(path, REGION),
      getByContentType('settings', REGION, LOCALE, LANG).then((r) => r[0]),
      getByContentType('translations', REGION, LOCALE, LANG).then((r) => r[0]),
    ]);

    if (isEmpty(data)) throw new Error('No data fetched from Umbraco.');

    return { data, settings, translationItems: translations, region: REGION, lang: LANG, locale: LOCALE };
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

export async function generateStaticParams() {
  const contentTypes = [
    'home',
    'page',
    'product',
    'customerStory',
    'mediaItem',
    'howTo',
    'promotion',
    'preOwned',
    'media',
  ];

  const content = await Promise.all(
    contentTypes.map((type) => getAllSlugs(type, LOCALE))
  );

  return content.flat().map((page) => ({
    slug: trimStart(page.route.path, '/')
      .replace(/^en\/|^ko\//, '') // normalize
      .split('/'),
  }));
}

export default async function Page({ params }) {
  const resolvedParams = await params;

  const { data, settings, translationItems, region, lang, locale } =
    await getContentByParams(resolvedParams);

  const { product, customerStory, promotion, mediaItem, howTo } = await handleSpecificData(
    data,
    region,
    locale,
    lang
  );

  const navigationProducts = await fetchHeaderProducts(lang);
  const allPreOwnedProducts = await getByContentTypeSpecificData('preOwned', region, locale, lang);

  const translations = get(translationItems, 'properties.translationItems.items', []);
  const blocks = get(data, 'properties.body.items', []);
  const contentType = get(data, 'contentType', '');
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
