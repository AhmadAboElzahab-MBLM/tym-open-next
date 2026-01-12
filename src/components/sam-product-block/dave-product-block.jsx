import { filter, get, isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import Loading from '@/components/layout/loading';
import BoxedContainer from '../layout/boxed-container';
import ItemsList from './items-list';

export default function DaveProductBlock({ data, id, lang, products }) {
  const { title } = data.properties;
  const product = filter(products, (item) => get(item, 'properties.daveProduct', ''));
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

  if (isEmpty(products)) return <Loading />;

  return (
    <section id={id} className="pt-10 md:pt-20">
      <BoxedContainer>
        <div className="flex flex-col gap-y-1.5 pb-10 md:pb-[56px]">
          <h2 className="text-clamp20to28 font-bold uppercase leading-1.42
          text-primary">
            {title}
          </h2>
          <ItemsList
            items={product}
            currProduct={currProduct}
            handleClick={handleCurrProduct}
            lang={lang}
            orderHpPs
          />
        </div>
        <div className="w-full border border-b-cherry" />
      </BoxedContainer>
    </section>
  );
}
