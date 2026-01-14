import React, { useContext, useEffect, useRef, useState } from 'react';
import _, { map, isEmpty } from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Icons from '@/components/layout/icons';
import Button from '@/components/layout/button';
import useHoverCursor from '@/hooks/use-hover-cursor';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { getProductPower } from '@/helpers/product-handlers';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getProductBuildYourOwnLink, getProductLink } from '@/helpers/product-links';

function Modal({ closeModal, parent, configure = false }) {
  const { lang } = useContext(GlobalContext);
  const title = _.get(parent, 'properties.title', '');
  const children = _.get(parent, 'properties.configureParentProducts', []);

  return (
    <div
      className="fixed inset-0 top-0 z-[100] flex h-screen w-full items-center justify-center
      bg-[#E5E5E5] bg-opacity-50">
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
                key={index}
                target="_blank"
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

function Item({ item, currProduct, index, handleClick, width }) {
  const { lang, translations } = useContext(GlobalContext);
  const itemRef = useRef();
  const isOpen = _.isEqual(item, currProduct);
  const { toggleCursor } = useHoverCursor();
  const selectedCategory = _.get(currProduct, 'properties.category', '');
  const isTractor = selectedCategory === 'Tractors';
  const model = _.get(currProduct, 'name', '');
  const modelId = _.get(currProduct, 'properties.product3DId', '');
  const configureParentProducts = _.get(item, 'properties.configureParentProducts', '');
  const [offsetToLeft, setOffsetToLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configure, setConfigure] = useState(false);

  const calculateOffsetLeft = (el) => {
    const currentElement = el;
    const { parentElement } = currentElement;
    const cardRect = currentElement.getBoundingClientRect();
    const gridRect = parentElement.getBoundingClientRect();
    const offsetLeft = cardRect.left - gridRect.left;

    setOffsetToLeft(offsetLeft);
    handleClick(item, 'add');
  };

  resolveInternalLinks(currProduct, lang);

  useEffect(() => {
    toggleCursor(false);

    return () => toggleCursor(false);
  }, []);
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));

  const excludeConfigureTractor = ['John Deere', 'ISEKI'];

  const shouldExcludeBtn = _.includes(
    excludeConfigureTractor,
    _.get(currProduct, 'properties.series', ''),
  );
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isModalOpen]);

  return (
    <>
      <motion.div
        ref={itemRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="w-full xs:w-[calc(50%-1rem)] sm:w-[calc(33%-1.25rem)] lg:w-[calc(25%-1.5rem)]">
        <button
          type="button"
          key={index}
          disabled={_.isEqual(item, currProduct)}
          className="flex w-full flex-col gap-y-5 hover:opacity-50 disabled:opacity-50"
          onMouseEnter={() => toggleCursor(true)}
          onMouseLeave={() => toggleCursor(false)}
          onClick={() => calculateOffsetLeft(itemRef.current)}>
          <div className="flex flex-col justify-end gap-y-2 md:min-h-[292px]">
            {_.isEmpty(item.properties.productTag) || (
              <div className="flex flex-wrap gap-1.5">
                {_.map(item.properties.productTag, (productTag, productTagIndex) => (
                  <div
                    key={productTagIndex}
                    className={`${
                      productTag === 'New' ? 'bg-[#CC9E00] uppercase' : 'bg-[#71A330]'
                    } flex items-center justify-center rounded-[4px] px-3 py-1.5 
                    font-noto text-[13px] font-medium text-white`}>
                    {getTranslationByKey(productTag, translations, lang)}
                  </div>
                ))}
              </div>
            )}

            {_.isEmpty(item.properties.featuresImage) || (
              <Image
                src={item.properties.featuresImage[0].url}
                alt={item.properties.series}
                fill
                className="!relative !object-contain md:min-h-[256px]"
              />
            )}
          </div>

          <div className="flex flex-col items-start gap-y-2.5">
            <div className="flex flex-row gap-2">
              <h4 className="font-noto text-clamp18to21 font-bold leading-1.125 text-primary">
                <span className="uppercase">{item.properties.title}</span>
                {` ${getProductPower(item, isKO)}`}
              </h4>
            </div>

            <p className="w-[80%] text-left font-noto text-clamp14to15 text-primary md:w-full">
              {`${getTranslationByKey(item.properties.series, translations, lang)}, 
              ${getTranslationByKey(item.properties.subCategory, translations, lang)}
            ${getTranslationByKey(item.properties.category, translations, lang)}`}
            </p>
          </div>
        </button>

        <div
          className={`${isOpen ? 'flex' : 'hidden'} mt-10`}
          style={{
            width: width ? `${width}px` : 'auto',
            transform: `translateX(-${offsetToLeft}px)`,
          }}>
          <div className="relative flex w-full flex-col gap-y-3 bg-white pt-12">
            <button
              type="button"
              className="close-button absolute right-4 top-4 z-10"
              onClick={() => handleClick({}, 'remove')}>
              <Icons name="Close" />
            </button>
            {currProduct &&
              currProduct.properties &&
              currProduct.properties.highlightSpecificationThumbnail && (
                <div className="flex flex-row gap-x-1 pl-3 md:pl-8 lg:w-[calc(100%-40px)]">
                  {map(
                    currProduct.properties.highlightSpecificationThumbnail,
                    (selectedThumbnail, selectedIndex) =>
                      isEmpty(selectedThumbnail) || (
                        <Image
                          key={selectedIndex}
                          src={selectedThumbnail.url}
                          alt={currProduct.properties.title}
                          fill
                          className={`!relative !z-10 !object-contain ${
                            selectedIndex === 1 ? 'max-w-[40%]' : 'max-w-[30%]'
                          }`}
                        />
                      ),
                  )}
                </div>
              )}
            {currProduct && currProduct.properties && (
              <div
                className="relative flex flex-col gap-y-3 bg-porcelain px-4
              pb-4 before:absolute before:left-1/2 before:top-0 before:z-0 before:block
              before:w-full before:-translate-x-1/2 before:-translate-y-full 
              before:bg-porcelain before:py-5 before:content-[''] md:gap-y-6 md:px-10 
              md:pb-10 before:md:py-9">
                <div className="flex flex-col gap-y-2">
                  <div className="flex flex-row items-center gap-2">
                    <h4
                      className="z-10 font-noto text-clamp18to21 font-bold leading-1.125
                text-primary">
                      <span className="uppercase">{currProduct.properties.title}</span>{' '}
                      {` ${getProductPower(currProduct, isKO)}`}
                    </h4>
                    {_.isEmpty(item.properties.productTag) || (
                      <div className="flex flex-wrap gap-1.5">
                        {_.map(item.properties.productTag, (productTag, productTagIndex) => (
                          <div
                            key={productTagIndex}
                            className={`${
                              productTag === 'New' ? 'bg-[#CC9E00] uppercase' : 'bg-[#71A330]'
                            } flex items-center justify-center rounded-[4px] px-3 py-1.5 
                            font-noto text-[13px] font-medium text-white`}>
                            {getTranslationByKey(productTag, translations, lang)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="font-noto text-clamp14to15 text-primary">
                    {currProduct.properties.shortDescription}
                  </p>
                </div>
                <div className="flex flex-col gap-x-10 gap-y-2 md:flex-row md:gap-y-4">
                  <Button
                    variant="primaryCherry"
                    text="series-tractors-list-show-more-button"
                    label={`${getTranslationByKey('SHOW MORE', translations, lang)}`}
                    url={getProductLink(currProduct)}
                  />
                  {configureParentProducts === null && isTractor && !shouldExcludeBtn && (
                    <Button
                      variant="primaryWhite"
                      target="_blank"
                      label={getTranslationByKey('CONFIGURE YOUR TRACTOR', translations, lang)}
                      url={getProductBuildYourOwnLink(lang, model, modelId, configure)}
                    />
                  )}
                  {configureParentProducts !== null && isTractor && !shouldExcludeBtn && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfigure(false);
                        openModal();
                      }}
                      className="inline-flex min-h-[45px] cursor-pointer items-center justify-center 
                      whitespace-pre border border-none bg-white px-[32px] py-[12px] 
                      text-clamp14to15 font-bold uppercase not-italic leading-1.625 text-primary 
                      transition-all duration-300 ease-in-out hover:!border hover:!border-b-white 
                      hover:!bg-mercury hover:text-primary disabled:pointer-events-none 
                      disabled:opacity-10 md:px-[60px] md:py-[20px] lg:min-h-[64px] 
                      lg:px-[85px]">
                      {getTranslationByKey('CONFIGURE YOUR TRACTOR', translations, lang)}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {configureParentProducts && isModalOpen && (
        <Modal parent={item} closeModal={closeModal} configure={configure} />
      )}
    </>
  );
}

export default Item;
