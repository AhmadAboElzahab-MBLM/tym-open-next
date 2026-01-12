import _ from 'lodash';
import React, { useContext } from 'react';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

export default function DataTableDesktop({ data }) {
  const { translations, lang } = useContext(GlobalContext);

  return (
    <div className="hidden md:block">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th
              className="text-clamp15to18 px-2 pb-4 text-left font-noto
            font-semibold text-cherry">
              {getTranslationByKey('Model', translations, lang)}
            </th>
            <th
              className="text-clamp15to18 px-2 pb-4 text-left font-noto
            font-semibold text-cherry">
              {getTranslationByKey('Type of Tire', translations, lang)}
            </th>
            <th
              className="text-clamp15to18 px-2 pb-4 text-left font-noto
            font-semibold text-cherry">
              {getTranslationByKey('Front', translations, lang)}
            </th>
            <th
              className="text-clamp15to18 px-2 pb-4 text-left font-noto
            font-semibold text-cherry">
              {getTranslationByKey('Rear', translations, lang)}
            </th>
          </tr>
        </thead>
        <tbody>
          {_.isEmpty(data.items) ||
            _.map(data.items, (item, index) => (
              <tr key={index} className="border-b-[10px] border-b-porcelain">
                <td
                  className="bg-white px-2 py-4 font-noto text-clamp14to18 leading-1.77
              lg:leading-2">
                  {item?.content?.properties?.model}
                </td>
                <td
                  className="bg-white px-2 py-4 font-noto text-clamp14to18 leading-1.77
              lg:leading-2">
                  {item?.content?.properties?.typeOfTire}
                </td>
                <td
                  className="bg-white px-2 py-4 font-noto text-clamp14to18 leading-1.77
              lg:leading-2">
                  {item?.content?.properties?.front}
                </td>
                <td
                  className="bg-white px-2 py-4 font-noto text-clamp14to18 leading-1.77
              lg:leading-2">
                  {item?.content?.properties?.rear}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
