import React from 'react';
import { get, isEmpty } from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BoxedContainer from '../layout/boxed-container';

export default function MainFeaturesBlock({ data }) {
  const features = get(data, 'properties.features.items', []);

  if (isEmpty(features)) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className={`bg-white font-noto text-clamp12to15 leading-[24px] text-primary`}>
      <BoxedContainer>
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}>
          {features.map((feature) => {
            const featureContent = get(feature, 'content', {});
            const featureId = get(featureContent, 'id');
            const label = get(featureContent, 'properties.label', '');
            const subLabel = get(featureContent, 'properties.subLabel', '');
            const backgroundColor = get(
              featureContent,
              'properties.backgroundColor.color',
              '377c2b',
            );
            const icon = get(featureContent, 'properties.icon[0]', null);

            if (isEmpty(label) || !featureId) {
              return null;
            }

            return (
              <motion.div key={featureId} className="flex w-full" variants={itemVariants}>
                <div
                  style={{ backgroundColor: `#${backgroundColor}` }}
                  className="flex h-full w-[130px] flex-shrink-0 items-center justify-center">
                  {!isEmpty(icon) && (
                    <div>
                      <Image
                        src={get(icon, 'url', '')}
                        alt={get(icon, 'name', '')}
                        width={60}
                        height={60}
                        className="text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-center border border-grey bg-porcelain px-6 py-9">
                  <h3 className="leading-tight mb-3 text-clamp16to18 font-bold text-black">
                    {label}
                  </h3>
                  {!isEmpty(subLabel) && (
                    <p className="leading-tight text-clamp16to24 font-medium text-black">
                      {subLabel}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </BoxedContainer>
    </section>
  );
}
