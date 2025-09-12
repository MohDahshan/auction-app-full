import React from 'react';
import { Smartphone, Headphones, Monitor, Gamepad2, Shirt, Watch, Search } from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Smartphone, count: 24, color: 'bg-slate-600' },
  { name: 'Audio', icon: Headphones, count: 18, color: 'bg-emerald-500' },
  { name: 'Gaming', icon: Gamepad2, count: 12, color: 'bg-violet-600' },
  { name: 'Computers', icon: Monitor, count: 15, color: 'bg-blue-600' },
  { name: 'Fashion', icon: Shirt, count: 32, color: 'bg-rose-500' },
  { name: 'More Products', icon: Watch, count: 8, color: 'bg-amber-500' },
];

export const CategoriesPage: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <div className="relative mb-6 mt-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search categories or products..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className={`${category.color} rounded-2xl p-6 h-32 relative overflow-hidden shadow-lg`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
              <div className="relative z-10 flex flex-col h-full">
                <category.icon className="w-8 h-8 text-white mb-2" />
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
                <p className="text-white/80 text-sm mt-auto">{category.count} items</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};