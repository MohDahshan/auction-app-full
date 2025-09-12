import React from 'react';
import { X, ShoppingCart, Coins, TrendingUp } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  entryFee: number;
  minWallet: number;
  marketPrice: number;
  category: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  if (!isOpen || !product) return null;

  const IconComponent = product.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 left-4 bg-gradient-to-r ${product.color} rounded-full p-2`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">{product.category}</span>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              style={{ right: '4rem' }}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            
            {/* Market Price */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">Market Value</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">SAR {product.marketPrice}</span>
            </div>

            {/* Auction Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-700 font-medium">Entry Fee</span>
                </div>
                <span className="text-yellow-600 font-bold">{product.entryFee} 🪙</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700 font-medium">Minimum Wallet</span>
                </div>
                <span className="text-blue-600 font-bold">{product.minWallet} 🪙</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Product</h3>
              <p className="text-gray-600 leading-relaxed">
                {getProductDescription(product.name)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105">
                🔥 Join Live Auction
              </button>
              
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors">
                📅 Set Reminder
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Auction Available</span>
              </div>
              <p className="text-xs text-gray-600">
                Join now and compete with other bidders to win this amazing product at a fraction of its market price!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get product descriptions
const getProductDescription = (productName: string): string => {
  const descriptions: { [key: string]: string } = {
    'iPhone 15 Pro': 'The latest iPhone with advanced A17 Pro chip, titanium design, and professional camera system. Features include 48MP main camera, Action Button, and USB-C connectivity.',
    'AirPods Pro': 'Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency. Enjoy up to 6 hours of listening time with the charging case.',
    'Gaming PC Setup': 'High-performance gaming computer with latest graphics card, fast processor, and RGB lighting. Perfect for gaming, streaming, and content creation.',
    'MacBook Pro': 'Powerful laptop with M3 chip, stunning Liquid Retina display, and all-day battery life. Ideal for professionals, creators, and students.'
  };
  
  return descriptions[productName] || 'Amazing product with premium quality and excellent features. Perfect for everyday use and special occasions.';
};

export default ProductDetailsModal;
