import React, { useContext } from 'react';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';

export default function Card({ item }) {
  const { translations, lang } = useContext(GlobalContext);
  return (
    <div
      className="flex flex-col gap-y-5 border border-grey border-b-transparent
      p-5 last:border-b-grey lg:p-10 lg:pb-[47px]">
      <h3
        className="flex font-noto text-clamp14to18 font-bold leading-1.77 text-primary"
        dangerouslySetInnerHTML={{
          __html: `${getTranslationByKey(item.content.properties.category, translations, lang)}:&nbsp;
        ${item.content.properties.title?.markup}`,
        }}
      />

      <div
        className="text-primary table:!h-auto table-tr:!h-full
        table-td:!h-fit table-td:pb-2 table-td:pr-4 table-td:font-noto
        table-td:text-clamp12to15 table-td-strong:text-cherry table-td-ul:pl-4 table-td-li:list-disc"
        dangerouslySetInnerHTML={{ __html: item.content.properties.description?.markup }}
      />
    </div>
  );
}
