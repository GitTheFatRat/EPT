import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';

export async function getLeaderboard() {
    const { data, error } = await supabase
        .from('exam_results')
        .select(`
            user_id,
            band_score,
            users (
                id,
                username,
                full_name,
                avatar_url
            )
        `)
        .eq('skill', 'overall');

    if (error) {
        throw new AppError(500, 'DB_ERROR', error.message);
    }

    if (!data || data.length === 0) {
        return [];
    }

    const userStats = {};

    data.forEach(result => {
        if (!result.users || !result.band_score) return;
        const uid = result.user_id;
        if (!userStats[uid]) {
            userStats[uid] = {
                user_id: uid,
                displayName: result.users.full_name || result.users.username,
                avatarUrl: result.users.avatar_url,
                totalScore: 0,
                testCount: 0
            };
        }
        userStats[uid].totalScore += parseFloat(result.band_score);
        userStats[uid].testCount += 1;
    });

    const leaderboard = Object.values(userStats).map(stat => {
        return {
            userId: stat.user_id,
            displayName: stat.displayName,
            avatarUrl: stat.avatarUrl,
            averageBand: Number((stat.totalScore / stat.testCount).toFixed(1)),
            totalTests: stat.testCount
        };
    });

    leaderboard.sort((a, b) => b.averageBand - a.averageBand || b.totalTests - a.totalTests);

    // Limit to top 50 and assign rank
    return leaderboard.slice(0, 50).map((item, index) => ({
        rank: index + 1,
        ...item
    }));
}
