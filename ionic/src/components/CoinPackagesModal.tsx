import React, { useState } from 'react';
import { X, Smartphone } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

interface CoinPackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  neededCoins: number;
  currentCoins: number;
}

export const CoinPackagesModal: React.FC<CoinPackagesModalProps> = ({ 
  isOpen, 
  onClose, 
  neededCoins, 
  currentCoins 
}) => {
  const { addCoins } = useAuction();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showApplePay, setShowApplePay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessedPurchase, setHasProcessedPurchase] = useState(false);

  const coinPackages = [
    { coins: 50, price: 70, popular: false },
    { coins: 100, price: 140, popular: true },
    { coins: 250, price: 280, popular: false },
    { coins: 500, price: 560, popular: false },
    { coins: 1000, price: 980, popular: false },
    { coins: 2500, price: 2100, popular: false },
  ];

  if (!isOpen) return null;

  const handlePackageSelect = (coins: number) => {
    // Prevent multiple selections during processing
    if (isProcessing || hasProcessedPurchase) return;
    
    setSelectedPackage(coins);
    setShowApplePay(true);
  };

  const handleApplePayPurchase = async () => {
    if (!selectedPackage) return;
    
    // Prevent multiple purchases
    if (hasProcessedPurchase || isProcessing) return;
    
    setIsProcessing(true);
    setHasProcessedPurchase(true);
    
    // Simulate Apple Pay processing
    setTimeout(() => {
      addCoins(selectedPackage);
      setIsProcessing(false);
      setShowApplePay(false);
      setSelectedPackage(null);
      onClose();
    }, 2000);
  };

  const selectedPackageData = coinPackages.find(pkg => pkg.coins === selectedPackage);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      {!showApplePay ? (
        <>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🪙</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Coin Package</h2>
            <p className="text-gray-600">
              You need {neededCoins} more coins to continue
            </p>
          </div>

          {/* Current Balance */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Current Balance</span>
              <span className="text-blue-900 font-bold">{currentCoins} 🪙</span>
            </div>
          </div>

          {/* Coin Packages */}
          <div className="grid grid-cols-2 gap-3">
            {coinPackages.map((pkg) => (
              <button
                key={pkg.coins}
                onClick={() => handlePackageSelect(pkg.coins)}
                className="relative p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{pkg.coins} 🪙</p>
                  <p className="text-lg font-bold text-green-600">SAR {pkg.price}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    SAR {(pkg.price / pkg.coins).toFixed(2)} per coin
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Apple Pay Screen */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apple Pay</h2>
            <p className="text-gray-600">
              Complete your purchase with Apple Pay
            </p>
          </div>

          {/* Purchase Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Package</span>
                <span className="font-bold">{selectedPackage} 🪙</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-bold">SAR {selectedPackageData?.price}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-600">SAR {selectedPackageData?.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Apple Pay Button */}
          <button
            onClick={handleApplePayPurchase}
            disabled={isProcessing}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Pay with</span>
                <svg className="w-12 h-6" viewBox="0 0 48 24" fill="currentColor">
                  <path d="M7.8 2.4c-.9 1.2-2.4 2.1-3.9 1.9-.2-1.5.4-3.1 1.3-4.1C6.1-.9 7.8-1.7 9.1-1.8c.1 1.6-.5 3.1-1.3 4.2zm1.1 1.8c-2.2-.1-4.1 1.2-5.1 1.2-1.1 0-2.7-1.2-4.5-1.1-2.3.1-4.4 1.3-5.6 3.4-2.4 4.2-.6 10.4 1.7 13.8 1.1 1.7 2.5 3.5 4.3 3.4 1.7-.1 2.4-1.1 4.5-1.1s2.7 1.1 4.5 1.1c1.9-.1 3.1-1.6 4.2-3.3 1.3-2 1.8-3.9 1.8-4-.1 0-3.5-1.3-3.5-5.2-.1-3.3 2.7-4.9 2.8-5-1.5-2.2-3.9-2.5-4.7-2.5z"/>
                </svg>
              </>
            )}
          </button>

          {/* Back Button */}
          <button
            onClick={() => {
              setShowApplePay(false);
              setSelectedPackage(null);
            }}
            className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to packages
          </button>
        </>
      )}
    </div>
  );
};