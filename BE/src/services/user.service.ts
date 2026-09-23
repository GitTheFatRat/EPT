import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import type { UpdateProfileDTO } from '../validators/auth.validator.js';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  targetBand: number | null;
  studyType: string | null;
}

export async function getMe(userId: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, role, avatar_url, banner_url, description, target_band, study_type')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role,
    avatarUrl: data.avatar_url,
    bannerUrl: data.banner_url,
    description: data.description,
    targetBand: data.target_band,
    studyType: data.study_type,
  };
}

export async function updateMe(userId: string, dto: UpdateProfileDTO): Promise<User> {
  const updates: Record<string, any> = {};
  if (dto.avatarUrl !== undefined) updates.avatar_url = dto.avatarUrl;
  if (dto.bannerUrl !== undefined) updates.banner_url = dto.bannerUrl;
  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.targetBand !== undefined) updates.target_band = dto.targetBand;
  if (dto.studyType !== undefined) updates.study_type = dto.studyType;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, username, email, role, avatar_url, banner_url, description, target_band, study_type')
    .single();

  if (error || !data) {
    throw new AppError(400, 'BAD_REQUEST', 'Failed to update user profile');
  }

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    role: data.role,
    avatarUrl: data.avatar_url,
    bannerUrl: data.banner_url,
    description: data.description,
    targetBand: data.target_band,
    studyType: data.study_type,
  };
}
