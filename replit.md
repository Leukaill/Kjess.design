# Overview

This is a sophisticated interior design company website for KJESS Designs built with React and Express.js, featuring an elegant design system using shadcn/ui components. The application includes contact form functionality, newsletter subscription capabilities, a dynamic navigation bar with scroll-based section detection, team showcase, testimonials, and gallery sections. The backend uses PostgreSQL with Drizzle ORM for data persistence. The project implements TypeScript throughout with a monorepo structure and shared schemas.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Database Configuration Protection (August 27, 2025)
- **CRITICAL**: Fixed database connection to use correct Supabase database instead of "heliumdb"
- Implemented environment variable protection system to prevent Replit conflicts
- Added lazy storage initialization to ensure proper loading order
- Created comprehensive setup documentation for future developers
- Added database connection validation and warning system
- Made configuration bulletproof against system environment variable interference

## Gallery Enhancement (August 20, 2025)
- Made gallery category cards clickable with smooth navigation to filtered sections
- Implemented URL routing for gallery categories (/gallery/residential, /gallery/commercial, /gallery/furniture)
- Added comprehensive filtering system with category counts
- Organized gallery data structure with subcategories, project dates, locations, and featured flags
- Prepared well-structured data model for future admin dashboard integration
- Enhanced gallery items with detailed metadata for better management

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing with smooth scroll navigation
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Animations**: Framer Motion for smooth animations, transitions, and sophisticated interactions
- **Navigation**: Fixed navigation bar with scroll-based active section detection and smooth scrolling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with proper error handling and request logging middleware
- **Storage**: Dual storage approach with in-memory storage for development and Drizzle ORM for production database operations
- **Validation**: Zod schemas for request validation with proper error responses

## Data Storage
- **Database**: PostgreSQL using Supabase as the provider (configured via .env file)
- **ORM**: Drizzle ORM with migrations support for schema management
- **Schema Management**: Shared schema definitions using drizzle-zod for type-safe validation
- **Tables**: Admin, contacts, newsletters, gallery_images, site_content, and users tables
- **Connection Protection**: Environment variable system prevents conflicts with Replit's built-in databases

## Development Setup
- **Monorepo Structure**: Organized into client/, server/, and shared/ directories
- **Hot Reload**: Vite dev server with HMR for frontend development
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)
- **TypeScript**: Strict mode enabled with path mapping for clean imports

# Critical Configuration Notes

## Database Connection Requirements
- **NEVER REMOVE** the `delete process.env.DATABASE_URL` line in server/index.ts
- **ALWAYS USE** Transaction pooler connection string format from Supabase
- **ENVIRONMENT PRIORITY**: .env file takes precedence over system environment variables
- **LAZY INITIALIZATION**: Storage is initialized after environment variables are loaded

## Setup for New Environments
1. Copy `.env.example` to `.env`
2. Fill in Supabase credentials using Transaction pooler format
3. Run `npm run db:push` to sync schema
4. Access admin panel to create initial admin account

# External Dependencies

## Core Technologies
- **postgres**: Direct PostgreSQL connection for Supabase
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for smooth UI transitions

## UI Components
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe variant API for component styling
- **lucide-react**: Consistent icon library

## Form and Validation
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Resolver for Zod validation schemas
- **zod**: TypeScript-first schema validation

## Development Tools
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution environment
- **wouter**: Lightweight routing library
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay