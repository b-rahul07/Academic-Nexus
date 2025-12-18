import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertExamSchema, insertSeatingSchema, insertScheduleSchema } from "@shared/schema";
import { allocateSeatingWithConstraints } from "./seatingAlgorithm";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

      // Get the room and students
      const room = await storage.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      const students = await storage.getUsersByRole('student');
      if (students.length === 0) {
        return res.status(400).json({ error: "No students found" });
      }

      // Delete existing allocations
      await storage.deleteSeatingsByExamAndRoom(examId, roomId);

      // Run smart algorithm
      const { grid, seatings } = allocateSeatingWithConstraints(students, room);

      // Save seatings to DB
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
            department: cell.department,
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
      const students = await storage.getUsersByRole('student');
      const studentMap = new Map(students.map((s) => [s.id, s]));

      // Build grid
      const grid = Array(room.rows)
        .fill(null)
        .map(() => Array(room.columns).fill(null));

      seatings.forEach((seating) => {
        const student = studentMap.get(seating.studentId);
        grid[seating.row][seating.column] = {
          studentId: student?.id ?? "UNKNOWN",
          studentName: student?.name ?? "UNKNOWN",
          rollNumber: student?.rollNumber ?? "",
          department: student?.department ?? "UNKNOWN",
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
      const students = await storage.getUsersByRole('student');
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  return httpServer;
}
