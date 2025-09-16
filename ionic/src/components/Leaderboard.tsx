import React from 'react';
import { Crown, Medal, Award } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Alex Thunder', wins: 28, coins: 1250, avatar: 'AT' },
  { rank: 2, name: 'Sarah Storm', wins: 24, coins: 1100, avatar: 'SS' },
  { rank: 3, name: 'Mike Flash', wins: 22, coins: 980, avatar: 'MF' },
  { rank: 4, name: 'Emma Spark', wins: 19, coins: 875, avatar: 'ES' },
  { rank: 5, name: 'You', wins: 12, coins: 450, avatar: 'YOU', isCurrentUser: true },
];

export const Leaderboard: React.FC = () => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-white/70 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30';
      case 2:
        return 'from-gray-400/20 to-gray-500/20 border-gray-300/30';
      case 3:
        return 'from-orange-500/20 to-orange-600/20 border-orange-400/30';
      default:
        return 'from-white/5 to-white/10 border-white/20';
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">🏆 Top Bidders</h3>
        <span className="text-gray-600 text-sm">This week</span>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`bg-white border rounded-xl p-4 shadow-sm ${
              user.isCurrentUser ? 'ring-2 ring-blue-400' : ''
            } transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center space-x-4">
              {getRankIcon(user.rank)}
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                user.isCurrentUser 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                  : 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
              }`}>
                {user.avatar}
              </div>
              
              <div className="flex-1">
                <p className={`font-bold ${user.isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                  {user.name}
                </p>
                <p className="text-gray-600 text-sm">{user.wins} wins</p>
              </div>
              
              <div className="text-right">
                <p className="text-yellow-400 font-bold">{user.coins} 🪙</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};