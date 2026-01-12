'use client';

import React, { useState, useEffect, useContext, Suspense } from 'react';
import _ from 'lodash';
import SelectDropdown from '@/components/layout/select-dropdown';
import Loading from '@/components/layout/loading';
import GlobalContext from '@/context/global-context';
import { getTranslationByKey } from '@/utils/translation-helper';
import {
  sortByEnginePower,
  sortBySeriesOrder,
  sortBySortIndex,
  sortByTitle,
} from '@/helpers/product-handlers';
import { usePathname } from 'next/navigation';
import generateUniqueId from '@/helpers/generate-unique-id';
import { sendGTMEvent } from '@next/third-parties/google'
import Icons from '@/components/layout/icons';
import BoxedContainer from '@/components/layout/boxed-container';
import resolveTextInternalLinks from '@/helpers/resolve-text-url-locale';

function customSort(givenArray) {
  const originalArray = [
    'Tractors',
    'Harvesters',
    'Rice Transplanters',
    'Diesel Engines',
    'Attachments',
  ];

  const orderMap = _.reduce(
    originalArray,
    (acc, item, index) => {
      acc[item] = index;
      return acc;
    },
    {},
  );

  givenArray.sort((valueA, valueB) => orderMap[valueA] - orderMap[valueB]);
  return givenArray;
}

export default function RequestPart({ data, id, region, products }) {
  const { translations, lang } = useContext(GlobalContext);
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const formId = _.get(data, 'properties.formId', '');
  const formTitle = _.get(data, 'properties.formTitle.markup', '');
  const filterTitle = _.get(data, 'properties.filterTitle.markup', '');
  const [formLoaded, setFormLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tractors');
  const [selectedModel, setSelectedModel] = useState('');
  const [partsNumber, setPartsNumber] = useState('');
  const [quantity, setQuantity] = useState('');
  const [todos, setTodos] = useState([]);
  const [dealers, setDealers] = useState([]);
  const categories = customSort(_.uniq(_.map(products, 'properties.category')));
  const pathname = usePathname();
  const updatedText = resolveTextInternalLinks(text, lang);
  const updatedformTitle = resolveTextInternalLinks(filterTitle, lang);

  const filteredOptions = _.filter(products, (product) => {
    const currCategory = _.get(product, 'properties.category', '');
    return _.isEqual(_.toLower(currCategory), _.toLower(selectedCategory));
  });

  const titleOptions = _.map(filteredOptions, (product) => {
    const currTitle = _.get(product, 'properties.title', '');
    return {
      label: currTitle,
      value: currTitle,
    };
  });

  const getDealers = async () => {
    try {
      const res = await fetch('/dealers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Add your payload if necessary
      });
      const resp = await res.json();
      const dealersData = _.get(resp, 'data', []);

      if (dealersData) {
        setDealers(dealersData); // Update the dealers state with the fetched data
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  };

  const handleAddToList = () => {
    if (_.every([selectedCategory, selectedModel, partsNumber, quantity], Boolean)) {
      const todo = {
        category: selectedCategory,
        title: selectedModel,
        partsNumber,
        quantity,
      };
      const newTodos = [...todos, todo];

      setTodos(newTodos);
      const hiddenInput = document.querySelector('input[name="requested_parts"]');
      if (hiddenInput)
        _.set(
          hiddenInput,
          'value',
          _.reduce(
            newTodos,
            (acc, curr, index) => {
              const val = `${curr.category} ${curr.title}, #${curr.partsNumber} x${curr.quantity}`;
              return index ? `${acc} | ${val}` : val;
            },
            '',
          ),
        );

      setSelectedCategory('');
      setSelectedModel('');
      setPartsNumber('');
      setQuantity('');
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    setTodos((prevTodos) => {
      const hiddenInput = document.querySelector('input[name="requested_parts"]');
      const updatedTodos = _.filter(prevTodos, (_val, idx) => idx !== indexToRemove);
      if (hiddenInput)
        _.set(
          hiddenInput,
          'value',
          _.reduce(
            updatedTodos,
            (acc, curr, index) => {
              const val = `${curr.category} ${curr.title}, #${curr.partsNumber} x${curr.quantity}`;
              return index ? `${acc} | ${val}` : val;
            },
            '',
          ),
        );
      return updatedTodos;
    });
  };

  const handleAfterOpen = () => {
    const script = document.createElement('script');
    script.id = 'hs-form-script';
    script.src = 'https://js.hsforms.net/forms/v2.js';
    script.onload = () => setFormLoaded(true);
    document.body.appendChild(script);
  };

  const onFormSubmit = (form) => {
    setTimeout(() => {
      const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
      const formData = {};

      // eslint-disable-next-line no-restricted-syntax
      for (const input of inputs) {
        const name = _.get(input, 'name', '');
        const value = _.get(input, 'value', '');
        formData[name] = value;
      }

      const newForm = document.createElement('form');
      const requestNumber = _.get(formData, 'request_number', null);


      // Get values for GTM event
      const TYM_REGION = region;
      const TYM_LANGUAGE = lang;

      // Send the mblm_request_a_quote_parts_success event to GTM  
      sendGTMEvent({
        event: 'mblm_request_a_quote_parts_success',
        TYM_REGION,
        TYM_LANGUAGE
      });

      const pathOrigin = window.location.origin;
      newForm.action = `${pathOrigin}${pathname}/success?request_number=${requestNumber}`;
      newForm.method = 'post';
      document.body.appendChild(newForm);
      if (requestNumber) {
        sessionStorage.clear();
        sessionStorage.setItem(requestNumber, JSON.stringify(formData));
        newForm.submit();
      }
    }, 0);
  };

  const resetSelectOptions = (name) => {
    const selectElement = document.querySelector(`select[name=${name}]`);

    if (selectElement) {
      for (let index = selectElement.options.length - 1; index > 0; index -= 1) {
        selectElement.options[index].remove();
      }
    }
  };

  const onFormReady = (form) => {
    const selectCountry = form.querySelector('select[name=country]');

    if (selectCountry) {
      for (let index = 0; index < selectCountry.options.length; index += 1) {
        const opt = selectCountry.options[index];
        const textValue = _.get(opt, 'text', '');

        if (lang === 'ko' && textValue === 'KOREA') opt.remove();
        if (lang !== 'ko' && textValue === '대한민국') opt.remove();
        if (lang !== 'ko' && textValue === 'KOREA') {
          _.set(opt, 'value', 'South Korea');
          _.set(opt, 'text', 'South Korea');
        }
      }
      const defaultCountry =
        lang === 'ko' ? '대한민국' : lang === 'en-ko' ? 'South Korea' : 'United States';

      const countryOption = [...selectCountry.options].find(
        (option) => option.text === defaultCountry,
      );

      if (countryOption) {
        selectCountry.value = countryOption.value;

        setTimeout(() => {
          selectCountry.dispatchEvent(new Event('change'), { bubbles: true });
          selectCountry.dispatchEvent(new Event('input'), { bubbles: true });
        }, 100);
      }
    }

    const localDealerName = 'select_local_dealership';

    const zipCodeFieldName = 'zip';

    // const currentSelectDealers = document.querySelector(`select[name=${localDealerName}]`);

    // const currentSelectDealersFieldset = currentSelectDealers?.closest('.hs-fieldtype-select');
    // if (currentSelectDealersFieldset) currentSelectDealersFieldset.style.display = 'none';

    resetSelectOptions('select_state_province');
    resetSelectOptions(localDealerName);

    selectCountry.addEventListener('change', (event) => {
      setTimeout(() => {
        const selectStateProvince = document.querySelector('select[name=select_state_province]');
        const selectDealers = document.querySelector(`select[name=${localDealerName}]`);
        const zipCodeInput = document.querySelector(`input[name=${zipCodeFieldName}]`);
        const hiddenInputField = document.querySelector('input[name="dealership_name"]');

        // const selectDealersFieldset = selectDealers?.closest('.hs-fieldtype-select');
        // if (selectDealersFieldset) selectDealersFieldset.style.display = 'none';

        const country = _.get(event, 'target.value', '');

        _.set(selectStateProvince, 'value', '');
        _.set(selectDealers, 'value', '');

        resetSelectOptions('select_state_province');

        const grouped = _.groupBy(dealers, (val) => {
          const countryVal = _.get(val, 'properties.country', null);
          if (lang === 'ko' && (countryVal === 'KOREA' || countryVal === 'South Korea')) {
            return '대한민국';
          }
          if (lang !== 'ko' && (countryVal === 'KOREA' || countryVal === '대한민국')) {
            return 'South Korea';
          }
          return countryVal;
        });

        const states = _.filter(
          _.map(_.uniqBy(grouped[country], 'properties.state'), 'properties.state'),
          Boolean,
        );

        const dealersByCountry = grouped[country] || [];
        let filteredDealers = [];

        const addPlaceholderToSelect = (selectElement, placeholderText) => {
          // Create a new <option> element to serve as the placeholder
          const placeholderOption = document.createElement('option');
          placeholderOption.value = '';
          placeholderOption.text = placeholderText;
          placeholderOption.disabled = true;
          placeholderOption.selected = true;
        
          // Add the placeholder as the first option in the select dropdown
          selectElement.insertBefore(placeholderOption, selectElement.firstChild);
        };

        const updateDealersList = (zipCode = '') => {
          // Clear the dealer dropdown before updating it
          if (selectDealers) {
            selectDealers.innerHTML = '';
          }

          addPlaceholderToSelect(selectDealers, 
            `${lang === "ko" ? "딜러점 선택하기" : "Select local dealership"}`);

          // Only proceed if dealersByCountry is not empty
          if (!_.isEmpty(dealersByCountry)) {
            // Step 1: Filter dealers by the provided zip code and 2000-mile radius
            if (zipCode) {
              const radius = 2000; // Set the radius in miles

              filteredDealers = dealersByCountry.filter((dealer) => {
                const dealerZip = _.get(dealer, 'properties.zip', '');

                // Only keep dealers where the zip code is within the 2000-mile radius
                return dealerZip && Math.abs(parseInt(zipCode) - parseInt(dealerZip)) < radius;
              });

              // Step 2: Sort the remaining dealers by closest distance to the zip code
              filteredDealers.sort((a, b) => {
                const aZip = _.get(a, 'properties.zip', '');
                const bZip = _.get(b, 'properties.zip', '');

                const distanceA = Math.abs(parseInt(zipCode) - parseInt(aZip));
                const distanceB = Math.abs(parseInt(zipCode) - parseInt(bZip));

                // Sort by closest distance
                return distanceA - distanceB;
              });
            }

            // Step 3: Populate the dropdown with the filtered dealers
            if (filteredDealers.length > 0) {
              filteredDealers.forEach((dealer) => {
                const option = document.createElement('option');
                const dealerCompany = _.get(dealer, 'properties.company', '');
                const dealerCity = _.get(dealer, 'properties.city', '');
                let label = dealerCompany;
                if (dealerCity) label += ` (${dealerCity})`;

                option.value = label;
                option.text = label;
                selectDealers.appendChild(option);
              });
            }
          }
        };

        const handleZipCodeInput = () => {
          const zipCode = zipCodeInput?.value.trim();

          // Update the dealers list based on the zip code input
          updateDealersList(zipCode);

          // Store the current selected value before clearing the options
          const currentSelectedValue = selectDealers.value;

          // Clear the select options before adding new filtered ones
          selectDealers.innerHTML = '';

          // Loop through filteredDealers to populate the select options
          _.forEach(filteredDealers, (dealer) => {
            const option = document.createElement('option');
            const dealerCompany = _.get(dealer, 'properties.company', '');
            const dealerCity = _.get(dealer, 'properties.city', '');
            let label = '';

            if (dealerCompany) {
              label = dealerCity ? `${dealerCompany} (${dealerCity})` : dealerCompany;
            }

            // Set the value and text for the option element
            _.set(option, 'value', label);
            _.set(option, 'text', label);

            // Mark the option as selected if it matches the previously selected value
            if (currentSelectedValue && currentSelectedValue === option.value) {
              option.selected = true;
            }

            selectDealers.appendChild(option);
          });

          // Ensure the hidden field is updated based on the selected option in the dropdown
          if (selectDealers.options.length > 0) {
            const selectedOption = selectDealers.selectedOptions[0] || selectDealers.options[0];
            hiddenInputField.value = selectedOption ? selectedOption.value : '';
            selectDealers.selectedIndex = 0;
          } else {
            // If no options available, clear the hidden field
            hiddenInputField.value = '';
          }

          hiddenInputField.dispatchEvent(new Event('change', { bubbles: true }));
          hiddenInputField.dispatchEvent(new Event('input', { bubbles: true }));
        };

        if (selectDealers) {
          // Check if the element exists
          // Event listener for when a user selects a dealer
          selectDealers.addEventListener('change', () => {
            const selectedOption = selectDealers.value;

            // Update hidden field with the selected option's value
            hiddenInputField.value = selectedOption;
          });
        } else {
          console.error('Dealer select element not found in the DOM');
        }

        // Event listener for zip code input changes
        zipCodeInput?.addEventListener('input', handleZipCodeInput);

        // Initial call to load dealers without any zip code filter
        updateDealersList();

        if (_.isEmpty(states)) {
          if (selectDealers) {
            _.forEach(dealersByCountry, (dealer) => {
              const option = document.createElement('option');
              const dealerCompany = _.get(dealer, 'properties.company', '');
              const dealerCity = _.get(dealer, 'properties.city', '');
              let label = '';
              if (dealerCompany) {
                if (dealerCity) label = `${dealerCompany} (${dealerCity})`;
                else label = dealerCompany;
              }

              _.set(option, 'value', label);
              _.set(option, 'text', label);

              selectDealers.appendChild(option);
            });
          }
        } else {
          states.sort((a, b) => a?.localeCompare(b));

          _.forEach(states, (option) => {
            const optionEl = document.createElement('option');
            _.set(optionEl, 'value', option);
            _.set(optionEl, 'text', option);

            selectStateProvince?.appendChild(optionEl);
          });

          selectStateProvince?.addEventListener('change', (_event) => {
            setTimeout(() => {

              _.set(selectDealers, 'value', '');

              resetSelectOptions(localDealerName);

              const state = _.get(_event, 'target.value', '');

              const dealersByState = _.filter(dealersByCountry, (dealer) => {
                const currState = _.get(dealer, 'properties.state');
                return _.isEqual(currState, state);
              });

              _.forEach(dealersByState, (dealer) => {
                const option = document.createElement('option');
                const dealerCompany = _.get(dealer, 'properties.company', '');
                const dealerCity = _.get(dealer, 'properties.city', '');
                const dealerState = _.get(dealer, 'properties.state', '');

                let label = '';
                if (dealerCompany) {
                  if (dealerState) {
                    if (dealerCity) label = `${dealerCompany} (${dealerCity}, ${dealerState})`;
                    else label = `${dealerCompany} (${dealerState})`;
                  } else label = dealerCompany;
                }

                _.set(option, 'value', label);
                _.set(option, 'text', label);

                selectDealers?.appendChild(option);
              });

              if (dealersByState.length === 0) {
                _.set(selectDealers, 'value', ''); // Clear the dealer name if no dealers found
              }
            }, 0);
          });

          selectStateProvince?.dispatchEvent(new Event('change'), { bubbles: true });
          selectStateProvince?.dispatchEvent(new Event('input'), { bubbles: true });
          selectDealers?.dispatchEvent(new Event('change'), { bubbles: true });
          selectDealers?.dispatchEvent(new Event('input'), { bubbles: true });
        }
      }, 1000);
    });

    const submitButton = form.querySelector('input[type=submit]');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        // e.preventDefault();
        setTimeout(() => {
          const formData = {};
          const inputElements = form.querySelectorAll('input[name], select[name], textarea[name]');

          // eslint-disable-next-line no-restricted-syntax
          for (const el of inputElements) {
            const name = _.get(el, 'name', '');
            const value = _.get(el, 'value', '');
            _.set(formData, name, value);
          }

          // const selectedDealerName = formData[localDealerName];
          const selectedDealerName = formData[localDealerName]?.trim().toLowerCase();

          const selectedDealer = _.find(dealers, (dealer) => {
            const dealerCompany = (_.get(dealer, 'properties.company') || '').trim().toLowerCase();

            // Ensure city is a string before using trim and toLowerCase
            const dealerCity = (_.get(dealer, 'properties.city') || '').trim().toLowerCase();

            const dealerLabel = dealerCity ? `${dealerCompany} (${dealerCity})` : dealerCompany;

            return dealerLabel === selectedDealerName; // Match on both company and city
          });

          if (selectedDealer) {
            const dealershipName = _.get(selectedDealer, 'properties.company', '');
            const dealershipEmail = _.get(selectedDealer, 'properties.email', '');
            const requestNumber = generateUniqueId();

            _.set(formData, 'dealership_name', dealershipName);
            _.set(formData, 'dealership_email', dealershipEmail);
            _.set(formData, 'request_number', requestNumber);
            _.set(formData, 'website_region', region);
            _.set(formData, 'request_time', new Date().getTime());

            for (const el of inputElements) {
              const name = _.get(el, 'name', '');
              const formDataValue = _.get(formData, name, '');
              _.set(el, 'value', formDataValue);
              el.dispatchEvent(new Event('input'), { bubbles: true });
            }
          } else {
            console.error('Selected dealer not found.');
          }

          // console.log(formData);
        }, 0);
      });
    }
  };

  const handleForm = () => {
    if (!formLoaded) handleAfterOpen();
    else if (window.hbspt) {
      window.hbspt.forms.create({
        portalId: '8804541',
        formId,
        target: '#request-parts-form',
        onFormSubmit: (form) => {
          const inputs = form.querySelectorAll('input[name], select[name], textarea[name]');
          const formData = {};

          // eslint-disable-next-line no-restricted-syntax
          for (const input of inputs) {
            const name = _.get(input, 'name', '');
            const value = _.get(input, 'value', '');
            formData[name] = value;
          }

          // Generate a unique request number
          const requestNumber = generateUniqueId();
          formData.request_number = requestNumber;

          // Store all form data in sessionStorage for retrieval on the success page
          if (requestNumber) {
            sessionStorage.clear();
            sessionStorage.setItem(requestNumber, JSON.stringify(formData));
          }

          // Get values for GTM event
          const TYM_REGION = region;
          const TYM_LANGUAGE = lang;
          const REQUESTED_PARTS = document.querySelector('input[name=requested_parts]').value;

          // Send the mblm_request_a_quote_parts_success event to GTM  
          sendGTMEvent({
            event: 'mblm_request_a_quote_parts_success',
            TYM_REGION,
            TYM_LANGUAGE,
            REQUESTED_PARTS
          });

          const successUrl = 
          `${window.location.origin}${pathname}/success?request_number=${requestNumber}`;
          window.location.href = successUrl;
        },
        onFormReady,
      });
    }
  };

  useEffect(() => {
    getDealers();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(dealers)) handleForm();
    sortByTitle(products);
    sortByEnginePower(products);
    sortBySeriesOrder(products);
    sortBySortIndex(products);
  }, [formLoaded, products, dealers]);

  if (_.isEmpty(dealers))
    return (
      <div className="pt-[25vh]">
        <Loading />
      </div>
    );

  return (
    <Suspense fallback={<Loading />}>
      <section
        id={id}
        className="relative bg-white pt-[90px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
        <BoxedContainer>
          <div className="flex max-w-[864px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
            {_.isEmpty(title) || (
              <div
                className="text-[26px] font-bold uppercase leading-[34px] text-[#000]
                md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {_.isEmpty(text) || (
              <div
                className="part-view flex flex-col gap-y-4 font-noto
                text-[15px] font-normal leading-[26px] text-[#000] p-span-child:font-bold
                p-span-child:text-cherry lg:gap-y-8 lg:text-[18px] lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: updatedText }}
              />
            )}
          </div>
          <div
            className="mt-[30px] flex flex-col gap-y-6 border border-grey pb-11 pl-7 pr-8 pt-7
            md:gap-y-10 lg:mt-[60px]">
            {_.isEmpty(updatedformTitle) || (
              <div
                className="part-view flex max-w-[740px] flex-col gap-y-2 font-noto
              text-[15px] font-normal leading-[26px] text-primary p-span-child:text-[18px] p-span-child:font-bold
              p-span-child:text-primary lg:gap-y-5"
                dangerouslySetInnerHTML={{ __html: updatedformTitle }}
              />
            )}

            <div className="flex flex-row flex-wrap items-end gap-5 lg:gap-8">
              <div className="w-full sm:max-w-[48%] lg:max-w-[135px]">
                <SelectDropdown
                  defaultValue={getTranslationByKey('Machine type')}
                  items={categories}
                  partsFilter
                  selectedValue={{
                    value: selectedCategory,
                    label:
                      getTranslationByKey(selectedCategory, translations, lang) ||
                      getTranslationByKey('Machine' + ' type', translations, lang),
                  }}
                  onSelect={(selectedValue) => {
                    if (_.isEqual(selectedValue, 'Machine Type')) setSelectedCategory('');
                    else setSelectedCategory(selectedValue);
                  }}
                />
              </div>
              <div className="w-full sm:max-w-[48%] lg:max-w-[160px]">
                <SelectDropdown
                  defaultValue={getTranslationByKey('Model number')}
                  items={titleOptions.map((option) => option.label)}
                  selectedValue={{
                    value: selectedModel,
                    label:
                      getTranslationByKey(selectedModel, translations, lang) ||
                      getTranslationByKey('Model' + ' number', translations, lang),
                  }}
                  partsFilter
                  onSelect={(selectedValue) => setSelectedModel(selectedValue)}
                />
              </div>
              <div
                className="border-gray relative flex h-[39px] w-full !cursor-pointer flex-row items-center
                justify-start gap-x-2 overflow-hidden border-b bg-[transparent] px-1
                pb-3 text-center text-clamp14to15 font-bold sm:w-[48%] lg:w-[284px]">
                <p className="min-w-fit font-noto leading-1 text-primary">
                  {getTranslationByKey('Parts number', translations, lang)}:
                </p>
                <div>
                  <input
                    type="text"
                    placeholder={getTranslationByKey('#', translations, lang)}
                    value={partsNumber}
                    className="font-noto font-normal"
                    onChange={(e) => setPartsNumber(_.get(e, 'target.value', ''))}
                  />
                </div>
              </div>
              <div
                className="border-gray relative flex h-[39px] w-full !cursor-pointer flex-row items-center
                justify-start gap-x-2 overflow-hidden border-b bg-[transparent] px-1
                pb-3 text-center text-clamp14to15 font-bold  sm:w-[48%] lg:w-[141px]">
                <p className="min-w-fit font-noto leading-1 text-primary">
                  {getTranslationByKey('Quantity', translations, lang)}:
                </p>
                <div>
                  <input
                    type="text"
                    placeholder={getTranslationByKey('#', translations, lang)}
                    value={quantity}
                    className="font-noto font-normal"
                    onChange={(e) => setQuantity(_.get(e, 'target.value', ''))}
                  />
                </div>
              </div>
              <div className="pt-4 md:pt-0">
                <button
                  type="button"
                  className="request-part-add-to-list-button flex h-[48px] w-[160px] items-center justify-center
                  bg-cherry font-sans text-[13px] font-bold uppercase text-white"
                  onClick={handleAddToList}>
                  {getTranslationByKey('Add to List', translations, lang)}
                </button>
              </div>
            </div>

            {_.isEmpty(todos) || (
              <div className="flex flex-col gap-y-1.5 md:gap-y-1">
                {_.map(todos, (todo, index) => (
                  <div
                    key={index}
                    className="flex flex-col flex-wrap gap-2 bg-porcelain p-2
                    px-3 font-noto text-clamp12to15 text-primary sm:px-4 md:gap-8 lg:h-10
                    lg:flex-row lg:flex-nowrap lg:items-center">
                    <div className="flex w-full lg:max-w-[140px]">
                      <div className="pr-5">{index + 1}</div>
                      <div className="">{` ${_.get(todo, 'category', '')} `}</div>
                    </div>
                    <div className="w-full sm:w-[20%] lg:max-w-[160px]">{` ${_.get(todo, 'title', '')} `}</div>
                    <div className="w-full sm:w-[20%] lg:w-[260px]">
                      {`Parts Number: ${_.get(todo, 'partsNumber', '')}`}
                    </div>
                    <div className="w-full sm:w-[20%] lg:w-[141px]">{`Quantity: ${_.get(todo, 'quantity', '')}`}</div>
                    <div className="w-full sm:w-[20%]">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="close-button flex w-full svg-child-path:stroke-primary
                        svg-child-path:stroke-[1.5px] lg:justify-end">
                        <Icons name="Close" className="scale-[0.65]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {!_.isEmpty(products) && formLoaded ? (
            <div
              data-parts={!_.isEmpty(todos)}
              className="pt-[30px] data-[parts=false]:!hidden lg:pt-[60px]">
              {formTitle && (
                <div
                  className="max-w-[736px] pb-5 font-noto text-[15px] font-normal
                  leading-[26px] text-[#000] md:pb-0 lg:text-[18px] lg:leading-[32px]"
                  dangerouslySetInnerHTML={{ __html: formTitle }}
                />
              )}

              {formId && (
                <div
                  id="request-parts-form"
                  className="tym-form max-w-[920px] pt-[5px] md:pt-[45px] lg:pt-[65px]"
                />
              )}
            </div>
          ) : (
            <Loading />
          )}
          <div className="mt-10 h-[1px] w-full bg-cherry md:mt-20" />
        </BoxedContainer>
      </section>
    </Suspense>
  );
}
