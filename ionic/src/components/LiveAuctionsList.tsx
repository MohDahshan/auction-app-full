import React, { useState, useEffect } from 'react';
import { AuctionCard } from './AuctionCard';
import { apiService } from '../services/api';
import webSocketService from '../services/websocket';

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

    // WebSocket event listeners for real-time updates
    const handleAuctionUpdated = (data: any) => {
      console.log('🔄 Auction updated (live list):', data);
      if (data.auction) {
        setLiveAuctions(prev => {
          const auctionExists = prev.find(auction => auction.id === data.auction.id);
          if (auctionExists) {
            const updatedAuctions = prev.map(auction => {
              if (auction.id === data.auction.id) {
                return {
                  ...auction,
                  title: data.auction.title || auction.title,
                  currentBid: data.auction.current_bid || auction.currentBid,
                  marketPrice: data.auction.product_market_price || data.auction.market_price || auction.marketPrice,
                  bidders: data.auction.total_participants || auction.bidders,
                  entryFee: data.auction.entry_fee || auction.entryFee,
                  minWallet: data.auction.min_wallet || auction.minWallet,
                  description: data.auction.description || auction.description,
                  timeLeft: data.auction.end_time ? calculateTimeLeft(data.auction.end_time) : auction.timeLeft,
                  endTime: data.auction.end_time || auction.endTime,
                  startTime: data.auction.start_time || auction.startTime
                };
              }
              return auction;
            });
            return updatedAuctions;
          }
          return prev;
        });
      }
    };

    const handleAuctionDeleted = (data: any) => {
      console.log('🗑️ Auction deleted (live list):', data);
      if (data.auctionId) {
        setLiveAuctions(prev => prev.filter(auction => auction.id !== data.auctionId));
      }
    };

    const handleAuctionStarted = (data: any) => {
      console.log('🚀 Auction started, adding to live list:', data);
      if (data.auction && data.auction.status === 'live') {
        const transformedAuction = {
          id: data.auction.id,
          title: data.auction.title,
          image: data.auction.product_image || data.auction.image_url || 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
          currentBid: data.auction.current_bid || data.auction.starting_bid,
          marketPrice: data.auction.product_market_price || data.auction.market_price || 0,
          timeLeft: calculateTimeLeft(data.auction.end_time),
          bidders: data.auction.total_participants || 0,
          entryFee: data.auction.entry_fee,
          minWallet: data.auction.min_wallet,
          description: data.auction.description || `${data.auction.title} - Live auction`,
          category: data.auction.product_category || data.auction.category || 'General',
          status: data.auction.status,
          startTime: data.auction.start_time,
          endTime: data.auction.end_time,
          productName: data.auction.product_name
        };

        setLiveAuctions(prev => {
          const exists = prev.find(auction => auction.id === data.auction.id);
          if (!exists) {
            return [transformedAuction, ...prev].slice(0, 10);
          }
          return prev;
        });
      }
    };

    const handleAuctionEnded = (data: any) => {
      console.log('🏁 Auction ended, removing from live list:', data);
      if (data.auction) {
        setLiveAuctions(prev => prev.filter(auction => auction.id !== data.auction.id));
      }
    };

    const handleBidPlaced = (data: any) => {
      console.log('💰 Bid placed, updating live auction:', data);
      if (data.auctionId) {
        setLiveAuctions(prev => prev.map(auction => {
          if (auction.id === data.auctionId) {
            return {
              ...auction,
              currentBid: data.newBid || auction.currentBid,
              bidders: data.totalBidders || auction.bidders,
              timeLeft: data.timeLeft || auction.timeLeft
            };
          }
          return auction;
        }));
      }
    };

    // Subscribe to WebSocket events
    webSocketService.on('auction:updated', handleAuctionUpdated);
    webSocketService.on('auction:deleted', handleAuctionDeleted);
    webSocketService.on('auction_started', handleAuctionStarted);
    webSocketService.on('auction_ended', handleAuctionEnded);
    webSocketService.on('bid_placed', handleBidPlaced);

    // Cleanup function
    return () => {
      webSocketService.off('auction:updated', handleAuctionUpdated);
      webSocketService.off('auction:deleted', handleAuctionDeleted);
      webSocketService.off('auction_started', handleAuctionStarted);
      webSocketService.off('auction_ended', handleAuctionEnded);
      webSocketService.off('bid_placed', handleBidPlaced);
    };
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
