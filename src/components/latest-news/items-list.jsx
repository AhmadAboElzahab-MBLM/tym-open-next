import React from 'react';
import Card from '@/components/latest-news/card';
import Pagination from '@/components/layout/pagination';

function ItemsList({ items }) {
  const dataLimit = 10;
  const pageLimit = Math.ceil(items.length / dataLimit);
  return (
    <Pagination
      data={items}
      RenderComponent={Card}
      itemsWrapperClass="w-full h-auto flex flex-wrap gap-8 py-9 pb-5"
      wrapperClass="pb-9"
      prevLabel="first"
      nextLabel="last"
      pageLimit={pageLimit}
      dataLimit={dataLimit}
    />
  );
}

export default ItemsList;
