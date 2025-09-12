import React from 'react';
import { Coins, Plus } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

interface WalletDisplayProps {
  onGoToPayment?: () => void;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ onGoToPayment }) => {
  const { userCoins } = useAuction();

  const handleAddCoins = () => {
    if (onGoToPayment) {
      onGoToPayment();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="bg-white rounded-full px-4 py-2 border border-gray-200 flex items-center space-x-2">
        <Coins className="w-5 h-5 text-yellow-500" />
        <span className="text-gray-900 font-bold">{userCoins}</span>
      </div>
      
      <button
        onClick={handleAddCoins}
        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-full p-2 text-white transition-all duration-200 transform hover:scale-110"
      >
        <Plus size={20} />
      </button>
    </div>
  );
};