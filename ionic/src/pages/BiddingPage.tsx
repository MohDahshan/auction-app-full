import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Coins, Trophy, Target, TrendingUp, X } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { WalletDisplay } from '../components/WalletDisplay';
import { CoinPackagesModal } from '../components/CoinPackagesModal';

interface Auction {
  id: number;
  title: string;
  image: string;
  currentBid: number;
  marketPrice: number;
  timeLeft: number;
  bidders: number;
  entryFee: number;
  minWallet: number;
  description: string;
  category: string;
}

interface Bidder {
  id: number;
  name: string;
  avatar: string;
  bid: number;
  timestamp: string;
  isCurrentUser?: boolean;
}

interface BiddingPageProps {
  auction: Auction;
  onBack: () => void;
}

export const BiddingPage: React.FC<BiddingPageProps> = ({ auction, onBack }) => {
  const { 
    userCoins, 
    placeBid, 
    isLoggedIn, 
    joinAuction, 
    isParticipatingInAuction, 
    getUserBidForAuction, 
    userProfile 
  } = useAuction();
  
  // Initialize timer from localStorage or auction.timeLeft
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimer = localStorage.getItem(`auction_${auction.id}_timer`);
    const savedTimestamp = localStorage.getItem(`auction_${auction.id}_timestamp`);
    
    if (savedTimer && savedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remaining = parseInt(savedTimer) - elapsed;
      return Math.max(0, remaining);
    }
    
    return auction.timeLeft;
  });
  
  const userTotalBid = getUserBidForAuction(auction.id);
  const isParticipating = isParticipatingInAuction(auction.id);
  
  // Initialize bidders
  const [bidders, setBidders] = useState<Bidder[]>(() => {
    // Dynamic bidders based on auction's current bid - make it higher for gaming PC
    const baseBid = auction.id === 3 ? 122 : Math.max(45, auction.currentBid || 45);
    const initialBidders = [
      { id: 1, name: 'Alex Thunder', avatar: 'AT', bid: baseBid, timestamp: '2 min ago' },
      { id: 2, name: 'Sarah Storm', avatar: 'SS', bid: baseBid - 2, timestamp: '5 min ago' },
      { id: 3, name: 'Mike Flash', avatar: 'MF', bid: baseBid - 4, timestamp: '8 min ago' },
      { id: 4, name: 'Emma Spark', avatar: 'ES', bid: baseBid - 6, timestamp: '12 min ago' },
    ];

    // Add user's bid if they have one
    if (userTotalBid > 0 && isParticipating) {
      // User's bid should be higher than the current highest to be winning
      const userBidAmount = Math.max(userTotalBid, baseBid + 2);
      const userBidder: Bidder = {
        id: 999,
        name: userProfile.name || 'You',
        avatar: userProfile.avatar || 'YOU',
        bid: userBidAmount,
        timestamp: `Your bid`,
        isCurrentUser: true
      };
      
      return [...initialBidders, userBidder].sort((a, b) => b.bid - a.bid);
    }
    
    return initialBidders;
  });

  // Get the actual highest bid from the leaderboard
  const currentHighestBid = bidders.length > 0 ? bidders[0].bid : 45;
  const currentBidSAR = currentHighestBid;
  const isUserHighestBidder = bidders.length > 0 && bidders[0].isCurrentUser;
  
  // Update bidders when user bid changes
  useEffect(() => {
    if (userTotalBid > 0 && isParticipating) {
      setBidders(prev => {
        const withoutUser = prev.filter(b => !b.isCurrentUser);
        // Find the current highest non-user bid
        const highestOtherBid = withoutUser.length > 0 ? withoutUser[0].bid : 45;
        // User's bid should be higher to be winning
        const userBidAmount = Math.max(userTotalBid, highestOtherBid + 2);
        const userBidder: Bidder = {
          id: 999,
          name: userProfile.name || 'You',
          avatar: userProfile.avatar || 'YOU',
          bid: userBidAmount,
          timestamp: `Your bid`,
          isCurrentUser: true
        };
        
        return [...withoutUser, userBidder].sort((a, b) => b.bid - a.bid);
      });
    }
  }, [userTotalBid, isParticipating, userProfile]);

  useEffect(() => {
    // Save initial timer state
    localStorage.setItem(`auction_${auction.id}_timer`, timeLeft.toString());
    localStorage.setItem(`auction_${auction.id}_timestamp`, Date.now().toString());
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Clear timer data when auction ends
          localStorage.removeItem(`auction_${auction.id}_timer`);
          localStorage.removeItem(`auction_${auction.id}_timestamp`);
          
          // Determine winner and show announcement
          const winner = bidders.length > 0 ? bidders[0] : null;
          setAuctionWinner(winner);
          
          // Only show winner announcement once per auction
          if (!hasShownWinnerAnnouncement) {
            setShowWinnerAnnouncement(true);
            setHasShownWinnerAnnouncement(true);
            localStorage.setItem(`winner_announcement_shown_${auction.id}`, 'true');
          }
          
          return 0;
        }
        const newTime = prev - 1;
        // Update localStorage with current time
        localStorage.setItem(`auction_${auction.id}_timer`, newTime.toString());
        localStorage.setItem(`auction_${auction.id}_timestamp`, Date.now().toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.id, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinAuction = () => {
    console.log('🎯 BiddingPage: Join auction clicked');
   
   // Check if user has enough coins for entry fee
   if (userCoins < auction.entryFee) {
     console.log('❌ Not enough coins for entry fee, showing top-up modal');
     setShowTopupModal(true);
     return;
   }
   
    joinAuction(auction.id, auction.entryFee);
  };

  const handlePlaceBid = () => {
    console.log('🎯 BiddingPage: Place bid clicked');
    
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

  const canJoin = userCoins >= auction.entryFee;
  const nextBidAmount = currentHighestBid + 2; // Always 2 SAR higher than current highest
  const canBid = isParticipating && timeLeft > 0 && !isUserHighestBidder;
  const profitPotential = auction.marketPrice - (currentBidSAR * 10);
  
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);
  const [auctionWinner, setAuctionWinner] = useState<Bidder | null>(null);
  const [hasShownWinnerAnnouncement, setHasShownWinnerAnnouncement] = useState(() => {
    return localStorage.getItem(`winner_announcement_shown_${auction.id}`) === 'true';
  });

  const handleCloseWinnerPopup = () => {
    setShowWinnerAnnouncement(false);
    // Ensure it's marked as shown
    localStorage.setItem(`winner_announcement_shown_${auction.id}`, 'true');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Live Auction</h1>
              <p className="text-gray-600 text-sm">{auction.category}</p>
            </div>
          </div>
          <WalletDisplay />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Auction Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex space-x-4 mb-4">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{auction.title}</h2>
                <p className="text-gray-600 text-sm mb-3">{auction.description || 'Premium quality product at an unbeatable auction price.'}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                      <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{bidders.length} bidders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-600 text-sm">Current Bid</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">SAR {currentBidSAR}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 text-sm">Market Price</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">SAR {auction.marketPrice}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 text-sm">Potential Saving</span>
                </div>
                <p className="text-2xl font-bold text-green-600">+SAR {profitPotential}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Coins className="w-5 h-5 text-purple-500" />
                  <span className="text-gray-600 text-sm">Entry Fee</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{auction.entryFee} 🪙</p>
              </div>
            </div>

            {/* Timer Above Button */}
            <div className="text-center mb-4">
              <div className="w-full bg-white border-2 border-red-500 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-center space-x-3">
                  <Clock className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Time Remaining</div>
                    <div className="text-2xl font-bold text-red-500">{formatTime(timeLeft)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isParticipating ? (
              <button
                onClick={handleJoinAuction}
               disabled={timeLeft === 0}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                 timeLeft > 0
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
               {timeLeft === 0 ? 'Auction Ended' : `Join Auction (${auction.entryFee} coins)`}
              </button>
            ) : (
              <div className="space-y-3">              
                <button
                  onClick={handlePlaceBid}
                  disabled={timeLeft === 0 || isUserHighestBidder}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 text-lg ${
                    timeLeft > 0 && !isUserHighestBidder
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 animate-pulse'
                      : timeLeft === 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {timeLeft === 0 
                    ? 'Auction Ended' 
                    : isUserHighestBidder 
                    ? 'You\'re Currently Winning! 🏆' 
                    : `Bid SAR ${nextBidAmount} (Become Highest)`
                  }
                </button>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                  {isUserHighestBidder ? (
                    <p className="text-yellow-800 text-sm font-medium">
                      🏆 You're currently winning! Wait for others to bid, then outbid them to stay ahead.
                    </p>
                  ) : (
                    <p className="text-green-800 text-sm font-medium">
                      ✅ You're participating in this auction! Place bids to increase your chances of winning.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Bid Leaderboard */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-900">Bid Leaderboard</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {bidders.length} bidders
              </span>
            </div>

            <div className="space-y-3">
              {bidders.map((bidder, index) => (
                <div
                  key={bidder.id}
                  className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 ${
                    bidder.isCurrentUser
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-400'
                      : index === 0
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  } hover:scale-[1.02]`}
                >
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0
                      ? 'bg-yellow-400 text-white'
                      : index === 1
                      ? 'bg-gray-300 text-white'
                      : index === 2
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index === 0 ? '👑' : index + 1}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    bidder.isCurrentUser
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
                  }`}>
                    {bidder.avatar}
                  </div>

                  {/* Bidder Info */}
                  <div className="flex-1">
                    <p className={`font-bold ${
                      bidder.isCurrentUser ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {bidder.name}
                      {index === 0 && <span className="ml-2 text-yellow-500">🏆</span>}
                    </p>
                    <p className="text-gray-600 text-sm">{bidder.timestamp}</p>
                  </div>

                  {/* Bid Amount */}
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      index === 0 ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      SAR {bidder.bid}
                    </p>
                    {index === 0 && (
                      <p className="text-green-600 text-xs font-medium">Leading</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {bidders.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No bids yet. Be the first to bid!</p>
              </div>
            )}
          </div>
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

      {/* Winner Announcement Modal */}
      {showWinnerAnnouncement && auctionWinner && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={handleCloseWinnerPopup}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="confetti absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Trophy className="w-10 h-10 text-white celebration-pulse" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-2 celebration-pulse">🎉 Auction Ended!</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    auctionWinner.isCurrentUser
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
                  }`}>
                    {auctionWinner.avatar}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-yellow-800">
                      {auctionWinner.isCurrentUser ? 'YOU WON!' : `${auctionWinner.name} Won!`}
                    </p>
                    <p className="text-yellow-700 font-semibold">Final Bid: SAR {auctionWinner.bid}</p>
                  </div>
                </div>
                
                {auctionWinner.isCurrentUser && (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mt-3 celebration-pulse">
                    <p className="text-green-800 font-bold text-lg">🎁 Congratulations!</p>
                    <p className="text-green-700 text-sm">You won the {auction.title}!</p>
                    <p className="text-green-700 text-sm">The product will be shipped to you.</p>
                    <p className="text-green-600 text-base font-bold mt-2">
                      🎊 You saved SAR {auction.marketPrice - (auctionWinner.bid * 10)}!
                    </p>
                  </div>
                )}
                
                {!auctionWinner.isCurrentUser && (
                  <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mt-3">
                    <p className="text-blue-800 font-medium">Better luck next time!</p>
                    <p className="text-blue-700 text-sm">Keep bidding to improve your chances of winning.</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Final Bid</p>
                    <p className="font-bold text-gray-900">SAR {auctionWinner.bid}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Market Price</p>
                    <p className="font-bold text-gray-900">SAR {auction.marketPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Bidders</p>
                    <p className="font-bold text-gray-900">{bidders.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Winner Saved</p>
                    <p className="font-bold text-green-600">
                      {auctionWinner.isCurrentUser 
                        ? `You saved SAR ${auction.marketPrice - (auctionWinner.bid * 10)}`
                        : `SAR ${auction.marketPrice - (auctionWinner.bid * 10)}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Fireworks Animation */}
            <style jsx>{`
              .firework {
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                animation: firework 2s ease-out infinite;
              }
              
              .firework:nth-child(1) { 
                background: #ff6b6b; 
                left: 10%; 
                animation-delay: 0s;
                animation-duration: 2.5s;
              }
              .firework:nth-child(2) { 
                background: #4ecdc4; 
                left: 20%; 
                animation-delay: 0.3s;
                animation-duration: 2.8s;
              }
              .firework:nth-child(3) { 
                background: #45b7d1; 
                left: 30%; 
                animation-delay: 0.6s;
                animation-duration: 2.2s;
              }
              .firework:nth-child(4) { 
                background: #f9ca24; 
                left: 40%; 
                animation-delay: 0.9s;
                animation-duration: 2.7s;
              }
              .firework:nth-child(5) { 
                background: #6c5ce7; 
                left: 50%; 
                animation-delay: 1.2s;
                animation-duration: 2.4s;
              }
              .firework:nth-child(6) { 
                background: #a29bfe; 
                left: 60%; 
                animation-delay: 0.2s;
                animation-duration: 2.6s;
              }
              .firework:nth-child(7) { 
                background: #fd79a8; 
                left: 70%; 
                animation-delay: 0.5s;
                animation-duration: 2.3s;
              }
              .firework:nth-child(8) { 
                background: #00b894; 
                left: 80%; 
                animation-delay: 0.8s;
                animation-duration: 2.9s;
              }
              .firework:nth-child(9) { 
                background: #e17055; 
                left: 90%; 
                animation-delay: 1.1s;
                animation-duration: 2.1s;
              }
              .firework:nth-child(10) { 
                background: #fdcb6e; 
                left: 15%; 
                animation-delay: 1.4s;
                animation-duration: 2.8s;
              }
              
              @keyframes firework {
                0% {
                  transform: translateY(100vh) scale(0);
                  opacity: 1;
                }
                15% {
                  transform: translateY(50vh) scale(1);
                  opacity: 1;
                }
                30% {
                  transform: translateY(30vh) scale(1.2);
                  opacity: 1;
                }
                50% {
                  transform: translateY(20vh) scale(0.8);
                  opacity: 0.8;
                  box-shadow: 0 0 20px currentColor;
                }
                70% {
                  transform: translateY(10vh) scale(1.5);
                  opacity: 0.6;
                  box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
                }
                100% {
                  transform: translateY(-10vh) scale(0);
                  opacity: 0;
                  box-shadow: 0 0 50px currentColor;
                }
              }
              
              .celebration-pulse {
                animation: celebration-pulse 1.5s ease-in-out infinite;
              }
              
              @keyframes celebration-pulse {
                0%, 100% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(1.1);
                }
              }
            `}</style>

            {/* Moving Fireworks */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="firework" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};