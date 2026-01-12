'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import _ from 'lodash';
import Icons from '@/components/layout/icons';

export default function FooterItemsMobile({ data }) {
  const [selected, setSelected] = useState(null);
  const handleToggle = (item) => setSelected((prev) => (_.isEqual(prev, item) ? null : item));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      viewport={{ once: true }}
      className="block md:hidden">
      {_.map(data, (item, index) => {
        const groupName = _.get(item, 'properties.groupName', null);
        const links = _.get(item, 'properties.links', null);
        const toggle = _.isEqual(selected, links);
        return (
          <div key={index} className=" border-b border-b-whiteBlur">
            <button
              type="button"
              aria-label="acc-button"
              className="flex h-[45px] w-full items-center justify-between gap-x-[20px]"
              onClick={() => handleToggle(links)}
              key={index}>
              <span
                className="font-regular font-noto text-[13px] uppercase leading-1
                tracking-[1px] text-white">
                {groupName}
              </span>
              <span className="svg-child-path:!stroke-white">
                <Icons name={toggle ? 'ArrowUp' : 'ArrowDown'} />
              </span>
            </button>
            {toggle && (
              <div className="flex flex-col gap-y-[20px] py-[10px] pl-[5px]">
                {_.map(
                  selected,
                  (val, ind) =>
                    _.isEmpty(val.route) || (
                      <Link
                        key={ind}
                        href={val.route.path + val.queryString || '#'}
                        className="font-noto text-[13px] leading-1 text-white">
                        {val.title}
                      </Link>
                    ),
                )}
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
