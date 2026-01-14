import React from 'react';
import { get, isEmpty } from 'lodash';
import BoxedContainer from '../layout/boxed-container';

export default function TwoColumnsTable({ data, id }) {
  const title = get(data, 'properties.title');
  const firstColumnHeader = get(data, 'properties.firstColumnHeader');
  const firstColumnContent = get(data, 'properties.firstColumnContent');

  const secondColumnHeader = get(data, 'properties.secondColumnHeader');
  const secondColumnContent = get(data, 'properties.secondColumnContent.markup');
  const caption = get(data, 'properties.caption');
  const color = get(data, 'properties.theme.color');
  return (
    <section
      id={id}
      className="bg-white py-15 
               text-clamp14to18 font-normal leading-1.77   
             text-primary">
      <BoxedContainer>
        <div className="flex flex-col ">
          {!isEmpty(title) && (
            <h2
              className="mb-8 text-clamp20to28  font-bold uppercase 
            leading-1.42 text-primary">
              {title}
            </h2>
          )}
          <div className="mb-4 flex w-full flex-row">
            <div className="flex w-[25%] flex-col">
              {!isEmpty(firstColumnHeader) && (
                <div
                  className="px-2 py-3.5  font-noto  text-clamp14to18 font-bold md:px-[22px]"
                  style={{
                    backgroundColor: `#${color}`,
                  }}>
                  {firstColumnHeader}
                </div>
              )}
              {!isEmpty(firstColumnContent) && (
                <div
                  className="flex h-full  flex-col  justify-center border-y-[1px]  border-l-[1px]
                 border-grey px-2 font-noto 
               text-clamp14to18 md:px-[22px] ">
                  {firstColumnContent}
                </div>
              )}
            </div>
            <div className="flex w-full flex-col">
              {!isEmpty(secondColumnHeader) && (
                <div
                  className="border-l-[1px]  border-[#CC9E00]  
                  px-4 py-3.5 font-noto text-clamp14to18 font-bold md:px-[32px]"
                  style={{
                    backgroundColor: `#${color}`,
                  }}>
                  {secondColumnHeader}
                </div>
              )}
              {!isEmpty(secondColumnContent) && (
                <div
                  className="[&_ul_ul]:list-circle border-[1px] border-grey py-5
  pl-10 font-noto [&_li]:ml-0 

  [&_ul]:ml-2  [&_ul]:list-disc [&_ul]:text-clamp14to18
    md:[&_ul]:ml-6  [&_ul_ul]:ml-4 [&_ul_ul]:text-clamp14to18"
                  dangerouslySetInnerHTML={{ __html: secondColumnContent }}
                />
              )}
            </div>
          </div>
          {!isEmpty(caption) && <p className="font-noto">{caption}</p>}
        </div>
      </BoxedContainer>
    </section>
  );
}
