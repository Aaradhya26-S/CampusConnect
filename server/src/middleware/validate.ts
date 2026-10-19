import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { PROHIBITED_STUDENT_ID } from '../utils/studentIdGenerator.js';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must have at least 2 characters').max(100),
  email: z.string().email('Please provide a valid university email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  studentId: z
    .string()
    .optional()
    .refine((id) => !id || id !== PROHIBITED_STUDENT_ID, {
      message: 'This student ID is strictly prohibited from use in this application.',
    })
    .refine((id) => !id || /^5900\d{5}$/.test(id), {
      message: 'Student ID must start with 5900 followed by 5 digits (e.g. 590012345)',
    }),
  department: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  login: z.string().min(1, 'Email or Student ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.enum([
    'Infrastructure',
    'Electricity',
    'Water Supply',
    'Cleanliness',
    'Internet and Wi-Fi',
    'Hostel',
    'Classroom',
    'Library',
    'Other',
  ]),
  location: z.string().min(3, 'Location details must be at least 3 characters').max(150),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  attachmentUrl: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']),
  note: z.string().optional(),
  assignedDepartmentId: z.string().optional(),
  assignedStaffName: z.string().optional(),
  rejectionReason: z.string().optional(),
  resolutionNotes: z.string().optional(),
}).refine(
  (data) => {
    if (data.status === 'REJECTED' && (!data.rejectionReason || data.rejectionReason.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'A detailed rejection reason is required when rejecting a complaint.',
    path: ['rejectionReason'],
  }
);

export const reopenComplaintSchema = z.object({
  reopenReason: z.string().min(5, 'Please provide an explanation for reopening this complaint (at least 5 characters)'),
});

export const commentSchema = z.object({
  message: z.string().min(2, 'Comment message must not be empty').max(1000),
  isInternal: z.boolean().optional(),
});

export const departmentSchema = z.object({
  name: z.string().min(3, 'Department name is required'),
  code: z.string().min(2, 'Department code is required').max(10),
  description: z.string().optional(),
  contactEmail: z.string().email().optional(),
  headName: z.string().optional(),
});

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(400).json({
          success: false,
          message: errorMessages[0]?.message || 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      res.status(400).json({ success: false, message: 'Invalid request data' });
    }
  };
}
