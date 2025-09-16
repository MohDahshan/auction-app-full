import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsGraph: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState(450);
  const marketPrice = 999;

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 20;
        const newPrice = Math.max(400, Math.min(800, prev + change));
        setDataPoints(prevPoints => [...prevPoints.slice(-19), newPrice]);
        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const priceChange = currentPrice - marketPrice;
  const priceChangePercent = ((currentPrice / marketPrice) * 100 - 100).toFixed(1);

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Market Analysis</h3>
        <div className="flex items-center space-x-2">
          {priceChange >= 0 ? (
            <TrendingUp className="w-5 h-5 text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
          <span className={`font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChangePercent}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Bid Level</span>
          <span className="text-2xl font-bold text-blue-400">SAR {currentPrice}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Market Price</span>
          <span className="text-gray-900">SAR {marketPrice}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Potential Savings</span>
          <span className="text-green-400 font-bold">SAR {marketPrice - currentPrice}</span>
        </div>
      </div>

      {/* Simple visual graph representation */}
      <div className="mt-4 h-20 bg-gray-100 rounded-lg p-2 flex items-end space-x-1">
        {dataPoints.map((point, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm flex-1 transition-all duration-500"
            style={{ height: `${(point / marketPrice) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
};