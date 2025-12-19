# Nexus - Academic Management System

## Overview

Nexus is a full-stack Integrated Academic and Examination Management System built for educational institutions. The application provides role-based dashboards for students, administrators, seating managers, and club coordinators with a high-end floating "CardNav" navigation dock. Key features include exam scheduling, smart seating allocation with anti-cheating constraints, hall ticket generation with QR codes, and study support tools with ReactFlow visualization.

The system uses a "Modern Dark Glassmorphism" aesthetic with a sleek, professional UI built on Shadcn/UI components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Navigation**: CardNav floating dock with GSAP animations
- **State Management**: TanStack React Query for server state, React Context for app-wide state (user role, exam mode, dark mode)
- **UI Components**: Shadcn/UI with Radix primitives, styled with Tailwind CSS v4
- **Build Tool**: Vite with custom plugins for Replit integration
- **PDF Generation**: @react-pdf/renderer for hall ticket generation
- **Visualization**: ReactFlow for interactive mind maps and syllabus hierarchy
- **Animations**: GSAP for smooth CardNav transitions

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
1. **Role-Based Access**: Four distinct user roles (student, admin, seating_manager, club_coordinator) with separate CardNav navigation
2. **Floating Navigation**: Context-aware CardNav dock that shows role-specific menu items
3. **Smart Seating Algorithm**: Client-side shuffle ensuring students from the same department don't sit adjacent
4. **Exam Mode Toggle**: System-wide configuration that simplifies student UI during exam periods
5. **Study Support Module**: Interactive syllabus visualization with ReactFlow and recommended reading resources

### Directory Structure
- `/client` - React frontend application
- `/server` - Express backend with API routes
- `/shared` - Shared TypeScript types and database schema
- `/attached_assets` - Project requirements and generated images

## Features Implemented

### 1. High-End CardNav Navigation (NEW)
- **Floating Dock**: Fixed position dock in top-left corner with glassmorphism styling
- **Animated Expansion**: GSAP-powered smooth expand/collapse animation
- **Role-Specific Items**: 
  - Admin: Users (Add Student, Manage Faculty, Club Coordinators), Exams (Seating Allocation, Hall Tickets)
  - Student: Academics (Dashboard, Study Support), Exams (Hall Ticket, Seating Info)
  - Seating Manager: Allocation (Generate Seating, View Rooms)
  - Club Coordinator: Events (Dashboard, Manage Events)
- **Responsive Design**: Adapts to mobile and desktop screens
- **Dark Glassmorphism**: Matches the app's premium aesthetic

### 2. Seating Allocation Module
- Smart algorithm preventing same-department adjacency
- Room grid visualization with seat assignment
- Client-side random shuffling with anti-cheating constraints

### 3. Hall Ticket Generator
- PDF generation using @react-pdf/renderer
- Dynamic QR codes for ticket verification
- Student info, exam schedule, and room assignments

### 4. Admin Ticket Verifier
- QR code upload and verification
- Backend API endpoint for ticket validation
- Integration with student database

### 5. Study Support Module
- File Upload: Accept .txt syllabus files
- Text Parsing: Backend API extracts topics with hierarchy
- ReactFlow Visualization: Interactive mind map showing:
  - Main Subject (central node in blue)
  - Units branching from subject (purple nodes)
  - Topics branching from units (dark nodes)
- Interactive Nodes: Click topics to select them
- Reading Recommendations: Sidebar displays reading resources for selected topics
- API Endpoint: `POST /api/syllabus/parse` handles text parsing and node generation

### 6. User Management System
- **Schema-Compliant Form Submissions**: All user types send only required columns
  - Student: `id`, `password` (derived from DOB), `role`, `name`, `department`, `year`
  - Seating Manager (Faculty): `id`, `password`, `role`, `name`, `designation`
  - Club Coordinator: `id`, `password`, `role`, `name`, `club_name`
- **Enhanced Error Handling**: Displays specific Supabase errors with alert messages
  - Format: `Supabase Error: {errorMsg}\nDetails: {errorDetails}`
- **Form Validation**: All required fields validated before submission
- **Success Actions**: Forms clear on successful submission + success toast notification

## External Dependencies

### Recent Additions (CardNav)
- **gsap**: Professional-grade animation library for smooth transitions
- **react-icons**: Icon library (using GoArrowUpRight for nav links)

### Core Libraries
- **Supabase**: External PostgreSQL database
- **@supabase/supabase-js**: Supabase client library
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS framework with dark mode
- **Lucide React**: Icon library
- **ReactFlow**: Interactive node visualization for mind maps
- **@react-pdf/renderer**: Client-side PDF generation

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling
- **tsx**: TypeScript execution for Node.js

### Environment Requirements
- `VITE_SUPABASE_URL`: Supabase project URL (required)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (required)

## Recent Changes

### CardNav Navigation Overhaul (LATEST)
- Created `client/src/components/CardNav.tsx` - High-end floating navigation dock
- Created `client/src/components/CardNav.css` - Glassmorphism styling with animations
- Installed dependencies: `gsap`, `react-icons`
- Integrated CardNav into App.tsx with role-aware navigation items
- CardNav shows/hides based on authentication state (localStorage)
- Smooth GSAP animations for expand/collapse transitions
- Responsive design adapts to mobile and desktop

### User Management & Error Handling (Previous)
- Removed hardcoded/fake data from all dashboards
- Fixed "Add User" form schema to match Supabase columns exactly
- Added "Designation" field to Seating Manager form
- Improved error handling with detailed Supabase error messages
- All forms now only send columns that exist in database

### Study Support Module (Previous)
- Created `client/src/components/StudySupport.tsx` component
- Added `POST /api/syllabus/parse` backend endpoint for topic extraction
- Integrated Study Support into Student Dashboard
- Supports .txt file uploads with automatic hierarchy parsing

## Known Issues & Notes
- PDF import for syllabus (via pdfjs-dist) is available but basic text file upload is recommended
- Reading recommendations are currently dummy data; can be enhanced with database integration
- Dashboard metrics (student count, exams) show "0" until database records are added
- CardNav items use query parameters (e.g., `?tab=students`) for deep linking within dashboards

## Next Steps
- Test CardNav navigation with different user roles
- Verify animations work smoothly on all browsers
- Consider adding keyboard shortcuts for CardNav (e.g., Cmd/Ctrl + K)
