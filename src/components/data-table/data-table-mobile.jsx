import _ from 'lodash';
import React, { useContext } from 'react';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

export default function DataTableMobile({ data }) {
  const { translations, lang } = useContext(GlobalContext);

  return (
    <div className="block md:hidden">
      {_.isEmpty(data.items) ||
        _.map(data.items, (item, index) => (
          <div key={index} className="border-b-[10px] border-b-porcelain">
            <div
              className="flex flex-row gap-x-2 bg-white px-2 py-2
              font-noto text-clamp14to18 leading-1.77 lg:leading-2">
              <span className="min-w-[100px] text-clamp14to15 font-semibold text-cherry">
                {getTranslationByKey('Modal', translations, lang)}
              </span>
              <span>{_.get(item, 'content.properties.model', '')}</span>
            </div>
            <div
              className="flex flex-row gap-x-2 bg-white px-2 py-2
              font-noto text-clamp14to18 leading-1.77 lg:leading-2">
              <span className="min-w-[100px] text-clamp14to15 font-semibold text-cherry">
                {getTranslationByKey('Type of Tire', translations, lang)}
              </span>
              <span>{_.get(item, 'content.properties.typeOfTire', '')}</span>
            </div>
            <div
              className="flex flex-row gap-x-2 bg-white px-2 py-2
              font-noto text-clamp14to18 leading-1.77 lg:leading-2">
              <span className="min-w-[100px] text-clamp14to15 font-semibold text-cherry">
                {getTranslationByKey('Front', translations, lang)}
              </span>
              <span>{_.get(item, 'content.properties.front', '')}</span>
            </div>
            <div
              className="flex flex-row gap-x-2 bg-white px-2 py-2
              font-noto text-clamp14to18 leading-1.77 lg:leading-2">
              <span
                className="min-w-[100px] text-clamp14to15 font-semibold
              text-cherry">
                {getTranslationByKey('Rear', translations, lang)}
              </span>
              <span>{_.get(item, 'content.properties.rear', '')}</span>
            </div>
          </div>
        ))}
    </div>
  );
}
