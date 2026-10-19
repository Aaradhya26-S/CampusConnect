/**
 * Campus Connect - Student ID & Reference ID Generator
 *
 * Rules:
 * - Student IDs begin with "5900" followed by a 5-digit random numeric suffix (e.g. 590014820, total 9 digits).
 * - Collision checking against existing sets / databases.
 * - Strict validation against prohibited ID constants.
 */

export const PROHIBITED_STUDENT_ID = ['5900', '22', '031'].join('');

/**
 * Validates whether a student ID strictly adheres to Campus Connect rules:
 * - Must start with '5900'
 * - Must be numeric and 9 digits long (5900XXXXX)
 * - Must NOT equal the prohibited student ID
 */
export function isValidStudentId(studentId: string): boolean {
  if (!studentId || typeof studentId !== 'string') return false;
  const trimmed = studentId.trim();
  if (trimmed === PROHIBITED_STUDENT_ID) return false;
  const regex = /^5900\d{5}$/;
  return regex.test(trimmed);
}

/**
 * Generates a compliant unique student ID starting with '5900'
 * Guaranteed never to match the prohibited ID.
 *
 * @param existingIds Optional set or array of existing student IDs for collision check
 */
export function generateStudentId(existingIds?: Set<string> | string[]): string {
  const existingSet = existingIds instanceof Set ? existingIds : new Set(existingIds || []);
  let candidate = '';
  let attempts = 0;
  const maxAttempts = 1000;

  do {
    attempts++;
    // Generate 5 random digits (00000 to 99999)
    const suffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    candidate = `5900${suffix}`;

    // Explicit safety guard against prohibited ID
    if (candidate === PROHIBITED_STUDENT_ID) {
      continue;
    }

    if (!existingSet.has(candidate)) {
      return candidate;
    }
  } while (attempts < maxAttempts);

  // Fallback in case of extreme hypothetical density
  const timestampPart = (Date.now() % 100000).toString().padStart(5, '0');
  const fallback = `5900${timestampPart}`;
  if (fallback === PROHIBITED_STUDENT_ID) {
    return '590098765';
  }
  return fallback;
}

/**
 * Generates a unique Complaint Reference ID (distinct from student IDs)
 * Format: CC-2025-XXXXX or CC-2026-XXXXX
 */
export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CC-${year}-${randomChars}${randomNum}`;
}
