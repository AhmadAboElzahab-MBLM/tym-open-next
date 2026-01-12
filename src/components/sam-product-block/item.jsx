import React, { useContext } from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import { getProductPower } from '@/helpers/product-handlers';
import ItemModal from './item-modal';

function Item({ item, currProduct, index, handleClick, width }) {
  const isOpen = _.isEqual(item, currProduct);
  const { translations, lang } = useContext(GlobalContext);
  const pathUrl = usePathname();
  const koPaths = ['/ko', '/en-ko'];
  const isKO = _.some(koPaths, (koPath) => _.includes(pathUrl, koPath));

  const fRows = lang === 'ko' ? ', 4조' : ', 4 Rows';
  const sRows = lang === 'ko' ? ', 6조' : ', 6 Rows';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="w-full xs:w-[calc(50%-1rem)] sm:w-[calc(33%-1.25rem)] lg:w-[calc(25%-1.5rem)]">
      <button
        type="button"
        key={index}
        disabled={_.isEqual(item, currProduct)}
        className="flex w-full flex-col gap-y-5 disabled:opacity-50"
        onClick={() => handleClick(item, 'add')}>
        {_.isEmpty(item.properties.featuresImage) || (
          <Image
            src={item.properties.featuresImage[0].url}
            alt={item.properties.series}
            fill
            className="!relative !object-contain"
          />
        )}

        <div className="flex flex-col items-start gap-y-2.5">
          <h4 className="font-noto text-clamp18to21 font-bold uppercase leading-1.125
          text-primary">
            {`${item.properties.title} ${getProductPower(item, isKO)}`}
          </h4>
          <p className="font-noto text-clamp14to15 text-left text-primary">
            {getTranslationByKey(item.properties.series, translations, lang)}
            {item.properties.series && ', '}
            {getTranslationByKey(item.properties.subCategory, translations, lang)}{' '}
            {getTranslationByKey(item.properties.category, translations, lang)}
            {item.properties.category === 'Harvesters' && 
            getTranslationByKey(fRows) }
            {item.properties.category === 'Rice Transplanters' && 
            getTranslationByKey(sRows) }
          </p>
        </div>
      </button>
      <ItemModal
        isOpen={isOpen}
        width={width}
        selected={currProduct}
        handleClick={handleClick}
        lang={lang}
      />
    </motion.div>
  );
}

export default Item;
