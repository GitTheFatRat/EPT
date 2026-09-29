import crypto from 'node:crypto';
import { supabase } from '../db/supabaseClient.js';
import { AppError } from '../utils/AppError.js';
import { hashPassword, verifyPassword } from '../security/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, hashToken, } from '../security/token.js';
/**
 * @param {object} dto
 * @returns {Promise<object>}
 */
export async function register(dto) {
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${dto.email},username.eq.${dto.username}`)
        .maybeSingle();
    if (existingUser) {
        throw new AppError(409, 'CONFLICT', 'Email or username already exists');
    }
    const passwordHash = await hashPassword(dto.password);
    const { data, error } = await supabase
        .from('users')
        .insert({
        email: dto.email,
        username: dto.username,
        full_name: dto.fullName,
        password_hash: passwordHash,
    })
        .select('id, username, email, full_name')
        .single();
    if (error || !data) {
        throw new AppError(500, 'INTERNAL_SERVER_ERROR', 'Failed to create user');
    }
    return data;
}
/**
 * @param {object} dto
 * @returns {Promise<object>}
 */
export async function login(dto) {
    const { data: user, error } = await supabase
        .from('users')
        .select('id, username, email, password_hash, role, full_name')
        .eq('email', dto.email)
        .single();
    if (error || !user) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    const isPasswordValid = await verifyPassword(dto.password, user.password_hash);
    if (!isPasswordValid) {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    const tokenId = crypto.randomUUID();
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, tokenId });
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error: insertError } = await supabase
        .from('refresh_tokens')
        .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
    });
    if (insertError) {
        throw new AppError(500, 'INTERNAL_SERVER_ERROR', 'Failed to create refresh token');
    }
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
        },
    };
}
/**
 * @param {object} dto
 * @returns {Promise<object>}
 */
export async function refresh(dto) {
    let payload;
    try {
        payload = verifyRefreshToken(dto.refreshToken);
    }
    catch (err) {
        throw new AppError(401, 'INVALID_TOKEN', 'Invalid or expired refresh token');
    }
    const tokenHash = hashToken(dto.refreshToken);
    const { data: tokenData, error: tokenError } = await supabase
        .from('refresh_tokens')
        .select('id, revoked_at')
        .eq('token_hash', tokenHash)
        .single();
    if (tokenError || !tokenData || tokenData.revoked_at !== null) {
        throw new AppError(401, 'INVALID_TOKEN', 'Invalid or revoked refresh token');
    }
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', payload.userId)
        .single();
    if (userError || !user) {
        throw new AppError(401, 'INVALID_TOKEN', 'User no longer exists');
    }
    const accessToken = signAccessToken({ userId: payload.userId, role: user.role });
    return { accessToken };
}
/**
 * @param {object} dto
 * @returns {Promise<void>}
 */
export async function logout(dto) {
    try {
        const tokenHash = hashToken(dto.refreshToken);
        await supabase
            .from('refresh_tokens')
            .update({ revoked_at: new Date().toISOString() })
            .eq('token_hash', tokenHash);
    }
    catch (err) {
        // Ignore errors on logout
    }
}



