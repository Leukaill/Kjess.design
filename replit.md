# Overview

This is a full-stack web application built with React and Express.js, featuring a modern design system using shadcn/ui components. The application includes contact form functionality and newsletter subscription capabilities, with a PostgreSQL database backend managed through Drizzle ORM. The project uses TypeScript throughout and implements a monorepo structure with shared schemas and types.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Animations**: Framer Motion for smooth animations and transitions

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with proper error handling and request logging middleware
- **Storage**: Dual storage approach with in-memory storage for development and Drizzle ORM for production database operations
- **Validation**: Zod schemas for request validation with proper error responses

## Data Storage
- **Database**: PostgreSQL using Neon Database as the serverless provider
- **ORM**: Drizzle ORM with migrations support for schema management
- **Schema Management**: Shared schema definitions using drizzle-zod for type-safe validation
- **Tables**: Users, contacts, and newsletters with proper constraints and relationships

## Development Setup
- **Monorepo Structure**: Organized into client/, server/, and shared/ directories
- **Hot Reload**: Vite dev server with HMR for frontend development
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)
- **TypeScript**: Strict mode enabled with path mapping for clean imports

# External Dependencies

## Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
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