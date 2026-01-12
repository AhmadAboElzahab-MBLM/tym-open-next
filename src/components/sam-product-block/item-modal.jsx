import React, { useRef } from 'react';
import _ from 'lodash';
import Icons from '@/components/layout/icons';
import Image from 'next/image';
import Button from '@/components/layout/button';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import useOutsideClick from '@/hooks/use-outside-click';
import { getTranslationByKey } from '@/utils/translation-helper';
import { getProductPower } from '@/helpers/product-handlers';
import { usePathname } from 'next/navigation';

function ItemModal({ isOpen, selected, handleClick, width, lang }) {
  const ref = useRef(null);
  useOutsideClick(ref, () => handleClick({}, 'remove'));
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));

  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      style={{ width: width ? `${width}px` : 'auto' }}
      className="absolute left-1/2 z-20 w-full -translate-x-1/2 translate-y-4 shadow-2xl">
      <div className="relative flex w-full flex-col gap-y-3 bg-white pt-12">
        <button
          type="button"
          className="absolute right-4 top-4 z-10 close-button"
          onClick={() => handleClick({}, 'remove')}>
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
          className="relative flex flex-col gap-y-3 md:gap-y-6 bg-porcelain
          px-4 pb-4 before:absolute before:left-1/2 before:top-0 before:z-0
          before:block before:w-full before:-translate-x-1/2 before:-translate-y-full before:bg-porcelain
          before:py-5 before:md:py-9 before:content-[''] md:px-10 md:pb-10">
          <div className="flex flex-col gap-y-2">
            <h4 className="z-10 font-noto text-clamp18to21 font-bold uppercase leading-1.125">
              {`${selected.properties.title} ${getProductPower(selected, isKO)}`}
            </h4>
            <p className="font-noto text-clamp14to15">{selected.properties.shortDescription}</p>
          </div>
          <div className="flex flex-col gap-x-10 gap-y-2 md:gap-y-4 md:flex-row">
            {_.isEmpty(selected.route.path) || (
              <>
                {resolveInternalLinks(selected, lang)}
                <Button
                  variant="primaryCherry"
                  text="sam-product-show-more-button"
                  label={getTranslationByKey('SHOW MORE')}
                  url={selected.route.path}
                />
              </>
            )}

            {_.isEmpty(selected.properties.links) || (
              <Button
                variant="primaryWhite"
                text="sam-product-configure-your-tractor-button"
                label={getTranslationByKey('CONFIGURE YOUR TRACTOR')}
                url={selected.properties.links[0].url}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
