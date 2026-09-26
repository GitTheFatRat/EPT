import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    let accessToken = localStorage.getItem('accessToken');
    let refreshToken = localStorage.getItem('refreshToken');
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (accessToken === 'undefined') accessToken = null;
    if (refreshToken === 'undefined') refreshToken = null;

    return {
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      user: user || null,
    };
  } catch (e) {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      localStorage.setItem('accessToken', action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
