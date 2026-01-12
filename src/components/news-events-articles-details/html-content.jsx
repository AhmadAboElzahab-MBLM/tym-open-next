import React, { useContext } from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import resolveTextInternalLinks from '@/helpers/resolve-text-url-locale';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';

function HtmlContent({ data = null }) {
  const { lang } = useContext(GlobalContext);
  const content = _.get(data, 'properties.content.markup', null);
  const updatedText = resolveTextInternalLinks(content, lang);

  return (
    content && (
      <BoxedContainer variant="default" className="html-content">
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .html-content-article strong {
              font-weight: 700 !important;
            }
            .html-content-article strong a {
              font-weight: 700 !important;
            }
            .html-content-article a strong {
              font-weight: 700 !important;
            }
          `,
          }}
        />
        <div
          className="kr-text html-content-article flex w-full flex-col gap-y-4 pt-8 font-noto text-clamp14to18 leading-1.77 text-primary p-a-child:font-[600] p-a-child:text-black p-a-child:underline a-child:text-black h3-child:font-sans h3-child:text-clamp20to28 h3-child:font-bold h3-child:uppercase h3-child:leading-1.42 ul-child:pl-5 li-child:list-disc p-ul-child:pl-5 p-li-child:list-disc table:!h-auto table-tr:!h-full table-td:!h-fit table-td:border-t-[1px] table-td:border-[#ccc] table-td:!p-5 table-td:pb-2 table-td:pr-4 table-td:font-noto table-td:text-clamp12to15 table-td:first:border-t-transparent table-td:last:border-b-[1px] table-td-strong:text-cherry table-td-ul:pl-4 table-td-li:list-disc p-child-iframe:min-h-[700px]"
          dangerouslySetInnerHTML={{ __html: updatedText }}
        />
      </BoxedContainer>
    )
  );
}

export default HtmlContent;
