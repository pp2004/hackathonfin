# AI-Powered Investor Profile Solution

A sophisticated multilingual AI-powered investment management platform built for UBS Wealth Management professionals. This application provides comprehensive financial insights, personalized advisory services, and automated portfolio analysis using Azure OpenAI's o3-mini model.

![UBS Wealth Management](https://img.shields.io/badge/UBS-Wealth%20Management-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-o3--mini-green?style=for-the-badge)

## 🌟 Key Features

### 🤖 AI-Powered Investment Assistant
- **Azure OpenAI Integration**: Leverages Azure OpenAI's o3-mini model for intelligent investment advice
- **Contextual Responses**: Provides personalized recommendations based on client risk profiles and portfolio data
- **Real-time Chat Interface**: Interactive chat system with investment-specific guidance
- **Multi-language Support**: Available in English, Spanish, French, German, Hindi, Chinese, and Japanese

### 📊 Comprehensive Portfolio Analytics
- **Real-time Portfolio Monitoring**: Live tracking of portfolio values and performance metrics
- **Interactive Charts**: Advanced data visualization using Chart.js and Recharts
- **Asset Allocation Analysis**: Detailed breakdown of investment distributions
- **Performance Benchmarking**: Compare client portfolios against market indices
- **Risk Assessment Tools**: Visual risk analysis and tolerance evaluation

### 📈 Advanced Reporting & Insights
- **Automated Report Generation**: One-click HTML portfolio reports with UBS branding
- **Market Insights Integration**: CIO research content and market recommendations
- **Rebalancing Recommendations**: AI-generated portfolio optimization suggestions
- **Performance Analytics**: Historical performance tracking and trend analysis

### 🎨 Professional User Experience
- **UBS Brand Compliance**: Authentic UBS red (#e60028) color scheme and styling
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Interactive Tooltips**: Contextual help for investment terminology
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions

## 🏗️ Technical Architecture

### Frontend Stack
```
React 18 + TypeScript
├── UI Framework: Radix UI + shadcn/ui components
├── Styling: Tailwind CSS with custom UBS theming
├── State Management: TanStack Query for server state
├── Routing: Wouter for client-side navigation
├── Charts: Chart.js & Recharts for data visualization
├── Animations: Framer Motion for smooth transitions
└── Internationalization: Custom i18n solution
```

### Backend Infrastructure
```
Node.js + Express.js
├── Database: PostgreSQL with Drizzle ORM
├── Cloud Provider: Neon Database (serverless)
├── AI Services: Azure OpenAI (o3-mini model)
├── File Processing: XLSX for Excel imports
├── Session Management: PostgreSQL-backed sessions
└── Report Generation: HTML template engine
```

### Database Schema
- **Clients**: Comprehensive KYC/IP profiles with risk assessment
- **Portfolios**: Real-time portfolio values and performance metrics
- **Asset Allocations**: Detailed investment distribution tracking
- **Performance History**: Time-series portfolio performance data
- **Chat Messages**: AI conversation history and context
- **Market Insights**: CIO research and market commentary
- **Investment Glossary**: Multi-language investment terminology

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database (or Neon serverless)
- Azure OpenAI account with o3-mini model access

### Environment Setup
Create a `.env` file with the following configuration:

```bash
# Database Configuration
DATABASE_URL="your_postgresql_connection_string"

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT="https://your-endpoint.openai.azure.com"
AZURE_OPENAI_KEY="your_azure_openai_api_key"
AZURE_OPENAI_DEPLOYMENT="o3-mini"
AZURE_OPENAI_API_VERSION="2025-01-01-preview"

# Development
NODE_ENV="development"
```

### Installation & Setup

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd ai-investor-profile-solution
npm install
```

2. **Database Migration**
```bash
npm run db:push
```

3. **Import Sample Data** (Optional)
```bash
npm run import:data
```

4. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production application |
| `npm run start` | Start production server |
| `npm run db:push` | Apply database schema changes |
| `npm run db:studio` | Open Drizzle Studio for database management |
| `npm run import:excel` | Import client data from Excel files |
| `npm run import:csv` | Import client data from CSV files |

## 🎯 Core Functionality

### Client Management
- **Profile Creation**: Comprehensive KYC/IP data collection
- **Risk Assessment**: Automated risk tolerance evaluation
- **Portfolio Tracking**: Real-time portfolio monitoring
- **Performance Analysis**: Historical performance tracking

### AI Investment Assistant
- **Natural Language Processing**: Conversational investment guidance
- **Contextual Recommendations**: Personalized advice based on client profiles
- **Portfolio Analysis**: AI-powered portfolio optimization suggestions
- **Market Insights**: Integration with UBS research and market data

### Reporting & Analytics
- **Portfolio Reports**: Professional HTML reports with UBS branding
- **Performance Charts**: Interactive visualization of portfolio performance
- **Asset Allocation**: Detailed breakdown of investment distributions
- **Benchmark Comparison**: Performance vs. market indices

### Data Import & Export
- **Excel Integration**: Bulk client data import from Excel files
- **CSV Support**: Alternative CSV import functionality
- **Report Generation**: Downloadable portfolio reports
- **Data Validation**: Comprehensive input validation and error handling

## 🔧 Configuration

### Azure OpenAI Setup
The application requires Azure OpenAI with the o3-mini model:

1. Create an Azure OpenAI resource
2. Deploy the o3-mini model
3. Configure the endpoint and API key in environment variables
4. Note: o3-mini model doesn't support temperature parameter

### Database Configuration
Supports PostgreSQL with the following features:
- Drizzle ORM for type-safe database operations
- Connection pooling via Neon serverless
- Automatic schema migrations
- Session storage in PostgreSQL

### Internationalization
Built-in support for multiple languages:
- English (default)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)
- Chinese (zh)
- Japanese (ja)

## 🎨 UI/UX Features

### Design System
- **UBS Brand Colors**: Authentic UBS red (#e60028) with professional gray palette
- **Typography**: Modern font stack with clear hierarchy
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle depth with modern shadow system

### Interactive Components
- **Hover Effects**: Smooth transitions on interactive elements
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages and recovery options
- **Tooltips**: Contextual help for investment terminology

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablet screens
- **Desktop Enhancement**: Rich desktop experience with sidebar navigation
- **Touch-Friendly**: Large touch targets for mobile interaction

## 🔒 Security & Privacy

### Data Protection
- **Client Confidentiality**: Secure handling of sensitive financial data
- **Session Management**: Secure session storage and management
- **Input Validation**: Comprehensive server-side validation
- **Error Handling**: Secure error messages without data exposure

### API Security
- **Rate Limiting**: Protection against API abuse
- **Request Validation**: Zod schema validation for all inputs
- **Error Boundaries**: Graceful error handling and recovery
- **CORS Configuration**: Secure cross-origin resource sharing

## 📊 Data Model

### Client Entity
```typescript
interface Client {
  id: number;
  clientId: string;
  name: string;
  riskTolerance: string;
  investmentHorizon: number;
  investmentExperience: string;
  freeAssetRatio: string;
  investmentObjective: string;
}
```

### Portfolio Entity
```typescript
interface Portfolio {
  id: number;
  clientId: number;
  totalValue: string;
  ytdReturn: string;
  volatility: string;
  lastUpdated: Date;
}
```

### Asset Allocation Entity
```typescript
interface AssetAllocation {
  id: number;
  portfolioId: number;
  assetType: string;
  allocation: string;
  value: string;
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all production environment variables are configured:
- Database connection string
- Azure OpenAI credentials
- Session secrets
- CORS origins

### Replit Deployment
The application is optimized for Replit deployment:
1. Configure environment variables in Replit Secrets
2. Use the provided `Start application` workflow
3. Access via the generated `.replit.app` domain

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode requirements
2. Use Prettier for code formatting
3. Write comprehensive error handling
4. Include JSDoc comments for complex functions
5. Test with multiple client scenarios

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Consistent code formatting
- **Naming**: Clear, descriptive variable and function names

## 📞 Support

### Technical Issues
- Check the console for error messages
- Verify environment variables are correctly configured
- Ensure database connectivity
- Validate Azure OpenAI configuration

### Feature Requests
- Document the business case
- Provide detailed requirements
- Consider impact on existing functionality
- Submit through appropriate channels

## 📄 License

This project is proprietary software developed for UBS Wealth Management. All rights reserved.

---

**Built with ❤️ for UBS Wealth Management**

*Empowering financial advisors with AI-driven insights and comprehensive portfolio management tools.*