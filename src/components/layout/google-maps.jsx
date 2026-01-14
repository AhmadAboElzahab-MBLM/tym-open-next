'use client';

import React, { useContext, useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Icons from '@/components/layout/icons';
import GlobalContext from '@/context/global-context';
import getDistance from '@/helpers/get-distance';
import { getTranslationByKey } from '@/utils/translation-helper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/layout/button';

function GoogleMaps({ markers, classnames = '', geolocation, defaultId }) {
  const { lang, translations } = useContext(GlobalContext);
  const [currentMarker, setCurrentMarker] = React.useState(null);
  const [map, setMap] = useState(null);

  const defaultLat = _.get(geolocation, 'latitude', 0);
  const defaultLng = _.get(geolocation, 'longitude', 0);
  const center = { lat: defaultLat, lng: defaultLng };
  const units = { en: 'km', 'en-us': 'miles', 'en-ko': 'km', ko: 'km' };

  const isKo = _.includes(lang, 'ko');

  const calculateDistanceLabel = (marker) => {
    const location = _.get(marker, 'location', '');
    const [latitude, longitude] = location.split(',').map((coord) => coord?.trim());
    const markerLocation = { latitude, longitude };
    const distance = getDistance(geolocation, markerLocation);
    const unit = units[lang];
    return `${_.isNull(distance) ? 'N/A' : Math.round(distance[unit])} ${unit}`;
  };

  const handleZoomIn = () => {
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom(map.getZoom() - 1);
  };

  const mediaUrl = `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}/media`;

  const getMarkerPin = (langMarker, category) => {
    const pinCategory = category;

    const markerIcons = {
      'en-us': {
        Gold: '3semuveh/dealership-gold-icon.png',
        Platinum: 'qzqophvq/dealership-silver-icon.png',
        default: 'gfvjgsdt/dealership-grey-icon.png',
      },
      default: 'ccnd2xqy/dealership-location-icon.png',
    };

    return `${mediaUrl}/${
      markerIcons[langMarker]?.[pinCategory] ||
      markerIcons[langMarker]?.default ||
      markerIcons.default
    }`;
  };

  const parseLocation = (location) => {
    if (!location) return { lat: 0, lng: 0 };
    const [lat, lng] = location.split(',').map((coord) => parseFloat(coord?.trim()) || 0);
    return { lat, lng };
  };

  const ceo = _.get(currentMarker, 'ceo', '');
  const title = _.get(currentMarker, 'name', '');
  const address = _.get(currentMarker, 'address', '');
  const city = _.get(currentMarker, 'city', '');
  const state = _.get(currentMarker, 'state', '');
  const country = _.get(currentMarker, 'country', '');
  const phone = _.get(currentMarker, 'phone', '');
  const mobile = _.get(currentMarker, 'mobile', '');
  const fax = _.get(currentMarker, 'fax', '');
  const zip = _.get(currentMarker, 'zip', '');
  const email = _.get(currentMarker, 'email', '');
  const website = _.get(currentMarker, 'website', '');
  const image1 = _.get(currentMarker, 'dealer_image_1', '');
  const image2 = _.get(currentMarker, 'dealer_image_2', '');
  const image3 = _.get(currentMarker, 'dealer_image_3', '');
  const category = _.get(currentMarker, 'dealer_category', '');
  const image =
    _.get(currentMarker, 'dealer_image', '') ||
    (['Platinum', 'Gold'].includes(category) ? `${mediaUrl}/sesel5ck/logo-tym.png` : '');
  const about = _.get(currentMarker, 'dealer_about', '');
  const services = _.get(currentMarker, 'dealer_services', '')
    ? _.get(currentMarker, 'dealer_services', '')
        .split(';')
        .map((service) => service.trim())
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

  const dealerBatch = lang === 'en-us' ? dealerCategories[category] : null;

  useEffect(() => {
    if (defaultId && markers.length > 0) {
      const defaultMarker = markers.find((marker) => String(marker.dId) === String(defaultId));
      if (defaultMarker) {
        setCurrentMarker(defaultMarker);
      }
    }
  }, [defaultId, markers]);

  const customInfoRef = useRef(null);

  useEffect(() => {
    if (customInfoRef.current) {
      customInfoRef.current.scrollTop = 0;
    }
  }, [currentMarker]);

  const [mapCenter, setMapCenter] = useState({ lat: defaultLat, lng: defaultLng });
  const userMovedMap = useRef(false);

  useEffect(() => {
    if (!userMovedMap.current) {
      setMapCenter({ lat: defaultLat, lng: defaultLng });
    }
  }, [defaultId, markers]);

  useEffect(() => {
    const bodyClass = 'info-window-open';

    if (currentMarker) {
      document.body.classList.add(bodyClass);
    } else {
      document.body.classList.remove(bodyClass);
    }

    return () => {
      document.body.classList.remove(bodyClass);
    };
  }, [currentMarker]);

  const images = [image1, image2, image3].filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isSwiperMounted, setIsSwiperMounted] = useState(false);

  useEffect(() => {
    if (isSliderOpen) {
      const rafId = requestAnimationFrame(() => {
        setIsSwiperMounted(true);
      });

      return () => cancelAnimationFrame(rafId);
    }
    setIsSwiperMounted(false);
  }, [isSliderOpen]);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const sliderContentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSliderOpen &&
        sliderContentRef.current &&
        !sliderContentRef.current.contains(event.target)
      ) {
        setIsSliderOpen(false);
        document.body.classList.remove('slider-modal-opened');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSliderOpen(false);
        document.body.classList.remove('slider-modal-opened');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSliderOpen]);

  return (
    <div className={`relative w-full overflow-hidden ${classnames}`}>
      <GoogleMap
        className="bg-red-600"
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={isKo ? 9 : lang === 'en-us' ? 7.5 : 6}
        onLoad={(loadedMap) => {
          setMap(loadedMap);

          loadedMap.addListener('click', () => {
            setCurrentMarker(null);
          });
        }}>
        <Marker position={center} icon={`${mediaUrl}/xivozcsp/location-icon.png`} />

        {_.map(markers, (marker, index) => {
          const markerPin = getMarkerPin(lang, marker.dealer_category);
          const position = parseLocation(marker.location);

          return lang !== 'en-us' ? (
            <Marker
              key={index}
              icon={markerPin}
              position={position}
              onClick={() => setCurrentMarker(marker)}>
              {currentMarker === marker && (
                <InfoWindow
                  position={parseLocation(currentMarker.location)}
                  onCloseClick={() => setCurrentMarker(null)}>
                  <div className="custom-info-window">
                    <h3 className="font-noto text-[18px] font-bold leading-[30px] text-primary">
                      {_.get(currentMarker, 'name', 'Unknown Location')}
                    </h3>
                    <p className="font-noto text-[15px] leading-[24px] text-primary">
                      <span className="font-bold">{calculateDistanceLabel(currentMarker)}</span>{' '}
                      from your location
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ) : (
            <Marker
              key={index}
              icon={markerPin}
              position={position}
              onClick={() => setCurrentMarker(marker)}
            />
          );
        })}
      </GoogleMap>

      {/* Custom Info Window for NA */}
      {currentMarker && lang === 'en-us' && (
        <div
          className="custom-info absolute bottom-0 left-0 top-0 z-50 bg-[#f7f7f7] 
        shadow-lg transition duration-300 md:w-[380px] lg:w-[455px]">
          <button
            type="button"
            className="btn-close absolute right-[5px] top-[5px] z-20 flex h-[32px] 
              w-[32px] items-center justify-center rounded-full bg-white md:right-[20px]
              md:top-[20px] md:shadow-md"
            onClick={() => setCurrentMarker(null)}>
            <Icons name="Close2" className="[&>path]:!stroke-black" />
          </button>
          <div className="custom-info-container relative h-full w-full">
            {image && (
              <div className="bg-[#ebebeb]">
                <Image
                  src={image}
                  width={455}
                  height={372}
                  alt={title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
            <div
              ref={customInfoRef}
              className={`md:overflow-y-auto ${image ? 'md:h-[calc(100%-372px)]' : 'h-full'} ${category === 'Gold' ? 'bg-[#f7f7f7] ' : category === 'Platinum' ? 'bg-platinum-new ' : 'bg-[#f7f7f7]'} pt-2 custom-info-inside `}>
              <div className="flex w-full flex-col">
                <div className="flex flex-col gap-y-4 p-6">
                  {dealerBatch && <div className="text-[10px]">{dealerBatch.label}</div>}
                  <div className="mb-3 flex w-full justify-between gap-7">
                    <div className="flex flex-col gap-y-4">
                      <h2 className="max-w-[300px] font-noto text-clamp20to28 font-bold leading-1 text-primary">
                        {title}
                      </h2>
                      <p className="font-noto text-clamp14to15">
                        <span className="font-bold">{calculateDistanceLabel(currentMarker)}</span>{' '}
                        from your location
                      </p>
                    </div>
                    <div className="w-28 text-right">
                      {dealerBatch && (
                        <Image
                          className="relative ml-auto mr-0 h-auto w-[70px] md:w-[92px]"
                          src={dealerBatch.imgSrc}
                          width={92}
                          height={92}
                          alt={dealerBatch.label}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mobile-cta-adjustment flex flex-col gap-5">
                    <Button
                      label="Request a quote"
                      text="find-a-dealer-request-a-quote-button"
                      url={`/${lang}/products/request-quote`}
                      variant="primaryCherry"
                      w="w-full"
                      h="lg:min-h-[48px] min-h-[40px]"
                      py="md:py-[12px] py-[8px]"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-6 p-6 pe-4 pt-0 md:space-y-10 md:p-6">
                {about && (
                  <div className="flex flex-col">
                    <div className="flex flex-col gap-y-[12px]">
                      <h2 className="font-noto text-clamp16to18 font-bold text-primary">
                        {getTranslationByKey('About', translations, lang)}
                      </h2>

                      <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                        {about}
                      </p>
                    </div>
                  </div>
                )}

                {image1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        width={158}
                        height={170}
                        alt={`Image ${idx + 1}`}
                        className="h-auto w-full cursor-pointer object-cover"
                        onClick={() => {
                          setActiveIndex(idx);
                          setIsSliderOpen(true);
                          document.body.classList.add('slider-modal-opened');
                        }}
                      />
                    ))}
                  </div>
                )}

                {isSliderOpen && typeof window !== 'undefined' && (
                  <div className="popup-slider-wrapper fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80">
                    <div
                      className="popup-slider relative mx-auto max-w-[96%] md:max-w-[600px]"
                      ref={sliderContentRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSliderOpen(false);
                          document.body.classList.remove('slider-modal-opened');
                        }}
                        className="btn-close absolute right-4 top-4 z-10 h-7 w-7 rounded-full bg-black text-xs text-white">
                        ✕
                      </button>

                      {isSwiperMounted && (
                        <Swiper
                          key={activeIndex}
                          modules={[Navigation]}
                          navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                          }}
                          initialSlide={activeIndex}
                          className="h-auto md:w-[90%] md:min-w-[600px] md:max-w-2xl">
                          {images.map((img, idx) => (
                            <SwiperSlide key={idx} className="md:min-w-[600px]">
                              <img
                                src={img}
                                alt={`Slide ${idx + 1}`}
                                className="h-auto w-full object-contain"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}

                      <button type="button" ref={prevRef} className="swiper-button-prev">
                        &nbsp;
                      </button>
                      <button type="button" ref={nextRef} className="swiper-button-next">
                        &nbsp;
                      </button>
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
                            {services
                              .slice(0, Math.ceil(services.length / 2))
                              .map((service, index) => (
                                <li key={index}>{service}</li>
                              ))}
                          </ul>
                          <ul className="list-disc pl-3 font-noto text-clamp14to15 text-primary [&>li]:marker:text-[#C91820]">
                            {services
                              .slice(Math.ceil(services.length / 2))
                              .map((service, index) => (
                                <li key={index}>{service}</li>
                              ))}
                          </ul>
                        </div>
                      ) : (
                        <ul className="grid list-disc grid-cols-2 gap-x-[12px] pl-3 font-noto text-clamp14to15 text-primary [&>li]:marker:text-[#C91820]">
                          {services.map((service, index) => (
                            <li key={index}>{service}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-y-[12px]">
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
                        <Link href={`tel:${fax}`}>{fax}</Link>
                      </p>
                    )}

                    {website && (
                      <p className="gap-x-[12px] font-noto text-clamp14to15 text-primary">
                        <strong className="w-[53px]">
                          {getTranslationByKey('Website', translations, lang)}
                        </strong>
                        <br />
                        <Link href={website || '#'} target="_blank">
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
                      {_.isEmpty(address) || (
                        <span dangerouslySetInnerHTML={{ __html: `${address.trim()},` }} />
                      )}
                      <br />
                      {city && <span>{city}, </span>}
                      {state && <span>{state} </span>}
                      {zip && (
                        <>
                          <br />
                          <span>{zip}, </span>
                        </>
                      )}
                      {country}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex flex-col md:bottom-6">
        <button type="button" className="rounded-full bg-transparent" onClick={handleZoomIn}>
          <Icons name="ZoomIn" className="h-[45px] w-[45px] md:h-[68px] md:w-[68px]" />
        </button>
        <button type="button" className="rounded-full bg-transparent" onClick={handleZoomOut}>
          <Icons name="ZoomOut" className="h-[45px] w-[45px] md:h-[68px] md:w-[68px]" />
        </button>
      </div>
    </div>
  );
}

export default GoogleMaps;
