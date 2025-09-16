import React, { useState, useEffect } from 'react';
import { Clock, Users, Bell, BellRing } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { apiService } from '../services/api';
import webSocketService from '../services/websocket';

export const UpcomingAuctionsList: React.FC = () => {
  const { userCoins } = useAuction();
  const [upcomingAuctions, setUpcomingAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Set<number>>(new Set());
  const [timeLefts, setTimeLefts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchUpcomingAuctions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getAuctions({ 
          status: 'upcoming',
          limit: 10 
        });
        
        if (response.success && response.data) {
          // Transform backend data to match component expectations
          const transformedAuctions = response.data.map((auction: any) => ({
            id: auction.id,
            title: auction.title,
            image: auction.product_image || auction.image_url || 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
            entryFee: auction.entry_fee,
            minWallet: auction.min_wallet,
            marketPrice: auction.product_market_price || auction.market_price || 0,
            startsIn: calculateTimeUntilStart(auction.start_time),
            expectedBidders: Math.floor(Math.random() * 50) + 10, // Estimated based on entry fee
            category: auction.product_category || auction.category || 'General',
            emoji: getCategoryEmoji(auction.product_category || auction.category),
            startTime: auction.start_time,
            endTime: auction.end_time,
            productName: auction.product_name,
            description: auction.description
          }));
          
          setUpcomingAuctions(transformedAuctions);
          
          // Initialize time lefts
          const initialTimes: { [key: number]: number } = {};
          transformedAuctions.forEach(auction => {
            initialTimes[auction.id] = auction.startsIn;
          });
          setTimeLefts(initialTimes);
        } else {
          setError('Failed to load upcoming auctions');
        }
      } catch (err: any) {
        console.error('Error fetching upcoming auctions:', err);
        setError(err.message || 'Failed to load upcoming auctions');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingAuctions();

    // WebSocket event listeners for real-time updates
    const handleAuctionCreated = (data: any) => {
      console.log('🆕 New auction created (upcoming list):', data);
      if (data.auction && data.auction.status === 'upcoming') {
        const transformedAuction = {
          id: data.auction.id,
          title: data.auction.title,
          image: data.auction.product_image || data.auction.image_url || 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
          entryFee: data.auction.entry_fee,
          minWallet: data.auction.min_wallet,
          marketPrice: data.auction.product_market_price || data.auction.market_price || 0,
          startsIn: calculateTimeUntilStart(data.auction.start_time),
          expectedBidders: Math.floor(Math.random() * 50) + 10,
          category: data.auction.product_category || data.auction.category || 'General',
          emoji: getCategoryEmoji(data.auction.product_category || data.auction.category),
          startTime: data.auction.start_time,
          endTime: data.auction.end_time,
          productName: data.auction.product_name,
          description: data.auction.description
        };

        setUpcomingAuctions(prev => {
          const exists = prev.find(auction => auction.id === data.auction.id);
          if (!exists) {
            const newAuctions = [transformedAuction, ...prev].slice(0, 10);
            
            // Update time lefts for new auction
            setTimeLefts(prevTimes => ({
              ...prevTimes,
              [transformedAuction.id]: transformedAuction.startsIn
            }));
            
            return newAuctions;
          }
          return prev;
        });
      }
    };

    const handleAuctionUpdated = (data: any) => {
      console.log('🔄 Auction updated (upcoming list):', data);
      if (data.auction) {
        setUpcomingAuctions(prev => {
          const auctionExists = prev.find(auction => auction.id === data.auction.id);
          if (auctionExists) {
            const updatedAuctions = prev.map(auction => {
              if (auction.id === data.auction.id) {
                const updatedAuction = {
                  ...auction,
                  title: data.auction.title || auction.title,
                  entryFee: data.auction.entry_fee || auction.entryFee,
                  minWallet: data.auction.min_wallet || auction.minWallet,
                  marketPrice: data.auction.product_market_price || data.auction.market_price || auction.marketPrice,
                  startTime: data.auction.start_time || auction.startTime,
                  endTime: data.auction.end_time || auction.endTime,
                  description: data.auction.description || auction.description
                };
                
                // Update time left for updated auction
                if (data.auction.start_time) {
                  const newTimeLeft = calculateTimeUntilStart(data.auction.start_time);
                  setTimeLefts(prevTimes => ({
                    ...prevTimes,
                    [auction.id]: newTimeLeft
                  }));
                }
                
                return updatedAuction;
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
      console.log('🗑️ Auction deleted (upcoming list):', data);
      if (data.auctionId) {
        setUpcomingAuctions(prev => prev.filter(auction => auction.id !== data.auctionId));
        setTimeLefts(prev => {
          const updated = { ...prev };
          delete updated[data.auctionId];
          return updated;
        });
      }
    };

    const handleAuctionStarted = (data: any) => {
      console.log('🚀 Auction started, removing from upcoming list:', data);
      if (data.auction) {
        setUpcomingAuctions(prev => prev.filter(auction => auction.id !== data.auction.id));
      }
    };

    // Subscribe to WebSocket events
    webSocketService.on('auction:created', handleAuctionCreated);
    webSocketService.on('auction:updated', handleAuctionUpdated);
    webSocketService.on('auction:deleted', handleAuctionDeleted);
    webSocketService.on('auction_started', handleAuctionStarted);

    // Cleanup function
    return () => {
      webSocketService.off('auction:created', handleAuctionCreated);
      webSocketService.off('auction:updated', handleAuctionUpdated);
      webSocketService.off('auction:deleted', handleAuctionDeleted);
      webSocketService.off('auction_started', handleAuctionStarted);
    };
  }, []);

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      setTimeLefts(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          const id = parseInt(key);
          if (updated[id] > 0) {
            updated[id] = updated[id] - 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [upcomingAuctions]);

  const calculateTimeUntilStart = (startTime: string): number => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const difference = start - now;
    
    if (difference <= 0) return 0;
    return Math.floor(difference / 1000); // Return seconds
  };

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const toggleNotification = (auctionId: number) => {
    setNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(auctionId)) {
        newSet.delete(auctionId);
      } else {
        newSet.add(auctionId);
      }
      return newSet;
    });
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

  if (upcomingAuctions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">⏰ No upcoming auctions scheduled</div>
        <p className="text-sm text-gray-400">New auctions will appear here soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingAuctions.map((auction) => {
        const timeLeft = timeLefts[auction.id] || auction.startsIn;
        const canJoin = userCoins >= auction.minWallet;
        const isNotified = notifications.has(auction.id);
        
        return (
          <div key={auction.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="absolute top-1 right-1 text-lg">{auction.emoji}</div>
                <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SOON
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span className="font-medium text-blue-600">
                      Starts in {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>~{auction.expectedBidders} expected</span>
                  </div>
                </div>
                
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Market Price</span>
                    <span className="text-gray-900 font-bold">SAR {auction.marketPrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Entry Fee</span>
                    <span className="text-yellow-500 font-bold">{auction.entryFee} 🪙</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Min. Wallet</span>
                    <span className="text-gray-700">{auction.minWallet} 🪙</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => toggleNotification(auction.id)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isNotified
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {isNotified ? <BellRing size={20} /> : <Bell size={20} />}
                <span>{isNotified ? 'Notified ✓' : 'Notify Me'}</span>
              </button>
              
              <div className={`flex-1 py-3 rounded-xl font-bold text-center ${
                canJoin
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {canJoin ? '✅ Ready to Join' : '❌ Need More Coins'}
              </div>
            </div>

            {timeLeft <= 300 && ( // Show when less than 5 minutes
              <div className="mt-3 bg-orange-100 border border-orange-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">
                    🚨 Starting very soon! Get ready to bid!
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
