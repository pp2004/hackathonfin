# AI-Powered Investment Management Platform

A sophisticated multilingual AI-powered investment management platform that leverages advanced analytics and personalized advisory services for wealth management professionals. Built with Azure OpenAI integration, real-time portfolio analytics, and comprehensive gamification features.

## 🌟 Key Features

- **Azure OpenAI Integration**: Advanced AI chat with o3-mini model for personalized investment advice
- **Real-time Portfolio Analytics**: Complete portfolio performance tracking with interactive charts
- **Gamification Features**: 
  - Interactive portfolio milestones with emoji reactions
  - Animated budget health traffic light system
  - Learning modules with micro challenges
  - Investment journey timeline with achievement badges
- **Multi-language Support**: Complete translation system using Microsoft Translator API
- **47 Pre-loaded Clients**: Realistic portfolio data with comprehensive transaction history
- **Advanced Reporting**: PDF generation and portfolio analytics
- **Responsive Design**: Modern UI with dark/light mode support

## 🚀 Quick Start

### Prerequisites

**For Windows:**
- Node.js 18+ (Download from [nodejs.org](https://nodejs.org/))
- Git (Download from [git-scm.com](https://git-scm.com/))
- PostgreSQL 14+ (Download from [postgresql.org](https://www.postgresql.org/download/windows/))

**For macOS:**
- Node.js 18+ (Install via Homebrew: `brew install node` or download from [nodejs.org](https://nodejs.org/))
- Git (Install via Homebrew: `brew install git` or use Xcode Command Line Tools)
- PostgreSQL 14+ (Install via Homebrew: `brew install postgresql` or download from [postgresql.org](https://www.postgresql.org/download/macosx/))

### Installation

#### Windows Setup

1. **Clone the repository:**
   ```cmd
   git clone <repository-url>
   cd ai-investment-platform
   ```

2. **Install dependencies:**
   ```cmd
   npm install
   ```

3. **Setup PostgreSQL:**
   ```cmd
   # Start PostgreSQL service
   net start postgresql-x64-14
   
   # Create database (replace 'username' with your PostgreSQL username)
   createdb -U username investment_platform
   ```

4. **Configure environment variables:**
   ```cmd
   # Copy the environment template
   copy .env.example .env
   
   # Edit .env file with your credentials
   notepad .env
   ```

5. **Setup database schema:**
   ```cmd
   npm run db:push
   ```

6. **Seed database with sample data:**
   ```cmd
   npm run seed
   ```

7. **Start the application:**
   ```cmd
   npm run dev
   ```

#### macOS Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-investment-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL:**
   ```bash
   # Start PostgreSQL service
   brew services start postgresql
   
   # Create database
   createdb investment_platform
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env file with your credentials
   nano .env
   ```

5. **Setup database schema:**
   ```bash
   npm run db:push
   ```

6. **Seed database with sample data:**
   ```bash
   npm run seed
   ```

7. **Start the application:**
   ```bash
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/investment_platform"
PGHOST="localhost"
PGPORT="5432"
PGUSER="your_username"
PGPASSWORD="your_password"
PGDATABASE="investment_platform"

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT="https://your-instance.openai.azure.com/"
AZURE_OPENAI_API_KEY="your-azure-openai-api-key"
AZURE_OPENAI_DEPLOYMENT_NAME="o3-mini"

# Microsoft Translator Configuration
MICROSOFT_TRANSLATOR_KEY="your-translator-api-key"
MICROSOFT_TRANSLATOR_REGION="eastus"

# Application Configuration
NODE_ENV="development"
PORT="5000"
```

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling with shadcn/ui components
- **Framer Motion** for animations
- **TanStack Query** for server state management
- **Chart.js** for data visualization
- **Wouter** for routing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Azure OpenAI** for AI chat functionality
- **Microsoft Translator** for multi-language support

### Database
- **PostgreSQL** with Drizzle ORM
- **Neon Database** support for serverless deployment

## 📁 Project Structure

```
ai-investment-platform/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── gamification/  # Gamification features
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/           # Base UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   └── pages/            # Page components
├── server/                    # Backend Express application
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic services
│   └── db.ts                 # Database configuration
├── shared/                   # Shared TypeScript types and schemas
│   └── schema.ts             # Database schema definitions
├── uploads/                  # File upload directory
├── attached_assets/          # Sample data files
└── package.json              # Dependencies and scripts
```

## 🎮 Features Overview

### Portfolio Management
- Real-time portfolio tracking with interactive charts
- Asset allocation visualization
- Performance analytics with YTD returns
- Risk analysis and recommendations

### AI-Powered Chat
- Azure OpenAI o3-mini integration
- Contextual investment advice
- Portfolio-specific recommendations
- Multi-language support

### Gamification System
- **Portfolio Milestones**: Achievement system with emoji reactions
- **Health Traffic Light**: Animated portfolio health indicators
- **Learning Modules**: Interactive challenges with points system
- **Investment Journey**: Timeline with achievement badges

### Data Management
- 47 pre-loaded realistic client portfolios
- Transaction history import from CSV/Excel
- Comprehensive asset allocation data
- Performance tracking over time

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run seed            # Seed database with sample data

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are properly configured for production:

- Set `NODE_ENV=production`
- Use production database URLs
- Configure proper API keys for Azure OpenAI and Microsoft Translator
- Set appropriate CORS origins

### Deployment Platforms

This application can be deployed on:
- **Replit** (recommended for quick deployment)
- **Vercel** with PostgreSQL database
- **Heroku** with PostgreSQL add-on
- **AWS/GCP/Azure** with managed database services

## 🔐 API Keys Setup

### Azure OpenAI
1. Create an Azure OpenAI resource in Azure Portal
2. Deploy the o3-mini model
3. Get your endpoint and API key from the Azure Portal
4. Add to your `.env` file

### Microsoft Translator
1. Create a Translator resource in Azure Portal
2. Get your API key from the resource
3. Note your region (e.g., "eastus")
4. Add to your `.env` file

## 📊 Sample Data

The application comes with 47 realistic client portfolios including:
- Diverse investment profiles (Conservative, Moderate, Aggressive)
- Complete transaction histories
- Asset allocations across multiple classes
- Performance data with realistic returns
- Multi-currency support (USD, EUR, CHF)

## 🌐 Multi-Language Support

Supported languages:
- English (default)
- Chinese (Simplified)
- Japanese
- Spanish
- German
- French

Translation is handled automatically using Microsoft Translator API.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check PostgreSQL is running
# Windows:
net start postgresql-x64-14

# macOS:
brew services restart postgresql
```

**Port Already in Use:**
```bash
# Kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS:
lsof -ti:5000 | xargs kill -9
```

**Environment Variables Not Loading:**
- Ensure `.env` file is in the root directory
- Check file permissions
- Restart the development server

### Getting Help

1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database is running and accessible
4. Check API key validity for Azure services

## 📝 License

This project is proprietary software developed for UBS Wealth Management.

## 🤝 Contributing

For development contributions, please:
1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

---

**Built with ❤️ for UBS Wealth Management**