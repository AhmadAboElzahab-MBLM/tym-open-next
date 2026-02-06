import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';
import Listing from '@/components/global-network/listing';
import SelectDropdown from '@/components/layout/select-dropdown';
import { getTranslationByKey } from '@/utils/translation-helper';
import Loading from '@/components/layout/loading';
import { motion } from 'framer-motion';
import fetchMyIp from '@/helpers/fetch-my-ip';
import sortByNearestLocation from '@/helpers/sort-by-nearest-location';
import BoxedContainer from '../layout/boxed-container';
import GlobalNetworkMap from './global-network-map';

export default function GlobalNetwork({ data, id }) {
  const { translations, lang } = useContext(GlobalContext);
  const regions = {
    en: 'International',
    ko: 'South Korea',
    de: 'Europe',
    'en-ko': 'South Korea',
    'en-us': 'North America',
  };
  const currRegion = regions[lang];
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const items = _.get(data, 'properties.items.items', []);
  const [selectedRegion, setSelectedRegion] = useState(currRegion);
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [regionsNew, setRegionsNew] = useState([]);
  const [clientLocation, setClientLocation] = useState({});
  const formTitle = _.get(data, 'properties.formTitle.markup', '');
  const formText = _.get(data, 'properties.formText.markup', '');
  const formId = _.get(data, 'properties.formId', '');
  const isNA = lang === 'en-us';

  const [formLoaded, setFormLoaded] = useState(false);

  const handleAfterOpen = () => {
    const script = document.createElement('script');
    script.id = 'hs-form-script';
    script.src = 'https://js.hsforms.net/forms/v2.js';
    script.onload = () => setFormLoaded(true);
    document.body.appendChild(script);
  };

  const getCurrLocation = async () => {
    const ipData = await fetchMyIp();
    const ip = _.get(ipData, 'userIP', '');
    if (!ip) return null;
    let res = await fetch('/api/get-ip', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ip }),
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });

    res = await res.json();
    return res.data;
  };

  const fetchData = async () => {
    try {
      const currLocation = await getCurrLocation();

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
        };
      });

      const uniqueRegions = _.map(_.uniqBy(mappedData, 'region'), 'region');
      const orderedRegions = ['South Korea', 'North America', 'International'];
      const filtered = _.filter(mappedData, (item) => item.region === currRegion);
      const orderedUniqueRegions = _.filter(orderedRegions, (region) =>
        _.includes(uniqueRegions, region),
      );

      // console.log(sortByNearestLocation(currLocation, filtered));
      // console.log(sortByNearestLocation(currLocation, mappedData));

      setClientLocation(currLocation);
      setFilteredOffices(sortByNearestLocation(currLocation, filtered));
      setOffices(sortByNearestLocation(currLocation, mappedData));
      setRegionsNew(orderedUniqueRegions);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  // console.log(clientLocation);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRegion === 'Region') {
      setFilteredOffices([]);
    } else {
      const filtered = _.filter(offices, (item) => item.region === selectedRegion);
      setFilteredOffices(sortByNearestLocation(clientLocation, filtered));
    }
  }, [selectedRegion]);

  useEffect(() => {
    const sortedOffices = sortByNearestLocation(clientLocation, filteredOffices);
    setFilteredOffices(sortedOffices);
  }, [filteredOffices.length]);

  useEffect(() => {
    if (!formLoaded) {
      handleAfterOpen();
    } else {
      const formConfig = {
        region: 'na1',
        portalId: '8804541',
        formId,
        target: '#hubspotForm',
      };
      if (isNA && formLoaded && window.hbspt) window.hbspt.forms.create(formConfig);
    }
  }, [formLoaded]);

  return (
    <section id={id} className="bg-white pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        <div className="flex max-w-[832px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
          {_.isEmpty(title) || (
            <div
              className="max-w-[780px] text-[26px] font-bold uppercase leading-[34px] text-[#000]
              md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {_.isEmpty(text) || (
            <div
              className="flex flex-col gap-y-[15px] font-noto text-[15px] font-normal leading-[26px]
              text-[#000] md:gap-y-[32px] lg:text-[18px] lg:leading-[32px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          )}
        </div>
      </BoxedContainer>
      <BoxedContainer variant="lg" className="!px-0 md:!px-4 4xl:!px-0">
        <div className="pt-[30px] md:pt-[60px]">
          <GlobalNetworkMap />
        </div>
      </BoxedContainer>
      {isNA ? (
        <>
          <BoxedContainer className="pb-[60px] pt-[10px] md:pb-[87px]">
            <div className="flex max-h-[500px] w-full md:max-h-[442px]">
              <div
                className="flex w-full flex-col flex-wrap content-between gap-x-4 gap-y-7
                sm:gap-x-12 md:gap-x-24 md:gap-y-[60px] lg:gap-x-30">
                {_.map(items, (item, index) => {
                  const { regionName, countriesName } = item.content.properties;
                  return (
                    <div key={index} className="flex w-fit flex-col gap-y-[15px] md:gap-y-[20px]">
                      <h3 className="font-noto text-clamp14to18 font-bold leading-1.77 text-cherry">
                        {regionName}
                      </h3>
                      <ul
                        data-first={index === 0}
                        className="grid grid-cols-1 flex-wrap gap-3 md:gap-[15px] gap-x-2
                        data-[first=true]:grid-cols-2 sm:gap-x-12 md:gap-x-24 md:gap-y-[15px]
                        lg:gap-x-30">
                        {_.map(countriesName, (country, index2) => (
                          <li
                            className="font-noto text-clamp12to18 leading-1.42 text-primary"
                            key={`${index}-${index2}`}>
                            {country}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </BoxedContainer>
          <BoxedContainer className="border-b border-cherry pb-8 md:pb-12 xl:pb-18">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col gap-y-[15px] border-t border-cherry
              pt-8 md:gap-y-[20px] md:pt-12 lg:gap-y-[32px] xl:pt-18">
              <div
                className="text-[26px] font-bold uppercase leading-[34px] text-primary
                md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
                dangerouslySetInnerHTML={{ __html: formTitle }}
              />
              <div
                className="flex flex-col gap-1 font-noto text-clamp12to15 font-normal leading-1.625
                text-black lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: formText }}
              />
            </motion.div>
            <div
              id="hubspotForm"
              className="tym-form max-w-[920px] pt-[5px] md:pt-[45px] lg:pt-[65px]"
            />
          </BoxedContainer>
        </>
      ) : _.isEmpty(offices) ? (
        <Loading />
      ) : (
        <BoxedContainer className="contact-locations">
          <div className="flex flex-col gap-y-4 py-4 lg:gap-y-8 lg:py-6">
            <div
              className="flex flex-wrap items-end gap-5 border-b border-cherry md:gap-x-8
              lg:gap-x-12 xl:gap-x-16 2xl:gap-x-20">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative flex w-full items-start gap-x-2 sm:w-[calc(50%-0.625rem)]
                md:w-80 md:gap-x-4">
                <span
                  className="flex-shrink-0 font-noto text-clamp14to15 font-bold uppercase
                text-primary">
                  {getTranslationByKey('Select', translations, lang)}:
                </span>
                <div className="flex-grow">
                  <SelectDropdown
                    items={regionsNew}
                    onSelect={setSelectedRegion}
                    selectedValue={{
                      value: selectedRegion,
                      label: getTranslationByKey(selectedRegion, translations, lang),
                    }}
                    defaultValue="Region"
                  />
                </div>
              </motion.div>
            </div>
          </div>
          <Listing items={filteredOffices} geolocation={clientLocation} />
        </BoxedContainer>
      )}
    </section>
  );
}
