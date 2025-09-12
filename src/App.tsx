import React, { useState } from 'react';
import { AuctionProvider } from './context/AuctionContext';
import { useAuction } from './context/AuctionContext';
import { AuthModal } from './components/AuthModal';
import { BottomNavigation } from './components/BottomNavigation';
import { LoginScreen } from './components/LoginScreen';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProfilePage } from './pages/ProfilePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BiddingPage } from './pages/BiddingPage';
import { PaymentPage } from './pages/PaymentPage';

type Page = 'home' | 'store' | 'profile' | 'categories' | 'bidding' | 'payment';

const AppContent: React.FC = () => {
  const { isLoggedIn, login } = useAuction();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAuction, setPendingAuction] = useState<any>(null);

  const handleJoinAuction = (auction: any) => {
    if (!isLoggedIn) {
      setPendingAuction(auction);
      setShowAuthModal(true);
    } else {
      setSelectedAuction(auction);
      setCurrentPage('bidding');
    }
  };

  const handleAuthSuccess = () => {
    if (pendingAuction) {
      setSelectedAuction(pendingAuction);
      setCurrentPage('bidding');
      setPendingAuction(null);
    }
  };

  const handleBackFromBidding = () => {
    setCurrentPage('home');
    setSelectedAuction(null);
  };

  const handleGoToPayment = () => {
    setCurrentPage('payment');
  };

  const handleBackFromPayment = () => {
    setCurrentPage('profile');
  };
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onJoinAuction={handleJoinAuction} onGoToPayment={handleGoToPayment} />;
      case 'store':
        return <StorePage onGoToPayment={handleGoToPayment} onJoinAuction={handleJoinAuction} />;
      case 'profile':
        return <ProfilePage onGoToPayment={handleGoToPayment} />;
      case 'categories':
        return <CategoriesPage />;
      case 'bidding':
        return selectedAuction && isLoggedIn ? (
          <BiddingPage auction={selectedAuction} onBack={handleBackFromBidding} />
        ) : (
          <HomePage onJoinAuction={handleJoinAuction} />
        );
      case 'payment':
        return <PaymentPage onBack={handleBackFromPayment} />;
      default:
        return <HomePage onJoinAuction={handleJoinAuction} />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${currentPage !== 'bidding' && currentPage !== 'payment' ? 'pb-20' : ''}`}>
      {renderPage()}
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAuction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
      
      {currentPage !== 'bidding' && currentPage !== 'payment' && (
        <BottomNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuctionProvider>
      <div className="min-h-screen bg-gray-100">
        <AppContent />
      </div>
    </AuctionProvider>
  );
}

export default App;