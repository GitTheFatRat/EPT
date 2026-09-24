import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
/**
 * @param {string} userId
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<object>}
 */
export const listResults = async (userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { data: results, count, error } = await supabase
        .from('exam_results')
        .select('id, attempt_id, exam_id, skill, correct_count, wrong_count, skipped_count, total_questions, band_score, created_at, exams(title, code)', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
    if (error)
        throw new AppError(500, 'DB_ERROR', error.message);
    return {
        items: (results || []).map(r => ({
            id: r.id,
            attemptId: r.attempt_id,
            examId: r.exam_id,
            skill: r.skill,
            correctCount: r.correct_count,
            wrongCount: r.wrong_count,
            skippedCount: r.skipped_count,
            totalQuestions: r.total_questions,
            bandScore: r.band_score,
            createdAt: r.created_at,
            exam: r.exams ? {
                title: r.exams.title,
                code: r.exams.code
            } : null
        })),
        page,
        limit,
        total: count || 0
    };
};
/**
 * @param {string} resultId
 * @param {string} userId
 * @param {string} role
 * @returns {Promise<object>}
 */
export const getResultById = async (resultId, userId, role) => {
    const { data: result, error } = await supabase
        .from('exam_results')
        .select('*, exams(title, code)')
        .eq('id', resultId)
        .single();
    if (error || !result)
        throw new AppError(404, 'NOT_FOUND', 'Result not found');
    if (role !== 'admin' && result.user_id !== userId) {
        throw new AppError(403, 'FORBIDDEN', 'You do not have permission to view this result');
    }
    return {
        id: result.id,
        attemptId: result.attempt_id,
        userId: result.user_id,
        examId: result.exam_id,
        skill: result.skill,
        correctCount: result.correct_count,
        wrongCount: result.wrong_count,
        skippedCount: result.skipped_count,
        totalQuestions: result.total_questions,
        bandScore: result.band_score,
        detailAnswers: result.detail_answers,
        createdAt: result.created_at,
        exam: result.exams ? {
            title: result.exams.title,
            code: result.exams.code
        } : null
    };
};
/**
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const getStats = async (userId) => {
    const { data: results, error } = await supabase
        .from('exam_results')
        .select('skill, band_score, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    if (error)
        throw new AppError(500, 'DB_ERROR', error.message);
    const stats = {
        reading: { total: 0, sum: 0, averageBand: 0, history: [] },
        listening: { total: 0, sum: 0, averageBand: 0, history: [] },
        overall: { total: 0, sum: 0, averageBand: 0, history: [] }
    };
    for (const r of (results || [])) {
        const s = stats[r.skill];
        if (s && r.band_score !== null) {
            s.total++;
            s.sum += parseFloat(r.band_score);
            s.history.push({
                date: r.created_at,
                bandScore: r.band_score
            });
        }
    }
    for (const key of Object.keys(stats)) {
        const s = stats[key];
        s.averageBand = s.total > 0 ? Math.round((s.sum / s.total) * 2) / 2 : 0;
    }
    return {
        reading: { averageBand: stats.reading.averageBand, history: stats.reading.history },
        listening: { averageBand: stats.listening.averageBand, history: stats.listening.history },
        overall: { averageBand: stats.overall.averageBand, history: stats.overall.history }
    };
};

