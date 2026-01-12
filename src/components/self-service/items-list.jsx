import React from 'react';
import Card from '@/components/self-service/card';
import Pagination from '@/components/layout/pagination';

function ItemsList({ items }) {
  const dataLimit = 10;
  const pageLimit = Math.ceil(items.length / dataLimit);
  return (
    <Pagination
      data={items}
      RenderComponent={Card}
      itemsWrapperClass="w-full h-auto"
      wrapperClass=""
      prevLabel="first"
      nextLabel="last"
      pageLimit={pageLimit}
      dataLimit={dataLimit}
    />
  );
}

export default ItemsList;
