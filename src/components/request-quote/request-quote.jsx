'use client';

import { createRoot } from 'react-dom/client';
import React, { Suspense, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import _, { add } from 'lodash';
import Loading from '@/components/layout/loading';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  sortByEnginePower,
  sortByIsekiLast,
  sortByJohnDeereLast,
  sortBySeriesOrder,
  sortBySortIndex,
  sortByTitle,
} from '@/helpers/product-handlers';
import generateUniqueId from '@/helpers/generate-unique-id';
import getDistance from '@/helpers/get-distance';
import { sendGTMEvent } from '@next/third-parties/google';
import BoxedContainer from '../layout/boxed-container';
import ItemModal from './item-modal';
import Filter from './filter';
import DealerGridComponent from './dealers-grid';
import {
  getCoordinatesFromZipCode,
  getDealerCoordinates,
  resetSelectOptions,
  getLocationDataFromZipCode,
  AutoFillUtils,
  DOMUtils,
} from './utils';

// Configuration Constants
const CONFIG = {
  PORTAL_ID: '8804541',
  DEALER_RADIUS_MILES: 200,
  FORM_TARGET: '#requestForm',
  DEALER_GRID_CONTAINER_ID: 'dealer-grid-container',
  DELAYS: {
    EVENT: 100,
    COUNTRY_CHANGE: 1000,
    ZIP_INPUT_DEBOUNCE: 300,
    AUTO_FILL_DEBOUNCE: 800,
  },
  FIELD_NAMES: {
    COUNTRY: 'country',
    STATE_PROVINCE: 'select_state_province',
    CITY: 'city',
    ZIP_CODE: 'postal_zip_code',
    MODEL_NUMBER: 'model_number',
    MODEL_URL: 'model_url',
    DEALERSHIP_NAME: 'dealership_name',
    DEALERSHIP_EMAIL: 'dealership_email',
    REQUEST_NUMBER: 'request_number',
    REQUESTED_QUOTE: 'requested_quote',
    WEBSITE_REGION: 'website_region',
  },
  COUNTRY_NAMES: {
    KOREA_EN: 'South Korea',
    KOREA_KO: '대한민국',
    KOREA_LEGACY: 'KOREA',
    USA: 'United States',
    CANADA: 'Canada',
  },
  LANGUAGES: {
    KOREAN: 'ko',
    ENGLISH_KOREAN: 'en-ko',
    ENGLISH_US: 'en-us',
  },
  GTM_EVENT: 'mblm_request_a_quote_product_success',
};

// Improved hidden field management
const addOrUpdateHiddenField = (form, name, value) => {
  if (!form || !name) return false;

  const fieldValue = value == null ? '' : String(value);
  const existingField = form.querySelector(`input[name="${name}"]`);

  if (existingField) {
    if (existingField.value !== fieldValue) {
      existingField.value = fieldValue;
      DOMUtils.dispatchEvents(existingField);
      return true;
    }
    return false; // No change needed
  }
  const hiddenField = document.createElement('input');
  hiddenField.type = 'hidden';
  hiddenField.name = name;
  hiddenField.value = fieldValue;
  form.appendChild(hiddenField);
  DOMUtils.dispatchEvents(hiddenField);
  return true;
};

const addEventListenerOnce = (element, eventType, handler, identifier) => {
  if (!element) return;

  if (element._eventHandlers && element._eventHandlers[identifier]) {
    element.removeEventListener(eventType, element._eventHandlers[identifier]);
  }

  if (!element._eventHandlers) {
    element._eventHandlers = {};
  }

  element._eventHandlers[identifier] = handler;
  element.addEventListener(eventType, handler);
};

const FormUtils = {
  getFieldName: (lang, fieldType) => {
    const isKoreanLang =
      lang === CONFIG.LANGUAGES.KOREAN || lang === CONFIG.LANGUAGES.ENGLISH_KOREAN;

    switch (fieldType) {
      case 'dealer':
        return isKoreanLang ? 'select_local_dealership' : 'select_your_distributor_dealership';
      case 'zipCode':
        return isKoreanLang ? 'zip' : 'postal_zip_code';
      case 'city':
        return CONFIG.FIELD_NAMES.CITY;
      default:
        return '';
    }
  },

  getDefaultCountry: (lang) => {
    switch (lang) {
      case CONFIG.LANGUAGES.KOREAN:
        return CONFIG.COUNTRY_NAMES.KOREA_KO;
      case CONFIG.LANGUAGES.ENGLISH_KOREAN:
        return CONFIG.COUNTRY_NAMES.KOREA_EN;
      default:
        return CONFIG.COUNTRY_NAMES.USA;
    }
  },

  collectFormData: (form) => {
    const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
    const formData = {};

    inputs.forEach((input) => {
      const { name, value } = input;
      if (name && value !== undefined) {
        formData[name] = value;
      }
    });

    return formData;
  },

  // Enhanced auto-fill that preserves values
  autoFillFromZipCode: async (zipCode, lang, preserveZipCode = true) => {
    if (!zipCode || zipCode.length < 5) return null;

    const locationData = await getLocationDataFromZipCode(zipCode);
    if (!locationData) {
      return null;
    }

    // Find form fields
    const stateField = DOMUtils.querySelector(
      `select[name="${CONFIG.FIELD_NAMES.STATE_PROVINCE}"]`,
    );
    const cityField = DOMUtils.querySelector(`input[name="${CONFIG.FIELD_NAMES.CITY}"]`);
    const zipField = DOMUtils.querySelector(`input[name="${CONFIG.FIELD_NAMES.ZIP_CODE}"]`);

    // Auto-fill state if field exists and has options
    if (stateField && locationData.state) {
      const stateOption = [...stateField.options].find(
        (option) =>
          option.text === locationData.state ||
          option.text === locationData.stateShort ||
          option.value === locationData.state ||
          option.value === locationData.stateShort,
      );

      if (stateOption && stateField.value !== stateOption.value) {
        stateField.value = stateOption.value;
        stateField.classList.remove('invalid', 'error');
        DOMUtils.dispatchEvents(stateField, ['change']);
      }
    }

    // Auto-fill city if field exists
    if (cityField && locationData.city && cityField.value !== locationData.city) {
      cityField.value = locationData.city;
      cityField.classList.remove('invalid', 'error');
      DOMUtils.dispatchEvents(cityField, ['input', 'change']);
    }

    // Preserve or restore zip code value if needed
    if (preserveZipCode && zipField && zipField.value !== zipCode) {
      zipField.value = zipCode;
      zipField.classList.remove('invalid', 'error');
    }

    return locationData;
  },

  // Auto-fill from state change - only clear if user manually changed state
  handleStateChange: async (stateName, lang, manualChange = false) => {
    // Only clear fields if this was a manual state change (not from auto-fill)
    if (!manualChange) {
      return;
    }

    const cityField = DOMUtils.querySelector(`input[name="${CONFIG.FIELD_NAMES.CITY}"]`);
    const zipField = DOMUtils.querySelector(`input[name="${CONFIG.FIELD_NAMES.ZIP_CODE}"]`);

    // Clear city and zip when state is manually changed
    if (cityField && cityField.value) {
      cityField.value = '';
      cityField.classList.remove('invalid', 'error');
      DOMUtils.dispatchEvents(cityField, ['change', 'input']);
    }

    if (zipField && zipField.value) {
      zipField.value = '';
      zipField.classList.remove('invalid', 'error');
      DOMUtils.dispatchEvents(zipField, ['change', 'input']);
    }
  },
};

const DealerUtils = {
  groupByCountry: (dealers, lang) =>
    _.groupBy(dealers, (dealer) => {
      const countryVal = _.get(dealer, 'properties.country', null);
      if (
        lang === CONFIG.LANGUAGES.KOREAN &&
        (countryVal === CONFIG.COUNTRY_NAMES.KOREA_LEGACY ||
          countryVal === CONFIG.COUNTRY_NAMES.KOREA_EN)
      ) {
        return CONFIG.COUNTRY_NAMES.KOREA_KO;
      }
      if (
        lang !== CONFIG.LANGUAGES.KOREAN &&
        (countryVal === CONFIG.COUNTRY_NAMES.KOREA_LEGACY ||
          countryVal === CONFIG.COUNTRY_NAMES.KOREA_KO)
      ) {
        return CONFIG.COUNTRY_NAMES.KOREA_EN;
      }
      return countryVal;
    }),

  filterByRadius: async (dealers, zipCode, radius = CONFIG.DEALER_RADIUS_MILES) => {
    if (!zipCode) return dealers;

    const zipCoordinates = await getCoordinatesFromZipCode(zipCode);
    if (!zipCoordinates) return dealers;

    return dealers.filter((dealer) => {
      const dealerCoordinates = getDealerCoordinates(dealer);
      if (!dealerCoordinates) return false;

      const distance = getDistance(zipCoordinates, dealerCoordinates);
      return distance && distance.miles <= radius;
    });
  },

  sortByDistance: async (dealers, zipCode) => {
    if (!zipCode) {
      return dealers.sort((a, b) => {
        const aCompany = _.get(a, 'properties.company', '').toLowerCase();
        const bCompany = _.get(b, 'properties.company', '').toLowerCase();
        return aCompany.localeCompare(bCompany);
      });
    }

    const zipCoordinates = await getCoordinatesFromZipCode(zipCode);
    if (!zipCoordinates) {
      return dealers.sort((a, b) => {
        const aZip = _.get(a, 'properties.zip', '');
        const bZip = _.get(b, 'properties.zip', '');
        if (!aZip || !bZip) return 0;

        const distanceA = Math.abs(parseInt(zipCode, 10) - parseInt(aZip, 10));
        const distanceB = Math.abs(parseInt(zipCode, 10) - parseInt(bZip, 10));
        return distanceA - distanceB;
      });
    }

    return dealers.sort((a, b) => {
      const aCoordinates = getDealerCoordinates(a);
      const bCoordinates = getDealerCoordinates(b);

      if (!aCoordinates || !bCoordinates) return 0;

      const distanceA = getDistance(zipCoordinates, aCoordinates);
      const distanceB = getDistance(zipCoordinates, bCoordinates);

      if (!distanceA || !distanceB) return 0;
      return distanceA.miles - distanceB.miles;
    });
  },
};

let submissionCount = 0;
let formInstanceCount = 0;
const submissionTimestamps = [];

const trackFormSubmission = (data) => {
  submissionCount++;
  const timestamp = Date.now();
  submissionTimestamps.push(timestamp);
};

const trackFormCreation = () => {
  formInstanceCount++;
};

let dealerGridRoot = null;

export default function RequestQuote({ data, id, region, lang, products }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const formText = _.get(data, 'properties.formText.markup', '');
  const formId = _.get(data, 'properties.formId', '');

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialCategory = searchParams.get('category') || '';
  const initialTractorModel = searchParams.get('model') || '';

  const { sortedProducts, filteredProducts, categoryModelsPair } = useMemo(() => {
    const productsCopy = [...products];

    sortByIsekiLast(productsCopy);
    sortByJohnDeereLast(productsCopy);

    const filtered = _.flatMap(productsCopy, (product) => {
      const children = _.get(product, 'properties.configureParentProducts', {});
      return _.isEmpty(children)
        ? product
        : Object.values(children).map((child) => ({
            ...product,
            ...child,
            route: { path: product.route.path },
            properties: {
              ...product.properties,
              title: child.name,
            },
          }));
    });

    const categoryPairs = _.map(filtered, (item) => [
      _.get(item, 'properties.category', 'Tractors'),
      _.get(item, 'properties.title'),
    ]);

    sortByTitle(productsCopy);
    sortByEnginePower(productsCopy);
    sortBySeriesOrder(productsCopy);
    sortBySortIndex(productsCopy);

    return {
      sortedProducts: productsCopy,
      filteredProducts: filtered,
      categoryModelsPair: categoryPairs,
    };
  }, [products]);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [formLoaded, setFormLoaded] = useState(false);
  const [dealers, setDealers] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userLocation, setUsersLocation] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    tractorModel: '',
    category: '',
  });

  // Refs
  const dealersInitialized = useRef(false);
  const formInitialized = useRef(false);
  const scriptLoaded = useRef(false);
  const submissionInProgress = useRef(false);
  const cleanupTimeouts = useRef([]);
  const cleanupIntervals = useRef([]);
  const selectedDealerRef = useRef(null);
  const formRef = useRef(null);
  const fieldsInitialized = useRef(false);
  const autoFillInProgress = useRef(false);
  const lastAutoFillSource = useRef(null); // Track what triggered the last auto-fill

  const addTimeout = useCallback((timeoutId) => {
    cleanupTimeouts.current.push(timeoutId);
  }, []);

  const addInterval = useCallback((intervalId) => {
    cleanupIntervals.current.push(intervalId);
  }, []);

  // Debounced auto-fill functions that preserve values
  const debouncedAutoFillFromZip = useMemo(
    () =>
      _.debounce(async (zipCode, lang) => {
        if (autoFillInProgress.current) return;
        autoFillInProgress.current = true;
        lastAutoFillSource.current = 'zipCode';

        try {
          await FormUtils.autoFillFromZipCode(zipCode, lang, true); // Preserve zip code
        } catch (error) {
          console.error('Auto-fill from zip code failed:', error);
        } finally {
          setTimeout(() => {
            autoFillInProgress.current = false;
          }, 1000);
        }
      }, CONFIG.DELAYS.AUTO_FILL_DEBOUNCE),
    [],
  );

  // Single function to initialize form fields - only called once
  const initializeFormFields = useCallback(() => {
    if (fieldsInitialized.current) return;

    const form = formRef.current || document.querySelector('#requestForm form');
    if (!form) return;

    fieldsInitialized.current = true;

    // Set basic fields
    addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.WEBSITE_REGION, region || '');
    addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.REQUESTED_QUOTE, 'Yes');

    // Set model information
    const modelToUse = selectedFilter.tractorModel || initialTractorModel;
    if (modelToUse) {
      addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.MODEL_NUMBER, modelToUse);

      const currModel = _.find(sortedProducts, (product) => {
        const productTitle = _.get(product, 'properties.title', '');
        return _.isEqual(productTitle, modelToUse);
      });

      if (currModel) {
        const url = _.get(currModel, 'route.path', '');
        const modelUrl = window.location.origin + _.replace(url, '/en/', `/${lang}/`);
        addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.MODEL_URL, modelUrl);
      }
    }

    // Set dealer information if available
    const currentDealer = selectedDealerRef.current;
    if (currentDealer) {
      const dealerCompany = _.get(currentDealer, 'properties.company', '');
      const dealerEmail = _.get(currentDealer, 'properties.email', '');
      addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.DEALERSHIP_NAME, dealerCompany);
      addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.DEALERSHIP_EMAIL, dealerEmail);
    }
  }, [region, selectedFilter.tractorModel, initialTractorModel, sortedProducts, lang]);

  // Update specific fields without reinitializing everything - debounced
  const updateModelFields = useMemo(
    () =>
      _.debounce((modelNumber, category) => {
        const form = formRef.current || document.querySelector('#requestForm form');
        if (!form) return;

        addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.MODEL_NUMBER, modelNumber);

        const currModel = _.find(sortedProducts, (product) => {
          const productCategory = _.get(product, 'properties.category', '');
          const productTitle = _.get(product, 'properties.title', '');
          return _.isEqual(productCategory, category) && _.isEqual(productTitle, modelNumber);
        });

        if (currModel) {
          const url = _.get(currModel, 'route.path', '');
          const modelUrl = window.location.origin + _.replace(url, '/en/', `/${lang}/`);
          addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.MODEL_URL, modelUrl);
        }
      }, 300),
    [sortedProducts, lang],
  );

  const updateDealerFields = useCallback((dealer) => {
    const form = formRef.current || document.querySelector('#requestForm form');
    if (!form || !dealer) return;

    const dealerCompany = _.get(dealer, 'properties.company', '');
    const dealerEmail = _.get(dealer, 'properties.email', '');
    addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.DEALERSHIP_NAME, dealerCompany);
    addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.DEALERSHIP_EMAIL, dealerEmail);
  }, []);

  const getDealers = useCallback(async () => {
    if (dealersInitialized.current) return;

    try {
      dealersInitialized.current = true;
      const res = await fetch('/api/dealers', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });
      const resp = await res.json();
      const dealersData = _.get(resp, 'data', []);
      setDealers(dealersData);
    } catch (error) {
      dealersInitialized.current = false;
    }
  }, []);

  const handleAfterOpen = useCallback(() => {
    if (scriptLoaded.current) return;

    const existingScript = document.getElementById('hs-form-script');

    if (!existingScript) {
      scriptLoaded.current = true;
      const script = document.createElement('script');
      script.id = 'hs-form-script';
      script.src = 'https://js.hsforms.net/forms/v2.js';
      script.async = true;

      script.onload = () => {
        setFormLoaded(true);
      };

      script.onerror = (error) => {
        scriptLoaded.current = false;
      };

      document.body.appendChild(script);
    } else if (window.hbspt && window.hbspt.forms) {
      setFormLoaded(true);
    } else {
      const checkHubSpot = setInterval(() => {
        if (window.hbspt && window.hbspt.forms) {
          setFormLoaded(true);
          clearInterval(checkHubSpot);
        }
      }, 100);

      addInterval(checkHubSpot);
      const timeoutId = setTimeout(() => clearInterval(checkHubSpot), 10000);
      addTimeout(timeoutId);
    }
  }, [addInterval, addTimeout]);

  const handleDealerSelect = useCallback(
    (dealer) => {
      setSelectedDealer(dealer);
      selectedDealerRef.current = dealer;
      setValidationError(false);
      setValidationErrors([]);

      // Update dealer fields immediately
      setTimeout(() => {
        updateDealerFields(dealer);
      }, 100);
    },
    [updateDealerFields],
  );

  const updateDealerGrid = useCallback(() => {
    if (dealerGridRoot) {
      dealerGridRoot.render(
        <DealerGridComponent
          filteredDealers={filteredDealers}
          validationError={validationError}
          selectedDealer={selectedDealer}
          handleDealerSelect={handleDealerSelect}
          lang={lang}
          userLocation={userLocation}
        />,
      );
    }
  }, [filteredDealers, validationError, selectedDealer, handleDealerSelect, lang, userLocation]);

  const hideDealerSelect = useCallback(() => {
    const localDealerName = FormUtils.getFieldName(lang, 'dealer');
    const selectDealers = DOMUtils.querySelector(`select[name=${localDealerName}]`);
    const selectDealersParent =
      selectDealers?.closest('.hs-form-field') || selectDealers?.parentElement;

    if (selectDealersParent && !dealerGridRoot) {
      const reactContainer = document.createElement('div');
      reactContainer.id = CONFIG.DEALER_GRID_CONTAINER_ID;
      selectDealersParent.parentNode.replaceChild(reactContainer, selectDealersParent);
      dealerGridRoot = createRoot(reactContainer);
      updateDealerGrid();
      return dealerGridRoot;
    }
    return null;
  }, [lang, updateDealerGrid]);

  const normalizeCountryOptions = useCallback(
    (selectCountry) => {
      for (let index = 0; index < selectCountry.options.length; index += 1) {
        const opt = selectCountry.options[index];
        const textValue = _.get(opt, 'text', '');

        if (lang === CONFIG.LANGUAGES.KOREAN && textValue === CONFIG.COUNTRY_NAMES.KOREA_LEGACY) {
          opt.remove();
        }
        if (lang !== CONFIG.LANGUAGES.KOREAN && textValue === CONFIG.COUNTRY_NAMES.KOREA_KO) {
          opt.remove();
        }
        if (lang !== CONFIG.LANGUAGES.KOREAN && textValue === CONFIG.COUNTRY_NAMES.KOREA_LEGACY) {
          _.set(opt, 'value', CONFIG.COUNTRY_NAMES.KOREA_EN);
          _.set(opt, 'text', CONFIG.COUNTRY_NAMES.KOREA_EN);
        }
      }
    },
    [lang],
  );

  const setDefaultCountrySelection = useCallback(
    (selectCountry) => {
      const defaultCountry = FormUtils.getDefaultCountry(lang);
      const countryOption = [...selectCountry.options].find(
        (option) => option.text === defaultCountry,
      );

      if (countryOption) {
        selectCountry.value = countryOption.value;
        const timeoutId = setTimeout(() => {
          DOMUtils.dispatchEvents(selectCountry);
        }, CONFIG.DELAYS.EVENT);
        addTimeout(timeoutId);
      }
    },
    [lang, addTimeout],
  );

  const addCanadaPostalCodeValidation = useCallback(
    (zipCodeFieldName) => {
      const zipCodeInput = DOMUtils.querySelector(`input[name=${zipCodeFieldName}]`);
      if (zipCodeInput && lang === CONFIG.LANGUAGES.ENGLISH_US) {
        const inputHandler = (event) => {
          const { target } = event;
          const filteredValue = target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
          target.value = filteredValue;
        };

        const keypressHandler = (event) => {
          const char = String.fromCharCode(event.which);
          if (!/[A-Z0-9]/i.test(char)) {
            event.preventDefault();
          }
        };

        addEventListenerOnce(zipCodeInput, 'input', inputHandler, 'canadaPostalInput');
        addEventListenerOnce(zipCodeInput, 'keypress', keypressHandler, 'canadaPostalKeypress');
      }
    },
    [lang],
  );

  // Enhanced setup for zip code auto-fill
  const setupZipCodeAutoFill = useCallback(() => {
    const zipField = DOMUtils.querySelector(`input[name="${CONFIG.FIELD_NAMES.ZIP_CODE}"]`);

    if (!zipField) {
      console.warn('Zip field not found for auto-fill setup');
      return;
    }
    const handleZipCodeInput = async (event) => {
      const zipCode = event.target.value.trim();

      if (zipCode && zipCode.length >= 5) {
        // Get currently selected country
        const countryField = DOMUtils.querySelector(`select[name="${CONFIG.FIELD_NAMES.COUNTRY}"]`);
        const selectedCountry = countryField?.value || FormUtils.getDefaultCountry(lang);

        // Get dealers for current country
        const grouped = DealerUtils.groupByCountry(dealers, lang);
        const dealersByCountry = grouped[selectedCountry] || [];

        // Filter by radius within the selected country
        const zipFilteredDealers = await DealerUtils.filterByRadius(dealersByCountry, zipCode);
        const sortedDealers = await DealerUtils.sortByDistance(zipFilteredDealers, zipCode);

        setFilteredDealers(sortedDealers);

        // Set user location
        const zipCoordinates = await getCoordinatesFromZipCode(zipCode);
        setUsersLocation(zipCoordinates);

        // Also trigger auto-fill
        debouncedAutoFillFromZip(zipCode, lang);
      } else {
        // No valid zip code - HIDE all dealers
        setFilteredDealers([]);
        setUsersLocation(null);
      }
    };

    // Remove existing listener if any
    if (zipField._autoFillHandler) {
      zipField.removeEventListener('input', zipField._autoFillHandler);
    }

    // Add new listener with debouncing
    zipField._autoFillHandler = _.debounce(handleZipCodeInput, 300);
    zipField.addEventListener('input', zipField._autoFillHandler);
  }, [lang, dealers, debouncedAutoFillFromZip]);

  const createDealerListUpdater = useCallback(
    (dealersByCountry, setFilteredDealers, setUsersLocation, updateDealerGrid, currentCountry) =>
      async (zipCode = '') => {
        if (_.isEmpty(dealersByCountry)) return;

        // Auto-fill functionality - only if zip code is valid
        if (zipCode && zipCode.length >= 5) {
          debouncedAutoFillFromZip(zipCode, lang);
        }

        let currentFilteredDealers = [];

        if (zipCode) {
          const zipCoordinates = await getCoordinatesFromZipCode(zipCode);
          setUsersLocation(zipCoordinates);

          if (zipCoordinates) {
            currentFilteredDealers = await DealerUtils.filterByRadius(dealersByCountry, zipCode);
            currentFilteredDealers = await DealerUtils.sortByDistance(
              currentFilteredDealers,
              zipCode,
            );
          } else {
            currentFilteredDealers = dealersByCountry.filter((dealer) => {
              const dealerZip = _.get(dealer, 'properties.zip', '');
              return (
                dealerZip &&
                Math.abs(parseInt(zipCode, 10) - parseInt(dealerZip, 10)) <
                  CONFIG.DEALER_RADIUS_MILES
              );
            });
            currentFilteredDealers = await DealerUtils.sortByDistance(
              currentFilteredDealers,
              zipCode,
            );
          }
        } else {
          currentFilteredDealers = await DealerUtils.sortByDistance([...dealersByCountry], zipCode);
        }

        setFilteredDealers(currentFilteredDealers);
        const timeoutId = setTimeout(() => {
          updateDealerGrid();
        }, 0);
        addTimeout(timeoutId);
      },
    [addTimeout, lang, debouncedAutoFillFromZip],
  );

  const setupCountryChangeHandler = useCallback(
    (selectCountry, dealers, lang) => {
      const countryChangeHandler = (event) => {
        const timeoutId = setTimeout(async () => {
          const selectStateProvince = DOMUtils.querySelector(
            `select[name=${CONFIG.FIELD_NAMES.STATE_PROVINCE}]`,
          );
          let zipCodeFieldName = FormUtils.getFieldName(lang, 'zipCode');
          const country = _.get(event, 'target.value', '');

          if (lang === CONFIG.LANGUAGES.ENGLISH_US && country === CONFIG.COUNTRY_NAMES.CANADA) {
            zipCodeFieldName = 'zip';
          } else if (lang === CONFIG.LANGUAGES.ENGLISH_US) {
            zipCodeFieldName = 'postal_zip_code';
          }

          addCanadaPostalCodeValidation(zipCodeFieldName);

          setSelectedDealer(null);
          selectedDealerRef.current = null;

          // Reset state options first
          resetSelectOptions(CONFIG.FIELD_NAMES.STATE_PROVINCE);

          // HIDE ALL DEALERS when country changes - user must enter zip code
          setFilteredDealers([]);
          setUsersLocation(null);

          // **ADD STATE POPULATION LOGIC HERE**
          const grouped = DealerUtils.groupByCountry(dealers, lang);
          const states = _.filter(
            _.map(_.uniqBy(grouped[country], 'properties.state'), 'properties.state'),
            Boolean,
          );

          // Populate state options if states exist for this country
          if (!_.isEmpty(states) && selectStateProvince) {
            // Sort states alphabetically
            states.sort((a, b) => a?.localeCompare(b));

            // Create and append state options
            _.forEach(states, (option) => {
              const optionEl = DOMUtils.createOption(option, option);
              selectStateProvince.appendChild(optionEl);
            });

            // Dispatch events to notify HubSpot of changes
            DOMUtils.dispatchEvents(selectStateProvince);
          }

          // Setup zip code auto-fill for new country
          setupZipCodeAutoFill();
        }, CONFIG.DELAYS.COUNTRY_CHANGE);
        addTimeout(timeoutId);
      };

      addEventListenerOnce(selectCountry, 'change', countryChangeHandler, 'countryChange');
    },
    [addCanadaPostalCodeValidation, addTimeout, setupZipCodeAutoFill, dealers, lang],
  );

  const onFormReady = useCallback(
    (form) => {
      formRef.current = form;

      const selectCountry = DOMUtils.querySelector(`select[name=${CONFIG.FIELD_NAMES.COUNTRY}]`);

      if (selectCountry) {
        normalizeCountryOptions(selectCountry);
        setDefaultCountrySelection(selectCountry);
      }

      const localDealerName = FormUtils.getFieldName(lang, 'dealer');
      const zipCodeFieldName = FormUtils.getFieldName(lang, 'zipCode');

      resetSelectOptions(CONFIG.FIELD_NAMES.STATE_PROVINCE);
      // resetSelectOptions(localDealerName);
      hideDealerSelect();
      addCanadaPostalCodeValidation(zipCodeFieldName);

      // Setup zip code auto-fill
      setTimeout(() => {
        setupZipCodeAutoFill();
      }, 500);

      // Initialize form fields only once
      setTimeout(() => {
        initializeFormFields();
      }, 100);

      if (!_.isEmpty(selectedProduct) && selectCountry) {
        const timeoutId = setTimeout(() => {
          const el = DOMUtils.querySelector(`select[name=${CONFIG.FIELD_NAMES.COUNTRY}]`);
          if (el) {
            if (lang === CONFIG.LANGUAGES.ENGLISH_KOREAN) {
              const skIndex = _.indexOf(_.map(el.options, 'value'), CONFIG.COUNTRY_NAMES.KOREA_EN);
              _.set(el, 'selectedIndex', skIndex);
              DOMUtils.dispatchEvents(el);
            } else if (lang === CONFIG.LANGUAGES.KOREAN) {
              const skIndex = _.indexOf(_.map(el.options, 'value'), CONFIG.COUNTRY_NAMES.KOREA_KO);
              _.set(el, 'selectedIndex', skIndex);
              DOMUtils.dispatchEvents(el);
            }
          }
        }, CONFIG.DELAYS.EVENT);
        addTimeout(timeoutId);
      }

      setupCountryChangeHandler(selectCountry, dealers, lang);
    },
    [
      normalizeCountryOptions,
      setDefaultCountrySelection,
      lang,
      hideDealerSelect,
      addCanadaPostalCodeValidation,
      selectedProduct,
      setupCountryChangeHandler,
      dealers,
      addTimeout,
      initializeFormFields,
      setupZipCodeAutoFill,
    ],
  );

  const handleForm = useCallback(() => {
    // More robust checks to prevent multiple form creation
    const existingForm = document.querySelector('#requestForm form');
    if (
      formInitialized.current ||
      existingForm ||
      !formLoaded ||
      !window.hbspt ||
      _.isEmpty(dealers)
    ) {
      return;
    }

    formInitialized.current = true;
    trackFormCreation();

    const targetContainer = document.querySelector(CONFIG.FORM_TARGET);
    if (targetContainer) {
      targetContainer.innerHTML = '';
    }

    window.hbspt.forms.create({
      portalId: CONFIG.PORTAL_ID,
      formId,
      target: CONFIG.FORM_TARGET,
      onBeforeFormSubmit: (form) => {
        if (submissionInProgress.current) {
          return false;
        }

        const currentSelectedDealer = selectedDealerRef.current;
        if (!currentSelectedDealer) {
          setValidationError(true);
          setValidationErrors(['Please select a dealer from the list above']);
          return false; // Prevent submission
        }

        setValidationError(false);
        setValidationErrors([]);
        submissionInProgress.current = true;

        // Final form field update
        const requestNumber = generateUniqueId();
        addOrUpdateHiddenField(form, CONFIG.FIELD_NAMES.REQUEST_NUMBER, requestNumber);

        return true; // Allow submission
      },
      onFormSubmit: (form) => {
        const formData = FormUtils.collectFormData(form);
        trackFormSubmission(formData);

        try {
          const requestNumber = formData[CONFIG.FIELD_NAMES.REQUEST_NUMBER] || generateUniqueId();

          if (requestNumber) {
            sessionStorage.clear();
            sessionStorage.setItem(requestNumber, JSON.stringify(formData));
          }

          const MODEL_NAME = formData[CONFIG.FIELD_NAMES.MODEL_NUMBER] || initialTractorModel || '';

          sendGTMEvent({
            event: CONFIG.GTM_EVENT,
            TYM_REGION: region,
            TYM_LANGUAGE: lang,
            MODEL_NAME,
          });

          const successUrl = `${window.location.origin}${pathname}/success?request_number=${requestNumber}`;

          setTimeout(() => {
            window.location.replace(successUrl);
          }, 100);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          // Reset submission guard after delay
          setTimeout(() => {
            submissionInProgress.current = false;
          }, 2000);
        }
      },
      onFormReady,
    });
  }, [formLoaded, dealers, formId, region, lang, pathname, initialTractorModel, onFormReady]);

  const handleFilterClick = useCallback(
    (item) => {
      const modelNumber = _.get(item, 'tractorModel', '');
      const category = _.get(item, 'category', '');

      setSelectedFilter({ tractorModel: modelNumber, category });

      // Update model fields separately - now debounced
      updateModelFields(modelNumber, category);
    },
    [updateModelFields],
  );

  const closeItemModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  // Effects
  useEffect(() => {
    updateDealerGrid();
  }, [updateDealerGrid]);

  useEffect(() => {
    getDealers();
    sessionStorage.clear();
    setSelectedFilter({
      tractorModel: initialTractorModel,
      category: initialCategory,
    });
    setFilteredDealers([]);

    return () => {
      cleanupTimeouts.current.forEach(clearTimeout);
      cleanupTimeouts.current = [];
      cleanupIntervals.current.forEach(clearInterval);
      cleanupIntervals.current = [];
      submissionInProgress.current = false;
      selectedDealerRef.current = null;
      formRef.current = null;
      fieldsInitialized.current = false;
      autoFillInProgress.current = false;
      lastAutoFillSource.current = null;

      // Cleanup debounced functions
      if (updateModelFields.cancel) {
        updateModelFields.cancel();
      }
      if (debouncedAutoFillFromZip.cancel) {
        debouncedAutoFillFromZip.cancel();
      }

      if (dealerGridRoot) {
        dealerGridRoot.unmount();
        dealerGridRoot = null;
      }
    };
  }, [
    getDealers,
    initialCategory,
    initialTractorModel,
    updateModelFields,
    debouncedAutoFillFromZip,
  ]);

  useEffect(() => {
    handleAfterOpen();
  }, [handleAfterOpen]);

  // Changed dependency from dealers.length to just dealers
  useEffect(() => {
    handleForm();
  }, [handleForm, formLoaded, dealers]);

  useEffect(() => {
    const currCategory = _.get(selectedFilter, 'category', '');
    const currModel = _.get(selectedFilter, 'tractorModel', '');

    if (selectedFilter.category !== '' && selectedFilter.tractorModel !== '') {
      const selected = _.find(filteredProducts, (item) => {
        const itemCategory = _.get(item, 'properties.category', '');
        const itemTitle = _.get(item, 'properties.title', '');
        return _.isEqual(itemCategory, currCategory) && _.isEqual(itemTitle, currModel);
      });

      setSelectedProduct(selected);
      setIsModalVisible(!_.isEmpty(selected));
    } else {
      setSelectedProduct({});
      setIsModalVisible(false);
    }
  }, [selectedFilter, filteredProducts]);

  useEffect(() => {
    if (!_.isEmpty(selectedProduct) && formLoaded) {
      const timeoutId = setTimeout(() => {
        const el = DOMUtils.querySelector(`select[name=${CONFIG.FIELD_NAMES.COUNTRY}]`);
        if (el) {
          if (lang === CONFIG.LANGUAGES.ENGLISH_KOREAN) {
            const skIndex = _.indexOf(_.map(el.options, 'value'), CONFIG.COUNTRY_NAMES.KOREA_EN);
            _.set(el, 'selectedIndex', skIndex);
            DOMUtils.dispatchEvents(el);
          } else if (lang === CONFIG.LANGUAGES.KOREAN) {
            const skIndex = _.indexOf(_.map(el.options, 'value'), CONFIG.COUNTRY_NAMES.KOREA_KO);
            _.set(el, 'selectedIndex', skIndex);
            DOMUtils.dispatchEvents(el);
          }
        }
      }, CONFIG.DELAYS.EVENT);
      addTimeout(timeoutId);
    }
  }, [selectedProduct, formLoaded, lang, addTimeout]);

  // Check if everything is ready to show content
  useEffect(() => {
    const allReady = !_.isEmpty(sortedProducts) && formLoaded && !_.isEmpty(dealers);
    if (allReady && isLoading) {
      setIsLoading(false);
    }
  }, [sortedProducts, formLoaded, dealers, isLoading]);

  if (isLoading) {
    return (
      <Suspense fallback={<Loading />}>
        <section
          id={id}
          className="relative overflow-hidden bg-white pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
          <BoxedContainer className="relative">
            <div className="flex items-center justify-center py-20">
              <Loading />
            </div>
          </BoxedContainer>
        </section>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <section
        id={id}
        className="relative overflow-hidden bg-white pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
        <BoxedContainer className="relative">
          <div className="flex max-w-[864px] flex-col gap-y-[15px] pb-[60px] md:gap-y-[20px] lg:gap-y-[32px]">
            <div
              className="text-[26px] font-bold uppercase leading-[34px] text-[#000] md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div
              className="font-noto text-[15px] font-normal leading-[26px] text-[#000] lg:text-[18px] lg:leading-[32px]"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>

          <div className="data-[selected=false]:pb-80" data-selected={!_.isEmpty(selectedProduct)}>
            <Filter
              categoryModelsPair={categoryModelsPair}
              filteredProducts={filteredProducts}
              setSelectedFilter={handleFilterClick}
              initialCategory={initialCategory}
              initialTractorModel={initialTractorModel}
            />
            {isModalVisible && (
              <ItemModal
                isOpen={isModalVisible}
                selected={selectedProduct}
                handleClose={closeItemModal}
              />
            )}
            <div
              data-selected={!_.isEmpty(selectedProduct)}
              id="request-a-quote-form"
              className="pt-[30px] data-[selected=false]:!hidden lg:pt-[60px]">
              <div
                className="max-w-[736px] font-noto text-[15px] font-normal leading-[26px] text-primary lg:text-[18px] lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: formText }}
              />

              {(validationErrors.length > 0 || validationError) && (
                <div className="mb-4 mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-800">
                        Please correct the following errors:
                      </h4>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-inside list-disc space-y-1">
                          {validationError && <li>Please select a dealer from the list above</li>}
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                id="requestForm"
                className="tym-form max-w-[920px] pt-[5px] md:pt-[45px] lg:pt-[72px]"
              />
            </div>
          </div>
        </BoxedContainer>
      </section>
    </Suspense>
  );
}
