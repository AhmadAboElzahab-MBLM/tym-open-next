'use client';

import React, { Suspense, useEffect, useState } from 'react';
import _ from 'lodash';
import { getByContentType, getTranslations } from '@/services/umbraco';
import { fetchHeaderProducts } from '@/services/fetch-header-products';
import BoxedContainer from '@/components/layout/boxed-container';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Loading from '@/components/layout/loading';

const data = {
  'en-us': {
    title: '"Well, This Page is Out to Pasture!"',
    subtitle: '404 page NOT FOUND',
    text: "Looks like this page decided to take a tractor ride. Let's get you back on track!",
    links: [
      { name: 'Tractors', url: '/products/tractors' },
      { name: 'Customer Care', url: '/parts-support' },
      { name: 'About TYM', url: '/about' },
      { name: 'Find a Dealer', url: '/find-a-dealer' },
    ],
  },
  ko: {
    title: '이런, 페이지가 소풍을 갔나 봐요!',
    subtitle: '404 페이지를 찾을 수 없음',
    text: '페이지가 트랙터를 타고 잠시 떠난 것 같아요. 다른 곳으로 안내해 드릴게요!',
    links: [
      { name: '트랙터', url: '/products/tractors' },
      { name: '제품 지원', url: '/parts-support' },
      { name: '소개', url: '/about' },
      { name: '딜러점 찾기', url: '/find-a-dealer' },
    ],
  },
  de: {
    title: '"Hoppla, diese Seite ist auf dem Feld unterwegs!"',
    subtitle: '404 Seite NICHT GEFUNDEN',
    text: 'Diese Seite hat sich wohl mit dem Traktor auf den Weg gemacht. Lassen Sie uns Ihnen weiterhelfen!',
    links: [
      { name: 'Traktoren', url: '/products/tractors' },
      { name: 'Kundenservice', url: '/parts-support' },
      { name: 'Über TYM', url: '/about' },
      { name: 'Händler finden', url: '/find-a-dealer' },
    ],
  },
};

export default function Page() {
  const params = usePathname();
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [translations, setTranslations] = useState([]);
  const regions = {
    en: 'International',
    ko: '한국',
    de: 'Deutschland',
    'en-ko': 'South Korea',
    'en-us': 'North America',
  };
  const lang = _.chain(params).split('/').filter(Boolean).head().value() || 'en';
  const region = regions[lang];
  const locale = lang === 'ko' ? 'ko' : lang === 'de' ? 'de' : 'en-us';
  const loadHeaderFooter = _.isEmpty(settings) || _.isEmpty(products);
  const { title, subtitle, text, links } = data[locale];

  const handleContentFetch = async () => {
    const [_products, _settings] = await Promise.all([
      fetchHeaderProducts(lang),
      getByContentType('settings', region, locale, lang).then((res) => res[0])
    ]);

    const _translations = await getTranslations();

    setProducts(_products);
    setSettings(_settings);
    setTranslations(_translations);
  };

  useEffect(() => {
    handleContentFetch();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <main>
        {loadHeaderFooter || (
          <Header
            data={settings}
            region={region}
            locale={locale}
            lang={lang}
            products={products}
            translations={translations}
          />
        )}
        <section className="h-full bg-not-found bg-contain bg-bottom bg-no-repeat">
          <BoxedContainer className="min-h-screen">
            <div
              className="flex max-w-[928px] flex-col gap-y-[15px] pt-[90px] md:gap-y-[20px]
              md:pt-[120px] lg:gap-y-[32px] lg:pt-[200px] xl:pt-[260px]">
              <h1
                className="text-[26px] font-bold uppercase leading-[34px] text-primary
                md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px] ">
                {title}
              </h1>
              <h2 className="text-clamp20to28 font-bold uppercase leading-1.42 text-cherry">
                {subtitle}
              </h2>
              <p className="font-noto text-clamp14to18 font-normal leading-1.77 text-primary">
                {text}
              </p>
              <ul className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                {_.map(links, (link) => (
                  <li key={link.name}>
                    <Link
                      href={`/${lang}${link.url}`}
                      className="font-noto text-clamp14to18 leading-1.77 underline hover:text-cherry">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </BoxedContainer>
        </section>
        {loadHeaderFooter || (
          <Footer
            data={settings}
            region={region}
            locale={locale}
            lang={lang}
            translations={translations}
          />
        )}
      </main>
    </Suspense>
  );
}
