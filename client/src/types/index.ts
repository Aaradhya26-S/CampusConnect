export type UserRole = 'STUDENT' | 'ADMIN';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  phone?: string;
  createdAt?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  contactEmail?: string;
  headName?: string;
}

export interface StatusHistory {
  id: string;
  complaintId: string;
  fromStatus: ComplaintStatus | null;
  toStatus: ComplaintStatus;
  changedById: string;
  changedByName?: string;
  note?: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  complaintId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface Complaint {
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
  statusHistory?: StatusHistory[];
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  complaintId?: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsData {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  avgResolutionHours: number;
  resolutionRate: number;
  categoriesDistribution: { name: string; count: number; percentage: number }[];
  statusDistribution: { status: ComplaintStatus; label: string; count: number }[];
  priorityDistribution: { priority: ComplaintPriority; count: number }[];
  monthlyTrends: { month: string; submitted: number; resolved: number }[];
}
