import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../../lib/axiosClient';
import { mockDashboardData } from './mockDashboardData';
import Sidebar from '../../components/ui/Sidebar';

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const refreshToken = useSelector(state => state.auth.refreshToken);
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${accessToken}` };
        
        const [meRes, statsRes, resultsRes, examsRes] = await Promise.allSettled([
          axiosClient.get('/auth/me', { headers }),
          axiosClient.get('/results/stats', { headers }),
          axiosClient.get('/results', { headers }),
          axiosClient.get('/exams', { headers }),
        ]);

        if (meRes.status === 'fulfilled') setUser(meRes.value.data.data);
        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
        if (resultsRes.status === 'fulfilled') {
            setResults(resultsRes.value.data.data.items);
            setTotalResults(resultsRes.value.data.data.total);
        }
        if (examsRes.status === 'fulfilled') setExams(examsRes.value.data.data.items);

      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [accessToken, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.fullName || user?.username || 'Student';
  const targetBand = user?.targetBand || '--';

  // Extract band scores
  let overallBand = '--';
  let listeningBand = '--';
  let readingBand = '--';

  if (stats) {
       const listeningHist = stats.listening?.history || [];
       if (listeningHist.length > 0) listeningBand = listeningHist[listeningHist.length - 1].bandScore;
       
       const readingHist = stats.reading?.history || [];
       if (readingHist.length > 0) readingBand = readingHist[readingHist.length - 1].bandScore;
  
       const fullTestHist = stats.overall?.history || [];
       if (fullTestHist.length > 0) {
         overallBand = fullTestHist[fullTestHist.length - 1].bandScore;
       } else if (stats.overall?.averageBand !== undefined) {
         overallBand = stats.overall.averageBand;
       }
    }

  const calculateProgress = (bandStr) => {
    if (bandStr === '--') return 0;
    const current = parseFloat(bandStr);
    const denominator = user?.targetBand ? parseFloat(user.targetBand) : 9.0;
    if (!denominator) return 0;
    const ratio = (current / denominator) * 100;
    return Math.min(Math.round(ratio), 100);
  };

  const progressOverall = calculateProgress(overallBand);
  const progressListening = calculateProgress(listeningBand);
  const progressReading = calculateProgress(readingBand);
  
  const displayTarget = user?.targetBand ? `/ ${user.targetBand}` : '/ 9.0';

  // Tests completed & avg score
  const testsCompleted = totalResults || 0;
  let avgScore = '-- / --';
  if (results && results.length > 0) {
    let sumCorrect = 0;
    let sumTotal = 0;
    results.forEach(r => {
       sumCorrect += r.correctCount || 0;
       sumTotal += r.totalQuestions || 40;
    });
    const avgCorrect = (sumCorrect / results.length).toFixed(1);
    const avgTtl = Math.round(sumTotal / results.length);
    avgScore = `${avgCorrect} / ${avgTtl}`;
  }

  // Recommended
  let recommendedItems = [];
  (exams || []).forEach(exam => {
     if (exam.type === 'practice_reading') {
       recommendedItems.push({ id: exam.id, title: exam.title, skill: 'Reading', time: '20 min' });
     } else if (exam.type === 'practice_listening') {
       recommendedItems.push({ id: exam.id, title: exam.title, skill: 'Listening', time: '15 min' });
     } else {
       recommendedItems.push({ id: exam.id, title: exam.title, skill: 'Reading', time: '60 min' });
       recommendedItems.push({ id: exam.id, title: exam.title, skill: 'Listening', time: '40 min' });
     }
  });
  recommendedItems = recommendedItems.slice(0, 3);
  

  // Recent Activity
  let recentActivities = (results || []).slice(0, 5).map(act => {
    const exam = (exams || []).find(e => e.id === act.examId);
    return {
      ...act,
      examTitle: exam ? exam.title : 'Unknown Exam'
    };
  });
  

  // Band History
  let historyData = [];
  if (stats && stats.overall?.history && stats.overall.history.length > 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const groups = {};
      stats.overall.history.forEach(h => {
         if (!h.date) return;
         const d = new Date(h.date);
         const monthStr = months[d.getMonth()];
         if (!groups[monthStr]) groups[monthStr] = [];
         groups[monthStr].push(h.bandScore);
      });
      historyData = Object.keys(groups).map(k => ({
         month: k,
         band: groups[k][groups[k].length - 1]
      }));
    }
  

  const formatRelativeTime = (isoString) => {
    const date = new Date(isoString);
    const diff = Date.now() - date.getTime();
    if (diff < 86400000) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading dashboard...</div>;
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <Sidebar username={displayName} targetBand={targetBand} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-6xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{getGreeting()}, {displayName}</h2>
              <p className="text-gray-500 mt-1">{mockDashboardData.examDaysLeft} days until your exam — stay consistent and you'll hit {targetBand}.</p>
            </div>
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-sm">
              <span className="text-orange-500 mr-2">🔥</span> {mockDashboardData.streak}-day streak
            </div>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111827] text-white p-6 rounded-xl shadow-sm relative flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">OVERALL BAND</p>
              <div className="text-5xl font-bold mb-1">{overallBand}</div>
              <p className="text-xs text-gray-400 mb-6">Target: {targetBand}</p>
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{progressOverall}%</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${progressOverall}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-400 flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">LISTENING</p>
              <div className="text-5xl font-bold text-gray-900 mb-6">{listeningBand}</div>
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{displayTarget}</span>
                  <span>{progressListening}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progressListening}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-400 flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">READING</p>
              <div className="text-5xl font-bold text-gray-900 mb-6">{readingBand}</div>
              <div className="mt-auto">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{displayTarget}</span>
                  <span>{progressReading}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${progressReading}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900 mb-1">{testsCompleted}</div>
              <p className="text-xs font-medium text-gray-500">Tests completed</p>
              <p className="text-[10px] text-gray-400">all time</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900 mb-1">{avgScore}</div>
              <p className="text-xs font-medium text-gray-500">Avg. score</p>
              <p className="text-[10px] text-gray-400">all tests</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900 mb-1">--</div>
              <p className="text-xs font-medium text-gray-500">Time practiced</p>
              <p className="text-[10px] text-gray-400">this month</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900 mb-1">#{mockDashboardData.rankGlobal}</div>
              <p className="text-xs font-medium text-gray-500">Rank</p>
              <p className="text-[10px] text-gray-400">global</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">This Week</h3>
                <div className="flex items-center space-x-3 text-[10px] text-gray-500">
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>Reading</div>
                  <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Listening</div>
                </div>
              </div>
              <div className="flex items-end justify-between h-32 pt-2">
                {mockDashboardData.thisWeek.map(day => (
                  <div key={day.day} className="flex flex-col items-center w-8">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: `${day.reading}%` }}></div>
                      <div className="w-full bg-blue-500 rounded-b-sm" style={{ height: `${day.listening}%` }}></div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-6">Band History</h3>
              <div className="space-y-3">
                {historyData.length === 0 ? (
                  <div className="text-gray-400 text-xs text-center py-6">No history available</div>
                ) : historyData.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="text-[10px] text-gray-400 w-8">{item.month}</span>
                    <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#111827] rounded-full" style={{ width: `${(item.band / 9) * 100}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-900 w-6 text-right">{item.band}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommended */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
              <h3 className="font-bold text-gray-900 mb-4">Recommended</h3>
              <div className="space-y-3">
                {recommendedItems.length === 0 ? (
                  <div className="text-gray-400 text-xs text-center py-6 border border-gray-100 rounded-lg">No recommendations yet</div>
                ) : recommendedItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition cursor-pointer" onClick={() => navigate('/attempts/start')}>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">Not attempted yet</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium inline-block mb-1 ${
                        item.skill === 'Reading' ? 'bg-purple-100 text-purple-600' :
                        item.skill === 'Listening' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.skill}
                      </span>
                      <p className="text-[10px] text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                <Link to="/exams/history" className="text-xs text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 font-medium">Test</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium text-right">Score</th>
                      <th className="pb-3 font-medium text-right">Band</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-400 text-xs">No recent activity</td>
                      </tr>
                    ) : recentActivities.map((act, i) => (
                      <tr key={i} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 font-medium text-gray-900">{act.examTitle}</td>
                        <td className="py-3">
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-gray-100 text-gray-600">
                            {act.skill}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500 text-xs">{formatRelativeTime(act.createdAt)}</td>
                        <td className="py-3 font-medium text-gray-900 text-right">{act.correctCount}/{act.totalQuestions}</td>
                        <td className="py-3 font-bold text-gray-900 text-right">{act.bandScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
