import React from 'react';
import { LiveAuctionsList } from '../components/LiveAuctionsList';
import { ConcludedAuctionsList } from '../components/ConcludedAuctionsList';
import { UpcomingAuctionsList } from '../components/UpcomingAuctionsList';
import { WalletDisplay } from '../components/WalletDisplay';
import { ProductList } from '../components/ProductList';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { useAuction } from '../context/AuctionContext';

interface HomePageProps {
  onJoinAuction: (auction: any) => void;
  onGoToPayment?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onJoinAuction, onGoToPayment }) => {
  const { isLoggedIn } = useAuction();

  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <img 
              src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg" 
              alt="Logo" 
              className="h-12 w-auto"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? <WalletDisplay onGoToPayment={onGoToPayment} /> : null}
        </div>
      </header>

      <PromotionalBanner />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">🔥 Live Now</h2>
        <LiveAuctionsList onJoinAuction={onJoinAuction} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">✅ Recently Concluded</h2>
        <ConcludedAuctionsList />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">⏰ Coming Soon</h2>
        <UpcomingAuctionsList />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">🛍️ Featured Products</h2>
        <ProductList />
      </div>

    </div>
  );
};
