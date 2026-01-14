import React from 'react';
import Pagination from '@/components/layout/pagination';
import Card from './card';

function ItemsList({ items }) {
  const dataLimit = 4;
  const pageLimit = Math.ceil(items.length / dataLimit);
  return (
    <Pagination
      data={items}
      RenderComponent={Card}
      itemsWrapperClass="w-full h-auto min-h-[46px] flex flex-col gap-[2px]"
      wrapperClass="pb-9"
      prevLabel="first"
      nextLabel="last"
      pageLimit={pageLimit}
      dataLimit={dataLimit}
    />
  );
}

export default ItemsList;
