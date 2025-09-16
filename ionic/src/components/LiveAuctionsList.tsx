import React, { useState, useEffect } from 'react';
import { AuctionCard } from './AuctionCard';
import { useAuction } from '../context/AuctionContext';

interface LiveAuctionsListProps {
  onJoinAuction: (auction: any) => void;
}

export const LiveAuctionsList: React.FC<LiveAuctionsListProps> = ({ onJoinAuction }) => {
  const { liveAuctions } = useAuction();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log live auctions for debugging WebSocket updates
    count: liveAuctions.length,
    auctions: liveAuctions.map(a => ({
      id: a.id,
      title: a.title,
      currentBid: a.currentBid,
      bidders: a.bidders,
      timeLeft: a.timeLeft
    }))
  });

  useEffect(() => {
    // Data is loaded by AuctionContext, just set loading to false
    setLoading(false);
  }, [liveAuctions]);

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
        // Keep ID as string (UUID) - don't convert to number
          originalId: auction.id,
          idType: typeof auction.id,
          isUUID: auction.id.includes('-')
        });
        
        const transformedAuction = {
          id: auction.id, // Keep as string UUID
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
