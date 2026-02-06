import React, { useContext } from 'react';
import _ from 'lodash';
import Icons from '@/components/layout/icons';
import { getTranslationByKey } from '@/utils/translation-helper';
import GlobalContext from '@/context/global-context';
import getDistance from '@/helpers/get-distance';
import Image from 'next/image';

export default function Card({ item, onAction }) {
  const { translations, lang } = useContext(GlobalContext);

  const geolocation = _.get(item, 'geolocation', {});
  const title = _.get(item, 'name', '');
  const address = _.get(item, 'address', '');
  const city = _.get(item, 'city', '');
  const state = _.get(item, 'state', '');
  const country = _.get(item, 'country', '');
  const location = _.get(item, 'location', '');
  const latitude = location.split(',')[0]?.trim();
  const longitude = location.split(',')[1]?.trim();
  const zip = _.get(item, 'zip', '');
  const category = _.get(item, 'dealer_category', '');
  const units = { en: 'km', 'en-us': 'miles', 'en-ko': 'km', ko: 'km', de: 'km' };

  const distance = getDistance(geolocation, { latitude, longitude });
  const unit = units[lang];

  const distanceLabel = `${_.isNull(distance) ? 'N/A' : Math.round(distance[unit])} ${unit}`;

  const mediaUrl = `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}/media`;

  const borderStyles = { Gold: 'bg-[#FDFDF0]', Platinum: 'bg-platinum-new' };

  const borderClass = borderStyles[category] || 'bg-white';

  const cardClass =
    lang !== 'en-us'
      ? 'xs:w-[calc(50%-1rem)] md:w-[calc(33.33%-1.75rem)] lg:w-[calc(25%-2.75rem)] 2xl:w-[calc(25%-3.5rem)]'
      : `border border-[rgba(204,204,204,0.30)] p-4 md:p-6 ${borderClass}`;

  const dealerCategories = {
    Platinum: {
      label: 'TYM Platinum Dealer',
      bgClass: 'bg-white',
      imgSrc: `${mediaUrl}/mpegfzgm/batch-platinum.png`,
    },
    Gold: {
      label: 'TYM Gold Dealer',
      bgClass: 'bg-gold text-center min-w-[134px]',
      imgSrc: `${mediaUrl}/zg1pxhac/batch-gold.png`,
    },
  };

  const dealer = lang === 'en-us' ? dealerCategories[category] : null;

  return (
    <div
      className={`relative flex w-full cursor-pointer 
      flex-col gap-y-2 md:justify-between md:gap-y-3 ${cardClass}`}>
      {dealer && (
        <>
          <div
            className={`absolute -right-[1px] top-7 px-[11px] py-[6px] text-[12px] font-bold ${dealer.bgClass}`}>
            {dealer.label}
          </div>
          <Image
            className="relative -mt-2 mb-4"
            alt={title}
            src={dealer.imgSrc}
            width={60}
            height={60}
          />
        </>
      )}

      <div className="flex flex-col gap-y-2 md:justify-between md:gap-y-3">
        <h2
          className={`${lang === 'en-us' ? 'max-w-[216px]' : ''} 
          font-noto text-clamp16to18 font-bold leading-[167%]`}>
          {title}
        </h2>
        <div className="min-h-[30px] font-noto text-clamp12to15 leading-[160%]">
          {address && <span dangerouslySetInnerHTML={{ __html: `${address.trim()},` }} />}
          <br />
          {city && (lang === 'en' || lang === 'en-us') && <span>{city}, </span>}
          {state && <span>{state}</span>}
          {zip && <span> {zip}</span>}, {country}
        </div>
      </div>

      {lang === 'en-us' || lang === 'de' ? (
        <div className="flex justify-between gap-y-2 pt-2 md:gap-y-5">
          <div className="font-noto text-clamp12to15 font-bold">
            Distance away: <span className="text-[#C91820]">{distanceLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => onAction(item)}
            className="request-quote-see-contact-details-button card-button flex items-center gap-2 pt-1">
            <Icons name="ArrowRight" className="stroke-primary stroke-2" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 md:justify-between md:gap-y-5">
          <span className="font-noto text-clamp12to15">{distanceLabel}</span>
          <button
            type="button"
            onClick={() => onAction(item)}
            className="request-quote-see-contact-details-button card-button flex items-center gap-2 pt-1 md:pt-2">
            <Icons name="ArrowRight" className="stroke-primary stroke-2" />
            <span className="font-noto text-[13px] font-bold md:text-[15px]">
              {getTranslationByKey('See contact details', translations, lang)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}