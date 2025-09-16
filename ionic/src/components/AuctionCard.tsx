import React, { useState, useEffect } from 'react';
import { Clock, Users, Coins } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { CoinPackagesModal } from './CoinPackagesModal';

interface Auction {
  id: string | number; // Support both UUID strings and numbers
  title: string;
  image: string;
  currentBid: number;
  marketPrice: number;
  timeLeft: number;
  bidders: number;
  entryFee: number;
  minWallet: number;
}

interface AuctionCardProps {
  auction: Auction;
  onJoinAuction?: (auction: Auction) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onJoinAuction }) => {
  const { 
    placeBid, 
    userCoins, 
    joinAuction, 
    isParticipatingInAuction, 
    getUserBidForAuction,
    isLoggedIn,
    liveAuctions,
    upcomingAuctions,
    endedAuctions
  } = useAuction();
  
  // Get fresh auction data from context (updated via WebSocket)
  // Handle both string and number IDs
  const auctionIdStr = auction.id.toString();
  const freshAuction =
    liveAuctions.find(a => a.id === auctionIdStr) ||
    upcomingAuctions.find(a => a.id === auctionIdStr) ||
    endedAuctions.find(a => a.id === auctionIdStr) ||
    auction;

  // Log fresh auction data for debugging WebSocket updates
  console.log('🔄 AuctionCard render - Fresh auction data:', {
    auctionId: auction.id,
    auctionIdStr: auctionIdStr,
    originalBid: auction.currentBid,
    freshBid: freshAuction.currentBid,
    originalBidders: auction.bidders,
    freshBidders: freshAuction.bidders,
    originalTimeLeft: auction.timeLeft,
    freshTimeLeft: freshAuction.timeLeft,
    foundInContext: freshAuction !== auction,
    freshAuctionObject: freshAuction,
    originalAuctionObject: auction,
    contextIds: {
      live: liveAuctions.map(a => ({ id: a.id, bid: a.currentBid, bidders: a.bidders })),
      upcoming: upcomingAuctions.map(a => ({ id: a.id, bid: a.currentBid, bidders: a.bidders })),
      ended: endedAuctions.map(a => ({ id: a.id, bid: a.currentBid, bidders: a.bidders }))
    }
  });
  
  // Use timeLeft from fresh auction (updated via WebSocket)
  const [timeLeft, setTimeLeft] = useState(freshAuction.timeLeft || 0);
  
  const isParticipating = isParticipatingInAuction(auction.id);
  const userTotalBid = getUserBidForAuction(auction.id);
  
  // Use fresh auction data (updated via WebSocket)
  const othersHighestBid = freshAuction.currentBid || auction.currentBid;
  const displayBid = Math.max(othersHighestBid, userTotalBid);
  const isUserHighestBidder = userTotalBid > 0 && userTotalBid >= othersHighestBid;

  // Update timeLeft when fresh auction changes (from WebSocket updates)
  useEffect(() => {
    setTimeLeft(freshAuction.timeLeft || 0);
  }, [freshAuction.timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinAuction = () => {
    console.log('🎯 AuctionCard: Join auction clicked');
    
    if (!isLoggedIn) {
      console.log('❌ Not logged in, using onJoinAuction callback');
      if (onJoinAuction) {
        onJoinAuction(auction);
      }
      return;
    }
    
   // Check if user has enough coins for entry fee - use freshAuction for updated data
   if (userCoins < (freshAuction.entryFee || auction.entryFee)) {
     console.log('❌ Not enough coins for entry fee, showing top-up modal');
     setShowTopupModal(true);
     return;
   }
   
    if (onJoinAuction) {
      console.log('✅ Using onJoinAuction callback');
      onJoinAuction(auction);
    } else {
      console.log('✅ Joining auction directly');
      joinAuction(auction.id, auction.entryFee);
    }
  };

  const handlePlaceBid = () => {
    console.log('🎯 AuctionCard: Place bid clicked');
    
    if (!isLoggedIn) {
      console.log('❌ Not logged in');
      return;
    }
    
    if (!isParticipating) {
      console.log('❌ Not participating in auction');
      return;
    }
    
    if (timeLeft <= 0) {
      console.log('❌ Auction ended');
      return;
    }
    
    if (userCoins < nextBidAmount) {
      console.log('❌ Not enough coins, showing top-up modal');
      setShowTopupModal(true);
      return;
    }
    
    const success = placeBid(auction.id, nextBidAmount);
    console.log('🎯 Bid result:', success);
  };

  const canJoin = isLoggedIn && userCoins >= auction.entryFee;
  const nextBidAmount = Math.max(othersHighestBid, userTotalBid) + 2; // Always 2 higher than current highest
  const canBid = isLoggedIn && isParticipating && timeLeft > 0 && !isUserHighestBidder;
  const profitPotential = auction.marketPrice - (displayBid * 10);
  
  const [showTopupModal, setShowTopupModal] = useState(false);

  return (
    <>
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:bg-gray-100 transition-all duration-300 shadow-sm">
        <div className="flex space-x-4">
          <img
            src={auction.image}
            alt={auction.title}
            className="w-20 h-20 object-cover rounded-xl"
          />
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{auction.title}</h3>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{freshAuction.bidders || auction.bidders}</span>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Bid</span>
                <span className="text-2xl font-bold text-blue-600">{displayBid} 🪙</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Market Price</span>
                <span className="text-gray-900">SAR {auction.marketPrice}</span>
              </div>
              
              {userTotalBid > 0 && isParticipating && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-600">Your Total Bid</span>
                  <span className="text-blue-600 font-bold">{userTotalBid} 🪙</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Potential Saving</span>
                <span className="text-green-600 font-bold">+SAR {profitPotential}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Entry: {freshAuction.entryFee || auction.entryFee} coins</span>
            <span className="text-gray-600">Your wallet: {userCoins} coins</span>
          </div>
          
          {!isParticipating ? (
            <button
              onClick={handleJoinAuction}
              disabled={timeLeft === 0}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                timeLeft > 0
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
             {timeLeft === 0 ? 'Auction Ended' : `Join Auction (${freshAuction.entryFee || auction.entryFee} coins)`}
            </button>
          ) : (
            <div className="space-y-2">
              {onJoinAuction && (
                <button
                  onClick={() => onJoinAuction(auction)}
                  disabled={timeLeft === 0}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                    timeLeft > 0
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {timeLeft === 0 ? 'Auction Ended' : 'Enter Bidding Page 🎯'}
                </button>
              )}
              
              <button
                onClick={handlePlaceBid}
                disabled={timeLeft === 0 || isUserHighestBidder}
                className={`w-full py-2 rounded-xl font-bold text-white transition-all duration-200 ${
                  timeLeft > 0 && !isUserHighestBidder
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                {timeLeft === 0 
                  ? 'Auction Ended' 
                  : isUserHighestBidder
                  ? 'You\'re Highest Bidder! 🏆'
                  : `Bid SAR ${nextBidAmount} (Highest)`
                }
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top-up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <CoinPackagesModal 
            isOpen={showTopupModal}
            onClose={() => setShowTopupModal(false)}
            neededCoins={!isParticipating ? auction.entryFee - userCoins : nextBidAmount - userCoins}
            currentCoins={userCoins}
          />
        </div>
      )}

    </>
  );
};
