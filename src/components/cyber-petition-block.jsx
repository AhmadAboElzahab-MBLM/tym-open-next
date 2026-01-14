import React, { useEffect } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import BoxedContainer from './layout/boxed-container';
import Icons from './layout/icons';

export default function CyberPetitionBlock({ data, lang }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const note = _.get(data, 'properties.note', '');
  const jumpOnButton = _.get(data, 'properties.jumpOnButton[0]', {});
  const cyberPetitionSummaryTitle = _.get(data, 'properties.cyberPetitionSummaryTitle.markup', '');
  const cyberPetitionSummaryText = _.get(data, 'properties.cyberPetitionSummaryText.markup', '');
  const cyberPetitionFormTitle = _.get(data, 'properties.cyberPetitionFormTitle.markup', '');
  const cyberPetitionFormText = _.get(data, 'properties.cyberPetitionFormText.markup', '');
  const cyberPetitionFormId = _.get(data, 'properties.cyberPetitionFormId', '');
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'hs-form-script';
    script.src = 'https://js.hsforms.net/forms/v2.js';
    document.body.appendChild(script);

    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: '8804541',
          formId: cyberPetitionFormId,
          target: '#hubspotForm',
          onFormReady(form) {
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
              const countryOption = Array.from(selectCountry.options).find(
                (option) => option.text === defaultCountry,
              );
              if (countryOption) {
                selectCountry.value = countryOption.value;
                setTimeout(() => {
                  selectCountry.dispatchEvent(new Event('change'));
                }, 0);
              }
            }

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
          },
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [cyberPetitionFormId, lang]);
  return (
    <section
      id="cyber-petition-block"
      className="bg-white pt-[100px] md:pt-[120px] lg:pt-[200px] xl:pt-[284px]">
      <BoxedContainer>
        {_.isEmpty(title) || (
          <div
            className="max-w-[780px] pb-4 text-clamp32to48 font-bold
              uppercase leading-1.5 text-black md:pb-8 md:leading-[45px] lg:leading-[54px]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {_.isEmpty(text) || (
          <div
            className="flex max-w-[864px] flex-col gap-y-[15px] pb-3 font-noto text-clamp14to18
            font-normal leading-1.77 text-black md:gap-y-[32px] md:pb-6"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        )}
        {_.isEmpty(jumpOnButton) || (
          <Link
            href={jumpOnButton.url || '#'}
            className="flex w-fit flex-row items-center gap-x-2
            pb-3 font-noto text-[12px] font-bold leading-1.875 text-cherry
            md:pb-6 md:text-[15px]">
            <span className="svg-child-path:stroke-cherry">
              <Icons name="ArrowRight" />
            </span>{' '}
            {jumpOnButton.title}
          </Link>
        )}
        {_.isEmpty(note) || (
          <span
            className="font-noto text-[12px] font-bold leading-1 text-black
            md:text-[18px] md:leading-1.875">
            {note}
          </span>
        )}
        <div className="my-10 h-[1px] w-full bg-cherry md:my-[60px]" />
        {_.isEmpty(cyberPetitionSummaryTitle) || (
          <div
            className="max-w-[780px] pb-4 text-clamp20to28 font-bold uppercase
            leading-1.42 text-black md:pb-8"
            dangerouslySetInnerHTML={{ __html: cyberPetitionSummaryTitle }}
          />
        )}
        {_.isEmpty(cyberPetitionSummaryText) || (
          <div
            className="max-w-[832px] pb-4 font-noto text-[12px] font-normal
              leading-1.625 text-black ul-child:pb-4 ul-child:pl-5  li-child:list-disc ul-child:md:pb-6 ul-child:md:pl-7
              lg:pb-6 lg:text-[18px] lg:leading-[32px]"
            dangerouslySetInnerHTML={{ __html: cyberPetitionSummaryText }}
          />
        )}
        <div className="mb-10 mt-2 h-[1px] w-full bg-cherry lg:mb-[60px] lg:mt-6" />
        {_.isEmpty(cyberPetitionFormTitle) || (
          <div
            id="cyber-petition-form"
            className="max-w-[780px] pb-8 text-clamp20to28 font-bold uppercase
            leading-1.42 text-black"
            dangerouslySetInnerHTML={{ __html: cyberPetitionFormTitle }}
          />
        )}
        {_.isEmpty(cyberPetitionFormText) || (
          <div
            className="max-w-[832px] pb-4 font-noto text-clamp14to18 font-normal leading-1.77 text-black
            ul-child:pb-4 ul-child:pl-5 li-child:list-disc ul-child:md:pb-6 ul-child:md:pl-7
            lg:pb-6"
            dangerouslySetInnerHTML={{ __html: cyberPetitionFormText }}
          />
        )}
        <div className="">
          <div id="hubspotForm" className="tym-form cyber-petition-form max-w-[948px]" />
        </div>
      </BoxedContainer>
    </section>
  );
}
