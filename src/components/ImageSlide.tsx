import React from 'react';
import { ImageType } from '../types';

interface ImageSlideProps {
  image: ImageType;
  isActive: boolean;
  isZoomed: boolean;
}

const ImageSlide: React.FC<ImageSlideProps> = ({ image, isActive, isZoomed }) => {
  return (
    <div 
      className={`
        absolute inset-0 transition-opacity duration-500 ease-in-out z-10
        ${isActive ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className={`
        w-full h-full flex items-center justify-center bg-black
        ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
      `}>
        <img 
          src={image.url}
          alt={image.caption || `Image ${image.id}`}
          className={`
            transition-transform duration-300 ease-out
            ${isZoomed 
              ? 'scale-150 md:scale-175 object-contain' 
              : 'scale-100 object-contain'}
          `}
        />
      </div>
    </div>
  );
};

export default ImageSlide;