import { Response } from 'express';
import { campusStore } from '../services/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function getDepartments(_req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const departments = await campusStore.getAllDepartments();
    res.status(200).json({ success: true, departments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch departments', error: error.message });
  }
}

export async function createDepartment(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, code, description, contactEmail, headName } = req.body;
    const existing = Array.from(campusStore.departments.values()).find(
      (d) => d.code.toUpperCase() === code.toUpperCase() || d.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      res.status(400).json({ success: false, message: 'Department with this name or code already exists.' });
      return;
    }

    const dept = await campusStore.createDepartment({
      name,
      code: code.toUpperCase(),
      description,
      contactEmail,
      headName,
    });

    res.status(201).json({ success: true, message: 'Department created successfully', department: dept });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create department', error: error.message });
  }
}
