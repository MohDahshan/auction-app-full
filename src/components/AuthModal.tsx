import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Phone, X } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, loading, error } = useAuction();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (isSignUp && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;
    
    if (isSignUp) {
      success = await register(formData.name, formData.email, formData.password, formData.phone);
    } else {
      success = await login(formData.email, formData.password);
    }
    
    if (success) {
      // Reset form
      setFormData({ name: '', email: '', phone: '', password: '' });
      setErrors({});
      onSuccess();
      onClose();
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setErrors({});
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xl max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {isSignUp ? 'Create Account' : 'Welcome Back!'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Join AuctionApp and start winning!' : 'Sign in to join auctions'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {isSignUp && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          )}

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              isSignUp ? 'Create Account & Start Bidding 🚀' : 'Sign In & Start Bidding 🚀'
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={switchMode}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {isSignUp ? 'Sign in here' : 'Sign up here'}
            </button>
          </p>
        </div>

        <div className="mt-3 text-center">
          <p className="text-gray-400 text-xs">
            By {isSignUp ? 'signing up' : 'signing in'}, you agree to our{' '}
            <button className="text-blue-500 hover:text-blue-400 underline">
              Terms & Conditions
            </button>
            {' '}and{' '}
            <button className="text-blue-500 hover:text-blue-400 underline">
              Privacy Policy
            </button>
          </p>
        </div>

        {!isSignUp && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800 text-sm font-medium mb-2">Quick Test Login:</p>
            <button
              onClick={() => handleQuickLogin('admin@auction.com', 'admin123')}
              className="w-full text-left text-blue-700 hover:text-blue-900 text-sm"
              disabled={loading}
            >
              📧 admin@auction.com / admin123
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
