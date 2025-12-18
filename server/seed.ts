import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

  // 40 Students across 3 departments with realistic names
  const studentData = [
    // Computer Science (15 students)
    { name: "Rahul Kumar", dept: "Computer Science", roll: "CS-2025-001" },
    { name: "Priya Singh", dept: "Computer Science", roll: "CS-2025-002" },
    { name: "Arjun Patel", dept: "Computer Science", roll: "CS-2025-003" },
    { name: "Neha Sharma", dept: "Computer Science", roll: "CS-2025-004" },
    { name: "Vikram Das", dept: "Computer Science", roll: "CS-2025-005" },
    { name: "Isha Verma", dept: "Computer Science", roll: "CS-2025-006" },
    { name: "Rohan Gupta", dept: "Computer Science", roll: "CS-2025-007" },
    { name: "Aisha Khan", dept: "Computer Science", roll: "CS-2025-008" },
    { name: "Sanjay Reddy", dept: "Computer Science", roll: "CS-2025-009" },
    { name: "Divya Nair", dept: "Computer Science", roll: "CS-2025-010" },
    { name: "Karthik Iyer", dept: "Computer Science", roll: "CS-2025-011" },
    { name: "Anjali Roy", dept: "Computer Science", roll: "CS-2025-012" },
    { name: "Nikhil Rao", dept: "Computer Science", roll: "CS-2025-013" },
    { name: "Shreya Desai", dept: "Computer Science", roll: "CS-2025-014" },
    { name: "Akshay Bhat", dept: "Computer Science", roll: "CS-2025-015" },
    
    // Electronics & Communication (13 students)
    { name: "Vishal Mishra", dept: "Electronics", roll: "EC-2025-001" },
    { name: "Riya Chopra", dept: "Electronics", roll: "EC-2025-002" },
    { name: "Aryan Singh", dept: "Electronics", roll: "EC-2025-003" },
    { name: "Pooja Joshi", dept: "Electronics", roll: "EC-2025-004" },
    { name: "Hemant Kumar", dept: "Electronics", roll: "EC-2025-005" },
    { name: "Sneha Mehra", dept: "Electronics", roll: "EC-2025-006" },
    { name: "Manish Yadav", dept: "Electronics", roll: "EC-2025-007" },
    { name: "Kavya Singh", dept: "Electronics", roll: "EC-2025-008" },
    { name: "Suraj Bhatt", dept: "Electronics", roll: "EC-2025-009" },
    { name: "Anjum Ali", dept: "Electronics", roll: "EC-2025-010" },
    { name: "Harsh Patel", dept: "Electronics", roll: "EC-2025-011" },
    { name: "Disha Aggarwal", dept: "Electronics", roll: "EC-2025-012" },
    { name: "Pranav Sinha", dept: "Electronics", roll: "EC-2025-013" },
    
    // Mechanical Engineering (12 students)
    { name: "Ayush Tiwari", dept: "Mechanical Engineering", roll: "ME-2025-001" },
    { name: "Sneha Kulkarni", dept: "Mechanical Engineering", roll: "ME-2025-002" },
    { name: "Gaurav Sharma", dept: "Mechanical Engineering", roll: "ME-2025-003" },
    { name: "Esha Pandey", dept: "Mechanical Engineering", roll: "ME-2025-004" },
    { name: "Rajesh Singh", dept: "Mechanical Engineering", roll: "ME-2025-005" },
    { name: "Pooja Sharma", dept: "Mechanical Engineering", roll: "ME-2025-006" },
    { name: "Vikrant Jain", dept: "Mechanical Engineering", roll: "ME-2025-007" },
    { name: "Riya Bhatnagar", dept: "Mechanical Engineering", roll: "ME-2025-008" },
    { name: "Siddharth Kumar", dept: "Mechanical Engineering", roll: "ME-2025-009" },
    { name: "Aarav Patel", dept: "Mechanical Engineering", roll: "ME-2025-010" },
    { name: "Priya Desai", dept: "Mechanical Engineering", roll: "ME-2025-011" },
    { name: "Nitin Verma", dept: "Mechanical Engineering", roll: "ME-2025-012" },
  ];

  const students = studentData.map((data, idx) => ({
    username: `student${idx + 1}`,
    password: "demo123",
    role: "student",
    name: data.name,
    department: data.dept,
    semester: 6,
    rollNumber: data.roll
  }));

  for (const student of students) {
    try {
      await storage.createUser(student);
      console.log(`✓ Created student: ${student.name}`);
    } catch (error) {
      console.log(`  Student ${student.username} may already exist`);
    }
  }

  // Create demo users
  const admin = { username: "super_admin", password: "demo123", role: "admin", name: "Super Admin", department: null, semester: null, rollNumber: null };
  const seatingManager = { username: "rahul", password: "demo123", role: "student", name: "Rahul (Exam Tomorrow)", department: "Computer Science", semester: 6, rollNumber: "CS-2025-001" };
  const clubCoord = { username: "club_coordinator", password: "demo123", role: "club_coordinator", name: "Club Coordinator", department: "Student Affairs", semester: null, rollNumber: null };

  for (const user of [admin, seatingManager, clubCoord]) {
    try {
      await storage.createUser(user);
      console.log(`✓ Created user: ${user.name}`);
    } catch (error) {
      console.log(`  User ${user.username} may already exist`);
    }
  }

  // Create 5 rooms
  const roomsData = [
    { roomNumber: "Room 101", capacity: 90, rows: 9, columns: 10, building: "Main Block" },
    { roomNumber: "Main Hall", capacity: 300, rows: 20, columns: 15, building: "Central" },
    { roomNumber: "Lab 1", capacity: 60, rows: 6, columns: 10, building: "Tech Block" },
    { roomNumber: "Room 204", capacity: 40, rows: 5, columns: 8, building: "Academic" },
    { roomNumber: "Lab 2", capacity: 50, rows: 5, columns: 10, building: "Tech Block" },
  ];

  let room101Id = '';
  for (const room of roomsData) {
    try {
      const result = await storage.createRoom(room);
      if (room.roomNumber === "Room 101") {
        room101Id = result?.id || '';
      }
      console.log(`✓ Created room: ${room.roomNumber}`);
    } catch (error) {
      console.log(`  Room ${room.roomNumber} may already exist`);
    }
  }

  // Create mock exams
  const getNextWeekDate = (dayOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
  };

  const examsData = [
    { subjectName: "Data Structures", subjectCode: "CS301", examDate: getNextWeekDate(1), startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Computer Science" },
    { subjectName: "Digital Systems", subjectCode: "EC301", examDate: getNextWeekDate(2), startTime: "02:00 PM", endTime: "05:00 PM", semester: 6, department: "Electronics" },
    { subjectName: "Thermodynamics", subjectCode: "ME301", examDate: getNextWeekDate(3), startTime: "10:00 AM", endTime: "01:00 PM", semester: 6, department: "Mechanical Engineering" },
  ];

  for (const exam of examsData) {
    try {
      await storage.createExam(exam);
      console.log(`✓ Created exam: ${exam.subjectName}`);
    } catch (error) {
      console.log(`  Exam ${exam.subjectCode} may already exist`);
    }
  }

  // Pre-populate seating for Room 101 showing anti-cheating logic
  try {
    const csStudents = students.filter(s => s.department === "Computer Science").slice(0, 3);
    const ecStudents = students.filter(s => s.department === "Electronics").slice(0, 3);
    const meStudents = students.filter(s => s.department === "Mechanical Engineering").slice(0, 3);

    // Generate seating grid (9x10 = 90 seats) with alternating departments
    const grid: any[][] = [];
    let studentIdx = 0;
    const allDeptStudents = [...csStudents, ...ecStudents, ...meStudents];
    
    for (let row = 0; row < 9; row++) {
      grid[row] = [];
      for (let col = 0; col < 10; col++) {
        if (studentIdx < allDeptStudents.length) {
          const student = allDeptStudents[studentIdx];
          grid[row][col] = {
            occupied: true,
            studentId: student.username,
            studentName: student.name,
            department: student.department,
          };
          studentIdx++;
        } else {
          grid[row][col] = { occupied: false };
        }
      }
    }

    await storage.createSeatingChart({
      examId: '',
      roomId: room101Id,
      grid: JSON.stringify(grid),
    });

    console.log(`✓ Pre-populated seating for Room 101`);
  } catch (error) {
    console.log(`  Could not pre-populate seating for Room 101`);
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
