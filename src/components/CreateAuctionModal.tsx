import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, Package, AlertCircle } from 'lucide-react';
import { apiService, Product, CreateAuctionRequest } from '../services/api';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateAuctionRequest>({
    product_id: '',
    title: '',
    description: '',
    entry_fee: 50,
    min_wallet: 100,
    starting_bid: 50,
    start_time: '',
    end_time: ''
  });

  // Load products when modal opens
  useEffect(() => {
    if (isOpen) {
      loadProducts();
      // Set default times (1 hour from now for start, 2 hours from now for end)
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      
      setFormData(prev => ({
        ...prev,
        start_time: startTime.toISOString().slice(0, 16),
        end_time: endTime.toISOString().slice(0, 16)
      }));
    }
  }, [isOpen]);

  const loadProducts = async () => {
    try {
      const response = await apiService.getProducts({ limit: 100 });
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('fee') || name.includes('wallet') || name.includes('bid') 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.product_id) {
        throw new Error('Please select a product');
      }
      if (!formData.title.trim()) {
        throw new Error('Please enter an auction title');
      }
      if (formData.entry_fee < 1) {
        throw new Error('Entry fee must be at least 1 coin');
      }
      if (formData.starting_bid < 1) {
        throw new Error('Starting bid must be at least 1 coin');
      }
      if (new Date(formData.start_time) <= new Date()) {
        throw new Error('Start time must be in the future');
      }
      if (new Date(formData.end_time) <= new Date(formData.start_time)) {
        throw new Error('End time must be after start time');
      }

      const response = await apiService.createAuction(formData);
      
      if (response.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          product_id: '',
          title: '',
          description: '',
          entry_fee: 50,
          min_wallet: 100,
          starting_bid: 50,
          start_time: '',
          end_time: ''
        });
      } else {
        throw new Error(response.error || 'Failed to create auction');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.product_id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Auction</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Select Product
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a product...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.market_price} ({product.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Preview */}
            {selectedProduct && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {selectedProduct.image_url && (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-600">Market Price: ${selectedProduct.market_price}</p>
                    <p className="text-sm text-gray-600">Category: {selectedProduct.category}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Auction Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auction Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter auction title..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter auction description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Pricing Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Entry Fee (Coins)
                </label>
                <input
                  type="number"
                  name="entry_fee"
                  value={formData.entry_fee}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Wallet (Coins)
                </label>
                <input
                  type="number"
                  name="min_wallet"
                  value={formData.min_wallet}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Bid (Coins)
                </label>
                <input
                  type="number"
                  name="starting_bid"
                  value={formData.starting_bid}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Time Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating...' : 'Create Auction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuctionModal;
