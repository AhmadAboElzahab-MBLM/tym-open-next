import React, { useState, useEffect, Suspense } from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import generateUniqueId from '@/helpers/generate-unique-id';
import Loading from '@/components/layout/loading';
import { usePathname } from 'next/navigation';
import BoxedContainer from './layout/boxed-container';

export default function FormGeneral({ data, id, lang, region }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const formId = _.get(data, 'properties.formId', '');
  const [dealers, setDealers] = useState([]);
  const pathname = usePathname();

  const [formLoaded, setFormLoaded] = useState(false);

  const getDealers = async () => {
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

    setDealers((prev) => (_.isEqual(prev, dealersData) ? prev : dealersData));
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
      selectElement.dispatchEvent(new Event('change'));
    }
  };

  const onFormReady = (form) => {
    const selectCountry = document.querySelector('select[name=country]');

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

      // Set default country
      const defaultCountry =
                lang === 'ko' ? '대한민국' : lang === 'en-ko' ? 'South Korea' : 'United States';
      const countryOption = [...selectCountry.options].find(
        (option) => option.text === defaultCountry,
      );
      if (countryOption) {
        selectCountry.value = countryOption.value;
        // Dispatching the change event to ensure it triggers correctly
        setTimeout(() => {
          selectCountry.dispatchEvent(new Event('change'));
        }, 0);
      }
    }

    let localDealerName;
    if (lang === 'ko' || lang === 'en-ko') localDealerName = 'select_local_dealership';
    else localDealerName = 'select_your_distributor_dealership';

    resetSelectOptions('select_state_province');
    resetSelectOptions(localDealerName);

    selectCountry.addEventListener('change', (event) => {
      setTimeout(() => {
        const selectStateProvince = document.querySelector('select[name=select_state_province]');
        const selectDealers = document.querySelector(`select[name=${localDealerName}]`);

        const country = _.get(event, 'target.value', '');

        _.set(selectStateProvince, 'value', '');
        _.set(selectDealers, 'value', '');

        resetSelectOptions('select_state_province');
        resetSelectOptions(localDealerName);

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

        const states = _.chain(grouped[country])
          .uniqBy('properties.state')
          .map('properties.state')
          .filter(Boolean)
          .value();

        const dealersByCountry = grouped[country] || [];

        if (!_.isEmpty(dealersByCountry)) {
          dealersByCountry.sort((a, b) => {
            const aCompany = _.get(a, 'properties.company', '');
            const bCompany = _.get(b, 'properties.company', '');

            return aCompany?.localeCompare(bCompany);
          });
        }

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

            // if (!_.isEmpty(dealersByCountry)) {
            //   _.set(selectDealers, 'selectedIndex', 1);
            //   selectDealers.dispatchEvent(new Event('change'));
            // }
          }
        } else {
          states.sort((a, b) => a?.localeCompare(b));

          _.forEach(states, (option) => {
            const optionEl = document.createElement('option');
            _.set(optionEl, 'value', option);
            _.set(optionEl, 'text', option);

            selectStateProvince.appendChild(optionEl);
          });

          // _.set(selectStateProvince, 'selectedIndex', 1);
          // selectStateProvince.dispatchEvent(new Event('change'));

          selectStateProvince.addEventListener('change', (_event) => {
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

              // if (!_.isEmpty(dealersByState)) {
              //   _.set(selectDealers, 'selectedIndex', 1);
              //   selectDealers?.dispatchEvent(new Event('change'));
              // }
            }, 0);
          });

          selectStateProvince?.dispatchEvent(new Event('change'), { bubbles: true });
          selectDealers?.dispatchEvent(new Event('change'), { bubbles: true });
        }
      }, 0);
    });

    const submitButton = document.querySelector('input[type=submit]');
    if (submitButton) {
      submitButton.addEventListener('click', (e) => {
        // e.preventDefault();
        setTimeout(() => {
          const formData = {};
          const inputElements = form.querySelectorAll('input[name], select[name], textarea[name]');

          for (const el of inputElements) {
            const name = _.get(el, 'name', '');
            const value = _.get(el, 'value', '');
            _.set(formData, name, value);
          }

          const selectedDealerName = formData[localDealerName];
          const selectedDealer = _.find(dealers, (dealer) => {
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
            return _.isEqual(selectedDealerName, label);
          });

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
            el.dispatchEvent(new Event('change'), { bubbles: true });
          }
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
        target: '#hubspotForm',
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

          const successUrl = 
          `${window.location.origin}${pathname}/success?request_number=${requestNumber}`;
          window.location.href = successUrl;
        },
        onFormReady,
      });
    }
  };

  useEffect(() => {
    if (!_.isEmpty(dealers)) handleForm();
    if (formLoaded) {
      const el = document.querySelector('select[name=country]');
      if (el) {
        if (lang === 'en-ko') {
          const skIndex = _.indexOf(_.map(el.options, 'value'), 'South Korea');
          _.set(el, 'selectedIndex', skIndex);
          el.dispatchEvent(new Event('change'), { bubbles: true });
        } else if (lang === 'ko') {
          const skIndex = _.indexOf(_.map(el.options, 'value'), '대한민국');
          _.set(el, 'selectedIndex', skIndex);
          el.dispatchEvent(new Event('change'), { bubbles: true });
        }
      }
    }
  }, [formLoaded, dealers]);

  useEffect(() => {
    getDealers();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    handleForm();
  }, [formLoaded]);

  return (
    <Suspense fallback={<Loading />}>
      <section id={id} className="relative bg-white pt-8 md:pt-12 xl:pt-20 ">
        <BoxedContainer className="border-b border-cherry pb-8 md:pb-12 xl:pb-18">
          {!formLoaded ? (
            <div className="h-[50vh] w-full">
              <Loading />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                viewport={{ once: true }}
                className="flex max-w-[864px] flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]">
                {_.isEmpty(title) || (
                  <div
                    className="text-[26px] font-bold uppercase leading-[34px]
                    text-primary md:text-[36px] md:leading-[45px] lg:text-[48px] lg:leading-[54px]"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                )}
                {_.isEmpty(text) || (
                  <div
                    className="flex flex-col gap-1 font-noto
                    text-clamp12to15 font-normal leading-1.625 text-black lg:leading-[32px]"
                    dangerouslySetInnerHTML={{ __html: text }}
                  />
                )}
              </motion.div>
              <div
                id="hubspotForm"
                className="tym-form max-w-[920px] pt-[5px] md:pt-[45px] lg:pt-[65px]
              "
              />
            </>
          )}
        </BoxedContainer>
      </section>
    </Suspense>
  );
}
