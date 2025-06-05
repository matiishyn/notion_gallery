import React, { useRef, useEffect } from 'react';
import { ImageType } from '../types';

interface GalleryProps {
  images: ImageType[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, currentIndex, onSelect }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to center the active thumbnail
  useEffect(() => {
    if (galleryRef.current && thumbnailRefs.current[currentIndex]) {
      const container = galleryRef.current;
      const activeThumb = thumbnailRefs.current[currentIndex];
      
      if (activeThumb) {
        const containerWidth = container.offsetWidth;
        const thumbLeft = activeThumb.offsetLeft;
        const thumbWidth = activeThumb.offsetWidth;
        
        const scrollPosition = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  return (
    <div 
      ref={galleryRef}
      className="relative bg-black/80 h-20 md:h-24 overflow-x-auto overflow-y-hidden py-2 px-1 flex gap-1 snap-x snap-mandatory"
    >
      {images.map((image, index) => (
        <div
          key={image.id}
          ref={(el) => (thumbnailRefs.current[index] = el)}
          className={`
            flex-shrink-0 h-full aspect-square snap-center cursor-pointer
            transition-all duration-200 overflow-hidden
            ${currentIndex === index 
              ? 'border-2 border-white' 
              : 'opacity-70 hover:opacity-100 border border-transparent'}
          `}
          onClick={() => onSelect(index)}
        >
          <img
            src={image.thumbnailUrl || image.url}
            alt={`Thumbnail ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;