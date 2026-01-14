import React, { useContext } from 'react';
import Link from 'next/link';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import Icons from '@/components/layout/icons';

export default function ItemRow({ item }) {
  const { lang, translations } = useContext(GlobalContext);
  const productModel = _.get(item, 'productModel', '');
  const productName = _.get(item, 'productName', '');
  const productCategory = _.get(item, 'productCategory', '');
  const productParentBrochure = _.get(item, 'properties.productParentBrochure', false);
  const technicalBrochureName = _.get(item, 'technicalBrochureName', '');
  const fileName = _.get(item, 'name', '');
  const fileVersion = _.get(item, 'properties.version', '');
  const url = _.get(item, 'url', null);

  if (_.isEmpty(item)) return null;

  return (
    <div className="w-full bg-porcelain px-2">
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px] font-noto text-clamp12to15
        font-normal leading-1.625 text-primary md:table-cell md:min-w-[195px] md:pb-[12px] md:pl-[20px]
        md:pt-[10px]">
        {productParentBrochure ? getTranslationByKey(productCategory, translations, lang) : (productModel || productName)}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px] font-noto
        text-clamp12to15 font-normal leading-1.625 text-primary md:table-cell md:w-[16%]
        md:pb-[12px] md:pt-[10px]">
        {technicalBrochureName
          ? getTranslationByKey('Product Brochure', translations, lang)
          : getTranslationByKey('Product Manual', translations, lang)}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px] font-noto
        text-clamp12to15 font-normal leading-1.625 text-primary md:table-cell md:w-[45%]
        md:pb-[12px] md:pt-[10px]">
        {fileName}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[5px] pt-[5px] font-noto
        text-clamp12to15 font-normal capitalize leading-1.625 text-primary md:table-cell md:w-[21%]
        md:pb-[12px] md:pt-[10px]">
        {getTranslationByKey('Version', translations, lang)}: {fileVersion}
      </div>
      <div
        className="block bg-porcelain px-[10px] pb-[15px] pr-[18.5px] pt-[5px] font-noto
        text-clamp12to15 font-normal leading-1.625 text-primary md:table-cell md:w-[10%]
        md:pb-[12px] md:pt-[10px]">
        {url && (
          <Link href={url} target="_blank" className="flex flex-row items-center gap-x-[10px] download-button">
            {getTranslationByKey('Download', translations, lang)} <Icons name="Download" />
          </Link>
        )}
      </div>
    </div>
  );
}
