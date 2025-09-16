import React from 'react';
import { AlertTriangle, X, Coins, Smartphone } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { CoinPackagesModal } from './CoinPackagesModal';

interface OutbidNotificationModalProps {
  isOpen: boolean;
  auctionId: number;
  auctionTitle: string;
  auctionImage: string;
  outbidBy: string;
  newBid: number;
  onClose: () => void;
  onBidHigher: () => void;
}

export const OutbidNotificationModal: React.FC<OutbidNotificationModalProps> = ({
  isOpen,
  auctionId,
  auctionTitle,
  auctionImage,
  outbidBy,
  newBid,
  onClose,
  onBidHigher
}) => {
  const { userCoins, getUserBidForAuction, addCoins, placeBid, isParticipatingInAuction } = useAuction();
  const [showTopupModal, setShowTopupModal] = React.useState(false);
  const [pendingBid, setPendingBid] = React.useState<number | null>(null);
  
  if (!isOpen) return null;

  const userCurrentBid = getUserBidForAuction(auctionId);
  const nextBidAmount = Math.max(newBid + 2, userCurrentBid + 2);
  const canAffordBid = userCoins >= nextBidAmount;
  const isParticipating = isParticipatingInAuction(auctionId);

  const handleBidClick = () => {
    if (!isParticipating) {
      return;
    }
    
    if (userCoins >= nextBidAmount) {
      // Place the bid and go to bidding page
      const success = placeBid(auctionId, nextBidAmount);
      if (success) {
        onBidHigher();
      }
    } else {
      setPendingBid(nextBidAmount);
      setShowTopupModal(true);
    }
  };

  const handleTopupComplete = () => {
    setShowTopupModal(false);
    if (pendingBid) {
      // Place the bid automatically after top-up
      const success = placeBid(auctionId, pendingBid);
      setPendingBid(null);
      if (success) {
        onBidHigher(); // Navigate to bidding page
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl max-w-md w-full relative animate-bounce-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

        {/* Alert Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">You've Been Outbid!</h2>
        <p className="text-gray-600 text-center mb-4">
          Someone just outbid you in this auction
        </p>

        {/* Auction Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={auctionImage}
              alt={auctionTitle}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-bold text-gray-900">{auctionTitle}</h3>
              <p className="text-gray-600 text-sm">Live Auction</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-600">Your Previous Bid</span>
              <span className="font-bold text-blue-900">{userCurrentBid} 🪙</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">{outbidBy}'s Bid</span>
              <span className="font-bold text-red-600">{newBid} 🪙</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <span className="text-green-600">To Regain Lead</span>
                <span className="font-bold text-green-600">{nextBidAmount} 🪙</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">Your Wallet</span>
            </div>
            <span className="text-blue-900 font-bold">{userCoins} 🪙</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBidClick}
            disabled={!isParticipating}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${
              isParticipating
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {!isParticipating
              ? 'Not Participating in Auction'
              : userCoins >= nextBidAmount 
              ? `Bid ${nextBidAmount} Coins to Regain Lead 🚀`
              : `Top Up & Bid ${nextBidAmount} Coins 💳`
            }
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Maybe Later
          </button>
        </div>

          {!canAffordBid && isParticipating && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-blue-800 text-sm font-medium text-center">
                💡 You need {nextBidAmount - userCoins} more coins. Tap above to top up & bid!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top-up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => {
                setShowTopupModal(false);
                setPendingBid(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Up to Bid Higher</h2>
              <p className="text-gray-600">
                You need {(pendingBid || nextBidAmount) - userCoins} more coins to outbid {outbidBy}
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-700">Current Balance</span>
                <span className="text-orange-900 font-bold">{userCoins} coins</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-700">Needed for Bid</span>
                <span className="text-orange-900 font-bold">{pendingBid || nextBidAmount} coins</span>
              </div>
              <div className="border-t border-orange-300 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-orange-800 font-medium">Need to Add</span>
                  <span className="text-red-600 font-bold">{(pendingBid || nextBidAmount) - userCoins} coins</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { coins: 50, price: 70 },
                { coins: 100, price: 140 },
                { coins: 250, price: 280 },
                { coins: 500, price: 560 }
              ].map((pkg) => (
                <button
                  key={pkg.coins}
                  onClick={() => {
                    addCoins(pkg.coins);
                    handleTopupComplete();
                  }}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{pkg.coins} 🪙</p>
                    <p className="text-sm font-bold text-green-600">SAR {pkg.price}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-green-800 text-sm font-medium text-center">
                🎯 After purchase, we'll automatically place your bid of {pendingBid || nextBidAmount} coins!
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </>
  );
};
