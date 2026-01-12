import React, { useContext } from 'react';
import Modal from '@/components/layout/modal';
import _ from 'lodash';
import Link from 'next/link';
import Icons from '@/components/layout/icons';
import Button from '@/components/layout/button';
import getDistance from '@/helpers/get-distance';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import Image from 'next/image';

// Helper function to get field value from either object format
const getFieldValue = (item, fieldMappings, fallback = '') => {
  if (!item) return fallback;

  for (const field of fieldMappings) {
    const value = _.get(item, field, null);
    if (value !== null && value !== undefined && value !== '') {
      return value;
    }
  }
  return fallback;
};

function PopupModalNA({
  isOpen,
  awyaDistance,
  handleClose,
  item,
  minimal = false,
  selectDealer, // Fixed prop name typo
}) {
  const { lang, translations } = useContext(GlobalContext);

  // Early return if no item
  if (!item) {
    return null;
  }

  // Define field mappings for both object formats
  const fieldMappings = {
    geolocation: ['geolocation', 'google_maps_location'],
    ceo: ['ceo', 'company_owner_name'],
    name: ['name', 'company'],
    address: ['address'],
    city: ['city'],
    state: ['state'],
    country: ['country'],
    phone: ['phone'],
    mobile: ['mobile', 'mobilephone'],
    fax: ['fax'],
    zip: ['zip'],
    email: ['email'],
    website: ['website'],
    location: ['location', 'google_maps_location'],
    dealer_image: ['dealer_image', 'dealer_main_image'],
    dealer_image_1: ['dealer_image_1', 'dealer_additional_image_1'],
    dealer_image_2: ['dealer_image_2', 'dealer_additional_image_2'],
    dealer_image_3: ['dealer_image_3', 'dealer_additional_image_3'],
    dealer_category: ['dealer_category'],
    dealer_about: ['dealer_about'],
    dealer_services: ['dealer_services'],
  };

  // Extract values using the field mappings
  const geolocation = getFieldValue(item, fieldMappings.geolocation, null);
  const ceo = getFieldValue(item, fieldMappings.ceo);
  const title = getFieldValue(item, fieldMappings.name);
  const address = getFieldValue(item, fieldMappings.address);
  const city = getFieldValue(item, fieldMappings.city);
  const state = getFieldValue(item, fieldMappings.state);
  const country = getFieldValue(item, fieldMappings.country);
  const phone = getFieldValue(item, fieldMappings.phone);
  const mobile = getFieldValue(item, fieldMappings.mobile);
  const fax = getFieldValue(item, fieldMappings.fax);
  const zip = getFieldValue(item, fieldMappings.zip);
  const email = getFieldValue(item, fieldMappings.email);
  const website = getFieldValue(item, fieldMappings.website);
  const location = getFieldValue(item, fieldMappings.location);

  // Handle location parsing - it might be a string or we might need to construct it
  let latitude = 0;
  let longitude = 0;

  if (location && typeof location === 'string') {
    const coords = location.split(',');
    latitude = Number(coords[0]?.trim()) || 0;
    longitude = Number(coords[1]?.trim()) || 0;
  } else if (location && typeof location === 'object') {
    // Handle object format
    latitude = Number(location.latitude) || 0;
    longitude = Number(location.longitude) || 0;
  } else {
    // Try to get individual lat/lng fields
    latitude = Number(getFieldValue(item, ['latitude'])) || 0;
    longitude = Number(getFieldValue(item, ['longitude'])) || 0;
  }

  // Calculate distance
  const units = { 'en-us': 'miles', ko: 'miles' }; // Added fallback for Korean
  const unit = units[lang] || 'miles';

  let distanceLabel = 'N/A miles';

  if (awyaDistance) {
    distanceLabel = `${awyaDistance} miles`;
  } else if (geolocation && (latitude !== 0 || longitude !== 0)) {
    const distance = getDistance(geolocation, { latitude, longitude });
    if (distance && distance[unit] !== null && distance[unit] !== undefined) {
      distanceLabel = `${Math.round(distance[unit])} ${unit}`;
    }
  }

  const mediaUrl = `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}/media`;

  // Image handling with proper fallbacks
  const defaultImage = `${mediaUrl}/sesel5ck/logo-tym.png`;
  const image = getFieldValue(item, fieldMappings.dealer_image) || defaultImage;
  const image1 = getFieldValue(item, fieldMappings.dealer_image_1);
  const image2 = getFieldValue(item, fieldMappings.dealer_image_2);
  const image3 = getFieldValue(item, fieldMappings.dealer_image_3);
  const category = getFieldValue(item, fieldMappings.dealer_category);
  const about = getFieldValue(item, fieldMappings.dealer_about);

  // Services parsing with better error handling
  const servicesString = getFieldValue(item, fieldMappings.dealer_services);
  const services = servicesString
    ? servicesString
        .split(';')
        .map((service) => service.trim())
        .filter(Boolean)
    : [];

  const dealerCategories = {
    Platinum: {
      label: 'TYM Platinum Dealer',
      bgClass: 'bg-platinum-new',
      imgSrc: `${mediaUrl}/ionpouij/batch-platinum_v2.png`,
    },
    Gold: {
      label: 'TYM Gold Dealer',
      bgClass: 'bg-white',
      imgSrc: `${mediaUrl}/ufxecmyn/batch-gold_v2.png`,
    },
  };

  const dealer = dealerCategories[category];

  // Handle dealer selection
  const handleDealerSelection = () => {
    if (selectDealer && typeof selectDealer === 'function') {
      selectDealer();
      handleClose();
    }
  };

  return (
    <Modal isOpen={isOpen} className="na-popup" handleClose={handleClose}>
      <div className="relative flex w-full flex-col bg-white md:flex-row md:p-2">
        <button
          type="button"
          className="btn-close absolute right-[5px] top-[5px] z-10 flex h-[32px] w-[32px]
          items-center justify-center rounded-full bg-black md:right-[17px] md:top-[17px]"
          onClick={handleClose}>
          <Icons name="Close2" className="[&>path]:!stroke-white" />
        </button>

        <div
          className={`grid w-full md:grid-cols-2 ${category === 'Platinum' ? 'bg-platinum-new md:bg-none' : ''}`}>
          <div className="flex h-full w-full flex-col">
            {image && (
              <div className="bg-[#ebebeb]">
                <Image
                  src={image}
                  width={554}
                  height={445}
                  alt={title || 'Dealer Image'}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <div
              className={`bg-desktop-only flex h-full flex-col items-center justify-center gap-y-4 p-6
              ${
                category === 'Gold'
                  ? 'bg-white'
                  : category === 'Platinum'
                    ? 'bg-platinum-new'
                    : 'md:bg-[#ededed]'
              }`}>
              <div className="mb-3 flex w-full justify-between gap-7">
                <div className="flex flex-col gap-y-4">
                  <h2 className="max-w-[300px] font-noto text-clamp20to28 font-bold leading-[1.071] text-primary">
                    {title}
                  </h2>

                  <p className="font-noto text-clamp14to15">
                    <span className="font-bold">{distanceLabel}</span>{' '}
                    {getTranslationByKey('from your location', translations, lang)}
                  </p>
                </div>

                <div className="w-28 text-right">
                  {dealer && (
                    <Image
                      className="relative ml-auto mr-0 h-auto w-[70px] md:w-[92px]"
                      src={dealer.imgSrc}
                      width={92}
                      height={92}
                      alt={dealer.label}
                    />
                  )}
                </div>
              </div>

              {selectDealer ? (
                <div className="mobile-cta-adjustment flex  !w-full flex-col gap-5">
                  <Button
                    label={getTranslationByKey('Select Dealer', translations, lang)}
                    clickHandler={handleDealerSelection}
                    variant="primaryCherry"
                    w="w-full"
                    h="lg:min-h-[48px] min-h-[40px]"
                    py="md:py-[12px] py-[8px]"
                  />
                </div>
              ) : (
                <div className="mobile-cta-adjustment flex  !w-full flex-col gap-5 ">
                  <Button
                    label={getTranslationByKey('Request a quote', translations, lang)}
                    text="find-a-dealer-request-a-quote-button"
                    url={`/${lang}/products/request-quote`}
                    variant="primaryCherry"
                    w="w-full"
                    h="lg:min-h-[48px] min-h-[40px]"
                    py="md:py-[12px] py-[8px]"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 overflow-y-auto p-6 pe-4 pt-0 md:max-h-[510px] md:space-y-10 md:p-6 lg:max-h-[640px] xl:max-h-[700px]">
            {about && (
              <div className="flex flex-col">
                <div className="flex flex-col gap-y-[12px]">
                  <h2 className="font-noto text-clamp16to18 font-bold text-primary">
                    {getTranslationByKey('About', translations, lang)}
                  </h2>
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">{about}</p>
                </div>
              </div>
            )}

            {services.length > 0 && (
              <div className="flex flex-col">
                <div className="flex flex-col gap-y-[12px]">
                  <h2 className="font-noto text-clamp16to18 font-bold text-primary">
                    {getTranslationByKey('Services Offered', translations, lang)}
                  </h2>

                  {services.length > 2 ? (
                    <div className="grid grid-cols-2 gap-x-[12px]">
                      <ul className="list-disc pl-3 font-noto text-clamp14to15 text-primary [&>li]:marker:text-[#C91820]">
                        {services.slice(0, Math.ceil(services.length / 2)).map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                      <ul className="list-disc pl-3 font-noto text-clamp14to15 text-primary [&>li]:marker:text-[#C91820]">
                        {services.slice(Math.ceil(services.length / 2)).map((service, index) => (
                          <li key={index + Math.ceil(services.length / 2)}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="list-disc pl-3 font-noto text-clamp14to15 text-primary [&>li]:marker:text-[#C91820]">
                      {services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-y-[12px] pb-20 md:pb-0">
              <h2 className="font-noto text-clamp16to18 font-bold text-primary">
                {getTranslationByKey('Details', translations, lang)}
              </h2>

              <div className="flex flex-col gap-y-[14px] [&>p]:border-b [&>p]:border-[rgba(0,0,0,.1)] [&>p]:pb-2">
                {phone && (
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <strong className="w-[53px]">
                      {getTranslationByKey('Phone', translations, lang)}
                    </strong>
                    <br />
                    <Link href={`tel:${phone}`}>{phone}</Link>
                  </p>
                )}

                {mobile && (
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <strong className="w-[53px]">
                      {getTranslationByKey('Mobile', translations, lang)}
                    </strong>
                    <br />
                    <Link href={`tel:${mobile}`}>{mobile}</Link>
                  </p>
                )}

                {fax && (
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <strong className="w-[53px]">
                      {getTranslationByKey('Fax', translations, lang)}
                    </strong>
                    <br />
                    <span>{fax}</span>
                  </p>
                )}

                {website && (
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <strong className="w-[53px]">
                      {getTranslationByKey('Website', translations, lang)}
                    </strong>
                    <br />
                    <Link
                      href={website.startsWith('http') ? website : `https://${website}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      {website}
                    </Link>
                  </p>
                )}

                {email && (
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <strong className="w-[53px]">
                      {getTranslationByKey('Email', translations, lang)}
                    </strong>
                    <br />
                    <Link href={`mailto:${email}`}>{email}</Link>
                  </p>
                )}

                {ceo && (
                  <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                    <strong className="w-[53px]">
                      {getTranslationByKey('CEO', translations, lang)}
                    </strong>
                    <br />
                    <span>{ceo}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-y-[12px]">
                <p className="font-noto text-clamp14to15 font-bold text-primary">
                  {getTranslationByKey('Street Address', translations, lang)}
                </p>
                <div className="font-noto text-clamp14to15 text-primary">
                  {address && (
                    <>
                      <span dangerouslySetInnerHTML={{ __html: `${address.trim()}` }} />
                      <br />
                    </>
                  )}
                  {city && (
                    <span>
                      {city}
                      {state || zip ? ', ' : ''}
                    </span>
                  )}
                  {state && <span>{state} </span>}
                  {zip && (
                    <span>
                      {zip}
                      {country ? ', ' : ''}
                    </span>
                  )}
                  {country && (
                    <>
                      <br />
                      <span>{country}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PopupModalNA;
