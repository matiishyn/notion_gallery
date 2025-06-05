import React from 'react';
import ImageCarousel from './components/ImageCarousel';
import { images } from './data/images';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <ImageCarousel images={images} />
    </div>
  );
}

export default App;