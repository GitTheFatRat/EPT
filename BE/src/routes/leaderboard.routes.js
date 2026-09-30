import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', leaderboardController.getLeaderboard);

export default router;
