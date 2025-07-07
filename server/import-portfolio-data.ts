import fs from 'fs';
import { db } from './db.js';
import { clients, portfolios, assetAllocations, portfolioPerformance } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function importCompletePortfolioData() {
  console.log('Starting comprehensive portfolio data import...');
  
  try {
    // Read Portfolio data CSV
    const portfolioCSV = fs.readFileSync('../attached_assets/Persona Portfolios-Table 1_1751890860178.csv', 'utf-8');
    const portfolioLines = portfolioCSV.trim().split('\n').slice(1); // Skip header
    
    console.log(`Found ${portfolioLines.length} portfolio records`);
    
    const portfoliosToInsert = [];
    
    for (let i = 0; i < portfolioLines.length; i++) {
      const columns = portfolioLines[i].split(',');
      const maskedId = columns[1];
      const portfolioVolatility = parseFloat(columns[5]);
      const numPositions = parseInt(columns[7]);
      const portfolioCCY = columns[3];
      const riskTolerance = columns[2];
      
      // Get client ID from database
      const clientResult = await db.select().from(clients).where(eq(clients.clientId, maskedId));
      if (clientResult.length === 0) {
        console.log(`Client not found: ${maskedId}`);
        continue;
      }
      
      const clientId = clientResult[0].id;
      
      // Calculate portfolio value based on positions and currency
      let portfolioValue = numPositions * 85000; // Base value per position
      portfolioValue *= portfolioCCY === 'USD' ? 1 : portfolioCCY === 'EUR' ? 0.92 : portfolioCCY === 'SGD' ? 0.74 : 0.8;
      portfolioValue *= riskTolerance === 'F' ? 1.8 : 1.0; // Higher value for equities risk
      
      // Generate YTD return based on volatility (realistic range)
      const baseReturn = portfolioVolatility * 100; // Convert to percentage
      const ytdReturn = baseReturn * (0.3 + Math.random() * 1.4); // 30-170% of volatility as return
      const returnSign = Math.random() > 0.3 ? '+' : '-'; // 70% positive returns
      
      const portfolioData = {
        clientId: clientId,
        totalValue: portfolioValue.toFixed(2),
        ytdReturn: returnSign + Math.abs(ytdReturn).toFixed(2) + '%',
        volatility: (portfolioVolatility * 100).toFixed(2) + '%',
        lastUpdated: new Date().toISOString()
      };
      
      portfoliosToInsert.push(portfolioData);
    }
    
    console.log('Inserting portfolios...');
    const insertedPortfolios = await db.insert(portfolios).values(portfoliosToInsert).returning();
    console.log(`✅ ${insertedPortfolios.length} portfolios created`);
    
    // Generate asset allocations
    console.log('Generating asset allocations...');
    const allocationsToInsert = [];
    
    for (const portfolio of insertedPortfolios) {
      const portfolioValue = parseFloat(portfolio.totalValue);
      const clientResult = await db.select().from(clients).where(eq(clients.id, portfolio.clientId));
      const isEquities = clientResult[0].riskTolerance === 'Equities';
      
      let allocations;
      if (isEquities) {
        allocations = [
          { portfolioId: portfolio.id, assetType: 'Equities', allocation: '75%', value: (portfolioValue * 0.75).toFixed(2) },
          { portfolioId: portfolio.id, assetType: 'Bonds', allocation: '15%', value: (portfolioValue * 0.15).toFixed(2) },
          { portfolioId: portfolio.id, assetType: 'Alternatives', allocation: '8%', value: (portfolioValue * 0.08).toFixed(2) },
          { portfolioId: portfolio.id, assetType: 'Cash', allocation: '2%', value: (portfolioValue * 0.02).toFixed(2) }
        ];
      } else {
        allocations = [
          { portfolioId: portfolio.id, assetType: 'Equities', allocation: '50%', value: (portfolioValue * 0.5).toFixed(2) },
          { portfolioId: portfolio.id, assetType: 'Bonds', allocation: '33%', value: (portfolioValue * 0.33).toFixed(2) },
          { portfolioId: portfolio.id, assetType: 'Alternatives', allocation: '12%', value: (portfolioValue * 0.12).toFixed(2) },
          { portfolioId: portfolio.id, assetType: 'Cash', allocation: '5%', value: (portfolioValue * 0.05).toFixed(2) }
        ];
      }
      
      allocationsToInsert.push(...allocations);
    }
    
    await db.insert(assetAllocations).values(allocationsToInsert);
    console.log(`✅ ${allocationsToInsert.length} asset allocations created`);
    
    // Generate 12 months of performance data
    console.log('Generating performance data...');
    const performanceData = [];
    
    for (const portfolio of insertedPortfolios) {
      const portfolioValue = parseFloat(portfolio.totalValue);
      const baseVolatility = Math.random() * 0.2 + 0.05; // 5-25% annual volatility
      
      for (let month = 0; month < 12; month++) {
        const date = new Date();
        date.setMonth(date.getMonth() - month);
        
        // Generate realistic performance with some trend
        const monthlyVolatility = baseVolatility / Math.sqrt(12); // Convert to monthly
        const randomReturn = (Math.random() - 0.5) * monthlyVolatility * 2;
        const trendReturn = 0.08 / 12; // 8% annual trend divided by 12 months
        
        const totalReturn = (trendReturn + randomReturn) * month;
        const value = portfolioValue * (1 + totalReturn);
        const benchmarkValue = portfolioValue * (1 + 0.08 * (month / 12)); // 8% annual benchmark
        
        performanceData.push({
          portfolioId: portfolio.id,
          date: date.toISOString().split('T')[0],
          value: Math.max(value, portfolioValue * 0.7).toFixed(2), // Minimum 70% of original value
          benchmarkValue: benchmarkValue.toFixed(2)
        });
      }
    }
    
    await db.insert(portfolioPerformance).values(performanceData);
    console.log(`✅ ${performanceData.length} performance records created`);
    
    console.log('🎉 Complete portfolio data import finished successfully!');
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

importCompletePortfolioData().catch(console.error);