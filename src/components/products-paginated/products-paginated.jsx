import React, { useCallback, useContext, useEffect, useState } from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
import FilterModal from '@/components/products-paginated/filter-modal';
import TitleAndText from '@/components/layout/title-and-text';
import Filter from '@/components/products-paginated/filter';
import ItemsList from '@/components/products-paginated/items-list';
import { groupProductsByCategoryAndSubcategory, sortBySeriesOrder } from '@/helpers/product-handlers';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import { motion } from 'framer-motion';
import filterData from '@/assets/data/product-filters.json';

function ProductsPaginated({ id, data, products }) {
  const { pickMyTractor, lang, translations } = useContext(GlobalContext);
  const category = 'Tractors';
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const filters = _.get(filterData, [lang, category, 'filters'], []);
  const dropdowns = _.get(filterData, [lang, category, 'dropdowns'], []);
  const [currProduct, setCurrProduct] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDropdown, setSelectedDropdown] = useState({});
  // const [selectedProducts, setSelectedProducts] = useState([]);

  const groupedProducts = groupProductsByCategoryAndSubcategory(products, _.snakeCase(category));

  const customSort = (valueA, valueB) => {
    const keyA = _.get(valueA, 'key', '');
    const keyB = _.get(valueB, 'key', '');
    
    // Extract series number from keys
    const getSeriesNumber = (key) => {
      // Try to match series_1, series_2, etc.
      const seriesMatch = key.match(/series_(\d+)/);
      if (seriesMatch) {
        return parseInt(seriesMatch[1], 10);
      }
      
      // Try to match series-1, series-2, etc.
      const seriesMatch2 = key.match(/series-(\d+)/);
      if (seriesMatch2) {
        return parseInt(seriesMatch2[1], 10);
      }
      
      // Handle special cases
      if (key.includes('iseki')) return 7;
      if (key.includes('john_deere')) return 8;
      
      // Default to a high number for unknown series
      return 999;
    };
    
    const seriesA = getSeriesNumber(keyA);
    const seriesB = getSeriesNumber(keyB);
    
    return seriesA - seriesB;
  };

  // Apply custom sort to initial grouped products
  groupedProducts.sort(customSort);

  // Apply sortBySeriesOrder to individual items within each group
  _.forEach(groupedProducts, (group) => {
    if (group.values && _.isArray(group.values)) {
      sortBySeriesOrder(group.values);
    }
  });

  _.forEach(groupedProducts, (_val) => {
    const hideFromListing = _.get(_val, 'hideFromListing', false);
    if (hideFromListing) _.remove(groupedProducts, (_item) => _item === _val);
  });

  const [filteredProducts, setFilteredProducts] = useState(groupedProducts);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const handleFilterSelect = useCallback((key, val) => {
    setSelectedFilters((prev) => {
      const prevVal = _.get(prev, key, []);
      const newVal = _.xor(prevVal, [val]);
      return { ...prev, [key]: newVal };
    });
  }, []);

  const handleDropdownFilter = (dropdown, val) => {
    
    setSelectedDropdown((prev) => {
      if (!_.isEmpty(prev[dropdown.title])) {
        const isValInArray = _.some(prev[dropdown.title], (item) => _.isEqual(item, val));
        if (!isValInArray) {
          return { ...prev, [dropdown.title]: [...prev[dropdown.title], val] };
        }

        const index = _.findIndex(prev[dropdown.title], (item) => _.isEqual(item, val));
        const newArr = [...prev[dropdown.title]];
        newArr.splice(index, 1);
        return { ...prev, [dropdown.title]: newArr };
      }
      return { ...prev, [dropdown.title]: [val] };
    });
  };

  const applyFilters = useCallback(() => {}, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    applyFilters();
  }, []);

  const handleCurrProduct = useCallback((item, action) => {
    switch (action) {
      case 'add':
        setCurrProduct(item);
        break;
      case 'remove':
        setCurrProduct({});
        break;
      default:
        break;
    }
  }, []);

  function allKeysHaveEmptyValues(obj) {
    return _.every(obj, (value) => _.isArray(value) && _.isEmpty(value));
  }

  useEffect(() => {
    const currentFiltersResult = _.chain(selectedFilters)
      .reduce((acc, curr) => {
        if (!_.isEmpty(curr)) {
          const results = [];
          _.forEach(curr, (val) => {
            results.push(val.results);
          });
          acc.push(_.flatten(results));
        }
        return acc;
      }, [])
      .value();

    const currentDropdownResult = _.chain(selectedDropdown)
      .reduce((acc, curr) => {
        if (!_.isEmpty(curr)) {
          const results = [];
          _.forEach(curr, (val) => {
            results.push(val.results);
          });
          acc.push(_.flatten(results));
        }
        return acc;
      }, [])
      .value();

    let selectedProductResults = null;

    if (allKeysHaveEmptyValues(selectedFilters) && allKeysHaveEmptyValues(selectedDropdown)) {
      selectedProductResults = null;
    } else if (
      allKeysHaveEmptyValues(selectedFilters) && !allKeysHaveEmptyValues(selectedDropdown)
    ) {
      // Only dropdown filters are selected
      if (currentDropdownResult.length > 0) {
        selectedProductResults = _.uniq(_.intersection(...currentDropdownResult));
      }
    } else if (
      !allKeysHaveEmptyValues(selectedFilters) && allKeysHaveEmptyValues(selectedDropdown)
    ) {
      // Only regular filters are selected
      if (currentFiltersResult.length > 0) {
        selectedProductResults = _.uniq(_.intersection(...currentFiltersResult));
      }
    } else if (
      !allKeysHaveEmptyValues(selectedFilters) && !allKeysHaveEmptyValues(selectedDropdown)
    ) {
      // Both types of filters are selected
      if (currentFiltersResult.length > 0 && currentDropdownResult.length > 0) {
        const filterIntersection = _.intersection(...currentFiltersResult);
        const dropdownIntersection = _.intersection(...currentDropdownResult);
        selectedProductResults = _.uniq(_.intersection(filterIntersection, dropdownIntersection));
      } else if (currentFiltersResult.length > 0) {
        selectedProductResults = _.uniq(_.intersection(...currentFiltersResult));
      } else if (currentDropdownResult.length > 0) {
        selectedProductResults = _.uniq(_.intersection(...currentDropdownResult));
      }
    }

    const filteredProductsResult = _.filter(products, (_val) => {
      if (_.isNull(selectedProductResults)) return true;
      if (_.isEmpty(selectedProductResults)) return false;
      const valName = _.get(_val, 'name', '');
      const valTitle = _.get(_val, 'properties.title', '');
      return (
        _.includes(selectedProductResults, valName) || _.includes(selectedProductResults, valTitle)
      );
    });

    const grouped = groupProductsByCategoryAndSubcategory(
      filteredProductsResult,
      _.snakeCase(category),
    );

    // Apply custom sort to grouped products
    grouped.sort(customSort);

    // Apply sortBySeriesOrder to individual items within each group
    _.forEach(grouped, (group) => {
      if (group.values && _.isArray(group.values)) {
        sortBySeriesOrder(group.values);
      }
    });

    setFilteredProducts(grouped);
  }, [selectedFilters, selectedDropdown]);

  useEffect(() => {
    const isPickerEmpty = _.every(_.values(pickMyTractor), (_val) => _.isEmpty(_val));

    if (isPickerEmpty) {
      groupedProducts.sort(customSort);
      // Apply sortBySeriesOrder to individual items within each group
      _.forEach(groupedProducts, (group) => {
        if (group.values && _.isArray(group.values)) {
          sortBySeriesOrder(group.values);
        }
      });
      setFilteredProducts(groupedProducts);
    } else {
      const reduced = _.reduce(
        groupedProducts,
        (result, val) => {
          result.push(val.values);
          return result;
        },
        [],
      ).flat();
      const filtered = _.filter(reduced, (_val) => {
        const quizItems = _.get(_val, 'properties.quizItems.items', []);
        return _.some(quizItems, (_item) => {
          const answerText = _.get(_item, 'content.properties.answerText', '');
          return _.includes(_.values(pickMyTractor), answerText);
        });
      });

      const grouped = groupProductsByCategoryAndSubcategory(filtered, _.snakeCase(category));
      grouped.sort(customSort);
      // Apply sortBySeriesOrder to individual items within each group
      _.forEach(grouped, (group) => {
        if (group.values && _.isArray(group.values)) {
          sortBySeriesOrder(group.values);
        }
      });
      setFilteredProducts(grouped);
    }
  }, [pickMyTractor]);

  return (
    <>
      <FilterModal
        items={filters}
        handleClose={handleClose}
        selectedFilters={selectedFilters}
        handleFilterSelect={handleFilterSelect}
        handleClearFilters={handleClearFilters}
        applyFilter={applyFilters}
        isOpen={modalOpen}
      />
      <section id={id} className="pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
        <BoxedContainer>
          <TitleAndText title={title} text={text} />
          <Filter
            filterLabel={lang === 'ko' ? '마력:' : 'Filter By:'}
            filters={filters}
            handleOpenModal={handleOpenModal}
            selected={selectedFilters}
          />
          <div
            className="flex w-full flex-col gap-4 border-b border-cherry pt-3 lg:flex-row
            lg:flex-wrap lg:justify-between lg:gap-8 xl:gap-16 2xl:gap-24">
            {_.map(dropdowns, (dropdown) => (
              <div
                className="flex w-full flex-col justify-end gap-y-4 border-b border-cherry
                lg:w-fit lg:gap-y-8 lg:border-none lg:last:!border-none">
                <motion.div
                  key={dropdown.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex w-full gap-x-2 overflow-x-auto md:gap-x-4 xl:w-auto">
                  <span
                    className="pt-1 font-noto text-clamp14to15 font-bold uppercase
                  tracking-[1.5px] text-primary">
                    {getTranslationByKey(dropdown.title, translations, lang)}:
                  </span>
                  <div className="flex gap-x-2 md:gap-x-4">
                    {_.map(dropdown.options, (val, index) => (
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        key={index}
                        onClick={() => handleDropdownFilter(dropdown, val)}
                        data-selected={_.some(selectedDropdown[dropdown.title], (item) =>
                          _.isEqual(item, val),
                        )}
                        type="button"
                        className="min-w-[1.25rem] whitespace-pre border-b-4 border-[transparent]
                        p-1 font-noto text-clamp14to15 font-bold uppercase tracking-[1.5px]
                        text-primary transition-all
                        data-[selected=true]:border-primary data-[selected=true]:text-cherry lg:pb-4
                        ">
                        {getTranslationByKey(val.value, translations, lang)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
          {!_.isEmpty(filteredProducts) ? (
            <ItemsList
              data={filteredProducts}
              currProduct={currProduct}
              handleClick={handleCurrProduct}
            />
          ) : (
            <p
              className="py-5 font-noto text-clamp16to18 font-normal leading-1.625 text-primary
              lg:py-10">
              {lang === 'ko' ? '데이터를 찾을 수 없습니다' : 'No data found.'}
            </p>
          )}
        </BoxedContainer>
      </section>
    </>
  );
}

export default ProductsPaginated;
