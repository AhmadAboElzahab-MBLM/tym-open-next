import React, { useContext } from 'react';
import _ from 'lodash';
import Icons from '@/components/layout/icons';
import Image from 'next/image';
import Button from '@/components/layout/button';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { getProductPower } from '@/helpers/product-handlers';

function ItemModal({ selected, handleClose, width, isOpen }) {
  const { translations, lang } = useContext(GlobalContext);
  const handleCloseModal = () => handleClose();

  resolveInternalLinks(selected, lang);

  const getPowerValue = (_item) => {
    const specs = _.get(_item, 'properties.specifications.items', []);
    const product = _.find(specs, (val) => _.isEqual(val.content.properties.title, 'Engine power'));
    return product?.content?.properties?.valueText || '';
  };

  const handleScroll = () => {
    const el = document.getElementById('request-a-quote-form');
    const isElObject = typeof el === 'object';
    const isHtmlEl = el.constructor && el.constructor.name === 'HTMLDivElement';

    if (isElObject && isHtmlEl) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    isOpen && (
      <div style={{ width: width ? `${width}px` : 'auto' }} className="z-20 mt-10">
        <div className="relative flex w-full flex-col gap-y-3 bg-white pt-12">
          <button type="button" className="absolute right-4 top-4" onClick={handleCloseModal}>
            <Icons name="Close" />
          </button>

          {_.isEmpty(selected.properties.highlightSpecificationThumbnail) || (
            <div className="flex flex-row gap-x-1 pl-3 md:pl-8 lg:w-[calc(100%-40px)]">
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
            className="relative flex flex-col gap-y-5 bg-porcelain px-5 pb-5 before:absolute
            before:left-1/2 before:top-0 before:z-0 before:block before:w-full
            before:-translate-x-1/2 before:-translate-y-full before:bg-porcelain before:py-9
            before:content-[''] md:px-10 md:pb-10">
            <div className="flex flex-col gap-y-[10px]">
              <h4 className="z-10 font-noto text-clamp18to21 font-bold leading-1.125">
                <span className="uppercase">{selected.properties.title}</span>{' '}
                {`${getProductPower(selected)}`}
              </h4>
              <p className="font-noto text-clamp14to15">{selected.properties.shortDescription}</p>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 md:flex-row">
              <Button
                variant="primaryCherry"
                label={getTranslationByKey('ADD YOUR INFO', translations, lang)}
                clickHandler={handleScroll}
              />
              <Button
                variant="primaryWhite"
                label={getTranslationByKey('SHOW DETAILS', translations, lang)}
                url={selected.route.path}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
}
export default ItemModal;
