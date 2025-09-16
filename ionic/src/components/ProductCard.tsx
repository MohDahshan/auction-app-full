import React, { useState } from 'react';
import { Coins, Users } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

interface Product {
  id: number;
  name: string;
  image: string;
  entryFee: number;
  minWallet: number;
  marketPrice: number;
  category: string;
  emoji: string;
}

interface ProductCardProps {
  product: Product;
  onJoinAuction?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onJoinAuction }) => {
  const { userCoins, isLoggedIn } = useAuction();
  const [isHovered, setIsHovered] = useState(false);

  const canJoin = userCoins >= product.entryFee;

  const handleJoinAuction = () => {
    if (onJoinAuction) {
      // Convert product to auction format
      const auctionData = {
        id: product.id,
        title: product.name,
        image: product.image,
        currentBid: Math.floor(product.entryFee * 0.8), // Start with lower bid
        marketPrice: product.marketPrice,
        timeLeft: 300, // 5 minutes
        bidders: Math.floor(Math.random() * 20) + 5, // Random bidders 5-25
        entryFee: product.entryFee,
        minWallet: product.minWallet,
        description: `Premium ${product.name} available through auction`,
        category: product.category
      };
      onJoinAuction(auctionData);
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-blue-500 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white text-sm font-medium">{product.category}</span>
        </div>
        <div className="absolute top-3 right-3 text-2xl">{product.emoji}</div>
        <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          AUCTION
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Market Value</span>
            <span className="text-gray-900 font-bold">SAR {product.marketPrice}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Entry Fee</span>
            <span className="text-yellow-500 font-bold flex items-center">
              <Coins size={16} className="mr-1" />
              {product.entryFee}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Min. Wallet</span>
            <span className="text-gray-700 font-medium flex items-center">
              <Coins size={16} className="mr-1" />
              {product.minWallet}
            </span>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <div className="flex justify-between items-center">
              <span className="text-green-700 text-sm font-medium">Potential Saving</span>
              <span className="text-green-600 font-bold">
                SAR {product.marketPrice - (product.entryFee * 10)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleJoinAuction}
          disabled={!canJoin}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-200 ${
            canJoin
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } ${isHovered && canJoin ? 'animate-pulse' : ''}`}
        >
          {canJoin ? 'Start Auction' : 'Need More Coins'}
        </button>
      </div>
    </div>
  );
};