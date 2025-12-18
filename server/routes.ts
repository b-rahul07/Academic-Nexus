import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertExamSchema, insertSeatingSchema, insertScheduleSchema } from "@shared/schema";
import { allocateSeatingWithConstraints } from "./seatingAlgorithm";
import { z } from "zod";
import crypto from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // =================== AUTH API ===================
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      
      if (!identifier || !password) {
        return res.status(400).json({ error: "Identifier and password are required" });
      }

      const user = await storage.getUserByIdentifier(identifier);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Direct string comparison - no hashing
      if (user.password_hash !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({
        id: user.id,
        role: user.role,
        identifier: user.identifier,
        is_first_login: user.is_first_login,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/change-password", async (req, res) => {
    try {
      const { userId, newPassword } = req.body;
      
      if (!userId || !newPassword) {
        return res.status(400).json({ error: "userId and newPassword are required" });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Store password as-is, no hashing
      const updatedUser = await storage.updateUser(userId, {
        password_hash: newPassword,
        is_first_login: false,
      });

      res.json({
        id: updatedUser?.id,
        role: updatedUser?.role,
        identifier: updatedUser?.identifier,
        is_first_login: updatedUser?.is_first_login,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });

  // =================== EVENTS API ===================
  
  app.get("/api/events", async (req, res) => {
    try {
      const allEvents = await storage.getAllEvents();
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const newEvent = await storage.createEvent(validatedData);
      res.status(201).json(newEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
      }
    }
  });

  app.patch("/api/events/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      
      const updatedEvent = await storage.updateEventStatus(id, status);
      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      console.error("Error updating event status:", error);
      res.status(500).json({ error: "Failed to update event status" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // =================== EXAMS API ===================
  
  app.get("/api/exams", async (req, res) => {
    try {
      const allExams = await storage.getAllExams();
      res.json(allExams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).json({ error: "Failed to fetch exams" });
    }
  });

  app.post("/api/exams", async (req, res) => {
    try {
      const validatedData = insertExamSchema.parse(req.body);
      const newExam = await storage.createExam(validatedData);
      res.status(201).json(newExam);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating exam:", error);
        res.status(500).json({ error: "Failed to create exam" });
      }
    }
  });

  // =================== ROOMS API ===================
  
  app.get("/api/rooms", async (req, res) => {
    try {
      const allRooms = await storage.getAllRooms();
      res.json(allRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const validatedData = z.object({
        roomNumber: z.string(),
        capacity: z.number(),
        rows: z.number(),
        columns: z.number(),
        building: z.string().optional(),
      }).parse(req.body);
      const newRoom = await storage.createRoom(validatedData);
      res.status(201).json(newRoom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Failed to create room" });
      }
    }
  });

  // =================== SMART SEATING ALLOCATION ===================
  
  app.post("/api/seatings/allocate-smart", async (req, res) => {
    try {
      const { examId, roomId } = req.body;
      
      if (!examId || !roomId) {
        return res.status(400).json({ error: "examId and roomId are required" });
      }

      const room = await storage.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const students = await storage.getUsersByRole('Student');
      if (students.length === 0) {
        return res.status(400).json({ error: "No students found" });
      }

      await storage.deleteSeatingsByExamAndRoom(examId, roomId);

      const { grid, seatings } = allocateSeatingWithConstraints(students, room);

      const savedSeatings = await Promise.all(
        seatings.map((seating) =>
          storage.createSeating({
            examId,
            roomId,
            studentId: seating.studentId,
            row: seating.row,
            column: seating.column,
          })
        )
      );

      res.status(201).json({
        message: "Smart seating allocation completed",
        count: savedSeatings.length,
        grid: grid.map((r) =>
          r.map((cell) => ({
            studentId: cell.studentId,
            role: cell.role,
          }))
        ),
        seatings: savedSeatings,
      });
    } catch (error) {
      console.error("Error allocating seating:", error);
      res.status(500).json({ error: "Failed to allocate seating" });
    }
  });

  // Get seating grid for a room+exam
  app.get("/api/seatings/grid/:examId/:roomId", async (req, res) => {
    try {
      const { examId, roomId } = req.params;

      const room = await storage.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const seatings = await storage.getSeatingsForExamAndRoom(examId, roomId);
      const students = await storage.getUsersByRole('Student');
      const studentMap = new Map(students.map((s) => [s.id, s]));

      const grid = Array(room.rows)
        .fill(null)
        .map(() => Array(room.columns).fill(null));

      seatings.forEach((seating) => {
        const student = seating.studentId ? studentMap.get(seating.studentId) : null;
        grid[seating.row][seating.column] = {
          studentId: student?.id ?? "UNKNOWN",
          studentName: student?.identifier ?? "UNKNOWN",
          rollNumber: student?.identifier ?? "",
          role: student?.role ?? "",
        };
      });

      res.json({
        room: {
          id: room.id,
          roomNumber: room.roomNumber,
          rows: room.rows,
          columns: room.columns,
          capacity: room.capacity,
        },
        grid,
        totalSeated: seatings.length,
      });
    } catch (error) {
      console.error("Error fetching seating grid:", error);
      res.status(500).json({ error: "Failed to fetch seating grid" });
    }
  });

  // =================== SYSTEM CONFIG API ===================
  
  app.get("/api/config/exam-mode", async (req, res) => {
    try {
      const config = await storage.getSystemConfig();
      res.json({ examMode: config?.examMode || false });
    } catch (error) {
      console.error("Error fetching exam mode:", error);
      res.status(500).json({ error: "Failed to fetch exam mode" });
    }
  });

  app.patch("/api/config/exam-mode", async (req, res) => {
    try {
      const { examMode } = req.body;
      
      if (typeof examMode !== 'boolean') {
        return res.status(400).json({ error: "examMode must be a boolean" });
      }
      
      const updatedConfig = await storage.updateExamMode(examMode);
      res.json(updatedConfig);
    } catch (error) {
      console.error("Error updating exam mode:", error);
      res.status(500).json({ error: "Failed to update exam mode" });
    }
  });

  // =================== USERS/STUDENTS API ===================
  
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getUsersByRole('Student');
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // =================== SYLLABUS PARSING API ===================
  
  app.post("/api/syllabus/parse", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: "Text content is required" });
      }

      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const nodes: any[] = [];
      const edges: any[] = [];

      const subject = lines[0] || 'Course';
      const subjectId = 'subject-main';
      nodes.push({ id: subjectId, label: subject, type: 'subject' });

      let unitCounter = 0;
      let currentUnitId = '';

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        const indent = lines[i].search(/\S/);

        if (line.match(/^(Unit|MODULE|Chapter|UNIT)\s+\d+/i) || (indent <= 2 && line.length > 0)) {
          currentUnitId = `unit-${unitCounter++}`;
          nodes.push({ id: currentUnitId, label: line.substring(0, 30), type: 'unit' });
          edges.push({ id: `e-${subjectId}-${currentUnitId}`, source: subjectId, target: currentUnitId });
        } 
        else if (indent > 2 && line.length > 0 && currentUnitId) {
          const topicId = `topic-${i}`;
          nodes.push({ id: topicId, label: line.substring(0, 25), type: 'topic' });
          edges.push({ id: `e-${currentUnitId}-${topicId}`, source: currentUnitId, target: topicId });
        }
      }

      res.json({ nodes, edges, subject });
    } catch (error) {
      console.error("Error parsing syllabus:", error);
      res.status(500).json({ error: "Failed to parse syllabus" });
    }
  });

  // =================== TICKET VERIFICATION API ===================
  
  app.post("/api/tickets/verify", async (req, res) => {
    try {
      const { studentId, seatNumber } = req.body;
      
      if (!studentId || !seatNumber) {
        return res.status(400).json({ error: "studentId and seatNumber are required" });
      }

      const seatings = await storage.getSeatingsForStudent(studentId);
      const seating = seatings.find((s) => {
        return s.row !== null && s.column !== null && `${s.row}-${s.column}` === seatNumber;
      });

      if (seating) {
        res.json({
          valid: true,
          data: {
            studentId,
            seatNumber,
          },
        });
      } else {
        res.status(404).json({
          valid: false,
          error: "Ticket not found or invalid",
        });
      }
    } catch (error) {
      console.error("Error verifying ticket:", error);
      res.status(500).json({ error: "Failed to verify ticket" });
    }
  });

  // =================== USER MANAGEMENT API ===================
  
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users/register/student", async (req, res) => {
    try {
      const { name, identifier, department, year, dob } = req.body;
      
      if (!name || !identifier || !department || !dob) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existing = await storage.getUserByIdentifier(identifier);
      if (existing) {
        return res.status(409).json({ error: "Roll number already exists" });
      }

      const user = await storage.createUser({
        role: "student",
        identifier,
        dob,
        password_hash: dob,
        is_first_login: true,
        name,
        department,
        year,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ error: "Failed to register student" });
    }
  });

  app.post("/api/users/register/seating-manager", async (req, res) => {
    try {
      const { name, identifier, dob } = req.body;
      
      if (!name || !identifier || !dob) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existing = await storage.getUserByIdentifier(identifier);
      if (existing) {
        return res.status(409).json({ error: "Faculty ID already exists" });
      }

      const user = await storage.createUser({
        role: "seating_manager",
        identifier,
        dob,
        password_hash: dob,
        is_first_login: true,
        name,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Error registering seating manager:", error);
      res.status(500).json({ error: "Failed to register seating manager" });
    }
  });

  app.post("/api/users/register/club-coordinator", async (req, res) => {
    try {
      const { name, identifier, clubName, dob } = req.body;
      
      if (!name || !identifier || !clubName || !dob) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existing = await storage.getUserByIdentifier(identifier);
      if (existing) {
        return res.status(409).json({ error: "Student ID already exists" });
      }

      const user = await storage.createUser({
        role: "club_coordinator",
        identifier,
        dob,
        password_hash: dob,
        is_first_login: true,
        name,
        club_name: clubName,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Error registering club coordinator:", error);
      res.status(500).json({ error: "Failed to register club coordinator" });
    }
  });

  app.post("/api/users/reset-password", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.updateUser(userId, {
        password_hash: user.dob,
        is_first_login: true,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  return httpServer;
}

  // =================== USER MANAGEMENT API ===================
  
