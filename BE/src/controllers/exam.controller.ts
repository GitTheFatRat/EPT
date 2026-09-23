import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as examService from '../services/exam.service.js';

export const listExams = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const published = req.query.published !== undefined ? req.query.published === 'true' : false;
  
  const exams = await examService.listExams(page, limit, published);
  res.json({ success: true, data: exams });
});

export const getExamByCode = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.getExamByCode(req.params.code as string);
  res.json({ success: true, data: exam });
});

export const createExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.createExam(req.body, req.user!.id);
  res.status(201).json({ success: true, data: exam });
});

export const updateExam = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.updateExam(req.params.id as string, req.body);
  res.json({ success: true, data: exam });
});

export const deleteExam = asyncHandler(async (req: Request, res: Response) => {
  await examService.deleteExam(req.params.id as string);
  res.json({ success: true, data: null });
});

export const addPassage = asyncHandler(async (req: Request, res: Response) => {
  const passage = await examService.addPassage(req.params.id as string, req.body, req.file);
  res.status(201).json({ success: true, data: passage });
});

export const addQuestions = asyncHandler(async (req: Request, res: Response) => {
  const questions = await examService.addQuestionsToPassage(req.params.id as string, req.body);
  res.status(201).json({ success: true, data: questions });
});
