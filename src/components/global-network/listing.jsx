'use client';

import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import Pagination from '@/components/layout/pagination';
import useOutsideClick from '@/hooks/use-outside-click';
import Card from './card';
import PopupModal from './popup-modal';

function Listing({ items = [], geolocation }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick();

  const dataLimit = 24;
  const pageLimit = Math.ceil(items.length / dataLimit);

  const handleCardSelect = useCallback((card) => {
    setSelectedCard(card);
    setIsOpen(true);
  });

  const handleClearCard = useCallback(() => {
    setSelectedCard(null);
    setIsOpen(false);
  });

  return (
    <>
      {isOpen && <PopupModal isOpen={isOpen} handleClose={handleClearCard} item={selectedCard} />}
      <Pagination
        data={_.map(items, (val) => ({ ...val, geolocation }))}
        RenderComponent={Card}
        onCardAction={handleCardSelect}
        itemsWrapperClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6
        md:pt-10 lg:gap-x-[72px] md:pb-[32px]"
        wrapperClass="pb-[60px] md:pb-[120px]"
        prevLabel="first"
        nextLabel="last"
        pageLimit={pageLimit}
        dataLimit={dataLimit}
      />
    </>
  );
}

export default Listing;
