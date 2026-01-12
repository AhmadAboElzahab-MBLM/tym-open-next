'use client';

import React, { useState, useCallback } from 'react';
import getDistance, { parseGoogleMapsLocation } from '@/helpers/get-distance';
import _ from 'lodash';
import Icons from '../layout/icons';
import PopupModalNA from '../find-a-dealer/popup-modal-na';

export default function DealerGridComponent({
  filteredDealers,
  selectedDealer,
  handleDealerSelect,
  lang,
  userLocation,
  validationError,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModalItem, setSelectedModalItem] = useState(null);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    // Use setTimeout to ensure state is cleared after modal closes
    setTimeout(() => {
      setSelectedModalItem(null);
    }, 100);
  }, []);

  const handleSeeContactDetails = useCallback((dealer) => {
    // Create a copy of the dealer to avoid reference issues
    const dealerCopy = JSON.parse(JSON.stringify(dealer));
    setSelectedModalItem(dealerCopy);
    setIsOpen(true);
  }, []);
  return (
    <div className="lg:mt-8 lg:!w-[1080px]">
      {filteredDealers.length > 0 && (
        <h3
          className="max-w-[736px] font-noto text-[15px]
       font-normal leading-[26px] text-primary lg:text-[18px]
        lg:leading-[32px] ">
          {lang === 'ko'
            ? '딜러점 선택하기'
            : `Based on your location, we have compiled a list of 
          nearby TYM dealerships. Please select the dealer where you would like 
          to send your request:`}
        </h3>
      )}
      {validationError && filteredDealers.length > 0 && (
        <p className="font-noto text-[13px] font-light text-[#d10024]">
          Please complete this required field.
        </p>
      )}
      <div
        className="mt-5 grid auto-rows-fr grid-cols-1
        gap-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-4
         lg:gap-x-18 lg:gap-y-15">
        {filteredDealers.map((dealer, index) => {
          const dealerCompany = _.get(dealer, 'properties.company', '');
          const dealerCity = _.get(dealer, 'properties.city', '');
          const dealerState = _.get(dealer, 'properties.state', '');
          const dealerCountry = _.get(dealer, 'properties.country', '');
          const dealerCord = _.get(dealer, 'properties.google_maps_location', null);

          const dealerAddress = _.get(dealer, 'properties.address', '');
          const dealerZip = _.get(dealer, 'properties.zip', '');

          const isSelected = selectedDealer && selectedDealer.properties.company === dealerCompany;

          return (
            <div
              key={dealer.id + index}
              className="flex flex-col justify-between gap-y-3 font-noto"
              // onMouseDown={(e) => e.preventDefault()} // Prevent any mouse events from bubbling
            >
              <div className="flex-1 space-y-3">
                <h4 className="leading-tight min-h-[56px] text-lg font-bold text-[#000]">
                  {dealerCompany}
                </h4>
                <p className="leading-tight min-h-[112.5px] whitespace-pre-line text-[15px] font-normal text-[#000]">
                  {`${dealerAddress}${dealerCity ? `\n${dealerCity}` : ''}${dealerState ? `\n${dealerState}` : ''}${dealerZip ? ` ${dealerZip}` : ''}${dealerCountry ? `\n${dealerCountry}` : ''}`}
                </p>
                <p>
                  {`Distance away: ${getDistance(userLocation, parseGoogleMapsLocation(dealerCord))?.miles} miles`}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSeeContactDetails(dealer);
                  }}
                  className="
                   my-3 flex items-center gap-2 pt-1 md:pt-2">
                  <Icons name="ArrowRight" className="stroke-primary stroke-2" />
                  <span className="font-noto text-[13px] font-bold md:text-[15px]">
                    See contact details
                  </span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDealerSelect(dealer);
                  }}
                  className={`${isSelected ? 'bg-primary' : 'bg-lava'} w-full cursor-pointer px-6 py-4 font-sans text-[15px] font-bold uppercase text-white transition-all duration-300 ease-in-out hover:opacity-90`}>
                  {isSelected ? 'SELECTED' : 'SELECT DEALER'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <PopupModalNA
        selectDealer={() => {
          handleDealerSelect(selectedModalItem);
        }}
        minimal
        isOpen={isOpen}
        handleClose={handleCloseModal}
        item={selectedModalItem?.properties || null}
        awyaDistance={
          getDistance(
            userLocation,
            parseGoogleMapsLocation(selectedModalItem?.properties?.google_maps_location),
          )?.miles
        }
      />
    </div>
  );
}
