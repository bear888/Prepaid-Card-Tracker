# Prepaid Card Tracker Application

## Overview

This is a full-stack prepaid card management application built with a modern web stack. The application allows users to add prepaid cards, track transactions, and monitor balances through a clean, mobile-responsive interface. It uses a React frontend with TypeScript, Express.js backend, and is designed to support PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with local storage persistence
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API structure (routes defined but not implemented)
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with Vite integration

### Key Components

#### Frontend Components
- **Card Management**: Add, view, and delete prepaid cards
- **Transaction Tracking**: Record and view transaction history
- **Balance Calculation**: Real-time balance updates based on transactions
- **Mobile UI**: Responsive design optimized for mobile devices
- **Form Validation**: Zod schema validation for user inputs

#### Backend Components
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Route Registration**: Modular route handling system
- **Error Handling**: Centralized error middleware
- **Development Tools**: Request logging and debugging utilities

## Data Flow

### Current Implementation (Local Storage)
1. User interactions trigger form submissions
2. Data is validated using Zod schemas
3. Local storage service handles CRUD operations
4. UI updates reflect changes immediately
5. Toast notifications provide user feedback

### Planned Database Integration
1. API endpoints will replace local storage calls
2. Drizzle ORM will handle database operations
3. Express routes will validate and process requests
4. PostgreSQL will persist data with proper relationships

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Hookform resolvers
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Session Store**: connect-pg-simple for session persistence
- **Development**: tsx for TypeScript execution

### Development Tools
- **Replit Integration**: Cartographer plugin for Replit environment
- **Error Overlay**: Runtime error modal for development
- **Build Tools**: esbuild for backend compilation

## Deployment Strategy

### Development Environment
- Vite dev server serves frontend with hot reload
- Express server runs with tsx for TypeScript execution
- Middleware integration allows seamless frontend/backend development
- Environment variables manage database connections

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild bundles server code for Node.js
- Static files served from Express server
- Database migrations applied via Drizzle Kit

### Database Setup
- Drizzle config points to shared schema definition
- Migrations output to dedicated migrations folder
- PostgreSQL dialect with environment-based connection
- Database URL required for deployment

The application follows a clean separation of concerns with a well-defined interface between frontend and backend. The modular architecture allows for easy extension and maintenance, while the modern tooling ensures fast development cycles and optimized production builds.

## Recent Changes

### January 28, 2025
- ✓ Fixed delete transaction functionality with proper error handling
- ✓ Enhanced UI refresh after transaction deletion with forced re-rendering
- ✓ Improved balance calculation display in transaction items
- ✓ Added comprehensive README.md with deployment instructions
- ✓ Resolved CSS and component import issues for proper app functionality

### Current Status
The prepaid card tracker is fully functional with local storage, transaction management, mobile-responsive design, and archive functionality. All core features are working including adding/deleting cards, recording transactions, real-time balance tracking, and manual card archiving.

### January 28, 2025 - Archive Functionality Update
- ✓ Added manual archive/unarchive functionality for cards
- ✓ Created Active/Archived tabs in main card list view
- ✓ Added visual indicators for archived cards (grayed out, archive icon)
- ✓ Archive option available for any card regardless of balance
- ✓ Archive/restore options in card dropdown menu with toast notifications
- ✓ Enhanced storage service with backward compatibility for existing cards