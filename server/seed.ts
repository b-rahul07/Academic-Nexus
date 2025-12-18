import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create 50 diverse students
  const departments = ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Electronics"];
  const firstNames = ["Alex", "Sarah", "John", "Emily", "Michael", "Jessica", "David", "Rachel", "James", "Anna"];
  const lastNames = ["Johnson", "Connor", "Doe", "Davis", "Brown", "Wilson", "Martinez", "Garcia", "Anderson", "Taylor"];
  
  const students = [];
  for (let i = 0; i < 50; i++) {
    const dept = departments[i % departments.length];
    const deptCode = dept.split(" ").map(w => w[0]).join("");
    students.push({
      username: `student${i+1}`,
      password: "demo123",
      role: "student",
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
      department: dept,
      semester: 6,
      rollNumber: `${deptCode}-2025-${String(i+1).padStart(3, '0')}`
    });
  }

  for (const student of students) {
    try {
      await storage.createUser(student);
      console.log(`✓ Created student: ${student.name}`);
    } catch (error) {
      console.log(`  Student ${student.username} may already exist`);
    }
  }

  const admin = { username: "demo_admin", password: "demo123", role: "admin", name: "Demo Admin", department: null, semester: null, rollNumber: null };
  const seatingManager = { username: "demo_seating", password: "demo123", role: "seating_manager", name: "Demo Seating Manager", department: null, semester: null, rollNumber: null };
  const clubCoord = { username: "demo_club", password: "demo123", role: "club_coordinator", name: "Demo Club Coordinator", department: "Student Affairs", semester: null, rollNumber: null };

  for (const user of [admin, seatingManager, clubCoord]) {
    try {
      await storage.createUser(user);
      console.log(`✓ Created ${user.role}: ${user.name}`);
    } catch (error) {
      console.log(`  User ${user.username} may already exist`);
    }
  }

  // Create 5 rooms
  const roomsData = [
    { roomNumber: "Main Hall", capacity: 300, rows: 20, columns: 15, building: "Central" },
    { roomNumber: "Lab 1", capacity: 60, rows: 6, columns: 10, building: "Tech Block" },
    { roomNumber: "Room 204", capacity: 40, rows: 5, columns: 8, building: "Academic" },
    { roomNumber: "Lab 2", capacity: 50, rows: 5, columns: 10, building: "Tech Block" },
    { roomNumber: "Auditorium", capacity: 120, rows: 10, columns: 12, building: "Main" },
  ];

  for (const room of roomsData) {
    try {
      await storage.createRoom(room);
      console.log(`✓ Created room: ${room.roomNumber}`);
    } catch (error) {
      console.log(`  Room ${room.roomNumber} may already exist`);
    }
  }

  // Create mock exams for next week
  const getNextWeekDate = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  const examsData = [
    { subjectName: "Data Structures", subjectCode: "CS301", examDate: getNextWeekDate(1), startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Computer Science" },
    { subjectName: "Database Management", subjectCode: "CS302", examDate: getNextWeekDate(3), startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Computer Science" },
    { subjectName: "Thermodynamics", subjectCode: "ME301", examDate: getNextWeekDate(2), startTime: "02:00 PM", endTime: "05:00 PM", semester: 6, department: "Mechanical Engineering" },
    { subjectName: "Circuit Theory", subjectCode: "EE301", examDate: getNextWeekDate(4), startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Electrical Engineering" },
    { subjectName: "Structural Analysis", subjectCode: "CE301", examDate: getNextWeekDate(5), startTime: "02:00 PM", endTime: "05:00 PM", semester: 6, department: "Civil Engineering" },
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
