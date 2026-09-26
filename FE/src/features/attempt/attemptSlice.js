import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../lib/axiosClient';

// Thunks
export const submitAttempt = createAsyncThunk(
  'attempt/submitAttempt',
  async (attemptId, { getState, rejectWithValue }) => {
    try {
      // Get all answers from state just in case, though backend should have them from autosave.
      // But contract says "gọi POST /api/attempts/:id/submit gửi kèm toàn bộ answers hiện có trong Redux".
      const { answers } = getState().attempt;
      const res = await axiosClient.post(`/attempts/${attemptId}/submit`, { answers });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const advanceSegment = createAsyncThunk(
  'attempt/advanceSegment',
  async (attemptId, { getState, rejectWithValue }) => {
    try {
      const { answers } = getState().attempt;
      if (answers && Object.keys(answers).length > 0) {
        await axiosClient.patch(`/attempts/${attemptId}/autosave`, { answers });
      }
      const res = await axiosClient.post(`/attempts/${attemptId}/advance-segment`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  attemptId: null,
  mode: null,
  currentSegment: null,
  expiresAt: null,
  passages: [],
  answers: {},
  answerStatus: {}, // 'unanswered' | 'answered' | 'flagged'
  activeQuestionId: null,
  audioPlaybackState: {
    hasPlayed: false,
    allowReplay: false,
    currentTimeSeconds: 0,
  },
  submissionState: 'idle', // 'idle' | 'submitting' | 'submitted' | 'expired' | 'advancing'
  loadingData: true,
  resultId: null,
};

const attemptSlice = createSlice({
  name: 'attempt',
  initialState,
  reducers: {
    hydrateAttempt(state, action) {
      // Backend returns { attempt: {...}, passages: [...] }
      const payloadData = action.payload.attempt ? { ...action.payload.attempt, passages: action.payload.passages, savedAnswers: action.payload.savedAnswers } : action.payload;
      const { id, mode, currentSegment, expiresAt, passages, savedAnswers, audioPlayedState } = payloadData;
      state.attemptId = id;
      state.mode = mode;
      state.currentSegment = currentSegment;
      state.expiresAt = expiresAt;
      state.passages = passages || [];
      
      const extractedAnswers = {};
      (passages || []).forEach(p => {
        (p.questions || []).forEach(q => {
          if (q.savedAnswer !== undefined && q.savedAnswer !== null) {
            extractedAnswers[q.id] = q.savedAnswer;
          }
        });
      });
      state.answers = savedAnswers || extractedAnswers;
      
      // Initialize answerStatus
      const newStatus = {};
      let firstQuestionId = null;
      (passages || []).forEach(p => {
        (p.questions || []).forEach(q => {
          if (!firstQuestionId) firstQuestionId = q.id;
          const ans = state.answers[q.id];
          let hasAnswer = false;
          if (ans !== undefined && ans !== null) {
            if (typeof ans === 'object') {
              hasAnswer = Object.values(ans).some(val => val && val.trim() !== '');
            } else if (typeof ans === 'string') {
              hasAnswer = ans.trim() !== '';
            }
          }
          newStatus[q.id] = hasAnswer ? 'answered' : 'unanswered';
        });
      });
      state.answerStatus = newStatus;
      state.activeQuestionId = firstQuestionId;
      
      if (audioPlayedState) {
        state.audioPlaybackState = { ...state.audioPlaybackState, ...audioPlayedState };
      } else {
        // default: no replay unless standalone practice listening maybe, but contract says assume false everywhere
        const initialAudioState = {};
        (passages || []).forEach(p => {
          if (p.skill === 'listening') {
             initialAudioState[p.id] = { hasPlayed: false };
          }
        });
        state.audioPlaybackState = initialAudioState;
      }
      state.loadingData = false;
      state.submissionState = 'idle';
    },
    setAnswer(state, action) {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
      
      if (state.answerStatus[questionId] !== 'flagged') {
        let hasAnswer = false;
        if (answer !== undefined && answer !== null) {
          if (typeof answer === 'object') {
            hasAnswer = Object.values(answer).some(val => val && val.trim() !== '');
          } else if (typeof answer === 'string') {
            hasAnswer = answer.trim() !== '';
          }
        }
        state.answerStatus[questionId] = hasAnswer ? 'answered' : 'unanswered';
      }
    },
    toggleFlag(state, action) {
      const { questionId } = action.payload;
      if (state.answerStatus[questionId] === 'flagged') {
        const ans = state.answers[questionId];
        let hasAnswer = false;
        if (ans !== undefined && ans !== null) {
          if (typeof ans === 'object') {
            hasAnswer = Object.values(ans).some(val => val && val.trim() !== '');
          } else if (typeof ans === 'string') {
            hasAnswer = ans.trim() !== '';
          }
        }
        state.answerStatus[questionId] = hasAnswer ? 'answered' : 'unanswered';
      } else {
        state.answerStatus[questionId] = 'flagged';
      }
    },
    setActiveQuestion(state, action) {
      state.activeQuestionId = action.payload;
    },
    setAudioHasPlayed(state, action) {
      const { passageId, hasPlayed } = action.payload;
      if (!state.audioPlaybackState) state.audioPlaybackState = {};
      if (!state.audioPlaybackState[passageId]) {
        state.audioPlaybackState[passageId] = { hasPlayed: false };
      }
      state.audioPlaybackState[passageId].hasPlayed = hasPlayed;
    },
    setSubmissionState(state, action) {
      state.submissionState = action.payload;
    },
    resetAttempt(state) {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAttempt.pending, (state) => {
        state.submissionState = 'submitting';
      })
      .addCase(submitAttempt.fulfilled, (state, action) => {
        state.submissionState = 'submitted';
        const responseData = action.payload?.data || action.payload;
        if (responseData?.results && responseData.results.length > 0) {
          // If full_test, find the overall result, otherwise take the first one
          const overall = responseData.results.find(r => r.skill === 'overall');
          state.resultId = overall ? overall.resultId : responseData.results[0].resultId;
        } else {
          state.resultId = responseData?.resultId;
        }
      })
      .addCase(submitAttempt.rejected, (state) => {
        state.submissionState = 'idle'; // fallback
      })
      .addCase(advanceSegment.pending, (state) => {
        state.submissionState = 'advancing';
      })
      .addCase(advanceSegment.fulfilled, (state, action) => {
        const payloadData = action.payload.data || action.payload;
        const attempt = payloadData.attempt || {};
        const passages = payloadData.passages || [];
        
        state.currentSegment = attempt.currentSegment;
        state.expiresAt = attempt.expiresAt;
        state.passages = passages;
        state.answers = {};
        
        const newStatus = {};
        let firstQuestionId = null;
        (state.passages).forEach(p => {
          (p.questions || []).forEach(q => {
            if (!firstQuestionId) firstQuestionId = q.id;
            newStatus[q.id] = 'unanswered';
          });
        });
        state.answerStatus = newStatus;
        state.activeQuestionId = firstQuestionId;
        state.submissionState = 'idle';
      })
      .addCase(advanceSegment.rejected, (state) => {
        state.submissionState = 'idle';
      });
  }
});

export const { hydrateAttempt, setAnswer, toggleFlag, setActiveQuestion, setAudioHasPlayed, setSubmissionState, resetAttempt } = attemptSlice.actions;
export default attemptSlice.reducer;
