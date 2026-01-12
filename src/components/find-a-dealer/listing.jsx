import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import Pagination from '@/components/layout/pagination';
import useOutsideClick from '@/hooks/use-outside-click';
import Card from './card';
import PopupModal from './popup-modal';
import PopupModalNA from './popup-modal-na';

function Listing({ items = [], geolocation, lang }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick();

  const categorizedCards = items.filter(
    (d) => d.dealer_category === 'Gold' || d.dealer_category === 'Platinum',
  );
  const specialCards = [...categorizedCards.slice(0, 3)];
  while (specialCards.length < 3) {
    specialCards.push(null);
  }

  // Check if special cards exist
const hasSpecialCards = items.length > 0;

  // Define limits
  const firstPageLimit = lang === 'en-us' && hasSpecialCards ? 9 : 24;
  const defaultDataLimit = lang === 'en-us' ? 12 : 24;

  // Adjust total items count (excluding special cards for `en-us`)
  const totalItemsForPagination =
    lang === 'en-us' ? items.length - specialCards.length : items.length;

  // Compute page limit correctly
  const pageLimit =
    lang === 'en-us'
      ? Math.ceil((totalItemsForPagination - firstPageLimit) / defaultDataLimit) + 1
      : Math.ceil(items.length / defaultDataLimit);

  const handleCardSelect = useCallback((card) => {
    setSelectedCard(card);
    setIsOpen(true);
  }, []);

  const handleClearCard = useCallback(() => {
    setSelectedCard(null);
    setIsOpen(false);
  }, []);

  const listClass =
    lang === 'en-us'
      ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-5 md:gap-y-8 lg:gap-y-10'
      : 'flex flex-wrap gap-6 lg:gap-8 pt-6 lg:py-9 md:gap-10 lg:gap-14 2xl:gap-y-[60px] 2xl:gap-x-[72px] lg:pb-[60px]';

  return (
    <>
      {isOpen && lang === 'en-us' && (
        <PopupModalNA isOpen={isOpen} handleClose={handleClearCard} item={selectedCard} />
      )}
      {isOpen && lang !== 'en-us' && (
        <PopupModal isOpen={isOpen} handleClose={handleClearCard} item={selectedCard} />
      )}
      <Pagination
        data={_.map(items, (val) => ({ ...val, geolocation }))}
        RenderComponent={Card}
        onCardAction={handleCardSelect}
        itemsWrapperClass={`${listClass} w-full h-auto `}
        wrapperClass="md:pb-10"
        prevLabel="first"
        nextLabel="last"
        pageLimit={pageLimit}
        dataLimit={defaultDataLimit}
        firstPageLimit={firstPageLimit}
      />
    </>
  );
}

export default Listing;