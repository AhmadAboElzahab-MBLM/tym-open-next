import _, { filter, get } from 'lodash';
import React, { useCallback, useState } from 'react';
import { sortByEnginePower } from '@/helpers/product-handlers';
import Loading from '@/components/layout/loading';
import BoxedContainer from '../layout/boxed-container';
import ItemsList from './items-list';

export default function JohnDeereProductBlock({ data, id, products }) {
  const { title } = data.properties;
  const [currProduct, setCurrProduct] = useState({});
  const filteredProducts = products.filter((product) => !product.properties.hideFromListing);
  sortByEnginePower(filteredProducts);
  const product = filter(products, (item) => get(item, 'properties.johnDeere', ''));

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
    <section id={id} className="pt-[52px] ">
      <BoxedContainer>
        <div className="pb-[40px] lg:pb-[60px]">
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
