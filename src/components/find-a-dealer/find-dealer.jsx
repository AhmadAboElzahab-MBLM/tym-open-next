'use client';

import React, { useEffect, useState, useContext, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import _ from 'lodash';
import { motion } from 'framer-motion';
import BoxedContainer from '@/components/layout/boxed-container';
import GoogleMaps from '@/components/layout/google-maps';
import Listing from '@/components/find-a-dealer/listing';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import Loading from '@/components/layout/loading';
import getDistance from '@/helpers/get-distance';
import SearchWithSuggestions from './search-with-suggestions';

function SearchParamsWrapper({ onParamsExtracted }) {
  const searchParams = useSearchParams();
  const dZip = searchParams.get('dZip');
  const dId = searchParams.get('dId');

  useEffect(() => {
    onParamsExtracted({ dZip, dId });
  }, [dZip, dId, onParamsExtracted]);

  return null;
}

function FindDealer({ data, id }) {
  const { translations, lang } = useContext(GlobalContext);

  const [searchParamsData, setSearchParamsData] = useState({ dZip: '', dId: '' });

  const regions = {
    en: 'International',
    'en-us': 'North America',
    'en-ko': 'South Korea',
    ko: 'South Korea',
  };

  const region = _.get(regions, lang, 'International');
  const titleMarkup = _.get(data, 'properties.title.markup', '');
  const textMarkup = _.get(data, 'properties.text.markup', '');
  const searchLabel = _.get(data, 'properties.searchLabel', '');
  const searchPlaceholder = _.get(data, 'properties.searchPlaceholder', '');

  const [offices, setOffices] = useState({});
  const [officesByRegion, setOfficesByRegion] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});

  const resultLabel = `${_.size(officesByRegion)} ${getTranslationByKey(
    'TYM DEALERS FOUND NEAR YOUR LOCATION',
    translations,
    lang,
  )}`;

  // Helper function to get dealer coordinates
  const getDealerCoordinates = (dealer) => {
    const latitude = parseFloat(dealer.latitude, 10);
    const longitude = parseFloat(dealer.longitude, 10);
    
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
    
    return { latitude, longitude };
  };

  const onSelectAddress = (value) => {
    if (_.isNil(value)) {
      setSelectedLocation({});
      return;
    }
    const latitude = Number(_.get(value, 'lat', 0));
    const longitude = Number(_.get(value, 'lng', 0));
    setSelectedLocation({ latitude, longitude });
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dealers', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });

      const resp = await res.json();

      const dealersData = _.get(resp, 'data', []);

      const mappedData = _.map(dealersData, (item) => {
        const itemLocation = _.get(item, 'properties.google_maps_location', '');
        const itemLat = _.trim(_.split(itemLocation, ',')[0]);
        const itemLng = _.trim(_.split(itemLocation, ',')[1]);
        return {
          dId: _.get(item, 'properties.hs_object_id', ''),
          name: _.get(item, 'properties.company', ''),
          location: itemLocation,
          address: _.get(item, 'properties.address', ''),
          latitude: itemLat,
          longitude: itemLng,
          phone: _.get(item, 'properties.phone', ''),
          mobile: _.get(item, 'properties.mobile', ''),
          region:
            _.get(item, 'properties.market_2', 'Domestic') === 'Domestic'
              ? 'South Korea'
              : _.get(item, 'properties.market_2', ''),
          country: _.get(item, 'properties.country', ''),
          city: _.get(item, 'properties.city', ''),
          website: _.get(item, 'properties.website', ''),
          zip: _.get(item, 'properties.zip', ''),
          state: _.get(item, 'properties.state', ''),
          email: _.get(item, 'properties.email', ''),
          fax: _.get(item, 'properties.fax', ''),
          ceo: _.get(item, 'properties.company_owner_name', ''),
          dealer_category: _.get(item, 'properties.dealer_category', ''),
          dealer_about: _.get(item, 'properties.dealer_about', ''),
          dealer_image: _.get(item, 'properties.dealer_main_image', ''),
          dealer_image_1: _.get(item, 'properties.dealer_additional_image_1', ''),
          dealer_image_2: _.get(item, 'properties.dealer_additional_image_2', ''),
          dealer_image_3: _.get(item, 'properties.dealer_additional_image_3', ''),
          dealer_services: _.get(item, 'properties.dealer_services', ''),
        };
      });

      setOffices(_.groupBy(mappedData, 'region'));
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(selectedLocation)) {
      const radius = 200; // Set the radius to 200 miles
      const currRegionOffices = _.get(offices, region, []);
      const filtered = _.filter(currRegionOffices, (item) => item.region === region);
      
      // Filter dealers within 200-mile radius using actual distance calculation
      const filteredByDistance = filtered.filter((dealer) => {
        const dealerCoordinates = getDealerCoordinates(dealer);
        if (!dealerCoordinates) return false;
        
        const distance = getDistance(selectedLocation, dealerCoordinates);
        return distance && distance.miles <= radius;
      });

      // Sort by closest distance
      const sortedDealers = filteredByDistance.sort((a, b) => {
        const aCoordinates = getDealerCoordinates(a);
        const bCoordinates = getDealerCoordinates(b);
        
        if (!aCoordinates || !bCoordinates) return 0;
        
        const distanceA = getDistance(selectedLocation, aCoordinates);
        const distanceB = getDistance(selectedLocation, bCoordinates);
        
        if (!distanceA || !distanceB) return 0;
        
        return distanceA.miles - distanceB.miles;
      });

      setOfficesByRegion(sortedDealers);
    }
  }, [selectedLocation, offices, region]);

  const [isMapView, setIsMapView] = useState(true);
  const handleMapViewClick = () => {
    setIsMapView(true);
    searchParamsData.dId = '';
  };
  const handleListViewClick = () => setIsMapView(false);

  if (_.isEmpty(offices))
    return (
      <div className="pt-[20vh]">
        <Loading />
      </div>
    );

  return (
    <section id={id} className="relative z-10 pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <Suspense fallback={<div>Loading search parameters...</div>}>
        <SearchParamsWrapper onParamsExtracted={setSearchParamsData} />
      </Suspense>
      <BoxedContainer className="flex w-full flex-col gap-4 lg:gap-y-[62px]">
        <div className="flex max-w-[832px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
          {_.isEmpty(titleMarkup) || (
            <div
              className="text-[26px] font-bold uppercase leading-[34px] text-[#000]
              md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
              dangerouslySetInnerHTML={{ __html: titleMarkup }}
            />
          )}
          {_.isEmpty(textMarkup) || (
            <div
              className="flex flex-col gap-y-[15px] font-noto text-[14px] font-normal
              leading-[26px] text-[#000] md:gap-y-[32px] md:text-[15px] 
              lg:text-[18px] lg:leading-[32px]"
              dangerouslySetInnerHTML={{ __html: textMarkup }}
            />
          )}
        </div>

        <SearchWithSuggestions
          label={searchLabel}
          placeholder={searchPlaceholder}
          onSelectAddress={onSelectAddress}
          defaultZip={searchParamsData.dZip || ''}
        />
      </BoxedContainer>

      {_.isEmpty(offices) || _.isEmpty(selectedLocation) || (
        <>
          <div className="hidden w-full md:block">
            <BoxedContainer variant="lg" className="py-6 lg:py-10">
              <GoogleMaps
                markers={officesByRegion}
                classnames="h-[300px] md:h-[680px] map-desktop"
                geolocation={selectedLocation}
                defaultId={searchParamsData.dId || ''}
              />
            </BoxedContainer>
            <BoxedContainer>
              <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6">
                <div className="flex flex-wrap items-end border-b border-cherry pb-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="relative flex w-full items-start gap-x-2 sm:w-[calc(50%-0.625rem)]
                  md:w-80 md:gap-x-4">
                    <span className="flex-shrink-0 text-clamp14to15 font-bold uppercase">
                      {resultLabel}
                    </span>
                  </motion.div>
                </div>
              </div>
              {_.isEmpty(officesByRegion) || (
                <>
                  <Listing items={officesByRegion} geolocation={selectedLocation} lang={lang} />
                  <div className="h-[1px] w-full bg-cherry" />
                </>
              )}
            </BoxedContainer>
          </div>

          <div className="mobile-wrapper relative z-[1005] w-full md:hidden">
            {isMapView ? (
              <BoxedContainer variant="lg" className="map-view !px-0 py-6 lg:py-10">
                <GoogleMaps
                  markers={officesByRegion}
                  classnames="h-[calc(100vh-300px)] z-[101]"
                  geolocation={selectedLocation}
                  defaultId={searchParamsData.dId || ''}
                />
              </BoxedContainer>
            ) : (
              <BoxedContainer className="list-view">
                <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6">
                  <div className="flex flex-wrap items-end border-b border-cherry pb-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="relative flex w-full items-start gap-x-2 pt-6 
                      sm:w-[calc(50%-0.625rem)] md:w-80 md:gap-x-4">
                      <span className="flex-shrink-0 text-clamp14to15 font-bold uppercase">
                        {resultLabel}
                      </span>
                    </motion.div>
                  </div>
                </div>
                {_.isEmpty(officesByRegion) || (
                  <>
                    <Listing items={officesByRegion} geolocation={selectedLocation} lang={lang} />
                    <div className="h-[1px] w-full bg-cherry" />
                  </>
                )}
              </BoxedContainer>
            )}
            <div
              className="mobile-cta-wrapper fixed bottom-0 left-0 right-0 z-[1002] 
              flex justify-center p-7 [&>button]:w-[200px] [&>button]:min-w-[120px] 
              [&>button]:bg-black [&>button]:p-3 [&>button]:text-[12px] 
              [&>button]:font-bold [&>button]:uppercase [&>button]:text-white">
              {isMapView ? (
                <button type="button" className="btn-list-view" onClick={handleListViewClick}>
                  List View
                </button>
              ) : (
                <button type="button" className="btn-map-view" onClick={handleMapViewClick}>
                  Map View
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default FindDealer;
