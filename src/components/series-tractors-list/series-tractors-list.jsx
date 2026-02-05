import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { sortByEnginePower } from '@/helpers/product-handlers';
import Loading from '@/components/layout/loading';
import BoxedContainer from '../layout/boxed-container';
import ItemsList from './items-list';

export default function SeriesTractorsList({ data, id, region, locale, lang, products }) {
  const { title, seriesCategory } = data.properties;
  const [currProduct, setCurrProduct] = useState({});
  const filteredProducts = products.filter((product) => !product.properties.hideFromListing);
  console.log('products', products);
  sortByEnginePower(filteredProducts);
  const product = _.filter(filteredProducts, (item) => {
    const series = _.get(item, 'properties.series');
    return series && _.kebabCase(series) === _.kebabCase(seriesCategory);
  });

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
    <section id={id} className="pt-[52px]">
      <BoxedContainer>
        <div className="border-b border-cherry pb-[40px] lg:pb-[60px]">
          <ItemsList
            title={title}
            items={product}
            currProduct={currProduct}
            handleClick={handleCurrProduct}
          />
        </div>
      </BoxedContainer>
    </section>
  );
}
