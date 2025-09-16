import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiService, { User } from '../services/api';

interface AuctionContextType {
  userCoins: number;
  isLoggedIn: boolean;
  userProfile: {
    name: string;
    avatar: string;
  };
  user: User | null;
  joinedAuctions: Set<number>;
  userBids: { [auctionId: number]: number };
  placeBid: (auctionId: number, amount: number) => Promise<boolean>;
  addCoins: (amount: number) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  joinAuction: (auctionId: number, entryFee: number) => Promise<boolean>;
  isParticipatingInAuction: (auctionId: number) => boolean;
  getUserBidForAuction: (auctionId: number) => number;
  loading: boolean;
  error: string | null;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};

interface AuctionProviderProps {
  children: ReactNode;
}

export const AuctionProvider: React.FC<AuctionProviderProps> = ({ children }) => {
  const [userCoins, setUserCoins] = useState(500);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [joinedAuctions, setJoinedAuctions] = useState<Set<number>>(new Set());
  const [userBids, setUserBids] = useState<{ [auctionId: number]: number }>({});
  const [userProfile, setUserProfile] = useState({
    name: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            setIsLoggedIn(true);
            setUserCoins(response.data.wallet_balance);
            setUserProfile({
              name: response.data.name,
              avatar: response.data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
            });
          }
        } catch (error) {
          console.error('Failed to get current user:', error);
          // Clear invalid token
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      
      // Load local auction data
      const savedAuctions = localStorage.getItem('joinedAuctions');
      if (savedAuctions) {
        setJoinedAuctions(new Set(JSON.parse(savedAuctions)));
      }
      
      const savedBids = localStorage.getItem('userBids');
      if (savedBids) {
        setUserBids(JSON.parse(savedBids));
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const joinAuction = async (auctionId: number, entryFee: number): Promise<boolean> => {
    console.log('🎯 JOIN AUCTION:', { auctionId, entryFee, userCoins, isLoggedIn });
    
    if (!isLoggedIn) {
      console.log('❌ Cannot join - not logged in');
      setError('Must be logged in to join auction');
      return false;
    }
    
    if (joinedAuctions.has(auctionId)) {
      console.log('✅ Already joined this auction');
      return true;
    }
    
    try {
      setError(null);
      const response = await apiService.joinAuction(auctionId.toString());
      
      if (response.success) {
        // Update local state
        const newJoinedAuctions = new Set(joinedAuctions);
        newJoinedAuctions.add(auctionId);
        setJoinedAuctions(newJoinedAuctions);
        localStorage.setItem('joinedAuctions', JSON.stringify(Array.from(newJoinedAuctions)));
        
        // Update user coins (refresh from server)
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUserCoins(userResponse.data.wallet_balance);
          setUser(userResponse.data);
        }
        
        console.log('✅ Successfully joined auction');
        return true;
      } else {
        setError(response.error || 'Failed to join auction');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Join auction error:', error);
      setError(error.message || 'Failed to join auction');
      return false;
    }
  };

  const isParticipatingInAuction = (auctionId: number): boolean => {
    return joinedAuctions.has(auctionId);
  };

  const placeBid = async (auctionId: number, amount: number): Promise<boolean> => {
    console.log('🎯 PLACE BID:', { 
      auctionId, 
      amount, 
      userCoins, 
      isLoggedIn,
      isParticipating: isParticipatingInAuction(auctionId)
    });
    
    if (!isLoggedIn) {
      console.log('❌ Cannot bid - not logged in');
      setError('Must be logged in to place bid');
      return false;
    }
    
    if (!isParticipatingInAuction(auctionId)) {
      console.log('❌ Cannot bid - not participating in auction');
      setError('Must join auction before bidding');
      return false;
    }
    
    try {
      setError(null);
      const response = await apiService.placeBid(auctionId.toString(), amount);
      
      if (response.success) {
        // Update local bid tracking
        const newUserBids = {
          ...userBids,
          [auctionId]: amount
        };
        setUserBids(newUserBids);
        localStorage.setItem('userBids', JSON.stringify(newUserBids));
        
        // Update user coins (refresh from server)
        const userResponse = await apiService.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          setUserCoins(userResponse.data.wallet_balance);
          setUser(userResponse.data);
        }
        
        console.log('✅ Bid placed successfully');
        return true;
      } else {
        setError(response.error || 'Failed to place bid');
        return false;
      }
    } catch (error: any) {
      console.error('❌ Place bid error:', error);
      setError(error.message || 'Failed to place bid');
      return false;
    }
  };

  const getUserBidForAuction = (auctionId: number): number => {
    return userBids[auctionId] || 0;
  };

  const addCoins = (amount: number) => {
    const newCoins = userCoins + amount;
    setUserCoins(newCoins);
    localStorage.setItem('userCoins', newCoins.toString());
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local state
    setIsLoggedIn(false);
    setUser(null);
    setUserCoins(500);
    setJoinedAuctions(new Set());
    setUserBids({});
    setUserProfile({ name: '', avatar: '' });
    setError(null);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        setIsLoggedIn(true);
        setUserCoins(userData.wallet_balance);
        setUserProfile({
          name: userData.name,
          avatar: userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        });
        
        // Clear old local data
        setJoinedAuctions(new Set());
        setUserBids({});
        localStorage.removeItem('joinedAuctions');
        localStorage.removeItem('userBids');
        
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiService.register({ name, email, password, phone });
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        setIsLoggedIn(true);
        setUserCoins(userData.wallet_balance);
        setUserProfile({
          name: userData.name,
          avatar: userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
        });
        
        // Clear old local data
        setJoinedAuctions(new Set());
        setUserBids({});
        localStorage.removeItem('joinedAuctions');
        localStorage.removeItem('userBids');
        
        return true;
      } else {
        setError(response.error || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuctionContext.Provider value={{ 
      userCoins, 
      isLoggedIn, 
      user,
      userProfile, 
      joinedAuctions,
      userBids,
      placeBid, 
      addCoins, 
      logout, 
      login,
      register,
      joinAuction,
      isParticipatingInAuction,
      getUserBidForAuction,
      loading,
      error
    }}>
      {children}
    </AuctionContext.Provider>
  );
};
