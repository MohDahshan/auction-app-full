import React from 'react';
import { Trophy, Clock, Users } from 'lucide-react';

const concludedAuctions = [
  {
    id: 1,
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
    id: 2,
    title: 'PlayStation 5',
    image: 'https://images.pexels.com/photos/4523184/pexels-photo-4523184.jpeg',
    finalBid: 67,
    marketPrice: 1870,
    winner: 'Sarah Storm',
    bidders: 38,
    savings: 635,
    endedAgo: '5 hours ago'
  },
  {
    id: 3,
    title: 'Apple Watch Ultra',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    finalBid: 52,
    marketPrice: 2995,
    winner: 'Mike Flash',
    bidders: 29,
    savings: 1045,
    endedAgo: '1 day ago'
  }
];

export const ConcludedAuctions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {concludedAuctions.map((auction) => (
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