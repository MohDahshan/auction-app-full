import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiService, { User } from '../services/api';
import webSocketService from '../services/websocket';

interface Auction {
  id: string;
  title: string;
  image: string;
  currentBid?: number;
  marketPrice: number;
  timeLeft?: number;
  bidders: number;
  entryFee: number;
  minWallet: number;
  description: string;
  category: string;
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  endTime: string;
  productName?: string;
  finalBid?: number;
  winner?: string;
  savings?: number;
  endedAgo?: string;
}

interface AuctionContextType {
  userCoins: number;
  isLoggedIn: boolean;
  userProfile: {
    name: string;
    avatar: string;
  };
  user: User | null;
  joinedAuctions: Set<string | number>;
  userBids: { [auctionId: string | number]: number };
  // Auction management
  upcomingAuctions: Auction[];
  liveAuctions: Auction[];
  endedAuctions: Auction[];
  auctionCountdowns: { [auctionId: string]: number };
  // Methods
  placeBid: (auctionId: string | number, amount: number) => Promise<boolean>;
  addCoins: (amount: number) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  joinAuction: (auctionId: string | number, entryFee: number) => Promise<boolean>;
  isParticipatingInAuction: (auctionId: string | number) => boolean;
  getUserBidForAuction: (auctionId: string | number) => number;
  // Auction management methods
  moveAuctionToLive: (auctionId: string) => void;
  moveAuctionToEnded: (auctionId: string) => void;
  updateAuctionCountdown: (auctionId: string, timeLeft: number) => void;
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
  const [joinedAuctions, setJoinedAuctions] = useState<Set<string | number>>(new Set());
  const [userBids, setUserBids] = useState<{ [auctionId: string | number]: number }>({});
  const [userProfile, setUserProfile] = useState({
    name: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auction management state
  const [upcomingAuctions, setUpcomingAuctions] = useState<Auction[]>([]);
  const [liveAuctions, setLiveAuctions] = useState<Auction[]>([]);
  const [endedAuctions, setEndedAuctions] = useState<Auction[]>([]);
  const [auctionCountdowns, setAuctionCountdowns] = useState<{ [auctionId: string]: number }>({});

  // Load all auctions data
  const loadAllAuctions = async () => {
    try {
      const response = await apiService.getAllAuctions();
      
      if (response.success && response.data) {
        
        // Set auction data from API
        setUpcomingAuctions(response.data.upcoming || []);
        setLiveAuctions(response.data.live || []);
        setEndedAuctions(response.data.ended || []);
        
        // Initialize countdowns for upcoming auctions
        response.data.upcoming?.forEach((auction: any) => {
          const timeUntilStart = calculateTimeUntilStart(auction.startTime);
          if (timeUntilStart > 0) {
            updateAuctionCountdown(auction.id, timeUntilStart);
          }
        });
      }
    } catch (error) {
      console.error('❌ Failed to load all auctions:', error);
    }
  };

  const calculateTimeUntilStart = (startTime: string): number => {
    const now = new Date().getTime();
    const start = new Date(startTime).getTime();
    const difference = start - now;
    
    if (difference <= 0) return 0;
    return Math.floor(difference / 1000); // Return seconds
  };

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
      
      // Load all auctions data
      await loadAllAuctions();
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const joinAuction = async (auctionId: string | number, entryFee: number): Promise<boolean> => {
    
    if (!isLoggedIn) {
      setError('Must be logged in to join auction');
      return false;
    }
    
    if (joinedAuctions.has(auctionId)) {
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

  const isParticipatingInAuction = (auctionId: string | number): boolean => {
    return joinedAuctions.has(auctionId);
  };

  const placeBid = async (auctionId: string | number, amount: number): Promise<boolean> => {
    if (!isLoggedIn) {
      setError('Must be logged in to place bid');
      return false;
    }
    
    if (!isParticipatingInAuction(auctionId)) {
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

  const getUserBidForAuction = (auctionId: string | number): number => {
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

  // Helper function to update auction in array
  const updateAuctionInArray = (auctions: Auction[], newData: any): Auction[] => {
    if (!newData?.id) return auctions;

    const existingIndex = auctions.findIndex(a => a.id === newData.id);

    if (existingIndex !== -1) {
      // تحديث المزاد الموجود باستخدام map
      return auctions.map(a =>
        a.id === newData.id ? { ...a, ...newData } : a
      );
    }

    // إذا لم يوجد المزاد → إضافته
    return [...auctions, newData];
  };

  // Update auction data across all lists (upcoming, live, ended)
  const updateAuctionData = (updatedAuctionData: Auction) => {
    
    // Only update the auction in the correct list based on its status
    const auctionStatus = updatedAuctionData.status;
    
    if (auctionStatus === 'upcoming') {
      setUpcomingAuctions(prev => {
        const existingIndex = prev.findIndex(a => a.id === updatedAuctionData.id);
        if (existingIndex !== -1) {
          const oldAuction = prev[existingIndex];
          const newAuction = { ...oldAuction, ...updatedAuctionData };
          
          const updated = prev.map(a => a.id === updatedAuctionData.id ? newAuction : a);
          return updated;
        }
        return prev;
      });
    } else if (auctionStatus === 'live') {
      setLiveAuctions(prev => {
        const existingIndex = prev.findIndex(a => a.id === updatedAuctionData.id);
        if (existingIndex !== -1) {
          const oldAuction = prev[existingIndex];
          const newAuction = { ...oldAuction, ...updatedAuctionData };
          
          const updated = prev.map(a => a.id === updatedAuctionData.id ? newAuction : a);
          return updated;
        }
        return prev;
      });
    } else if (auctionStatus === 'ended') {
      setEndedAuctions(prev => {
        const existingIndex = prev.findIndex(a => a.id === updatedAuctionData.id);
        if (existingIndex !== -1) {
          const oldAuction = prev[existingIndex];
          const newAuction = { ...oldAuction, ...updatedAuctionData };
          
          const updated = prev.map(a => a.id === updatedAuctionData.id ? newAuction : a);
          return updated;
        }
        return prev;
      });
    }
  };

  // Delete auction from all lists (upcoming, live, ended)
  const deleteAuctionData = (auctionId: string) => {
    
    setUpcomingAuctions(prev => prev.filter(a => a.id !== auctionId));
    setLiveAuctions(prev => prev.filter(a => a.id !== auctionId));
    setEndedAuctions(prev => prev.filter(a => a.id !== auctionId));
  };

  // Auction management methods
  const moveAuctionToLive = (auctionId: string) => {
    
    setUpcomingAuctions(prev => {
      const auction = prev.find(a => a.id === auctionId);
      if (auction) {
        // Update auction status and move to live
        const updatedAuction = { ...auction, status: 'live' as const };
        setLiveAuctions(livePrev => [updatedAuction, ...livePrev]);
        
        // Remove countdown for this auction
        setAuctionCountdowns(countdownPrev => {
          const updated = { ...countdownPrev };
          delete updated[auctionId];
          return updated;
        });
        
        // Return new array without the moved auction using filter
        return prev.filter(a => a.id !== auctionId);
      }
      return prev;
    });
  };

  const moveAuctionToEnded = (auctionId: string) => {
    
    setLiveAuctions(prev => {
      const auction = prev.find(a => a.id === auctionId);
      if (auction) {
        // Update auction status and move to ended
        const updatedAuction = { 
          ...auction, 
          status: 'ended' as const,
          endedAgo: 'Just ended'
        };
        setEndedAuctions(endedPrev => [updatedAuction, ...endedPrev]);
        
        // Return new array without the moved auction using filter
        return prev.filter(a => a.id !== auctionId);
      }
      return prev;
    });
  };

  const updateAuctionCountdown = (auctionId: string, timeLeft: number) => {
    setAuctionCountdowns(prev => ({
      ...prev,
      [auctionId]: timeLeft
    }));

    // If countdown reaches 0, move to live
    if (timeLeft <= 0) {
      moveAuctionToLive(auctionId);
    }
  };

  // WebSocket listeners for auction state changes (existing listeners)
  useEffect(() => {
    const handleAuctionStatusChanged = (data: any) => {
      
      if (data.auction) {
        const auctionId = data.auction.id;
        
        if (data.auction.status === 'live') {
          moveAuctionToLive(auctionId);
        } else if (data.auction.status === 'ended') {
          moveAuctionToEnded(auctionId);
        }
      }
    };

    const handleAuctionStarted = (data: any) => {
      if (data.auction) {
        moveAuctionToLive(data.auction.id);
      }
    };

    const handleAuctionEnded = (data: any) => {
      if (data.auction) {
        moveAuctionToEnded(data.auction.id);
      }
    };

    // Subscribe to WebSocket events
    webSocketService.on('auction_status_changed', handleAuctionStatusChanged);
    webSocketService.on('auction_started', handleAuctionStarted);
    webSocketService.on('auction_ended', handleAuctionEnded);

    // Cleanup function - unsubscribe from events
    return () => {
      webSocketService.off('auction_status_changed', handleAuctionStatusChanged);
      webSocketService.off('auction_started', handleAuctionStarted);
      webSocketService.off('auction_ended', handleAuctionEnded);
    };
  }, []);

  // WebSocket listeners for auction updates and deletion (new listeners)
  useEffect(() => {
    const handleAuctionUpdated = (data: any) => {
      if (data.auction) {
        updateAuctionData(data.auction);
      }
    };

    const handleAuctionDeleted = (data: any) => {
      if (data.auctionId) {
        deleteAuctionData(data.auctionId);
      }
    };

    // Use correct event names that match WebSocket service
    webSocketService.on('auction:updated', handleAuctionUpdated);
    webSocketService.on('auction:deleted', handleAuctionDeleted);

    return () => {
      webSocketService.off('auction:updated', handleAuctionUpdated);
      webSocketService.off('auction:deleted', handleAuctionDeleted);
    };
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctionCountdowns(prev => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach(auctionId => {
          if (updated[auctionId] > 0) {
            updated[auctionId] -= 1;
            hasChanges = true;
          } else if (updated[auctionId] === 0) {
            // Move auction to live when countdown reaches 0
            moveAuctionToLive(auctionId);
            delete updated[auctionId];
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AuctionContext.Provider value={{ 
      userCoins, 
      isLoggedIn, 
      user,
      userProfile, 
      joinedAuctions,
      userBids,
      // Auction management
      upcomingAuctions,
      liveAuctions,
      endedAuctions,
      auctionCountdowns,
      // Methods
      placeBid, 
      addCoins, 
      logout, 
      login,
      register,
      joinAuction,
      isParticipatingInAuction,
      getUserBidForAuction,
      // Auction management methods
      moveAuctionToLive,
      moveAuctionToEnded,
      updateAuctionCountdown,
      loading,
      error
    }}>
      {children}
    </AuctionContext.Provider>
  );
};
