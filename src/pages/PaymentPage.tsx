import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Shield, Check, X } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

interface PaymentPageProps {
  onBack: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ onBack }) => {
  const { addCoins, userCoins } = useAuction();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'apple' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const coinPackages = [
    { coins: 50, price: 70, popular: false },
    { coins: 100, price: 140, popular: true },
    { coins: 250, price: 280, popular: false },
    { coins: 500, price: 560, popular: false },
    { coins: 1000, price: 980, popular: false },
    { coins: 2500, price: 2100, popular: false },
  ];

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'paypal', name: 'PayPal', icon: Wallet, description: 'Pay with your PayPal account' },
    { id: 'apple', name: 'Apple Pay', icon: Smartphone, description: 'Touch ID or Face ID' },
  ];

  const handlePurchase = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      addCoins(selectedAmount);
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto close success modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 3000);
    }, 2000);
  };

  const selectedPackage = coinPackages.find(pkg => pkg.coins === selectedAmount);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add Credits</h1>
            <p className="text-gray-600 text-sm">Purchase coins to join auctions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Balance */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-white">{userCoins} 🪙</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Coin Packages */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Coin Package</h2>
          <div className="grid grid-cols-2 gap-3">
            {coinPackages.map((pkg) => (
              <button
                key={pkg.coins}
                onClick={() => setSelectedAmount(pkg.coins)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedAmount === pkg.coins
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{pkg.coins} 🪙</p>
                  <p className="text-lg font-bold text-green-600">SAR {pkg.price}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    SAR {(pkg.price / pkg.coins).toFixed(2)} per coin
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id as any)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <method.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Secure Payment</p>
              <p className="text-green-700 text-sm">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>

        {/* Purchase Summary & Button */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Purchase Summary</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Coins</span>
              <span className="font-bold text-gray-900">{selectedAmount} 🪙</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price</span>
              <span className="font-bold text-gray-900">SAR {selectedPackage?.price}</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">SAR {selectedPackage?.price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={!selectedMethod || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
              selectedMethod && !isProcessing
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Purchase ${selectedAmount} Coins for SAR ${selectedPackage?.price}`
            )}
          </button>

          {!selectedMethod && (
            <p className="text-red-500 text-sm text-center mt-2">
              Please select a payment method
            </p>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              {selectedAmount} coins have been added to your wallet
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-800 font-bold">
                New Balance: {userCoins + selectedAmount} 🪙
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              Redirecting you back to profile...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};