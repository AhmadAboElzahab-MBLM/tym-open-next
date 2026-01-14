import React, { useEffect, useState } from 'react';
import BodyLock from '@/components/layout/body-lock';
import _, { find, isEqual, get, isEmpty, filter, map } from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import BoxedContainer from '@/components/layout/boxed-container';
import HeaderDesktopProductsMenuInner from '@/components/header/header-desktop-products-menu-inner';
import { usePathname } from 'next/navigation';

function HeaderDesktopProductsMenu({
  data,
  products,
  lang,
  productsCategoryLinks,
  toggleCursor = (val = false) => val,
}) {
  const [filtered, setFiltered] = useState(null);
  const [menuView, setMenuView] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryLinksItem, setSelectedCategoryLinksItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const breakpoints = {
    640: {
      slidesPerView: 2,
    },
    1024: { slidesPerView: 3 },
    1280: {
      slidesPerView: 4,
    },
  };

  const path = usePathname();
  // Extract series and product from URL
  // Example: /en-us/products/tractors/series-4/754
  const pathParts = path.split('/');

  const seriesSlug = pathParts.find(
    (part) => part.startsWith('series-') || part === 'iseki' || part === 'john-deere',
  );
  // Get the product category (tractors, combine-harvestors, etc.)
  const productCategory = pathParts[3];

  // Product/model is usually the last part if it's a number or string id
  const productId = pathParts[pathParts.length - 1];

  // Check if it's a product details page for any of the supported categories
  const isProductDetailsPage =
    (seriesSlug && productId) || // For tractors with series
    (productCategory &&
      productId &&
      (productCategory === 'combine-harvesters' ||
        productCategory === 'engines' ||
        productCategory === 'rice-transplanters' ||
        productCategory === 'attachments'));

  // Find the matching series object from data (seriesSlug like 'series-4')
  let initialSeries = null;
  let initialProduct = null;
  if (seriesSlug && productsCategoryLinks) {
    productsCategoryLinks.forEach((catLink) => {
      if (initialSeries) return;
      const seriesLinks = _.get(catLink, 'content.properties.seriesLinks.items', []);
      const found = seriesLinks.find((link) => {
        const label = _.get(link, 'content.properties.label', '');
        return label && seriesSlug === _.kebabCase(label);
      });
      if (found) {
        initialSeries = found.content.properties;
      }
    });
  }
  // Find the matching product by name (or id if you want to change this logic)
  if (productId && products) {
    initialProduct = products.find((prod) => {
      const prodName = String(prod.name);
      const prodTitle = String(_.get(prod, 'properties.title', ''));
      return prodName === productId || prodTitle === productId;
    });
  }

  const handleFilterProducts = (category, allItems) =>
    filter(allItems, (val) => {
      const valCategory = get(val, 'properties.category', '');
      return isEqual(valCategory, category);
    });

  const handleClick = (_cat) => {
    setIsLoading(true);
    setSelectedCategory(_cat);
    setFiltered(handleFilterProducts(_cat, products));
    setMenuView(true);
    setIsLoading(false);
    // Store last selected category
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSelectedProductCategory', _cat);
    }
  };

  const isNA = lang === 'en-us';

  const handleCategoryLinks = () => {
    if (selectedCategory) {
      const currCategoryLinks = find(productsCategoryLinks, (val) => {
        const currValCategory = get(val, 'content.properties.category', '');
        return isEqual(currValCategory, selectedCategory);
      });
      const currCatLinksProperties = get(currCategoryLinks, 'content.properties', {});
      setSelectedCategoryLinksItem(currCatLinksProperties);
    }
  };

  useEffect(() => {
    if (isNA && !isProductDetailsPage) {
      handleClick('Tractors');
    }
  }, [isNA, isProductDetailsPage]);

  // Handle initial product details page load
  useEffect(() => {
    if (isProductDetailsPage && !selectedCategory) {
      if (initialSeries) {
        // For tractors with series
        const category = initialSeries.category || 'Tractors';
        handleClick(category);
      } else if (productCategory) {
        // For other product types
        let category = '';
        switch (productCategory) {
          case 'combine-harvesters':
            category = 'Harvesters';
            break;
          case 'engines':
            category = 'Diesel Engines';
            break;
          case 'rice-transplanters':
            category = 'Rice Transplanters';
            break;
          default:
            category = 'Tractors';
        }
        handleClick(category);
      }
    }
  }, [isProductDetailsPage, initialSeries, productCategory, selectedCategory]);

  // Restore last selected category on subpages (faqs, success-stories, parts-support)
  useEffect(() => {
    const subPages = ['faqs', 'success-stories', 'parts-support'];
    const isSubPage = subPages.includes(productId);

    if (isSubPage && !selectedCategory) {
      if (typeof window !== 'undefined') {
        const lastCat = localStorage.getItem('lastSelectedProductCategory');
        if (lastCat) {
          handleClick(lastCat);
        }
      }
    }
  }, [productId, selectedCategory]);

  useEffect(() => {
    handleCategoryLinks();
  }, [selectedCategory]);

  const onResetMenuView = () => {
    setMenuView(null);
    setFiltered(null);
  };

  if ((menuView || isNA || isProductDetailsPage) && !isLoading && filtered) {
    return (
      <HeaderDesktopProductsMenuInner
        data={filtered}
        isNA={isNA}
        selectedCategory={selectedCategory}
        lang={lang}
        onResetMenuView={onResetMenuView}
        toggleCursor={toggleCursor}
        selectedCategoryLinksItem={selectedCategoryLinksItem}
        initialSeries={
          initialSeries ||
          _.get(selectedCategoryLinksItem, 'seriesLinks.items[0].content.properties', {})
        }
        initialProduct={initialProduct}
      />
    );
  }

  return (
    <AnimatePresence>
      <BodyLock />
      <BoxedContainer variant="lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onMouseEnter={() => toggleCursor(false)}
          onMouseLeave={() => toggleCursor(true)}
          className="w-full bg-porcelain py-6 4xl:pb-16 4xl:pt-6 5xl:pt-8">
          <Swiper
            slidesPerView={1}
            spaceBetween={18}
            breakpoints={breakpoints}
            className={`${data.length <= 2 ? 'swiper-wrapper:justify-center' : ''}`}>
            {map(data, (val, index) => {
              const item = get(val, 'content.properties', {});
              // console.log(item);
              return (
                <SwiperSlide
                  key={item.title + index}
                  className="flex flex-col items-center justify-between">
                  {isEmpty(item.image) || (
                    <div className="max-h-[280px] w-full grow">
                      {isEmpty(item.image) || (
                        <Image
                          src={item.image[0].url}
                          alt={item.image[0].name}
                          fill
                          priority
                          className="!relative mx-auto !h-[220px] !max-h-[280px] !w-auto
                          !object-cover 4xl:!h-full"
                        />
                      )}
                    </div>
                  )}
                  <div
                    className="mx-auto flex flex-col items-center justify-between px-4 text-center
                    lg:min-h-[270px] lg:justify-between 2xl:min-h-[280px] 3xl:min-h-[290px] 
                    4xl:min-h-[300px]">
                    <div className="flex grow flex-col text-center">
                      <span
                        className="mb-2 font-noto text-clamp14to15 font-bold 4xl:mb-4
                      ">
                        {item.subtitle}
                      </span>
                      <span className="mb-3 text-clamp20to28 font-bold uppercase">
                        {item.title}
                      </span>
                      <span
                        className="mb-4 font-noto text-clamp12to16 leading-1.5 
                        4xl:leading-1.77">
                        {item.text}
                      </span>
                    </div>
                    {isEmpty(item.link) || (
                      <button
                        type="button"
                        onClick={() => handleClick(item.category)}
                        className="header-products-menu-item-button whitespace-pre border-none 
                        bg-cherry px-7 py-3 text-clamp14to15 font-bold uppercase
                        leading-1.625 text-white hover:bg-paprika
                        hover:text-white">
                        {item.link[0].title}
                      </button>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>
      </BoxedContainer>
    </AnimatePresence>
  );
}

export default HeaderDesktopProductsMenu;
