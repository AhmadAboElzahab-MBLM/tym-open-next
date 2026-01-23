'use client';

import Image from 'next/image';
import React, { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import _, { get, isEmpty, map } from 'lodash';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import { motion } from 'framer-motion';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import Button from './layout/button';
import Icons from './layout/icons';

function Modal({ closeModal, parent, requestQuote }) {
  const title = get(parent, 'properties.title', '');
  const children = get(parent, 'properties.configureParentProducts', []);

  return (
    <div className="fixed top-0 z-[100] flex h-screen w-full items-center justify-center bg-[#E5E5E5] bg-opacity-50">
      <div className="h-[90vh] w-[90vw] border-grey bg-white md:h-[526px] md:w-auto md:min-w-[596px]">
        <div className="flex flex-row justify-between gap-2 border-b border-b-grey p-5 pb-5 md:p-12 md:pb-10">
          <h4 className="font-noto text-[12px] font-bold uppercase tracking-wider md:text-[15px]">
            {`${title} tractor model variations:`}
          </h4>
          <button type="button" onClick={closeModal} className="close-button">
            <Icons name="Close" />
          </button>
        </div>

        <div className="flex flex-col gap-8 p-5 md:flex-row md:p-12">
          {map(children, (item, index) => {
            const featuredImage = get(parent, 'properties.featuresImage[0]', {});
            const itemTitle = get(item, 'name', '');
            const itemDescription = get(parent, 'properties.shortDescription', '');
            const category = get(parent, 'properties.category', '');
            const itemUrl = `${requestQuote.url}?category=${category}&model=${itemTitle}`;

            return (
              <Link
                href={itemUrl}
                key={index}
                className="flex w-full max-w-[256px] flex-col gap-y-2 md:gap-y-5">
                {isEmpty(featuredImage) || (
                  <div className="w-full">
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.name}
                      fill
                      className="!relative mx-auto !h-auto max-h-[260px] !w-auto object-cover md:max-h-[243px]"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-y-[5px] md:gap-y-[10px]">
                  <h3 className="font-noto text-[18px] font-bold leading-[24px] text-primary md:text-[21px]">
                    {itemTitle}
                  </h3>
                  <p className="font-noto text-[13px] font-normal text-primary md:text-[15px]">
                    {itemDescription}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsBanner({ id, data }) {
  const title = _.get(data, 'properties.title', '');
  const category = _.get(data, 'properties.category', '');
  const productCategory = _.get(data, 'properties.productCategory', '');
  const series = _.get(data, 'properties.series', '');
  const heroImages = _.get(data, 'properties.heroImages[0]', {});
  const bannerVideo = _.get(data, 'properties.bannerVideo[0]', {});
  const mobileBanner = _.get(data, 'properties.mobileBanner[0]', {});
  const engineLogo = _.get(data, 'properties.engineLogo[0]', {});
  const subCategory = _.get(data, 'properties.subCategory', '');
  const requestQuote = _.get(data, 'properties.requestQuote[0]', {});
  const compatibleProduct = _.get(data, 'properties.compatibleProduct', []);
  const configureParentProducts = _.get(data, 'properties.configureParentProducts', false);
  const { translations, lang } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isModalOpen]);

  resolveInternalLinks(requestQuote, lang);

  const langMapping = {
    en: { value: 'valueMetric', unit: 'unitMetric' },
    'en-us': { value: 'valueMetric', unit: 'unitMetric' },
    'en-ko': { value: 'valueMetric', unit: 'unitMetric' },
    ko: { value: 'valueMetric', unit: 'unitMetric' },
    de: { value: 'valueMetric', unit: 'unitMetric' },
  };

  const getLabelValue = (spec, lang) => {
    let { value, unit } = langMapping[lang] || langMapping.en;

    const title = get(spec, 'content.properties.title', '');

    if (title === 'Hitch lift capacity' && lang === 'en-us') {
      value = 'valueUS';
      unit = 'unitUS';
    }

    const valueLabel = _.get(spec, `content.properties.${value}`, null);
    let unitLabel = _.get(spec, `content.properties.${unit}`, null) || '';

    if (unitLabel === 'ps') {
      unitLabel = 'PS';
    }

    if (_.isNil(valueLabel)) return null;
    return _.trim(`${valueLabel} ${unitLabel}`);
  };

  const dataSpecs = _.get(data, 'properties.specifications.items', []);

  let showInBannerSpecs = _.filter(dataSpecs, (spec) => {
    const showInBanner = _.get(spec, 'content.properties.showInBanner', null);
    const title = _.get(spec, 'content.properties.title', '');
    return showInBanner === true && title !== 'Engine manufacturer';
  });

  if (showInBannerSpecs.length < 3) {
    const featuredSpecs = _.filter(dataSpecs, (spec) => {
      const featured = _.get(spec, 'content.properties.featured', false);
      const title = _.get(spec, 'content.properties.title', '');
      return featured && title !== 'Engine manufacturer';
    });

    showInBannerSpecs = _.unionBy(showInBannerSpecs, featuredSpecs, 'content.id');
  }

  const hasEngineManufacturer = _.some(
    dataSpecs,
    (spec) => _.get(spec, 'content.properties.title') === 'Engine manufacturer',
  );

  let slicedSpecs = [];
  if (hasEngineManufacturer) {
    slicedSpecs = showInBannerSpecs.slice(0, 2);
  } else {
    slicedSpecs = showInBannerSpecs.slice(0, 3);
  }

  return (
    <section id={id} className="relative bg-white px-4 pt-[100px] lg:pt-[151px] 4xl:px-0">
      <div className="relative mx-auto h-[500px] max-w-[1520px] overflow-hidden md:h-[820px]">
        {_.isEmpty(heroImages) || (
          <Image
            src={heroImages.url}
            alt={heroImages.name}
            priority
            fill
            className="!absolute hidden h-full w-full object-cover sm:block"
          />
        )}
        {_.isEmpty(mobileBanner) || (
          <Image
            src={mobileBanner.url}
            alt={mobileBanner.name}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            fill
            className="!absolute block h-full w-full object-cover sm:hidden"
          />
        )}
        {_.isEmpty(bannerVideo) || (
          <video
            src={bannerVideo.url}
            loop
            muted
            autoPlay
            playsInline
            className="video-wrapper absolute aspect-video h-full w-full rounded-md object-cover"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              minHeight: '64vh',
              minWidth: '177.77vh',
              height: '56.25vw',
            }}
          />
        )}

        <div className="absolute left-0 right-0 top-0 z-[5] h-[40%] w-full bg-gradient-to-b from-primary-25 to-transparent opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 z-[5] h-[40%] w-full bg-gradient-to-t from-primary-25 to-transparent opacity-40" />

        {/* <div className="absolute bottom-0 left-0 right-0 top-0 z-[5] h-full w-full bg-gradient-radial from-primary-0 to-primary-25" /> */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative z-10 flex h-full w-full flex-col justify-between p-[15px] md:p-[30px] lg:p-[60px]">
          <div className="flex flex-col gap-y-[20px]">
            <div className="flex flex-col gap-y-[12px]">
              <div className="flex flex-row items-center gap-4">
                <h1 className="promo-font text-[40px] font-medium uppercase leading-[35px] text-white lg:text-[64px] lg:leading-[54px]">
                  {title}
                </h1>
                {isEmpty(data.properties.productTag) || (
                  <div className="flex flex-wrap gap-1.5">
                    {map(data.properties.productTag, (productTag, productTagIndex) => (
                      <div
                        key={productTagIndex}
                        className={`${productTag === 'New' ? 'bg-[#CC9E00] uppercase' : 'bg-[#71A330]'} flex h-fit items-center justify-center rounded-[4px] px-3 py-1.5 font-noto text-[13px] font-medium text-white`}>
                        {getTranslationByKey(productTag, translations, lang)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {_.isEmpty(series) || (
                <h4 className="font-noto text-[16px] font-normal leading-[26px] text-white lg:text-[18px] lg:leading-[32px]">
                  {getTranslationByKey(series, translations, lang)}{' '}
                  {category === 'Tractors' ? (
                    <>, {getTranslationByKey(subCategory, translations, lang)}</>
                  ) : (
                    ''
                  )}
                  {category === 'Tractors' ? (
                    <> {getTranslationByKey(category, translations, lang)}</>
                  ) : (
                    ''
                  )}
                </h4>
              )}
              {category === 'Diesel Engines' ? (
                <h4 className="font-noto text-[16px] font-normal leading-[26px] text-white lg:text-[18px] lg:leading-[32px]">
                  {getTranslationByKey(category, translations, lang)}
                </h4>
              ) : (
                ''
              )}

              {_.isEmpty(productCategory) || (
                <h4 className="font-noto text-[16px] font-normal leading-[26px] text-white lg:text-[18px] lg:leading-[32px]">
                  {getTranslationByKey(productCategory, translations, lang)}
                </h4>
              )}
            </div>

            {_.isEmpty(requestQuote) ||
              (configureParentProducts ? (
                <Button
                  label={requestQuote.title}
                  clickHandler={openModal}
                  variant="primaryCherry"
                  text="!w-[160px] !min-h-[40px] !h-[40px] !text-[13px] product-details-banner-request-quote"
                />
              ) : (
                <Button
                  label={requestQuote.title}
                  url={`${requestQuote.url}?category=${category}&model=${title}`}
                  variant="primaryCherry"
                  text="!w-[160px] !min-h-[40px] !h-[40px] !text-[13px] product-details-banner-request-quote"
                />
              ))}
          </div>

          <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 md:gap-[40px] lg:gap-x-[90px]">
            {_.isEmpty(engineLogo) || (
              <div className="flex flex-col justify-center gap-y-1 md:gap-y-[8px]">
                <div className="w-[120px] md:w-[170px]">
                  <Image
                    src={engineLogo.url}
                    alt="Engine Manufacturer"
                    fill
                    className={`!relative flex items-center !object-contain ${engineLogo.name === 'Deutz White V3@2X' || engineLogo.name === 'Deutz White' ? '!h-[60px] !w-[60px] md:!h-[100px] md:!w-[100px]' : '!h-[30px] !w-auto md:!h-[40px]'}`}
                  />
                </div>
                <p className="font-noto text-[15px] font-normal leading-[26px] text-white lg:text-[18px] lg:leading-[32px]">
                  {getTranslationByKey('Engine manufacturer', translations, lang)}
                </p>
              </div>
            )}

            {_.map(slicedSpecs, (val, index) => {
              const valueText = _.get(val, 'content.properties.valueText', null);
              const valueMetric = _.get(val, 'content.properties.valueMetric', null);
              const labelValue = getLabelValue(val, lang);
              const powerTitle = _.get(val, 'content.properties.title', '');
              const category = _.get(data, 'properties.category', '');

              let displayValue;

              if (category === 'Diesel Engines' && powerTitle === 'Engine power') {
                if (lang === 'en') {
                  displayValue = `${valueMetric} hp`;
                } else if (lang === 'en-ko' || lang === 'ko') {
                  displayValue = `${valueMetric} PS`;
                } else {
                  displayValue = _.isNil(labelValue) ? valueText : labelValue;
                }
              } else {
                displayValue = _.isNil(labelValue) ? valueText : labelValue;
              }

              return (
                <div
                  key={_.get(val, 'content.properties.title') + index}
                  className="flex flex-col justify-end gap-y-1 md:gap-y-[8px]">
                  <h3 className="flex h-[30px] items-center font-noto text-[18px] font-bold leading-[20px] text-white md:h-auto lg:text-[21px] lg:leading-[24px]">
                    {displayValue} {_.get(val, 'content.properties.option1', null)}
                  </h3>
                  <p className="font-noto text-[15px] font-normal leading-[26px] text-white lg:text-[18px] lg:leading-[32px]">
                    {getTranslationByKey(
                      _.get(val, 'content.properties.title'),
                      translations,
                      lang,
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
      {!isEmpty(configureParentProducts) && isModalOpen && (
        <Modal parent={data} closeModal={closeModal} requestQuote={requestQuote} />
      )}
    </section>
  );
}
