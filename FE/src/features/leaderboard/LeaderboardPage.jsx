import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../lib/axiosClient';
import Sidebar from '../../components/ui/Sidebar';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const accessToken = useSelector(state => state.auth.accessToken);
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${accessToken}` };
        
        // Fetch user info and leaderboard in parallel
        const [meRes, leaderRes] = await Promise.all([
          axiosClient.get('/auth/me', { headers }),
          axiosClient.get('/leaderboard', { headers })
        ]);
        
        setUser(meRes.data.data);
        setLeaderboardData(leaderRes.data.data || []);
      } catch (err) {
        console.error('Failed to load leaderboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [accessToken, navigate]);

  const username = user?.fullName || user?.username || 'Student';
  const targetBand = user?.targetBand || '--';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading leaderboard...</div>;
  }

  const getRankColor = (rank, isCurrentUser) => {
    if (isCurrentUser) return 'text-gray-900 font-bold';
    if (rank === 1) return 'text-orange-600 font-bold';
    if (rank === 2) return 'text-orange-500 font-bold';
    if (rank === 3) return 'text-amber-500 font-bold';
    return 'text-gray-300 font-medium';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <Sidebar username={username} targetBand={targetBand} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-10 overflow-y-auto">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Leaderboard</h2>
          <p className="text-gray-500 text-sm mb-8">Ranked by average band score.</p>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {leaderboardData.length === 0 ? (
               <div className="p-8 text-center text-gray-500">
                 No one has completed a Mock Test yet. Be the first!
               </div>
            ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-white">
                  <th className="py-4 pl-6 font-medium w-16">#</th>
                  <th className="py-4 px-4 font-medium">Name</th>
                  <th className="py-4 px-4 font-medium text-center w-24">Band</th>
                  <th className="py-4 pr-6 font-medium text-right w-24">Tests</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((item) => {
                  const isCurrentUser = user && item.userId === user.id;
                  
                  return (
                    <tr key={item.userId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pl-6">
                        <span className={`text-sm ${getRankColor(item.rank, isCurrentUser)}`}>
                          {item.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {item.avatarUrl ? (
                            <img src={item.avatarUrl} alt={item.displayName} className="w-10 h-10 rounded-full object-cover shrink-0 mr-4" />
                          ) : (
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mr-4 ${isCurrentUser ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                              {getInitials(item.displayName)}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className={`text-sm ${isCurrentUser ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>{item.displayName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold ${isCurrentUser ? 'text-gray-900' : 'text-gray-800'}`}>{item.averageBand.toFixed(1)}</span>
                      </td>
                      <td className="py-4 pr-6 text-right">
                        <span className="text-gray-500 text-sm">{item.totalTests} tests</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
