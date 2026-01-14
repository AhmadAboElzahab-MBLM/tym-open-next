import React, { useContext } from 'react';
import _ from 'lodash';
import haversineDistance from '@/helpers/haverstine-distance';
import Icons from '@/components/layout/icons';
import { getTranslationByKey } from '@/utils/translation-helper';
import useGeolocation from '@/hooks/use-geolocation';
import { usePathname } from 'next/navigation';
import GlobalContext from '@/context/global-context';
import getDistance from '@/helpers/get-distance';

function Card({ item, onAction }) {
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
  const region = _.get(item, 'region', '');
  const units = {
    en: 'km',
    'en-us': 'miles',
    'en-ko': 'km',
    ko: 'km',
  };

  const distance = getDistance(geolocation, { latitude, longitude });
  const unit = units[lang];

  const distanceLabel = `${_.isNull(distance) ? 'N/A' : Math.round(distance[unit])} ${unit}`;

  return (
    <div className="flex cursor-pointer flex-col justify-between gap-y-2 md:mb-8 md:gap-y-3">
      <div className="flex flex-col gap-y-2 md:justify-between md:gap-y-3">
        <h2 className="font-noto text-clamp16to18 font-bold text-primary">{title}</h2>
        <div className="font-noto text-clamp12to15 text-primary">
          {address && <span dangerouslySetInnerHTML={{ __html: `${address.trim()},` }} />}
          {city && <span> {city}, </span>}
          {state && <span>{state}, </span>}
          {zip && <span>{zip}, </span>}
          {country}
        </div>
      </div>
      <div className="flex flex-col gap-y-2 md:justify-between md:gap-y-5">
        <span className="font-noto text-clamp14to15">{distanceLabel}</span>
        <button type="button" onClick={() => onAction(item)} 
        className="flex items-center gap-2 global-network-see-contact-details-button">
          <Icons name="ArrowRight" className="stroke-primary stroke-2" />
          <span className="font-noto text-[13px] font-bold md:text-[15px]">
            {getTranslationByKey('See contact details', translations, lang)}
          </span>
        </button>
      </div>
    </div>
  );
}

export default Card;
