import React, { useContext, useEffect, useState } from 'react';
import BodyLock from '@/components/layout/body-lock';
import BoxedContainer from '@/components/layout/boxed-container';
import _, { get, map } from 'lodash';
import HeaderDesktopProductsMenuInnerSeriesItem from '@/components/header/header-desktop-products-menu-inner-series-item';
import HeaderDesktopProductsMenuInnerProduct from '@/components/header/header-desktop-products-menu-inner-product';
import HeaderDesktopProductsMenuInnerCard from '@/components/header/header-desktop-products-menu-inner-card';
import { getProductPower } from '@/helpers/product-handlers';
import GlobalContext from '@/context/global-context';
import { AnimatePresence, motion } from 'framer-motion';
import HeaderDesktopProductsMenuInnerLinks from '@/components/header/header-desktop-products-menu-inner-links';
import { getTranslationByKey } from '@/utils/translation-helper';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icons from '../layout/icons';

function HeaderDesktopProductsMenuInner({
  data,
  isNA,
  selectedCategory,
  toggleCursor = () => null,
  selectedCategoryLinksItem,
  initialSeries,
  initialProduct,
  onResetMenuView = () => null,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(initialProduct || {});
  const [selectedSeriesItem, setSelectedSeriesItem] = useState(initialSeries);
  const [clickedProductTitle, setClickedProductTitle] = useState('');
  const isTractorCat = selectedCategory === 'Tractors';
  const isTractorRelated = isTractorCat || selectedCategory === 'Attachments';
  const { translations, lang } = useContext(GlobalContext);
  const filteredData = data?.filter((item) => !_.get(item, 'properties.hideFromListing', false));
  const path = usePathname();
  const pathParts = path.split('/');
  const currentProductId = pathParts[pathParts.length - 1];

  const grouped = _.groupBy(filteredData, (val) => {
    const currSeries = _.get(val, 'properties.series', null);
    if (currSeries) {
      // Handle special cases for Iseki and John Deere
      if (currSeries === 'Iseki' || currSeries === 'John Deere') {
        return _.kebabCase(currSeries);
      }
      return _.kebabCase(currSeries);
    }
    return 'no-series';
  });

  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    // Keep Iseki and John Deere at the end
    if (a === 'john-deere' || a === 'iseki') {
      return 1;
    }
    if (b === 'john-deere' || b === 'iseki') {
      return -1;
    }
    return a.localeCompare(b);
  });

  const sortedGrouped = _.reduce(
    sortedKeys,
    (acc, key) => {
      acc[key] = grouped[key];
      return acc;
    },
    {},
  );

  const extractPower = (item) => {
    // Try to extract the number from the label (e.g., '(24.5 hp)')
    const label = getProductPower(item, lang);
    const match = label.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const handleSeriesSelect = (item) => {
    const currentItems = _.get(grouped, _.kebabCase(item.label), []);
    const filteredItems = _.filter(
      currentItems,
      (itm) => !_.get(itm, 'properties.hideFromListing', false),
    );
    // Sort by extracted power value (ascending)
    filteredItems.sort((a, b) => extractPower(a) - extractPower(b));
    setSelectedItems(filteredItems);

    // Highlight the correct product if initialProduct is present and in the list
    const matchProduct = (itm) =>
      itm.name === initialProduct?.name ||
      _.get(itm, 'properties.title', '') === _.get(initialProduct, 'properties.title', '') ||
      itm.id === initialProduct?.id;

    if (initialProduct && filteredItems.some(matchProduct)) {
      setSelectedItem(filteredItems.find(matchProduct));
    } else {
      setSelectedItem(_.head(filteredItems));
    }
    setSelectedSeriesItem(item);
  };

  const initializeSelection = () => {
    if (isNA || (isTractorCat && sortedKeys.length > 0)) {
      const firstGroupKey = sortedKeys[0];
      const firstGroupItems = sortedGrouped[firstGroupKey];
      if (firstGroupItems && firstGroupItems.length > 0) {
        const currentFilteredData = firstGroupItems.filter(
          (item) => !_.get(item, 'properties.hideFromListing', false),
        );
        // Sort by extracted power value (ascending)
        currentFilteredData.sort((a, b) => extractPower(a) - extractPower(b));
        setSelectedItems(currentFilteredData);
        const firstItem = _.head(currentFilteredData);
        setSelectedItem(firstItem);
        setClickedProductTitle(_.get(firstItem, 'properties.title', ''));
      }
    } else if (!isNA && _.size(data) > 0) {
      const currentFilteredData = _.filter(
        data,
        (item) => !_.get(item, 'properties.hideFromListing', false),
      );
      // Sort by extracted power value (ascending)
      currentFilteredData.sort((a, b) => extractPower(a) - extractPower(b));
      setSelectedItems(currentFilteredData);
      const firstItem = _.head(currentFilteredData);
      setSelectedItem(firstItem);
      setClickedProductTitle(_.get(firstItem, 'properties.title', ''));
    }
  };

  useEffect(() => {
    if (!initialSeries || Object.keys(initialSeries).length === 0) {
      initializeSelection();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (initialSeries && Object.keys(initialSeries).length > 0 && data && data.length > 0) {
      handleSeriesSelect(initialSeries);
    }
  }, [initialSeries, data]);

  useEffect(() => {
    if (initialProduct) {
      setSelectedItem(initialProduct);
      setClickedProductTitle(_.get(initialProduct, 'properties.title', ''));
    }
  }, [initialProduct]);

  // Normalization helper
  const normalize = (val) =>
    val
      ? String(val)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
      : '';
  const stripSuffix = (slug) => slug.replace(/-na$/, ''); // Add more suffixes as needed
  const urlSlug = stripSuffix(normalize(currentProductId));

  // Try exact match first
  let bestMatch = selectedItems.find(
    (itm) => normalize(_.get(itm, 'properties.title', '')) === urlSlug,
  );

  // If no exact match, fallback to closest prefix match
  if (!bestMatch) {
    let bestScore = -1;
    selectedItems.forEach((itm) => {
      const titleSlug = normalize(_.get(itm, 'properties.title', ''));
      let score = 0;
      while (
        score < urlSlug.length &&
        score < titleSlug.length &&
        urlSlug[score] === titleSlug[score]
      ) {
        score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = itm;
      }
    });
  }

  // Set initial product from URL if found
  useEffect(() => {
    if (currentProductId && !selectedItem && bestMatch) {
      setSelectedItem(bestMatch);
      setClickedProductTitle(_.get(bestMatch, 'properties.title', ''));
    }
  }, [currentProductId, selectedItem, bestMatch]);

  let selectedProductId = bestMatch ? _.get(bestMatch, 'properties.title', '') : '';
  if (clickedProductTitle) {
    selectedProductId = clickedProductTitle;
  }

  // Use selectedItems for tractors, data for others
  const productSourceArray = isTractorCat ? selectedItems : data;
  const selectedProductObj =
    productSourceArray.find(
      (itm) => normalize(_.get(itm, 'properties.title', '')) === normalize(selectedProductId),
    ) || bestMatch;

  useEffect(() => {
    if (
      currentProductId &&
      selectedItems &&
      selectedItems.length > 0 &&
      (!selectedItem ||
        (normalize(selectedItem.id) !== normalize(currentProductId) &&
          normalize(_.get(selectedItem, 'properties.title', '')) !== normalize(currentProductId)))
    ) {
      const match = selectedItems.find(
        (itm) =>
          normalize(itm.id) === normalize(currentProductId) ||
          normalize(_.get(itm, 'properties.title', '')) === normalize(currentProductId),
      );
      if (match) {
        setSelectedItem(match);
        setClickedProductTitle(_.get(match, 'properties.title', ''));
      }
    } else if (selectedItems && selectedItems.length > 0 && !selectedItem) {
      // Select the first item by default if no item is selected
      const firstItem = selectedItems[0];
      setSelectedItem(firstItem);
      setClickedProductTitle(_.get(firstItem, 'properties.title', ''));
    }
  }, [currentProductId, selectedItems, data]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}>
        <BodyLock />
        <BoxedContainer variant="header-menu">
          <div
            onMouseEnter={() => toggleCursor(false)}
            onMouseLeave={() => toggleCursor(true)}
            className="flex h-[calc(100vh-134px)] w-full flex-col bg-porcelain py-8 xl:pb-12 2xl:pb-16 3xl:pb-20 4xl:pb-24 4xl:pt-8">
            {!isNA && (
              <div className={`mb-6 ${!isTractorCat && !clickedProductTitle ? 'px-[12%]' : ''}`}>
                <button
                  type="button"
                  onClick={onResetMenuView}
                  className="flex items-center gap-2 font-noto text-clamp12to15 text-cherry transition-colors hover:text-cherry/80">
                  <Icons
                    name="SliderLeftArrow"
                    className="relative top-[-1px] [&>path]:stroke-cherry"
                  />
                  <span>{getTranslationByKey('Back to categories', translations, lang)}</span>
                </button>
              </div>
            )}
            <div className="flex h-full max-h-[818px] w-full justify-center">
              {isNA || isTractorRelated || (
                <HeaderDesktopProductsMenuInnerLinks data={selectedCategoryLinksItem} />
              )}
              {isTractorRelated ? (
                <>
                  <div className="w-[15.42%] border-r border-cherry pr-4 xl:pr-8 2xl:pr-10">
                    <div className="flex h-full w-full flex-col gap-6 4xl:gap-8">
                      <div className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px] text-cherry">
                        {get(selectedCategoryLinksItem, 'title', '')}
                      </div>
                      <div className="flex h-full w-full flex-col gap-4 4xl:gap-8">
                        <div className="flex flex-col gap-2 4xl:gap-4">
                          {(() => {
                            // Combine the arrays
                            const combined = [
                              ..._.get(selectedCategoryLinksItem, 'seriesLinks.items', []),
                              ..._.get(selectedCategoryLinksItem, 'links', []),
                            ];

                            // Find the "All Tractors" or "모든 트랙터" link
                            const allTractorsIndex = combined.findIndex((val) => {
                              const linkTitle = _.get(val, 'title', null);
                              return linkTitle === 'All Tractors' || linkTitle === '모든 트랙터';
                            });

                            let reordered = [...combined];
                            if (allTractorsIndex !== -1) {
                              // Remove the found item and place it at the start
                              const [allTractorsItem] = reordered.splice(allTractorsIndex, 1);
                              reordered = [allTractorsItem, ...reordered];
                            }

                            // Now map as before
                            return _.map(reordered, (val) => {
                              resolveInternalLinks(val, lang);
                              const valLabel = _.get(val, 'content.properties.label', null);
                              const linkUrl = get(val, 'url', '#');
                              const linkTitle = get(val, 'title', null);

                              if (valLabel) {
                                return (
                                  <button
                                    type="button"
                                    data-selected={_.isEqual(
                                      _.get(val, 'content.properties', null),
                                      selectedSeriesItem,
                                    )}
                                    onClick={() =>
                                      handleSeriesSelect(_.get(val, 'content.properties', null))
                                    }
                                    className="header-products-links text-start font-noto text-clamp12to15 hover:text-cherry data-[selected=true]:font-bold data-[selected=true]:text-cherry">
                                    {getTranslationByKey(valLabel, translations, lang)}
                                  </button>
                                );
                              }
                              if (linkTitle) {
                                return (
                                  <Link
                                    href={linkUrl}
                                    className="header-products-links font-noto text-clamp12to15 hover:text-cherry">
                                    {linkTitle}
                                  </Link>
                                );
                              }
                              return null;
                            });
                          })()}
                        </div>
                        <div className="flex flex-col gap-2 4xl:gap-4">
                          {map(get(selectedCategoryLinksItem, 'secondaryLinks', []), (val) => {
                            resolveInternalLinks(val, lang);
                            const linkUrl = get(val, 'url', '#');
                            const linkTitle = get(val, 'title', '');
                            return (
                              <Link
                                className="header-secondary-bottom-links font-noto text-clamp12to15 hover:text-cherry"
                                href={linkUrl}>
                                {linkTitle}
                              </Link>
                            );
                          })}
                        </div>

                        <div className="flex flex-col gap-4">
                          {map(get(selectedCategoryLinksItem, 'bottomLinks', []), (val) => {
                            resolveInternalLinks(val, lang);
                            const linkUrl = get(val, 'url', '#');
                            const linkTitle = get(val, 'title', '');
                            return (
                              <Link
                                className="header-products-bottom-links bg-cherry px-3 py-3 text-center font-sans text-[12px] font-bold uppercase text-white transition-all duration-300 ease-in-out hover:bg-paprika"
                                href={linkUrl}>
                                {linkTitle}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full w-[38.42%] flex-col gap-4 border-r border-cherry px-4 pb-6 xl:px-8 2xl:px-10">
                    {_.isEmpty(selectedSeriesItem) || (
                      <>
                        <div>
                          <span className="font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px] text-cherry">
                            {getTranslationByKey(
                              _.get(selectedSeriesItem, 'title', ''),
                              translations,
                              lang,
                            )}
                          </span>
                        </div>
                        <div className="relative h-full w-full">
                          {_.isEmpty(_.get(selectedSeriesItem, 'backgroundImage[0]', {})) || (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${_.get(selectedSeriesItem, 'backgroundImage[0].url', '')}`}
                              alt="image background"
                              fill
                              className="!z-[9] object-cover"
                            />
                          )}
                          <span
                            className="absolute inset-0 z-10 h-full w-full"
                            style={{
                              background:
                                'linear-gradient(180deg,rgba(0, 0, 0,0.50 ) 4%, rgba(237, 221, 83, 0) 24%)',
                            }}
                          />
                          <div className="relative z-[11] flex h-full w-full grow flex-col gap-1 p-7 pr-[52px] font-noto text-clamp18to21 font-bold text-white">
                            <span>{_.get(selectedSeriesItem, 'range', '')}</span>
                            <span className="">{_.get(selectedSeriesItem, 'details', '')}</span>
                            <div className="flex grow" />

                            {_.isEmpty(selectedSeriesItem.link) || (
                              <Link
                                href={(() => {
                                  const link = _.get(selectedSeriesItem, 'link[0]', null);
                                  resolveInternalLinks(link, lang);
                                  return _.get(link, 'url', '#');
                                })()}
                                className="header-products-bottom-links w-fit bg-cherry px-6 py-3 text-center font-sans text-[12px] font-bold uppercase text-white transition-all duration-300 ease-in-out hover:bg-paprika">
                                {_.get(selectedSeriesItem, 'link[0].title', '#')}
                              </Link>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex w-[21.57%] flex-col gap-4 border-r border-cherry px-4 xl:px-8 2xl:gap-7">
                    <div className="px-2 font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px] text-cherry">
                      {getTranslationByKey('Tractor Model', translations, lang)}
                    </div>
                    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto 4xl:gap-2.5">
                      {_.map(selectedItems, (_val, _key) => (
                        <HeaderDesktopProductsMenuInnerSeriesItem
                          key={_val.id || _val.name || _key}
                          handleClick={(item) => {
                            setClickedProductTitle(_.get(item, 'properties.title', ''));
                            setSelectedItem(item);
                          }}
                          item={_val}
                          selectedProductId={selectedProductId}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-[59.99%] flex-col gap-4 border-r border-cherry px-4 pt-4 xl:px-8 2xl:gap-7">
                  <span className="pl-5 font-noto text-clamp12to15 font-bold uppercase tracking-[1.5px] text-cherry">
                    {getTranslationByKey(`Select ${selectedCategory} Model`, translations, lang)}
                  </span>
                  <div
                    data-harvesters={_.isEqual(selectedCategory, 'Harvesters')}
                    data-transplanters={_.isEqual(selectedCategory, 'Rice Transplanters')}
                    data-engines={_.isEqual(selectedCategory, 'Diesel Engines')}
                    className="grid h-full w-full gap-4 overflow-hidden data-[engines=true]:grid-cols-4 data-[harvesters=true]:grid-cols-3 data-[transplanters=true]:grid-cols-2">
                    {_.map(data, (_val, _key) => (
                      <HeaderDesktopProductsMenuInnerProduct
                        handleClick={(item) => {
                          setClickedProductTitle(_.get(item, 'properties.title', ''));
                          setSelectedItem(item);
                        }}
                        selectedProductId={selectedProductId}
                        selectedCategory={selectedCategory}
                        item={_val}
                        clickedProductTitle={clickedProductTitle}
                        key={_val.name + _key}
                      />
                    ))}
                  </div>
                </div>
              )}
              {(
                isTractorCat
                  ? !_.isEmpty(selectedProductObj)
                  : clickedProductTitle && !_.isEmpty(selectedProductObj)
              ) ? (
                <HeaderDesktopProductsMenuInnerCard
                  item={selectedProductObj}
                  category={selectedCategory}
                  lang={lang}
                  hasLabel={isTractorCat}
                />
              ) : (
                <div className="flex h-full w-[35%] flex-col overflow-hidden pl-4 xl:pl-8 2xl:pl-10 3xl:w-[25.42%]" />
              )}
            </div>
          </div>
        </BoxedContainer>
      </motion.div>
    </AnimatePresence>
  );
}

export default HeaderDesktopProductsMenuInner;
