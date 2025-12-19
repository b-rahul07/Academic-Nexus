# Nexus - Academic Management System

## Overview

Nexus is a full-stack Integrated Academic and Examination Management System built for educational institutions. The application provides role-based dashboards for students, administrators, seating managers, and club coordinators. Key features include exam scheduling, smart seating allocation with anti-cheating constraints, hall ticket generation with QR codes, event management with conflict detection, and study support tools.

The system uses a "Modern Dark Glassmorphism" aesthetic with a sleek, professional UI built on Shadcn/UI components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for app-wide state (user role, exam mode, dark mode)
- **UI Components**: Shadcn/UI with Radix primitives, styled with Tailwind CSS v4
- **Build Tool**: Vite with custom plugins for Replit integration
- **PDF Generation**: @react-pdf/renderer for hall ticket generation
- **Visualization**: ReactFlow for interactive mind maps and syllabus hierarchy

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful JSON API with `/api/*` routes
- **Build Process**: esbuild bundles server code, Vite builds client

### Data Storage
- **Database**: Supabase (External PostgreSQL)
- **Auth Strategy**: Direct Table Auth (querying users table directly)
- **State**: localStorage for session persistence

### Key Design Patterns
1. **Role-Based Access**: Four distinct user roles (student, admin, seating_manager, club_coordinator) with separate dashboard views
2. **Smart Seating Algorithm**: Client-side shuffle ensuring students from the same department don't sit adjacent
3. **Exam Mode Toggle**: System-wide configuration that simplifies student UI during exam periods
4. **Study Support Module**: Interactive syllabus visualization with ReactFlow and recommended reading resources

### Directory Structure
- `/client` - React frontend application
- `/server` - Express backend with API routes
- `/shared` - Shared TypeScript types and database schema
- `/attached_assets` - Project requirements and generated images

## Features Implemented

### 1. Seating Allocation Module
- Smart algorithm preventing same-department adjacency
- Room grid visualization with seat assignment
- Client-side random shuffling with anti-cheating constraints

### 2. Hall Ticket Generator
- PDF generation using @react-pdf/renderer
- Dynamic QR codes for ticket verification
- Student info, exam schedule, and room assignments

### 3. Admin Ticket Verifier
- QR code upload and verification
- Backend API endpoint for ticket validation
- Integration with student database

### 4. Study Support Module (NEW)
- **File Upload**: Accept .txt syllabus files
- **Text Parsing**: Backend API extracts topics with hierarchy
- **ReactFlow Visualization**: Interactive mind map showing:
  - Main Subject (central node in blue)
  - Units branching from subject (purple nodes)
  - Topics branching from units (dark nodes)
- **Interactive Nodes**: Click topics to select them
- **Reading Recommendations**: Sidebar displays dummy reading resources for selected topics
- **API Endpoint**: `POST /api/syllabus/parse` handles text parsing and node generation

## External Dependencies

### Database & Auth
- **Supabase**: External PostgreSQL database
- **@supabase/supabase-js**: Supabase client library

### UI Libraries
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **ReactFlow**: Interactive node visualization for mind maps

### PDF & Documents
- **@react-pdf/renderer**: Client-side PDF generation for hall tickets

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for Node.js

### Environment Requirements
- `VITE_SUPABASE_URL`: Supabase project URL (required)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (required)

## Recent Changes

### Study Support Module Added (Latest)
- Created `client/src/components/StudySupport.tsx` component
- Added `POST /api/syllabus/parse` backend endpoint for topic extraction
- Integrated Study Support into Student Dashboard
- Supports .txt file uploads with automatic hierarchy parsing

## Known Issues & Notes
- PDF import for syllabus (via pdfjs-dist) is available but basic text file upload is recommended
- Reading recommendations are currently hardcoded dummy data; can be enhanced with database integration
