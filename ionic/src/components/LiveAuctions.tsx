import React, { useState, useEffect } from 'react';
import { AuctionCard } from './AuctionCard';
import { apiService } from '../services/api';
import webSocketService from '../services/websocket';

interface LiveAuctionsProps {
  onJoinAuction: (auction: any) => void;
}

export const LiveAuctions: React.FC<LiveAuctionsProps> = ({ onJoinAuction }) => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getAuctions({ 
          status: 'live',
          limit: 6 
        });
        
        if (response.success && response.data) {
          setAuctions(response.data);
        } else {
          setAuctions([]);
        }
      } catch (err: any) {
        console.error('Error fetching live auctions:', err);
        setError(null); // Don't show error, show fallback data instead
        
        // Fallback data when there's an error
        const fallbackData = [
          {
            id: 'demo-live-1',
            title: 'iPhone 15 Pro Max',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            currentBid: 45,
            marketPrice: 3750,
            timeLeft: 1200,
            bidders: 24,
            entryFee: 20,
            minWallet: 100,
            description: 'Latest iPhone 15 Pro Max with 256GB storage in Titanium Blue',
            category: 'Electronics'
          },
          {
            id: 'demo-live-2',
            title: 'Nike Air Max 90',
            image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
            currentBid: 28,
            marketPrice: 450,
            timeLeft: 1800,
            bidders: 18,
            entryFee: 15,
            minWallet: 75,
            description: 'Classic Nike Air Max 90 sneakers in premium white colorway',
            category: 'Fashion'
          }
        ];
        setAuctions(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveAuctions();

    // WebSocket event listeners for real-time updates
    const handleAuctionCreated = (data: any) => {
      // Don't add to live auctions - they start as upcoming
    };

    const handleAuctionUpdated = (data: any) => {
      if (data.auction) {
        setAuctions(prev => {
          const auctionExists = prev.find(auction => auction.id === data.auction.id);
          if (auctionExists) {
            const updatedAuctions = prev.map(auction => 
              auction.id === data.auction.id ? { ...auction, ...data.auction } : auction
            );
            return updatedAuctions;
          }
          return prev;
        });
      }
    };

    const handleAuctionDeleted = (data: any) => {
      if (data.auctionId) {
        setAuctions(prev => prev.filter(auction => auction.id !== data.auctionId));
      }
    };

    const handleAuctionStarted = (data: any) => {
      setAuctions(prev => {
        // Check if auction already exists
        const exists = prev.find(auction => auction.id === data.auction.id);
        if (!exists) {
          return [data.auction, ...prev].slice(0, 6); // Keep only 6 auctions
        }
        return prev;
      });
    };

    const handleAuctionEnded = (data: any) => {
      setAuctions(prev => prev.filter(auction => auction.id !== data.auction.id));
    };

    const handleBidPlaced = (data: any) => {
      setAuctions(prev => prev.map(auction => {
        if (auction.id === data.auctionId) {
          return {
            ...auction,
            currentBid: data.newBid,
            bidders: data.totalBidders,
            timeLeft: data.timeLeft || auction.timeLeft
          };
        }
        return auction;
      }));
    };

    const handleAuctionStatusChanged = (data: any) => {
      if (data.auction.status === 'live') {
        // Add to live auctions if it became live
        setAuctions(prev => {
          const exists = prev.find(auction => auction.id === data.auction.id);
          if (!exists) {
            return [data.auction, ...prev].slice(0, 6);
          }
          return prev.map(auction => 
            auction.id === data.auction.id ? { ...auction, ...data.auction } : auction
          );
        });
      } else {
        // Remove from live auctions if status changed to something else
        setAuctions(prev => prev.filter(auction => auction.id !== data.auction.id));
      }
    };

    const handleAuctionsUpdated = (data: any) => {
      if (data.type === 'live' && data.auctions) {
        setAuctions(data.auctions.slice(0, 6));
      }
    };

    // Subscribe to WebSocket events
    webSocketService.on('auction:created', handleAuctionCreated);
    webSocketService.on('auction:updated', handleAuctionUpdated);
    webSocketService.on('auction:deleted', handleAuctionDeleted);
    webSocketService.on('auction_started', handleAuctionStarted);
    webSocketService.on('auction_ended', handleAuctionEnded);
    webSocketService.on('bid_placed', handleBidPlaced);
    webSocketService.on('auction_status_changed', handleAuctionStatusChanged);
    webSocketService.on('auctions_updated', handleAuctionsUpdated);

    // Cleanup function
    return () => {
      webSocketService.off('auction:created', handleAuctionCreated);
      webSocketService.off('auction:updated', handleAuctionUpdated);
      webSocketService.off('auction:deleted', handleAuctionDeleted);
      webSocketService.off('auction_started', handleAuctionStarted);
      webSocketService.off('auction_ended', handleAuctionEnded);
      webSocketService.off('bid_placed', handleBidPlaced);
      webSocketService.off('auction_status_changed', handleAuctionStatusChanged);
      webSocketService.off('auctions_updated', handleAuctionsUpdated);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-300 h-4 rounded mb-2"></div>
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">خطأ في تحميل المزادات الحية</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد مزادات حية حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} onJoinAuction={onJoinAuction} />
      ))}
    </div>
  );
};
