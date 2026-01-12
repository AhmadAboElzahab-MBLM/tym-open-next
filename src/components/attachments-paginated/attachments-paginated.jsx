import React, { useCallback, useEffect, useState, useContext, Suspense, useRef } from 'react';
import BoxedContainer from '@/components/layout/boxed-container';
import _ from 'lodash';
import { getTranslationByKey } from '@/utils/translation-helper';
import { groupProductsByCategoryAndSubcategory } from '@/helpers/product-handlers';
import Loading from '@/components/layout/loading';
import { motion } from 'framer-motion';
import SelectDropdown from '@/components/layout/select-dropdown';
import GlobalContext from '@/context/global-context';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import FilterButton from '@/components/attachments-paginated/filter-button';
import ItemsList from './items-list';

function AttachmentsPaginated({ id, data, products }) {
  const { translations, lang } = useContext(GlobalContext);
  const isKo = lang === 'ko' || lang === 'en-ko';
  const searchParams = useSearchParams();
  const model = searchParams.get('model');
  const series = searchParams.get('series');
  const seriesList = {
    'Series 1': 1,
    'Series 2': 2,
    'Series 3': 3,
    'Series 4': 4,
    'Series 5': 5,
    'Series 6': 6,
  };
  const seriesNumber = seriesList[series] || 'All';
  const dropdown1Placeholder = lang === 'ko' ? '모두' : 'All';
  const category = 'Attachments';
  // console.log('category', category);
  const groupedProducts = groupProductsByCategoryAndSubcategory(products, _.snakeCase(category));
  const mappedSeries = _.map(groupedProducts, (value) => _.replace(value.series, '-', ' '));
  const filterValues = isKo ? mappedSeries : ['All', ...mappedSeries];

  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const dropdown1 = _.get(data, 'properties.dropdownSelector1', []);
  const dropdown2 = ['All', ..._.get(data, 'properties.dropdownSelector2', [])];

  const [currProduct, setCurrProduct] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(_.head(filterValues));
  const [selectedDropdown1, setSelectedDropdown1] = useState(model || dropdown1Placeholder);
  const [selectedDropdown2, setSelectedDropdown2] = useState(_.head(seriesNumber || dropdown2));
  const [hasItems, setHasItems] = useState(false);

  _.forEach(groupedProducts, (_val) => {
    const hideFromListing = _.get(_val, 'hideFromListing', false);
    if (hideFromListing) _.remove(groupedProducts, (_item) => _item === _val);
  });

  const [filteredProducts, setFilteredProducts] = useState(groupedProducts);


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

  useEffect(() => {
    let result = _.cloneDeep(groupedProducts);

    // Filter by selectedFilter
    if (selectedFilter && selectedFilter !== 'All') {
      result = result.filter((val) => _.snakeCase(val.series) === _.snakeCase(selectedFilter));
    }

    // Filter by selectedDropdown1
    if (selectedDropdown1 && selectedDropdown1 !== dropdown1Placeholder) {
      result = result.map((val) => {
        const prodValues = _.get(val, 'values', []);

        const filteredValues = _.filter(prodValues, (value) => {
          const compatibleProduct = _.get(value, 'properties.compatibleProduct', []);
          const strippedProducts = compatibleProduct?.map((prod) => prod.split(':')[1]);
          return _.includes(strippedProducts, selectedDropdown1);
        });

        return { ...val, values: filteredValues };
      });
    }

    // Filter by selectedDropdown2
    if (selectedDropdown2 && selectedDropdown2 !== 'All') {
      const filteredNames = _.reduce(
        products,
        (acc, val) => {
          const valSeries = _.get(val, 'properties.series', '');
          if (_.includes(_.toLower(valSeries), _.toLower(selectedDropdown2))) {
            // console.log(val);
            acc.push(_.get(val, 'name', ''));
          }
          return acc;
        },
        [],
      );

      result = result.map((val) => {
        const prodValues = _.get(val, 'values', []);
        const filteredValues = _.filter(prodValues, (value) => {
          const compatibleProduct = _.get(value, 'properties.compatibleProduct', []);
          const intersection = _.intersection(compatibleProduct, filteredNames);
          return !_.isEmpty(intersection);
        });
        return { ...val, values: filteredValues };
      });
    }

    setFilteredProducts(result);
    const emptyValues = _.every(result, (val) => _.isEmpty(val?.values), false);
    setHasItems(!emptyValues);
  }, [selectedFilter, selectedDropdown1, selectedDropdown2]);

  useEffect(() => {
    setSelectedDropdown1(model || dropdown1Placeholder);
  }, [model]);
  useEffect(() => {
    setSelectedDropdown2(seriesNumber || dropdown2);
  }, [seriesNumber]);

  if (_.isEmpty(products)) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <section id={id} className="pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
        <BoxedContainer>
          <div className="flex flex-col gap-y-3 pb-4 lg:gap-y-8 lg:pb-7">
            {title && (
              <div
                className="max-w-[700px] text-clamp24to48 font-bold uppercase leading-1.125"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {text && (
              <div
                className="font-noto text-clamp14to18 leading-1.77
          a-child:font-noto a-child:text-clamp14to18 a-child:font-bold a-child:text-chiliPepper
          a-child:underline md:w-[70%] md:leading-1.75"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          <div className="flex flex-col gap-y-4 py-4 lg:gap-y-7 lg:py-6">
            <span
              className="font-noto text-clamp14to15 font-bold uppercase
              tracking-[1.5px] text-primary">
              {getTranslationByKey('Filters', translations, lang)}:
            </span>
            <div className="flex flex-wrap justify-between gap-5 pb-1 md:pb-6 lg:justify-start">
              {_.map(filterValues, (val, ind) => (
                <FilterButton
                  item={_.startCase(val)}
                  key={ind}
                  handleFilter={setSelectedFilter}
                  selected={_.snakeCase(val) === _.snakeCase(selectedFilter)}
                />
              ))}
            </div>
          </div>

          <div
            className="mb-9 grid w-full grid-cols-1 gap-4 border-b border-cherry pt-4
            lg:grid-cols-6 lg:gap-8 xl:gap-16 2xl:gap-32">
            <div
              className="col-span-full flex flex-col justify-end gap-y-4 border-b border-cherry
              lg:col-span-2 lg:gap-y-8 lg:border-none">
              {dropdown1 && (
                <div className="flex gap-4">
                  <span
                    className="font-noto text-clamp14to15 font-bold uppercase tracking-[1.5px]
                  text-primary">
                    {getTranslationByKey('Select', translations, lang)}:
                  </span>
                  <div className="min-w-41.5 flex w-fit">
                    <SelectDropdown
                      items={dropdown1}
                      onSelect={setSelectedDropdown1}
                      defaultValue={dropdown1Placeholder}
                      selectedValue={{ value: selectedDropdown1, label: selectedDropdown1 }}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* <div
              className="col-span-full flex flex-col gap-y-4 pt-4 lg:col-span-4 lg:gap-y-8 lg:pt-0
              ">
              {dropdown2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex w-full gap-x-2 overflow-x-auto md:gap-x-6 xl:w-auto">
                  <span
                    className="pt-1 font-noto text-clamp14to15 font-bold uppercase
                  tracking-[1.5px] text-primary">
                    {lang=='ko'?'시리즈':'Series'}:
                  </span>
                  <div className="flex gap-x-2 md:gap-x-6">
                    {_.map(dropdown2, (val, index) => (
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        key={index}
                        onClick={() => setSelectedDropdown2(val)}
                        data-selected={_.snakeCase(val) === _.snakeCase(selectedDropdown2)}
                        type="button"
                        className="min-w-[1.25rem] whitespace-pre border-b-4 border-[transparent] p-1
                        pb-1 font-noto text-clamp14to15 font-bold uppercase
                        tracking-[1.5px] text-primary transition-all
                        data-[selected=true]:border-primary data-[selected=true]:text-cherry lg:pb-4">
                        {getTranslationByKey(val, translations, lang)}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div> */}
          </div>

          {hasItems ? (
            <ItemsList
              data={filteredProducts}
              currProduct={currProduct}
              handleClick={handleCurrProduct}
            />
          ) : (
            <div className="w-full py-5 lg:py-10">
              {lang === 'ko' ? (
                <p className="font-noto text-clamp16to18 font-normal leading-1.625 text-primary">
                  필요한 정보를 찾지 못한 경우&nbsp;
                  <Link
                    href={`/${lang}/about/contact`}
                    className="font-bold transition-all hover:text-cherry">
                    고객센터에 문의
                  </Link>
                  &nbsp;를 남길 수 있습니다.
                </p>
              ) : (
                <p className="font-noto text-clamp16to18 font-normal leading-1.625 text-primary">
                  <Link
                    href={`/${lang}/about/contact`}
                    className="font-bold transition-all hover:text-cherry">
                    Contact TYM
                  </Link>
                  &nbsp;for assistance and information
                </p>
              )}
            </div>
          )}
        </BoxedContainer>
      </section>
    </Suspense>
  );
}

export default AttachmentsPaginated;
