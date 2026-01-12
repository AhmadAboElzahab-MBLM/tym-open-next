import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { isEmpty } from 'lodash';
import { getProductLink } from '@/helpers/product-links';
import Button from '../layout/button';
import Icons from '../layout/icons';

export default function JDItems({ items }) {
  const seriesMap = items.reduce((result, item) => {
    const series = item.properties.series || 'Other';
    if (!result[series]) {
      result[series] = [];
    }
    result[series].push(item);
    return result;
  }, {});

  const allSeriesItems = Object.values(seriesMap).flat();

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        className="flex w-full flex-col">
        <div className="grid grid-cols-2 flex-wrap gap-x-8 gap-y-10 xs:flex xs:flex-row">
          {allSeriesItems.map((val, index) => (
            <Item key={val.id || index} item={val} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
function Item({ item, index }) {
  const { properties } = item;
  const imageUrl = properties.featuresImage?.[0]?.url || '';
  const title = properties.title || 'N/A';
  const years = properties.years || '';
  const hours = properties.hours || '';
  const warranty = properties.warranty || '';
  const certified = properties.certified || false;
  const sold = properties.sold || false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="w-full xs:w-[calc(50%-1rem)] sm:w-[calc(33%-1.25rem)] lg:w-[calc(25%-1.5rem)]">
      <div className="relative flex w-full flex-col">
        <div className="relative w-full">
          {sold && (
            <div className="backdrop-blur-xs absolute z-10 flex h-full w-full flex-col items-center justify-center bg-white/50">
              <span className="bg-JDGreen px-4 py-2 text-clamp14to15 font-medium text-white">
                판매 완료
              </span>
            </div>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              width={256}
              height={242}
              alt={title}
              className="h-full w-full object-contain"
            />
          )}
          {isEmpty(certified) && (
            <div className="max-[40px] absolute left-0 top-0 overflow-hidden">
              <Icons name="JDCertified" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-start gap-y-2.5">
          <h4 className="leading-tight text-[21px] font-bold">
            <span className="mb-2.5 uppercase">{title}</span>
          </h4>

          {/* Tags */}
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex flex-row gap-x-3">
              {hours && (
                <span className="w-full bg-[#FEDC00] px-4 py-2 text-center text-sm font-bold text-primary">
                  {hours}
                </span>
              )}
              {years && (
                <span className="w-full bg-[#FEDC00] px-4 py-2 text-center text-sm font-bold text-primary">
                  {years}
                </span>
              )}
            </div>
            {warranty && <span className="mb-2 text-xs font-normal lg:text-sm">{warranty}</span>}
            <Button
              variant={'primaryJD'}
              text="application-tractors-showmore-button"
              label={'자세히 보기'}
              py={'py-2'}
              h={''}
              url={getProductLink(item)}
              ariaLabel="application-tractors-showmore-button"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
