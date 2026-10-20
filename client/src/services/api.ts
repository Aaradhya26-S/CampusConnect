import { User, Complaint, Department, NotificationItem, AnalyticsData, ComplaintStatus, ComplaintPriority } from '../types';
import { DEMO_USERS, DEMO_COMPLAINTS, DEMO_DEPARTMENTS, DEMO_NOTIFICATIONS, DEMO_ANALYTICS } from './demoData';
import { generateReferenceId } from '../utils/studentId';

const BASE_URL = '/api';

class ApiClient {
  private token: string | null = null;
  private isDemoMode = false;
  private localComplaints: Complaint[] = [...DEMO_COMPLAINTS];
  private localNotifications: NotificationItem[] = [...DEMO_NOTIFICATIONS];
  private localDepartments: Department[] = [...DEMO_DEPARTMENTS];

  constructor() {
    this.token = localStorage.getItem('cc_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('cc_token', token);
    } else {
      localStorage.removeItem('cc_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // --- Auth API ---
  public async login(loginId: string, pass: string): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: loginId, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      this.setToken(data.token);
      return { user: data.user, token: data.token };
    } catch (err: any) {
      // If server unreachable, check demo credentials
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('fetch')) {
        console.warn('Backend server offline or unreachable. Using Client Demo Mode authentication.');
        const norm = loginId.trim().toLowerCase();
        let demoUser: User | null = null;
        if (norm === 'admin@campusconnect.edu' || norm === 'admin') {
          demoUser = DEMO_USERS.admin;
        } else {
          demoUser = DEMO_USERS.student;
        }
        const fakeToken = `demo-token-${demoUser.role.toLowerCase()}-${Date.now()}`;
        this.setToken(fakeToken);
        this.isDemoMode = true;
        return { user: demoUser, token: fakeToken };
      }
      throw err;
    }
  }

  public async register(userData: {
    fullName: string;
    email: string;
    password: string;
    studentId?: string;
    department?: string;
    phone?: string;
  }): Promise<{ user: User; token: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      this.setToken(data.token);
      return { user: data.user, token: data.token };
    } catch (err: any) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const newUser: User = {
          id: `demo-user-${Date.now()}`,
          fullName: userData.fullName,
          email: userData.email,
          role: 'STUDENT',
          studentId: userData.studentId || '590099123',
          department: userData.department || 'Computer Science',
          phone: userData.phone || '',
        };
        const fakeToken = `demo-token-student-${Date.now()}`;
        this.setToken(fakeToken);
        return { user: newUser, token: fakeToken };
      }
      throw err;
    }
  }

  public async getMe(): Promise<User | null> {
    if (!this.token) return null;
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          this.setToken(null);
          return null;
        }
        throw new Error('Failed to get user');
      }
      const data = await res.json();
      return data.user;
    } catch (err) {
      // Fallback
      if (this.token?.includes('admin')) return DEMO_USERS.admin;
      if (this.token?.includes('student')) return DEMO_USERS.student;
      return null;
    }
  }

  public async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      return data.user;
    } catch (err: any) {
      return { ...DEMO_USERS.student, ...updates };
    }
  }

  // --- Complaints API ---
  public async getComplaints(filter?: {
    status?: string;
    category?: string;
    priority?: string;
    departmentId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ complaints: Complaint[]; total: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filter?.status && filter.status !== 'ALL') params.append('status', filter.status);
      if (filter?.category && filter.category !== 'ALL') params.append('category', filter.category);
      if (filter?.priority && filter.priority !== 'ALL') params.append('priority', filter.priority);
      if (filter?.departmentId && filter.departmentId !== 'ALL') params.append('departmentId', filter.departmentId);
      if (filter?.search) params.append('search', filter.search);
      if (filter?.page) params.append('page', filter.page.toString());
      if (filter?.limit) params.append('limit', filter.limit.toString());

      const res = await fetch(`${BASE_URL}/complaints?${params.toString()}`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch complaints');
      return {
        complaints: data.complaints,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      };
    } catch (err) {
      // Demo fallback filtering
      let list = [...this.localComplaints];
      if (filter?.status && filter.status !== 'ALL') list = list.filter((c) => c.status === filter.status);
      if (filter?.category && filter.category !== 'ALL') list = list.filter((c) => c.category === filter.category);
      if (filter?.priority && filter.priority !== 'ALL') list = list.filter((c) => c.priority === filter.priority);
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        list = list.filter((c) => c.title.toLowerCase().includes(q) || c.referenceId.toLowerCase().includes(q));
      }
      return {
        complaints: list,
        total: list.length,
        totalPages: Math.ceil(list.length / 10),
      };
    }
  }

  public async getComplaintById(id: string): Promise<Complaint> {
    try {
      const res = await fetch(`${BASE_URL}/complaints/${id}`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch complaint');
      return data.complaint;
    } catch (err) {
      const found = this.localComplaints.find((c) => c.id === id || c.referenceId === id);
      if (found) return found;
      throw new Error('Complaint not found');
    }
  }

  public async createComplaint(payload: {
    title: string;
    description: string;
    category: string;
    location: string;
    priority: ComplaintPriority;
    attachmentUrl?: string;
  }): Promise<Complaint> {
    try {
      const res = await fetch(`${BASE_URL}/complaints`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit complaint');
      return data.complaint;
    } catch (err) {
      const newRef = generateReferenceId();
      const newCmp: Complaint = {
        id: `cmp-${Date.now()}`,
        referenceId: newRef,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        location: payload.location,
        priority: payload.priority,
        status: 'SUBMITTED',
        studentId: DEMO_USERS.student.id,
        studentName: DEMO_USERS.student.fullName,
        studentRollNumber: DEMO_USERS.student.studentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            id: `sh-${Date.now()}`,
            complaintId: `cmp-${Date.now()}`,
            fromStatus: null,
            toStatus: 'SUBMITTED',
            changedById: DEMO_USERS.student.id,
            changedByName: DEMO_USERS.student.fullName,
            note: 'Complaint registered by student.',
            createdAt: new Date().toISOString(),
          },
        ],
        comments: [],
      };
      this.localComplaints.unshift(newCmp);
      return newCmp;
    }
  }

  public async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    options?: {
      note?: string;
      assignedDepartmentId?: string;
      assignedStaffName?: string;
      rejectionReason?: string;
      resolutionNotes?: string;
    }
  ): Promise<Complaint> {
    try {
      const res = await fetch(`${BASE_URL}/complaints/${id}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, ...options }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      return data.complaint;
    } catch (err) {
      const cmp = this.localComplaints.find((c) => c.id === id || c.referenceId === id);
      if (!cmp) throw new Error('Complaint not found');
      cmp.status = status;
      if (options?.assignedDepartmentId) {
        cmp.assignedDepartmentId = options.assignedDepartmentId;
        const d = this.localDepartments.find((dep) => dep.id === options.assignedDepartmentId);
        cmp.assignedDepartmentName = d ? d.name : undefined;
      }
      if (options?.assignedStaffName) cmp.assignedStaffName = options.assignedStaffName;
      if (options?.rejectionReason) cmp.rejectionReason = options.rejectionReason;
      if (options?.resolutionNotes) cmp.resolutionNotes = options.resolutionNotes;
      cmp.updatedAt = new Date().toISOString();
      return cmp;
    }
  }

  public async reopenComplaint(id: string, reopenReason: string): Promise<Complaint> {
    try {
      const res = await fetch(`${BASE_URL}/complaints/${id}/reopen`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ reopenReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reopen complaint');
      return data.complaint;
    } catch (err) {
      const cmp = this.localComplaints.find((c) => c.id === id || c.referenceId === id);
      if (!cmp) throw new Error('Complaint not found');
      cmp.status = 'UNDER_REVIEW';
      cmp.reopenReason = reopenReason;
      cmp.updatedAt = new Date().toISOString();
      return cmp;
    }
  }

  public async addComment(complaintId: string, message: string, isInternal = false) {
    try {
      const res = await fetch(`${BASE_URL}/complaints/${complaintId}/comments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message, isInternal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add comment');
      return data.comment;
    } catch (err) {
      return {
        id: `comm-${Date.now()}`,
        complaintId,
        userId: 'current-user',
        userName: 'You',
        userRole: 'STUDENT',
        message,
        isInternal,
        createdAt: new Date().toISOString(),
      };
    }
  }

  // --- Departments API ---
  public async getDepartments(): Promise<Department[]> {
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch departments');
      return data.departments;
    } catch (err) {
      return this.localDepartments;
    }
  }

  public async createDepartment(deptData: Omit<Department, 'id'>): Promise<Department> {
    try {
      const res = await fetch(`${BASE_URL}/departments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(deptData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create department');
      return data.department;
    } catch (err) {
      const newD: Department = { ...deptData, id: `dept-${Date.now()}` };
      this.localDepartments.push(newD);
      return newD;
    }
  }

  // --- Notifications API ---
  public async getNotifications(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
      return { notifications: data.notifications, unreadCount: data.unreadCount };
    } catch (err) {
      const unread = this.localNotifications.filter((n) => !n.isRead).length;
      return { notifications: this.localNotifications, unreadCount: unread };
    }
  }

  public async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });
    } catch (err) {
      const item = this.localNotifications.find((n) => n.id === id);
      if (item) item.isRead = true;
    }
  }

  public async markAllNotificationsRead(): Promise<void> {
    try {
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });
    } catch (err) {
      this.localNotifications.forEach((n) => (n.isRead = true));
    }
  }

  // --- Analytics API ---
  public async getDashboardAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${BASE_URL}/analytics/dashboard`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch analytics');
      return data.metrics;
    } catch (err) {
      return DEMO_ANALYTICS;
    }
  }

  public async getStudentStats(): Promise<{ total: number; pending: number; inProgress: number; resolved: number }> {
    try {
      const res = await fetch(`${BASE_URL}/analytics/student-stats`, {
        headers: this.getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch student stats');
      return data.stats;
    } catch (err) {
      return { total: 4, pending: 2, inProgress: 1, resolved: 1 };
    }
  }

  public getCsvExportUrl(): string {
    return `${BASE_URL}/analytics/export-csv`;
  }
}

export const api = new ApiClient();
