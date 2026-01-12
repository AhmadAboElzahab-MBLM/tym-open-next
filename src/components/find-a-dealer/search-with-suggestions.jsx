import React, { useContext, useState, useEffect } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useGoogleMapsScript } from 'use-google-maps-script';
import _ from 'lodash';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';

function containsZipCode(value) {
  const zipCodePattern =
    // eslint-disable-next-line max-len
    /\b(?:\d{5}(?:-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d|\d{4,5}|[A-Z]{1,2}\d{1,2} ?\d[A-Z]{2}|[A-Z]\d{2} ?\d{3})\b/gi;
  return zipCodePattern.test(value);
}

function SearchWithSuggestions({ label, placeholder, onSelectAddress, defaultZip }) {
  const { translations, lang } = useContext(GlobalContext);
  const [address, setAddress] = useState(defaultZip || '');
  const [zipCodeError, setZipCodeError] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const libraries = ['places'];

  const { isLoaded } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleSelect = async (value) => {
    try {
      setAddress(value);
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      onSelectAddress(latLng);
    } catch (error) {
      onSelectAddress(null);
      console.error('Error geocoding address:', error);
    }
  };

  useEffect(() => {
    setIsApiLoaded(isLoaded);
  }, [isLoaded]);

  useEffect(() => {
    if (defaultZip && isApiLoaded) {
      setAddress(defaultZip);
      handleSelect(defaultZip);
    }
  }, [defaultZip, isApiLoaded]);

  const handleChange = (val) => {
    if (containsZipCode(val)) {
      setZipCodeError(false);
    } else if (val) {
      setZipCodeError(true);
    } else {
      setZipCodeError(false);
    }
    setAddress(val);
  };

  const northAmericaBounds = {
    north: 71.5388001,
    south: 8.9549001,
    east: -52.233039,
    west: -169.478979,
  };

  const southKoreaBounds = {
    north: 38.634,
    south: 33.1,
    east: 131.872,
    west: 125.066,
  };

  const locationRestriction = {
    'en-ko': southKoreaBounds,
    'en-us': northAmericaBounds,
    ko: northAmericaBounds,
  };

  const componentRestrictions = {
    'en-ko': { country: 'KR' },
    'en-us': { country: ['US', 'CA'] },
    ko: { country: 'KR' },
  };

  return (
    isApiLoaded && (
      <div className={`${lang === "en-us" ? "flex-col md:flex-row md:items-center" : "items-center"} relative z-[1000] flex w-full max-w-[46rem] gap-x-4 border-b border-grey pb-3`}>
        <span
          className="inline-flex h-[28px] items-center whitespace-pre font-noto text-clamp12to15
          font-bold uppercase tracking-[1.5px] after:inline after:content-[':'] md:h-[37px]">
          {label}
        </span>
        {defaultZip ? (
          <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
              const inputProps = getInputProps();
              inputProps.placeholder = placeholder;
              return (
              <div className="relative w-full">
                <input className="w-full text-clamp12to15" {...getInputProps({ placeholder })} />
                <div className="autocomplete-dropdown-container">
                {!zipCodeError && loading && <div>Loading...</div>}
                  {!zipCodeError &&
                    suggestions.map((suggestion, index) => (
                      <div key={index} {...getSuggestionItemProps(suggestion)}>
                        <span>{suggestion.description}</span>
                      </div>
                    ))}
                </div>
              </div>
              );
            }}
          </PlacesAutocomplete>
        ) : (
          <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
            searchOptions={{
              locationRestriction: _.get(locationRestriction, lang, null),
              types: ['(regions)'],
              componentRestrictions: _.get(componentRestrictions, lang, null),
            }}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
              const filteredSuggestions = _.filter(suggestions, (val) =>
                _.includes(val.types, 'postal_code'),
              );
              const inputProps = getInputProps();
              _.set(inputProps, 'placeholder', placeholder);

              return (
                <div className="relative z-50 w-full">
                  <input
                    className="h-[28px] w-full font-noto text-clamp12to15 placeholder:text-primary md:h-[37px]"
                    {...inputProps}
                  />
                  <div className="autocomplete-dropdown-container absolute -left-2 top-full bg-white px-2 text-[15px] shadow-md">
                    {!zipCodeError && loading && <div>Loading...</div>}
                    {!zipCodeError &&
                      _.map(filteredSuggestions, (suggestion, index) => (
                        <div key={index} {...getSuggestionItemProps(suggestion)}>
                          <span>{suggestion.description}</span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            }}
          </PlacesAutocomplete>
        )}
      </div>
    )
  );
}

export default SearchWithSuggestions;