import React from 'react';
import _ from 'lodash';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BoxedContainer from './layout/boxed-container';
import Button from './layout/button';
import TitleSection from './layout/title-section';
import SubtitleSection from './layout/subtitle-section';

export default function ImageTextWithCtaButtonLink({ data, id }) {
  const title = _.get(data, 'properties.title.markup', '');
  const text = _.get(data, 'properties.text.markup', '');
  const subtitle = _.get(data, 'properties.subtitle', '');
  const image = _.get(data, 'properties.image[0]', {});
  const links = _.get(data, 'properties.links', {});

  return (
    <section id={id}>
      <BoxedContainer>
        <div className="pb-11 pt-10 md:py-[60px] lg:py-[75px]">
          <div className="grid grid-cols-2">
            <div className="order-2 col-span-2 pt-8 md:order-1 md:col-span-1 md:pt-0">
              {_.isEmpty(image) || (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  viewport={{ once: true }}>
                  <Image
                    src={image.url}
                    alt={subtitle || image.name}
                    fill
                    className="!relative float-left !h-auto
                  2xl:!-left-[70px] 2xl:!w-[calc(100%+70px)] 2xl:!max-w-[calc(100%+70px)]
                  3xl:!-left-[180px] 3xl:!w-[calc(100%+180px)] 3xl:!max-w-[calc(100%+180px)]
                  4xl:!-left-[266px] 4xl:!w-[calc(100%+266px)] 4xl:!max-w-[calc(100%+266px)]
                  "
                  />
                </motion.div>
              )}
            </div>

            <div className="order-1 col-span-2 pt-0 md:order-2 md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                viewport={{ once: true }}
                className="pr-4 md:py-[20px] md:pb-3 md:pl-[30px] lg:py-[45px] lg:pl-[55px] lg:pr-0
                xl:py-[70px] xl:pl-[80px] 2xl:py-[95px] 2xl:pl-[105px]">
                <div className="flex flex-col gap-4 md:gap-8">
                  {_.isEmpty(title) || (
                    <SubtitleSection
                      data={subtitle}
                      className="tracking-[1px] md:tracking-[1.5px]"
                    />
                  )}
                  <div className="flex flex-col gap-4 md:gap-5">
                    {_.isEmpty(title) || <TitleSection data={title} />}
                    {_.isEmpty(text) || (
                      <div
                        className="mb-8 font-noto text-clamp14to18 leading-1.77"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex-col items-start gap-8 md:flex md:gap-12">
                  {_.isEmpty(links) ||
                    _.map(links, (link, index) => (
                      <div key={index}>
                        {index === 0 ? (
                          <Button
                            label={link.title}
                            target={link.target}
                            url={link?.url}
                            variant="primaryMercury"
                            text="image-text-with-cta-link"
                            className="inline-block"
                          />
                        ) : (
                          <Button
                            label={link.title}
                            url={link.route.path}
                            variant="primaryText"
                            rightArrow="ArrowRight"
                            text="!hidden md:!flex image-text-with-cta-button"
                          />
                        )}
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-cherry" />
      </BoxedContainer>
    </section>
  );
}
