import React, { useContext } from 'react';
import _ from 'lodash';
import resolveTextInternalLinks from '@/helpers/resolve-text-url-locale';
import GlobalContext from '@/context/global-context';
import { usePathname } from 'next/navigation';
import BoxedContainer from './layout/boxed-container';

export default function Faq({ id, data }) {
  const { lang } = useContext(GlobalContext);
  const pathname = usePathname();
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const isTop = _.get(data, 'properties.isTop', false);
  const isPrivacyPolicy = pathname.includes('privacy-policy');

  return (
    <section
      id={id}
      className={` bg-white
    ${isTop ? 'pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]' : 'pt-[60px] md:pt-[80px]'}`}>
      <BoxedContainer>
        <div
          className={`flex flex-col gap-y-[25px]
        ${isPrivacyPolicy ? '' : 'lg:gap-y-[52px]'}
        `}>
          <div
            className={`flex flex-col gap-y-3 md:gap-y-[20px] lg:gap-y-[32px]
            ${isPrivacyPolicy ? 'max-w-full' : 'max-w-[832px]'}`}>
            {_.isEmpty(title) || (
              <div
                className="text-clamp32to48 font-bold uppercase leading-[112%] text-[#000]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className={`font-noto  font-normal leading-[177%] text-[#000]
                h4-child:pb-2 h4-child:font-noto h4-child:text-clamp18to22 h4-child:font-bold
                ul-child:pb-4 ul-child:pl-5 li-child:list-disc h4-child:md:pb-[10px]
                ul-child:md:pb-6 ul-child:md:pl-7
                ${isPrivacyPolicy ? 'text-clamp12to15' : 'text-clamp14to18'}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          {_.isEmpty(items) || (
            <div>
              {_.map(items, (item, index) => {
                const itemTitle = _.get(item, 'content.properties.title', '');
                const itemText = _.get(item, 'content.properties.text.markup', '');
                const updatedText = _.replace(
                  resolveTextInternalLinks(itemText, lang),
                  /\/media\//g,
                  `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}/media/`,
                );

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-y-[10px] border-l border-r border-t
                    border-l-grey border-r-grey border-t-grey px-[20px] pb-[20px] pt-[20px]
                    last:border-b last:border-b-grey md:gap-y-[20px] md:pt-[40px]
                    lg:px-[40px] lg:pb-[47px]">
                    <h5
                      className="md:leading-8 font-noto text-[15px] font-bold leading-[25px]
                      text-primary md:text-[18px]">
                      {itemTitle}
                    </h5>
                    {_.isEmpty(updatedText) || (
                      <div
                        className="faq-list max-w-[984px] font-noto text-clamp12to15
                        font-normal leading-1.625 text-primary a-child:font-bold
                        a-child:underline ul-child:pb-4 ul-child:pl-5 li-child:list-disc
                        ol-child:pb-4 ol-child:pl-5 ul-child:md:pb-6 ul-child:md:pl-7
                        ol-child:md:pb-6 ol-child:md:pl-7 lg:leading-[24px]"
                        dangerouslySetInnerHTML={{ __html: updatedText }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
