import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  hydrateAttempt, 
  setAnswer, 
  toggleFlag, 
  setActiveQuestion, 
  submitAttempt, 
  advanceSegment,
  setAudioHasPlayed
} from './attemptSlice';
import axiosClient from '../../lib/axiosClient';
import QuestionRenderer from './components/QuestionRenderer';

export default function AttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { 
    expiresAt, 
    passages, 
    answers, 
    answerStatus, 
    activeQuestionId, 
    currentSegment, 
    submissionState,
    resultId,
    audioPlaybackState,
    loadingData
  } = useSelector(state => state.attempt);
  
  const [remainingTime, setRemainingTime] = useState(0);
  const submitTriggered = useRef(false);
  const autosaveTimer = useRef(null);

  // Hydrate on mount
  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await axiosClient.get(`/attempts/${id}`);
        dispatch(hydrateAttempt(res.data.data));
        submitTriggered.current = false;
      } catch (err) {
        console.error('Failed to load attempt', err);
        navigate('/reading'); // fallback
      }
    };
    fetchAttempt();
    
    // BeforeUnload warning
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [id, dispatch, navigate]);

  // Timer
  useEffect(() => {
    if (!expiresAt || loadingData) return;
    
    // Reset trigger when moving to a new segment with a new expiration
    submitTriggered.current = false;
    
    const tick = () => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = Math.floor((end - now) / 1000);
      
      if (diff <= 0) {
        setRemainingTime(0);
        if (!submitTriggered.current) {
          submitTriggered.current = true;
          handleAutoSubmit();
        }
      } else {
        setRemainingTime(diff);
      }
    };
    
    tick(); // initial
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, loadingData]);

  const handleAutoSubmit = () => {
    // Determine if we should advance or submit
    if (currentSegment === 'reading') {
      dispatch(advanceSegment(id));
    } else {
      dispatch(submitAttempt(id));
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to submit your answers?")) {
      submitTriggered.current = true;
      if (currentSegment === 'reading') {
        dispatch(advanceSegment(id));
      } else {
        dispatch(submitAttempt(id));
      }
    }
  };

  // Navigate on submit completion
  useEffect(() => {
    if (submissionState === 'submitted' && resultId) {
      navigate(`/results/${resultId}`, { replace: true });
    }
  }, [submissionState, resultId, navigate]);

  const handleAnswerChange = (qId, val) => {
    dispatch(setAnswer({ questionId: qId, answer: val }));
    
    // Autosave (Debounced)
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        await axiosClient.patch(`/attempts/${id}/autosave`, {
          answers: { [qId]: val }
        });
      } catch (err) {
        console.error('Autosave failed', err);
      }
    }, 2000);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };





  // Audio handling
  const audioRef = useRef(null);

  if (loadingData) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading attempt...</div>;
  }

  if (submissionState === 'advancing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-2">Chuyển sang phần Listening...</h2>
        <p className="text-gray-400">Vui lòng chờ trong giây lát.</p>
      </div>
    );
  }

  const isLowTime = remainingTime < 300; // < 5 mins
  
  // Find current active passage/question
  let activePassage = passages[0];
  let activeQuestion = activePassage?.questions?.[0];
  
  if (activeQuestionId) {
    for (const p of passages) {
      const q = (p.questions || []).find(x => x.id === activeQuestionId);
      if (q) {
        activePassage = p;
        activeQuestion = q;
        break;
      }
    }
  }

  const isListening = activePassage?.skill === 'listening';

  const activePassageHasPlayed = activePassage ? !!audioPlaybackState?.[activePassage.id]?.hasPlayed : false;
  const handlePlayAudio = () => {
    if (audioRef.current && !activePassageHasPlayed && activePassage) {
      audioRef.current.play();
      dispatch(setAudioHasPlayed({ passageId: activePassage.id, hasPlayed: true }));
    }
  };

  const getSubQuestionCount = (q) => {
    if (q.type === 'sentence_completion' || q.type === 'summary_completion' || q.type === 'note_completion' || q.type === 'table_completion' || q.type === 'form_completion') {
        return q.content?.blanks?.length || 1;
    }
    if (q.type === 'diagram_label_completion') {
        return q.content?.labels?.length || 1;
    }
    if (q.type === 'matching_headings' || q.type === 'matching_information' || q.type === 'matching_features') {
        return q.content?.items?.length || 1;
    }
    return 1;
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f5] font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
        <div>
          <h1 className="font-bold text-gray-900">
            {activePassage ? `${activePassage.skill === 'listening' ? 'Listening' : 'Reading'} - ${activePassage.title}` : 'EPT Exam'}
          </h1>
        </div>
        <div className={`text-2xl font-mono font-bold ${isLowTime ? 'text-red-600' : 'text-gray-900'}`}>
          {formatTime(remainingTime)}
        </div>
      </header>

      {/* Main Content (2 columns) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Passage / Audio */}
        <div className="w-3/5 bg-white border-r border-gray-200 p-8 overflow-y-auto">
          {isListening ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.236l8-1.6V11.114A4.369 4.369 0 0015 11c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center">{activePassage.title}</h2>
              <p className="text-sm text-gray-500">Audio will play only once. Do not refresh the page.</p>
              
              <button 
                onClick={handlePlayAudio}
                disabled={activePassageHasPlayed}
                className={`px-8 py-3 rounded-full font-bold transition-colors ${activePassageHasPlayed ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
              >
                {activePassageHasPlayed ? 'Audio Played' : 'Play Audio'}
              </button>
              
              {activePassage.audio_url && (
                <audio ref={audioRef} src={activePassage.audio_url} className="hidden" />
              )}
            </div>
          ) : (
            <div className="prose max-w-none text-gray-800">
              <h2 className="text-2xl font-bold mb-6">{activePassage?.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: activePassage?.passage_text || '' }} />
            </div>
          )}
        </div>

        {/* Right Column: Questions */}
        <div className="w-2/5 bg-[#f5f5f5] p-8 overflow-y-auto">
          {activeQuestion ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-6">
                <span className="bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded-md">
                  {(() => {
                    if (!activeQuestion.questionNumber) return 'Question -';
                    const count = getSubQuestionCount(activeQuestion);
                    if (count > 1) {
                      return `Questions ${activeQuestion.questionNumber} - ${activeQuestion.questionNumber + count - 1}`;
                    }
                    return `Question ${activeQuestion.questionNumber}`;
                  })()}
                </span>
                <button 
                  onClick={() => dispatch(toggleFlag({ questionId: activeQuestion.id }))}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${answerStatus[activeQuestion.id] === 'flagged' ? 'text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill={answerStatus[activeQuestion.id] === 'flagged' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span>Flag for review</span>
                </button>
              </div>
              
              {activeQuestion.group_instruction && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                  {activeQuestion.group_instruction}
                </div>
              )}

              <QuestionRenderer 
                question={activeQuestion} 
                value={answers[activeQuestion.id]} 
                onChange={(val) => handleAnswerChange(activeQuestion.id, val)}
              />
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">Select a question from below</div>
          )}
        </div>
      </div>

      {/* Footer / Navigator */}
      <footer className="h-24 bg-white border-t border-gray-200 shrink-0 flex items-center justify-between px-6 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex-1 overflow-x-auto pr-6 flex items-center space-x-2">
          {passages.map(p => (
            (p.questions || []).flatMap(q => {
              const count = getSubQuestionCount(q);
              const buttons = [];
              for (let i = 0; i < count; i++) {
                const subNumber = q.questionNumber ? (q.questionNumber + i) : '-';
                const status = answerStatus[q.id];
                let btnClass = "w-10 h-10 shrink-0 rounded-md border flex items-center justify-center text-sm font-medium transition-colors ";
                
                if (activeQuestionId === q.id) {
                  btnClass += "border-gray-900 ring-2 ring-gray-900 ring-offset-1 ";
                } else {
                  btnClass += "border-gray-300 hover:border-gray-400 ";
                }

                if (status === 'flagged') {
                  btnClass += "bg-yellow-400 text-yellow-900 border-yellow-500";
                } else {
                  // check if this specific blank is answered if possible
                  let isAnswered = false;
                  const ans = answers[q.id];
                  if (ans) {
                    if (typeof ans === 'object') {
                      // rough check: if any of the keys match (i+1)
                      const blankKey = String(i + 1);
                      if (ans[blankKey] && ans[blankKey].trim() !== '') {
                        isAnswered = true;
                      } else if (ans[q.content?.blanks?.[i]?.blank_id]) {
                         isAnswered = !!ans[q.content.blanks[i].blank_id].trim();
                      }
                    } else if (typeof ans === 'string' && ans.trim() !== '') {
                      isAnswered = true;
                    }
                  }
                  
                  if (isAnswered) {
                    btnClass += "bg-blue-100 text-blue-900 border-blue-300";
                  } else {
                    btnClass += "bg-white text-gray-600";
                  }
                }

                buttons.push(
                  <button 
                    key={`${q.id}-${subNumber}`}
                    onClick={() => dispatch(setActiveQuestion(q.id))}
                    className={btnClass}
                  >
                    {subNumber}
                  </button>
                );
              }
              return buttons;
            })
          ))}
        </div>
        <div className="shrink-0 pl-4 border-l border-gray-200">
          <button 
            onClick={handleManualSubmit}
            disabled={submissionState === 'submitting' || submissionState === 'advancing'}
            className="bg-[#111827] hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {submissionState === 'submitting' || submissionState === 'advancing' ? 'Wait...' : 'Submit'}
          </button>
        </div>
      </footer>
    </div>
  );
}
