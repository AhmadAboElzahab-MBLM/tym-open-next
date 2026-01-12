import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { forEach, get, isEmpty, map } from 'lodash';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import Icons from '@/components/layout/icons';
import useMaxWidthFromElements from '@/hooks/use-max-width-from-elements';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import BoxedContainer from '../layout/boxed-container';

export default function SearchResults({ data, region, locale, lang }) {
  const title = get(data, 'properties.title', '');
  const label = get(data, 'properties.label', '');
  const { translations } = useContext(GlobalContext);
  const [maxWidth, setRefs] = useMaxWidthFromElements();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState([]);
  const paginatedItems = search.slice(startIndex, endIndex);
  const isKo = lang === 'ko';

  const handleSearch = async (term) => {
    if (term.length < 2) {
      setSearch([]);
      return;
    }

    const response = await fetch('/search', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ searchTerm: term, region, locale, lang }),
    });

    const res = await response.json();
    const result = get(res, 'data', []);

    forEach(result, (item) => {
      resolveInternalLinks(item, lang);
    });

    setSearch(result);
  };

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);

    const section = document.getElementById('search-results');
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn); // Clear timeout if searchTerm changes
  }, [searchTerm]);

  return (
    <section
      id="search-results"
      className="bg-white pb-[60px] pt-[100px] md:pb-20 md:pt-[120px]
      lg:pb-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div className="flex flex-col gap-y-5 md:gap-y-[48px]">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            viewport={{ once: true }}
            className="max-w-[780px] text-clamp32to48 font-bold uppercase
              leading-1.5 text-primary md:leading-[45px] lg:leading-[54px]">
            {title}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex w-full flex-col items-start gap-2 border-cherry md:flex-row
              md:gap-4 md:border-b">
            <span
              ref={setRefs}
              style={{ width: maxWidth ? `${maxWidth}px` : 'auto' }}
              className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
              tracking-[1.5px]">
              {label}
            </span>
            <div className="relative w-full max-w-full md:w-fit md:max-w-[22rem] md:flex-grow">
              <input
                type="text"
                className="w-full border-b-4 border-primary pb-3 font-noto text-clamp14to15
                placeholder-primary"
                placeholder={`${getTranslationByKey('What are you trying to find?', translations, lang)}`}
                value={searchTerm}
                onChange={handleInputChange}
              />
              <button type="button" onClick={() => handleSearch(searchTerm)} className='search-result-button'>
                <Icons
                  name="Search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 !stroke-primary"
                />
              </button>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-col gap-y-3 pt-5 md:gap-y-6 md:pt-10">
        {searchTerm && (
            <div className="text-clamp15to12 text-primary leading-1.625 font-noto font-normal">
              {isKo
                ? search.length === 0
                  ? '결과: 항목이 없습니다.'
                  : `결과: ${search.length} 항목이 있습니다`
                : search.length === 0
                ? 'Result: 0 found entries'
                : `Result: ${search.length} found entries`}
            </div>
          )}

          <div className="flex flex-col">
            {isEmpty(search) ||
              map(paginatedItems, (item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-y-2 border
                  border-grey border-b-transparent p-5 last:border-b-grey md:gap-y-5
                  md:pb-12 md:pl-10 md:pr-[96px] md:pt-10">
                  <Link
                    href={item.url || '#'}
                    className="font-noto text-clamp16to18 font-bold leading-2
                    text-primary underline">
                    {item.title}
                  </Link>
                  <div
                    className="line-clamp-2 font-noto text-clamp12to15 font-normal
                    leading-[160%] text-primary" 
                    dangerouslySetInnerHTML={{ __html: item.description }} />
                </div>
              ))}
          </div>
          {search.length >= 10 ? (
            <div className="pt-2 md:pt-[36px]">
              <ReactPaginate
                previousLabel="First"
                nextLabel="Last"
                breakLabel="..."
                pageCount={Math.ceil(search.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                subContainerClassName="pages pagination"
                activeClassName="active opacity-30 !cursor-not-allowed !font-bold"
                className="flex gap-x-[12px] font-noto text-[15px] font-bold"
                disabledClassName="opacity-50 cursor-not-allowed font-bold"
                disabledLinkClassName="opacity-50 cursor-not-allowed font-bold"
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}