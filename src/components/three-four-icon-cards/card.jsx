import React from 'react';
import Icons from '@/components/layout/icons';
import _ from 'lodash';

function Card({ data, threeItems, highlightedIcons }) {
  const title = _.get(data, 'content.properties.title.markup', '');
  const text = _.get(data, 'content.properties.text.markup', '');
  const iconName = _.get(data, 'content.properties.iconName', '');

  return threeItems ? (
    <div className={`${highlightedIcons ? 'lg:pb-6' : ''} flex basis-80 flex-col items-center gap-y-3 lg:gap-y-5`}>
      <Icons name={_.upperFirst(iconName)} 
      className={`${highlightedIcons ? '[&>path]:fill-cherry' : ''} h-[60px] w-[60px] md:h-20 md:w-[100px]`} />
      {_.isEmpty(title) || (
        <div
          className={`${highlightedIcons ? 'text-clamp14to17' : 'text-clamp14to15 '} 
          text-center font-noto font-bold uppercase tracking-[1.5px]
          pt-[10px]`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {_.isEmpty(text) || (
        <div
          className="text-center font-noto text-clamp12to15 leading-1.625"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </div>
  ) : (
    <div className={`${highlightedIcons ? 'lg:pb-6' : ''} flex basis-72 flex-col items-center gap-y-3 md:basis-64 lg:gap-y-5`}>
      <Icons name={_.upperFirst(iconName)} className={`${highlightedIcons ? '[&>path]:fill-cherry' : ''} h-[60px] w-[60px] md:h-20 md:w-[100px]`} />
      {_.isEmpty(title) || (
        <div
          className={`${highlightedIcons ? 'text-clamp14to17' : 'text-clamp14to15 '} 
          text-center font-noto font-bold uppercase tracking-[1.5px]
          pt-[10px]`}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {_.isEmpty(text) || (
        <div
          className="text-center font-noto text-clamp12to15 leading-1.625"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
    </div>
  );
}

export default Card;
