import _ from 'lodash';
import React, { useCallback, useState } from 'react';
import Loading from '@/components/layout/loading';
import BoxedContainer from '@/components/layout/boxed-container';
import ItemsList from './items-list';

export default function ApplicationTractorsList({ data, products }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const hideFromListing = _.filter(
    products,
    (product) => !_.get(product, 'properties.hideFromListing', false),
  );
  const filteredProducts = _.filter(hideFromListing, (item) => {
    const category = _.get(data, 'properties.category', '');
    const applicationItems = _.get(item, 'properties.category', []);
    const applicationCategories = _.get(item, 'properties.application.items', []);
    const categories = _.map(applicationCategories, (items) =>
      _.get(items, 'content.properties.type'),
    );
    return categories.includes(category) && applicationItems.includes('Tractors');
  });
  const [currProduct, setCurrProduct] = useState({});

  const handleCurrProduct = useCallback((item, action) => {
    switch (action) {
      case 'add':
        setCurrProduct(item);
        break;
      case 'remove':
        setCurrProduct({});
        break;
      default:
        break;
    }
  }, []);

  if (_.isEmpty(products)) return <Loading />;

  return (
    <section id="application-tractors-list" className="py-[60px] lg:pb-[160px] lg:pt-[100px]">
      <BoxedContainer className="flex flex-col gap-y-4 lg:gap-y-9">
        <div className="flex flex-col items-center gap-y-4 lg:gap-y-8">
          {_.isEmpty(title) || (
            <div
              className="max-w-[480px] text-center text-clamp20to28 font-bold
          uppercase leading-1.42"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {_.isEmpty(text) || (
            <div
              className="flex max-w-[809px] flex-col gap-y-[10px] text-center font-noto
            text-clamp16to18 font-normal leading-1.625 text-primary lg:gap-y-[32px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
        <ItemsList
          items={filteredProducts}
          currProduct={currProduct}
          handleClick={handleCurrProduct}
        />
      </BoxedContainer>
    </section>
  );
}
