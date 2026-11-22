import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { campusStore } from '../services/store.js';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { generateStudentId, PROHIBITED_STUDENT_ID } from '../utils/studentIdGenerator.js';

export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { email, password, fullName, studentId: customStudentId, department, phone } = req.body;

    // Check if user already exists
    const existingUser = await campusStore.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    // Determine student ID
    let finalStudentId = customStudentId;
    if (finalStudentId) {
      if (finalStudentId === PROHIBITED_STUDENT_ID) {
        res.status(400).json({ success: false, message: 'This student ID is prohibited.' });
        return;
      }
      // Check if studentId in use
      const allUsers = Array.from(campusStore.users.values());
      if (allUsers.some((u) => u.studentId === finalStudentId)) {
        res.status(400).json({ success: false, message: 'This Student ID is already registered.' });
        return;
      }
    } else {
      const existingIds = Array.from(campusStore.users.values())
        .map((u) => u.studentId)
        .filter(Boolean) as string[];
      finalStudentId = generateStudentId(existingIds);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await campusStore.createUser({
      email,
      passwordHash,
      fullName,
      role: 'STUDENT',
      studentId: finalStudentId,
      department: department || 'General Engineering',
      phone: phone || '',
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Student account successfully registered!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        studentId: newUser.studentId,
        department: newUser.department,
        phone: newUser.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
}

export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { login: identifier, password } = req.body;
    const normalized = identifier.trim().toLowerCase();

    // Look for user by email or student ID
    let user = await campusStore.findUserByEmail(normalized);
    if (!user) {
      const allUsers = Array.from(campusStore.users.values());
      user = allUsers.find((u) => u.studentId && u.studentId.toLowerCase() === normalized) || null;
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email/student ID and password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your password.' });
      return;
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const user = await campusStore.findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile', error: error.message });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { fullName, department, phone } = req.body;
    const updated = await campusStore.updateUser(req.user.id, {
      fullName: fullName?.trim() || req.user.fullName,
      department: department?.trim() || req.user.department,
      phone: phone?.trim(),
    });

    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        email: updated.email,
        fullName: updated.fullName,
        role: updated.role,
        studentId: updated.studentId,
        department: updated.department,
        phone: updated.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
}

export async function getDemoAccounts(_req: AuthenticatedRequest, res: Response): Promise<void> {
  res.status(200).json({
    success: true,
    accounts: [
      {
        role: 'STUDENT',
        label: 'Aarav Sharma (Student Demo)',
        email: 'student@campusconnect.edu',
        password: 'DemoStudent123!',
        studentId: '590014298',
        department: 'Computer Science & Engineering',
      },
      {
        role: 'ADMIN',
        label: 'Vikramaditya Oberoi (Administrator Demo)',
        email: 'admin@campusconnect.edu',
        password: 'DemoAdmin123!',
        department: 'Central Campus Administration',
      },
    ],
  });
}
