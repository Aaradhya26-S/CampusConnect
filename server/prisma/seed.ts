import { PrismaClient, Role, Priority, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PROHIBITED_STUDENT_ID } from '../src/utils/studentIdGenerator.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Campus Connect database...');

  // Ensure prohibited ID is nowhere in seed
  const testIds = ['590014298', '590087312', '590045621'];
  for (const id of testIds) {
    if (id === PROHIBITED_STUDENT_ID) {
      throw new Error(`CRITICAL: Prohibited ID detected in seed configuration!`);
    }
  }

  // 1. Seed Departments
  const departmentsData = [
    {
      name: 'Estate & Infrastructure',
      code: 'EID',
      description: 'Campus buildings, civil works, roads, and structural maintenance',
      contactEmail: 'estate@campusconnect.edu',
      headName: 'Dr. Rajesh Verma',
    },
    {
      name: 'Electrical Maintenance Cell',
      code: 'EMC',
      description: 'Power distribution, lighting, backup generators, and classroom electricals',
      contactEmail: 'electrical@campusconnect.edu',
      headName: 'Er. Suresh Nair',
    },
    {
      name: 'Water & Sanitation Division',
      code: 'WSD',
      description: 'Water filtration, plumbing, campus cleanliness, and hygiene maintenance',
      contactEmail: 'sanitation@campusconnect.edu',
      headName: 'Smt. Kavita Rao',
    },
    {
      name: 'IT & Network Services',
      code: 'ITNS',
      description: 'Campus Wi-Fi, LAN infrastructure, computer labs, and smart board maintenance',
      contactEmail: 'ithelpdesk@campusconnect.edu',
      headName: 'Prof. Ananya Sen',
    },
    {
      name: 'Hostel Welfare & Maintenance',
      code: 'HWM',
      description: 'Hostel rooms, mess facilities, furniture, and residential amenities',
      contactEmail: 'hostelwarden@campusconnect.edu',
      headName: 'Dr. Manpreet Singh',
    },
    {
      name: 'Academic Facilities & Library',
      code: 'AFL',
      description: 'Auditoriums, lecture halls, central library resources, and study spaces',
      contactEmail: 'libraryadmin@campusconnect.edu',
      headName: 'Dr. Sunita Deshmukh',
    },
  ];

  const createdDepts: Record<string, string> = {};
  for (const dept of departmentsData) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: dept,
      create: dept,
    });
    createdDepts[dept.code] = d.id;
  }

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('DemoStudent123!', 10);
  const adminPasswordHash = await bcrypt.hash('DemoAdmin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@campusconnect.edu' },
    update: {},
    create: {
      email: 'admin@campusconnect.edu',
      passwordHash: adminPasswordHash,
      fullName: 'Vikramaditya Oberoi',
      role: Role.ADMIN,
      department: 'Central Campus Administration',
      phone: '+91 98765 43210',
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student@campusconnect.edu' },
    update: {},
    create: {
      email: 'student@campusconnect.edu',
      passwordHash: passwordHash,
      fullName: 'Aarav Sharma',
      role: Role.STUDENT,
      studentId: '590014298', // Valid 5900XXXXX, non-prohibited
      department: 'Computer Science & Engineering',
      phone: '+91 91234 56789',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'priya.patel@campusconnect.edu' },
    update: {},
    create: {
      email: 'priya.patel@campusconnect.edu',
      passwordHash: passwordHash,
      fullName: 'Priya Patel',
      role: Role.STUDENT,
      studentId: '590087312', // Valid 5900XXXXX, non-prohibited
      department: 'Electronics & Communication',
      phone: '+91 92345 67890',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'rohan.mehta@campusconnect.edu' },
    update: {},
    create: {
      email: 'rohan.mehta@campusconnect.edu',
      passwordHash: passwordHash,
      fullName: 'Rohan Mehta',
      role: Role.STUDENT,
      studentId: '590045621', // Valid 5900XXXXX, non-prohibited
      department: 'Mechanical Engineering',
      phone: '+91 93456 78901',
    },
  });

  // 3. Seed Realistic Complaints
  const complaintsData = [
    {
      referenceId: 'CC-2025-ELEC01',
      title: 'Fluorescent Lights Flickering in Lecture Hall B-204',
      description: 'The ceiling lights in row 3 and 4 have been flickering constantly since morning, causing eye strain during lectures.',
      category: 'Electricity',
      location: 'Academic Block B, 2nd Floor, Room 204',
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      studentId: student1.id,
      assignedDepartmentId: createdDepts['EMC'],
      assignedStaffName: 'Ramesh K. (Senior Technician)',
    },
    {
      referenceId: 'CC-2025-WIFI02',
      title: 'Hostel Block 4 Wi-Fi Access Point Dropping Connections',
      description: 'The central Wi-Fi router on the 3rd floor wing A disconnects every 10 minutes. High packet loss reported by multiple residents.',
      category: 'Internet and Wi-Fi',
      location: 'Boys Hostel 4, 3rd Floor Wing A Corridor',
      priority: Priority.HIGH,
      status: Status.ASSIGNED,
      studentId: student1.id,
      assignedDepartmentId: createdDepts['ITNS'],
      assignedStaffName: 'Neha Gupta (Network Admin)',
    },
    {
      referenceId: 'CC-2025-WATR03',
      title: 'Low Water Pressure and Broken Tap in Ground Floor Restroom',
      description: 'Water tap near the washbasin is leaking continuously and the main water dispenser has very low flow.',
      category: 'Water Supply',
      location: 'Central Library, Ground Floor East Wing',
      priority: Priority.MEDIUM,
      status: Status.RESOLVED,
      studentId: student2.id,
      assignedDepartmentId: createdDepts['WSD'],
      assignedStaffName: 'Prakash M.',
      resolutionNotes: 'Replaced faulty rubber washer and recalibrated line pressure valve. Water pressure restored to 2.5 bar.',
      resolvedAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      referenceId: 'CC-2025-INFR04',
      title: 'Broken Desk Bench in Seminar Room 102',
      description: 'The back support bracket on bench row 2 is detached, posing a safety hazard to seated students.',
      category: 'Infrastructure',
      location: 'Tech Park Block A, Room 102',
      priority: Priority.LOW,
      status: Status.SUBMITTED,
      studentId: student1.id,
    },
    {
      referenceId: 'CC-2025-CLEN05',
      title: 'Waste Bin Overflowing Near Canteen Courtyard',
      description: 'Outdoor food waste recycling bin has overflowed into the walkway after the afternoon break.',
      category: 'Cleanliness',
      location: 'Main Food Court, Central Courtyard',
      priority: Priority.URGENT,
      status: Status.RESOLVED,
      studentId: student3.id,
      assignedDepartmentId: createdDepts['WSD'],
      assignedStaffName: 'Sunil Verma',
      resolutionNotes: 'Bins emptied, sanitized, and additional segregated bins placed in high-traffic zones.',
      resolvedAt: new Date(Date.now() - 86400000 * 4),
    },
    {
      referenceId: 'CC-2025-HOST06',
      title: 'Study Room Air Conditioner Not Cooling in Girls Hostel 2',
      description: 'The split AC unit in the 2nd floor reading hall turns on but blows ambient room temperature air only.',
      category: 'Hostel',
      location: 'Girls Hostel 2, 2nd Floor Common Study Hall',
      priority: Priority.HIGH,
      status: Status.UNDER_REVIEW,
      studentId: student2.id,
    },
  ];

  for (const c of complaintsData) {
    const complaint = await prisma.complaint.upsert({
      where: { referenceId: c.referenceId },
      update: {},
      create: c,
    });

    // Seed initial status history
    await prisma.statusHistory.create({
      data: {
        complaintId: complaint.id,
        fromStatus: null,
        toStatus: Status.SUBMITTED,
        changedById: c.studentId,
        note: 'Complaint ticket created by student.',
      },
    });

    if (c.status !== Status.SUBMITTED) {
      await prisma.statusHistory.create({
        data: {
          complaintId: complaint.id,
          fromStatus: Status.SUBMITTED,
          toStatus: c.status,
          changedById: admin.id,
          note: `Status updated to ${c.status}. ${c.resolutionNotes || ''}`.trim(),
        },
      });
    }

    // Seed sample comment
    await prisma.comment.create({
      data: {
        complaintId: complaint.id,
        userId: c.studentId,
        message: 'Kindly look into this at the earliest during working hours. Thank you.',
      },
    });
  }

  // 4. Seed Notifications for student
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        title: 'Technician Assigned',
        message: 'Your complaint CC-2025-ELEC01 has been assigned to Ramesh K. (Senior Technician).',
        type: 'ASSIGNED',
        isRead: false,
      },
      {
        userId: student1.id,
        title: 'Status Update',
        message: 'Your complaint CC-2025-WIFI02 is now ASSIGNED to IT & Network Services.',
        type: 'STATUS_CHANGE',
        isRead: true,
      },
      {
        userId: student2.id,
        title: 'Complaint Resolved',
        message: 'Water dispenser maintenance complaint CC-2025-WATR03 has been marked as RESOLVED.',
        type: 'RESOLUTION',
        isRead: true,
      },
    ],
  });

  console.log('✅ Campus Connect seeding completed successfully!');
  console.log('Credentials:');
  console.log('  Admin:   admin@campusconnect.edu / DemoAdmin123!');
  console.log('  Student: student@campusconnect.edu / DemoStudent123!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
