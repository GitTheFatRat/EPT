import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;
export const hashPassword = async (plaintext) => {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
};
export const verifyPassword = async (plaintext, hash) => {
    return bcrypt.compare(plaintext, hash);
};

