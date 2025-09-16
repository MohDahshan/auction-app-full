import React, { useState, useEffect } from 'react';
import { AuctionCard } from './AuctionCard';
import { useAuction } from '../context/AuctionContext';
import { apiService } from '../services/api';

interface LiveAuctionsListProps {
  onJoinAuction: (auction: any) => void;
}

export const LiveAuctionsList: React.FC<LiveAuctionsListProps> = ({ onJoinAuction }) => {
  const { liveAuctions } = useAuction();
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
          // Data is now managed by context, so we just need to trigger loading
          console.log('✅ Live auctions loaded from API');
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
  }, []);

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
      {liveAuctions.map((auction) => {
        // Transform context auction to match AuctionCard expectations
        const transformedAuction = {
          id: parseInt(auction.id),
          title: auction.title,
          image: auction.image,
          currentBid: auction.currentBid || 45,
          marketPrice: auction.marketPrice,
          timeLeft: auction.timeLeft || 3600,
          bidders: auction.bidders,
          entryFee: auction.entryFee,
          minWallet: auction.minWallet,
          description: auction.description,
          category: auction.category,
          status: auction.status,
          startTime: auction.startTime,
          endTime: auction.endTime,
          productName: auction.productName
        };

        return (
          <AuctionCard 
            key={auction.id} 
            auction={transformedAuction} 
            onJoinAuction={onJoinAuction} 
          />
        );
      })}
    </div>
  );
};
