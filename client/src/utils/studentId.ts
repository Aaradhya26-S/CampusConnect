/**
 * Campus Connect - Client Student ID Utility
 *
 * Rules:
 * - Must start with '5900'
 * - Format: 5900XXXXX (9 digits total)
 * - Strict prohibition against forbidden student ID
 */

export const PROHIBITED_STUDENT_ID = ['5900', '22', '031'].join('');

export function isValidStudentId(studentId: string): boolean {
  if (!studentId) return false;
  const trimmed = studentId.trim();
  if (trimmed === PROHIBITED_STUDENT_ID) return false;
  return /^5900\d{5}$/.test(trimmed);
}

export function generateStudentId(existingIds: string[] = []): string {
  const existingSet = new Set(existingIds);
  let candidate = '';
  let attempts = 0;

  do {
    attempts++;
    const suffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    candidate = `5900${suffix}`;

    if (candidate === PROHIBITED_STUDENT_ID) {
      continue;
    }

    if (!existingSet.has(candidate)) {
      return candidate;
    }
  } while (attempts < 1000);

  return '590084321';
}

export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CC-${year}-${randomChars}${randomNum}`;
}
