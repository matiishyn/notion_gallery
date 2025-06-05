import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, ZoomIn, ZoomOut } from 'lucide-react';
import Gallery from './Gallery';
import { ImageType } from '../types';
import ImageSlide from './ImageSlide';

interface ImageCarouselProps {
  images: ImageType[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        togglePlay();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, goToNext]);

  if (images.length === 0) {
    return <div className="flex items-center justify-center h-screen text-white">No images to display</div>;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        {images.map((image, index) => (
          <ImageSlide 
            key={image.id} 
            image={image} 
            isActive={index === currentIndex}
            isZoomed={isZoomed}
          />
        ))}
        
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-20">
          <button 
            onClick={goToPrevious}
            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-sm transition-all pointer-events-auto shadow-lg hover:shadow-xl"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} className="drop-shadow-md" />
          </button>
          <button 
            onClick={goToNext}
            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-sm transition-all pointer-events-auto shadow-lg hover:shadow-xl"
            aria-label="Next image"
          >
            <ChevronRight size={28} className="drop-shadow-md" />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 flex justify-between items-center pointer-events-none z-20">
          <div className="text-white">
            <p className="font-medium">{currentIndex + 1} / {images.length}</p>
          </div>
          <div className="flex gap-3 pointer-events-auto">
            <button 
              onClick={togglePlay} 
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button 
              onClick={toggleZoom} 
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
          </div>
        </div>
      </div>
      
      <Gallery 
        images={images} 
        currentIndex={currentIndex} 
        onSelect={goToIndex} 
      />
    </div>
  );
};

export default ImageCarousel;