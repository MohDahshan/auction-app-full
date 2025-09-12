import React from 'react';
import { AuctionCard } from './AuctionCard';

const liveAuctions = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    currentBid: 45,
    marketPrice: 3750,
    timeLeft: 20,
    bidders: 24,
    entryFee: 20,
    minWallet: 100,
    description: 'Latest iPhone 15 Pro Max with 256GB storage in Titanium Blue',
    category: 'Electronics'
  },
  {
    id: 2,
    title: 'Nike Air Max 90',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    currentBid: 28,
    marketPrice: 450,
    timeLeft: 300,
    bidders: 18,
    entryFee: 15,
    minWallet: 75,
    description: 'Classic Nike Air Max 90 sneakers in premium white colorway',
    category: 'Fashion'
  },
  {
    id: 3,
    title: 'Gaming PC Build',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg',
    currentBid: 89,
    marketPrice: 2499,
    timeLeft: 300,
    bidders: 32,
    entryFee: 35,
    minWallet: 175,
    description: 'High-performance gaming PC with RTX 4070 and Intel i7 processor',
    category: 'Gaming'
  }
];

interface LiveAuctionsProps {
  onJoinAuction: (auction: any) => void;
}

export const LiveAuctions: React.FC<LiveAuctionsProps> = ({ onJoinAuction }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveAuctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} onJoinAuction={onJoinAuction} />
        ))}
    </div>
  );
};