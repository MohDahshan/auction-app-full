import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users } from 'lucide-react';
import { apiService } from '../services/api';

export const ConcludedAuctionsList: React.FC = () => {
  const [concludedAuctions, setConcludedAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcludedAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getAuctions({ 
          status: 'ended',
          limit: 10 
        });
        
        if (response.success && response.data) {
          // Transform backend data to match component expectations
          const transformedAuctions = response.data.map((auction: any) => ({
            id: auction.id,
            title: auction.title,
            image: auction.product_image || auction.image_url || 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
            finalBid: auction.final_bid || auction.current_bid || auction.starting_bid,
            marketPrice: auction.product_market_price || auction.market_price || 0,
            winner: auction.winner_name || 'Winner',
            bidders: auction.total_participants || 0,
            savings: Math.max(0, (auction.product_market_price || 0) - ((auction.final_bid || 0) * 10)),
            endedAgo: calculateTimeAgo(auction.end_time),
            category: auction.product_category || auction.category || 'General',
            endTime: auction.end_time,
            startTime: auction.start_time
          }));
          
          setConcludedAuctions(transformedAuctions);
        } else {
          setError('Failed to load concluded auctions');
        }
      } catch (err: any) {
        console.error('Error fetching concluded auctions:', err);
        setError(err.message || 'Failed to load concluded auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchConcludedAuctions();
  }, []);

  const calculateTimeAgo = (endTime: string): string => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = now - end;
    
    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just ended';
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

  if (concludedAuctions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">🏆 No concluded auctions yet</div>
        <p className="text-sm text-gray-400">Completed auctions will appear here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {concludedAuctions.map((auction) => (
        <div key={auction.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex space-x-4">
            <img
              src={auction.image}
              alt={auction.title}
              className="w-20 h-20 object-cover rounded-xl opacity-90"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  SOLD
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{auction.endedAgo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{auction.bidders} bidders</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="font-medium">{auction.winner}</span>
                </div>
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Final Bid</span>
                  <span className="text-2xl font-bold text-gray-500">{auction.finalBid} 🪙</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Price</span>
                  <span className="text-gray-900">SAR {auction.marketPrice}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Winner Saved</span>
                  <span className="text-green-600 font-bold">SAR {auction.savings}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  🎉 {auction.winner} won this auction!
                </span>
              </div>
              <span className="text-green-600 font-bold text-sm">
                {Math.round(((auction.marketPrice - (auction.finalBid * 10)) / auction.marketPrice) * 100)}% OFF
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
