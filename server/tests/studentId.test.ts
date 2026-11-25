import { describe, it, expect } from 'vitest';
import {
  generateStudentId,
  isValidStudentId,
  generateReferenceId,
  PROHIBITED_STUDENT_ID,
} from '../src/utils/studentIdGenerator.js';

describe('Student ID & Complaint Reference ID Generation', () => {
  it('strictly verifies the prohibited ID constant is configured', () => {
    expect(PROHIBITED_STUDENT_ID).toBeDefined();
    expect(PROHIBITED_STUDENT_ID.length).toBe(9);
  });

  it('rejects the prohibited student ID via isValidStudentId', () => {
    expect(isValidStudentId(PROHIBITED_STUDENT_ID)).toBe(false);
  });

  it('accepts valid 5900XXXXX student IDs', () => {
    expect(isValidStudentId('590014298')).toBe(true);
    expect(isValidStudentId('590087312')).toBe(true);
    expect(isValidStudentId('590045621')).toBe(true);
  });

  it('rejects invalid student ID formats', () => {
    expect(isValidStudentId('123456789')).toBe(false); // Does not start with 5900
    expect(isValidStudentId('5900123')).toBe(false); // Too short
    expect(isValidStudentId('5900123456')).toBe(false); // Too long
    expect(isValidStudentId('5900abcde')).toBe(false); // Non-numeric
    expect(isValidStudentId('')).toBe(false);
  });

  it('generates compliant student IDs starting with 5900', () => {
    const id = generateStudentId();
    expect(id).toMatch(/^5900\d{5}$/);
    expect(id).not.toBe(PROHIBITED_STUDENT_ID);
  });

  it('never generates prohibited student ID in 5,000 continuous iterations', () => {
    for (let i = 0; i < 5000; i++) {
      const generated = generateStudentId();
      expect(generated).not.toBe(PROHIBITED_STUDENT_ID);
      expect(isValidStudentId(generated)).toBe(true);
    }
  });

  it('handles collision detection properly', () => {
    const existing = new Set(['590011111', '590022222']);
    const newId = generateStudentId(existing);
    expect(existing.has(newId)).toBe(false);
    expect(newId).not.toBe(PROHIBITED_STUDENT_ID);
  });

  it('generates distinct complaint reference IDs with CC- prefix and year', () => {
    const ref = generateReferenceId();
    const currentYear = new Date().getFullYear();
    expect(ref.startsWith(`CC-${currentYear}-`)).toBe(true);
    expect(ref).not.toMatch(/^5900/); // Never confused with student ID
  });
});
