import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import examRoutes from './routes/exam.routes.js';
import passageRoutes from './routes/passage.routes.js';
import attemptRoutes from './routes/attempt.routes.js';
import resultRoutes from './routes/result.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/passages', passageRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use(errorHandler);
app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`); // touched
});

