# AI-Powered Investor Profile Solution

## Overview

This is a React-based web application that provides an AI-powered investor profile solution for UBS Wealth Management. The application leverages client portfolio data and advanced AI services to deliver personalized insights and recommendations for financial advisors and their clients.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS with custom UBS branding
- **State Management**: TanStack Query for server state management
- **Animation**: Framer Motion for UI animations
- **Routing**: Wouter for client-side routing
- **Charts**: Chart.js for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Build Tool**: Vite for frontend bundling, esbuild for backend
- **File Processing**: Multer for file uploads, XLSX for Excel processing

## Key Components

### Data Layer
- **Database Schema**: Comprehensive schema including clients, portfolios, asset allocations, performance data, market insights, and chat messages
- **ORM**: Drizzle ORM with TypeScript support for type-safe database operations
- **Migration System**: Drizzle Kit for database schema migrations

### Business Logic
- **Storage Service**: Abstracted data access layer with interfaces for all database operations
- **OpenAI Service**: Integration with OpenAI API for AI-powered chat and insights
- **Excel Service**: Client data import functionality from Excel files

### User Interface
- **Dashboard**: Comprehensive client overview with portfolio metrics and performance charts
- **Client Profile**: Detailed KYC/IP information display
- **Asset Allocation**: Interactive charts showing portfolio distribution
- **Risk Analysis**: Visual risk assessment tools
- **Market Insights**: CIO research content recommendations
- **Chat Interface**: AI-powered investment assistant

## Data Flow

1. **Client Data Import**: Excel files can be uploaded and processed to import client data
2. **Data Storage**: All client information, portfolios, and performance data stored in PostgreSQL
3. **API Layer**: Express.js REST API serves data to the frontend
4. **Frontend State**: TanStack Query manages caching and synchronization of server state
5. **AI Integration**: OpenAI API provides personalized insights and chat responses
6. **Real-time Updates**: Chat history and insights are stored and retrieved in real-time

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Services**: OpenAI API for chat and insights generation
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Charts**: Chart.js for portfolio and performance visualization
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **Drizzle Kit**: Database schema management and migrations
- **ESLint/Prettier**: Code formatting and quality tools

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds the React application to `dist/public`
- **Backend**: esbuild compiles the Express server to `dist/index.js`
- **Database**: Drizzle migrations can be applied via `npm run db:push`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `AZURE_OPENAI_*`: Alternative Azure OpenAI configuration

### Production Deployment
- **Server**: Single Node.js process serving both API and static files
- **Database**: Neon serverless PostgreSQL with connection pooling
- **Static Assets**: Served directly from Express in production

## Changelog

- July 07, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.