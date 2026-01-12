import React, { useCallback, useState } from 'react';
import ItemsList from './item-list';
import BoxedContainer from '../layout/boxed-container';

export default function TractorsSeriesBlock({ data }) {
  const { id, products } = data;
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
  return (
    <section id={id} className="pt-[52px]">
      <BoxedContainer>
        <ItemsList items={products} currProduct={currProduct} handleClick={handleCurrProduct} />
      </BoxedContainer>
    </section>
  );
}
