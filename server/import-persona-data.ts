import { readFileSync } from 'fs';
import { db } from './db';
import { clients, portfolios, assetAllocations, portfolioPerformance } from '@shared/schema';
import type { InsertClient, InsertPortfolio, InsertAssetAllocation, InsertPortfolioPerformance } from '@shared/schema';

async function importPersonaData() {
  try {
    console.log('Starting persona data import...');
    
    // Clear existing data
    await db.delete(portfolioPerformance);
    await db.delete(assetAllocations);
    await db.delete(portfolios);
    await db.delete(clients);
    
    // Read the Persona Portfolios CSV
    const csvData = readFileSync('../attached_assets/Persona Portfolios-Table 1_1751953618135.csv', 'utf-8');
    const lines = csvData.split('\n');
    
    // Skip header row and process data
    const rows = lines.slice(1).filter(line => line.trim()).map(line => {
      const parts = line.split(',');
      return parts.map(part => part.trim());
    });
    
    console.log(`Found ${rows.length} client records to import`);
    
    for (const row of rows) {
      if (!row[1]) continue; // Skip empty rows
      
      const [persona, maskedId, riskTolerance, portfolioCcy, portfolioRiskBreach, portfolioVol, saaVol, numPositions] = row;
      
      // Create client record
      const clientData: InsertClient = {
        clientId: maskedId,
        name: generateClientName(persona, maskedId),
        riskTolerance: mapRiskTolerance(riskTolerance),
        investmentHorizon: getInvestmentHorizon(persona),
        investmentExperience: persona === 'Reactive Investor' ? 'Intermediate' : 'Advanced',
        freeAssetRatio: calculateFreeAssetRatio(parseFloat(portfolioVol), parseFloat(saaVol)),
        investmentObjective: getInvestmentObjective(riskTolerance, persona)
      };
      
      const [client] = await db.insert(clients).values(clientData).returning();
      console.log(`Created client: ${client.clientId} - ${client.name}`);
      
      // Create portfolio record
      const portfolioValue = calculatePortfolioValue(parseInt(numPositions), portfolioCcy, riskTolerance);
      const ytdReturn = generateYTDReturn(parseFloat(portfolioVol));
      
      const portfolioData: InsertPortfolio = {
        clientId: client.id,
        totalValue: portfolioValue.toString(),
        ytdReturn: ytdReturn.toString(),
        volatility: portfolioVol.toString(),
        lastUpdated: new Date().toISOString()
      };
      
      const [portfolio] = await db.insert(portfolios).values(portfolioData).returning();
      
      // Generate asset allocations based on risk tolerance
      const allocations = generateAssetAllocations(riskTolerance, portfolioValue);
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
      const performanceData = generatePortfolioPerformance(portfolioValue, parseFloat(portfolioVol));
      for (const performance of performanceData) {
        const performanceRecord: InsertPortfolioPerformance = {
          portfolioId: portfolio.id,
          date: performance.date,
          value: performance.value.toString(),
          benchmarkValue: performance.benchmarkValue.toString()
        };
        await db.insert(portfolioPerformance).values(performanceRecord);
      }
    }
    
    console.log('Persona data import completed successfully!');
  } catch (error) {
    console.error('Error importing persona data:', error);
    throw error;
  }
}

function generateClientName(persona: string, maskedId: string): string {
  const personaType = persona === 'Reactive Investor' ? 'Reactive' : 'Established';
  const suffix = maskedId.slice(-4);
  return `${personaType} Client ${suffix}`;
}

function mapRiskTolerance(riskCode: string): string {
  switch (riskCode) {
    case 'D': return 'Balanced';
    case 'F': return 'Aggressive';
    default: return 'Moderate';
  }
}

function getInvestmentHorizon(persona: string): number {
  return persona === 'Reactive Investor' ? 3 : 7; // years
}

function getInvestmentObjective(riskTolerance: string, persona: string): string {
  if (riskTolerance === 'F') {
    return persona === 'Reactive Investor' ? 'Growth with volatility concerns' : 'Long-term growth';
  }
  return 'Balanced growth and income';
}

function calculateFreeAssetRatio(portfolioVol: number, saaVol: number): string {
  const ratio = Math.abs(portfolioVol - saaVol) / saaVol;
  return (ratio * 100).toFixed(1) + '%';
}

function calculatePortfolioValue(numPositions: number, currency: string, riskTolerance: string): number {
  const baseValue = numPositions * 50000; // Base calculation
  const riskMultiplier = riskTolerance === 'F' ? 1.5 : 1.0;
  const currencyMultiplier = currency === 'EUR' ? 0.9 : currency === 'SGD' ? 0.7 : 1.0;
  
  return Math.round(baseValue * riskMultiplier * currencyMultiplier);
}

function generateYTDReturn(volatility: number): number {
  // Generate realistic YTD return based on volatility
  const baseReturn = (Math.random() - 0.5) * 0.2; // -10% to +10%
  const volatilityFactor = volatility * (Math.random() - 0.5) * 2;
  return parseFloat((baseReturn + volatilityFactor).toFixed(4));
}

function generateAssetAllocations(riskTolerance: string, totalValue: number) {
  if (riskTolerance === 'F') {
    // Aggressive allocation
    return [
      { assetType: 'Equities', allocation: 70, value: totalValue * 0.7 },
      { assetType: 'Bonds', allocation: 15, value: totalValue * 0.15 },
      { assetType: 'Alternatives', allocation: 10, value: totalValue * 0.1 },
      { assetType: 'Cash', allocation: 5, value: totalValue * 0.05 }
    ];
  } else {
    // Balanced allocation
    return [
      { assetType: 'Equities', allocation: 50, value: totalValue * 0.5 },
      { assetType: 'Bonds', allocation: 33, value: totalValue * 0.33 },
      { assetType: 'Alternatives', allocation: 12, value: totalValue * 0.12 },
      { assetType: 'Cash', allocation: 5, value: totalValue * 0.05 }
    ];
  }
}

function generatePortfolioPerformance(baseValue: number, volatility: number) {
  const performance = [];
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                 '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
  
  let currentValue = baseValue;
  let benchmarkValue = baseValue;
  
  for (const month of months) {
    // Portfolio performance with volatility
    const monthlyReturn = (Math.random() - 0.5) * volatility * 0.1;
    currentValue *= (1 + monthlyReturn);
    
    // Benchmark performance (more stable)
    const benchmarkReturn = (Math.random() - 0.5) * 0.02;
    benchmarkValue *= (1 + benchmarkReturn);
    
    performance.push({
      date: month + '-01',
      value: Math.round(currentValue),
      benchmarkValue: Math.round(benchmarkValue)
    });
  }
  
  return performance;
}

// Run import if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importPersonaData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { importPersonaData };