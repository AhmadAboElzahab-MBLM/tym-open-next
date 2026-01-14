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
      itemsWrapperClass="w-full h-auto flex flex-wrap gap-6 md:gap-8 py-6 md:py-9 md:pb-5"
      wrapperClass="pb-10"
      prevLabel="first"
      nextLabel="last"
      pageLimit={pageLimit}
      dataLimit={dataLimit}
    />
  );
}

export default ItemsList;
