import React from 'react';
import { get, isEmpty } from 'lodash';
import Image from 'next/image';
import BoxedContainer from '../layout/boxed-container';

export default function CommunicationBlock({ data }) {
  // Use lodash.get to safely access nested properties
  const firstTabTitle = get(data, 'properties.title');
  const firstTabSubTitle = get(data, 'properties.subtitle');
  const phoneNumber = get(data, 'properties.phoneNumber');
  const phoneNumberCaption = get(data, 'properties.phoneNumberCaption');
  const phoneIcon = get(data, 'properties.phoneIcon[0]');
  const talkLink = get(data, 'properties.talkLink');
  const talkCaption = get(data, 'properties.talkCaption');
  const talkIcon = get(data, 'properties.talkIcon[0]');
  return (
    <section className="mt-15 lg:mt-20">
      <BoxedContainer>
        <hr className={`h-[1px] border-JDGreen`} />
        {!isEmpty(firstTabTitle) && (
          <h2 className="mb-8 mt-12 text-center text-clamp18to28 font-bold lg:mt-20">
            {firstTabTitle}
          </h2>
        )}
        {!isEmpty(firstTabSubTitle) && (
          <p
            className="mb-6 text-center text-clamp16to18 lg:mb-12"
            dangerouslySetInnerHTML={{ __html: firstTabSubTitle }}
          />
        )}

        <div className="mx-auto flex w-fit flex-row gap-8 lg:mx-auto lg:flex-row">
          {!isEmpty(phoneNumber) && (
            <div className="flex w-32 flex-col items-center justify-center lg:w-64">
              <a
                target="_blank"
                href={`tel:${phoneNumber}`}
                className="phone-link flex w-32 flex-col items-center justify-center lg:w-64">
                {phoneIcon && (
                  <Image
                    width={80}
                    height={80}
                    src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${phoneIcon.url}`}
                    alt={phoneIcon.name}
                    className="mb-8"
                  />
                )}
                <span>{phoneNumberCaption}</span>({phoneNumber})
              </a>
            </div>
          )}

          {!isEmpty(talkCaption) && (
            <div className="flex w-32 flex-col items-center justify-center lg:w-64">
              <a
                href={talkLink}
                target="_blank"
                className="flex w-32 flex-col items-center justify-center text-center lg:w-64">
                {talkIcon && (
                  <Image
                    width={80}
                    height={80}
                    src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${talkIcon.url}`}
                    alt={talkIcon.name}
                    className="mb-8"
                  />
                )}
                <span className="w-[60px] text-center">{talkCaption}</span>
              </a>
            </div>
          )}
        </div>
      </BoxedContainer>
    </section>
  );
}
