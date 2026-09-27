import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../lib/axiosClient';
import Sidebar from '../../components/ui/Sidebar';
import { useSelector } from 'react-redux';

export default function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = useSelector(state => state.auth.accessToken);
  const user = useSelector(state => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/results/${id}`);
        setResult(res.data.data);
      } catch (err) {
        console.error('Failed to load result', err);
        setError('Kết quả không tồn tại hoặc bạn không có quyền truy cập.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, accessToken, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang tải kết quả...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <Sidebar username={user?.fullName || user?.username} targetBand={user?.targetBand} />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link to="/exams" className="bg-[#111827] text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    exam,
    skill,
    correctCount,
    wrongCount,
    skippedCount,
    totalQuestions,
    bandScore,
    detailAnswers
  } = result;

  const getAccuracyPercentage = () => {
    if (!totalQuestions) return 0;
    return Math.round((correctCount / totalQuestions) * 100);
  };

  const formatAnswer = (ans) => {
    if (ans === undefined || ans === null || ans === '') return 'None';
    if (typeof ans === 'string') return ans;
    if (Array.isArray(ans)) {
      if (ans.length > 0 && typeof ans[0] === 'string') return ans.join(' / ');
      return ans.map(b => {
        if (b.blank_id || b.label_id) {
          const id = b.blank_id || b.label_id;
          const answers = b.correct_answers || [];
          return `(${id}) ${answers.join(' / ')}`;
        }
        if (b.paragraph || b.statement) {
           return `(${b.paragraph || b.statement}) ${b.correct_answer}`;
        }
        return JSON.stringify(b);
      }).join(', ');
    }
    if (typeof ans === 'object') {
      const entries = Object.entries(ans);
      if (entries.length === 0) return 'None';
      return entries.map(([k, v]) => `(${k}) ${v}`).join(', ');
    }
    return JSON.stringify(ans);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar username={user?.fullName || user?.username} targetBand={user?.targetBand} />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header / Summary Section */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{skill} Result</span>
                <h1 className="text-3xl font-bold text-gray-900 mt-1">{exam?.title || 'Test Result'}</h1>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Band Score</p>
                <div className="text-4xl font-black text-[#111827]">{bandScore ?? '--'}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100 flex flex-col items-center">
                <span className="text-2xl font-bold text-green-700">{correctCount}</span>
                <span className="text-xs font-medium text-green-600 uppercase mt-1">Points</span>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex flex-col items-center">
                <span className="text-2xl font-bold text-red-700">{wrongCount}</span>
                <span className="text-xs font-medium text-red-600 uppercase mt-1">Incorrect</span>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-700">{skippedCount}</span>
                <span className="text-xs font-medium text-gray-500 uppercase mt-1">Skipped</span>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-700">{getAccuracyPercentage()}%</span>
                <span className="text-xs font-medium text-blue-600 uppercase mt-1">Accuracy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="max-w-4xl mx-auto px-8 py-8 pb-20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Review</h2>
          
          <div className="space-y-6">
            {detailAnswers?.map((item, idx) => {
              const isCorrect = item.isCorrect;
              const isPartiallyCorrect = item.isPartiallyCorrect;
              const isSkipped = item.userAnswer === null || item.userAnswer === undefined || item.userAnswer === '' || (typeof item.userAnswer === 'object' && Object.keys(item.userAnswer).length === 0);
              
              let statusLabel = 'Incorrect';
              let statusColor = 'text-red-700 bg-red-50 border-red-200';
              let icon = '✗';
              let containerBorder = 'border-red-200';
              let headerBg = 'bg-red-50 border-red-200';
              
              if (isCorrect) {
                statusLabel = 'Correct';
                statusColor = 'text-green-700 bg-green-50 border-green-200';
                icon = '✓';
                containerBorder = 'border-green-200';
                headerBg = 'bg-green-50 border-green-200';
              } else if (isPartiallyCorrect) {
                statusLabel = `Partial (${item.pointsAwarded || 0} pts)`;
                statusColor = 'text-yellow-700 bg-yellow-50 border-yellow-200';
                icon = '✓';
                containerBorder = 'border-yellow-200';
                headerBg = 'bg-yellow-50 border-yellow-200';
              } else if (isSkipped) {
                statusLabel = 'Skipped';
                statusColor = 'text-gray-700 bg-gray-100 border-gray-200';
                icon = '−';
                containerBorder = 'border-gray-200';
                headerBg = 'bg-gray-50 border-gray-200';
              }

              return (
                <div key={item.questionId || idx} className={`rounded-xl border ${containerBorder} bg-white overflow-hidden shadow-sm`}>
                  {/* Question Header */}
                  <div className={`px-6 py-3 border-b flex justify-between items-center ${headerBg}`}>
                    <span className="font-bold text-gray-900">Question {(!result?.exam?.code?.includes('FULL')) ? (idx + 1) : (item.questionNumber || (idx + 1))}</span>
                    <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                      <span>{icon}</span>
                      <span>{statusLabel}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-8 mb-4">
                      {/* User's Answer */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Answer</p>
                        <div className={`text-base font-medium ${isCorrect ? 'text-green-700' : (isSkipped ? 'text-gray-400 italic' : (isPartiallyCorrect ? 'text-yellow-700' : 'text-red-700'))}`}>
                          {formatAnswer(item.userAnswer)}
                        </div>
                      </div>
                      
                      {/* Correct Answer */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Correct Answer</p>
                        <div className="text-base font-medium text-gray-900">
                          {formatAnswer(item.correctAnswer)}
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    {item.explanation && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Explanation
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
