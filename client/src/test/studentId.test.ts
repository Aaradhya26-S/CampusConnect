import { describe, it, expect } from 'vitest';
import { generateStudentId, isValidStudentId, PROHIBITED_STUDENT_ID } from '../utils/studentId';

describe('Client Student ID Safety & Validation', () => {
  it('prohibits forbidden student ID from passing validation', () => {
    expect(PROHIBITED_STUDENT_ID).toBeDefined();
    expect(isValidStudentId(PROHIBITED_STUDENT_ID)).toBe(false);
  });

  it('validates standard 5900-series 9-digit student IDs', () => {
    expect(isValidStudentId('590014298')).toBe(true);
    expect(isValidStudentId('590087312')).toBe(true);
    expect(isValidStudentId('590045621')).toBe(true);
  });

  it('rejects malformed IDs', () => {
    expect(isValidStudentId('123456789')).toBe(false);
    expect(isValidStudentId('5900123')).toBe(false);
    expect(isValidStudentId('')).toBe(false);
  });

  it('generates student ID compliant with 5900 prefix and never equals prohibited ID in 1000 generations', () => {
    for (let i = 0; i < 1000; i++) {
      const id = generateStudentId();
      expect(id).toMatch(/^5900\d{5}$/);
      expect(id).not.toBe(PROHIBITED_STUDENT_ID);
    }
  });
});
