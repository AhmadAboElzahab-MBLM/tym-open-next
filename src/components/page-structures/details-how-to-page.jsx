'use client';

import React from 'react';
import _ from 'lodash';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import NewsEventsArticlesDetails from '@/components/news-events-articles-details/news-events-articles-details';
import AsideMenu from '@/components/aside-menu';
import GlobalContext from '@/context/global-context';

function DetailsHowToPage(props) {
  const settings = _.get(props, 'settings', null);
  const navigationProducts = _.get(props, 'navigationProducts', []);
  const products = _.get(props, 'products', []);
  const blocks = _.get(props, 'data.properties.body', []);
  const data = _.get(props, 'data', []);
  const mainClass = _.get(props, 'mainClass', '');
  const title = _.get(data, 'properties.title', '');
  const introContent = _.get(data, 'properties.description', '');
  const date = _.get(data, 'properties.date', '');
  const image = _.get(data, 'properties.featuredImage[0]', null);
  const htmlContent = _.get(data, 'properties.pageContent.markup', null);
  const productType = _.get(data, 'properties.productType', '');
  const type = _.get(data, 'properties.type', '');
  const tractorModel = _.get(data, 'properties.tractorModel', '');
  const series = _.get(data, 'properties.series', '');
  const region = _.get(props, 'region', '');
  const locale = _.get(props, 'locale', '');
  const lang = _.get(props, 'lang', '');
  const backButton = {
    icon: 'ArrowRight',
    label: region === '한국' ? '목록으로 돌아가기' : "Back to all how-to's & checklists",
  };
  const translations = _.get(props, 'translations', []);
  const customerStory = _.get(props, 'customerStory', []);
  const promotion = _.get(props, 'promotion', []);
  const mediaItem = _.get(props, 'mediaItem', []);
  const howTo = _.get(props, 'howTo', []);
  const metaTitle = _.get(props, 'bodyData.title', null);
  const metaDescription = _.get(props, 'bodyData.description', null);
  const metaFeaturedImage = _.get(props, 'bodyData.featuredImage', null);

  return (
    <GlobalContext.Provider value={{ region, locale, lang, translations }}>
      <title>{metaTitle || 'Designed for your world - TYM'}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {metaTitle && <meta property="og:title" content={metaTitle} />}
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {metaFeaturedImage && <meta property="og:image" content={metaFeaturedImage.url} />}
      <meta property="og:type" content="website" />
      <main className={mainClass}>
        <Header
          data={settings}
          region={region}
          locale={locale}
          lang={lang}
          products={navigationProducts}
        />
        <AsideMenu data={settings} />
        <NewsEventsArticlesDetails
          title={title}
          text={introContent}
          image={image}
          date={date}
          blocks={blocks}
          backButton={backButton}
          htmlContent={htmlContent}
          productType={productType}
          type={type}
          tractorModel={tractorModel}
          series={series}
          region={region}
          locale={locale}
          products={products}
          lang={lang}
          customerStory={customerStory}
          promotion={promotion}
          mediaItem={mediaItem}
          howTo={howTo}
        />
        <Footer data={settings} region={region} locale={locale} lang={lang} />
      </main>
    </GlobalContext.Provider>
  );
}

export default DetailsHowToPage;
