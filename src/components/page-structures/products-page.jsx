'use client';

import React, { useEffect } from 'react';
import _ from 'lodash';
import Header from '@/components/header/header';
import Footer from '@/components/footer/footer';
import ApplicationBlock from '@/components/application-block';
import ProductDetailsBanner from '@/components/product-details-banner';
import RotateView from '@/components/rotate-view';
import TractorsPinsWithItems from '@/components/tractors-pins-with-items';
import TechnicalSpecification from '@/components/technical-specification/technical-specification';
import FeaturesGallery from '@/components/features-gallery';
import SecondaryNav from '@/components/secondary-nav';
import ProductDetailsCta from '@/components/product-details-cta';
import TextWithTwoImages from '@/components/text-with-two-images';
import AsideMenu from '@/components/aside-menu';
import GlobalContext from '@/context/global-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProductQuickLinks from '../product-quick-links';
import SuccessStoriesSlider from '../success-stories-slider/success-stories-slider';
import ProductDetailsVideo from '../product-details-video';
import AttachmentsFooterImage from '../attachments-footer-image';
import ProductPromotionsSlider from '../product-promotion-slider';
import Icons from '../layout/icons';

function ProductsPage(props) {
  const settings = _.get(props, 'settings', null);
  const products = _.get(props, 'products', []);
  const navigationProducts = _.get(props, 'navigationProducts', []);
  const data = _.get(props, 'data', []);
  const mainClass = _.get(props, 'mainClass', '');
  const region = _.get(props, 'region', '');
  const locale = _.get(props, 'locale', '');
  const lang = _.get(props, 'lang', '');
  const translations = _.get(props, 'translations', []);
  const customerStory = _.get(props, 'customerStory', []);
  const promotion = _.get(props, 'promotion', []);
  const mediaItem = _.get(props, 'mediaItem', []);
  const howTo = _.get(props, 'howTo', []);
  const isTractor = _.isEqual(_.get(data, 'properties.category'), 'Tractors');
  const metaTitle = _.get(props, 'bodyData.title', null);
  const metaDescription = _.get(props, 'bodyData.description', null);
  const metaFeaturedImage = _.get(props, 'bodyData.featuredImage', null);
  const [isVisible, setIsVisible] = React.useState(true);
  const handleClose = () => {
    setIsVisible(false);
  };
  const path = usePathname();
  const isTractors = _.includes(path, 'en-us/products/tractors');

  // console.log(data);

  const commonProps = {
    data,
    region,
    locale,
    lang,
    products,
    customerStory,
    promotion,
    mediaItem,
    howTo,
  };

  useEffect(() => {
    // Add the "product" class to the body tag
    document.body.classList.add('product');

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('product');
    };
  }, []);

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
          isDetail
          products={navigationProducts}
        />
        <AsideMenu id="AsideMenu" data={settings} region={region} locale={locale} lang={lang} />
        <ProductDetailsBanner id="ProductDetailsBanner" {...commonProps} />
        <SecondaryNav id="SecondaryNav" data={data} region={region} locale={locale} lang={lang} />
        <ProductPromotionsSlider id="productPromotionSlider" {...commonProps} />
        <ProductDetailsCta id="ProductDetailsCta" {...commonProps} />
        <TextWithTwoImages id="TextWithTwoImages" {...commonProps} />
        <FeaturesGallery id="FeaturesGallery" {...commonProps} />
        <ProductDetailsVideo id="ProductDetailsVideo" {...commonProps} />
        <TractorsPinsWithItems id="TractorsPinsWithItems" {...commonProps} />
        <ApplicationBlock id="ApplicationBlock" {...commonProps} />
        {isTractor && <SuccessStoriesSlider id="SuccessStoriesSlider" {...commonProps} />}
        <TechnicalSpecification id="TechnicalSpecification" {...commonProps} />
        <ProductQuickLinks id="ProductQuickLinks" {...commonProps} />
        <AttachmentsFooterImage {...commonProps} />
        <Footer data={settings} region={region} locale={locale} lang={lang} />
        {lang === 'en-us' && isVisible && isTractors && (
          <div className="fixed bottom-0 z-[40] block w-full">
            <div className="relative mx-auto flex min-h-[50px] max-w-[600px] flex-row items-center gap-5 rounded-t-[4px] bg-[#1A1A1A] p-3 md:px-5 md:pb-[18px] md:pt-[14px]">
              <div className="flex flex-row gap-1 font-noto text-[10px] font-medium text-white md:gap-2 md:text-[15px]">
                Start your journey with TYM:
                <Link href={`/${lang}/products/request-quote`} className="underline">
                  Request a Quote
                </Link>{' '}
                or
                <Link href={`/${lang}/find-a-dealer`} className="underline">
                  Find a TYM Dealer
                </Link>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 svg-child-path:stroke-white md:right-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[8px] w-[8px] md:h-[12px] md:w-[12px]"
                  viewBox="0 0 14 14"
                  fill="none">
                  <path d="M13 13L7 7L13 1" stroke="white" strokeWidth="2" />
                  <path d="M1 13L7 7L1 1" stroke="white" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </GlobalContext.Provider>
  );
}

export default ProductsPage;
