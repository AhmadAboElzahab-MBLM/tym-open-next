import React, { useState, useContext } from 'react';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';

export default function Pagination({
  data,
  RenderComponent,
  dataLimit,
  wrapperClass,
  itemsWrapperClass,
  prevLabel,
  nextLabel,
  onCardAction,
  firstPageLimit
}) {
  const { translations, lang } = useContext(GlobalContext);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / dataLimit);

  const gotToLastPage = () => setCurrentPage(totalPages);
  const goToFirstPage = () => setCurrentPage(1);
  const changePage = (event) => setCurrentPage(Number(event.target.textContent));

  const getPaginatedData = () => {
    if (lang === 'en-us' && firstPageLimit) {
      if (currentPage === 1) {
        return _(data).take(firstPageLimit).value();
      }
      return _(data)
        .slice((currentPage - 2) * dataLimit + firstPageLimit)
        .take(dataLimit)
        .value();
    }
  
    // Default pagination for other languages (no special case)
    return _(data)
      .slice((currentPage - 1) * dataLimit)
      .take(dataLimit)
      .value();
  };
  

  const getPaginationGroup = () => {
    let pages = [];

    if (totalPages <= 7) {
      // If total temp.pages is 7 or less, show all temp.pages
      pages = _.range(1, totalPages + 1);
    } else {
      // Determine temp.pages based on current page
      const startPages = _.range(1, 3); // First 2 temp.pages
      const endPages = _.range(totalPages - 1, totalPages + 1); // Last 2 temp.pages
      let middlePages;

      if (currentPage <= 4) {
        // Close to start
        middlePages = _.range(1, 6);
      } else if (currentPage > totalPages - 4) {
        // Close to end
        middlePages = _.range(totalPages - 4, totalPages + 1);
      } else {
        // Somewhere in the middle
        middlePages = _.range(currentPage - 1, currentPage + 2);
      }

      pages = _.uniq([...startPages, ...middlePages, ...endPages]);

      // Insert ellipses where there are gaps
      const withEllipses = [];
      _.forEach(pages, (page, index) => {
        // Add current page
        withEllipses.push(page);

        // Add ellipses if there's a gap
        if (index < pages.length - 1 && pages[index + 1] !== page + 1) {
          withEllipses.push('...');
        }
      });

      pages = withEllipses;
    }

    return pages;
  };

  return (
    <div className={wrapperClass}>
      <div className={itemsWrapperClass}>
        {getPaginatedData().map((d, idx) => (
          <RenderComponent key={idx} item={d} onAction={onCardAction} />
        ))}
      </div>

      <div className="flex w-full justify-center gap-x-2 py-8 md:gap-x-4 lg:justify-start lg:py-10">
        <button
          type="button"
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className="font-noto text-[14px] font-bold uppercase tracking-widest
          text-primary disabled:opacity-40 md:text-[16px]">
          {getTranslationByKey(prevLabel, translations, lang)}
        </button>

        {getPaginationGroup().map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={item === '...' ? () => {} : changePage}
            disabled={currentPage === item}
            data-ellipsis={item === '...'}
            className="font-noto text-[14px] font-bold uppercase tracking-widest
            text-primary disabled:opacity-40 data-[ellipsis=true]:cursor-default md:text-[16px]">
            {item}
          </button>
        ))}

        <button
          type="button"
          onClick={gotToLastPage}
          disabled={currentPage === totalPages}
          className="font-noto text-[14px] font-bold uppercase tracking-widest
          text-primary disabled:opacity-40 md:text-[16px]">
          {getTranslationByKey(nextLabel, translations, lang)}
        </button>
      </div>
    </div>
  );
}
