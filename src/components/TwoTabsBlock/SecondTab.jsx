import React from 'react';
import _ from 'lodash';
import Image from 'next/image';
import GeneratedTable from '../GeneratedTable/GeneratedTable';

export default function SecondTab({ secondTabTitle, secondTabSubtitle, sellingSteps, table }) {
  return (
    <div className="flex flex-col space-y-8 lg:space-y-12">
      <section>
        {!_.isEmpty(secondTabTitle) && (
          <h2 className="mb-8 mt-12 text-center text-clamp18to28 font-bold lg:mt-20">
            {secondTabTitle}
          </h2>
        )}
        {!_.isEmpty(secondTabSubtitle) && (
          <p
            className="mb-12 text-center text-clamp16to18 lg:mb-14"
            dangerouslySetInnerHTML={{ __html: secondTabSubtitle }}
          />
        )}
        <div>
          {!_.isEmpty(sellingSteps) && !_.isEmpty(sellingSteps.items) && (
            <div className="flex flex-col items-center px-4">
              {sellingSteps.items.map((item, index) => {
                const { content } = item;
                const { properties } = content;
                const { backgroundColor, label, icon } = properties;

                return (
                  <div
                    key={content.id}
                    className="grid w-[350px] grid-cols-[4rem_1fr] gap-x-5 lg:w-[450px] lg:grid-cols-[6.25rem_1fr]">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full shadow-sm lg:h-25 lg:w-25"
                        style={{ backgroundColor: `#${backgroundColor.color}` }}>
                        {icon && icon[0] && (
                          <Image
                            src={icon[0].url}
                            alt={`Step ${index + 1} icon`}
                            width={80}
                            height={80}
                            className="lg:h-20 lg:w-20"
                          />
                        )}
                      </div>
                      {index < sellingSteps.items.length - 1 && (
                        <div
                          className="mx-auto my-4 h-20 w-full border-l border-dotted border-[#999]"
                          style={{ width: '1px' }}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-y-3 pt-3">
                      <span className="text-clamp16to18 font-bold">Step {index + 1}</span>
                      <span className="text-clamp16to21 font-medium">{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <h2 className="mb-14 mt-12 text-center text-clamp18to28 font-bold lg:mt-20">
            {secondTabTitle}
          </h2>
          <GeneratedTable table={table} />
        </div>
      </section>
    </div>
  );
}
