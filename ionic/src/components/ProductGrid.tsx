import React, { useState, useEffect } from 'react';
import { Smartphone, Headphones, Monitor, Gamepad2, Package, Laptop, Watch, Headset, Car, Home } from 'lucide-react';
import ProductDetailsModal from './ProductDetailsModal';
import { apiService, Product } from '../services/api';

export const ProductGrid: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getProducts({ 
          limit: 8,
          // You can add more filters here like featured: true if backend supports it
        });
        
        if (response.success && response.data) {
          // Transform backend data to match component expectations
          const transformedProducts = response.data.map((product: Product) => ({
            id: product.id,
            name: product.name,
            image: product.image_url || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            entryFee: Math.floor(product.market_price * 0.02), // 2% of market price as entry fee
            minWallet: Math.floor(product.market_price * 0.1), // 10% of market price as min wallet
            marketPrice: product.market_price,
            category: product.category || 'General',
            icon: getCategoryIcon(product.category || 'general'),
            color: getCategoryColor(product.category || 'general'),
            description: product.description,
            brand: product.brand,
            specifications: product.specifications,
            isActive: product.is_active
          }));
          
          setFeaturedProducts(transformedProducts);
        } else {
          setError('Failed to load featured products');
        }
      } catch (err: any) {
        console.error('Error fetching featured products:', err);
        setError(err.message || 'Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getCategoryIcon = (category: string) => {
    const categoryIcons: { [key: string]: any } = {
      'electronics': Smartphone,
      'audio': Headphones,
      'computers': Monitor,
      'gaming': Gamepad2,
      'laptops': Laptop,
      'wearables': Watch,
      'headphones': Headset,
      'automotive': Car,
      'home': Home,
      'phones': Smartphone
    };
    
    return categoryIcons[category?.toLowerCase()] || Package;
  };

  const getCategoryColor = (category: string): string => {
    const categoryColors: { [key: string]: string } = {
      'electronics': 'from-blue-500 to-blue-600',
      'audio': 'from-purple-500 to-purple-600',
      'computers': 'from-indigo-500 to-indigo-600',
      'gaming': 'from-green-500 to-green-600',
      'laptops': 'from-gray-500 to-gray-600',
      'wearables': 'from-pink-500 to-pink-600',
      'headphones': 'from-red-500 to-red-600',
      'automotive': 'from-yellow-500 to-yellow-600',
      'home': 'from-teal-500 to-teal-600',
      'phones': 'from-cyan-500 to-cyan-600'
    };
    
    return categoryColors[category?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const handleViewDetails = (product: typeof featuredProducts[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-48"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">📦 No products available</div>
        <p className="text-sm text-gray-400">Products will appear here soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
      {featuredProducts.map((product) => (
        <div
          key={product.id}
          className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:bg-gray-100 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm"
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover"
            />
            <div className={`absolute top-2 left-2 bg-gradient-to-r ${product.color} rounded-full p-1.5`}>
              <product.icon className="w-4 h-4 text-white" />
            </div>
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-white text-xs font-medium">{product.category}</span>
            </div>
          </div>

          <div className="p-3 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Value</span>
                <span className="text-gray-900 font-bold">SAR {product.marketPrice}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Entry Fee</span>
                <span className="text-yellow-500 font-bold">{product.entryFee} 🪙</span>
              </div>
            </div>

            <button 
              onClick={() => handleViewDetails(product)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-all duration-200 transform hover:scale-105"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
