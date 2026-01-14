import React from 'react';
import { get, isEmpty } from 'lodash';
import Image from 'next/image';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import BoxedContainer from '../layout/boxed-container';
import Icons from '../layout/icons';

export default function IconsSet({ data, id }) {
  let iconsItems = get(data, 'properties.icons.items', []);
  if (isEmpty(iconsItems)) {
    iconsItems = data.items;
  }
  const marginBottom = get(data, 'properties.marginBottom', false);
  const marginTop = get(data, 'properties.marginTop', false);

  return (
    <section
      id={id}
      className={classNames(
        marginBottom && `pb-15`,
        marginTop && `pt-15`,
        `bg-white 
               text-clamp12to15   
               leading-[24px] text-primary`,
      )}>
      <BoxedContainer>
        <div className="flex flex-col justify-between gap-5 py-0 md:flex-row md:items-start">
          {!isEmpty(iconsItems) &&
            iconsItems.map((iconItem, index) => {
              const iconContent = get(iconItem, 'content.properties', {});
              const iconUrl = get(iconContent, 'icon[0].url');
              const label = get(iconContent, 'label', 'Icon');
              const backgroundColor = get(iconContent, 'backgroundColor.color', 'ffc600');
              const isLastItem = index === iconsItems.length - 1;

              return (
                <React.Fragment key={get(iconItem, 'content.id', Math.random())}>
                  <motion.div
                    initial={{ opacity: 0, y: -60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (index / 2) * 0.8 }}
                    viewport={{ once: true }}
                    className="flex flex-row md:hidden">
                    <div
                      className=" mx-auto flex h-fit w-[200px] 
                      flex-col items-center justify-center gap-y-5 ">
                      <div
                        className="flex h-25 w-25 flex-col items-center justify-center rounded-full"
                        style={{ backgroundColor: `#${backgroundColor}` }}>
                        {iconUrl && <Image src={iconUrl} width={80} height={80} alt={label} />}
                      </div>
                      <span className="text-center text-clamp14to18 font-bold">{label}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: (index / 2) * 0.8 }}
                    viewport={{ once: true }}
                    className="hidden flex-col  md:flex">
                    <div
                      className="mx-auto flex h-fit w-[200px] flex-col items-center 
                      justify-center gap-y-5  md:mx-0 md:w-[120px] ">
                      <div
                        className="flex h-25 w-25 flex-col items-center justify-center rounded-full"
                        style={{ backgroundColor: `#${backgroundColor}` }}>
                        {iconUrl && <Image src={iconUrl} width={80} height={80} alt={label} />}
                      </div>
                      <span className="w-[210px]  text-center text-clamp14to15 font-bold">
                        {label}
                      </span>
                    </div>
                  </motion.div>

                  {/* Arrows between items */}
                  {!isLastItem && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index / 2) * 0.8 + 0.2 }}
                      viewport={{ once: true }}
                      className="y mx-auto mb-auto flex max-h-[40px]
                       w-fit  flex-1 items-center justify-center md:h-[100px] md:max-h-full ">
                      <Icons
                        name="ArrowThick"
                        className="my-4 h-fit w-[40px]  
                        rotate-90 md:my-0 md:w-[50px] md:rotate-0"
                      />
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </BoxedContainer>
    </section>
  );
}
