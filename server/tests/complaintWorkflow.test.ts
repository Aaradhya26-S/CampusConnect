import { describe, it, expect, beforeEach } from 'vitest';
import { campusStore } from '../src/services/store.js';

describe('Complaint Workflow Lifecycle and Business Rules', () => {
  beforeEach(async () => {
    // Re-initialize or reset store state
    await campusStore.initStore();
  });

  it('creates a new complaint with status SUBMITTED and generates CC reference ID', async () => {
    const student = await campusStore.findUserByEmail('student@campusconnect.edu');
    expect(student).not.toBeNull();

    const complaint = await campusStore.createComplaint({
      title: 'Water filter leaking on 2nd floor library',
      description: 'The drinking water cooler is leaking water onto the tile walkway.',
      category: 'Water Supply',
      location: 'Central Library, 2nd Floor',
      priority: 'HIGH',
      studentId: student!.id,
    });

    expect(complaint.id).toBeDefined();
    expect(complaint.status).toBe('SUBMITTED');
    expect(complaint.referenceId).toMatch(/^CC-\d{4}-/);
    expect(complaint.statusHistory).toHaveLength(1);
    expect(complaint.statusHistory![0].toStatus).toBe('SUBMITTED');
  });

  it('allows administrator to transition complaint from SUBMITTED to UNDER_REVIEW, then ASSIGNED, then IN_PROGRESS, then RESOLVED, then CLOSED', async () => {
    const student = await campusStore.findUserByEmail('student@campusconnect.edu');
    const admin = await campusStore.findUserByEmail('admin@campusconnect.edu');

    const created = await campusStore.createComplaint({
      title: 'Classroom Projector HDMI Cable Damaged',
      description: 'HDMI cable is loose and does not transmit video signal.',
      category: 'Classroom',
      location: 'Block A, Room 101',
      priority: 'MEDIUM',
      studentId: student!.id,
    });

    // 1. Move to UNDER_REVIEW
    const underReview = await campusStore.updateComplaintStatus(created.id, 'UNDER_REVIEW', admin!.id, {
      note: 'Complaint acknowledged by admin desk.',
    });
    expect(underReview?.status).toBe('UNDER_REVIEW');

    // 2. Move to ASSIGNED
    const assigned = await campusStore.updateComplaintStatus(created.id, 'ASSIGNED', admin!.id, {
      assignedDepartmentId: 'dept-4',
      assignedStaffName: 'Vikram Staff',
      note: 'Dispatched to IT & Network Services.',
    });
    expect(assigned?.status).toBe('ASSIGNED');
    expect(assigned?.assignedDepartmentId).toBe('dept-4');

    // 3. Move to IN_PROGRESS
    const inProgress = await campusStore.updateComplaintStatus(created.id, 'IN_PROGRESS', admin!.id, {
      note: 'Technician on site replacing cable.',
    });
    expect(inProgress?.status).toBe('IN_PROGRESS');

    // 4. Move to RESOLVED
    const resolved = await campusStore.updateComplaintStatus(created.id, 'RESOLVED', admin!.id, {
      resolutionNotes: 'HDMI replacement completed and verified with laptop test.',
    });
    expect(resolved?.status).toBe('RESOLVED');
    expect(resolved?.resolvedAt).toBeDefined();

    // 5. Move to CLOSED
    const closed = await campusStore.updateComplaintStatus(created.id, 'CLOSED', admin!.id, {
      note: 'Student satisfied with resolution.',
    });
    expect(closed?.status).toBe('CLOSED');
    expect(closed?.closedAt).toBeDefined();
  });

  it('records rejection reason properly when complaint is rejected', async () => {
    const student = await campusStore.findUserByEmail('student@campusconnect.edu');
    const admin = await campusStore.findUserByEmail('admin@campusconnect.edu');

    const created = await campusStore.createComplaint({
      title: 'Duplicate ticket for wifi issue',
      description: 'Another report of the same wifi issue.',
      category: 'Internet and Wi-Fi',
      location: 'Hostel 4',
      priority: 'LOW',
      studentId: student!.id,
    });

    const rejected = await campusStore.updateComplaintStatus(created.id, 'REJECTED', admin!.id, {
      rejectionReason: 'Duplicate ticket. Original issue already addressed under ticket CC-2025-WIFI02.',
    });

    expect(rejected?.status).toBe('REJECTED');
    expect(rejected?.rejectionReason).toContain('Duplicate ticket');
  });

  it('allows reopening of resolved complaints with mandatory explanation', async () => {
    const student = await campusStore.findUserByEmail('student@campusconnect.edu');
    const admin = await campusStore.findUserByEmail('admin@campusconnect.edu');

    const created = await campusStore.createComplaint({
      title: 'Ceiling fan making clicking sound',
      description: 'Noise disturbing study hall.',
      category: 'Electricity',
      location: 'Block C, Room 301',
      priority: 'LOW',
      studentId: student!.id,
    });

    // Resolve it
    await campusStore.updateComplaintStatus(created.id, 'UNDER_REVIEW', admin!.id);
    await campusStore.updateComplaintStatus(created.id, 'IN_PROGRESS', admin!.id);
    await campusStore.updateComplaintStatus(created.id, 'RESOLVED', admin!.id, {
      resolutionNotes: 'Bearings lubricated.',
    });

    // Reopen it
    const reopened = await campusStore.updateComplaintStatus(created.id, 'UNDER_REVIEW', student!.id, {
      reopenReason: 'The clicking sound returned after 30 minutes of running.',
      note: 'Reopened by student with justification.',
    });

    expect(reopened?.status).toBe('UNDER_REVIEW');
    expect(reopened?.reopenReason).toBe('The clicking sound returned after 30 minutes of running.');
  });
});
