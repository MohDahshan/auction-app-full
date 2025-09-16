import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, TrendingDown } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

export const ConcludedAuctionsList: React.FC = () => {
  const { endedAuctions } = useAuction();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log ended auctions for debugging WebSocket updates
  console.log('🟢 ConcludedAuctionsList render - Ended auctions:', {
    count: endedAuctions.length,
    auctions: endedAuctions.map(a => ({
      id: a.id,
      title: a.title,
      finalBid: a.finalBid,
      currentBid: a.currentBid,
      winner: a.winner,
      bidders: a.bidders,
      savings: a.savings
    }))
  });

  useEffect(() => {
    // Data is loaded by AuctionContext, just set loading to false
    setLoading(false);
  }, [endedAuctions]);

  const getCategoryEmoji = (category: string): string => {
    const categoryEmojis: { [key: string]: string } = {
      'electronics': '📱',
      'audio': '🎧',
      'computers': '💻',
      'wearables': '⌚',
      'gaming': '🎮',
      'fashion': '👕',
      'home': '🏠',
      'sports': '⚽',
      'books': '📚',
      'toys': '🧸'
    };
    
    return categoryEmojis[category?.toLowerCase()] || '📦';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-40"></div>
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

  if (endedAuctions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">🏆 No concluded auctions yet</div>
        <p className="text-sm text-gray-400">Completed auctions will appear here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {endedAuctions.map((auction) => {
        const categoryEmoji = getCategoryEmoji(auction.category);
        const savings = auction.savings || (auction.marketPrice - (auction.finalBid || auction.currentBid || 0));
        
        return (
          <div key={auction.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-20 h-20 object-cover rounded-xl grayscale"
                />
                <div className="absolute top-1 right-1 text-lg">{categoryEmoji}</div>
                <div className="absolute -top-1 -left-1 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  ENDED
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{auction.endedAgo || 'Recently ended'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{auction.bidders} bidders</span>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Final Bid</span>
                    <span className="text-gray-900 font-bold">
                      SAR {auction.finalBid || auction.currentBid || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Market Price</span>
                    <span className="text-gray-500 line-through">SAR {auction.marketPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Winner Saved</span>
                    <span className="text-green-600 font-bold">SAR {savings}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              {auction.winner && (
                <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-yellow-800 font-bold text-sm">Winner: {auction.winner}</p>
                      <p className="text-yellow-700 text-xs">Congratulations! 🎉</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex-1 bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-bold text-sm">
                      {Math.round((savings / auction.marketPrice) * 100)}% Off
                    </p>
                    <p className="text-green-700 text-xs">Amazing deal!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-gray-100 rounded-xl p-3">
              <p className="text-gray-600 text-sm text-center">
                🏆 This auction concluded with {auction.bidders} participants. 
                The winner saved SAR {savings} compared to market price!
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
