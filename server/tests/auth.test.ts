import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { campusStore } from '../src/services/store.js';
import { PROHIBITED_STUDENT_ID } from '../src/utils/studentIdGenerator.js';

describe('Authentication & Authorization Integration Tests', () => {
  beforeEach(async () => {
    await campusStore.initStore();
  });

  it('rejects registration with prohibited student ID', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test Blocked Student',
        email: 'blocked@campusconnect.edu',
        password: 'Password123!',
        studentId: PROHIBITED_STUDENT_ID,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('registers a student with auto-generated valid student ID starting with 5900', async () => {
    const testEmail = `newstudent_${Date.now()}@campusconnect.edu`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Rhea Chakraborty',
        email: testEmail,
        password: 'SecurePass123!',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.studentId).toMatch(/^5900\d{5}$/);
    expect(res.body.user.studentId).not.toBe(PROHIBITED_STUDENT_ID);
  });

  it('authenticates demo student and returns JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'student@campusconnect.edu',
        password: 'DemoStudent123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('STUDENT');
  });

  it('authenticates demo student using Student ID instead of email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        login: '590014298',
        password: 'DemoStudent123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('student@campusconnect.edu');
  });

  it('authenticates demo administrator and returns admin role', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'admin@campusconnect.edu',
        password: 'DemoAdmin123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('ADMIN');
  });

  it('blocks student role from accessing admin analytics dashboard', async () => {
    // 1. Login as student
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'student@campusconnect.edu',
        password: 'DemoStudent123!',
      });

    const studentToken = studentLogin.body.token;

    // 2. Try to access admin analytics
    const res = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('allows administrator to access admin analytics dashboard', async () => {
    // 1. Login as admin
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        login: 'admin@campusconnect.edu',
        password: 'DemoAdmin123!',
      });

    const adminToken = adminLogin.body.token;

    // 2. Access admin analytics
    const res = await request(app)
      .get('/api/analytics/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.metrics).toBeDefined();
    expect(res.body.metrics.total).toBeGreaterThan(0);
  });
});
