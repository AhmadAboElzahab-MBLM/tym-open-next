import React, { useContext } from 'react';
import GlobalContext from '@/context/global-context';
import _, { filter, get, groupBy } from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import resolveInternalLinks from '@/helpers/resolve-url-locale';
import { getTranslationByKey } from '@/utils/translation-helper';
import { getProductPower } from '@/helpers/product-handlers';
import BoxedContainer from './layout/boxed-container';

export default function PromotionsProducts({ data, id, products }) {
  const { translations, lang } = useContext(GlobalContext);
  const title = get(data, 'properties.title.markup', '');
  const text = get(data, 'properties.text.markup', '');
  const validProducts = filter(products, (item) => get(item, 'properties.yearsPartnership', ''));

  if (_.isEmpty(validProducts)) return null;

  const groupedProducts = groupBy(validProducts, (item) => get(item, 'properties.category', ''));
  const categoryOrder = ['Tractors', 'Harvesters', 'Rice Transplanters'];

  const getHitchLiftCapacity = (_item) => {
    const specs = _.get(_item, 'properties.specifications.items', []);
    const product = _.find(specs, (val) =>
      _.isEqual(val.content.properties.title, 'Hitch lift capacity'),
    );
    return product?.content?.properties?.valueText || '';
  };

  return (
    <section id={id} className="pb-20 pt-[60px] md:pt-[125px] lg:pb-[180px]">
      <BoxedContainer className="flex flex-col gap-y-8 md:gap-y-6">
        <div className="flex flex-col gap-y-2">
          <div
            className="font-noto-kr text-clamp18to28 font-bold uppercase leading-[142%] text-primary"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div
            className="font-noto-kr text-clamp12to18 font-normal uppercase leading-[142%] text-primary"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
        <div className="flex flex-col gap-y-8 lg:gap-y-20">
          {_.map(categoryOrder, (category) => {
            const products = groupedProducts[category];
            if (!products) return null;
            return (
              <div key={category} className="flex flex-col gap-4 md:gap-5 lg:flex-row">
                <h4
                  className="w-full font-sans text-clamp18to28 font-bold uppercase
              leading-[142%] text-primary lg:w-[25%] lg:pt-[130px]">
                  {getTranslationByKey(category, translations, lang)}
                </h4>
                <div className="flex w-full flex-wrap gap-x-5 gap-y-5 md:gap-x-[50px] md:gap-y-6 lg:w-[75%]">
                  {_.map(products, (item, index) => {
                    const powerLabel = getProductPower(item, lang, category);
                    const requestQuote = _.get(item, 'properties.requestQuote[0]', null);
                    const name = _.get(item, 'properties.title', '');
                    const reapingRow = _.get(item, 'properties.specifications.items', []).find(
                      (specItem) => _.get(specItem, 'content.properties.title') === 'Reaping row',
                    );
                    const plantingRow = _.get(item, 'properties.specifications.items', []).find(
                      (specItem) => _.get(specItem, 'content.properties.title') === 'Planting rows',
                    );
                    resolveInternalLinks(requestQuote, lang);
                    return (
                      <Link
                        key={index}
                        href={`${requestQuote?.route?.path}?category=${category}&model=${name}`}
                        className="flex w-[calc(50%-10px)] flex-col gap-y-1 md:w-[calc(33.3333%-34px)] md:gap-y-3">
                        {!_.isEmpty(item.properties.featuresImage) && (
                          <Image
                            src={item.properties.featuresImage[0].url}
                            alt="product item"
                            fill
                            className="!relative !object-contain lg:!h-[261px] lg:!w-[261px]"
                          />
                        )}
                        <div className="flex flex-col items-start gap-y-1 md:gap-y-3">
                          <h4 className="font-noto text-clamp18to21 font-bold leading-1.125 text-primary">
                            {item.properties.title}
                          </h4>
                          <div className="flex flex-col font-noto text-[12px] font-normal text-primary md:text-[15px] lg:leading-[24px]">
                            <div className="flex flex-row gap-1">
                              <span>{getTranslationByKey('Performance', translations, lang)}:</span>
                              <span>{powerLabel.replace(/[()]/g, '')}</span>
                            </div>
                            {category === 'Harvesters'
                              ? _.isEmpty(reapingRow) || (
                                  <div className="flex flex-row gap-1">
                                    <span>
                                      {getTranslationByKey('Reaping row', translations, lang)}:
                                    </span>
                                    <span>{reapingRow?.content?.properties?.valueText}</span>
                                  </div>
                                )
                              : ''}
                            {category === 'Rice Transplanters'
                              ? _.isEmpty(plantingRow) || (
                                  <div className="flex flex-row gap-1">
                                    <span>
                                      {getTranslationByKey('Planting rows', translations, lang)}:
                                    </span>
                                    <span>{plantingRow?.content?.properties?.valueText}</span>
                                  </div>
                                )
                              : ''}

                            {_.isEmpty(getHitchLiftCapacity(item)) || (
                              <div className="flex flex-row gap-1">
                                <span>
                                  {getTranslationByKey('Hitch lift capacity', translations, lang)}:
                                </span>
                                <span>{getHitchLiftCapacity(item)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </BoxedContainer>
    </section>
  );
}
