/* eslint-disable react/no-danger */
/* eslint-disable no-underscore-dangle */

import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import BoxedContainer from '../layout/boxed-container';
import Loading from '../layout/loading';

export default function FeaturedDealerSlider({ data, lang }) {
  const subtitle = _.get(data, 'properties.subtitle', '');
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const [dealers, setDealers] = useState([]);

  const mediaUrl = `${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}/media`;

  const fetchData = async () => {
    try {
      const res = await fetch('/dealers', {
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
          id: _.get(item, 'properties.hs_object_id', ''),
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
          dealer_image:
            _.get(item, 'properties.dealer_main_image', '') || `${mediaUrl}/sesel5ck/logo-tym.png`,
          dealer_image_1: _.get(item, 'properties.dealer_additional_image_1', ''),
          dealer_image_2: _.get(item, 'properties.dealer_additional_image_2', ''),
          dealer_image_3: _.get(item, 'properties.dealer_additional_image_3', ''),
          dealer_services: _.get(item, 'properties.dealer_services', ''),
        };
      });

      const groupedDealers = _.groupBy(mappedData, 'region');

      let filteredDealers = (groupedDealers['North America'] || []).filter(
        (dealer) => dealer.dealer_category && dealer.dealer_category.trim() !== '',
      );

      const platinumDealer = filteredDealers.find(
        (dealer) => dealer.dealer_category === 'Platinum',
      );
      const goldDealer = filteredDealers.find((dealer) => dealer.dealer_category === 'Gold');

      filteredDealers = filteredDealers.filter(
        (dealer) =>
          dealer.id !== (platinumDealer?.id || '') && dealer.id !== (goldDealer?.id || ''),
      );

      const sortedDealers = [
        ...(platinumDealer ? [platinumDealer] : []),
        ...(goldDealer ? [goldDealer] : []),
        ...filteredDealers,
      ];

      setDealers(sortedDealers);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section id="featured-dealer-slider" className="">
      <BoxedContainer className="!max-w-[1290px]">
        <div className="mx-auto my-10 h-[1px] w-full max-w-[1120px] bg-cherry lg:my-20" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[928px] flex-col gap-y-[20px]
          lg:gap-y-[40px]">
          <div className="flex flex-col gap-y-5 pb-10 text-center">
            {_.isEmpty(subtitle) || (
              <h4
                className="font-noto text-clamp12to18 font-bold uppercase tracking-[1px] 
              md:tracking-[1.5px]">
                {subtitle}
              </h4>
            )}

            {_.isEmpty(title) || (
              <div
                className="font-sans text-clamp20to28 font-bold uppercase leading-1.42 text-primary
                "
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className="font-noto text-clamp12to18 font-normal leading-1.77 text-primary"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
        </motion.div>

        {dealers.length > 0 ? (
          <Swiper
            className="featured-slider mx-auto max-w-[1150px] !overflow-visible"
            // allowTouchMove={false}
            // simulateTouch={false}
            grabCursor={false}
            navigation
            initialSlide={0}
            spaceBetween={0}
            modules={[Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}>
            {dealers.map((dealer, index) => {
              const dealerCategories = {
                Platinum: {
                  label: 'Platinum',
                  imgSrc: `${mediaUrl}/ionpouij/batch-platinum_v2.png`,
                },
                Gold: {
                  label: 'Gold',
                  imgSrc: `${mediaUrl}/ufxecmyn/batch-gold_v2.png`,
                },
              };
              const dealerInfo = dealerCategories[dealer.dealer_category]
                ? dealerCategories[dealer.dealer_category]
                : '';

              return (
                <SwiperSlide className="slide-card relative h-full" key={index}>
                  <div className="w-full md:px-2 lg:px-3 xl:px-4">
                    <div className="featured-card-image relative z-0">
                      {dealer.dealer_image && (
                        <Image
                          src={dealer.dealer_image}
                          width={544}
                          height={409}
                          alt={dealer.name}
                          className="relative z-0 h-auto w-full object-cover"
                        />
                      )}
                      {dealer.name && (
                        <h3
                          className="absolute bottom-7 left-6 right-8 z-10 text-[24px] 
                      font-bold leading-[1.1] text-white md:text-[28px] lg:left-8 
                      lg:text-[32px] xl:text-[36px]">
                          {dealer.name}
                        </h3>
                      )}
                    </div>
                    <div
                      className="relative z-20 flex gap-3 md:gap-4 bg-[#f2f2f2] 
                  pe-6 ps-6 py-4 lg:gap-8 lg:ps-8 xl:gap-12">
                      {dealer.dealer_about && (
                        <p
                          className="font-noto text-[14px] md:text-[15px] font-normal 
                      leading-[1.6] text-primary md:line-clamp-4 md:max-h-[98px]">
                          {dealer.dealer_about}
                        </p>
                      )}
                      {dealerInfo && (
                        <div className="flex min-w-[85px] flex-col items-center gap-2 pt-1">
                          <Image
                            className="relative h-auto w-[75px] lg:w-[85px]"
                            src={dealerInfo.imgSrc}
                            width={85}
                            height={85}
                            alt={dealerInfo.label}
                          />
                          <div className="font-noto text-[14px] font-bold">{dealerInfo.label}</div>
                        </div>
                      )}
                    </div>
                    <Link
                      className="absolute bottom-0 left-0 right-0 top-0 z-50"
                      href={`/${lang}/find-a-dealer/?dZip=${dealer.zip}&dId=${dealer.id}`}>
                      &nbsp;
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div className="pt-[6vh]">
            <Loading />
          </div>
        )}

        <div className="mx-auto mb-8 mt-10 h-[1px] w-full max-w-[1120px] bg-cherry lg:mt-20" />
      </BoxedContainer>
    </section>
  );
}
