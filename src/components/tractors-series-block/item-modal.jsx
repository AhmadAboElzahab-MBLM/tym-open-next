import React, { useContext, useRef } from 'react';
import _ from 'lodash';
import Icons from '@/components/layout/icons';
import Image from 'next/image';
import Button from '@/components/layout/button';
import useOutsideClick from '@/hooks/use-outside-click';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { getProductBuildYourOwnLink, getProductLink } from '@/helpers/product-links';

function ItemModal({ isOpen, selected, handleClick, width }) {
  const { translations, lang } = useContext(GlobalContext);
  resolveInternalLinks(selected, lang);
  const selectedCategory = _.get(selected, 'properties.category', '');
  const isTractor = selectedCategory === 'Tractors';
  const model = _.get(selected, 'properties.title', '');
  const modelName = _.get(selected, 'name', '');
  const modelId = _.get(selected, 'properties.product3DId', '');

  const ref = useRef(null);
  useOutsideClick(ref, () => handleClick({}, 'remove'));

  if (!isOpen) return null;
  const getPowerValue = (_item) => {
    const specs = _.get(_item, 'properties.specifications.items', []);
    const product = _.find(specs, (val) => _.isEqual(val.content.properties.title, 'Engine power'));
    return product?.content?.properties?.valueText
      ? `(${product?.content?.properties?.valueText})`
      : '';
  };
  return (
    <div
      ref={ref}
      style={{ width: width ? `${width}px` : 'auto' }}
      className="absolute left-1/2 z-20 -translate-x-1/2 translate-y-4">
      <div className="relative flex w-full flex-col gap-y-3 bg-white pt-12">
        <button
          type="button"
          className="absolute right-4 top-4 z-10"
          onClick={() => handleClick({}, 'remove')}>
          <Icons name="Close" />
        </button>
        {_.isEmpty(selected.properties.highlightSpecificationThumbnail) || (
          <div className="-mb-3 flex flex-row justify-center gap-x-1 pl-8 lg:w-[calc(100%-40px)]">
            {_.map(
              selected.properties.highlightSpecificationThumbnail,
              (selectedThumbnail, selectedIndex) =>
                _.isEmpty(selectedThumbnail) || (
                  <Image
                    key={selectedIndex}
                    src={selectedThumbnail.url}
                    alt={selected.properties.title}
                    fill
                    className={`!relative !z-10 !object-contain ${
                      selectedIndex === 1 ? 'max-w-[40%]' : 'max-w-[30%]'
                    }`}
                  />
                ),
            )}
          </div>
        )}
        <div
          className="relative flex flex-col justify-end gap-y-6
          bg-porcelain px-5 pb-5 before:absolute before:left-1/2 before:top-0 before:z-0 before:block
          before:w-full before:-translate-x-1/2 before:-translate-y-full before:bg-porcelain before:py-8 before:content-['']
          md:px-10 md:pb-10 lg:min-h-[191px]">
          <div className="flex flex-col gap-y-2">
            <h4 className="z-10 font-noto text-clamp18to21 font-bold uppercase leading-1.125">
              {`${selected.properties.title} ${getPowerValue(selected)}`}
            </h4>
            <p className="font-noto text-clamp12to15">{selected.properties.shortDescription}</p>
          </div>
          <div className="flex flex-col gap-x-10 gap-y-4 md:flex-row">
            <Button
              variant="primaryCherry"
              text="tractors-series-show-more-button"
              label={getTranslationByKey('SHOW MORE', translations, lang)}
              url={getProductLink(selected)}
            />
            {isTractor && (
              <Button
                variant="primaryWhite"
                text="tractors-series-configure-your-tractor-button"
                label={getTranslationByKey('CONFIGURE YOUR TRACTOR', translations, lang)}
                url={getProductBuildYourOwnLink(lang, modelName, modelId, true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
