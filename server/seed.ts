import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create mock users
  const students = [
    { username: "alex", password: "pass123", role: "student", name: "Alex Johnson", department: "Computer Science", semester: 6, rollNumber: "CS-2025-042" },
    { username: "sarah", password: "pass123", role: "student", name: "Sarah Connor", department: "Mechanical Engineering", semester: 6, rollNumber: "ME-2025-015" },
    { username: "john", password: "pass123", role: "student", name: "John Doe", department: "Electrical Engineering", semester: 6, rollNumber: "EE-2025-028" },
    { username: "emily", password: "pass123", role: "student", name: "Emily Davis", department: "Computer Science", semester: 6, rollNumber: "CS-2025-051" },
    { username: "michael", password: "pass123", role: "student", name: "Michael Brown", department: "Mechanical Engineering", semester: 6, rollNumber: "ME-2025-033" },
  ];

  for (const student of students) {
    try {
      await storage.createUser(student);
      console.log(`✓ Created student: ${student.name}`);
    } catch (error) {
      console.log(`  Student ${student.username} may already exist`);
    }
  }

  const admin = { username: "admin", password: "admin123", role: "admin", name: "System Admin", department: null, semester: null, rollNumber: null };
  const seatingManager = { username: "seating", password: "seating123", role: "seating_manager", name: "Seating Manager", department: null, semester: null, rollNumber: null };
  const clubCoord = { username: "club", password: "club123", role: "club_coordinator", name: "Club Coordinator", department: "Student Affairs", semester: null, rollNumber: null };

  for (const user of [admin, seatingManager, clubCoord]) {
    try {
      await storage.createUser(user);
      console.log(`✓ Created ${user.role}: ${user.name}`);
    } catch (error) {
      console.log(`  User ${user.username} may already exist`);
    }
  }

  // Create mock exams
  const examsData = [
    { subjectName: "Data Structures", subjectCode: "CS301", examDate: "2025-12-15", startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Computer Science" },
    { subjectName: "Database Management", subjectCode: "CS302", examDate: "2025-12-17", startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Computer Science" },
    { subjectName: "Operating Systems", subjectCode: "CS303", examDate: "2025-12-19", startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Computer Science" },
  ];

  for (const exam of examsData) {
    try {
      await storage.createExam(exam);
      console.log(`✓ Created exam: ${exam.subjectName}`);
    } catch (error) {
      console.log(`  Exam ${exam.subjectCode} may already exist`);
    }
  }

  // Create mock events
  const eventsData = [
    { title: "Robotics Workshop", description: "Learn robotics basics", eventDate: "2025-12-20", startTime: "10:00 AM", endTime: "04:00 PM", venue: "Lab 3", department: "Engineering", status: "approved", createdBy: null },
    { title: "Annual Drama Fest", description: "Annual theater event", eventDate: "2025-12-22", startTime: "02:00 PM", endTime: "08:00 PM", venue: "Main Auditorium", department: "Arts", status: "pending", createdBy: null },
    { title: "Debate Championship", description: "Inter-college debate", eventDate: "2025-12-25", startTime: "09:00 AM", endTime: "05:00 PM", venue: "Seminar Hall", department: "Humanities", status: "rejected", createdBy: null },
  ];

  for (const event of eventsData) {
    try {
      await storage.createEvent(event);
      console.log(`✓ Created event: ${event.title}`);
    } catch (error) {
      console.log(`  Event ${event.title} may already exist`);
    }
  }

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});

// Seed rooms
const roomsData = [
  { roomNumber: "Main Hall", capacity: 300, rows: 20, columns: 15, building: "Central" },
  { roomNumber: "Lab 1", capacity: 60, rows: 6, columns: 10, building: "Tech Block" },
  { roomNumber: "Room 204", capacity: 40, rows: 5, columns: 8, building: "Academic" },
  { roomNumber: "Lab 2", capacity: 50, rows: 5, columns: 10, building: "Tech Block" },
];

async function seedRooms() {
  for (const room of roomsData) {
    try {
      await storage.createRoom(room);
      console.log(`✓ Created room: ${room.roomNumber}`);
    } catch (error) {
      console.log(`  Room ${room.roomNumber} may already exist`);
    }
  }
}

seedRooms().catch(console.error);
