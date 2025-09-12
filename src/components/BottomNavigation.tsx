import React from 'react';
import { Home, Store, User, Grid3X3 } from 'lucide-react';

type Page = 'home' | 'store' | 'profile' | 'categories';

interface BottomNavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Home' },
    { id: 'store' as Page, icon: Store, label: 'Store' },
    { id: 'categories' as Page, icon: Grid3X3, label: 'Categories' },
    { id: 'profile' as Page, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
              currentPage === id
                ? 'bg-blue-500 text-white scale-110'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};