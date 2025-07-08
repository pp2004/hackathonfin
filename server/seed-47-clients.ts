import { db } from './db';
import { clients, portfolios, assetAllocations, portfolioPerformance } from '@shared/schema';
import type { InsertClient, InsertPortfolio, InsertAssetAllocation, InsertPortfolioPerformance } from '@shared/schema';

// 47 masked client IDs from the Persona CSV
const personaData = [
  { maskedId: 'A7GBHDVRRZ8Y774A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 30 },
  { maskedId: 'ATPBHDVRR2ACLMKA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 30 },
  { maskedId: 'AUABHDVRR2A4Z5SA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 39 },
  { maskedId: 'AWKBHDVRR2DZTYYA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 36 },
  { maskedId: 'AXFBHDVSA5RUNKXA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 37 },
  { maskedId: 'A2WBHDVRR2FFKQNA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'AV3BHDVSZ9GSFLKA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 9 },
  { maskedId: 'BCTBHDVRR2BHW29A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'A3FBHDVSRGFTE49A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 9 },
  { maskedId: 'BANBHDVR42Z9NXZA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 7 },
  { maskedId: 'BRLBHDVRR2ER9ZNA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 11 },
  { maskedId: 'BNBBHDVRR2EZWL6A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 29 },
  { maskedId: 'AUJBHDVRR2C2TQUA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 18 },
  { maskedId: 'A3GBHDVS6BD6NEEA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 5 },
  { maskedId: 'AZXBHDVTZSRT5RHA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 11 },
  { maskedId: 'A6ZBHDVRR2DBNCMA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 28 },
  { maskedId: 'BAJBHDVRR2EWG2AA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 14 },
  { maskedId: 'A5MBHDVVE3M58U4A', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 20 },
  { maskedId: 'A8WBHDVVAM6GLWDA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'SGD', numPositions: 12 },
  { maskedId: 'A8ZBHDVTZEURRHQA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'BH5BHDVSR9576KXA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 7 },
  { maskedId: 'A2PBHDVRR2CQCENA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 16 },
  { maskedId: 'BJVBHDVRRZ8RA3TA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'USD', numPositions: 6 },
  { maskedId: 'BA4BHDVRR2J7JYPA', persona: 'Established Investor', riskTolerance: 'D', portfolioCcy: 'EUR', numPositions: 9 },
  { maskedId: 'BDUBHDVRR2FB9BEA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 62 },
  { maskedId: 'A4BBHDVR5RUT4PUA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 16 },
  { maskedId: 'A3FBHDVRR2FKRHHA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 22 },
  { maskedId: 'A4NBHDVRR2F5P8KA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 29 },
  { maskedId: 'A4UBHDVRR2FXXDSA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 15 },
  { maskedId: 'A76BHDVRR2FYH9EA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 26 },
  { maskedId: 'BKBBHDVRR2CD38CA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 31 },
  { maskedId: 'AZ2BHDVRR2C2DNYA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 35 },
  { maskedId: 'AZ4BHDVSHCDVPJMA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 38 },
  { maskedId: 'AW5BHDVS88K4TSNA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 18 },
  { maskedId: 'AYFBHDVSQYG9DN6A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 34 },
  { maskedId: 'A5NBHDVRR2D94D4A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 25 },
  { maskedId: 'A3XBHDVT653CGGDA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 19 },
  { maskedId: 'A62BHDVRR2EM3Y6A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 17 },
  { maskedId: 'AV3BHDVSPBDR2USA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 34 },
  { maskedId: 'A4XBHDVRR2GDW64A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'A4HBHDVRR2FMQXGA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'A6DBHDVVDUJT5G5A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 12 },
  { maskedId: 'AULBHDVRR2EP38MA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'A5VBHDVRR2EJAPZA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 10 },
  { maskedId: 'BH2BHDVRR2AZFH3A', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 14 },
  { maskedId: 'A2JBHDVRR2FK5VWA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 12 },
  { maskedId: 'BHHBHDVR6LEEXFZA', persona: 'Reactive Investor', riskTolerance: 'F', portfolioCcy: 'USD', numPositions: 12 }
];

async function seed47Clients() {
  try {
    console.log('Starting database seeding with 47 masked client IDs...');
    
    // Clear existing data
    await db.delete(portfolioPerformance);
    await db.delete(assetAllocations);
    await db.delete(portfolios);
    await db.delete(clients);
    
    console.log('Cleared existing data');
    
    for (const data of personaData) {
      // Create client record
      const clientData: InsertClient = {
        clientId: data.maskedId,
        name: generateClientName(data.persona, data.maskedId),
        riskTolerance: mapRiskTolerance(data.riskTolerance),
        investmentHorizon: getInvestmentHorizon(data.persona),
        investmentExperience: data.persona === 'Reactive Investor' ? 'Intermediate' : 'Advanced',
        freeAssetRatio: calculateFreeAssetRatio(),
        investmentObjective: getInvestmentObjective(data.riskTolerance, data.persona)
      };
      
      const [client] = await db.insert(clients).values(clientData).returning();
      
      // Create portfolio record
      const portfolioValue = calculatePortfolioValue(data.numPositions, data.portfolioCcy, data.riskTolerance);
      const ytdReturn = generateYTDReturn();
      
      const portfolioData: InsertPortfolio = {
        clientId: client.id,
        totalValue: portfolioValue.toString(),
        ytdReturn: ytdReturn.toString(),
        volatility: generateVolatility(data.riskTolerance).toString()
      };
      
      const [portfolio] = await db.insert(portfolios).values(portfolioData).returning();
      
      // Generate asset allocations
      const allocations = generateAssetAllocations(data.riskTolerance, portfolioValue);
      for (const allocation of allocations) {
        const allocationData: InsertAssetAllocation = {
          portfolioId: portfolio.id,
          assetType: allocation.assetType,
          allocation: allocation.allocation.toString(),
          value: allocation.value.toString()
        };
        await db.insert(assetAllocations).values(allocationData);
      }
      
      // Generate performance data
      const performanceData = generatePortfolioPerformance(portfolioValue);
      for (const performance of performanceData) {
        const performanceRecord: InsertPortfolioPerformance = {
          portfolioId: portfolio.id,
          date: performance.date,
          value: performance.value.toString(),
          benchmarkValue: performance.benchmarkValue.toString()
        };
        await db.insert(portfolioPerformance).values(performanceRecord);
      }
      
      console.log(`Created client: ${client.clientId} - ${client.name}`);
    }
    
    console.log('Successfully seeded 47 clients with full portfolio data!');
  } catch (error) {
    console.error('Error seeding clients:', error);
    throw error;
  }
}

function generateClientName(persona: string, maskedId: string): string {
  const personaType = persona === 'Reactive Investor' ? 'Reactive' : 'Established';
  const suffix = maskedId.slice(-4);
  return `${personaType} Client ${suffix}`;
}

function mapRiskTolerance(riskCode: string): string {
  return riskCode === 'D' ? 'Balanced' : 'Aggressive';
}

function getInvestmentHorizon(persona: string): number {
  return persona === 'Reactive Investor' ? 3 : 7;
}

function getInvestmentObjective(riskTolerance: string, persona: string): string {
  if (riskTolerance === 'F') {
    return persona === 'Reactive Investor' ? 'Growth with volatility concerns' : 'Long-term growth';
  }
  return 'Balanced growth and income';
}

function calculateFreeAssetRatio(): string {
  return (Math.random() * 15 + 5).toFixed(1);
}

function calculatePortfolioValue(numPositions: number, currency: string, riskTolerance: string): number {
  const baseValue = numPositions * 50000;
  const riskMultiplier = riskTolerance === 'F' ? 1.5 : 1.0;
  const currencyMultiplier = currency === 'EUR' ? 0.9 : currency === 'SGD' ? 0.7 : 1.0;
  
  return Math.round(baseValue * riskMultiplier * currencyMultiplier);
}

function generateYTDReturn(): number {
  return parseFloat((Math.random() * 0.3 - 0.1).toFixed(4)); // -10% to +20%
}

function generateVolatility(riskTolerance: string): number {
  const baseVol = riskTolerance === 'F' ? 0.25 : 0.08;
  return parseFloat((baseVol + (Math.random() - 0.5) * 0.05).toFixed(3));
}

function generateAssetAllocations(riskTolerance: string, totalValue: number) {
  if (riskTolerance === 'F') {
    return [
      { assetType: 'Equities', allocation: 70, value: totalValue * 0.7 },
      { assetType: 'Bonds', allocation: 15, value: totalValue * 0.15 },
      { assetType: 'Alternatives', allocation: 10, value: totalValue * 0.1 },
      { assetType: 'Cash', allocation: 5, value: totalValue * 0.05 }
    ];
  } else {
    return [
      { assetType: 'Equities', allocation: 50, value: totalValue * 0.5 },
      { assetType: 'Bonds', allocation: 33, value: totalValue * 0.33 },
      { assetType: 'Alternatives', allocation: 12, value: totalValue * 0.12 },
      { assetType: 'Cash', allocation: 5, value: totalValue * 0.05 }
    ];
  }
}

function generatePortfolioPerformance(baseValue: number) {
  const performance = [];
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                 '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
  
  let currentValue = baseValue;
  let benchmarkValue = baseValue;
  
  for (const month of months) {
    const monthlyReturn = (Math.random() - 0.5) * 0.06; // -3% to +3% monthly
    currentValue *= (1 + monthlyReturn);
    
    const benchmarkReturn = (Math.random() - 0.5) * 0.02; // -1% to +1% monthly
    benchmarkValue *= (1 + benchmarkReturn);
    
    performance.push({
      date: month + '-01',
      value: Math.round(currentValue),
      benchmarkValue: Math.round(benchmarkValue)
    });
  }
  
  return performance;
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed47Clients()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed47Clients };