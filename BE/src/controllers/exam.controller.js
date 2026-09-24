import { asyncHandler } from '../utils/asyncHandler.js';
import * as examService from '../services/exam.service.js';
export const listExams = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const published = req.query.published !== undefined ? req.query.published === 'true' : false;
    const exams = await examService.listExams(page, limit, published);
    res.json({ success: true, data: exams });
});
export const getExamByCode = asyncHandler(async (req, res) => {
    const exam = await examService.getExamByCode(req.params.code);
    res.json({ success: true, data: exam });
});
export const createExam = asyncHandler(async (req, res) => {
    const exam = await examService.createExam(req.body, req.user.id);
    res.status(201).json({ success: true, data: exam });
});
export const updateExam = asyncHandler(async (req, res) => {
    const exam = await examService.updateExam(req.params.id, req.body);
    res.json({ success: true, data: exam });
});
export const deleteExam = asyncHandler(async (req, res) => {
    await examService.deleteExam(req.params.id);
    res.json({ success: true, data: null });
});
export const addPassage = asyncHandler(async (req, res) => {
    const passage = await examService.addPassage(req.params.id, req.body, req.file);
    res.status(201).json({ success: true, data: passage });
});
export const addQuestions = asyncHandler(async (req, res) => {
    const questions = await examService.addQuestionsToPassage(req.params.id, req.body);
    res.status(201).json({ success: true, data: questions });
});

