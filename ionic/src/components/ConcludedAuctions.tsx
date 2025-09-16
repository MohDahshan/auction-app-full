import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users } from 'lucide-react';
import { apiService } from '../services/api';
import webSocketService from '../services/websocket';

export const ConcludedAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcludedAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try different status values that the server might accept
        let response;
        try {
          response = await apiService.getAuctions({ 
            status: 'ended',
            limit: 6 
          });
        } catch (firstError) {
          // If 'ended' fails, try 'completed'
          try {
            response = await apiService.getAuctions({ 
              status: 'completed',
              limit: 6 
            });
          } catch (secondError) {
            // If both fail, try without status filter
            response = await apiService.getAuctions({ 
              limit: 6 
            });
          }
        }
        
        if (response && response.success && response.data) {
          // Filter for ended auctions if we got all auctions
          const endedAuctions = response.data.filter((auction: any) => 
            auction.status === 'ended' || 
            auction.status === 'completed' || 
            auction.status === 'concluded' ||
            new Date(auction.end_time) < new Date()
          );
          setAuctions(endedAuctions.slice(0, 6));
        } else {
          // Fallback data when server is not available
          const fallbackData = [
            {
              id: 'demo-1',
              title: 'MacBook Pro 16"',
              image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
              finalBid: 89,
              marketPrice: 9370,
              winner: 'Alex Thunder',
              bidders: 45,
              savings: 6035,
              endedAgo: '2 hours ago'
            },
            {
              id: 'demo-2',
              title: 'PlayStation 5',
              image: 'https://images.pexels.com/photos/4523184/pexels-photo-4523184.jpeg',
              finalBid: 67,
              marketPrice: 1870,
              winner: 'Sarah Storm',
              bidders: 38,
              savings: 635,
              endedAgo: '5 hours ago'
            }
          ];
          setAuctions(fallbackData);
        }
      } catch (err: any) {
        console.error('Error fetching concluded auctions:', err);
        setError(null); // Don't show error, show fallback data instead
        
        // Fallback data when there's an error
        const fallbackData = [
          {
            id: 'demo-1',
            title: 'MacBook Pro 16"',
            image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
            finalBid: 89,
            marketPrice: 9370,
            winner: 'Alex Thunder',
            bidders: 45,
            savings: 6035,
            endedAgo: '2 hours ago'
          },
          {
            id: 'demo-2',
            title: 'PlayStation 5',
            image: 'https://images.pexels.com/photos/4523184/pexels-photo-4523184.jpeg',
            finalBid: 67,
            marketPrice: 1870,
            winner: 'Sarah Storm',
            bidders: 38,
            savings: 635,
            endedAgo: '5 hours ago'
          }
        ];
        setAuctions(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchConcludedAuctions();

    // WebSocket event listeners for real-time updates
    const handleAuctionCreated = (data: any) => {
      console.log('🆕 New auction created (concluded view):', data);
      // Don't add to concluded auctions - they start as upcoming
    };

    const handleAuctionUpdated = (data: any) => {
      console.log('🔄 Auction updated (concluded view):', data);
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
      console.log('🗑️ Auction deleted (concluded view):', data);
      if (data.auctionId) {
        setAuctions(prev => prev.filter(auction => auction.id !== data.auctionId));
      }
    };

    const handleAuctionEnded = (data: any) => {
      console.log('🏁 Auction ended, adding to concluded:', data);
      if (data.auction && (data.auction.status === 'ended' || data.auction.status === 'completed')) {
        setAuctions(prev => {
          const exists = prev.find(auction => auction.id === data.auction.id);
          if (!exists) {
            return [data.auction, ...prev].slice(0, 6);
          }
          return prev;
        });
      }
    };

    const handleAuctionStatusChanged = (data: any) => {
      console.log('🔄 Auction status changed (concluded view):', data);
      if (data.auction.status === 'ended' || data.auction.status === 'completed') {
        // Add to concluded auctions if it became ended
        setAuctions(prev => {
          const exists = prev.find(auction => auction.id === data.auction.id);
          if (!exists) {
            return [data.auction, ...prev].slice(0, 6);
          }
          return prev;
        });
      } else {
        // Remove from concluded auctions if status changed to something else
        setAuctions(prev => prev.filter(auction => auction.id !== data.auction.id));
      }
    };

    // Subscribe to WebSocket events
    webSocketService.on('auction:created', handleAuctionCreated);
    webSocketService.on('auction:updated', handleAuctionUpdated);
    webSocketService.on('auction:deleted', handleAuctionDeleted);
    webSocketService.on('auction_ended', handleAuctionEnded);
    webSocketService.on('auction_status_changed', handleAuctionStatusChanged);

    // Cleanup function
    return () => {
      webSocketService.off('auction:created', handleAuctionCreated);
      webSocketService.off('auction:updated', handleAuctionUpdated);
      webSocketService.off('auction:deleted', handleAuctionDeleted);
      webSocketService.off('auction_ended', handleAuctionEnded);
      webSocketService.off('auction_status_changed', handleAuctionStatusChanged);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm animate-pulse">
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-xl"></div>
              <div className="flex-1">
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">خطأ في تحميل المزادات المنتهية</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد مزادات منتهية حالياً</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auctions.map((auction: any) => (
          <div key={auction.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm h-fit">
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
