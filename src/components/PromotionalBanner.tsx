import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const promotionalSlides = [
  {
    id: 1,
    title: "Get Your Favorite iPhone",
    subtitle: "At Unbeatable Prices!",
    description: "Bid smart and win the latest iPhone 15 Pro for up to 80% off retail price",
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    gradient: "from-blue-600 to-purple-700",
    accent: "text-blue-300"
  },
  {
    id: 2,
    title: "Premium Gaming Setup",
    subtitle: "Power Up Your Gaming!",
    description: "Win high-end gaming PCs and accessories at incredible auction prices",
    image: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
    gradient: "from-green-600 to-emerald-700",
    accent: "text-green-300"
  },
  {
    id: 3,
    title: "Designer Sneakers",
    subtitle: "Step Into Style!",
    description: "Score authentic Nike Air Max and premium footwear for less",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    gradient: "from-orange-600 to-red-700",
    accent: "text-orange-300"
  }
];

export const PromotionalBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionalSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotionalSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotionalSlides.length) % promotionalSlides.length);
  };

  const currentPromo = promotionalSlides[currentSlide];

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6">
      <div className={`bg-gradient-to-r ${currentPromo.gradient} relative`}>
        <div className="flex items-center justify-between p-6">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Content */}
          <div className="flex items-center space-x-6 w-full">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">
                {currentPromo.title}
              </h2>
              <p className={`text-lg font-semibold ${currentPromo.accent} mb-2`}>
                {currentPromo.subtitle}
              </p>
              <p className="text-white/90 text-sm mb-4">
                {currentPromo.description}
              </p>
              <button className="bg-white text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                Start Bidding 🚀
              </button>
            </div>

            {/* Product Image */}
            <div className="relative">
              <img
                src={currentPromo.image}
                alt={currentPromo.title}
                className="w-32 h-32 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                HOT 🔥
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-2 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {promotionalSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};