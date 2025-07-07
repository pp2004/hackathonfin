import XLSX from 'xlsx';
import { db } from "./db";
import { 
  clients, 
  portfolios, 
  assetAllocations, 
  portfolioPerformance, 
  marketInsights, 
  investmentGlossary 
} from "@shared/schema";

async function importExcelData() {
  try {
    console.log("Reading Excel file...");
    const workbook = XLSX.readFile('./attached_assets/Hackathon_Data_without_CID_1751887751485.xlsx');
    const sheetNames = workbook.SheetNames;
    
    console.log("Available sheets:", sheetNames);
    
    // Read the 'Persona Portfolios' sheet which contains the client data
    const portfolioSheetName = sheetNames.find(name => name.toLowerCase().includes('persona')) || sheetNames[1];
    const worksheet = workbook.Sheets[portfolioSheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log("Sample row:", data[0]);
    console.log("Total rows:", data.length);
    
    // Clear existing data
    await db.delete(portfolioPerformance);
    await db.delete(assetAllocations);
    await db.delete(portfolios);
    await db.delete(clients);
    
    const insertedClients = [];
    const insertedPortfolios = [];
    
    for (const row of data as any[]) {
      try {
        // Map Excel columns to our schema
        const clientData = {
          clientId: row['Client ID'] || row['ClientID'] || `WM-${String(Math.random()).substr(2, 6)}`,
          name: row['Client Name'] || row['Name'] || `Client ${insertedClients.length + 1}`,
          riskTolerance: mapRiskTolerance(row['Risk Tolerance'] || row['RiskTolerance'] || 'Moderate'),
          investmentHorizon: parseInt(row['Investment Horizon'] || row['InvestmentHorizon'] || '5'),
          investmentExperience: mapInvestmentExperience(row['Investment Experience'] || row['InvestmentExperience'] || 'Moderate'),
          freeAssetRatio: String(parseFloat(row['Free Asset Ratio'] || row['FreeAssetRatio'] || '75')),
          investmentObjective: row['Investment Objective'] || row['InvestmentObjective'] || 'Growth'
        };
        
        const client = await db.insert(clients).values(clientData).returning();
        insertedClients.push(client[0]);
        
        // Create portfolio data
        const portfolioValue = parseFloat(row['Portfolio Value'] || row['PortfolioValue'] || (1000000 + Math.random() * 2000000));
        const ytdReturn = parseFloat(row['YTD Return'] || row['YTDReturn'] || (2 + Math.random() * 15));
        const volatility = parseFloat(row['Volatility'] || (8 + Math.random() * 10));
        
        const portfolioData = {
          clientId: client[0].id,
          totalValue: portfolioValue.toFixed(2),
          ytdReturn: ytdReturn.toFixed(2),
          volatility: volatility.toFixed(2)
        };
        
        const portfolio = await db.insert(portfolios).values(portfolioData).returning();
        insertedPortfolios.push(portfolio[0]);
        
        // Create asset allocations based on risk tolerance
        const allocations = generateAssetAllocations(clientData.riskTolerance, portfolioValue);
        
        for (const allocation of allocations) {
          await db.insert(assetAllocations).values({
            portfolioId: portfolio[0].id,
            assetType: allocation.assetType,
            allocation: allocation.percentage.toFixed(1),
            value: allocation.value.toFixed(2)
          });
        }
        
        // Generate performance data for the last 12 months
        const performanceData = generatePerformanceData(portfolio[0].id, portfolioValue);
        
        for (const perf of performanceData) {
          await db.insert(portfolioPerformance).values(perf);
        }
        
        console.log(`Imported client: ${clientData.name} (${clientData.clientId})`);
        
      } catch (error) {
        console.error("Error processing row:", error);
      }
    }
    
    // Add market insights and glossary terms
    await addMarketInsights();
    await addGlossaryTerms();
    
    console.log(`Successfully imported ${insertedClients.length} clients`);
    
  } catch (error) {
    console.error("Error importing Excel data:", error);
    throw error;
  }
}

function mapRiskTolerance(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes('conservative') || normalized.includes('low') || normalized.includes('cautious')) return 'Conservative';
  if (normalized.includes('aggressive') || normalized.includes('high') || normalized.includes('dynamic')) return 'Aggressive';
  return 'Moderate';
}

function mapInvestmentExperience(value: string): string {
  const normalized = value.toLowerCase();
  if (normalized.includes('beginner') || normalized.includes('novice') || normalized.includes('limited')) return 'Beginner';
  if (normalized.includes('experienced') || normalized.includes('expert') || normalized.includes('advanced')) return 'Experienced';
  return 'Moderate';
}

function generateAssetAllocations(riskTolerance: string, portfolioValue: number) {
  let allocations: { assetType: string; percentage: number; value: number }[] = [];
  
  switch (riskTolerance) {
    case 'Conservative':
      allocations = [
        { assetType: 'Fixed Income', percentage: 70, value: portfolioValue * 0.70 },
        { assetType: 'Equities', percentage: 20, value: portfolioValue * 0.20 },
        { assetType: 'Cash', percentage: 10, value: portfolioValue * 0.10 }
      ];
      break;
    case 'Aggressive':
      allocations = [
        { assetType: 'Equities', percentage: 80, value: portfolioValue * 0.80 },
        { assetType: 'Alternatives', percentage: 15, value: portfolioValue * 0.15 },
        { assetType: 'Fixed Income', percentage: 3, value: portfolioValue * 0.03 },
        { assetType: 'Cash', percentage: 2, value: portfolioValue * 0.02 }
      ];
      break;
    default: // Moderate
      allocations = [
        { assetType: 'Equities', percentage: 60, value: portfolioValue * 0.60 },
        { assetType: 'Fixed Income', percentage: 30, value: portfolioValue * 0.30 },
        { assetType: 'Alternatives', percentage: 8, value: portfolioValue * 0.08 },
        { assetType: 'Cash', percentage: 2, value: portfolioValue * 0.02 }
      ];
  }
  
  return allocations;
}

function generatePerformanceData(portfolioId: number, baseValue: number) {
  const data = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    const growthFactor = 1 + (0.08 / 12); // 8% annual growth
    const volatilityFactor = 1 + (Math.random() - 0.5) * 0.1; // ±5% monthly volatility
    
    const portfolioValue = baseValue * Math.pow(growthFactor, i) * volatilityFactor;
    const benchmarkValue = baseValue * Math.pow(1.06 / 12 + 1, i) * (1 + (Math.random() - 0.5) * 0.05);
    
    data.push({
      portfolioId,
      date,
      value: portfolioValue.toFixed(2),
      benchmarkValue: benchmarkValue.toFixed(2)
    });
  }
  
  return data;
}

async function addMarketInsights() {
  await db.insert(marketInsights).values([
    {
      title: "Fed Rate Decision Impact on Bond Markets",
      content: "The Federal Reserve's recent rate decision has created opportunities in intermediate-term corporate bonds. Duration risk remains manageable for portfolios with 3-7 year investment horizons.",
      category: "CIO Update",
      priority: "High"
    },
    {
      title: "Technology Sector Outlook: AI Revolution Continues",
      content: "Artificial intelligence adoption accelerates across industries, creating investment opportunities in infrastructure and software companies. Recommend selective exposure to large-cap tech with strong AI capabilities.",
      category: "Recommendation",
      priority: "Medium"
    },
    {
      title: "ESG Integration in Emerging Markets",
      content: "Sustainable investing practices gain traction in emerging markets. Companies with strong ESG profiles show better risk-adjusted returns and lower volatility.",
      category: "ESG",
      priority: "Medium"
    }
  ]);
}

async function addGlossaryTerms() {
  await db.insert(investmentGlossary).values([
    {
      term: "AUM",
      definition: "Assets Under Management - The total market value of investments managed by a financial institution or individual on behalf of clients.",
      category: "General",
      language: "en"
    },
    {
      term: "YTD Return",
      definition: "Year-to-Date Return - The percentage gain or loss of an investment from the beginning of the current year to the present date.",
      category: "Performance",
      language: "en"
    },
    {
      term: "Volatility",
      definition: "A statistical measure of the dispersion of returns for a given security or market index, indicating the level of risk associated with price changes.",
      category: "Risk",
      language: "en"
    },
    {
      term: "Free Asset Ratio",
      definition: "The percentage of investable assets that an investor can afford to lose without affecting their current lifestyle or financial obligations.",
      category: "Risk",
      language: "en"
    },
    {
      term: "Asset Allocation",
      definition: "An investment strategy that balances risk and reward by distributing portfolio assets among different asset classes like stocks, bonds, and cash.",
      category: "Strategy",
      language: "en"
    }
  ]);
}

// Run import if this file is executed directly
importExcelData().then(() => {
  console.log("Excel import completed");
  process.exit(0);
}).catch((error) => {
  console.error("Excel import failed:", error);
  process.exit(1);
});

export { importExcelData };