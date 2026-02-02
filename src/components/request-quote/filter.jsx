import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from '@/context/global-context';
import _ from 'lodash';
import { motion } from 'framer-motion';
import { getTranslationByKey } from '@/utils/translation-helper';
import SelectDropdown from '@/components/layout/select-dropdown';

function customSort(givenArray) {
  const originalArray = ['Tractors', 'Harvesters', 'Rice Transplanters', 'Engines', 'Attachments'];

  const orderMap = _.reduce(
    originalArray,
    (acc, item, index) => {
      acc[item] = index;
      return acc;
    },
    {},
  );

  return _.sortBy(
    givenArray, 
    item => orderMap[item] !== undefined ? orderMap[item] : Number.MAX_VALUE
  );
}

// Function to extract power value from a product
function getProductPowerValue(product, lang) {
  const specifications = _.get(product, 'properties.specifications.items', []);
  const enginePower = _.find(
    specifications,
    (spec) => _.get(spec, 'content.properties.title') === 'Engine power',
  );

  if (!enginePower) return 0;

  // Determine which power value to use based on language
  let powerValue;
  if (lang === 'ko' || lang === 'en-ko') {
    // Use metric values for Korean language
    powerValue = Number(_.get(enginePower, 'content.properties.valueMetric', 0));
  } else {
    // Use US values for English language
    powerValue = Number(_.get(enginePower, 'content.properties.valueUS', 0));
  }

  return powerValue;
}

// Function to sort models by power in ascending order
function sortModelsByPower(models, products, lang) {
  return _.sortBy(models, (modelName) => {
    const product = _.find(products, (item) => 
      _.get(item, 'properties.title') === modelName
    );
    return getProductPowerValue(product, lang);
  });
}

function Filter(props) {
  const { translations, lang } = useContext(GlobalContext);
  const categoryModelsPair = _.get(props, 'categoryModelsPair', []);
  const filteredProducts = _.get(props, 'filteredProducts', []);
  const setSelectedFilter = _.get(props, 'setSelectedFilter', () => null);
  const categories = customSort(_.uniq(_.map(categoryModelsPair, 0)));
  const initialCategory = _.get(props, 'initialCategory', '');
  const initialTractorModel = _.get(props, 'initialTractorModel', '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTractorModel, setSelectedTractorModel] = useState(initialTractorModel);

  const handleSelect = (selectedValue, type) => {
    if (type === 'category') {
      setSelectedCategory(selectedValue);
      setSelectedTractorModel('');
    } else if (type === 'model') {
      setSelectedTractorModel(selectedValue);
    }
  };

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedTractorModel(initialTractorModel);
  }, [initialCategory, initialTractorModel]);

  useEffect(() => {
    if (selectedCategory !== '' || selectedTractorModel !== '') {
      setSelectedFilter({ category: selectedCategory, tractorModel: selectedTractorModel });
    }
  }, [selectedCategory, selectedTractorModel, setSelectedFilter]);

  // Get models for the selected category and sort them by power
  const getSortedModels = () => {
    const categoryModels = _.map(
      _.filter(categoryModelsPair, (val) => val[0] === selectedCategory),
      1,
    );
    
    // Sort models by power in ascending order
    return sortModelsByPower(categoryModels, filteredProducts, lang);
  };

  return (
    <div className="">
      <div
        className="flex flex-wrap items-end gap-5 border-b border-cherry md:gap-x-8 lg:gap-x-12
        xl:gap-x-16 2xl:gap-x-[67px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative z-30 flex w-full items-start gap-x-4
          border-b border-cherry sm:w-[calc(50%-0.625rem)] sm:border-none md:w-80">
          <span
            className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
          tracking-[1.5px] text-primary">
            {getTranslationByKey('Select', translations, lang)}:
          </span>
          <div className="z-20 flex-grow">
            <SelectDropdown
              defaultValue={getTranslationByKey('Product Type', translations, lang)}
              items={categories}
              onSelect={(selectedValue) => handleSelect(selectedValue, 'category')}
              selectedValue={{
                value: selectedCategory,
                label:
                  getTranslationByKey(selectedCategory, translations, lang) ||
                  getTranslationByKey('Product Type', translations, lang),
              }}
              controlClass="!items-left"
            />
          </div>
        </motion.div>
        {selectedCategory === 'Product Type' || (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative flex w-full items-start gap-x-4 border-b border-cherry
                sm:w-[calc(50%-0.625rem)] sm:border-none md:w-80">
            <span
              className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
                  tracking-[1.5px] text-primary">
              {getTranslationByKey('Select', translations, lang)}:
            </span>
            <div className="z-20 flex-grow">
              <SelectDropdown
                defaultValue={getTranslationByKey(`Model`, translations, lang)}
                items={getSortedModels()}
                onSelect={(selectedValue) => handleSelect(selectedValue, 'model')}
                selectedValue={{
                  value: selectedTractorModel,
                  label:
                    getTranslationByKey(selectedTractorModel, translations, lang) ||
                    getTranslationByKey(`Model`, translations, lang),
                }}
                controlClass="!items-left"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Filter;
