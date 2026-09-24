/**
 * Generates a unique username from a full name by removing accents, spaces, and appending a random 4-digit number.
 * @param {string} fullName
 * @returns {string}
 */
export function generateUsernameFromFullName(fullName) {
  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, "") // Remove spaces
    .toLowerCase(); // Convert to lowercase
  
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${normalized}${randomNum}`;
}
