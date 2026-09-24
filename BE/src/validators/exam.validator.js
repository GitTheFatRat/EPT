import { z } from 'zod';
export const createExamSchema = z.object({
    title: z.string(),
    code: z.string(),
    description: z.string().optional(),
});
export const updateExamSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    isPublished: z.boolean().optional(),
});
export const addPassageSchema = z.object({
    skill: z.enum(['reading', 'listening']),
    orderIndex: z.coerce.number().int(),
    title: z.string(),
    passageText: z.string().optional(),
    imageUrl: z.string().url().optional(),
});
export const addQuestionsSchema = z.object({
    questions: z.array(z.object({
        orderIndex: z.number().int(),
        questionNumber: z.number().int(),
        type: z.enum([
            'multiple_choice',
            'true_false_not_given',
            'yes_no_not_given',
            'matching_headings',
            'matching_information',
            'matching_features',
            'sentence_completion',
            'summary_completion',
            'note_completion',
            'table_completion',
            'form_completion',
            'diagram_label_completion',
            'short_answer'
        ]),
        groupInstruction: z.string().optional(),
        content: z.record(z.string(), z.unknown()),
        points: z.number().int().default(1)
    }))
});

