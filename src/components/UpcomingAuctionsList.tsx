import React, { useState, useEffect } from 'react';
import { Clock, Users, Bell, BellRing } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

const upcomingAuctions = [
  {
    id: 1,
    title: 'iPad Pro 12.9"',
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    entryFee: 25,
    minWallet: 125,
    marketPrice: 1099,
    startsIn: 300, // 5 minutes
    expectedBidders: 35,
    category: 'Electronics',
    emoji: '📱'
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    entryFee: 12,
    minWallet: 60,
    marketPrice: 399,
    startsIn: 300, // 5 minutes
    expectedBidders: 22,
    category: 'Audio',
    emoji: '🎧'
  },
  {
    id: 3,
    title: 'MacBook Air M2',
    image: 'https://images.pexels.com/photos/18105/pexels-photo-18105.jpeg',
    entryFee: 35,
    minWallet: 175,
    marketPrice: 1199,
    startsIn: 300, // 5 minutes
    expectedBidders: 41,
    category: 'Computers',
    emoji: '💻'
  },
  {
    id: 4,
    title: 'Apple Watch Series 9',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    entryFee: 18,
    minWallet: 90,
    marketPrice: 429,
    startsIn: 300, // 5 minutes
    expectedBidders: 28,
    category: 'Wearables',
    emoji: '⌚'
  }
];

export const UpcomingAuctionsList: React.FC = () => {
  const { userCoins } = useAuction();
  const [notifications, setNotifications] = useState<Set<number>>(new Set());
  const [timeLefts, setTimeLefts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Initialize time lefts
    const initialTimes: { [key: number]: number } = {};
    upcomingAuctions.forEach(auction => {
      initialTimes[auction.id] = auction.startsIn;
    });
    setTimeLefts(initialTimes);

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
  }, []);

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