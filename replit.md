# Nexus - Academic Management System

## Overview

Nexus is a full-stack Integrated Academic and Examination Management System built for educational institutions. The application provides role-based dashboards for students, administrators, seating managers, and club coordinators. Key features include exam scheduling, smart seating allocation with anti-cheating constraints, hall ticket generation with QR codes, event management with conflict detection, and study support tools.

The system uses an "Executive Dark Mode" aesthetic with a sleek, professional UI built on Shadcn/UI components and Tailwind CSS.

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
- **Drag & Drop**: @hello-pangea/dnd for kanban-style interfaces

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Design**: RESTful JSON API with `/api/*` routes
- **Build Process**: esbuild bundles server code, Vite builds client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit manages schema migrations in `/migrations`

### Key Design Patterns
1. **Role-Based Access**: Four distinct user roles (student, admin, seating_manager, club_coordinator) with separate dashboard views
2. **Shared Schema**: Database schema in `/shared` folder is accessible to both client and server for type safety
3. **Smart Seating Algorithm**: Custom algorithm in `server/seatingAlgorithm.ts` ensures students from the same department don't sit adjacent to each other
4. **Exam Mode Toggle**: System-wide configuration that simplifies student UI during exam periods

### Directory Structure
- `/client` - React frontend application
- `/server` - Express backend with API routes
- `/shared` - Shared TypeScript types and database schema
- `/migrations` - Drizzle database migrations
- `/attached_assets` - Project requirements and generated images

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage in PostgreSQL

### UI Libraries
- **Shadcn/UI**: Component library built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Flow**: Mind map visualization (for study support feature)

### PDF & Documents
- **@react-pdf/renderer**: Client-side PDF generation for hall tickets
- **xlsx**: Excel file handling for data import/export

### Development Tools
- **Vite**: Frontend build and dev server
- **esbuild**: Server bundling for production
- **Drizzle Kit**: Database schema management (`npm run db:push`)

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string (required)