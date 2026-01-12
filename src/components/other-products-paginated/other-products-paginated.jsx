import React, { useCallback, useContext, useEffect, useState } from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
import TitleAndText from '@/components/layout/title-and-text';
import ItemsList from '@/components/products-paginated/items-list';
import { groupProductsByCategoryAndSubcategory } from '@/helpers/product-handlers';
import FilterModal from '@/components/other-products-paginated/filter-modal';
import Filter from '@/components/other-products-paginated/filter';
import GlobalContext from '@/context/global-context';
import filterData from '@/assets/data/product-filters.json';

export default function OtherProductsPaginated({ id, data, products }) {
  const { lang, translations } = useContext(GlobalContext);
  const category = _.get(data, 'properties.productCategory', '');
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const filters = _.get(filterData, [lang, category, 'filters'], []);
  const [currProduct, setCurrProduct] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const groupedProducts = groupProductsByCategoryAndSubcategory(products, _.snakeCase(category));

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

    let selectedProductResults = _.uniq(_.intersection(...currentFiltersResult));

    if (allKeysHaveEmptyValues(selectedFilters)) {
      selectedProductResults = null;
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

    setFilteredProducts(grouped);
  }, [selectedFilters]);

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
              No data found.
            </p>
          )}
        </BoxedContainer>
      </section>
    </>
  );
}
