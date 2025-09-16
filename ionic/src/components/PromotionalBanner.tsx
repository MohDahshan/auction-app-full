import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiService } from '../services/api';

interface PromotionalSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gradient: string;
  accent: string;
  is_active: boolean;
  order_index: number;
  button_text?: string;
  button_link?: string;
}

export const PromotionalBanner: React.FC = () => {
  const [promotionalSlides, setPromotionalSlides] = useState<PromotionalSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionalSlides = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const response = await apiService.getPromotionalBanners();
        
        if (response.success && response.data && response.data.length > 0) {
          // Convert API data to component format
          const slides = response.data.map((banner: any) => ({
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle,
            description: banner.description,
            image: banner.image_url,
            gradient: banner.gradient,
            accent: banner.accent,
            is_active: banner.is_active,
            order_index: banner.order_index,
            button_text: banner.button_text || 'Start Bidding 🚀',
            button_link: banner.button_link
          }));
          
          // Sort by order_index and filter active ones
          const activeSortedSlides = slides
            .filter((slide: any) => slide.is_active)
            .sort((a: any, b: any) => a.order_index - b.order_index);
          
          if (activeSortedSlides.length > 0) {
            setPromotionalSlides(activeSortedSlides);
          } else {
            // No active banners, use defaults
            setPromotionalSlides(getDefaultSlides());
          }
        } else {
          // API returned no data, use defaults
          setPromotionalSlides(getDefaultSlides());
        }
      } catch (err: any) {
        console.error('Error fetching promotional slides:', err);
        setError(err.message || 'Failed to load promotional banners');
        // Use default slides as fallback
        setPromotionalSlides(getDefaultSlides());
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionalSlides();
  }, []);

  const fetchFallbackSlides = async () => {
    // Try to get featured auctions as promotional content
    const auctionsResponse = await apiService.getAuctions({ 
      status: 'live',
      limit: 3 
    });
    
    if (auctionsResponse.success && auctionsResponse.data) {
      const slides = auctionsResponse.data.map((auction: any, index: number) => ({
        id: auction.id,
        title: `Win ${auction.title}`,
        subtitle: 'At Unbeatable Prices!',
        description: `Bid smart and win ${auction.title} for up to 80% off retail price`,
        image_url: auction.product_image || auction.image_url,
        gradient: getRandomGradient(),
        is_active: true,
        order_index: index
      }));
      
      return { success: true, data: slides };
    }
    
    return { success: false, data: [] };
  };

  const getDefaultSlides = (): PromotionalSlide[] => [
    {
      id: '1',
      title: "Get Your Favorite iPhone",
      subtitle: "At Unbeatable Prices!",
      description: "Bid smart and win the latest iPhone 15 Pro for up to 80% off retail price",
      image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
      gradient: "from-blue-600 to-purple-700",
      accent: "text-blue-300",
      is_active: true,
      order_index: 0,
      button_text: "Start Bidding 🚀"
    },
    {
      id: '2',
      title: "Premium Gaming Setup",
      subtitle: "Power Up Your Gaming!",
      description: "Win high-end gaming PCs and accessories at incredible auction prices",
      image: "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
      gradient: "from-green-600 to-emerald-700",
      accent: "text-green-300",
      is_active: true,
      order_index: 1,
      button_text: "Start Bidding 🚀"
    },
    {
      id: '3',
      title: "Designer Sneakers",
      subtitle: "Step Into Style!",
      description: "Score authentic Nike Air Max and premium footwear for less",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
      gradient: "from-orange-600 to-red-700",
      accent: "text-orange-300",
      is_active: true,
      order_index: 2,
      button_text: "Start Bidding 🚀"
    }
  ];

  const getRandomGradient = (): string => {
    const gradients = [
      "from-blue-600 to-purple-700",
      "from-green-600 to-emerald-700",
      "from-orange-600 to-red-700",
      "from-pink-600 to-rose-700",
      "from-indigo-600 to-blue-700",
      "from-purple-600 to-pink-700"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const getAccentColor = (gradient: string): string => {
    if (gradient.includes('blue')) return 'text-blue-300';
    if (gradient.includes('green')) return 'text-green-300';
    if (gradient.includes('orange')) return 'text-orange-300';
    if (gradient.includes('pink')) return 'text-pink-300';
    if (gradient.includes('indigo')) return 'text-indigo-300';
    if (gradient.includes('purple')) return 'text-purple-300';
    return 'text-blue-300';
  };

  useEffect(() => {
    if (promotionalSlides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % promotionalSlides.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [promotionalSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotionalSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotionalSlides.length) % promotionalSlides.length);
  };

  const currentPromo = promotionalSlides[currentSlide];

  if (loading) {
    return (
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 relative">
          <div className="flex items-center justify-center p-6 h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPromo || promotionalSlides.length === 0) {
    return null;
  }

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
