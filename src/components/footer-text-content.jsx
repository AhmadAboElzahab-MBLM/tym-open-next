import React, { useContext } from 'react';
import resolveTextInternalLinks from '@/helpers/resolve-text-url-locale';
import GlobalContext from '@/context/global-context';
import BoxedContainer from './layout/boxed-container';

export default function FooterTextContent({ data }) {
  const { lang } = useContext(GlobalContext);
  const content = _.get(data, 'properties.textContent.markup', null);
  return (
    content && (
      <BoxedContainer variant="default" className="html-content">
        <div
          className="kr-text mt-4 flex w-full flex-col gap-y-4 border-t border-t-cherry pt-4 font-noto text-clamp14to18 leading-1.77
    text-primary p-a-child:font-[600] p-a-child:text-cherry p-a-child:underline
    h3-child:font-sans h3-child:text-clamp20to28 h3-child:font-bold h3-child:uppercase
    h3-child:leading-1.42 ul-child:pl-5 li-child:list-disc
  p-ul-child:pl-5 p-li-child:list-disc table:!h-auto table-tr:!h-full
  table-td:!h-fit table-td:border-t-[1px] table-td:border-[#ccc] table-td:!p-5
  table-td:pb-2 table-td:pr-4 table-td:font-noto
  table-td:text-clamp12to15 table-td:first:border-t-transparent table-td:last:border-b-[1px]
  table-td-strong:text-cherry table-td-ul:pl-4 table-td-li:list-disc p-child-iframe:min-h-[700px] md:mt-8
  md:gap-y-10 md:pt-8 footer-text-content"
          dangerouslySetInnerHTML={{ __html: resolveTextInternalLinks(content, lang) }}
        />
      </BoxedContainer>
    )
  );
}
