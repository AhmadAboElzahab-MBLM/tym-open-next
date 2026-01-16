'use client';

/* eslint-disable react/no-danger */
import React, {Suspense, useEffect, useState } from 'react';
import _ from 'lodash';
import { sendGTMEvent } from '@next/third-parties/google'
import Loading from '@/components/layout/loading';
import BoxedContainer from './layout/boxed-container';

export default function TextContentWithForm({ data, id, lang, region }) {
  const title = _.get(data, 'properties.title', '');
  const text = _.get(data, 'properties.text.markup', '');
  const formCSSClass = _.get(data, 'properties.formCSSClass', '');
  const formFooterText = _.get(data, 'properties.formFooterText.markup', '');
  const generalFormId = _.get(data, 'properties.formId', '');
  const [dealers, setDealers] = useState([]);

  // Get values for GTM event
  const TYM_REGION = region;
  const TYM_LANGUAGE = lang;

  const getDealers = async () => {
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

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const resp = await res.json();
      const dealersData = _.get(resp, 'data', []);

      setDealers((prev) => (_.isEqual(prev, dealersData) ? prev : dealersData));
    } catch (error) {
      console.error("Failed to fetch dealers:", error);
    }
  };

  useEffect(() => {
    getDealers();
  }, []);

  // const filteredDealers = dealers.filter(
  //   (dealer) => dealer.properties.state === "Kentucky"
  // );

  // console.log("Dealers", filteredDealers)

  const resetSelectOptions = (selectElement) => {
    if (selectElement) {
      while (selectElement.options.length > 1) {
        selectElement.remove(1);
      }
    }
  };


  useEffect(() => {
    
    const script = document.createElement('script');
    script.id = 'hs-form-script';
    script.src = 'https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: '8804541',
          formId: generalFormId,
          target: '#hubspotForm',
          onFormSubmit() {

            const eventType = window.location.href.includes("become-a-dealer")
            ? 'mblm_become_a_dealer_success'
            : 'mblm_contact_success';

            sendGTMEvent({
              event: eventType,
              TYM_REGION,
              TYM_LANGUAGE,
            });
          },
          onFormReady(form) {
            const selectCountry = form.querySelector('select[name=country]');
            const hiddenDealerField = form.querySelector('input[name="selected_dealer"]');
            const selectStateProvince = form.querySelector('select[name=select_state_province]');

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
              const countryOption = Array.from(selectCountry.options).find(
                (option) => option.text === defaultCountry
              );
              if (countryOption) {
                selectCountry.value = countryOption.value;
                setTimeout(() => {
                  selectCountry.dispatchEvent(new Event('change'));
                }, 0);
              }
            }

            const formFields = {
              city: form.querySelector('input[name="city"]'),
              state: form.querySelector('input[name="state"]') ? form.querySelector('input[name="state"]') : form.querySelector('select[name="select_state_province"]') ,
              country: form.querySelector('select[name="country"]'),
              zip: form.querySelector('input[name="zip"]'),
            };

            const findNearestDealer = () => {
              const formData = {
                city: formFields.city?.value || "",
                state: formFields.state?.value || "",
                country: formFields.country?.value || "",
                zip: formFields.zip?.value || "",
              };

              // console.log("Form Data:", formData);
              // console.log("Dealers Data:", dealers);

              // Prioritized matching logic
              const nearestDealer =
                dealers.find((dealer) => dealer.properties.city?.toLowerCase() === formData.city?.toLowerCase()) ||
                dealers.find((dealer) => dealer.properties.state?.toLowerCase() === formData.state?.toLowerCase()) ||
                dealers.find((dealer) => dealer.properties.country?.toLowerCase() === formData.country?.toLowerCase()) ||
                dealers.find((dealer) => dealer.properties.zip === formData.zip);

              // console.log("Nearest Dealer Found:", nearestDealer);

              return nearestDealer?.properties.company || "No nearby dealer found";
            };

            const updateSelectedDealer = () => {
              if (hiddenDealerField) {
                const nearestDealer = findNearestDealer();
                hiddenDealerField.value = nearestDealer;

                // Trigger change event
                hiddenDealerField.dispatchEvent(new Event("input"));
              }
            };

            // Update dealer when fields change
            ["city", "state", "select_state_province", "country", "zip"].forEach((field) => {
              if (formFields[field]) {
                formFields[field].addEventListener("input", updateSelectedDealer);
                formFields[field].addEventListener("change", updateSelectedDealer);
              }
            });

            // Initial update when dealers are loaded
            setTimeout(updateSelectedDealer, 1000);

            const selectInquiryType = form.querySelector('select[name="select_inquiry_type"]');
            const urlParams = new URLSearchParams(window.location.search);
            const contactParam = urlParams.get('query_type')?.toLowerCase(); // Convert to lowercase

            if (selectInquiryType && contactParam) {
              const matchingOption = Array.from(selectInquiryType.options).find(
                (option) => _.toLower(_.get(option, 'value', '')) === contactParam,
              );
              if (matchingOption) {
                matchingOption.selected = true;
                selectInquiryType.dispatchEvent(new Event('change'));
              }
            }

            
            if (!selectCountry || !selectStateProvince) return;

          const updateStates = () => {
            const country = selectCountry.value;
            resetSelectOptions(selectStateProvince);

            if (_.isEmpty(dealers)) return;

            const grouped = _.groupBy(dealers, (val) => _.get(val, 'properties.country', ''));
            let states = _.map(_.uniqBy(grouped[country] || [], 'properties.state'), 'properties.state');

            states = states.filter(state => state !== 'GA');

            if (!_.isEmpty(states)) {
              states.sort((a, b) => a.localeCompare(b));
              states.forEach((state) => {
                const optionEl = document.createElement('option');
                optionEl.value = state;
                optionEl.textContent = state;
                selectStateProvince.appendChild(optionEl);
              });
              selectStateProvince.dispatchEvent(new Event('change', { bubbles: true }));
            }
          };

          selectCountry.addEventListener('change', updateStates);

          setTimeout(() => {
            updateStates();
          }, 500);
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [generalFormId, lang, dealers]);

  return (
    <Suspense fallback={<Loading />}>
    <section id={id} className={`bg-white ${formCSSClass} ${formCSSClass === "sub-headline" ? 'pt-10 md:pt-14 lg:pt-16 xl:pt-20' : 'pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]'}`}>
      <BoxedContainer>
      
        <div className="flex flex-col gap-y-[30px] md:gap-y-[48px] lg:gap-y-[72px]">
          <div className={`flex ${formCSSClass === "sub-headline" ? "max-w-[928px]" : "max-w-[864px]"} flex-col gap-y-[15px] md:gap-y-[20px] lg:gap-y-[32px]`}>
            {_.isEmpty(title) || (
              formCSSClass === 'sub-headline' 
              ? <h2
              className="max-w-[780px] text-clamp20to28 font-bold uppercase
              leading-1.5 text-primary]">
              {title}</h2> 
              : <div
                className="max-w-[780px] text-clamp32to48 font-bold uppercase
              leading-1.5 text-primary md:leading-[45px] lg:leading-[54px]">{title}</div>
            )}
            {_.isEmpty(text) || (
              <div
                className="flex flex-col gap-y-[15px] font-noto text-[12px]
              font-normal leading-1.625 text-primary md:gap-y-[32px] lg:text-[18px] lg:leading-[32px]"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          {!_.isEmpty(dealers) && generalFormId ? (
          <div id="hubspotForm" className="tym-form max-w-[920px]" />
        ) : (
          <Loading />
        )}
          {_.isEmpty(formFooterText) || (
            <div
              className="text-clamp14to16 flex flex-col
                gap-y-[15px] font-noto
                font-normal text-primary md:gap-y-[32px] [&>p>a]:underline
                [&>p>a]:hover:no-underline [&>p>a]:font-bold"
              dangerouslySetInnerHTML={{ __html: formFooterText }}
            />
          )}
        </div>
        
      </BoxedContainer>
    </section>
    </Suspense>
  );
}
