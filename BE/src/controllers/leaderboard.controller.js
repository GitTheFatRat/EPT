import * as leaderboardService from '../services/leaderboard.service.js';

export async function getLeaderboard(req, res, next) {
    try {
        const leaderboard = await leaderboardService.getLeaderboard();
        res.json({
            status: 'success',
            data: leaderboard
        });
    } catch (err) {
        next(err);
    }
}
