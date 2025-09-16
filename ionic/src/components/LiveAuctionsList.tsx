import React, { useState, useEffect } from 'react';
import { AuctionCard } from './AuctionCard';
import { apiService } from '../services/api';

interface LiveAuctionsListProps {
  onJoinAuction: (auction: any) => void;
}

export const LiveAuctionsList: React.FC<LiveAuctionsListProps> = ({ onJoinAuction }) => {
  const [liveAuctions, setLiveAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getAuctions({ 
          status: 'live',
          limit: 10 
        });
        
        if (response.success && response.data) {
          // Transform backend data to match component expectations
          const transformedAuctions = response.data.map((auction: any) => ({
            id: auction.id,
            title: auction.title,
            image: auction.product_image || auction.image_url || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            currentBid: auction.current_bid || auction.starting_bid,
            marketPrice: auction.product_market_price || auction.market_price || 0,
            timeLeft: calculateTimeLeft(auction.end_time),
            bidders: auction.total_participants || 0,
            entryFee: auction.entry_fee,
            minWallet: auction.min_wallet,
            description: auction.description || `${auction.title} - Live auction`,
            category: auction.product_category || auction.category || 'General',
            status: auction.status,
            startTime: auction.start_time,
            endTime: auction.end_time,
            productName: auction.product_name
          }));
          
          setLiveAuctions(transformedAuctions);
        } else {
          setError('Failed to load live auctions');
        }
      } catch (err: any) {
        console.error('Error fetching live auctions:', err);
        setError(err.message || 'Failed to load live auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveAuctions();
    
    // Refresh every 30 seconds for live data
    const interval = setInterval(fetchLiveAuctions, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = (endTime: string): number => {
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;
    
    if (difference <= 0) return 0;
    return Math.floor(difference / 1000); // Return seconds
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-32"></div>
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

  if (liveAuctions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">🔍 No live auctions at the moment</div>
        <p className="text-sm text-gray-400">Check back soon for new auctions!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {liveAuctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} onJoinAuction={onJoinAuction} />
      ))}
    </div>
  );
};
