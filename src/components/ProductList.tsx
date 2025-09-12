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

export const ProductList: React.FC = () => {
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
      <div className="space-y-4">
      {featuredProducts.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:bg-gray-50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] shadow-sm"
        >
          <div className="flex p-4 space-x-4">
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className={`absolute top-1 left-1 bg-gradient-to-r ${product.color} rounded-full p-1.5`}>
                <product.icon className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">SAR {product.marketPrice}</p>
                  <p className="text-sm text-gray-500">Market Value</p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div className="flex space-x-4 text-sm">
                  <div>
                    <span className="text-gray-600">Entry Fee: </span>
                    <span className="text-yellow-500 font-bold">{product.entryFee} 🪙</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Wallet: </span>
                    <span className="text-gray-700 font-medium">{product.minWallet} 🪙</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleViewDetails(product)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105"
              >
                View Details
              </button>
            </div>
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
