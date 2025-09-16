import React from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { WalletDisplay } from '../components/WalletDisplay';
import { useAuction } from '../context/AuctionContext';

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    entryFee: 20,
    minWallet: 100,
    marketPrice: 3750,
    category: 'Electronics',
    emoji: '📱'
  },
  {
    id: 2,
    name: 'Nike Air Max 90',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    entryFee: 15,
    minWallet: 75,
    marketPrice: 450,
    category: 'Sneakers',
    emoji: '👟'
  },
  {
    id: 3,
    name: 'AirPods Pro',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    entryFee: 10,
    minWallet: 50,
    marketPrice: 935,
    category: 'Electronics',
    emoji: '🎧'
  },
  {
    id: 4,
    name: 'Gaming PC Setup',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    entryFee: 35,
    minWallet: 175,
    marketPrice: 2499,
    category: 'Gaming',
    emoji: '💻'
  }
];

interface StorePageProps {
  onGoToPayment?: () => void;
  onJoinAuction: (product: any) => void;
}

export const StorePage: React.FC<StorePageProps> = ({ onGoToPayment, onJoinAuction }) => {
  const { isLoggedIn } = useAuction();

  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store</h1>
          <p className="text-gray-600">Start auctions for premium products</p>
        </div>
        {isLoggedIn ? <WalletDisplay onGoToPayment={onGoToPayment} /> : null}
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter</span>
          </button>
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Hot Deals
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onJoinAuction={onJoinAuction} />
        ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">How Store Auctions Work</h3>
          <p className="text-white/90 mb-4">
            Choose any product and start an instant auction. Bid smart to win at incredible prices!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold mb-1">Choose Product</h4>
              <p className="text-sm text-white/80">Select any item you want to win</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold mb-1">Start Auction</h4>
              <p className="text-sm text-white/80">Pay entry fee and join the bidding</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <h4 className="font-bold mb-1">Win & Save</h4>
              <p className="text-sm text-white/80">Last bidder wins at huge savings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};