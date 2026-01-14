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
import { getProductBuildYourOwnLink, getProductLink } from '@/helpers/product-links';

function Item({ item, currProduct, index, handleClick, width }) {
  const { lang, translations } = useContext(GlobalContext);
  const itemRef = useRef();
  const isOpen = _.isEqual(item, currProduct);
  const { toggleCursor } = useHoverCursor();
  const selectedCategory = _.get(currProduct, 'properties.category', '');
  const isTractor = selectedCategory === 'Tractors';
  const model = _.get(currProduct, 'properties.title', '');
  const modelName = _.get(currProduct, 'name', '');
  const modelId = _.get(currProduct, 'properties.product3DId', '');
  const [offsetToLeft, setOffsetToLeft] = useState(0);
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));

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
  const excludeConfigureTractor = ['John Deere', 'ISEKI'];

  const shouldExcludeBtn = _.includes(
    excludeConfigureTractor,
    _.get(currProduct, 'properties.series', ''),
  );

  return (
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
        {_.isEmpty(item.properties.featuresImage) || (
          <Image
            src={item.properties.featuresImage[0].url}
            alt={item.properties.series}
            fill
            className="!relative !object-contain"
          />
        )}

        <div className="flex flex-col items-start gap-y-2.5">
          <h4 className="font-noto text-clamp18to21 font-bold leading-1.125 text-primary">
            <span className="uppercase">{item.properties.title}</span>
            {` ${getProductPower(item, isKO)}`}
          </h4>
          <p className="font-noto text-clamp14to15 text-primary">
            {`${getTranslationByKey(item.properties.series, translations, lang)}, ${getTranslationByKey(item.properties.subCategory, translations, lang)}
            ${getTranslationByKey(item.properties.category, translations, lang)}`}
          </p>
        </div>
      </button>
      {/* <ItemModal isOpen={isOpen} width={width} selected={currProduct} handleClick={handleClick} /> */}

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
            <div className="relative flex flex-col gap-y-3 bg-porcelain px-4 pb-4 before:absolute before:left-1/2 before:top-0 before:z-0 before:block before:w-full before:-translate-x-1/2 before:-translate-y-full before:bg-porcelain before:py-5 before:content-[''] md:gap-y-6 md:px-10 md:pb-10 before:md:py-9">
              <div className="flex flex-col gap-y-2 pt-10">
                <h4 className="z-10 font-noto text-clamp18to21 font-bold leading-1.125 text-primary">
                  <span className="uppercase">{currProduct.properties.title}</span>
                  {` ${getProductPower(currProduct, isKO)}`}
                </h4>
                <p className="font-noto text-clamp14to15 text-primary">
                  {currProduct.properties.shortDescription}
                </p>
              </div>
              <div className="flex flex-col gap-x-10 gap-y-2 md:flex-row md:gap-y-4">
                <Button
                  variant="primaryCherry"
                  text="application-tractors-showmore-button"
                  label={getTranslationByKey('SHOW MORE', translations, lang)}
                  url={getProductLink(currProduct)}
                  ariaLabel="application-tractors-showmore-button"
                />
                {isTractor && !shouldExcludeBtn && (
                  <Button
                    variant="primaryWhite"
                    text="application-tractors-configure-your-tractor-button"
                    label={getTranslationByKey('CONFIGURE YOUR TRACTOR', translations, lang)}
                    url={getProductBuildYourOwnLink(lang, modelName, modelId, true)}
                    ariaLabel="application-tractors-configure-your-tractor-button"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Item;
