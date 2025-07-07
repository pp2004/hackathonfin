import { readFileSync } from 'fs';
import XLSX from 'xlsx';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { 
  clients, 
  portfolios, 
  assetAllocations, 
  portfolioPerformance,
  type InsertClient,
  type InsertPortfolio,
  type InsertAssetAllocation,
  type InsertPortfolioPerformance
} from '@shared/schema';

export class HackathonExcelService {
  async importHackathonData(filePath: string): Promise<void> {
    console.log('Starting hackathon data import...');
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Import clients and portfolios
    await this.importClientPortfolios(workbook);
    
    // Import positions/asset allocations
    await this.importPositions(workbook);
    
    // Import IP (Investor Profile) data
    await this.importInvestorProfiles(workbook);
    
    // Generate synthetic performance data for each portfolio
    await this.generatePerformanceData();
    
    console.log('Hackathon data import completed successfully');
  }

  private async importClientPortfolios(workbook: XLSX.WorkBook): Promise<void> {
    const portfoliosSheet = workbook.Sheets['Persona Portfolios'];
    const data = XLSX.utils.sheet_to_json(portfoliosSheet, { header: 1 }) as any[][];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[1]) continue; // Skip empty rows
      
      const maskedId = row[1];
      const persona = (row[0] || '').toString().trim();
      const riskTolerance = row[2];
      const portfolioCCY = row[3];
      const portfolioRiskBreach = row[4];
      const portfolioVolatility = parseFloat(row[5] || '0');
      const saaPortfolioVol = parseFloat(row[6] || '0');
      const numPositions = parseInt(row[7] || '0');
      
      // Create client name from persona and masked ID
      const clientName = this.generateClientName(persona, maskedId);
      
      // Determine investment experience based on persona
      const investmentExperience = persona.includes('Established') ? 'High' : 'Medium';
      
      // Calculate approximate portfolio value (we'll refine this with positions data)
      const estimatedValue = this.estimatePortfolioValue(numPositions, portfolioCCY);
      
      // Create client record
      const clientData: InsertClient = {
        clientId: maskedId,
        name: clientName,
        riskTolerance: this.mapRiskTolerance(riskTolerance),
        investmentHorizon: this.getInvestmentHorizon(persona),
        investmentExperience,
        freeAssetRatio: this.calculateFreeAssetRatio(portfolioVolatility, saaPortfolioVol),
        investmentObjective: this.getInvestmentObjective(riskTolerance, persona)
      };

      // Insert client
      const [newClient] = await db.insert(clients).values(clientData).returning();
      
      // Create portfolio record
      const portfolioData: InsertPortfolio = {
        clientId: newClient.id,
        totalValue: estimatedValue.toFixed(2),
        ytdReturn: this.generateYTDReturn(portfolioVolatility).toFixed(2),
        volatility: (portfolioVolatility * 100).toFixed(1),
        lastUpdated: new Date()
      };

      await db.insert(portfolios).values(portfolioData);
      
      console.log(`Imported client: ${clientName} (${maskedId})`);
    }
  }

  private async importPositions(workbook: XLSX.WorkBook): Promise<void> {
    const positionsSheet = workbook.Sheets['Positions'];
    const data = XLSX.utils.sheet_to_json(positionsSheet, { header: 1 }) as any[][];
    
    // Group positions by client
    const clientPositions = new Map<string, any[]>();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[1]) continue; // Skip empty rows
      
      const maskedId = row[1];
      const positionType = row[2];
      const marketValue = parseFloat(row[4] || '0');
      const instrumentCcy = row[5];
      
      if (!clientPositions.has(maskedId)) {
        clientPositions.set(maskedId, []);
      }
      
      clientPositions.get(maskedId)!.push({
        positionType,
        marketValue,
        instrumentCcy
      });
    }

    // Process each client's positions and create asset allocations
    for (const [maskedId, positions] of clientPositions) {
      const client = await db.select().from(clients).where(eq(clients.clientId, maskedId)).limit(1);
      if (client.length === 0) continue;
      
      const portfolio = await db.select().from(portfolios).where(eq(portfolios.clientId, client[0].id)).limit(1);
      if (portfolio.length === 0) continue;
      
      // Calculate total portfolio value from positions
      const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
      
      // Update portfolio with actual total value
      await db.update(portfolios)
        .set({ totalValue: totalValue.toFixed(2) })
        .where(eq(portfolios.id, portfolio[0].id));
      
      // Generate asset allocations based on positions
      const allocations = this.generateAssetAllocations(positions, totalValue);
      
      for (const allocation of allocations) {
        const allocationData: InsertAssetAllocation = {
          portfolioId: portfolio[0].id,
          assetType: allocation.assetType,
          allocation: allocation.percentage.toFixed(1),
          value: allocation.value.toFixed(2)
        };
        
        await db.insert(assetAllocations).values(allocationData);
      }
    }
  }

  private async importInvestorProfiles(workbook: XLSX.WorkBook): Promise<void> {
    const ipSheet = workbook.Sheets['IP values '];
    const data = XLSX.utils.sheet_to_json(ipSheet, { header: 1 }) as any[][];
    
    // Process IP data to enhance client profiles
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[1]) continue; // Skip empty rows
      
      const maskedId = row[1];
      const mandateType = row[3];
      const ipStatus = row[4];
      const riskTolerance = row[26]; // Column 26 contains actual risk tolerance
      const portfolioCCY = row[27];
      const investmentHorizon = row[28];
      
      // Update client with IP information
      const updates: any = {};
      
      if (riskTolerance && typeof riskTolerance === 'string') {
        updates.riskTolerance = this.mapRiskTolerance(riskTolerance);
      }
      
      if (investmentHorizon && typeof investmentHorizon === 'string') {
        updates.investmentHorizon = this.parseInvestmentHorizon(investmentHorizon);
      }
      
      if (Object.keys(updates).length > 0) {
        await db.update(clients)
          .set(updates)
          .where(eq(clients.clientId, maskedId));
      }
    }
  }

  private async generatePerformanceData(): Promise<void> {
    const allPortfolios = await db.select().from(portfolios);
    
    for (const portfolio of allPortfolios) {
      const baseValue = parseFloat(portfolio.totalValue);
      const volatility = parseFloat(portfolio.volatility) / 100;
      
      // Generate 12 months of performance data
      const performanceData = this.generatePortfolioPerformance(baseValue, volatility);
      
      for (const performance of performanceData) {
        const performanceRecord: InsertPortfolioPerformance = {
          portfolioId: portfolio.id,
          date: performance.date,
          value: performance.value.toFixed(2),
          benchmarkValue: performance.benchmarkValue.toFixed(2)
        };
        
        await db.insert(portfolioPerformance).values(performanceRecord);
      }
    }
  }

  // Helper methods
  private generateClientName(persona: string, maskedId: string): string {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Amanda'];
    const lastNames = ['Anderson', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    // Use masked ID to consistently generate the same name
    const hash = maskedId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const firstName = firstNames[hash % firstNames.length];
    const lastName = lastNames[(hash + 5) % lastNames.length];
    
    const personaType = persona.includes('Established') ? 'Established' : 'Reactive';
    return `${firstName} ${lastName} (${personaType})`;
  }

  private mapRiskTolerance(riskCode: string): string {
    switch (riskCode) {
      case 'D': return 'Balanced';
      case 'F': return 'Equities';
      case 'A': return 'Conservative';
      case 'B': return 'Moderate Conservative';
      case 'C': return 'Moderate';
      case 'E': return 'Dynamic';
      case 'G': return 'Aggressive';
      default: return 'Balanced';
    }
  }

  private getInvestmentHorizon(persona: string): number {
    // Established investors typically have longer horizons
    return persona.includes('Established') ? 10 : 5;
  }

  private getInvestmentObjective(riskTolerance: string, persona: string): string {
    if (riskTolerance === 'F') return 'Growth';
    if (riskTolerance === 'D') return 'Balanced Growth';
    return 'Capital Preservation';
  }

  private calculateFreeAssetRatio(portfolioVol: number, saaVol: number): string {
    // Calculate how much the portfolio deviates from SAA
    const deviation = Math.abs(portfolioVol - saaVol) / saaVol;
    const freeAssetRatio = Math.min(20, deviation * 100); // Cap at 20%
    return freeAssetRatio.toFixed(1);
  }

  private estimatePortfolioValue(numPositions: number, currency: string): number {
    // Estimate based on number of positions and currency
    const baseValue = numPositions * 50000; // $50k per position on average
    const currencyMultiplier = currency === 'USD' ? 1 : currency === 'EUR' ? 0.9 : 0.8;
    return baseValue * currencyMultiplier;
  }

  private generateYTDReturn(volatility: number): number {
    // Generate YTD return based on volatility with some randomness
    const baseReturn = 0.08; // 8% base return
    const volatilityFactor = (Math.random() - 0.5) * volatility * 2;
    return (baseReturn + volatilityFactor) * 100;
  }

  private generateAssetAllocations(positions: any[], totalValue: number) {
    // Group positions by asset type
    const assetGroups = new Map<string, number>();
    
    positions.forEach(pos => {
      const assetType = this.mapPositionToAssetType(pos.positionType);
      const currentValue = assetGroups.get(assetType) || 0;
      assetGroups.set(assetType, currentValue + pos.marketValue);
    });

    // Convert to allocation format
    const allocations = [];
    for (const [assetType, value] of assetGroups) {
      allocations.push({
        assetType,
        value,
        percentage: (value / totalValue) * 100
      });
    }

    return allocations;
  }

  private mapPositionToAssetType(positionType: string): string {
    switch (positionType?.toUpperCase()) {
      case 'SEC': return 'Equities';
      case 'BOND': return 'Fixed Income';
      case 'FUND': return 'Funds';
      case 'ETF': return 'ETFs';
      case 'CASH': return 'Cash';
      case 'FX': return 'Foreign Exchange';
      default: return 'Alternatives';
    }
  }

  private parseInvestmentHorizon(horizon: string): number {
    if (horizon.includes('10')) return 10;
    if (horizon.includes('5')) return 5;
    if (horizon.includes('3')) return 3;
    if (horizon.includes('1')) return 1;
    return 5; // Default
  }

  private generatePortfolioPerformance(baseValue: number, volatility: number) {
    const performances = [];
    const startDate = new Date('2024-01-01');
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const growthFactor = 1 + (0.08 / 12); // 8% annual growth
      const volatilityFactor = 1 + (Math.random() - 0.5) * volatility;
      
      const portfolioValue = baseValue * Math.pow(growthFactor, i) * volatilityFactor;
      const benchmarkValue = baseValue * Math.pow(1.06 / 12 + 1, i) * (1 + (Math.random() - 0.5) * 0.05);
      
      performances.push({
        date,
        value: portfolioValue,
        benchmarkValue
      });
    }
    
    return performances;
  }
}