import React from 'react';
import { usePathname } from 'next/navigation';
import { toLower, set, get, isEmpty, forEach, includes, isEqual, filter, reduce } from 'lodash';
import Pagination from '@/components/layout/pagination';
import ItemRow from './item-row';

function ItemsPaginated({ items }) {
  const dataLimit = 15;
  const allDownloads = reduce(
    items,
    (acc, curr) => {
      const productName = get(curr, 'name', '');
      const productTitle = get(curr, 'properties.title', '');
      const productCategory = get(curr, 'properties.category', '');
      const key = productTitle || productName;
      const downloadables = get(curr, 'properties.downloadables', []);
      forEach(downloadables, (item) => {
        set(item, 'productModel', key);
        set(item, 'productName', productName);
        set(item, 'productCategory', productCategory);

        const brochure = get(item, 'properties.technicalBrochureName', '');
        set(item, 'technicalBrochureName', brochure);
      });
      acc.push(...curr.properties.downloadables);
      return acc;
    },
    [],
  );

  const pathname = usePathname();

  const languageFilteredItems = filter(allDownloads, (item) => {
    const language = toLower(get(item, 'properties.language', 'en'));
    const isEnglishKoreanPath =
      includes(pathname, '/en-ko/') && (isEqual(language, 'en') || isEqual(language, 'ko'));
    const isKoreanPath = includes(pathname, '/ko/') && isEqual(language, 'ko');
    const isOtherPath = !includes(pathname, '/en-ko/') && !includes(pathname, '/ko/');

    return isEnglishKoreanPath || isKoreanPath || isOtherPath;
    // return (
    //   (pathname.includes('/en-ko/') && language === 'en') ||
    //   (pathname.includes('/ko/') && language === 'ko') ||
    //   (!pathname.includes('/en-ko/') && !pathname.includes('/ko/'))
    // );
  });
  if (isEmpty(languageFilteredItems)) return null;

  const pageLimit = Math.ceil(allDownloads.length / dataLimit);
  return (
    <Pagination
      data={languageFilteredItems}
      RenderComponent={ItemRow}
      itemsWrapperClass="w-full h-auto min-h-[46px] flex flex-col gap-[2px]"
      wrapperClass="lg:pb-10"
      prevLabel="first"
      nextLabel="last"
      pageLimit={pageLimit}
      dataLimit={dataLimit}
    />
  );
}

export default ItemsPaginated;
