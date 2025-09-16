import React, { useState, useEffect } from 'react';
import { Clock, Users, Bell, BellRing } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

export const UpcomingAuctionsList: React.FC = () => {
  const { 
    userCoins, 
    upcomingAuctions, 
    auctionCountdowns, 
    updateAuctionCountdown 
  } = useAuction();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Set<string>>(new Set());

  // Log upcoming auctions for debugging WebSocket updates
    count: upcomingAuctions.length,
    auctions: upcomingAuctions.map(a => ({
      id: a.id,
      title: a.title,
      bidders: a.bidders,
      entryFee: a.entryFee,
      countdown: auctionCountdowns[a.id]
    }))
  });

  useEffect(() => {
    // Data is loaded by AuctionContext, just set loading to false
    setLoading(false);
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

  const toggleNotification = (auctionId: string) => {
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
        const timeLeft = auctionCountdowns[auction.id] || 0;
        const canJoin = userCoins >= auction.minWallet;
        const isNotified = notifications.has(auction.id);
        const categoryEmoji = getCategoryEmoji(auction.category);
        
        return (
          <div key={auction.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="absolute top-1 right-1 text-lg">{categoryEmoji}</div>
                <div className="absolute -top-1 -left-1 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SOON
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span className={`font-medium ${timeLeft > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {timeLeft > 0 ? `Starts in ${formatTime(timeLeft)}` : 'Starting now!'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>~{auction.bidders || Math.floor(Math.random() * 50) + 10} expected</span>
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

            {timeLeft <= 300 && timeLeft > 0 && ( // Show when less than 5 minutes
              <div className="mt-3 bg-orange-100 border border-orange-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800 font-medium">
                    🚨 Starting very soon! Get ready to bid!
                  </span>
                </div>
              </div>
            )}

            {timeLeft === 0 && (
              <div className="mt-3 bg-green-100 border border-green-200 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    🚀 Auction is starting now! Moving to live auctions...
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
