import React, { useContext } from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

function HeaderDesktopProductsMenuInnerTractors({ selected, itemLabel, handleClick, currSeries }) {
  const { translations, lang } = useContext(GlobalContext);
  const items = _.get(currSeries, 'values', []);
  const first = _.head(items);
  const sideImage = _.get(first, 'properties.navigationSideImage[0]', null);
  const image = sideImage || _.get(first, 'properties.featuresImage[0]', null);

  const rangeKO = _.get(currSeries, 'rangeKO', '');
  const range = _.get(currSeries, 'range', '');

  const langMapping = {
    en: `${rangeKO}`,
    'en-us': rangeKO,
    'en-ko': rangeKO,
    ko: rangeKO,
  };

  return (
    <button
      type="button"
      data-selected={selected}
      onClick={() => handleClick(items)}
      className="flex h-[calc(33.33%-16px)] w-[calc(50%-16px)] flex-col items-start overflow-hidden
      transition-all duration-400 hover:bg-lightGrey data-[selected=true]:bg-lightGrey">
      <div className="flex h-full w-full flex-col justify-center gap-2 px-5 py-3
      header-products-inner-tractors-button">
        {_.isEmpty(image) || (
          <div className="relative !h-full !max-h-[130px] !min-h-[2rem]">
            <Image alt={image.name} src={image.url} fill className="!w-auto !object-contain" />
          </div>
        )}
        <span className="w-full text-left font-noto text-clamp12to15">
          {getTranslationByKey(itemLabel, translations, lang)} <br />
          {_.isNil(langMapping[lang]) || <span className="font-noto">{langMapping[lang]}</span>}
        </span>
      </div>
    </button>
  );
}

export default HeaderDesktopProductsMenuInnerTractors;
