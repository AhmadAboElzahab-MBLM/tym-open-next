import React from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
import Card from './card';

function TextContentWithIconList({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const threeItems = _.get(data, 'properties.threeItems', false);

  return (
    <section id={id} className="pt-[60px] md:pt-[80px]">
      <BoxedContainer>
        <div
          className="flex flex-col items-center gap-y-4 border-b
        border-b-grey pb-[60px] md:gap-y-6 md:pb-[80px] lg:gap-y-8">
          {_.isEmpty(title) || (
            <div
              className="mx-auto max-w-[840px] text-center
        text-clamp20to28 font-bold uppercase leading-1.5"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {_.isEmpty(text) || (
            <div
              className="mx-auto max-w-[930px]
        text-center font-noto text-clamp16to18 leading-1.75"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}

          <div className="flex w-full flex-wrap gap-8 py-6">
            {_.map(items, (item, index) => (
              <Card key={index} data={item} threeItems={threeItems} />
            ))}
          </div>
        </div>
      </BoxedContainer>
    </section>
  );
}

export default TextContentWithIconList;
