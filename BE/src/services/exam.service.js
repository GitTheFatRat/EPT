import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { stripAnswersFromContent } from '../utils/stripAnswers.js';
/**
 * @param {number} page
 * @param {number} limit
 * @param {boolean} publishedOnly
 * @returns {Promise<object>}
 */
export const listExams = async (page, limit, publishedOnly) => {
    const offset = (page - 1) * limit;
    let query = supabase.from('exams').select('*, passages(id, skill, title)', { count: 'exact' });
    if (publishedOnly) {
        query = query.eq('is_published', true);
    }
    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });
    const { data, error, count } = await query;
    if (error)
        throw new AppError(500, 'DATABASE_ERROR', error.message);
    const items = data.map(item => ({
        id: item.id,
        code: item.code,
        title: item.title,
        description: item.description,
        isPublished: item.is_published,
        createdBy: item.created_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        passages: item.passages,
    }));
    return { items, page, limit, total: count || 0 };
};
/**
 * @param {string} code
 * @returns {Promise<object>}
 */
export const getExamByCode = async (code) => {
    const { data: exam, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('code', code)
        .single();
    if (examError || !exam) {
        if (examError?.code === 'PGRST116')
            throw new AppError(404, 'NOT_FOUND', 'Exam not found');
        throw new AppError(500, 'DATABASE_ERROR', examError?.message || 'Error fetching exam');
    }
    const { data: examPassages, error: passagesError } = await supabase
        .from('exam_passages')
        .select('order_index, passages(*)')
        .eq('exam_id', exam.id)
        .order('order_index', { ascending: true });
    if (passagesError)
        throw new AppError(500, 'DATABASE_ERROR', passagesError.message);
    const passages = examPassages.map(ep => ({
        ...ep.passages,
        exam_id: exam.id,
        order_index: ep.order_index
    }));
    const passageIds = passages.map(p => p.id);
    let questions = [];
    if (passageIds.length > 0) {
        const { data: qData, error: qError } = await supabase
            .from('questions')
            .select('*')
            .in('passage_id', passageIds)
            .order('order_index', { ascending: true });
        if (qError)
            throw new AppError(500, 'DATABASE_ERROR', qError.message);
        questions = qData;
    }
    const formattedPassages = passages.map(p => {
        const pQuestions = questions
            .filter(q => q.passage_id === p.id)
            .map(q => ({
            id: q.id,
            passageId: q.passage_id,
            orderIndex: q.order_index,
            questionNumber: q.question_number,
            type: q.type,
            groupInstruction: q.group_instruction,
            content: stripAnswersFromContent(q.content),
            points: q.points,
            createdAt: q.created_at,
            updatedAt: q.updated_at,
        }));
        return {
            id: p.id,
            examId: p.exam_id,
            skill: p.skill,
            title: p.title,
            passageText: p.passage_text,
            audioUrl: p.audio_url,
            orderIndex: p.order_index,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            questions: pQuestions
        };
    });
    return {
        id: exam.id,
        code: exam.code,
        title: exam.title,
        description: exam.description,
        isPublished: exam.is_published,
        createdBy: exam.created_by,
        createdAt: exam.created_at,
        updatedAt: exam.updated_at,
        passages: formattedPassages
    };
};
/**
 * @param {object} dto
 * @param {string} userId
 * @returns {Promise<object>}
 */
export const createExam = async (dto, userId) => {
    if (!/^[A-Z0-9\-]+$/.test(dto.code)) {
        throw new AppError(400, 'INVALID_CODE_FORMAT', 'Code must contain only uppercase letters, numbers, and dashes');
    }
    const { data, error } = await supabase
        .from('exams')
        .insert({
        code: dto.code,
        title: dto.title,
        description: dto.description,
        is_published: false,
        created_by: userId
    })
        .select()
        .single();
    if (error) {
        if (error.code === '23505')
            throw new AppError(409, 'CONFLICT', 'Exam code already exists');
        throw new AppError(500, 'DATABASE_ERROR', error.message);
    }
    return {
        id: data.id,
        code: data.code,
        title: data.title,
        description: data.description,
        isPublished: data.is_published,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
};
/**
 * @param {string} id
 * @param {object} dto
 * @returns {Promise<object>}
 */
export const updateExam = async (id, dto) => {
    const updateData = {};
    if (dto.title !== undefined)
        updateData.title = dto.title;
    if (dto.description !== undefined)
        updateData.description = dto.description;
    if (dto.isPublished !== undefined)
        updateData.is_published = dto.isPublished;
    const { data, error } = await supabase
        .from('exams')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        throw new AppError(500, 'DATABASE_ERROR', error.message);
    }
    if (!data)
        throw new AppError(404, 'NOT_FOUND', 'Exam not found');
    return {
        id: data.id,
        code: data.code,
        title: data.title,
        description: data.description,
        isPublished: data.is_published,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
};
/**
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteExam = async (id) => {
    const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);
    if (error)
        throw new AppError(500, 'DATABASE_ERROR', error.message);
};
/**
 * @param {string} examId
 * @param {object} dto
 * @param {object} [audioFile]
 * @returns {Promise<object>}
 */
export const addPassage = async (examId, dto, audioFile) => {
    let audioUrl = null;
    if (dto.skill === 'listening' && audioFile) {
        const filePath = `${examId}/${Date.now()}-${audioFile.originalname}`;
        const { error: uploadError } = await supabase.storage
            .from('listening-audio')
            .upload(filePath, audioFile.buffer, { contentType: audioFile.mimetype });
        if (uploadError) {
            throw new AppError(500, 'STORAGE_ERROR', 'Failed to upload audio file');
        }
        const { data: publicUrlData } = supabase.storage
            .from('listening-audio')
            .getPublicUrl(filePath);
        audioUrl = publicUrlData.publicUrl;
    }
    const { data, error } = await supabase
        .from('passages')
        .insert({
        skill: dto.skill,
        title: dto.title,
        passage_text: dto.passageText,
        audio_url: audioUrl
    })
        .select()
        .single();
    if (error)
        throw new AppError(500, 'DATABASE_ERROR', error.message);

    const { error: junctionError } = await supabase
        .from('exam_passages')
        .insert({
        exam_id: examId,
        passage_id: data.id,
        order_index: dto.orderIndex
    });
    if (junctionError)
        throw new AppError(500, 'DATABASE_ERROR', junctionError.message);

    return {
        id: data.id,
        examId: examId,
        skill: data.skill,
        title: data.title,
        passageText: data.passage_text,
        audioUrl: data.audio_url,
        orderIndex: dto.orderIndex,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
};
/**
 * @param {string} passageId
 * @param {object} dto
 * @returns {Promise<object>}
 */
export const addQuestionsToPassage = async (passageId, dto) => {
    const insertData = dto.questions.map((q) => ({
        passage_id: passageId,
        order_index: q.orderIndex,
        question_number: q.questionNumber,
        type: q.type,
        group_instruction: q.groupInstruction,
        content: q.content,
        points: q.points
    }));
    const { data, error } = await supabase
        .from('questions')
        .insert(insertData)
        .select();
    if (error)
        throw new AppError(500, 'DATABASE_ERROR', error.message);
    return { insertedCount: data ? data.length : 0 };
};

