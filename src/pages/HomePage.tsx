import React from 'react';
import { useState } from 'react';
import { Grid3X3, List, Plus } from 'lucide-react';
import { LiveAuctions } from '../components/LiveAuctions';
import { LiveAuctionsList } from '../components/LiveAuctionsList';
import { ConcludedAuctions } from '../components/ConcludedAuctions';
import { ConcludedAuctionsList } from '../components/ConcludedAuctionsList';
import { UpcomingAuctions } from '../components/UpcomingAuctions';
import { UpcomingAuctionsList } from '../components/UpcomingAuctionsList';
import { Leaderboard } from '../components/Leaderboard';
import { WalletDisplay } from '../components/WalletDisplay';
import { ProductGrid } from '../components/ProductGrid';
import { ProductList } from '../components/ProductList';
import { PromotionalBanner } from '../components/PromotionalBanner';
import CreateAuctionModal from '../components/CreateAuctionModal';
import { useAuction } from '../context/AuctionContext';

type ViewType = 'grid' | 'list';

interface HomePageProps {
  onJoinAuction: (auction: any) => void;
  onGoToPayment?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onJoinAuction, onGoToPayment }) => {
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const { isLoggedIn } = useAuction();

  const handleCreateAuctionSuccess = () => {
    // Auction created successfully - could refresh the page or show a success message
    console.log('Auction created successfully!');
  };

  const ViewToggle = ({ title }: { title: string }) => (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="flex bg-white rounded-lg border border-gray-200 p-1">
        <button
          onClick={() => setViewType('grid')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
            viewType === 'grid'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Grid3X3 size={16} />
          <span className="text-sm font-medium">Grid</span>
        </button>
        <button
          onClick={() => setViewType('list')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
            viewType === 'list'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <List size={16} />
          <span className="text-sm font-medium">List</span>
        </button>
      </div>
    </div>
  );
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
          {isLoggedIn && (
            <button
              onClick={() => setShowCreateAuction(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Auction
            </button>
          )}
          {isLoggedIn ? <WalletDisplay onGoToPayment={onGoToPayment} /> : null}
        </div>
      </header>

      <PromotionalBanner />

      <div className="space-y-4">
        <ViewToggle title="🔥 Live Now" />
        {viewType === 'grid' ? <LiveAuctions onJoinAuction={onJoinAuction} /> : <LiveAuctionsList onJoinAuction={onJoinAuction} />}
      </div>
      
      <div className="space-y-4">
        <ViewToggle title="✅ Recently Concluded" />
        {viewType === 'grid' ? <ConcludedAuctions /> : <ConcludedAuctionsList />}
      </div>
      
      <div className="space-y-4">
        <ViewToggle title="⏰ Coming Soon" />
        {viewType === 'grid' ? <UpcomingAuctions /> : <UpcomingAuctionsList />}
      </div>
      
      <div className="space-y-4">
        <ViewToggle title="🛍️ Featured Products" />
        {viewType === 'grid' ? <ProductGrid /> : <ProductList />}
      </div>

      {/* Create Auction Modal */}
      <CreateAuctionModal
        isOpen={showCreateAuction}
        onClose={() => setShowCreateAuction(false)}
        onSuccess={handleCreateAuctionSuccess}
      />
    </div>
  );
};
