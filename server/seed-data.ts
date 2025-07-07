import { db } from "./db";
import { 
  clients, 
  portfolios, 
  assetAllocations, 
  portfolioPerformance, 
  marketInsights, 
  investmentGlossary 
} from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Insert sample clients
    const sampleClients = await db.insert(clients).values([
      {
        clientId: "WM-001",
        name: "John Anderson",
        riskTolerance: "Moderate",
        investmentHorizon: 7,
        investmentExperience: "Experienced",
        freeAssetRatio: "75.5",
        investmentObjective: "Growth"
      },
      {
        clientId: "WM-002", 
        name: "Sarah Chen",
        riskTolerance: "Conservative",
        investmentHorizon: 3,
        investmentExperience: "Beginner",
        freeAssetRatio: "85.0",
        investmentObjective: "Capital Preservation"
      },
      {
        clientId: "WM-003",
        name: "Michael Rodriguez",
        riskTolerance: "Aggressive",
        investmentHorizon: 15,
        investmentExperience: "Experienced",
        freeAssetRatio: "65.0",
        investmentObjective: "Maximum Growth"
      }
    ]).returning();

    // Insert portfolios
    const samplePortfolios = await db.insert(portfolios).values([
      {
        clientId: sampleClients[0].id,
        totalValue: "2500000.00",
        ytdReturn: "8.5",
        volatility: "12.3"
      },
      {
        clientId: sampleClients[1].id,
        totalValue: "1200000.00",
        ytdReturn: "4.2",
        volatility: "6.8"
      },
      {
        clientId: sampleClients[2].id,
        totalValue: "5000000.00",
        ytdReturn: "15.7",
        volatility: "18.2"
      }
    ]).returning();

    // Insert asset allocations
    await db.insert(assetAllocations).values([
      // John Anderson's portfolio
      { portfolioId: samplePortfolios[0].id, assetType: "Equities", allocation: "60.0", value: "1500000.00" },
      { portfolioId: samplePortfolios[0].id, assetType: "Fixed Income", allocation: "30.0", value: "750000.00" },
      { portfolioId: samplePortfolios[0].id, assetType: "Alternatives", allocation: "8.0", value: "200000.00" },
      { portfolioId: samplePortfolios[0].id, assetType: "Cash", allocation: "2.0", value: "50000.00" },
      
      // Sarah Chen's portfolio
      { portfolioId: samplePortfolios[1].id, assetType: "Fixed Income", allocation: "70.0", value: "840000.00" },
      { portfolioId: samplePortfolios[1].id, assetType: "Equities", allocation: "20.0", value: "240000.00" },
      { portfolioId: samplePortfolios[1].id, assetType: "Cash", allocation: "10.0", value: "120000.00" },
      
      // Michael Rodriguez's portfolio
      { portfolioId: samplePortfolios[2].id, assetType: "Equities", allocation: "80.0", value: "4000000.00" },
      { portfolioId: samplePortfolios[2].id, assetType: "Alternatives", allocation: "15.0", value: "750000.00" },
      { portfolioId: samplePortfolios[2].id, assetType: "Fixed Income", allocation: "3.0", value: "150000.00" },
      { portfolioId: samplePortfolios[2].id, assetType: "Cash", allocation: "2.0", value: "100000.00" }
    ]);

    // Insert portfolio performance data
    const performanceData = [];
    const startDate = new Date('2024-01-01');
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // John Anderson performance
      performanceData.push({
        portfolioId: samplePortfolios[0].id,
        date,
        value: (2300000 + (i * 15000) + Math.random() * 50000).toFixed(2),
        benchmarkValue: (2280000 + (i * 12000) + Math.random() * 30000).toFixed(2)
      });
      
      // Sarah Chen performance
      performanceData.push({
        portfolioId: samplePortfolios[1].id,
        date,
        value: (1150000 + (i * 4000) + Math.random() * 20000).toFixed(2),
        benchmarkValue: (1140000 + (i * 3500) + Math.random() * 15000).toFixed(2)
      });
      
      // Michael Rodriguez performance
      performanceData.push({
        portfolioId: samplePortfolios[2].id,
        date,
        value: (4300000 + (i * 58000) + Math.random() * 200000).toFixed(2),
        benchmarkValue: (4250000 + (i * 42000) + Math.random() * 150000).toFixed(2)
      });
    }
    
    await db.insert(portfolioPerformance).values(performanceData);

    // Insert market insights
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
      },
      {
        title: "Currency Hedging Strategies for Global Portfolios",
        content: "Dollar strength creates both opportunities and risks for international investments. Consider dynamic hedging strategies for portfolios with significant foreign exposure.",
        category: "CIO Update",
        priority: "High"
      }
    ]);

    // Insert investment glossary terms
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
      },
      {
        term: "Sharpe Ratio",
        definition: "A measure of risk-adjusted return that compares an investment's excess return to its standard deviation of return.",
        category: "Performance",
        language: "en"
      },
      {
        term: "Rebalancing",
        definition: "The process of adjusting portfolio weightings to maintain desired asset allocation targets by buying or selling assets.",
        category: "Strategy",
        language: "en"
      }
    ]);

    console.log("Database seeded successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase().then(() => {
    console.log("Seeding completed");
    process.exit(0);
  }).catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
}

export { seedDatabase };