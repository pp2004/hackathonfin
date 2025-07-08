# AI Investment Platform - Installation Guide

## Quick Start for Local Development

### Step 1: Extract the Project
Extract the `ai-investment-platform.zip` file to your desired location.

### Step 2: Install Prerequisites

#### Windows Users:
1. **Install Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
2. **Install Git**: Download from [git-scm.com](https://git-scm.com/)
3. **Install PostgreSQL 14+**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

#### macOS Users:
```bash
# Using Homebrew (recommended)
brew install node
brew install git
brew install postgresql

# Or download directly from official websites
```

### Step 3: Setup Database

#### Windows:
```cmd
# Start PostgreSQL service
net start postgresql-x64-14

# Create database (replace 'your_username' with your PostgreSQL username)
createdb -U your_username investment_platform
```

#### macOS:
```bash
# Start PostgreSQL service
brew services start postgresql

# Create database
createdb investment_platform
```

### Step 4: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   # Windows
   copy .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

2. Edit the `.env` file with your credentials:
   ```env
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/investment_platform"
   AZURE_OPENAI_ENDPOINT="https://your-instance.openai.azure.com/"
   AZURE_OPENAI_API_KEY="your-azure-openai-api-key"
   AZURE_OPENAI_DEPLOYMENT_NAME="o3-mini"
   MICROSOFT_TRANSLATOR_KEY="your-translator-api-key"
   MICROSOFT_TRANSLATOR_REGION="eastus"
   ```

### Step 5: Install Dependencies and Setup

```bash
# Install all dependencies
npm install

# Push database schema
npm run db:push

# Seed with sample data (47 clients)
npm run seed

# Start development server
npm run dev
```

### Step 6: Access the Application

Open your browser and navigate to: `http://localhost:5000`

You should see the UBS Investment Platform with 47 pre-loaded clients.

## API Keys Required

### Azure OpenAI Setup:
1. Create Azure OpenAI resource in Azure Portal
2. Deploy o3-mini model
3. Copy endpoint and API key to `.env`

### Microsoft Translator Setup:
1. Create Translator resource in Azure Portal
2. Copy API key and region to `.env`

## Troubleshooting

### Database Issues:
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -l` (should show investment_platform)

### Port Issues:
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS:
lsof -ti:5000 | xargs kill -9
```

### Environment Variables:
- Ensure `.env` file is in root directory
- Restart server after changing environment variables
- Check for typos in variable names

## Features Available

✅ 47 Pre-loaded client portfolios with realistic data
✅ AI chat powered by Azure OpenAI o3-mini
✅ Interactive portfolio milestones with emoji reactions
✅ Animated budget health traffic light system
✅ Gamified learning modules with challenges
✅ Investment journey timeline with achievement badges
✅ Multi-language translation system
✅ Real-time portfolio analytics and charts
✅ Transaction history management
✅ Advanced reporting capabilities

## Support

If you encounter any issues:
1. Check console logs for detailed error messages
2. Verify all environment variables are correct
3. Ensure database is accessible
4. Check API key validity

For additional help, refer to the main README.md file.