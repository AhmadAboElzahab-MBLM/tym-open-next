import React, { useContext } from 'react';
import Modal from '@/components/layout/modal';
import _ from 'lodash';
import Link from 'next/link';
import Icons from '@/components/layout/icons';
import Button from '@/components/layout/button';
import getDistance from '@/helpers/get-distance';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';

function PopupModal({ isOpen, handleClose, item }) {
  const { lang, translations } = useContext(GlobalContext);
  const geolocation = _.get(item, 'geolocation', {});
  const ceo = _.get(item, 'ceo', '');
  const title = _.get(item, 'name', '');
  const address = _.get(item, 'address', '');
  const city = _.get(item, 'city', '');
  const state = _.get(item, 'state', '');
  const country = _.get(item, 'country', '');
  const phone = _.get(item, 'phone', '');
  const mobile = _.get(item, 'mobile', '');
  const fax = _.get(item, 'fax', '');
  const zip = _.get(item, 'zip', '');
  const email = _.get(item, 'email', '');
  const website = _.get(item, 'website', '');
  const location = _.get(item, 'location', '');
  const latitude = Number(location.split(',')[0]?.trim());
  const longitude = Number(location.split(',')[1]?.trim());
  const units = {
    en: 'km',
    'en-us': 'miles',
    'en-ko': 'km',
    ko: 'km',
    de: 'km',
  };
  const isKO = lang === 'ko' || lang === 'en-ko';

  const distance = getDistance(geolocation, { latitude, longitude });
  const unit = units[lang];
  const distanceLabel = `${_.isNull(distance) ? 'N/A' : Math.round(distance[unit])} ${unit}`;

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="flex w-full flex-col md:h-[635px] md:flex-row">
        <button
          type="button"
          className="absolute right-[5px] top-[5px] flex h-[48px] w-[48px] items-center
          justify-center rounded-full bg-white md:right-[34px] md:top-[34px]"
          onClick={handleClose}>
          <Icons name="Close" />
        </button>
        <div
          className="flex h-full w-full flex-col gap-y-[32px] px-[20px] py-[20px] md:w-1/2
          md:max-w-[560px] md:px-[48px] md:py-[43px]">
          <div className="flex flex-col gap-y-[8px]">
            <h2 className="font-noto text-clamp16to18 font-bold text-primary">{title}</h2>
            <p className="font-noto text-clamp14to15 font-bold text-cherry">
              {distanceLabel}{' '}
              {lang === 'ko' ? (
                ''
              ) : (
                <span className="font-normal text-primary">
                  {getTranslationByKey('from your location', translations, lang)}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-y-[28px]">
            <div className="flex flex-col gap-y-[12px]">
              <h2 className="font-noto text-clamp16to18 font-bold text-primary">
                {getTranslationByKey('Street Address', translations, lang)}
              </h2>
              <div className="font-noto text-clamp14to15 text-primary">
              {_.isEmpty(address) || <span dangerouslySetInnerHTML={{ __html: `${address.trim()},` }} />}
                <br />
                {city && (lang === 'en' || lang === 'en-us' || lang === 'de') && <span>{city}, </span>}
                {state && (lang === 'en' || lang === 'en-us' || lang === 'de') && <span>{state} </span>}
                {state && (lang === 'ko' || lang === 'en-ko') && <span>{state}, </span>}
                {zip && (
                  <>
                    <br />
                    <span>{zip}, </span>
                  </>
                )}
                {country}
              </div>
            </div>
            <div className="flex flex-col gap-y-[12px]">
              <h2 className="font-noto text-clamp16to18 font-bold text-primary">
                {getTranslationByKey('Contact Details', translations, lang)}
              </h2>
              <div className="flex flex-col gap-y-[8px]">
                {phone && (
                  <p className="flex gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <span className="w-[53px] after:ml-px after:inline after:content-[':']">
                      {getTranslationByKey('Phone', translations, lang)}
                    </span>
                    <Link href={`tel:${phone}`}>{phone}</Link>
                  </p>
                )}

                {mobile && (
                  <p className="flex gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <span className="w-[53px] after:ml-px after:inline after:content-[':']">
                      {getTranslationByKey('Mobile', translations, lang)}
                    </span>
                    <Link href={`tel:${mobile}`}>{mobile}</Link>
                  </p>
                )}

                {fax && (
                  <p className="flex gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <span className="w-[53px] after:ml-px after:inline after:content-[':']">
                      {getTranslationByKey('Fax', translations, lang)}
                    </span>
                    <Link href={`tel:${fax}`}>{fax}</Link>
                  </p>
                )}

                {email && (
                  <p className="flex gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <span className="w-[53px] after:ml-px after:inline after:content-[':']">
                      {getTranslationByKey('Email', translations, lang)}
                    </span>
                    <Link href={`mailto:${email}`}>{email}</Link>
                  </p>
                )}

                {website && (
                  <p className="flex gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <span className="w-[53px] after:ml-px after:inline after:content-[':']">
                      {getTranslationByKey('Web', translations, lang)}
                    </span>
                    <Link href={website || '#'} target="_blank">
                      {website}
                    </Link>
                  </p>
                )}
                {ceo && (
                  <p className="flex gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <span className="w-[53px] after:ml-px after:inline after:content-[':']">
                      {getTranslationByKey('CEO', translations, lang)}
                    </span>
                    <span>{ceo}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:pt-[12px]">
              <Button
                label={getTranslationByKey('Request a quote', translations, lang)}
                text="find-a-dealer-request-a-quote-button"
                url={`/${lang}/products/request-quote`}
                variant="primaryCherry"
                w="w-fit"
              />
              {isKO && (
                <a
                  href={`https://m.map.naver.com/search2/search.nhn?query=${address}#/map`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2">
                  <Icons name="ArrowRight" className="stroke-primary stroke-2" />
                  <span className="font-noto text-[13px] font-bold md:text-[15px]">
                    {getTranslationByKey('Find location on Naver Maps', translations, lang)}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="h-[200px] w-full md:h-full md:w-1/2 md:max-w-[560px]">
          <iframe
            title="map"
            className="h-full w-full"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PopupModal;
