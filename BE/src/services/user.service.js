import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
/**
 * @param {string} userId
 * @returns {Promise<object>}
 */
export async function getMe(userId) {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, email, full_name, role, avatar_url, banner_url, description, target_band, study_type')
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
/**
 * @param {string} userId
 * @param {object} dto
 * @returns {Promise<object>}
 */
export async function updateMe(userId, dto) {
    const updates = {};
    if (dto.avatarUrl !== undefined)
        updates.avatar_url = dto.avatarUrl;
    if (dto.bannerUrl !== undefined)
        updates.banner_url = dto.bannerUrl;
    if (dto.description !== undefined)
        updates.description = dto.description;
    if (dto.targetBand !== undefined)
        updates.target_band = dto.targetBand;
    if (dto.studyType !== undefined)
        updates.study_type = dto.studyType;
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select('id, username, email, full_name, role, avatar_url, banner_url, description, target_band, study_type')
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


const getExtension = (mimetype, originalName) => {
    if (mimetype === 'image/jpeg') return 'jpg';
    if (mimetype === 'image/png') return 'png';
    if (mimetype === 'image/webp') return 'webp';
    const match = originalName.match(/\.([^.]+)$/);
    return match ? match[1] : 'jpg';
};

export async function uploadAvatar(userId, fileBuffer, mimeType, originalName) {
    const ext = getExtension(mimeType, originalName);
    const fileName = `${userId}-avatar-${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: true
        });

    if (uploadError) {
        throw new AppError(500, 'UPLOAD_FAILED', uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

    if (updateError) {
        throw new AppError(500, 'DB_ERROR', 'Failed to update user avatar_url');
    }

    return publicUrl;
}

export async function uploadBanner(userId, fileBuffer, mimeType, originalName) {
    const ext = getExtension(mimeType, originalName);
    const fileName = `${userId}-banner-${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: true
        });

    if (uploadError) {
        throw new AppError(500, 'UPLOAD_FAILED', uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    const { error: updateError } = await supabase
        .from('users')
        .update({ banner_url: publicUrl })
        .eq('id', userId);

    if (updateError) {
        throw new AppError(500, 'DB_ERROR', 'Failed to update user banner_url');
    }

    return publicUrl;
}

