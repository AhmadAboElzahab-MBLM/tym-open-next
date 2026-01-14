'use client';

import React, { Suspense, useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import AsideMenu from '@/components/aside-menu';
import components from '@/components';
import GlobalContext from '@/context/global-context';
import Loading from '../layout/loading';

function HomePage(props) {
  const settings = props?.settings || null;
  //   const products = props?.products || [];
  const navigationProducts = props?.navigationProducts || [];
  const data = props?.data || [];
  const mainClass = props?.mainClass || '';
  const region = props?.region || '';
  const locale = props?.locale || '';
  const lang = props?.lang || '';
  const translations = props?.translations || [];
  const customerStory = props?.customerStory || [];
  const promotion = props?.promotion || [];
  const mediaItem = props?.mediaItem || [];
  const howTo = props?.howTo || [];
  const featuredImage = props?.bodyData?.featuredImage || [];
  const [pickMyTractor, setPickMyTractor] = useState({});
  const [isDarkNav, setIsDarkNav] = useState(false);
  const [modelName, setModelName] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setModelName(urlParams.get('model'));
  }, []);

  const title = modelName ? `Build Your Own: ${modelName}` : props?.bodyData?.title;
  const description = modelName
    ? `Build your own TYM ${modelName} model online.`
    : props?.bodyData?.description;

  const contextValue = useMemo(
    () => ({
      region,
      locale,
      lang,
      translations,
      pickMyTractor,
      setPickMyTractor,
    }),
    [region, locale, lang, translations, pickMyTractor],
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      <title>{title || 'Designed for your world - TYM'}</title>
      {description && <meta name="description" content={description} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {featuredImage && <meta property="og:image" content={featuredImage[0]?.url} />}
      <meta property="og:type" content="website" />
      <main className={mainClass}>
        <Header
          data={settings}
          region={region}
          locale={locale}
          lang={lang}
          products={navigationProducts}
          translations={translations}
          isDarkNav={isDarkNav}
        />
        <Suspense>
          <AsideMenu data={settings} />
        </Suspense>
        {_.map(data, (item, index) => {
          if (_.isEmpty(item)) return null;
          const type = _.get(item, 'content.contentType');
          const blockProps = _.get(item, 'content');
          const Comp = components[_.upperFirst(type)];
          const id = `${type}_${index + 1}`;

          return (
            _.isFunction(Comp) &&
            (['BuildYourOwn', 'AttachmentsPaginated', 'RequestQuote'].indexOf(_.upperFirst(type)) >
            -1 ? (
              <Suspense fallback={<Loading />} key={id}>
                <Comp
                  key={id}
                  id={id}
                  data={blockProps}
                  region={region}
                  locale={locale}
                  lang={lang}
                  translations={translations}
                  //   products={products}
                  customerStory={customerStory}
                  promotion={promotion}
                  mediaItem={mediaItem}
                  howTo={howTo}
                  setIsDarkNav={setIsDarkNav}
                />
              </Suspense>
            ) : (
              <Comp
                key={id}
                id={id}
                data={blockProps}
                region={region}
                locale={locale}
                lang={lang}
                translations={translations}
                // products={products}
                customerStory={customerStory}
                promotion={promotion}
                mediaItem={mediaItem}
                howTo={howTo}
                setIsDarkNav={setIsDarkNav}
              />
            ))
          );
        })}
        <Footer
          data={settings}
          region={region}
          locale={locale}
          lang={lang}
          translations={translations}
        />
      </main>
    </GlobalContext.Provider>
  );
}

export default HomePage;
