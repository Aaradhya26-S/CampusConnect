import bcrypt from 'bcryptjs';
import { generateReferenceId, PROHIBITED_STUDENT_ID } from '../utils/studentIdGenerator.js';

export type UserRole = 'STUDENT' | 'ADMIN';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  description?: string;
  contactEmail?: string;
  headName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistoryRecord {
  id: string;
  complaintId: string;
  fromStatus: ComplaintStatus | null;
  toStatus: ComplaintStatus;
  changedById: string;
  changedByName?: string;
  note?: string;
  createdAt: string;
}

export interface CommentRecord {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface AttachmentRecord {
  id: string;
  complaintId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  complaintId?: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ComplaintRecord {
  id: string;
  referenceId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  rejectionReason?: string;
  reopenReason?: string;
  studentId: string;
  studentName?: string;
  studentRollNumber?: string;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  assignedStaffName?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: StatusHistoryRecord[];
  comments?: CommentRecord[];
  attachments?: AttachmentRecord[];
}

/**
 * Stateful In-Memory Repository for Seamless Demo / Dev Mode & PostgreSQL fallback
 */
class CampusConnectStore {
  public users: Map<string, UserRecord> = new Map();
  public departments: Map<string, DepartmentRecord> = new Map();
  public complaints: Map<string, ComplaintRecord> = new Map();
  public statusHistories: StatusHistoryRecord[] = [];
  public comments: CommentRecord[] = [];
  public attachments: AttachmentRecord[] = [];
  public notifications: NotificationRecord[] = [];
  public isInitialized = false;

  constructor() {
    this.initStore();
  }

  public async initStore() {
    if (this.isInitialized) return;

    // Seed Departments
    const depts: DepartmentRecord[] = [
      {
        id: 'dept-1',
        name: 'Estate & Infrastructure',
        code: 'EID',
        description: 'Campus buildings, civil works, roads, and structural maintenance',
        contactEmail: 'estate@campusconnect.edu',
        headName: 'Dr. Rajesh Verma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-2',
        name: 'Electrical Maintenance Cell',
        code: 'EMC',
        description: 'Power distribution, lighting, backup generators, and classroom electricals',
        contactEmail: 'electrical@campusconnect.edu',
        headName: 'Er. Suresh Nair',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-3',
        name: 'Water & Sanitation Division',
        code: 'WSD',
        description: 'Water filtration, plumbing, campus cleanliness, and hygiene maintenance',
        contactEmail: 'sanitation@campusconnect.edu',
        headName: 'Smt. Kavita Rao',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-4',
        name: 'IT & Network Services',
        code: 'ITNS',
        description: 'Campus Wi-Fi, LAN infrastructure, computer labs, and smart board maintenance',
        contactEmail: 'ithelpdesk@campusconnect.edu',
        headName: 'Prof. Ananya Sen',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-5',
        name: 'Hostel Welfare & Maintenance',
        code: 'HWM',
        description: 'Hostel rooms, mess facilities, furniture, and residential amenities',
        contactEmail: 'hostelwarden@campusconnect.edu',
        headName: 'Dr. Manpreet Singh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dept-6',
        name: 'Academic Facilities & Library',
        code: 'AFL',
        description: 'Auditoriums, lecture halls, central library resources, and study spaces',
        contactEmail: 'libraryadmin@campusconnect.edu',
        headName: 'Dr. Sunita Deshmukh',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    depts.forEach((d) => this.departments.set(d.id, d));

    // Seed Users
    const studentPassHash = bcrypt.hashSync('DemoStudent123!', 8);
    const adminPassHash = bcrypt.hashSync('DemoAdmin123!', 8);

    const adminUser: UserRecord = {
      id: 'user-admin-1',
      email: 'admin@campusconnect.edu',
      passwordHash: adminPassHash,
      fullName: 'Vikramaditya Oberoi',
      role: 'ADMIN',
      department: 'Central Campus Administration',
      phone: '+91 98765 43210',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const studentUser1: UserRecord = {
      id: 'user-student-1',
      email: 'student@campusconnect.edu',
      passwordHash: studentPassHash,
      fullName: 'Aarav Sharma',
      role: 'STUDENT',
      studentId: '590014298', // Valid compliant 5900XXXXX format
      department: 'Computer Science & Engineering',
      phone: '+91 91234 56789',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const studentUser2: UserRecord = {
      id: 'user-student-2',
      email: 'priya.patel@campusconnect.edu',
      passwordHash: studentPassHash,
      fullName: 'Priya Patel',
      role: 'STUDENT',
      studentId: '590087312', // Valid compliant 5900XXXXX format
      department: 'Electronics & Communication',
      phone: '+91 92345 67890',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const studentUser3: UserRecord = {
      id: 'user-student-3',
      email: 'rohan.mehta@campusconnect.edu',
      passwordHash: studentPassHash,
      fullName: 'Rohan Mehta',
      role: 'STUDENT',
      studentId: '590045621', // Valid compliant 5900XXXXX format
      department: 'Mechanical Engineering',
      phone: '+91 93456 78901',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    [adminUser, studentUser1, studentUser2, studentUser3].forEach((u) => {
      // Runtime check prohibiting forbidden student ID
      if (u.studentId === PROHIBITED_STUDENT_ID) {
        throw new Error(`CRITICAL: Prohibited ID detected in store initialization!`);
      }
      this.users.set(u.id, u);
    });

    // Seed Complaints
    const now = Date.now();
    const day = 86400000;

    const seedComplaints: ComplaintRecord[] = [
      {
        id: 'cmp-1',
        referenceId: 'CC-2025-ELEC01',
        title: 'Fluorescent Lights Flickering in Lecture Hall B-204',
        description: 'The ceiling lights in row 3 and 4 have been flickering constantly since morning, causing eye strain during lectures.',
        category: 'Electricity',
        location: 'Academic Block B, 2nd Floor, Room 204',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        studentId: studentUser1.id,
        studentName: studentUser1.fullName,
        studentRollNumber: studentUser1.studentId,
        assignedDepartmentId: 'dept-2',
        assignedDepartmentName: 'Electrical Maintenance Cell',
        assignedStaffName: 'Ramesh K. (Senior Technician)',
        createdAt: new Date(now - day * 3).toISOString(),
        updatedAt: new Date(now - day * 1).toISOString(),
      },
      {
        id: 'cmp-2',
        referenceId: 'CC-2025-WIFI02',
        title: 'Hostel Block 4 Wi-Fi Access Point Dropping Connections',
        description: 'The central Wi-Fi router on the 3rd floor wing A disconnects every 10 minutes. High packet loss reported by multiple residents.',
        category: 'Internet and Wi-Fi',
        location: 'Boys Hostel 4, 3rd Floor Wing A Corridor',
        priority: 'HIGH',
        status: 'ASSIGNED',
        studentId: studentUser1.id,
        studentName: studentUser1.fullName,
        studentRollNumber: studentUser1.studentId,
        assignedDepartmentId: 'dept-4',
        assignedDepartmentName: 'IT & Network Services',
        assignedStaffName: 'Neha Gupta (Network Admin)',
        createdAt: new Date(now - day * 2).toISOString(),
        updatedAt: new Date(now - day * 1).toISOString(),
      },
      {
        id: 'cmp-3',
        referenceId: 'CC-2025-WATR03',
        title: 'Low Water Pressure and Leaking Tap in Ground Floor Restroom',
        description: 'Water tap near the washbasin is leaking continuously and the main water dispenser has very low flow.',
        category: 'Water Supply',
        location: 'Central Library, Ground Floor East Wing',
        priority: 'MEDIUM',
        status: 'RESOLVED',
        studentId: studentUser2.id,
        studentName: studentUser2.fullName,
        studentRollNumber: studentUser2.studentId,
        assignedDepartmentId: 'dept-3',
        assignedDepartmentName: 'Water & Sanitation Division',
        assignedStaffName: 'Prakash M.',
        resolutionNotes: 'Replaced faulty rubber washer and recalibrated line pressure valve. Water pressure restored to 2.5 bar.',
        resolvedAt: new Date(now - day * 1).toISOString(),
        createdAt: new Date(now - day * 5).toISOString(),
        updatedAt: new Date(now - day * 1).toISOString(),
      },
      {
        id: 'cmp-4',
        referenceId: 'CC-2025-INFR04',
        title: 'Broken Desk Bench in Seminar Room 102',
        description: 'The back support bracket on bench row 2 is detached, posing a safety hazard to seated students.',
        category: 'Infrastructure',
        location: 'Tech Park Block A, Room 102',
        priority: 'LOW',
        status: 'SUBMITTED',
        studentId: studentUser1.id,
        studentName: studentUser1.fullName,
        studentRollNumber: studentUser1.studentId,
        createdAt: new Date(now - day * 1).toISOString(),
        updatedAt: new Date(now - day * 1).toISOString(),
      },
      {
        id: 'cmp-5',
        referenceId: 'CC-2025-CLEN05',
        title: 'Waste Bin Overflowing Near Canteen Courtyard',
        description: 'Outdoor food waste recycling bin has overflowed into the walkway after the afternoon break.',
        category: 'Cleanliness',
        location: 'Main Food Court, Central Courtyard',
        priority: 'URGENT',
        status: 'RESOLVED',
        studentId: studentUser3.id,
        studentName: studentUser3.fullName,
        studentRollNumber: studentUser3.studentId,
        assignedDepartmentId: 'dept-3',
        assignedDepartmentName: 'Water & Sanitation Division',
        assignedStaffName: 'Sunil Verma',
        resolutionNotes: 'Bins emptied, sanitized, and additional segregated bins placed in high-traffic zones.',
        resolvedAt: new Date(now - day * 2).toISOString(),
        createdAt: new Date(now - day * 6).toISOString(),
        updatedAt: new Date(now - day * 2).toISOString(),
      },
      {
        id: 'cmp-6',
        referenceId: 'CC-2025-HOST06',
        title: 'Study Room Air Conditioner Not Cooling in Girls Hostel 2',
        description: 'The split AC unit in the 2nd floor reading hall turns on but blows ambient room temperature air only.',
        category: 'Hostel',
        location: 'Girls Hostel 2, 2nd Floor Common Study Hall',
        priority: 'HIGH',
        status: 'UNDER_REVIEW',
        studentId: studentUser2.id,
        studentName: studentUser2.fullName,
        studentRollNumber: studentUser2.studentId,
        createdAt: new Date(now - day * 2).toISOString(),
        updatedAt: new Date(now - day * 1).toISOString(),
      },
      {
        id: 'cmp-7',
        referenceId: 'CC-2025-LIBR07',
        title: 'Digital Reference Terminal 5 Screen Frozen',
        description: 'The OPAC catalog terminal number 5 is stuck on boot error. Students cannot search journal archives.',
        category: 'Library',
        location: 'Central Library, Periodicals Section',
        priority: 'LOW',
        status: 'CLOSED',
        studentId: studentUser1.id,
        studentName: studentUser1.fullName,
        studentRollNumber: studentUser1.studentId,
        assignedDepartmentId: 'dept-4',
        assignedDepartmentName: 'IT & Network Services',
        assignedStaffName: 'Neha Gupta',
        resolutionNotes: 'Corrupt OS boot sector repaired. Catalog software updated and verified.',
        resolvedAt: new Date(now - day * 7).toISOString(),
        closedAt: new Date(now - day * 6).toISOString(),
        createdAt: new Date(now - day * 10).toISOString(),
        updatedAt: new Date(now - day * 6).toISOString(),
      },
    ];

    seedComplaints.forEach((c) => {
      this.complaints.set(c.id, c);

      // Status history
      this.statusHistories.push({
        id: `sh-${c.id}-1`,
        complaintId: c.id,
        fromStatus: null,
        toStatus: 'SUBMITTED',
        changedById: c.studentId,
        changedByName: c.studentName,
        note: 'Complaint ticket created by student.',
        createdAt: c.createdAt,
      });

      if (c.status !== 'SUBMITTED') {
        this.statusHistories.push({
          id: `sh-${c.id}-2`,
          complaintId: c.id,
          fromStatus: 'SUBMITTED',
          toStatus: c.status,
          changedById: adminUser.id,
          changedByName: adminUser.fullName,
          note: `Complaint moved to ${c.status}. ${c.resolutionNotes || ''}`.trim(),
          createdAt: c.updatedAt,
        });
      }

      // Sample comments
      this.comments.push({
        id: `comm-${c.id}-1`,
        complaintId: c.id,
        userId: c.studentId,
        userName: c.studentName || 'Student',
        userRole: 'STUDENT',
        message: 'Kindly look into this at the earliest during working hours. Thank you.',
        isInternal: false,
        createdAt: c.createdAt,
      });

      if (c.assignedStaffName) {
        this.comments.push({
          id: `comm-${c.id}-2`,
          complaintId: c.id,
          userId: adminUser.id,
          userName: adminUser.fullName,
          userRole: 'ADMIN',
          message: `Work order dispatched. Assigned to ${c.assignedStaffName}.`,
          isInternal: false,
          createdAt: c.updatedAt,
        });
      }
    });

    // Seed Notifications
    this.notifications.push(
      {
        id: 'notif-1',
        userId: studentUser1.id,
        complaintId: 'cmp-1',
        title: 'Technician Assigned',
        message: 'Your complaint CC-2025-ELEC01 has been assigned to Ramesh K. (Senior Technician).',
        type: 'ASSIGNED',
        isRead: false,
        createdAt: new Date(now - 3600000 * 4).toISOString(),
      },
      {
        id: 'notif-2',
        userId: studentUser1.id,
        complaintId: 'cmp-2',
        title: 'Status Update',
        message: 'Your complaint CC-2025-WIFI02 is now ASSIGNED to IT & Network Services.',
        type: 'STATUS_CHANGE',
        isRead: true,
        createdAt: new Date(now - 86400000).toISOString(),
      },
      {
        id: 'notif-3',
        userId: studentUser2.id,
        complaintId: 'cmp-3',
        title: 'Complaint Resolved',
        message: 'Water dispenser maintenance complaint CC-2025-WATR03 has been marked as RESOLVED.',
        type: 'RESOLUTION',
        isRead: true,
        createdAt: new Date(now - 86400000 * 2).toISOString(),
      }
    );

    this.isInitialized = true;
  }

  // --- Users ---
  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) return user;
    }
    return null;
  }

  public async findUserById(id: string): Promise<UserRecord | null> {
    return this.users.get(id) || null;
  }

  public async createUser(data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserRecord> {
    const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const newUser: UserRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, newUser);
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  // --- Departments ---
  public async getAllDepartments(): Promise<DepartmentRecord[]> {
    return Array.from(this.departments.values());
  }

  public async findDepartmentById(id: string): Promise<DepartmentRecord | null> {
    return this.departments.get(id) || null;
  }

  public async createDepartment(data: Omit<DepartmentRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DepartmentRecord> {
    const id = `dept-${Date.now()}`;
    const now = new Date().toISOString();
    const newDept: DepartmentRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.departments.set(id, newDept);
    return newDept;
  }

  // --- Complaints ---
  public async getComplaints(filter?: {
    studentId?: string;
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    departmentId?: string;
  }): Promise<ComplaintRecord[]> {
    let list = Array.from(this.complaints.values());

    if (filter?.studentId) {
      list = list.filter((c) => c.studentId === filter.studentId);
    }
    if (filter?.status && filter.status !== 'ALL') {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter?.category && filter.category !== 'ALL') {
      list = list.filter((c) => c.category === filter.category);
    }
    if (filter?.priority && filter.priority !== 'ALL') {
      list = list.filter((c) => c.priority === filter.priority);
    }
    if (filter?.departmentId && filter.departmentId !== 'ALL') {
      list = list.filter((c) => c.assignedDepartmentId === filter.departmentId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.referenceId.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.studentName && c.studentName.toLowerCase().includes(q)) ||
          (c.studentRollNumber && c.studentRollNumber.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  public async findComplaintById(id: string): Promise<ComplaintRecord | null> {
    const complaint = this.complaints.get(id);
    if (!complaint) {
      // also check by referenceId
      for (const c of this.complaints.values()) {
        if (c.referenceId === id) return this.enrichComplaint(c);
      }
      return null;
    }
    return this.enrichComplaint(complaint);
  }

  private enrichComplaint(complaint: ComplaintRecord): ComplaintRecord {
    const history = this.statusHistories.filter((h) => h.complaintId === complaint.id);
    const comments = this.comments.filter((c) => c.complaintId === complaint.id);
    const attachments = this.attachments.filter((a) => a.complaintId === complaint.id);
    return {
      ...complaint,
      statusHistory: history.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      comments: comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      attachments,
    };
  }

  public async createComplaint(data: {
    title: string;
    description: string;
    category: string;
    location: string;
    priority: ComplaintPriority;
    studentId: string;
    attachmentUrl?: string;
  }): Promise<ComplaintRecord> {
    const id = `cmp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const referenceId = generateReferenceId();
    const student = await this.findUserById(data.studentId);
    const now = new Date().toISOString();

    const newComplaint: ComplaintRecord = {
      id,
      referenceId,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      priority: data.priority,
      status: 'SUBMITTED',
      studentId: data.studentId,
      studentName: student?.fullName || 'Student',
      studentRollNumber: student?.studentId,
      createdAt: now,
      updatedAt: now,
    };

    this.complaints.set(id, newComplaint);

    // Initial status history
    this.statusHistories.push({
      id: `sh-${id}-1`,
      complaintId: id,
      fromStatus: null,
      toStatus: 'SUBMITTED',
      changedById: data.studentId,
      changedByName: student?.fullName,
      note: 'Complaint ticket created by student.',
      createdAt: now,
    });

    // Attachment if provided
    if (data.attachmentUrl) {
      this.attachments.push({
        id: `att-${Date.now()}`,
        complaintId: id,
        filename: 'attachment.jpg',
        originalName: 'evidence.jpg',
        mimeType: 'image/jpeg',
        size: 1024 * 250,
        url: data.attachmentUrl,
        createdAt: now,
      });
    }

    // Add notification to student confirming submission
    this.notifications.push({
      id: `notif-${Date.now()}`,
      userId: data.studentId,
      complaintId: id,
      title: 'Complaint Registered',
      message: `Your ticket ${referenceId} has been successfully submitted and placed in queue.`,
      type: 'SUBMISSION',
      isRead: false,
      createdAt: now,
    });

    return this.enrichComplaint(newComplaint);
  }

  public async updateComplaintStatus(
    id: string,
    toStatus: ComplaintStatus,
    changedById: string,
    options?: {
      note?: string;
      assignedDepartmentId?: string;
      assignedStaffName?: string;
      rejectionReason?: string;
      reopenReason?: string;
      resolutionNotes?: string;
    }
  ): Promise<ComplaintRecord | null> {
    const complaint = this.complaints.get(id);
    if (!complaint) return null;

    const changedBy = await this.findUserById(changedById);
    const prevStatus = complaint.status;
    const now = new Date().toISOString();

    complaint.status = toStatus;
    complaint.updatedAt = now;

    if (options?.note) {
      // note can be recorded
    }
    if (options?.assignedDepartmentId) {
      complaint.assignedDepartmentId = options.assignedDepartmentId;
      const dept = this.departments.get(options.assignedDepartmentId);
      complaint.assignedDepartmentName = dept ? dept.name : undefined;
    }
    if (options?.assignedStaffName !== undefined) {
      complaint.assignedStaffName = options.assignedStaffName;
    }
    if (options?.rejectionReason) {
      complaint.rejectionReason = options.rejectionReason;
    }
    if (options?.reopenReason) {
      complaint.reopenReason = options.reopenReason;
    }
    if (options?.resolutionNotes) {
      complaint.resolutionNotes = options.resolutionNotes;
    }
    if (toStatus === 'RESOLVED') {
      complaint.resolvedAt = now;
    }
    if (toStatus === 'CLOSED') {
      complaint.closedAt = now;
    }

    // Record Status History
    this.statusHistories.push({
      id: `sh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      complaintId: id,
      fromStatus: prevStatus,
      toStatus: toStatus,
      changedById,
      changedByName: changedBy?.fullName || 'System',
      note: options?.note || options?.rejectionReason || options?.reopenReason || `Status transition to ${toStatus}`,
      createdAt: now,
    });

    // Create Notification for the student
    let notifTitle = `Status Changed: ${toStatus}`;
    let notifMsg = `Complaint ${complaint.referenceId} updated to ${toStatus}.`;
    if (toStatus === 'ASSIGNED' && complaint.assignedDepartmentName) {
      notifMsg = `Your complaint ${complaint.referenceId} has been assigned to ${complaint.assignedDepartmentName}.`;
    } else if (toStatus === 'RESOLVED') {
      notifMsg = `Your complaint ${complaint.referenceId} was resolved! ${options?.resolutionNotes || ''}`.trim();
    } else if (toStatus === 'REJECTED') {
      notifMsg = `Your complaint ${complaint.referenceId} was rejected. Reason: ${options?.rejectionReason || 'Not specified'}`;
    }

    this.notifications.push({
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: complaint.studentId,
      complaintId: id,
      title: notifTitle,
      message: notifMsg,
      type: toStatus === 'RESOLVED' ? 'RESOLUTION' : 'STATUS_CHANGE',
      isRead: false,
      createdAt: now,
    });

    return this.enrichComplaint(complaint);
  }

  // --- Comments ---
  public async addComment(data: {
    complaintId: string;
    userId: string;
    message: string;
    isInternal?: boolean;
  }): Promise<CommentRecord> {
    const user = await this.findUserById(data.userId);
    const now = new Date().toISOString();
    const newComment: CommentRecord = {
      id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      complaintId: data.complaintId,
      userId: data.userId,
      userName: user?.fullName || 'User',
      userRole: user?.role || 'STUDENT',
      message: data.message,
      isInternal: !!data.isInternal,
      createdAt: now,
    };

    this.comments.push(newComment);

    // If student commented, notify admin; if admin commented, notify student
    const complaint = this.complaints.get(data.complaintId);
    if (complaint && !data.isInternal) {
      const recipientId = user?.role === 'STUDENT'
        ? Array.from(this.users.values()).find((u) => u.role === 'ADMIN')?.id
        : complaint.studentId;

      if (recipientId) {
        this.notifications.push({
          id: `notif-${Date.now()}`,
          userId: recipientId,
          complaintId: complaint.id,
          title: 'New Message on Complaint',
          message: `${user?.fullName || 'User'} replied: "${data.message.slice(0, 60)}..."`,
          type: 'COMMENT',
          isRead: false,
          createdAt: now,
        });
      }
    }

    return newComment;
  }

  // --- Notifications ---
  public async getUserNotifications(userId: string): Promise<NotificationRecord[]> {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async markNotificationRead(id: string, userId: string): Promise<boolean> {
    const n = this.notifications.find((notif) => notif.id === id && notif.userId === userId);
    if (n) {
      n.isRead = true;
      return true;
    }
    return false;
  }

  public async markAllNotificationsRead(userId: string): Promise<number> {
    let count = 0;
    this.notifications.forEach((n) => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    return count;
  }

  // --- Analytics & Metrics Calculation ---
  public async getAnalyticsMetrics() {
    const list = Array.from(this.complaints.values());
    const total = list.length;
    const pending = list.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
    const inProgress = list.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
    const resolved = list.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    const rejected = list.filter((c) => c.status === 'REJECTED').length;

    // Calculate Average Resolution Time (in hours)
    const resolvedItems = list.filter((c) => c.resolvedAt);
    let avgResolutionHours = 0;
    if (resolvedItems.length > 0) {
      const totalHours = resolvedItems.reduce((acc, c) => {
        const created = new Date(c.createdAt).getTime();
        const res = new Date(c.resolvedAt!).getTime();
        return acc + Math.max(0, (res - created) / (1000 * 60 * 60));
      }, 0);
      avgResolutionHours = Math.round((totalHours / resolvedItems.length) * 10) / 10;
    }

    // Resolution rate
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Category Distribution
    const categoryMap: Record<string, number> = {};
    list.forEach((c) => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });

    const categoriesDistribution = Object.keys(categoryMap).map((cat) => ({
      name: cat,
      count: categoryMap[cat],
      percentage: total > 0 ? Math.round((categoryMap[cat] / total) * 100) : 0,
    }));

    // Status Distribution
    const statusDistribution = [
      { status: 'SUBMITTED', label: 'Submitted', count: list.filter((c) => c.status === 'SUBMITTED').length },
      { status: 'UNDER_REVIEW', label: 'Under Review', count: list.filter((c) => c.status === 'UNDER_REVIEW').length },
      { status: 'ASSIGNED', label: 'Assigned', count: list.filter((c) => c.status === 'ASSIGNED').length },
      { status: 'IN_PROGRESS', label: 'In Progress', count: list.filter((c) => c.status === 'IN_PROGRESS').length },
      { status: 'RESOLVED', label: 'Resolved', count: list.filter((c) => c.status === 'RESOLVED').length },
      { status: 'CLOSED', label: 'Closed', count: list.filter((c) => c.status === 'CLOSED').length },
      { status: 'REJECTED', label: 'Rejected', count: list.filter((c) => c.status === 'REJECTED').length },
    ];

    // Priority Distribution
    const priorityDistribution = [
      { priority: 'LOW', count: list.filter((c) => c.priority === 'LOW').length },
      { priority: 'MEDIUM', count: list.filter((c) => c.priority === 'MEDIUM').length },
      { priority: 'HIGH', count: list.filter((c) => c.priority === 'HIGH').length },
      { priority: 'URGENT', count: list.filter((c) => c.priority === 'URGENT').length },
    ];

    // Monthly Trends (past 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const monthlyTrends: { month: string; submitted: number; resolved: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      monthlyTrends.push({
        month: months[idx],
        submitted: Math.floor(total * 0.4) + (i % 3) * 2 + 3,
        resolved: Math.floor(resolved * 0.4) + (i % 2) * 2 + 2,
      });
    }

    return {
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      avgResolutionHours,
      resolutionRate,
      categoriesDistribution,
      statusDistribution,
      priorityDistribution,
      monthlyTrends,
    };
  }

  // Student specific stats
  public async getStudentStats(studentId: string) {
    const list = Array.from(this.complaints.values()).filter((c) => c.studentId === studentId);
    return {
      total: list.length,
      pending: list.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length,
      inProgress: list.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length,
      resolved: list.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
    };
  }
}

export const campusStore = new CampusConnectStore();
