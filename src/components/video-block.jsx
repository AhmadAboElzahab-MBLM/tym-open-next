import React from 'react';
import _ from 'lodash';
import BoxedContainer from './layout/boxed-container';

export default function VideoBlock({ data = null }) {
  
  const subtitle = _.get(data, 'properties.subtitle', '');
  const title = _.get(data, 'properties.title', '');
  const text = _.get(data, 'properties.text', '');
  const cssClass = _.get(data, 'properties.cssClass', '');
  const videoUrl = _.get(data, 'properties.videoUrl', '');
  const localVideo = _.get(data, 'properties.localVideo[0].url', null);

  return (
    <div className={`${cssClass?.includes("border-top") ? 'pt-10 md:pt-14 lg:pt-16 xl:pt-20' : 'pt-10 lg:pt-[60px]'}`}>
      <BoxedContainer className={`${cssClass?.includes("large-video") ? '!max-w-[1520px]' : ''}`}>
        {cssClass?.includes("border-top") ? <div className="h-[1px] w-full bg-cherry" /> : ''}
        {(subtitle !== null || title !== null || text !== null) && (
          <div className="flex flex-col text-center items-center gap-y-3 md:gap-y-6 py-8 md:py-12 lg:py-16 xl:py-20">
          { subtitle && (
          <h4 className="font-noto text-clamp12to15 font-bold uppercase tracking-[1px] md:tracking-[1.5px]">{subtitle}</h4>
          )}
           { title && (
          <h3 className="text-clamp20to28 font-bold uppercase leading-1.42">{title}</h3>
           )}
            { text && (
          <div className="text-center font-noto text-clamp14to18 leading-1.6">{text}</div>
            )}
        </div>
        )}

        {/* Render iframe if videoUrl exists and localVideo is empty */}
        {!_.isEmpty(videoUrl) && localVideo === null && (
          <div className="w-full md:h-[39.39rem]">
            <iframe
              src={videoUrl}
              title="about intro video"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allowFullScreen
              className="aspect-video h-full w-full"
            />
          </div>
        )}

        {/* Render local video if localVideo exists */}
        {localVideo !== null && (
          <div className={`w-full ${cssClass?.includes("large-video") ? 'h-full' : 'md:h-[39.39rem]'}`}>

            {cssClass?.includes("with-controls") ? (
              <video controls muted autoPlay playsInline className="aspect-video h-full w-full">
              <source 
              src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${localVideo}`} 
              type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            ) : (
            <video autoPlay playsInline muted loop className="aspect-video h-full w-full">
              <source 
              src={`${process.env.NEXT_PUBLIC_UMBRACO_BASE_IMAGE_URL}${localVideo}`} 
              type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            )}
          </div>
        )}

        {cssClass?.includes("border-bottom") ? <div className="h-[1px] w-full bg-cherry mt-10 lg:mt-[76px]" /> : ''}

      </BoxedContainer>
    </div>
  );
}
