import React, { useEffect, useState } from 'react';
import { Trophy, Gift, DollarSign, X } from 'lucide-react';

interface Auction {
  id: number;
  title: string;
  image: string;
  currentBid: number;
  marketPrice: number;
}

interface WinnerModalProps {
  auction: Auction;
  isWinner: boolean;
  onClose: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ auction, isWinner, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isWinner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isWinner]);

  if (!isWinner) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Ended</h2>
          <p className="text-gray-600 mb-6">Better luck next time! Keep bidding to improve your chances.</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-bounce-in">
        {/* Close Button */}
        <button
          onClick={onClose}
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
          <Trophy size={40} className="text-white celebration-pulse" />
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-2 celebration-pulse">🎉 You Won!</h2>
        <p className="text-gray-600 mb-6">Congratulations! You've won the {auction.title}</p>

        <img
          src={auction.image}
          alt={auction.title}
          className="w-32 h-32 object-cover rounded-xl mx-auto mb-6"
        />

        <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4 celebration-pulse">
          <p className="text-green-800 font-bold text-lg">🎁 Congratulations!</p>
          <p className="text-green-700 text-sm">You won the {auction.title}!</p>
          <p className="text-green-700 text-sm">The product will be shipped to you.</p>
          <p className="text-green-600 text-base font-bold mt-2">
            🎊 You saved SAR {auction.marketPrice - (auction.currentBid * 10)}!
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Final Bid</p>
              <p className="font-bold text-gray-900">SAR {auction.currentBid}</p>
            </div>
            <div>
              <p className="text-gray-600">Market Price</p>
              <p className="font-bold text-gray-900">SAR {auction.marketPrice}</p>
            </div>
            <div>
              <p className="text-gray-600">You Saved</p>
              <p className="font-bold text-green-600">SAR {auction.marketPrice - (auction.currentBid * 10)}</p>
            </div>
          </div>
        </div>
        </div>

        {/* Moving Fireworks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="firework" />
          ))}
        </div>
      </div>

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
    </div>
  );
};