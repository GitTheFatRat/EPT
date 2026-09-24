import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../lib/axiosClient';
import Sidebar from '../../components/ui/Sidebar';

export default function ExamListLayout({ skillCategory, title, subtitle }) {
  const navigate = useNavigate();
  const accessToken = useSelector(state => state.auth.accessToken);
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

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
        if (resultsRes.status === 'fulfilled') setResults(resultsRes.value.data.data.items || []);
        if (examsRes.status === 'fulfilled') setExams(examsRes.value.data.data.items || []);

      } catch (err) {
        console.error('Failed to load exam list data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [accessToken, navigate]);

  const username = user?.username || 'Student';
  const targetBand = user?.targetBand || '--';

  // Current band
  let currentBand = null;
  if (stats) {
     if (skillCategory === 'reading') {
       const rh = stats.reading?.history || [];
       if (rh.length > 0) currentBand = rh[rh.length - 1].bandScore;
     } else if (skillCategory === 'listening') {
       const lh = stats.listening?.history || [];
       if (lh.length > 0) currentBand = lh[lh.length - 1].bandScore;
     }
  }

  // Filter exams based on category
  const filteredExams = exams.filter(exam => {
    const passages = exam.passages || [];
    const hasReading = passages.some(p => p.skill === 'reading');
    const hasListening = passages.some(p => p.skill === 'listening');
    
    if (skillCategory === 'reading') return hasReading;
    if (skillCategory === 'listening') return hasListening;
    if (skillCategory === 'mock') return hasReading && hasListening;
    return false;
  });

  // Calculate metrics
  const totalExams = filteredExams.length;
  let doneExams = 0;

  // Process cards
  const cards = filteredExams.map(exam => {
    const passages = exam.passages || [];
    
    let relevantPassages = [];
    if (skillCategory === 'reading') {
      relevantPassages = passages.filter(p => p.skill === 'reading');
    } else if (skillCategory === 'listening') {
      relevantPassages = passages.filter(p => p.skill === 'listening');
    } else {
      relevantPassages = passages; // mock uses all
    }

    const passageCount = relevantPassages.length;
    // For mock test, it's 3 reading + 4 listening = 7 sections. If API gives different, we just use the length or hardcode 7 if mock.
    // Wait, prompt says: "Mock Test / Full Test luôn là 3 Reading passages + 4 Listening sections = 120 câu tổng... số passages/sections theo skill"
    // Let's compute actual questions
    let totalQuestions = 0;
    relevantPassages.forEach(p => {
       totalQuestions += (p.questions?.length || 0);
    });
    
    // For Mock, prompt explicitly asks to ensure we show 120 Q, 1h 40m, etc. if it's a mock.
    // If we count dynamically, and it's 120, great. If API doesn't have it, we might need a fallback.
    const displayPassagesCount = skillCategory === 'mock' ? 7 : passageCount;
    const displayQuestionsCount = skillCategory === 'mock' ? 120 : (totalQuestions > 0 ? totalQuestions : 40);

    let displayDuration = '20 min';
    if (skillCategory === 'reading') displayDuration = '20 min';
    else if (skillCategory === 'listening') displayDuration = '15 min';
    else if (skillCategory === 'mock') displayDuration = '1h 40m';

    // Find attempts
    const targetMode = skillCategory === 'reading' ? 'practice_reading' : 
                       skillCategory === 'listening' ? 'practice_listening' : 'full_test';
    
    const currentSkill = skillCategory === 'mock' ? 'overall' : skillCategory;
    const examResults = results.filter(r => (r.examId === exam.id || r.exam?.id === exam.id) && r.skill === currentSkill);
    const attemptCount = examResults.length;
    let lastScore = null;
    if (attemptCount > 0) {
       // get most recent
       const latest = examResults.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
       lastScore = `${latest.correctCount || 0}/${latest.totalQuestions || displayQuestionsCount}`;
    }

    if (attemptCount > 0) doneExams++;

    return {
      id: exam.id,
      title: exam.title,
      code: exam.code,
      duration: displayDuration,
      questions: displayQuestionsCount,
      passages: displayPassagesCount,
      attemptCount,
      lastScore,
      targetMode
    };
  });

  const notTriedExams = totalExams - doneExams;

  const handleStart = async (examId, mode) => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const res = await axiosClient.post('/attempts/start', { examId, mode }, { headers });
      const attemptId = res.data.data.attempt?.id || res.data.data.id;
      navigate(`/attempts/${attemptId}`);
    } catch (err) {
      console.error('Failed to start attempt', err);
      // Fallback if API doesn't work yet, just navigate
      navigate(`/attempts/new`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      <Sidebar username={username} targetBand={targetBand} />
      
      <div className="flex-1 flex flex-col p-10 overflow-y-auto">
        <div className="max-w-6xl w-full mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-gray-500 text-sm">{subtitle}</p>
            </div>
            {currentBand && skillCategory !== 'mock' && (
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Current band</p>
                <p className="text-3xl font-bold text-gray-900">{currentBand}</p>
              </div>
            )}
          </div>

          {/* Stats overview */}
          <div className="flex space-x-3 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center w-20 shadow-sm">
              <div className="text-xl font-bold text-gray-900">{totalExams}</div>
              <div className="text-[10px] text-gray-400 mt-1 uppercase">Total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center w-20 shadow-sm">
              <div className="text-xl font-bold text-gray-900">{doneExams}</div>
              <div className="text-[10px] text-gray-400 mt-1 uppercase">Done</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center w-20 shadow-sm">
              <div className="text-xl font-bold text-gray-900">{notTriedExams}</div>
              <div className="text-[10px] text-gray-400 mt-1 uppercase">Not tried</div>
            </div>
          </div>

          {/* Filters (Mock UI) */}
          <div className="flex items-center space-x-6 mb-8 text-sm">
            <div className="flex items-center space-x-2">
              <button disabled className="bg-[#111827] text-white px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">All levels</button>
              <button disabled className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">Easy</button>
              <button disabled className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">Medium</button>
              <button disabled className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">Hard</button>
            </div>
            <div className="flex items-center space-x-2">
              <button disabled className="bg-[#111827] text-white px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">All sources</button>
              <button disabled className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">Cambridge 18</button>
              <button disabled className="bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full font-medium opacity-50 cursor-not-allowed">Cambridge 17</button>
              {/* MOCK UI: cần thêm field difficulty/source vào Backend sau */}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredExams.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đề thi nào</h3>
              <p className="text-gray-500">Quay lại sau nhé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map(card => (
                <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {/* Placeholder badge for mock UI */}
                      MOCK
                    </span>
                    {card.attemptCount > 0 && (
                      <span className="text-xs text-gray-400 font-medium">{card.attemptCount}x attempted</span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-400 mb-6">{card.code}</p>

                  <div className="flex justify-between items-center mb-6">
                    <div className="text-center w-1/3">
                      <div className="font-bold text-gray-900">{card.duration}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Duration</div>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="text-center w-1/3">
                      <div className="font-bold text-gray-900">{card.questions} Q</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Answers</div>
                    </div>
                    <div className="w-px h-8 bg-gray-100"></div>
                    <div className="text-center w-1/3">
                      <div className="font-bold text-gray-900">{card.passages}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{skillCategory === 'reading' ? 'Passages' : 'Sections'}</div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {card.attemptCount > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-500">Last score</span>
                          <span className="text-sm font-bold text-gray-900">{card.lastScore}</span>
                        </div>
                        <button 
                          onClick={() => handleStart(card.id, card.targetMode)}
                          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium text-sm transition-colors"
                        >
                          Retake
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleStart(card.id, card.targetMode)}
                        className="w-full py-2.5 bg-[#111827] hover:bg-gray-800 text-white rounded-lg font-medium text-sm transition-colors mt-8"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
