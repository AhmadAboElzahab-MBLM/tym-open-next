import React, { useContext, useState, useEffect } from 'react';
import _, { isEmpty } from 'lodash';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import { getProductBuildYourOwnLink } from '@/helpers/product-links';
import BoxedContainer from './layout/boxed-container';
import Icons from './layout/icons';

function Modal({ closeModal, parent, configure = false }) {
  const { lang } = useContext(GlobalContext);
  const title = _.get(parent, 'properties.title', '');
  const children = _.get(parent, 'properties.configureParentProducts', []);

  return (
    <div
      className="fixed top-0 z-[100] flex h-screen w-full items-center justify-center bg-[#E5E5E5]
      bg-opacity-50">
      <div
        className="h-fit w-[90vw] border-grey bg-white md:min-h-[526px] md:w-auto md:min-w-[596px]
        ">
        <div
          className="flex flex-row justify-between gap-2 border-b border-b-grey p-5 pb-5 md:p-12
          md:pb-10">
          <h4 className="font-noto text-[12px] font-bold uppercase tracking-wider md:text-[15px]">
            {`${title} tractor model variations:`}
          </h4>
          <button type="button" onClick={closeModal} className="close-button">
            <Icons name="Close" />
          </button>
        </div>

        <div className="flex flex-col gap-8 p-5 md:flex-row md:p-12">
          {_.map(children, (item, index) => {
            const featuredImage = _.get(parent, 'properties.featuresImage[0]', {});
            const itemTitle = _.get(item, 'name', '');
            const modelId = _.get(item, 'properties.product3DId', '');
            const itemDescription = _.get(parent, 'properties.shortDescription', '');

            const itemUrl = getProductBuildYourOwnLink(lang, itemTitle, modelId, configure);
            return (
              <Link
                href={itemUrl}
                target="_blank"
                key={index}
                className="flex w-full max-w-[256px] flex-col gap-y-2 md:gap-y-5">
                {_.isEmpty(featuredImage) || (
                  <div className="w-full">
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.name}
                      fill
                      className="!relative mx-auto !h-auto max-h-[260px] !w-auto
                      object-cover md:max-h-[243px]"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-y-[5px] md:gap-y-[10px]">
                  <h3
                    className="font-noto text-[18px] font-bold leading-[24px] text-primary
                    md:text-[21px]">
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

export default function SecondaryNav({ id, data }) {
  const { translations, lang } = useContext(GlobalContext);
  const [configure, setConfigure] = useState(false);
  const allLinks = _.get(data, 'properties.links', []);
  const configureParentProducts = _.get(data, 'properties.configureParentProducts', false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const series = _.get(data, 'properties.series', '');
  const isJohnDeere = _.isEqual(series, 'John Deere');
  const isParent = !_.isEmpty(configureParentProducts);
  const links = isParent ? _.drop(allLinks, 2) : allLinks;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isModalOpen]);

  return (
    <section id={id}>
      <BoxedContainer>
        {_.isEmpty(links) || (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-x-[15px] gap-y-[15px] pb-[25px] pt-[20px]
            sm:pb-[33px] sm:pt-[30px] xl:gap-x-[44px]">
            {isJohnDeere || !isParent || (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setConfigure(true);
                    openModal();
                  }}
                  className="flex w-full flex-row items-center gap-x-[8px] sm:w-[calc(50%-12px)]
                  md:w-[calc(20%-12px)] lg:gap-x-[12px] xl:w-fit">
                  <Icons name="ArrowRight" className="min-w-[14px]" />
                  <span className="font-noto text-clamp14to15 font-bold leading-1.375 text-primary">
                    {getTranslationByKey('Build My Tractor', translations, lang)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfigure(false);
                    openModal();
                  }}
                  className="flex w-full flex-row items-center gap-x-[8px] sm:w-[calc(50%-12px)]
                  md:w-[calc(20%-12px)] lg:gap-x-[12px] xl:w-fit">
                  <Icons name="ArrowRight" className="min-w-[14px]" />
                  <span className="font-noto text-clamp14to15 font-bold leading-1.375 text-primary">
                    {getTranslationByKey('Explore Tractor in 3D', translations, lang)}
                  </span>
                </button>
              </>
            )}
            {_.map(links, (item, index) => {
              resolveInternalLinks(item, lang);
              const itemUrl = _.get(item, 'url', _.get(item, 'route.path', '#'));
              const itemTarget = item.target || '_self';
              const itemTitle =
                item.title === 'Attachments'
                  ? 'Compatible Attachments'
                  : item.title === 'Configure Your Tractor'
                    ? 'Build My Tractor'
                    : item.title;
              const tractorModel = _.get(data, 'properties.title', null) || _.get(data, 'name', '');
              const queryString = _.endsWith(itemUrl, 'attachments/')
                ? `?model=${tractorModel}`
                : '';

              return (
                <div
                  key={index}
                  className="flex w-full flex-row items-center gap-x-[8px] font-noto
                  sm:w-[calc(50%-12px)] md:w-[calc(20%-12px)] lg:gap-x-[12px] xl:w-fit">
                  <Icons name="ArrowRight" className="min-w-[14px]" />
                  <Link
                    href={itemUrl + queryString}
                    target={itemTarget}
                    className="font-notosans text-clamp14to15 font-bold leading-1.375 text-primary">
                    {itemTitle}
                  </Link>
                </div>
              );
            })}
          </motion.div>
        )}
        {!isEmpty(links) && <div className="h-[1px] w-full bg-cherry" />}
      </BoxedContainer>
      {isParent && isModalOpen && (
        <Modal parent={data} closeModal={closeModal} configure={configure} />
      )}
    </section>
  );
}
