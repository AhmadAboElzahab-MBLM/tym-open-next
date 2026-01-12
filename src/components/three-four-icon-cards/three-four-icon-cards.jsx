import React from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
import Card from './card';

function ThreeFourIconCards({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const threeItems = _.get(data, 'properties.threeItems', false);
  const bottomLine = _.get(data, 'properties.bottomLine', false);
  const paddingBottom = _.get(data, 'properties.paddingBottom', false);
  const highlightedIcons = _.get(data, 'properties.highlightedIcons', false);

  return (
    <section
      id={id}
      className={`pt-10 md:pt-[80px] ${paddingBottom ? 'pb-10 md:pb-20 lg:pb-[116px]' : ''}`}>
      <BoxedContainer>
        <div className="flex flex-col items-center gap-y-3 md:gap-y-6 lg:gap-y-8">
          {_.isEmpty(title) || (
            <div
              className="text-center text-clamp20to28 font-bold uppercase leading-1.42"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {_.isEmpty(text) || (
            <div
              className="text-center font-noto text-clamp14to18 leading-1.77
              max-w-[928px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}

          <div className="flex w-full flex-wrap justify-center gap-y-5 py-3 md:gap-8 md:py-6
          md:pt-[38px]">
            {_.map(items, (item, index) => (
              <Card 
              key={index} 
              data={item} 
              threeItems={threeItems} 
              highlightedIcons={[0, 1, 2].includes(index) ? highlightedIcons : false} 
              />
            ))}
          </div>
        </div>
        {bottomLine ? <div className="mt-5 h-[1px] w-full bg-cherry lg:mt-[76px]" /> : ''}
      </BoxedContainer>
    </section>
  );
}

export default ThreeFourIconCards;
