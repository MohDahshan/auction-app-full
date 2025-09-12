import React, { useState } from 'react';
import { Smartphone, Headphones, Monitor, Gamepad2 } from 'lucide-react';
import ProductDetailsModal from './ProductDetailsModal';

const featuredProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    entryFee: 20,
    minWallet: 100,
    marketPrice: 999,
    category: 'Electronics',
    icon: Smartphone,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    name: 'AirPods Pro',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    entryFee: 10,
    minWallet: 50,
    marketPrice: 249,
    category: 'Audio',
    icon: Headphones,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    name: 'Gaming PC Setup',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    entryFee: 50,
    minWallet: 250,
    marketPrice: 1500,
    category: 'Gaming',
    icon: Gamepad2,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    name: 'MacBook Pro',
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    entryFee: 40,
    minWallet: 200,
    marketPrice: 1299,
    category: 'Computers',
    icon: Monitor,
    color: 'from-indigo-500 to-indigo-600'
  }
];

export const ProductGrid: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof featuredProducts[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (product: typeof featuredProducts[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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
