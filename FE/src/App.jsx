import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import DashboardPage from './features/dashboard/DashboardPage'
import LeaderboardPage from './features/leaderboard/LeaderboardPage'
import ReadingListPage from './features/exam/ReadingListPage'
import ListeningListPage from './features/exam/ListeningListPage'
import MockTestListPage from './features/exam/MockTestListPage'
import AttemptPage from './features/attempt/AttemptPage'

import ResultPage from './features/result/ResultPage'

import ProfilePage from './features/profile/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/exams" element={<DashboardPage />} />
        <Route path="/reading" element={<ReadingListPage />} />
        <Route path="/listening" element={<ListeningListPage />} />
        <Route path="/mock-test" element={<MockTestListPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/settings" element={<ProfilePage />} />
        <Route path="/attempts/:id" element={<AttemptPage />} />
        <Route path="/results/:id" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
