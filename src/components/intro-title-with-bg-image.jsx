import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BoxedContainer from './layout/boxed-container';
import TitleSection from './layout/title-section';

export default function IntroTitleWithBgImage({ data, id }) {
  const { title, image, videoUrl } = data.properties;
  return (
    <section id={id} className="pt-[40px] md:pt-[60px]">
      <BoxedContainer>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center text-center">
          <TitleSection data={title.markup} className="max-w-[736px]" />
        </motion.div>
      </BoxedContainer>
      {_.isEmpty(image) || (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-[1520px] px-4 pt-4 md:pt-[30px] lg:pt-[60px]">
          <Image src={image[0].url} alt={id} fill className="!relative h-full w-full" />
        </motion.div>
      )}
      {_.isEmpty(videoUrl) || (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative mx-auto w-full max-w-[1520px] px-4 pt-4 md:h-auto
          md:pt-[30px] lg:pt-[60px]">
          <iframe
            src={videoUrl}
            title="about intro video"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
            className="aspect-video h-full w-full"
          />
        </motion.div>
      )}
    </section>
  );
}
