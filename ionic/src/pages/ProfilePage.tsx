import React from 'react';
import { Trophy, Coins, Target, TrendingUp, Wallet, Globe, HelpCircle, LogOut, User, Mail, Lock, Eye, EyeOff, Phone, X, Bell, CreditCard, Edit3, MessageCircle } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

interface ProfilePageProps {
  onGoToPayment?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onGoToPayment }) => {
  const { userCoins, userProfile, logout, login, isLoggedIn, addCoins } = useAuction();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSignupModal, setShowSignupModal] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = React.useState(false);
  const [showLanguage, setShowLanguage] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  const [showFAQ, setShowFAQ] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = React.useState({
    name: '',
    email: '',
    phone: ''
  });
  const [editProfileData, setEditProfileData] = React.useState({
    name: userProfile.name,
    email: '',
    phone: ''
  });
  const [notifications, setNotifications] = React.useState({
    auctionStart: true,
    bidUpdates: true,
    winNotifications: true,
    promotions: false
  });
  const [selectedLanguage, setSelectedLanguage] = React.useState('English');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() && formData.password.trim()) {
      const success = await login(formData.email, formData.password);
      if (success) {
        setFormData({ name: '', email: '', password: '' });
      }
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      // Login successful, form will automatically update
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.name.trim() && signupData.email.trim() && signupData.phone.trim()) {
      // For now, we'll use a default password for signup - in a real app, you'd collect this
      const success = await login(signupData.email, 'defaultPassword123');
      if (success) {
        setShowSignupModal(false);
        setSignupData({ name: '', email: '', phone: '' });
      }
    }
  };

  const handleShowSignup = () => {
    setShowSignupModal(true);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user profile logic would go here
    setShowEditProfile(false);
  };

  const handleNotificationSettings = () => {
    setShowNotifications(true);
  };

  const handlePaymentMethods = () => {
    setShowPaymentMethods(true);
  };

  const handleLanguageSettings = () => {
    setShowLanguage(true);
  };

  const handleContactUs = () => {
    setShowContact(true);
  };

  const handleFAQ = () => {
    setShowFAQ(true);
  };

  const handleAddCredit = () => {
    if (onGoToPayment) {
      onGoToPayment();
    }
  };
  
  const stats = [
    { label: 'Auctions Won', value: '12', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Total Saved', value: '1,250', icon: Coins, color: 'text-green-500' },
    { label: 'Success Rate', value: '68%', icon: Target, color: 'text-green-500' },
    { label: 'Best Streak', value: '5', icon: TrendingUp, color: 'text-purple-500' },
  ];

  const recentPurchases = [
    { item: 'iPhone 15 Pro', date: '2 days ago', profit: '+SAR 750', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg' },
    { item: 'Nike Air Max', date: '1 week ago', profit: '+SAR 169', image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg' },
    { item: 'AirPods Pro', date: '2 weeks ago', profit: '+SAR 300', image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg' },
  ];

  const achievements = [
    { title: 'First Win', description: 'Won your first auction', icon: '🏆', unlocked: true },
    { title: 'Big Saver', description: 'Saved over SAR 1,875 total', icon: '💰', unlocked: true },
    { title: 'Speed Demon', description: 'Won 3 auctions in one day', icon: '⚡', unlocked: false },
    { title: 'Lucky Streak', description: 'Won 10 auctions in a row', icon: '🍀', unlocked: false },
  ];

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Sign in to view your profile</p>
        </header>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Sign in to access your profile</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Sign In & Start Bidding 🚀
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={handleShowSignup}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up here
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              By signing up, you agree to our{' '}
              <button className="text-blue-500 hover:text-blue-400 underline">
                Terms & Conditions
              </button>
              {' '}and{' '}
              <button className="text-blue-500 hover:text-blue-400 underline">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>

        {/* Sign Up Modal */}
        {showSignupModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative">
              <button
                onClick={() => setShowSignupModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Join AuctionApp and start winning!</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Create Account & Start Bidding 🚀
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-xs">
                  By signing up, you agree to our{' '}
                  <button className="text-blue-500 hover:text-blue-400 underline">
                    Terms & Conditions
                  </button>
                  {' '}and{' '}
                  <button className="text-blue-500 hover:text-blue-400 underline">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information Sections - Available when logged out */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Information & Support</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Contact Us</span>
                    <p className="text-gray-500 text-sm">Get help and support</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Language</span>
                    <p className="text-gray-500 text-sm">Choose your preferred language</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">English</span>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Commonly Asked Questions</span>
                    <p className="text-gray-500 text-sm">Find answers to frequent questions</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Lock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Terms & Conditions</span>
                    <p className="text-gray-500 text-sm">Read our terms of service</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>
            
            <button className="w-full text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Eye className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <span className="text-gray-900 font-medium">Privacy Policy</span>
                    <p className="text-gray-500 text-sm">Learn how we protect your data</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* App Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About AuctionApp</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Welcome to AuctionApp</h4>
              <p className="text-gray-600 text-sm mb-4">
                The ultimate destination for smart bidding and incredible deals. Win premium products at unbeatable prices through our exciting auction system.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">🎯</div>
                <p className="text-xs font-medium text-gray-700">Smart Bidding</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">💰</div>
                <p className="text-xs font-medium text-gray-700">Great Savings</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-xs font-medium text-gray-700">Win Big</p>
              </div>
            </div>
            
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-xs">Version 1.0.0 • © 2024 AuctionApp</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Your auction journey</p>
      </header>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 rounded-full">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-white">{userCoins} 🪙</p>
            </div>
          </div>
          <button 
            onClick={handleAddCredit}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold transition-all duration-200 transform hover:scale-105"
          >
            Add Credit
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">{userProfile.avatar}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
            <p className="text-gray-600">Auction Master</p>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Active now</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
          Recent Purchases
        </h3>
        <div className="space-y-3">
          {recentPurchases.map((purchase, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <img
                src={purchase.image}
                alt={purchase.item}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{purchase.item}</p>
                <p className="text-gray-500 text-sm">{purchase.date}</p>
              </div>
              <span className="text-green-500 font-bold">{purchase.profit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">🏅</span>
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                achievement.unlocked
                  ? 'bg-white border-green-200 shadow-sm'
                  : 'bg-gray-100 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className={`font-bold text-sm ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs mt-1 ${
                  achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Unlocked ✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button 
            onClick={handleEditProfile}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-900 font-medium">Edit Profile</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button 
            onClick={handleNotificationSettings}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bell className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-900 font-medium">Notification Settings</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button 
            onClick={handlePaymentMethods}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-900 font-medium">Payment Methods</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button 
            onClick={handleLanguageSettings}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-gray-900 font-medium">Language</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">{selectedLanguage}</span>
                <span className="text-gray-400">→</span>
              </div>
            </div>
          </button>
          <button 
            onClick={handleContactUs}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-900 font-medium">Contact Us</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button 
            onClick={handleFAQ}
            className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-gray-900 font-medium">Commonly Asked Questions</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left p-3 bg-white rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-red-600 font-medium">Logout</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h2>
              <p className="text-gray-600">Update your account information</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={editProfileData.name}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={editProfileData.email}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={editProfileData.phone}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your phone number"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
              <p className="text-gray-600">Manage your notification preferences</p>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">
                      {key === 'auctionStart' && 'Auction Start Alerts'}
                      {key === 'bidUpdates' && 'Bid Updates'}
                      {key === 'winNotifications' && 'Win Notifications'}
                      {key === 'promotions' && 'Promotions & Offers'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {key === 'auctionStart' && 'Get notified when auctions you\'re interested in start'}
                      {key === 'bidUpdates' && 'Receive updates when someone outbids you'}
                      {key === 'winNotifications' && 'Get notified when you win an auction'}
                      {key === 'promotions' && 'Receive promotional offers and deals'}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      value ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowNotifications(false)}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentMethods && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowPaymentMethods(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Methods</h2>
              <p className="text-gray-600">Manage your payment options</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Default</span>
                </div>
              </div>
              
              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                + Add New Payment Method
              </button>
            </div>

            <button
              onClick={() => setShowPaymentMethods(false)}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Language Settings Modal */}
      {showLanguage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowLanguage(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Language Settings</h2>
              <p className="text-gray-600">Choose your preferred language</p>
            </div>

            <div className="space-y-3">
              {['English', 'العربية (Arabic)', 'Français (French)', 'Español (Spanish)'].map((language) => (
                <button
                  key={language}
                  onClick={() => setSelectedLanguage(language)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedLanguage === language
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{language}</span>
                    {selectedLanguage === language && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowLanguage(false)}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Save Language
            </button>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h2>
              <p className="text-gray-600">Get in touch with our support team</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Email Support</p>
                    <p className="text-blue-700 text-sm">support@auctionapp.com</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Phone Support</p>
                    <p className="text-green-700 text-sm">+966 11 123 4567</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Live Chat</p>
                    <p className="text-purple-700 text-sm">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowContact(false)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-2xl max-w-md w-full relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowFAQ(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-600">Find answers to common questions</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">How do auctions work?</h3>
                <p className="text-gray-600 text-sm">Join an auction by paying the entry fee, then place bids to increase your chances of winning. The last bidder when time runs out wins!</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">How do I add coins?</h3>
                <p className="text-gray-600 text-sm">Go to your profile and click "Add Credit" to purchase coin packages using various payment methods.</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">What happens if I win?</h3>
                <p className="text-gray-600 text-sm">You can choose to receive the product or cash out the difference between market price and your total bid amount.</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">Are there any fees?</h3>
                <p className="text-gray-600 text-sm">Only the entry fee to join auctions and 1 coin per bid. No hidden fees or charges.</p>
              </div>
            </div>

            <button
              onClick={() => setShowFAQ(false)}
              className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
